import { state } from './state.js';
import { els, initControls, generateTiles, appendPadTile, readKeys, setStatus,
  setOutput, tileChar, updateInfo } from './dom.js';
import { ciphers } from './ciphers/index.js';
import { readTiles, transformTiles } from './animations.js';
import { initSettings } from '../settings.js';

const isDecrypting = () => state.mode === 'decrypt';

//Reads the key controls and returns { cipher, key }, or { cipher, error } if the key is invalid
function resolveCipher() {
  const cipher = ciphers[els.algorithms.value];
  if (!cipher) return { error: 'Select a cipher!' };

  readKeys();
  const { key, error } = cipher.readKey(state.keys, isDecrypting());
  return error ? { cipher, error } : { cipher, key };
}

//Resets the tiles to the current input and refreshes the info panel
function resetView() {
  generateTiles(els.input.value);

  const { cipher, key, error } = resolveCipher();
  if (!cipher) return;
  updateInfo(cipher, error ?? cipher.formula(key, isDecrypting()), Boolean(error));
}

async function runCipher() {
  if (state.running) return;

  const { cipher, key, error } = resolveCipher();
  if (error) { setStatus(error, true); return; }

  //Fresh tiles every run, which also cancels any run still in flight
  generateTiles(els.input.value);
  const tiles = [...els.tileContainer.children];
  const letters = tiles.filter(tile => tile.classList.contains('letter'));
  if (letters.length === 0) { setStatus('Type some letters first!', true); return; }

  //Block ciphers work on fixed-size groups, so pad with X when encrypting
  if (letters.length % cipher.blockSize !== 0 && isDecrypting()) {
    setStatus(`Ciphertext needs a multiple of ${cipher.blockSize} letters.`, true);
    return;
  }
  while (letters.length % cipher.blockSize !== 0) {
    const pad = appendPadTile();
    tiles.push(pad);
    letters.push(pad);
  }

  const runId = ++state.runId;
  state.running = true;
  setStatus(isDecrypting() ? 'Decrypting...' : 'Encrypting...');
  const t0 = performance.now();

  for (let i = 0; i < letters.length; i += cipher.blockSize) {
    const group = letters.slice(i, i + cipher.blockSize);
    const result = cipher.transform(group.map(tile => Number(tile.dataset.value)), key, isDecrypting(), i / cipher.blockSize);

    await readTiles(group);
    if (state.runId !== runId) return; //Cancelled while animating
    await transformTiles(group, result);
    if (state.runId !== runId) return;

    //Show the output for everything processed so far
    const lastIndex = tiles.indexOf(group[group.length - 1]);
    setOutput(tiles.slice(0, lastIndex + 1).map(tileChar).join(''));
  }

  setOutput(tiles.map(tileChar).join(''), true);
  els.tileContainer.classList.add('done');
  state.running = false;
  setStatus(`Time Taken: ${((performance.now() - t0) / 1000).toFixed(2)}s`);
}

document.addEventListener('DOMContentLoaded', () => {
  initSettings(state);
  initControls({ onRun: runCipher, onChange: resetView });
  resetView();
});
