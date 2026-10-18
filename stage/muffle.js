// SJ stops hearing the offboarding call. A low drone creeps in first, then the
// call voice loses its highs, the way hearing goes under shock. Cues opt in with
// `muffle`: true, or {from, fade, drone} in recording seconds to start partway
// through a line. The first cue without it cuts the drone dead and brings the
// voice straight back, so the silence is what snaps him out of it.
const OPEN = 20000, CLOSED = 900;
// Drone level relative to the Music slider, so muting the score mutes it too.
const DRONE = .8;
const VOICE_TC = .25, DRONE_IN = 2.5, DRONE_CUT = .03;

export function muffleAmount(c, voiceTime = 0) {
  const m = c?.muffle;
  if (!m) return 0;
  if (m === true) return 1;
  const from = m.from || 0;
  if (voiceTime < from) return 0;
  return m.fade > 0 ? Math.min(1, (voiceTime - from) / m.fade) : 1;
}
export function droneOn(c, voiceTime = 0) {
  const m = c?.muffle;
  if (!m) return false;
  if (m === true) return true;
  return voiceTime >= (m.drone ?? m.from ?? 0);
}
// Sweeps evenly by ear rather than by hertz.
export function cutoff(amount) { return OPEN * Math.pow(CLOSED / OPEN, amount); }
const approach = (current, target, dt, tc) => target + (current - target) * Math.exp(-dt / tc);

export class Muffle {
  constructor(voice, createContext = () => new AudioContext()) {
    this.voice = voice;
    this.createContext = createContext;
    this.ctx = null;
    this.failed = false;
    this.level = .08;
    this.cue = null;
    this.voiceAmount = 0;
    this.droneAmount = 0;
    this.at = null;
  }
  setVolume(value) { this.level = value; }

  // Built on first use, after a GO press, so the voice is never routed through a
  // context the browser has not allowed to play.
  setup() {
    if (this.ctx || this.failed) return !!this.ctx;
    try {
      const ctx = this.createContext();
      this.filter = ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.Q.value = .5;
      this.filter.frequency.value = OPEN;
      ctx.createMediaElementSource(this.voice).connect(this.filter).connect(ctx.destination);
      this.drone = ctx.createGain();
      this.drone.gain.value = 0;
      this.drone.connect(ctx.destination);
      // A low hum: two near-unison tones beat slowly, with a fifth above. Sawtooths
      // under a lowpass keep it dark but give it harmonics small speakers can play.
      const hum = ctx.createBiquadFilter();
      hum.type = 'lowpass';
      hum.frequency.value = 500;
      hum.Q.value = .7;
      hum.connect(this.drone);
      for (const [frequency, level] of [[73.4, .5], [73.9, .4], [110.2, .25]]) {
        const tone = ctx.createOscillator(), gain = ctx.createGain();
        tone.type = 'sawtooth';
        tone.frequency.value = frequency;
        gain.gain.value = level;
        tone.connect(gain).connect(hum);
        tone.start();
      }
      // Air handling: brown noise, low-passed.
      const length = ctx.sampleRate * 6, buffer = ctx.createBuffer(1, length, ctx.sampleRate), data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < length; i++) { last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; data[i] = last * 3.5; }
      const air = ctx.createBufferSource(), tone = ctx.createBiquadFilter(), gain = ctx.createGain();
      air.buffer = buffer;
      air.loop = true;
      tone.type = 'lowpass';
      tone.frequency.value = 320;
      gain.gain.value = .5;
      air.connect(tone).connect(gain).connect(this.drone);
      air.start();
      this.ctx = ctx;
    } catch {
      this.failed = true;
    }
    return !!this.ctx;
  }

  sync(c, voiceTime, running, now = performance.now() / 1000) {
    if (!this.ctx && !c?.muffle) return;
    if (!running) {
      this.at = null;
      if (this.ctx?.state === 'running') this.ctx.suspend();
      return;
    }
    if (!this.setup()) return;
    if (this.ctx.state !== 'running') this.ctx.resume();
    const amount = muffleAmount(c, voiceTime);
    // The narrator is not on the call.
    const voiceTarget = c?.speaker && c.speaker !== 'narrator' ? amount : 0;
    const dt = this.at == null ? 0 : Math.max(0, now - this.at);
    this.at = now;
    // A new line starts at its own setting, never mid-sweep from the last one.
    this.voiceAmount = c !== this.cue ? voiceTarget : approach(this.voiceAmount, voiceTarget, dt, VOICE_TC);
    const drone = droneOn(c, voiceTime) ? 1 : 0;
    this.droneAmount = approach(this.droneAmount, drone, dt, drone ? DRONE_IN : DRONE_CUT);
    this.cue = c;
    this.filter.frequency.value = cutoff(this.voiceAmount);
    this.drone.gain.value = this.droneAmount * this.level * DRONE;
  }
}
