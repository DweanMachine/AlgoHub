import {state} from './state.js';
import {initControls, generateTiles, els } from './dom.js';
//import {resumeAudio} from './audio.js';
import {caesarCipher, hillCipher, affineCipher} from './ciphers/index.js';

const ciphers = {
  caesar:  () => caesarCipher(),
  affine:  () => affineCipher(),
  hill:    () => hillCipher(),
};

async function runCipher() {
  const chosen = document.getElementById('ciphers').value;
  const cipherFn = ciphers[chosen];
  if (!cipherFn) { alert('Select a cipher!'); return; }

  state.running = true;
  //resumeAudio();

  const t0 = performance.now();
  els.timer.textContent = 'Encrypting...';

  await cipherFn();

  const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
  els.timer.textContent = `Done: ${elapsed}s`;
  state.running = false;
}

document.addEventListener('DOMContentLoaded', () => {
  initControls(runCipher);
  generateTiles('HELLO');
});