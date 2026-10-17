// A score can continue over adjacent cues. Its cutoff uses the montage's
// media clock, so pausing or slow loading never turns it into a wall-clock timer.
export const DEFAULT_MUSIC_VOLUME = 0.08;
export function musicVolume(value = DEFAULT_MUSIC_VOLUME) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : DEFAULT_MUSIC_VOLUME;
}

export class BackgroundMusic {
  constructor(audio, onError = () => {}) {
    this.audio = audio;
    this.onError = onError;
    this.config = null;
    this.cut = false;
    this.pending = false;
    this.positions = new Map();
    this.scoreVolume = DEFAULT_MUSIC_VOLUME;
    this.sourceVolume = 1;
    this.fadeStart = null;
    audio.preload = 'auto';
    audio.loop = true;
    audio.onerror = () => onError();
  }

  enter(config, continuous = false) {
    if (!config?.src) { this.stop(); return; }
    const carry = continuous && config.id === this.config?.id && config.src === this.config?.src;
    if (!carry) {
      this.remember();
      this.pause();
      this.audio.src = config.src;
      this.audio.load();
      this.audio.currentTime = (config.resume ? this.positions.get(config.id) : null) ?? config.startAt ?? 0;
    }
    this.config = config;
    this.audio.loop = config.loop ?? true;
    this.fadeStart = config.fadeOut > 0 ? this.audio.currentTime : null;
    this.cut = false;
    this.applyVolume();
  }

  setVolume(value, sourceVolume = this.sourceVolume) {
    this.scoreVolume = musicVolume(value);
    this.sourceVolume = musicVolume(sourceVolume);
    this.applyVolume();
  }
  applyVolume() {
    const level = this.config?.source === 'computer'
      ? musicVolume(this.sourceVolume * (this.config.level ?? .55)) : this.scoreVolume;
    const fade = this.fadeStart == null ? 1
      : musicVolume(1 - (this.audio.currentTime - this.fadeStart) / this.config.fadeOut);
    this.audio.volume = level * fade;
  }
  remember() {
    if (this.config && !this.config.resume) this.positions.set(this.config.id, this.audio.currentTime);
  }
  pause() { this.audio.pause(); }
  stop() {
    this.remember();
    this.pause();
    this.config = null;
    this.fadeStart = null;
    this.cut = false;
    this.audio.removeAttribute('src');
    this.audio.load();
  }

  sync(cueTime, running) {
    if (!this.config) return false;
    const fadeFinished = this.fadeStart != null && this.audio.currentTime - this.fadeStart >= this.config.fadeOut;
    const justCut = !this.cut && ((this.config.cutAt != null && cueTime >= this.config.cutAt)
      || fadeFinished || (!this.audio.loop && this.audio.ended));
    if (justCut) this.cut = true;
    this.applyVolume();
    if (!running || this.cut || cueTime < (this.config.startAfter || 0)) { this.pause(); return justCut; }
    // Music stays at its original speed even when the voices play faster.
    if (this.audio.paused && !this.pending) {
      this.pending = true;
      this.audio.play().catch(e => {
        if (e.name !== 'AbortError') this.onError();
      }).finally(() => { this.pending = false; });
    }
    return false;
  }
}
