import {state} from '../state.js';
import {swapBars} from '../animations.js';

export async function insertionSort() {
  const size = state.values.length;
  for (let i = 0; i < size; i++) {
    let key = state.values[i];
    let j = i - 1;
    while (j >= 0 && state.values[j] > key) {
      if (!state.running) return 0;
      [state.values[j+1], state.values[j]] = [state.values[j], state.values[j+1]];
      getBar(j).classList.add('swapping');
      await swapBars(j, j+1);
      getBar(j).classList.remove('swapping');
      j = j - 1;
    }
    state.values[j + 1] = key;
  }
}