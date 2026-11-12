import { state } from './state.js';

let audioCtx = null;

//Returns a single AudioContext instance
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

//Generates a tone whose pitch follows the letter's position in the alphabet (0-25)
export function playTone(letterValue, minHz = 620, maxHz = 1680) {
  if (!state.audioEnabled || state.volume <= 0) return;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const oscillator = ctx.createOscillator();
  const gainNode   = ctx.createGain();

  const frequency = minHz + (letterValue / 25) * (maxHz - minHz);
  oscillator.type = state.waveform ?? 'sine';
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  //Short fade-out to avoid clicks and pops between notes
  const duration = Math.max(state.delay / 1000, 0.06);
  gainNode.gain.setValueAtTime(Math.max(0.16 * state.volume, 0.0002), ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}
