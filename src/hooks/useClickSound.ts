import { useRef, useCallback } from 'react';

// Tweak these to dial in the character
const CLICK_PITCH        = 100;   // Hz — oscillator start frequency (80–120 range)
const CLICK_DECAY        = 0.050; // seconds — 50ms; both layers gone by here
const CLICK_ATTACK       = 0.001; // seconds — 1ms snap attack
const CLICK_OSC_GAIN     = 0.40;  // oscillator peak amplitude (0–1)
const CLICK_NOISE_GAIN   = 0.20;  // noise layer peak amplitude (0–1)
const CLICK_NOISE_CUTOFF = 200;   // Hz — lowpass cutoff for noise body layer
const CLICK_MASTER_GAIN  = 0.07;  // overall volume ceiling — keeps it subtle at any system volume

export function useClickSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const trigger = useCallback(() => {
    // AudioContext requires a prior user gesture — create it here, not on mount
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    const now    = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = CLICK_MASTER_GAIN;
    master.connect(ctx.destination);

    // ── Oscillator layer ─────────────────────────────────────────────────────
    // Sine at CLICK_PITCH with a fast pitch drop — the downward sweep gives
    // the transient its "thud" character without sustaining tonally
    const osc  = ctx.createOscillator();
    osc.type   = 'sine';
    osc.frequency.setValueAtTime(CLICK_PITCH, now);
    osc.frequency.exponentialRampToValueAtTime(CLICK_PITCH * 0.25, now + CLICK_DECAY);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.linearRampToValueAtTime(CLICK_OSC_GAIN, now + CLICK_ATTACK);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + CLICK_DECAY);

    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start(now);
    osc.stop(now + CLICK_DECAY + 0.005);

    // ── Noise layer ──────────────────────────────────────────────────────────
    // Lowpass-filtered white noise gives the thud density and body;
    // the cutoff keeps all energy below CLICK_NOISE_CUTOFF Hz
    const noiseCount  = Math.ceil(ctx.sampleRate * CLICK_DECAY);
    const noiseBuffer = ctx.createBuffer(1, noiseCount, ctx.sampleRate);
    const noiseData   = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseCount; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter           = ctx.createBiquadFilter();
    noiseFilter.type            = 'lowpass';
    noiseFilter.frequency.value = CLICK_NOISE_CUTOFF;
    noiseFilter.Q.value         = 0.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(CLICK_NOISE_GAIN, now + CLICK_ATTACK);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + CLICK_DECAY);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseSource.start(now);
    // BufferSource auto-stops when the buffer ends — no explicit stop needed
  }, []);

  return { trigger };
}
