import {state} from './state.js';

//Sleeps for a specified number of milliseconds
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Returns the bar element for a given index
export function getBar(i) {
  return document.getElementById('bar-' + i);
}

//Swaps the heights and labels of two bars without animating
function visualSwapBar(bar1, bar2) {
  const tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;

  const label1 = bar1.querySelector('.bar-label');
  const label2 = bar2.querySelector('.bar-label');
  if (label1 && label2) {
    const tempLabel = label1.textContent;
    label1.textContent = label2.textContent;
    label2.textContent = tempLabel;
  }
}

//Swaps the heights and labels of two bars (used by comparison sorts)
export async function swapBars(i, j) {
  const bar1 = getBar(i);
  const bar2 = getBar(j);
  if (!bar1 || !bar2) return;

  if (state.algo !== 'insert') {
    bar1.classList.add('swapping');
    bar2.classList.add('swapping');
  }

  visualSwapBar(bar1, bar2);
  await sleep(state.delay);

  bar1.classList.remove('swapping');
  bar2.classList.remove('swapping');
}

//Swaps the positions of two bars in the DOM (used by bucket & radix sort)
export async function swapBarElements(bar1, bar2) {
  bar1.classList.add('swapping');
  bar2.classList.add('swapping');

  const parent1 = bar1.parentNode;
  const parent2 = bar2.parentNode;
  const temp = bar2.nextSibling;

  parent1.insertBefore(bar2, bar1);
  parent2.insertBefore(bar1, temp);

  await sleep(state.delay);

  bar1.classList.remove('swapping');
  bar2.classList.remove('swapping');
}

//Updates the height and label of a single bar (used by non-comparison sorts)
export async function refreshBar(i) {
  const bar = getBar(i);
  if (!bar) return;

  bar.classList.add('swapping');
  bar.style.height = `${Math.max(state.values[i], 3)}%`;

  const label = bar.querySelector('.bar-label');
  await sleep(state.delay);
  if (label) label.textContent = state.values[i];

  bar.classList.remove('swapping');
}

//Marks all bars as sorted (green)
export async function markAllSorted(n) {
  for (let i = 0; i < n; i++) {
    const bar = getBar(i);
    if (bar) {
      bar.style.backgroundColor = 'green';
      await sleep(Math.ceil(state.delay / 3));
    }
  }
}