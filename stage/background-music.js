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
    audio.preload = 'auto';
    audio.loop = true;
    audio.onerror = () => onError();
  }

  enter(config, continuous = false) {
    if (!config?.src) { this.stop(); return; }
    const carry = continuous && config.id === this.config?.id && config.src === this.config?.src;
    if (!carry) {
      this.pause();
      this.audio.src = config.src;
      this.audio.load();
      this.audio.currentTime = config.startAt || 0;
    }
    this.config = config;
    this.cut = false;
  }

  setVolume(value) { this.audio.volume = musicVolume(value); }
  pause() { this.audio.pause(); }
  stop() {
    this.pause();
    this.config = null;
    this.cut = false;
    this.audio.removeAttribute('src');
    this.audio.load();
  }

  sync(cueTime, running) {
    if (!this.config) return false;
    const justCut = !this.cut && this.config.cutAt != null && cueTime >= this.config.cutAt;
    if (justCut) this.cut = true;
    if (!running || this.cut) { this.pause(); return justCut; }
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
