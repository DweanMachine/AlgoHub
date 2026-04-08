import {state} from '../state.js';
import {swapBars} from '../animations.js';
import {sleep} from '../animations.js';

export async function selectionSort() {
  for (let i = 0; i < state.values.length - 1; i++) {
    let min_idx = i;
      
    for (let j = i + 1; j < state.values.length; j++) {
      if (!state.running) return 0;  
      // Highlight the bars being compared
      const bars = document.querySelectorAll('.bar');
      if (bars[j]) bars[j].classList.add('swapping');
      await sleep(state.delay);
      if (state.values[j] < state.values[min_idx]) {
        // Update min_idx if a smaller element is found
        min_idx = j;
      }
      if (bars[j]) bars[j].classList.remove('swapping');
    }
    [state.values[i], state.values[min_idx]] = [state.values[min_idx], state.values[i]];
    await swapBars(i, min_idx);
  }
}