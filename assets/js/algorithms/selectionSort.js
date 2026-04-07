import {state} from '../state.js';
import {swapBars} from '../animations.js';

/* Bubble Sort — O(n²) average/worst, O(n) best (already sorted).
 * Repeatedly compares adjacent elements and swaps if out of order.
 * The early-exit `swapped` flag ensures the best-case O(n) is preserved. */
export async function selectionSort() {
  for (let i = 0; i < state.values.length - 1; i++) {
    let min_idx = i;
      
    for (let j = i + 1; j < state.values.length; j++) {
      if (!state.running) return 0;  
      state.bars[j].classList.add('swapping');
      await sleep(delay);
      if (state.values[j] < state.values[min_idx]) {
        // Update min_idx if a smaller element is found
        min_idx = j;
      }
      state.bars[j].classList.remove('swapping');
    }
    [state.values[i], state.values[min_idx]] = [state.values[min_idx], state.values[i]];
    await swapBars(i, min_idx);
  }
}