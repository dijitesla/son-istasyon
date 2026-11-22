// Son İstasyon — Web Audio API Ses Motoru (Harici ses dosyası gerektirmez)
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.rainNode = null;
    this.rainGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setTargetAtTime(this.muted ? 0 : 0.035, this.ctx.currentTime, 0.1);
    }
    return this.muted;
  }

  startRainAmbience() {
    this.init();
    if (!this.ctx || this.rainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 950;
    filter.Q.value = 0.7;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = this.muted ? 0 : 0.035;

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);
    whiteNoise.start(0);
    this.rainNode = whiteNoise;
  }

  tone(freq, duration = 0.12, type = 'sine', vol = 0.12, delay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  doorBell() {
    // Büfe kapı zili: Ding-Dong
    this.tone(659.25, 0.25, 'triangle', 0.14, 0);
    this.tone(523.25, 0.38, 'triangle', 0.14, 0.18);
  }

  coffeeBrew() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.tone(240, 0.18, 'sine', 0.08, 0);
    this.tone(360, 0.22, 'sine', 0.08, 0.16);
    this.tone(520, 0.25, 'triangle', 0.11, 0.34);
  }

  toastReady() {
    this.tone(880, 0.18, 'triangle', 0.14, 0);
    this.tone(1174.66, 0.28, 'triangle', 0.12, 0.1);
  }

  waterGrab() {
    this.tone(480, 0.09, 'sine', 0.12, 0);
    this.tone(720, 0.12, 'sine', 0.1, 0.07);
  }

  phoneBuzz() {
    // Tezgahta titreyen telefon: Bzzzt - Bzzzt
    this.tone(135, 0.18, 'sawtooth', 0.1, 0);
    this.tone(135, 0.18, 'sawtooth', 0.1, 0.24);
    this.tone(987.77, 0.16, 'sine', 0.12, 0.48);
    this.tone(1318.5, 0.22, 'sine', 0.12, 0.6);
  }

  cameraClick() {
    this.tone(1200, 0.05, 'square', 0.07, 0);
    this.tone(800, 0.06, 'square', 0.06, 0.05);
  }

  cashRegister() {
    this.tone(987.77, 0.12, 'triangle', 0.14, 0);
    this.tone(1318.51, 0.32, 'triangle', 0.16, 0.1);
  }

  lockDoor() {
    this.tone(140, 0.14, 'square', 0.16, 0);
    this.tone(95, 0.22, 'sawtooth', 0.18, 0.1);
  }

  policeSiren() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.linearRampToValueAtTime(920, now + 0.28);
    osc.frequency.linearRampToValueAtTime(620, now + 0.56);
    osc.frequency.linearRampToValueAtTime(920, now + 0.84);
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.95);
  }

  tap() {
    this.tone(540, 0.045, 'sine', 0.06, 0);
  }
}

window.sfx = new SoundEngine();
