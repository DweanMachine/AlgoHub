import {state} from './state.js';

let audioCtx = null;

//Returns a single AudioContext instance
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

//Audio Control
export async function resumeAudio() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
}

//Waveform Control
const WAVEFORMS = ['sine', 'square', 'sawtooth', 'triangle'];

export function setWaveform(type) {
  if (WAVEFORMS.includes(type)) {
    state.waveform = type;
  }
}

//Generates tone
export function playTone(barHeight, minHz = 620, maxHz = 1680) {
  if (!state.audioEnabled) return;

  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode   = ctx.createGain();

  //Map bar height (0–100) to a frequency range
  const frequency = minHz + (barHeight / 100) * (maxHz - minHz);

  oscillator.type = state.waveform ?? 'sine';
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  //Short fade-out to avoid clicks and pops between notes
  const duration = Math.max(state.delay / 1000, 0.015);
  gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}