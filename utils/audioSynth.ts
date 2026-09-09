// Web Audio API Realistic Mining Truck Audio Synthesizer for AegisMine CAS

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Heavy Diesel Engine Sound Nodes
  private isEngineRunning: boolean = false;
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private turboOsc: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private turboFilter: BiquadFilterNode | null = null;
  private mainEngineGain: GainNode | null = null;
  private turboGain: GainNode | null = null;

  private lastBrakeTime: number = 0;
  private lastBackupTime: number = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isEngineRunning) {
      this.stopEngineLoop();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isEngineRunning) {
      this.stopEngineLoop();
    }
    return this.isMuted;
  }

  // 1. Engine Ignition & Boot Sequence Chime
  public playEngineStartup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Heavy V16 Diesel Engine Crank & Rumble Ramp
    const crankOsc = this.ctx.createOscillator();
    const crankGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 1.2);
    filter.frequency.exponentialRampToValueAtTime(200, now + 2.0);

    crankOsc.type = 'sawtooth';
    crankOsc.frequency.setValueAtTime(25, now);
    crankOsc.frequency.linearRampToValueAtTime(90, now + 1.0);
    crankOsc.frequency.linearRampToValueAtTime(45, now + 2.0);

    crankGain.gain.setValueAtTime(0.01, now);
    crankGain.gain.linearRampToValueAtTime(0.5, now + 0.8);
    crankGain.gain.exponentialRampToValueAtTime(0.2, now + 2.0);

    crankOsc.connect(filter);
    filter.connect(crankGain);
    crankGain.connect(this.ctx.destination);

    crankOsc.start(now);
    crankOsc.stop(now + 2.1);

    // High-tech system boot synth chime (arpeggio tone)
    const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major 7th chord chime
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteOsc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      noteOsc.type = 'sine';
      noteOsc.frequency.setValueAtTime(freq, now + 0.6 + idx * 0.1);

      noteGain.gain.setValueAtTime(0, now + 0.6 + idx * 0.1);
      noteGain.gain.linearRampToValueAtTime(0.18, now + 0.65 + idx * 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2 + idx * 0.1);

      noteOsc.connect(noteGain);
      noteGain.connect(this.ctx.destination);

      noteOsc.start(now + 0.6 + idx * 0.1);
      noteOsc.stop(now + 1.5 + idx * 0.1);
    });
  }

  // 2. Start Continuous Real Heavy Diesel Engine Sound Loop
  public startEngineLoop() {
    if (this.isMuted || this.isEngineRunning) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub-bass Diesel Piston Chug Oscillator 1
    this.engineOsc1 = this.ctx.createOscillator();
    this.engineOsc1.type = 'sawtooth';
    this.engineOsc1.frequency.setValueAtTime(38, now); // Idle diesel 38Hz rumble

    // Diesel Clatter Knock Oscillator 2
    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc2.type = 'square';
    this.engineOsc2.frequency.setValueAtTime(76, now);

    // Turbocharger Whistle Oscillator (High-Frequency Sine)
    this.turboOsc = this.ctx.createOscillator();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.setValueAtTime(1400, now);

    // Filters & Gains
    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(180, now);

    this.turboFilter = this.ctx.createBiquadFilter();
    this.turboFilter.type = 'bandpass';
    this.turboFilter.frequency.setValueAtTime(2200, now);
    this.turboFilter.Q.setValueAtTime(4.0, now);

    this.mainEngineGain = this.ctx.createGain();
    this.mainEngineGain.gain.setValueAtTime(0.28, now);

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.setValueAtTime(0.02, now);

    // Connections
    this.engineOsc1.connect(this.engineFilter);
    this.engineOsc2.connect(this.engineFilter);
    this.engineFilter.connect(this.mainEngineGain);
    this.mainEngineGain.connect(this.ctx.destination);

    this.turboOsc.connect(this.turboFilter);
    this.turboFilter.connect(this.turboGain);
    this.turboGain.connect(this.ctx.destination);

    this.engineOsc1.start(now);
    this.engineOsc2.start(now);
    this.turboOsc.start(now);

    this.isEngineRunning = true;
  }

  // 3. Dynamic Real-time Sound Modulation (Speed, RPM, Accel, Brake, Reverse)
  public updateEngineSound(
    speed: number,
    rpm: number,
    isAccelerating: boolean = false,
    isBraking: boolean = false,
    gear: string = 'D'
  ) {
    if (this.isMuted) return;

    if (!this.isEngineRunning) {
      this.startEngineLoop();
    }

    if (!this.ctx || !this.engineOsc1 || !this.engineOsc2 || !this.turboOsc || !this.mainEngineGain || !this.turboGain || !this.engineFilter) {
      return;
    }

    const now = this.ctx.currentTime;
    const normalizedRpm = Math.max(850, Math.min(3500, rpm || 850)) / 3500;
    const normalizedSpeed = Math.max(0, Math.min(50, speed)) / 50;

    // Pitch Modulation (Diesel Piston Frequency)
    const baseFreq = 35 + normalizedRpm * 70 + (isAccelerating ? 15 : 0);
    this.engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.1);
    this.engineOsc2.frequency.setTargetAtTime(baseFreq * 2, now, 0.1);

    // Filter Cutoff (Engine Throttle Roar)
    const cutoff = 160 + normalizedRpm * 450 + (isAccelerating ? 250 : 0);
    this.engineFilter.frequency.setTargetAtTime(cutoff, now, 0.1);

    // Main Engine Volume
    const engineVol = 0.22 + normalizedRpm * 0.18 + (isAccelerating ? 0.1 : 0);
    this.mainEngineGain.gain.setTargetAtTime(engineVol, now, 0.1);

    // Turbocharger Whistle Modulation
    const turboFreq = 1400 + normalizedSpeed * 1600 + (isAccelerating ? 400 : 0);
    const turboVol = (isAccelerating || speed > 10) ? 0.08 + normalizedSpeed * 0.12 : 0.01;

    this.turboOsc.frequency.setTargetAtTime(turboFreq, now, 0.15);
    this.turboGain.gain.setTargetAtTime(turboVol, now, 0.15);

    // Air Brake Hiss Trigger when decelerating/braking
    if (isBraking && now - this.lastBrakeTime > 2.5) {
      this.playAirBrakeHiss();
      this.lastBrakeTime = now;
    }

    // Heavy Reverse Backup Alarm when gear is R
    if (gear === 'R' && now - this.lastBackupTime > 0.8) {
      this.playBackupBeep();
      this.lastBackupTime = now;
    }
  }

  // 4. Stop Continuous Engine Sound Loop
  public stopEngineLoop() {
    if (!this.isEngineRunning || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (this.mainEngineGain) this.mainEngineGain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      if (this.turboGain) this.turboGain.gain.linearRampToValueAtTime(0.001, now + 0.3);

      setTimeout(() => {
        if (this.engineOsc1) { this.engineOsc1.stop(); this.engineOsc1.disconnect(); }
        if (this.engineOsc2) { this.engineOsc2.stop(); this.engineOsc2.disconnect(); }
        if (this.turboOsc) { this.turboOsc.stop(); this.turboOsc.disconnect(); }
        this.engineOsc1 = null;
        this.engineOsc2 = null;
        this.turboOsc = null;
        this.isEngineRunning = false;
      }, 350);
    } catch (e) {
      this.isEngineRunning = false;
    }
  }

  // 5. Pneumatic Air Brake Hiss Sound (White Noise Pressure Discharge)
  public playAirBrakeHiss() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.35);
    filter.Q.setValueAtTime(2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.4);
  }

  // 6. Heavy Mining Truck Air Horn Sound
  public playTruckHorn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const hornOsc1 = this.ctx.createOscillator();
    const hornOsc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    hornOsc1.type = 'sawtooth';
    hornOsc2.type = 'sawtooth';

    hornOsc1.frequency.setValueAtTime(165, now); // Low F# note
    hornOsc2.frequency.setValueAtTime(208, now); // Low G# note

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    hornOsc1.connect(gain);
    hornOsc2.connect(gain);
    gain.connect(this.ctx.destination);

    hornOsc1.start(now);
    hornOsc2.start(now);
    hornOsc1.stop(now + 0.65);
    hornOsc2.stop(now + 0.65);
  }

  // 7. Heavy Mining Truck Reverse Backup Warning Beep (1100Hz Beeper)
  public playBackupBeep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1050, now);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // 8. Diagnostic Sonar Ping
  public playDiagnosticPing() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // 9. Proximity Warning Pulsing Beep (Zone 2)
  public playProximityBeep(distance: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const clampedDist = Math.max(2.0, Math.min(5.0, distance));
    const normalized = (5.0 - clampedDist) / 3.0; // 0 (far) to 1 (close)
    const freq = 600 + normalized * 600;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 10. Emergency Brake Strobe Alarm (Zone 1 - EMESRT Level 9)
  public playEmergencyAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';

    osc1.frequency.setValueAtTime(1400, now);
    osc1.frequency.setValueAtTime(900, now + 0.1);

    osc2.frequency.setValueAtTime(1800, now);
    osc2.frequency.setValueAtTime(1100, now + 0.1);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }
}

export const audioSynth = new AudioSynthesizer();
