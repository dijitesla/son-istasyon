// Son İstasyon v10.0 — Yumuşak, Rahatsız Etmeyen Modern Ses Motoru (Yağmur Sesi Kaldırıldı!)
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicOn = false; // Varsayılan sakin sessiz başlangıç; oyuncu isterse 🎵 ile yumuşak ambiyans açar
    this.musicTimer = null;
    this.chordStep = 0;
    this.lastPumpTick = 0;
    this.lastCashSound = 0;
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
    return this.muted;
  }

  toggleMusic() {
    this.musicOn = !this.musicOn;
    if (this.musicOn) {
      this.startChillMusic();
    } else if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    return this.musicOn;
  }

  vibrate(ms = 15) {
    try {
      if (navigator.vibrate && !this.muted) navigator.vibrate(ms);
    } catch (_) {}
  }

  // Eski çağrılarla uyumlu ama yağmur/cızırtı sesi TAMAMEN KALDIRILDI!
  startRainAmbience() {
    this.init();
    if (this.musicOn) this.startChillMusic();
  }

  startChillMusic() {
    this.init();
    if (!this.ctx || this.musicTimer || !this.musicOn) return;

    // 8 akorlu çok yumuşak, fısıltı düzeyinde sıcak elektrik piyano ambiyansı
    const chords = [
      [196.0, 246.94, 293.66, 369.99],
      [164.81, 196.0, 246.94, 293.66],
      [146.83, 185.0, 220.0, 261.63],
      [130.81, 164.81, 196.0, 246.94],
      [174.61, 220.0, 261.63, 329.63],
      [146.83, 174.61, 220.0, 261.63],
      [196.0, 246.94, 293.66, 349.23],
      [164.81, 207.65, 246.94, 293.66]
    ];

    const playChord = () => {
      if (this.muted || !this.musicOn || !this.ctx) return;
      const notes = chords[this.chordStep % chords.length];
      this.chordStep += 1;
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.009, now + idx * 0.08 + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 3.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + 3.5);
      });
    };

    playChord();
    this.musicTimer = setInterval(playChord, 3800);
  }

  // Yumuşak filtreli, kliksiz sıcak ses üretici (ASLA cızırtılı kare/testere dalgası yok!)
  softTone(freq, duration = 0.14, vol = 0.04, delay = 0, endFreq = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delay;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    }

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, now);

    // Yumuşak 10ms açılış + pürüzsüz sönüm (kulak yormaz!)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  tap() {
    this.softTone(420, 0.055, 0.028, 0, 340);
  }

  doorBell() {
    // Hoş, yumuşak iki notalı karşılama çanı
    this.softTone(523.25, 0.18, 0.036, 0);
    this.softTone(659.25, 0.24, 0.032, 0.11);
  }

  pumpTick(pitch = 320) {
    // Sadece 240ms arayla çok hafif yumuşak dolum tıklaması
    const now = Date.now();
    if (now - this.lastPumpTick < 240) return;
    this.lastPumpTick = now;
    const clamped = Math.min(480, Math.max(240, pitch * 0.75));
    this.softTone(clamped, 0.045, 0.016, 0, clamped * 1.08);
  }

  cashRegister() {
    // Çok sık üst üste çalmasını önle (280ms koruma) + yumuşak kalimba/marimba tınısı
    const now = Date.now();
    if (now - this.lastCashSound < 280) return;
    this.lastCashSound = now;
    this.softTone(587.33, 0.11, 0.035, 0);
    this.softTone(880.0, 0.18, 0.032, 0.075);
  }

  perfectHit() {
    this.vibrate(15);
    this.softTone(523.25, 0.12, 0.038, 0);
    this.softTone(659.25, 0.14, 0.038, 0.08);
    this.softTone(783.99, 0.24, 0.036, 0.16);
  }

  coffeeBrew() {
    this.softTone(310, 0.15, 0.028, 0, 420);
    this.softTone(460, 0.18, 0.026, 0.12, 540);
  }

  flashlightClick() {
    this.softTone(620, 0.045, 0.024, 0, 480);
  }

  dogBark() {
    this.softTone(290, 0.08, 0.036, 0, 210);
    this.softTone(320, 0.09, 0.034, 0.14, 220);
  }

  dogGrowl() {
    this.softTone(135, 0.22, 0.032, 0, 110);
  }

  burnFail() {
    // Rahatsız edici cızırtı yerine yumuşak tok ahşap uyarı sesi
    this.vibrate(25);
    this.softTone(220, 0.14, 0.042, 0, 165);
    this.softTone(165, 0.18, 0.038, 0.11, 130);
  }

  policeSiren() {
    // Kulağı tırmalamayan kısa ve yumuşak uzaktan siren geçişi
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.softTone(490, 0.26, 0.032, 0, 620);
    this.softTone(620, 0.28, 0.028, 0.26, 490);
  }
}

window.sfx = new SoundEngine();
