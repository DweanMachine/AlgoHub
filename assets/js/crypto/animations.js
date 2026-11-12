import { state } from './state.js';
import { playTone } from './audio.js';
import { setTile } from './dom.js';

//Sleeps for a specified number of milliseconds
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Highlights the tiles about to be encrypted/decrypted
export async function readTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add('reading');
    playTone(Number(tile.dataset.value));
  });
  await sleep(state.delay);
  tiles.forEach(tile => tile.classList.remove('reading'));
}

//Swaps each tile's letter for its transformed value, then marks it done (green)
export async function transformTiles(tiles, values) {
  tiles.forEach((tile, i) => {
    tile.classList.add('transforming');
    playTone(values[i]);
  });
  await sleep(state.delay);
  tiles.forEach((tile, i) => {
    setTile(tile, values[i]);
    tile.classList.remove('transforming');
    tile.classList.add('transformed');
  });
}
