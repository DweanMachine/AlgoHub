import {state} from '../state.js';
import {refreshBar} from '../animations.js';

export async function countSort() {
  if (state.values.length === 0) return [];

  const minVal = Math.min(...state.values);
  const maxVal = Math.max(...state.values);
  const countArray = new Array(maxVal - minVal + 1).fill(0);

  for (let v of state.values) {
    countArray[v - minVal]++;
  }

  for (let i = 1; i < countArray.length; i++) {
    countArray[i] += countArray[i - 1];
  }

  const output = new Array(state.values.length);
  for (let i = state.values.length - 1; i >= 0; i--) {
    if (!state.running) return;
    const v = state.values[i];
    output[countArray[v - minVal] - 1] = v;
    countArray[v - minVal]--;
    await refreshBar(i); 
    await refreshBar(countArray[v - minVal] + 1);
  }

  for (let i = 0; i < state.values.length; i++) {
    if (!state.running) return;
    state.values[i] = output[i];
    await refreshBar(i);
  }
}