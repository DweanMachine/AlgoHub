import {elements, initControls, drawBars, setStatus, setControlsLocked} from './dom.js';
import {state} from './state.js';
import {markAllSorted} from './animations.js';
import {initSettings} from '../settings.js';

//Importing sorting algorithms
import {bogoSort, bubbleSort, insertionSort, heapSort, mergeSort,
  quickSort, selectionSort, bucketSort, radixSort, countSort} from './algorithms/index.js';

document.addEventListener('DOMContentLoaded', () => {
  initSettings(state);
  initControls(toggleSort, updateSortButton);
  updateSortButton();
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

//True from the moment a sort starts until it has completely finished. This includes the short
//moment after Stop (or new values) while the cancelled animation is still unwinding, so a new
//sort can never overlap an old one.
let busy = false;
let stopRequested = false;

//Keeps the button in step with what's happening: Sort / Stop / Stopping...
function updateSortButton() {
  const button = elements.sortButton;
  const running = busy && state.running;

  if (running) {
    button.textContent = 'Stop';
    button.disabled = false;
  } else if (busy) {
    button.textContent = 'Stopping...';
    button.disabled = true;
  } else {
    button.textContent = 'Sort';
    button.disabled = !algorithms[elements.algorithmSelect.value]; //Nothing to sort with yet
  }

  button.classList.toggle('stop', running);
  button.title = !busy && button.disabled ? 'Select an algorithm first' : '';
}

function toggleSort() {
  if (state.running) {
    stopSort();
  } else {
    startSort();
  }
}

function stopSort() {
  stopRequested = true;
  state.running = false; //Every algorithm checks this flag and unwinds
  updateSortButton();
}

async function startSort() {
  if (busy) { return; }

  const sortFn = algorithms[elements.algorithmSelect.value];
  if (!sortFn) {
    setStatus('Select an algorithm first!', true);
    updateSortButton();
    return;
  }

  busy = true;
  state.running = true;
  setControlsLocked(true);
  drawBars(); //Fresh bars, so a second sort doesn't start out green
  updateSortButton();
  setStatus('Sorting...');

  let finished = false; //True only if the sort ran to the end without being stopped
  const t0 = performance.now();
  try {
    await sortFn();
    const t1 = performance.now();

    if (state.running) { await markAllSorted(state.values.length); }

    finished = state.running;
    if (finished) {
      setStatus(`Time Taken: ${((t1 - t0) / 1000).toFixed(2)}s`);
    } else if (stopRequested) {
      setStatus('Stopped');
    } //Otherwise new values were generated, which already reset the status
  } catch (err) {
    console.error(err);
    setStatus('Something went wrong (see console)', true);
  } finally {
    if (!finished) { drawBars(); } //Bars can be mid-bucket or out of sync after a stop
    state.running = false;
    busy = false;
    stopRequested = false;
    setControlsLocked(false);
    updateSortButton();
  }
}
