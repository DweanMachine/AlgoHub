//Quick Sort implementation
import {state} from '../state.js';
import {swapBars} from '../animations.js';

export async function partition(low, high) {
    let pivot = state.values[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
      if (!state.running) return 0;  
      if (state.values[j] < pivot) {
          i++;
          [state.values[i], state.values[j]] = [state.values[j], state.values[i]];
          await swapBars(i, j);
      }
    }
    [state.values[i+1], state.values[high]] = [state.values[high], state.values[i+1]];
    await swapBars(i + 1, high);
    return i + 1;
}

// the QuickSort function implementation
export async function quickSort(low, high)
{
    if (low < high) {

        // pi is the partition return index of pivot
        let pi = await partition(low, high);

        // recursion calls for smaller elements
        // and greater or equals elements
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}