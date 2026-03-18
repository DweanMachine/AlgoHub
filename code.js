//List of values
let values = [];
let delay = 15;
let running = false;
const timer = document.getElementById("timer");

function adjustDelay() {
  delay = parseInt(document.getElementById('speed-slider').value);
  document.getElementById('speed-label').textContent = `Delay: ${delay} ms`
  return 201 - delay;
}


/* ── CREATE VALUES ─────────────────────────────── */
function generateValues(barCount) {
  const barContainer = document.getElementById("container");
  barContainer.replaceChildren();  

  const barLabel    = document.getElementById('bar-count-label');
  barLabel.textContent = "Bars: " + barCount;

  values = [];

  //Widths
  const containerWidth = barContainer.clientWidth || 1080;
  const barWidth = Math.max(4, Math.floor(containerWidth / barCount));
  for (let i = 0; i < barCount; i++) {
    const newDiv = document.createElement('div');
  
    random_val = getRandomInt(1,100);
    values.push(random_val);

    newDiv.id = 'bar-'+i;
    newDiv.classList.add('bar');
    newDiv.style.height = `${Math.max(3, random_val)}%`;
    newDiv.style.width = `${barWidth}px`;
    if (barCount < 80) { 
      const label = document.createElement('span');
      label.classList.add('bar-label');
      label.textContent = random_val;
      newDiv.appendChild(label);
    } else {
      newDiv.style.borderColor = `rgb(120, 120, 150)`;
      console.log(newDiv.style.borderColor);
    }

    barContainer.appendChild(newDiv);
  }
}

generateValues(3);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getBar(i) { return document.getElementById('bar-' + i); }

/* ── BUBBLE SORT ─────────────────────────────── */
async function bubbleSort() {
  const size = values.length;
  for (let i = 0; i < size - 1; i++) {
    let swapped = false;
    for (let j = 0; j < size - 1 - i; j++) {
      if (!running) return 0;
      getBar(j+1).classList.add('sorting');
      if (values[j] > values[j + 1]) {
        [values[j], values[j+1]] = [values[j+1], values[j]];
        await swapBars(j, j + 1);
        swapped = true;
      }
      getBar(j+1).classList.remove('sorting');
    }
    if (!swapped) break;
  }
}

/* ── INSERTION SORT ──────────────────────────── */
async function insertionSort() {
  const size = values.length;
  for (let i = 0; i < size; i++) {
    let key = values[i];
    let j = i - 1;
    while (j >= 0 && values[j] > key) {
      if (!running) return 0;

      values[j + 1] = values[j];
      getBar(j).classList.add('sorting');
      [values[j+1], values[j]] = [values[j], values[j+1]];
      await swapBars(j+1, j);
      getBar(j).classList.remove('sorting');
      j = j - 1;
    }
    values[j + 1] = key;
  }
}

async function selectionSort() {
  for (let i = 0; i < values.length - 1; i++) {
    let min_idx = i;
      
    for (let j = i + 1; j < values.length; j++) {
      if (!running) return 0;  
      if (values[j] < values[min_idx]) {
        // Update min_idx if a smaller element is found
        min_idx = j;
      }
    }
    [values[i], values[min_idx]] = [values[min_idx], values[i]];
    getBar(i).classList.add('sorting');
    getBar(min_idx).classList.add('sorting');
    await swapBars(i, min_idx);
    getBar(i).classList.remove('sorting');
    getBar(min_idx).classList.remove('sorting');
  }
}

/* ── MERGE SORT ──────────────────────────── */
async function merge(left, mid, right) {
    const leftSize = mid - left + 1;
    const rightSize = right - mid;

    // Create temp arrays
    const leftArr = new Array(leftSize);
    const rightArr = new Array(rightSize);

    // Copy data to temp arrays leftArr[] and rightArr[]
    for (let i = 0; i < leftSize; i++)
        leftArr[i] = values[left + i];
    for (let j = 0; j < rightSize; j++)
        rightArr[j] = values[mid + 1 + j];

    let i = 0, j = 0;
    let k = left;

    // Merge the temp arrays back into arr[left..right]
    while (i < leftSize && j < rightSize) {
      if (!running) return 0;
      if (leftArr[i] <= rightArr[j]) {
          values[k] = leftArr[i];
          i++;
      } else {
          values[k] = rightArr[j];
          j++;
      }
      k++;

      await refreshBar(k - 1);
    }

    // Copy the remaining elements of leftArr[], if there are any
    while (i < leftSize) {
        values[k] = leftArr[i++];
        await refreshBar(k++);
    }

    // Copy the remaining elements of rightArr[], if there are any
    while (j < rightSize) {
        values[k] = rightArr[j++];
        await refreshBar(k++);
    }
}

