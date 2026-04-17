/* ============================================================
   SOUND SYSTEM - Web Audio API Sound Effects
   ============================================================ */

class SoundSystem {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  _playTone(freq, duration, type = 'sine', volume = 0.3, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) { /* ignore */ }
  }

  playMove() {
    this.init();
    this._playTone(800, 0.08, 'sine', 0.15);
    this._playTone(600, 0.06, 'sine', 0.1, 0.03);
  }

  playCapture() {
    this.init();
    this._playTone(300, 0.12, 'square', 0.15);
    this._playTone(200, 0.1, 'square', 0.12, 0.05);
  }

  playCheck() {
    this.init();
    this._playTone(880, 0.15, 'sine', 0.2);
    this._playTone(660, 0.15, 'sine', 0.15, 0.1);
  }

  playCheckmate() {
    this.init();
    [523, 659, 784, 1047].forEach((f, i) => {
      this._playTone(f, 0.3, 'sine', 0.2, i * 0.15);
    });
  }

  playError() {
    this.init();
    this._playTone(200, 0.2, 'square', 0.15);
    this._playTone(150, 0.3, 'square', 0.1, 0.15);
  }

  playSuccess() {
    this.init();
    this._playTone(523, 0.15, 'sine', 0.2);
    this._playTone(659, 0.15, 'sine', 0.2, 0.12);
    this._playTone(784, 0.25, 'sine', 0.2, 0.24);
  }

  playClick() {
    this.init();
    this._playTone(1000, 0.04, 'sine', 0.08);
  }

  playLevelUp() {
    this.init();
    [440, 554, 659, 880].forEach((f, i) => {
      this._playTone(f, 0.2, 'sine', 0.15, i * 0.12);
    });
  }
}

// Global sound instance
const Sound = new SoundSystem();
