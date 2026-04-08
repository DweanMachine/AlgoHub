import { state } from './state.js';

export const els = {
  tileContainer: document.getElementById('tile-container'),
  inputField:    document.getElementById('cipher-input'),
  outputField:   document.getElementById('cipher-output'),
  speedSlider:   document.getElementById('crypto-speed-slider'),
  timer:         document.getElementById('crypto-timer'),
};

//Renders the input string as individual letter tiles.
export function generateTiles(text) {
  els.tileContainer.replaceChildren();
  state.inputText = text.toUpperCase();

  for (let i = 0; i < state.inputText.length; i++) {
    const tile = document.createElement('div');
    tile.id = `tile-${i}`;
    tile.classList.add('tile');
    tile.textContent = state.inputText[i];
    tile.dataset.charCode = state.inputText[i].charCodeAt(0);
    els.tileContainer.appendChild(tile);
  }
}

export function adjustDelay() {
  state.delay = parseInt(els.speedSlider.value);
  document.getElementById('crypto-speed-label').textContent = `Delay: ${state.delay} ms`;
}

export function initControls(onRunCipher) {
  adjustDelay();

  els.speedSlider.addEventListener('input', adjustDelay);

  els.inputField.addEventListener('input', () => {
    generateTiles(els.inputField.value);
  });

  document.getElementById('btn-run-cipher').addEventListener('click', () => {
    onRunCipher();
  });
}