async function mergeSort(left, right) {
    if (left >= right)
        return;
    const mid = Math.floor(left + (right - left) / 2);

    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);
}

async function refreshBar(i) {
  const bar = getBar(i);
  if (!bar) return;

  bar.classList.add('sorting');
  bar.style.height = `${Math.max(values[i], 3)}%`;
  const label = bar.querySelector('.bar-label');
  await sleep(delay/3);
  if (label) label.textContent = values[i];
  bar.classList.remove('sorting');
}

/* ── QUICK SORT ──────────────────────────── */
async function partition(low, high)
{
    let pivot = values[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
      if (!running) return 0;  
      if (values[j] < pivot) {
          i++;
          [values[i], values[j]] = [values[j], values[i]];
          getBar(i).classList.add('sorting');
          getBar(j).classList.add('sorting');
          await swapBars(i, j);
          getBar(i).classList.remove('sorting');
          getBar(j).classList.remove('sorting');
      }
    }
    [values[i+1], values[high]] = [values[high], values[i+1]];
    getBar(i+1).classList.add('sorting');
    getBar(high).classList.add('sorting');
    await swapBars(i + 1, high);
    getBar(i+1).classList.remove('sorting');
    getBar(high).classList.remove('sorting');
    return i + 1;
}

// the QuickSort function implementation
async function quickSort(low, high)
{
    if (low < high) {

        // pi is the partition return index of pivot
        let pi = await partition(low, high);

        // recursion calls for smaller elements
        // and greater or equals elements
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
        console.log(values);
    }
}


/* ── RUN SORTS ──────────────────────────── */
async function runSort() {
  running = true;

  const algo = document.getElementById('algorithms').value;
  timer.textContent = "Sorting...";
  const t0 = performance.now();
  switch (algo) {
    case 'bubble':
      await bubbleSort(); break;
    case 'insert':
      await insertionSort(); break;
    case 'select':
      await selectionSort(); break;
    case 'merge':
      await mergeSort(0, values.length - 1); break;
    case 'quick':
      await quickSort(0, values.length - 1); break;
    default:
      alert("Please select a sorting algorithm!")
  }
  const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
  timer.textContent = "Time Taken: " + elapsed + "s";

  if (running) {
    await markAllSorted(values.length);
  }
}

async function markAllSorted(n) {
  for (let i = 0; i < n; i++) {
    const bar = getBar(i);
    bar.style.backgroundColor = 'green';
    await sleep(Math.ceil(delay/3));
  }
}

/* ── SWAP BARS ──────────────────────────── */
function visualSwapBar(bar1, bar2) {
  const tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;

  const label1 = bar1.querySelector('.bar-label'), label2 = bar2.querySelector('.bar-label');
  if (label1 && label2) {
    const tempLabel = label1.textContent;
    label1.textContent = label2.textContent;
    label2.textContent = tempLabel;
  }
}

async function swapBars(i, j) {
  const bar1 = getBar(i), bar2 = getBar(j);

  // swap heights + labels
  if (bar1 && bar2) {
    visualSwapBar(bar1, bar2);
  }

  await sleep(delay);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', () => {
  const bar_slider = document.getElementById('bar-slider');
  const speed_slider = document.getElementById('speed-slider');
  adjustDelay();

  bar_slider.addEventListener('change', () => {
    generateValues(bar_slider.value);
  });

  speed_slider.addEventListener('input', () => {
    adjustDelay();
  });

  document.getElementById('btn-generate').addEventListener('click', () => {
    generateValues(bar_slider.value);
    timer.textContent = "Ready!";
    running = false;
  });

  document.getElementById('chosen-sort').addEventListener('click', () => {
    runSort();
  });

  generateValues(bar_slider.value);
})