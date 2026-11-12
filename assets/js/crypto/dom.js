import { state } from './state.js';

const A_CODE = 65;

//reference to important DOM elements
export const els = {
  input:         document.getElementById('cipher-input'),
  tileContainer: document.getElementById('tile-container'),
  output:        document.getElementById('cipher-output'),
  timer:         document.getElementById('timer'),
  algorithms:    document.getElementById('algorithms'),
  runButton:     document.getElementById('chosen-cipher'),
  modeButton:    document.getElementById('btn-mode'),
  swapButton:    document.getElementById('btn-swap'),
  speedSlider:   document.getElementById('speed-slider'),
  shiftSlider:   document.getElementById('caesar-shift-slider'),
  affineA:       document.getElementById('affine-a-slider'),
  affineB:       document.getElementById('affine-b-slider'),
  vigenereKey:   document.getElementById('vigenere-key'),
  hillCells:     ['hill-00', 'hill-01', 'hill-10', 'hill-11'].map(id => document.getElementById(id)),
};

//Builds a single tile. Letters get a number underneath (A = 0 ... Z = 25)
function makeTile(char) {
  const tile = document.createElement('div');
  tile.classList.add('tile');

  const letter = document.createElement('span');
  letter.classList.add('tile-letter');
  letter.textContent = char;
  tile.appendChild(letter);

  if (/[A-Z]/.test(char)) {
    const value = char.charCodeAt(0) - A_CODE;
    tile.classList.add('letter');
    tile.dataset.value = value;

    const num = document.createElement('span');
    num.classList.add('tile-num');
    num.textContent = value;
    tile.appendChild(num);
  } else {
    //Spaces and punctuation pass through every cipher untouched
    tile.classList.add(char === ' ' ? 'space' : 'symbol');
  }
  return tile;
}

//Updates a letter tile to show a new value (0-25)
export function setTile(tile, value) {
  tile.dataset.value = value;
  tile.querySelector('.tile-letter').textContent = String.fromCharCode(A_CODE + value);
  tile.querySelector('.tile-num').textContent = value;
}

//Returns the character a tile is currently showing
export function tileChar(tile) {
  return tile.querySelector('.tile-letter').textContent;
}

//Renders the input string as individual tiles. Also cancels any run in progress
export function generateTiles(text) {
  state.runId++;
  state.running = false;
  state.inputText = text.toUpperCase();
  state.outputText = '';

  els.tileContainer.classList.remove('done');
  els.tileContainer.replaceChildren(...[...state.inputText].map(makeTile));

  setOutput('—');
  setStatus('Ready!');
}

//Adds a padding tile (X) so the message fits the cipher's block size
export function appendPadTile() {
  const tile = makeTile('X');
  tile.classList.add('pad');
  tile.title = 'Padding letter added so the message fits the cipher\'s block size';
  els.tileContainer.appendChild(tile);
  return tile;
}

//Shows the ciphertext/plaintext. Pass complete = true once a run has finished
export function setOutput(text, complete = false) {
  els.output.textContent = text;
  if (complete) state.outputText = text;
  els.swapButton.disabled = !state.outputText;
}

//Writes to the status line (same spot as the sorting timer)
export function setStatus(text, isError = false) {
  els.timer.textContent = text;
  els.timer.classList.toggle('error', isError);
}

//Adjusts the animation delay based on the speed slider value
export function adjustDelay() {
  state.delay = parseInt(els.speedSlider.value);
  document.getElementById('speed-label').textContent = `Delay: ${state.delay} ms`;
}

//Updates labels and button text for encrypt/decrypt mode
export function updateModeUI() {
  const decrypting = state.mode === 'decrypt';
  els.modeButton.textContent = `Mode: ${decrypting ? 'Decrypt' : 'Encrypt'}`;
  els.runButton.textContent = decrypting ? 'Decrypt' : 'Encrypt';
  document.getElementById('input-label').textContent = decrypting ? 'Ciphertext:' : 'Plaintext:';
  document.getElementById('output-label').textContent = decrypting ? 'Plaintext:' : 'Ciphertext:';
  els.input.placeholder = decrypting ? 'Type or paste ciphertext...' : 'Type your message...';
}

//Shows only the key controls for the selected cipher
export function updateKeyControls(cipherId) {
  for (const id of ['caesar', 'affine', 'hill', 'vigenere']) {
    document.getElementById(`${id}-controls`).classList.toggle('hidden', id !== cipherId);
  }
}

//Copies the key controls into state (and refreshes their labels)
export function readKeys() {
  const keys = state.keys;
  keys.caesarShift = parseInt(els.shiftSlider.value);
  keys.affineA = parseInt(els.affineA.value);
  keys.affineB = parseInt(els.affineB.value);
  keys.vigenereKey = els.vigenereKey.value;

  const [a, b, c, d] = els.hillCells.map(cell => (cell.value === '' ? NaN : Number(cell.value)));
  keys.hillMatrix = [[a, b], [c, d]];

  document.getElementById('caesar-shift-label').textContent = `Shift: ${keys.caesarShift}`;
  document.getElementById('affine-a-label').textContent = `a: ${keys.affineA}`;
  document.getElementById('affine-b-label').textContent = `b: ${keys.affineB}`;
}

//Fills the info panel under the tiles
export function updateInfo(cipher, formulaText, isError = false) {
  document.getElementById('info-name').textContent = cipher.name;
  document.getElementById('info-description').textContent = cipher.description;

  const formula = document.getElementById('info-formula');
  formula.textContent = formulaText;
  formula.classList.toggle('error', isError);
}

//Initializes event listeners for all controls
export function initControls({ onRun, onChange }) {
  adjustDelay();
  updateModeUI();
  updateKeyControls(els.algorithms.value);

  els.speedSlider.addEventListener('input', adjustDelay);

  //Anything that changes the setup puts the tiles back to the input
  els.input.addEventListener('input', onChange);
  els.algorithms.addEventListener('change', () => {
    updateKeyControls(els.algorithms.value);
    onChange();
  });
  [els.shiftSlider, els.affineA, els.affineB, els.vigenereKey, ...els.hillCells].forEach(el => {
    el.addEventListener('input', onChange);
  });

  els.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onRun();
  });

  els.runButton.addEventListener('click', onRun);

  els.modeButton.addEventListener('click', () => {
    state.mode = state.mode === 'encrypt' ? 'decrypt' : 'encrypt';
    updateModeUI();
    onChange();
  });

  //Moves the result into the input and flips the mode, ready to reverse it
  els.swapButton.addEventListener('click', () => {
    if (state.running || !state.outputText) return;
    els.input.value = state.outputText;
    state.mode = state.mode === 'encrypt' ? 'decrypt' : 'encrypt';
    updateModeUI();
    onChange();
  });
}
