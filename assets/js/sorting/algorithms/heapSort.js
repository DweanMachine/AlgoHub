import {state} from '../state.js';
import {swapBars} from '../animations.js';

//Heap Sort implementation
async function heapify(n, i) {
  if (!state.running) return 0;
  let largest = i;

  let l = 2 * i + 1; //left index
  let r = 2 * i + 2; //right index

  // If left child is larger than root
  if (l < n && state.values[l] > state.values[largest])
    largest = l;

  // If right child is larger than largest so far
  if (r < n && state.values[r] > state.values[largest])
    largest = r;

  // If largest is not root
  if (largest != i) {
    [state.values[i], state.values[largest]] = [state.values[largest], state.values[i]];
    await swapBars(i, largest);

    // Recursively heapify the affected sub-tree
    await heapify(n, largest);
  }
}

// Main function to do heap sort
export async function heapSort() {
  let n = state.values.length;

  // Build heap (rearrange vector)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    await heapify(n, i);
  
  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    if (!state.running) return 0;
    [state.values[0], state.values[i]] = [state.values[i], state.values[0]]; // Move current root to end
    await swapBars(0, i);
    await heapify(i, 0); // Call max heapify on the reduced heap
  }
}