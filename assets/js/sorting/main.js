import {elements, initControls} from './dom.js';
import {state} from './state.js';
import {markAllSorted} from './animations.js';
import {initSettings} from '../settings.js';

//Importing sorting algorithms
import {bogoSort, bubbleSort, insertionSort, heapSort, mergeSort, quickSort, selectionSort, bucketSort, radixSort, countSort} from './algorithms/index.js';

document.addEventListener('DOMContentLoaded', () => {
  initSettings(); //Ignored settings for now, will add back later
  initControls(runSort);
});

const algorithms = {
  bubble: () => bubbleSort(),
  merge:  () => mergeSort(0, state.values.length - 1),
  quick:  () => quickSort(0, state.values.length - 1),
  bogo:   () => bogoSort(),
  insert: () => insertionSort(),
  select: () => selectionSort(),
  heap:   () => heapSort(),
  bucket: () => bucketSort(),
  radix:  () => radixSort(),
  count:  () => countSort(),
};

async function runSort() {
  elements.timer.textContent = 'Sorting...';
  
  const t0 = performance.now();
  state.running = true;
  const algo = document.getElementById('algorithms').value;
  const sortFn = algorithms[algo];
  if (sortFn) { 
    await sortFn();
    const t1 = performance.now();
  }
  if (state.running) {
    await markAllSorted(state.values.length);
    elements.timer.textContent = `Time Taken: ${((t1 - t0)/1000).toFixed(2)}s`;
  } else {
    elements.timer.textContent = 'Ready!';
  }
  state.running = false;
}