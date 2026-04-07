import {elements, initControls} from './dom.js';
import {state} from './state.js';
import {markAllSorted} from './animations.js';

//Importing sorting algorithms
import {bogoSort} from './algorithms/bogoSort.js';
import {bubbleSort} from './algorithms/bubbleSort.js';
import {insertionSort} from './algorithms/insertionSort.js';
import {heapSort} from './algorithms/heapSort.js';
import {mergeSort} from './algorithms/mergeSort.js';
import {quickSort} from './algorithms/quickSort.js';
import {selectionSort} from './algorithms/selectionSort.js';
import {bucketSort} from './algorithms/bucketSort.js';
import {radixSort} from './algorithms/radixSort.js';
import {countSort} from './algorithms/countSort.js';


document.addEventListener('DOMContentLoaded', () => {
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
  console.log(state.running);
  const algo = document.getElementById('algorithms').value;
  const sortFn = algorithms[algo];
  if (!sortFn) { alert("Select an algorithm!"); return; }
  await sortFn();
  const t1 = performance.now();

  await markAllSorted(state.values.length);
  state.running = false;
  elements.timer.textContent = `Time Taken: ${((t1 - t0)/1000).toFixed(2)}s`;
}