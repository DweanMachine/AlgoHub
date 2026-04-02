//List of values
let values = [];
let delay = 15;
let running = false;
let algo = null;

//Algorithm specific variables
let radixExp = 2;
let bucketCount = 5;

//List of elements
const timer = document.getElementById("timer");
const barContainer = document.getElementById("container");

//Delay helper function
function adjustDelay() {
  delay = parseInt(document.getElementById('speed-slider').value);
  document.getElementById('speed-label').textContent = `Delay: ${delay} ms`
  return 201 - delay;
}


/* ── CREATE VALUES ─────────────────────────────── */
function generateValues(barCount) {
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
      if (values[j] > values[j + 1]) {
        [values[j], values[j+1]] = [values[j+1], values[j]];
        await swapBars(j, j + 1);
        swapped = true;
      }
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
      [values[j+1], values[j]] = [values[j], values[j+1]];
      getBar(j).classList.add('swapping');
      await swapBars(j, j+1);
      getBar(j).classList.remove('swapping');
      j = j - 1;
    }
    values[j + 1] = key;
  }
}

/* ── SELECTION SORT ──────────────────────────── */
async function selectionSort() {
  for (let i = 0; i < values.length - 1; i++) {
    let min_idx = i;
      
    for (let j = i + 1; j < values.length; j++) {
      if (!running) return 0;  
      getBar(j).classList.add('swapping');
      await sleep(delay);
      if (values[j] < values[min_idx]) {
        // Update min_idx if a smaller element is found
        min_idx = j;
      }
      getBar(j).classList.remove('swapping');
    }
    [values[i], values[min_idx]] = [values[min_idx], values[i]];
    await swapBars(i, min_idx);
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

  bar.classList.add('swapping');
  bar.style.height = `${Math.max(values[i], 3)}%`;
  const label = bar.querySelector('.bar-label');
  await sleep(delay);
  if (label) label.textContent = values[i];
  bar.classList.remove('swapping');
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
          await swapBars(i, j);
      }
    }
    [values[i+1], values[high]] = [values[high], values[i+1]];
    await swapBars(i + 1, high);
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
    }
}


/* ── BUCKET SORT ──────────────────────────── */

//Use insertion sort to sort each bucket
async function bucketInsertionSort(bucket) {
  const size = bucket.length
  for (let i = 1; i < size; i++) {
    let j = i;
    while (j > 0 && bucket[j - 1].value > bucket[j].value && running) {
      const bar1 = bucket[j].bar;
      const bar2 = bucket[j - 1].bar;
      [bucket[j], bucket[j - 1]] = [bucket[j - 1], bucket[j]];
      await swapBarElements(bar1, bar2);
      j = j - 1;
    }
  }
}

//Sorting logic
async function bucketSort() {
  await setUpBuckets(bucketCount);
  let buckets = Array.from({length: bucketCount}, () => []);

  // Snapshot everything BEFORE any DOM moves
  const snapshot = values.map((v, i) => ({value: v, bar: getBar(i)}));
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  //Fill buckets from snapshot
  for (let i = 0; i < snapshot.length; i++) {
    let bucket_index = Math.floor(((snapshot[i].value - minValue) / range) * bucketCount);
    bucket_index = Math.min(bucket_index, bucketCount - 1);
    buckets[bucket_index].push(snapshot[i]);
    document.getElementById(`bucket-${bucket_index}`).appendChild(snapshot[i].bar);
    
    if (!running) { return; }
    snapshot[i].bar.classList.add('swapping');
    await sleep(delay);
    snapshot[i].bar.classList.remove('swapping');
  }

  // Sort each bucket
  for (let i = 0; i < buckets.length; i++) {
    //buckets[i].sort((a, b) => a.value - b.value);
    await Promise.all(buckets.map(bucket => bucketInsertionSort(bucket)));
  }

  // Write back with animation
  let index = 0;
  for (let i = 0; i < buckets.length; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      if (!running) { return; }
      await refreshBar(index);
      values[index] = buckets[i][j].value;
      const bar = buckets[i][j].bar;
      bar.id = `bar-${index}`;
      barContainer.appendChild(bar);
      await refreshBar(index);
      index++;
    }
  }
}

