// Son İstasyon v4.0 — Ses ve Titreşim Motoru (Web Audio API)
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
      this.rainGain.gain.setTargetAtTime(this.muted ? 0 : 0.026, this.ctx.currentTime, 0.1);
    }
    return this.muted;
  }

  vibrate(ms = 25) {
    try {
      if (navigator.vibrate && !this.muted) navigator.vibrate(ms);
    } catch (_) {}
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
    filter.frequency.value = 880;
    filter.Q.value = 0.75;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = this.muted ? 0 : 0.026;

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);
    whiteNoise.start(0);
    this.rainNode = whiteNoise;
  }

  tone(freq, duration = 0.12, type = "sine", vol = 0.11, delay = 0) {
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
    this.tone(659.25, 0.2, "triangle", 0.12, 0);
    this.tone(523.25, 0.3, "triangle", 0.12, 0.15);
  }

  dogBark() {
    // Sevimli havlama: Hav! Hav!
    this.tone(360, 0.09, "triangle", 0.14, 0);
    this.tone(240, 0.11, "sawtooth", 0.1, 0.05);
    this.tone(390, 0.09, "triangle", 0.14, 0.2);
    this.tone(260, 0.12, "sawtooth", 0.1, 0.25);
  }

  dogGrowl() {
    // Tehlike hırlaması: Grrrr...
    this.vibrate([30, 20, 40]);
    this.tone(88, 0.32, "sawtooth", 0.11, 0);
    this.tone(76, 0.35, "sawtooth", 0.12, 0.18);
  }

  landlineRing() {
    // Eski kablolu büfe telefonu zili: Zırrr-Zırrr!
    this.vibrate([50, 40, 50]);
    for (let i = 0; i < 5; i++) {
      this.tone(i % 2 === 0 ? 920 : 1120, 0.055, "square", 0.09, i * 0.06);
    }
    for (let i = 0; i < 5; i++) {
      this.tone(i % 2 === 0 ? 920 : 1120, 0.055, "square", 0.09, 0.42 + i * 0.06);
    }
  }

  flashlightClick() {
    this.tone(950, 0.04, "square", 0.07, 0);
    this.tone(1320, 0.05, "sine", 0.06, 0.035);
  }

  coinChange() {
    this.tone(1046.5, 0.08, "triangle", 0.11, 0);
    this.tone(1396.9, 0.1, "sine", 0.1, 0.05);
  }

  ledgerWrite() {
    this.tone(440, 0.06, "triangle", 0.09, 0);
    this.tone(554.37, 0.08, "triangle", 0.09, 0.07);
    this.tone(659.25, 0.14, "triangle", 0.1, 0.14);
  }

  pumpTick(pitch = 320) {
    this.tone(pitch, 0.04, "square", 0.04, 0);
  }

  perfectHit() {
    this.vibrate([20, 30, 40]);
    this.tone(587.33, 0.1, "triangle", 0.13, 0);
    this.tone(880, 0.14, "triangle", 0.14, 0.08);
    this.tone(1174.66, 0.24, "triangle", 0.14, 0.16);
  }

  coffeeBrew() {
    this.tone(260, 0.14, "sine", 0.08, 0);
    this.tone(410, 0.17, "sine", 0.09, 0.12);
    this.tone(590, 0.22, "triangle", 0.11, 0.25);
  }

  toastStart() {
    this.tone(220, 0.08, "sawtooth", 0.08, 0);
    this.tone(330, 0.09, "triangle", 0.08, 0.06);
  }

  toastReady() {
    this.vibrate(25);
    this.tone(880, 0.15, "triangle", 0.13, 0);
    this.tone(1174.66, 0.24, "triangle", 0.13, 0.09);
  }

  shelfGrab() {
    this.tone(510, 0.07, "sine", 0.1, 0);
    this.tone(760, 0.11, "triangle", 0.1, 0.06);
  }

  idCardSlide() {
    this.tone(380, 0.06, "triangle", 0.09, 0);
    this.tone(620, 0.08, "sine", 0.08, 0.05);
  }

  powerOutage() {
    this.vibrate([60, 40, 80]);
    this.tone(280, 0.15, "sawtooth", 0.15, 0);
    this.tone(140, 0.25, "sawtooth", 0.16, 0.12);
    this.tone(75, 0.35, "square", 0.14, 0.25);
  }

  powerRestore() {
    this.tone(220, 0.1, "sine", 0.1, 0);
    this.tone(440, 0.12, "triangle", 0.12, 0.08);
    this.tone(880, 0.24, "triangle", 0.13, 0.16);
  }

  burnFail() {
    this.vibrate(50);
    this.tone(160, 0.2, "sawtooth", 0.13, 0);
    this.tone(112, 0.28, "sawtooth", 0.13, 0.13);
  }

  uvToggle() {
    this.tone(420, 0.08, "sine", 0.08, 0);
    this.tone(690, 0.15, "sine", 0.07, 0.05);
  }

  keypadBeep(digit = 5) {
    this.tone(420 + digit * 36, 0.055, "sine", 0.085, 0);
  }

  pinUnlock() {
    this.vibrate(30);
    this.tone(660, 0.1, "triangle", 0.12, 0);
    this.tone(990, 0.2, "triangle", 0.13, 0.09);
  }

  phoneBuzz() {
    this.vibrate([40, 50, 40]);
    this.tone(135, 0.15, "sawtooth", 0.1, 0);
    this.tone(135, 0.15, "sawtooth", 0.1, 0.2);
    this.tone(987.77, 0.14, "sine", 0.11, 0.42);
    this.tone(1318.5, 0.2, "sine", 0.11, 0.53);
  }

  cameraClick() {
    this.tone(1150, 0.04, "square", 0.055, 0);
    this.tone(820, 0.05, "square", 0.05, 0.04);
  }

  alarmBlast() {
    this.vibrate([50, 30, 50]);
    this.tone(880, 0.13, "square", 0.13, 0);
    this.tone(620, 0.13, "square", 0.13, 0.14);
    this.tone(880, 0.17, "square", 0.13, 0.28);
  }

  cashRegister() {
    this.tone(987.77, 0.11, "triangle", 0.13, 0);
    this.tone(1318.51, 0.28, "triangle", 0.14, 0.09);
  }

  safeRoom() {
    this.tone(523.25, 0.12, "triangle", 0.12, 0);
    this.tone(659.25, 0.14, "triangle", 0.12, 0.1);
    this.tone(783.99, 0.24, "triangle", 0.13, 0.2);
  }

  lockDoor() {
    this.vibrate(35);
    this.tone(140, 0.13, "square", 0.15, 0);
    this.tone(92, 0.2, "sawtooth", 0.16, 0.1);
  }

  policeSiren() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.vibrate([40, 40, 60]);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.linearRampToValueAtTime(920, now + 0.25);
    osc.frequency.linearRampToValueAtTime(620, now + 0.5);
    osc.frequency.linearRampToValueAtTime(920, now + 0.75);
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.88);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.88);
  }

  tap() {
    this.tone(540, 0.038, "sine", 0.055, 0);
  }
}

window.sfx = new SoundEngine();
