// Web Audio API Synthesizer for AegisMine CAS

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

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
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // 1. Engine Ignition & Boot Sequence Chime
  public playEngineStartup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub-bass engine rumble ramp up
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();

    bassOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(40, now);
    bassOsc.frequency.exponentialRampToValueAtTime(160, now + 1.2);
    bassOsc.frequency.exponentialRampToValueAtTime(75, now + 2.0);

    bassGain.gain.setValueAtTime(0.01, now);
    bassGain.gain.linearRampToValueAtTime(0.4, now + 0.8);
    bassGain.gain.exponentialRampToValueAtTime(0.15, now + 2.0);

    // High-tech system boot synth chime (arpeggio tone)
    const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major 7th chord chime
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteOsc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      noteOsc.type = 'sine';
      noteOsc.frequency.setValueAtTime(freq, now + 0.6 + idx * 0.1);

      noteGain.gain.setValueAtTime(0, now + 0.6 + idx * 0.1);
      noteGain.gain.linearRampToValueAtTime(0.2, now + 0.65 + idx * 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2 + idx * 0.1);

      noteOsc.connect(noteGain);
      noteGain.connect(this.ctx.destination);

      noteOsc.start(now + 0.6 + idx * 0.1);
      noteOsc.stop(now + 1.5 + idx * 0.1);
    });

    bassOsc.connect(bassGain);
    bassGain.connect(this.ctx.destination);

    bassOsc.start(now);
    bassOsc.stop(now + 2.1);
  }

  // 2. Diagnostic Sonar Ping
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

  // 3. Proximity Warning Pulsing Beep (Zone 2)
  public playProximityBeep(distance: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pitch scales inversely with distance (closer = higher pitch: 600Hz to 1200Hz)
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

  // 4. Emergency Brake Strobe Alarm (Zone 1 - EMESRT Level 9)
  public playEmergencyAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Dual alternating siren notes
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