//Create bucket elements
async function setUpBuckets(bucketCount) {
  const bucketContainer = document.getElementById('bucketContainer'); 
  bucketContainer.innerHTML = "";
  const containerWidth = bucketContainer.clientWidth;
  const bucketWidth = Math.floor(containerWidth / bucketCount);
  bucketContainer.style.border = '1px solid #ccc';
  bucketContainer.style.height = '85px';

  //Assign each bucket with CSS
  for (let i = 0; i < bucketCount; i++) {
    const newBucket = document.createElement('div');
    newBucket.classList.add('bucket');
    newBucket.id = `bucket-${i}`;
    newBucket.style.width = `${bucketWidth}px`;
    bucketContainer.appendChild(newBucket);
  }
}

/* ── RADIX SORT ──────────────────────────── */

async function getMax() {
  let max = values[0];
  for (let i = 1; i < values.length; i++) {
    if (!running) { return; }
    await refreshBar(i);
    if (values[i] > max) {
      max = values[i];
    }
  }
  return max;
}

const exp_slider = document.getElementById('radix-exp-slider');

async function heapCountSort(exp) {
  const base = Number(exp_slider.value);
  const length = values.length;
  let outputArr = Array(length); // output array
  let count = Array(base).fill(0);

  //Store count of occurrences in count[]
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(values[i] / exp) % base;
    count[digit]++;
  }

  for (let i = 1; i < base; i++) {
    count[i] += count[i - 1];
  }

  //Build the output array
  for (let i = length - 1; i >= 0; i--) {
    const digit = Math.floor(values[i] / exp) % base;
    outputArr[count[digit] - 1] = values[i];
    //await swapBars(count[digit] - 1, values[i]);
    count[digit]--;
  }

  return outputArr;
}

// The main function to that sorts arr[] using Radix Sort
async function radixSort() {
  const maxNumber = await getMax();

  for (let exp = 1; Math.floor(maxNumber / exp) > 0; exp *= exp_slider.value) {
    // Get the Count sort iteration
    const sortedIteration = await heapCountSort(exp);
    values = sortedIteration;
    for (let i = 0; i < values.length; i++) {
      await refreshBar(i);
      if (!running) {
        return;
      }
    }
  }
}

/* ── HEAP SORT ──────────────────────────── */
async function heapify(n, i) {
    let largest = i;

    let l = 2 * i + 1; //left index
    let r = 2 * i + 2; //right index

    // If left child is larger than root
    if (l < n && values[l] > values[largest])
        largest = l;

    // If right child is larger than largest so far
    if (r < n && values[r] > values[largest])
        largest = r;

    // If largest is not root
    if (largest != i) {
        [values[i], values[largest]] = [values[largest], values[i]];
        await swapBars(i, largest);

        // Recursively heapify the affected sub-tree
        await heapify(n, largest);
    }
}

// Main function to do heap sort
async function heapSort() {
    let n = values.length;

    // Build heap (rearrange vector)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
        await heapify(n, i);
    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        [values[0], values[i]] = [values[i], values[0]]; // Move current root to end
        await swapBars(0, i);
        await heapify(i, 0); // Call max heapify on the reduced heap
    }
}
/* ── BOGO/PERMUTATION SORT ──────────────── */

async function isSorted(){
  for(var i = 1; i < values.length; i++) {
    if (values[i] < values[i-1])
      return false;
  }
  return true;
}
    
// To generate permutation of the array
async function shuffle() {
  var i, j = values.length;
  for (i = 0; i < values.length; i++){
    var rand_index = Math.floor(Math.random() * values.length);
    
    [values[j-i-1], values[rand_index]] = [values[rand_index], values[j-i-1]];
    if (!running) {return;}
    await swapBars(j-i-1, rand_index);
  }
  console.log(values);
}
    
// Sorts array a[0..n-1] using Bogo sort
async function bogoSort() {
  // if array is not sorted then shuffle the array again
  while (!await isSorted() && running)
    await shuffle();
  return values;
}

