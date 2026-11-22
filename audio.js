// Son İstasyon v2 — Gelişmiş Web Audio API Ses Motoru
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
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setTargetAtTime(this.muted ? 0 : 0.03, this.ctx.currentTime, 0.1);
    }
    return this.muted;
  }

  startRainAmbience() {
    this.init();
    if (!this.ctx || this.rainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const out = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.75;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = this.muted ? 0 : 0.03;

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);
    whiteNoise.start(0);
    this.rainNode = whiteNoise;
  }

  tone(freq, duration = 0.12, type = "sine", vol = 0.12, delay = 0) {
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
    this.tone(659.25, 0.22, "triangle", 0.13, 0);
    this.tone(523.25, 0.34, "triangle", 0.13, 0.16);
  }

  pumpTick(pitch = 320) {
    this.tone(pitch, 0.045, "square", 0.045, 0);
  }

  perfectHit() {
    this.tone(587.33, 0.1, "triangle", 0.13, 0);
    this.tone(880, 0.14, "triangle", 0.14, 0.08);
    this.tone(1174.66, 0.25, "triangle", 0.14, 0.17);
  }

  coffeeBrew() {
    this.tone(250, 0.15, "sine", 0.08, 0);
    this.tone(390, 0.18, "sine", 0.09, 0.14);
    this.tone(560, 0.24, "triangle", 0.11, 0.28);
  }

  toastStart() {
    this.tone(220, 0.09, "sawtooth", 0.08, 0);
    this.tone(310, 0.09, "triangle", 0.08, 0.06);
  }

  toastReady() {
    this.tone(880, 0.16, "triangle", 0.13, 0);
    this.tone(1174.66, 0.26, "triangle", 0.13, 0.1);
  }

  burnFail() {
    this.tone(160, 0.22, "sawtooth", 0.14, 0);
    this.tone(115, 0.3, "sawtooth", 0.14, 0.14);
  }

  waterGrab() {
    this.tone(480, 0.08, "sine", 0.11, 0);
    this.tone(740, 0.12, "sine", 0.1, 0.06);
  }

  uvToggle() {
    this.tone(420, 0.08, "sine", 0.08, 0);
    this.tone(680, 0.16, "sine", 0.07, 0.05);
  }

  keypadBeep(digit = 5) {
    this.tone(420 + digit * 38, 0.06, "sine", 0.09, 0);
  }

  pinUnlock() {
    this.tone(660, 0.1, "triangle", 0.12, 0);
    this.tone(990, 0.2, "triangle", 0.13, 0.09);
  }

  phoneBuzz() {
    this.tone(135, 0.16, "sawtooth", 0.1, 0);
    this.tone(135, 0.16, "sawtooth", 0.1, 0.22);
    this.tone(987.77, 0.15, "sine", 0.11, 0.44);
    this.tone(1318.5, 0.22, "sine", 0.11, 0.56);
  }

  cameraClick() {
    this.tone(1150, 0.045, "square", 0.06, 0);
    this.tone(820, 0.055, "square", 0.05, 0.045);
  }

  alarmBlast() {
    this.tone(880, 0.14, "square", 0.14, 0);
    this.tone(620, 0.14, "square", 0.14, 0.15);
    this.tone(880, 0.18, "square", 0.14, 0.3);
  }

  cashRegister() {
    this.tone(987.77, 0.11, "triangle", 0.14, 0);
    this.tone(1318.51, 0.3, "triangle", 0.15, 0.09);
  }

  lockDoor() {
    this.tone(140, 0.14, "square", 0.16, 0);
    this.tone(92, 0.22, "sawtooth", 0.17, 0.1);
  }

  policeSiren() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.linearRampToValueAtTime(920, now + 0.26);
    osc.frequency.linearRampToValueAtTime(620, now + 0.52);
    osc.frequency.linearRampToValueAtTime(920, now + 0.78);
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.9);
  }

  tap() {
    this.tone(540, 0.04, "sine", 0.06, 0);
  }
}

window.sfx = new SoundEngine();
