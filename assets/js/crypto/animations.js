import { state } from './state.js';
//import { playTone } from './audio.js';

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getTile(i) {
  return document.getElementById('tile-' + i);
}

//Highlights the input character.
export async function highlightTile(i) {
  const tile = getTile(i);
  if (!tile) return;

  tile.classList.add('reading');
  //playTone(tile.dataset.charCode, 200, 800);
  await sleep(state.delay);
  tile.classList.remove('reading');
}

//Updates a tile to show its transformed output character.
export async function transformTile(i, newChar) {
  const tile = getTile(i);
  if (!tile) return;

  tile.classList.add('transforming');
  //playTone(newChar.charCodeAt(0), 400, 1200);
  await sleep(state.delay);

  tile.textContent = newChar;
  tile.dataset.charCode = newChar.charCodeAt(0);
  tile.classList.remove('transforming');
  tile.classList.add('transformed');
}

//Resets all tiles back to unprocessed state.
export function resetTiles(n) {
  for (let i = 0; i < n; i++) {
    const tile = getTile(i);
    if (tile) {
      tile.classList.remove('reading', 'transforming', 'transformed');
    }
  }
}