/* ── COUNT SORT ───────────────── */

async function countSort() {
  if (values.length === 0) return [];

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const countArray = new Array(maxVal - minVal + 1).fill(0);

  for (let v of values) {
    countArray[v - minVal]++;
  }

  for (let i = 1; i < countArray.length; i++) {
    countArray[i] += countArray[i - 1];
  }

  const output = new Array(values.length);
  for (let i = values.length - 1; i >= 0; i--) {
    const v = values[i];
    output[countArray[v - minVal] - 1] = v;
    countArray[v - minVal]--;
    await refreshBar(i); 
    await refreshBar(countArray[v - minVal] + 1);
  }

  for (let i = 0; i < values.length; i++) {
    values[i] = output[i];
    await refreshBar(i);
  }
}

/* ── RUN SORTS ──────────────────────────── */
async function runSort() {
  running = true;

  algo = document.getElementById('algorithms').value;
  

  if (algo != 'radix') {
    document.getElementById('radix-slider-container').classList.add('hidden');
  } 
  if (algo != 'bucket') {
    barContainer.style.height = '420px';
    bucketContainer.innerHTML = "";
    document.getElementById('bucket-slider-container').classList.add('hidden');
  } 
  
  const t0 = performance.now();
  timer.textContent = "Sorting...";
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
    case 'bucket':
      await bucketSort(); break;
    case 'count':
      await countSort(); break;
    case 'radix':
      await radixSort(); break;
    case 'heap':
      await heapSort(); break;
    case 'bogo':
      await bogoSort(); break;
    default:
      alert("Please select a sorting algorithm!");
      timer.textContent = "Ready!";
      return;
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
    if (bar) {
      bar.style.backgroundColor = 'green';
      await sleep(Math.ceil(delay/3));
    }
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
  if (algo != 'insert') {
    bar1.classList.add('swapping');
    bar2.classList.add('swapping');
  }
  
  // swap heights + labels
  if (bar1 && bar2) {
    visualSwapBar(bar1, bar2);
  }

  await sleep(delay);
  bar1.classList.remove('swapping');
  bar2.classList.remove('swapping');
}



async function swapBarElements(bar1, bar2) {
  bar1.classList.add('swapping');
  bar2.classList.add('swapping');

  const parent1 = bar1.parentNode;
  const parent2 = bar2.parentNode;
  const temp = bar2.nextSibling; // save what's AFTER bar2

  parent1.insertBefore(bar2, bar1); // put bar2 where bar1 was
  parent2.insertBefore(bar1, temp); // put bar1 where bar2 was

  await sleep(delay);
  bar1.classList.remove('swapping');
  bar2.classList.remove('swapping');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', () => {
  const bar_slider = document.getElementById('bar-slider');
  const speed_slider = document.getElementById('speed-slider');
  const bucket_slider = document.getElementById('bucket-slider');
  adjustDelay();

  bar_slider.addEventListener('change', () => {
    generateValues(bar_slider.value);
  });

  speed_slider.addEventListener('input', () => {
    adjustDelay();
  });

  bucket_slider.addEventListener('input', () => {
    bucketCount = bucket_slider.value;
    document.getElementById('bucket-label').textContent = `Buckets: ${bucketCount}`;
    setUpBuckets(bucketCount);
  });

  exp_slider.addEventListener('input', () => {
    document.getElementById('radix-exp-label').textContent = `Exponent: ${exp_slider.value}`;
  });

  document.getElementById('btn-generate').addEventListener('click', () => {
    generateValues(bar_slider.value);
    timer.textContent = "Ready!";
    running = false;
  });

  document.getElementById('chosen-sort').addEventListener('click', () => {
    runSort();
  });

  document.getElementById('radix-sort').addEventListener('click', () => {
    document.getElementById('radix-slider-container').classList.remove('hidden');
  });

  document.getElementById('bucket-sort').addEventListener('click', () => {
    barContainer.style.height = '320px';
    document.getElementById('bucket-slider-container').classList.remove('hidden');
    setUpBuckets(5);
  });

  generateValues(bar_slider.value);
})