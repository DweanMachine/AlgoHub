import {state} from '../state.js';
import {swapBars} from '../animations.js';

/* Bubble Sort — O(n²) average/worst, O(n) best (already sorted).
 * Repeatedly compares adjacent elements and swaps if out of order.
 * The early-exit `swapped` flag ensures the best-case O(n) is preserved. */
export async function bubbleSort() {
  const size = state.values.length;

  for (let i = 0; i < size - 1; i++) {
    let swapped = false;

    for (let j = 0; j < size - 1 - i; j++) {
      if (!state.running) return;

      if (state.values[j] > state.values[j + 1]) {
        [state.values[j], state.values[j + 1]] = [state.values[j + 1], state.values[j]];
        await swapBars(j, j + 1);
        swapped = true;
      }
    }

    if (!swapped) break;
  }
}