//List of values
let values = [];
let delay = 15;

function adjustDelay() {
  delay = parseInt(document.getElementById('speed-slider').value);
  document.getElementById('speed-label').textContent = `Delay: ${delay} ms`
  return 201 - delay;
}

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
    console.log(newDiv.style.width);
  
    const label = document.createElement('span');
    label.classList.add('bar-label');
    label.textContent = random_val;
    newDiv.appendChild(label);

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
      getBar(j+1).classList.add('sorting');
      //getBar(j+1).classList.remove('sorting');
      
      if (values[j] > values[j + 1]) {
        await swapBars(j, j + 1);
        swapped = true;
      }
      
      getBar(j+1).classList.remove('sorting');
      //getBar(j+1).classList.add('sorting');
    }
    if (!swapped) break;
  }
  markAllSorted(size);
}

/* ── INSERTION SORT ──────────────────────────── */
async function insertionSort() {
  const size = values.length;
  for (let i = 0; i < size; i++) {
    let key = values[i];
    let j = i - 1;
    while (j >= 0 && values[j] > key) {
      values[j + 1] = values[j];
      getBar(j).classList.add('sorting');
      await swapBars(j+1, j);
      getBar(j).classList.remove('sorting');
      j = j - 1;
    }
    values[j + 1] = key;
  }
  markAllSorted(size);
}

/* ── RUN SORTS ──────────────────────────── */
async function runSort() {
  const algo = document.getElementById('algorithms').value;
  switch (algo) {
    case 'bubble':
      bubbleSort(); break;
    case 'insert':
      insertionSort(); break;
    default:
      alert("Please select a sorting algorithm!")
  }
}

async function markAllSorted(n) {
  for (let i = 0; i < n; i++) {
    const bar = getBar(i);
    bar.style.backgroundColor = 'green';
    await sleep(Math.ceil(delay/5));
  }
}

function swapBarValues(bar1, bar2) {
  const tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;

  const label1 = bar1.querySelector('.bar-label'), label2 = bar2.querySelector('.bar-label');
  
  const tempLabel = label1.textContent;
  label1.textContent = label2.textContent;
  label2.textContent = tempLabel;
}

async function swapBars(i, j) {
  const bar1 = getBar(i), bar2 = getBar(j);
  
  // swap in array
  [values[i], values[j]] = [values[j], values[i]];

  // swap heights + labels
  if (bar1 && bar2) {
    swapBarValues(bar1, bar2);
  }

  await sleep(delay);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', () => {
  const bar_slider = document.getElementById('bar-slider');
  const speed_slider = document.getElementById('speed-slider');

  bar_slider.addEventListener('change', () => {
    generateValues(bar_slider.value);
  });

  speed_slider.addEventListener('input', () => {
    adjustDelay();
  });

  document.getElementById('btn-generate').addEventListener('click', () => {
    generateValues(bar_slider.value);
  });

  document.getElementById('chosen-sort').addEventListener('click', () => {
    runSort();
  });

  generateValues(bar_slider.value);
})