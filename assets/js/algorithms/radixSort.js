import {state} from '../state.js';
import {refreshBar} from '../animations.js';
import {elements} from '../dom.js';

async function getMax() {
  let max = state.values[0];
  for (let i = 1; i < state.values.length; i++) {
    if (!state.running) { return; }
    await refreshBar(i);
    if (state.values[i] > max) {
      max = state.values[i];
    }
  }
  return max;
}

async function heapCountSort(exp) {
  const base = Number(elements.expSlider.value);
  const length = state.values.length;
  let outputArr = Array(length); // output array
  let count = Array(base).fill(0);

  //Store count of occurrences in count[]
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(state.values[i] / exp) % base;
    count[digit]++;
  }

  for (let i = 1; i < base; i++) {
    count[i] += count[i - 1];
  }

  //Build the output array
  for (let i = length - 1; i >= 0; i--) {
    const digit = Math.floor(state.values[i] / exp) % base;
    outputArr[count[digit] - 1] = state.values[i];
    //await swapBars(count[digit] - 1, state.values[i]);
    count[digit]--;
  }

  return outputArr;
}

// The main function to that sorts arr[] using Radix Sort
export async function radixSort() {
  const maxNumber = await getMax();

  for (let exp = 1; Math.floor(maxNumber / exp) > 0; exp *= Number(elements.expSlider.value)) {
    // Get the Count sort iteration
    const sortedIteration = await heapCountSort(exp);
    state.values = sortedIteration;
    for (let i = 0; i < state.values.length; i++) {
      await refreshBar(i);
      if (!state.running) {
        return;
      }
    }
  }
}
