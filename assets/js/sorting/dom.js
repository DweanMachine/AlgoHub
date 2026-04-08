import {state} from './state.js';

//reference to important DOM elements
export const elements = {
  timer:           document.getElementById('timer'),
  barContainer:    document.getElementById('container'),
  bucketContainer: document.getElementById('bucketContainer'),
  barSlider:       document.getElementById('bar-slider'),
  speedSlider:     document.getElementById('speed-slider'),
  bucketSlider:    document.getElementById('bucket-slider'),
  expSlider:       document.getElementById('radix-exp-slider'),
};

//Generates a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Generates a new set of random values
export function generateValues(barCount) {
  elements.barContainer.replaceChildren();
  state.values = [];

  document.getElementById('bar-count-label').textContent = `Bars: ${barCount}`;

  const containerWidth = elements.barContainer.clientWidth || 1080;
  const barWidth = Math.max(4, Math.floor(containerWidth / barCount));

  for (let i = 0; i < barCount; i++) {
    const val = getRandomInt(1, 100);
    state.values.push(val);

    const bar = document.createElement('div');
    bar.id = `bar-${i}`;
    bar.classList.add('bar');
    bar.style.height = `${Math.max(3, val)}%`;
    bar.style.width = `${barWidth}px`;

    if (barCount < 80) {
      const label = document.createElement('span');
      label.classList.add('bar-label');
      label.textContent = val;
      bar.appendChild(label);
    } else {
      bar.style.borderColor = 'rgb(120, 120, 150)';
    }

    elements.barContainer.appendChild(bar);
  }
}


//Sets up buckets used for bucket sort
export function setUpBuckets(bucketCount) {
  elements.bucketContainer.innerHTML = '';
  elements.bucketContainer.style.border = '1px solid #ccc';
  elements.bucketContainer.style.height = '85px';

  const bucketWidth = Math.floor(elements.bucketContainer.clientWidth / bucketCount);

  for (let i = 0; i < bucketCount; i++) {
    const bucket = document.createElement('div');
    bucket.classList.add('bucket');
    bucket.id = `bucket-${i}`;
    bucket.style.width = `${bucketWidth}px`;
    elements.bucketContainer.appendChild(bucket);
  }
}

//Adjusts the animation delay based on the speed slider value
export function adjustDelay() {
  state.delay = parseInt(elements.speedSlider.value);
  document.getElementById('speed-label').textContent = `Delay: ${state.delay} ms`;
}

//Shows or hides sliders based on the selected algorithm
export function updateSliderVisibility(algo) {
  const radixSliderContainer  = document.getElementById('radix-slider-container');
  const bucketSliderContainer = document.getElementById('bucket-slider-container');

  radixSliderContainer.classList.toggle('hidden', algo !== 'radix');
  bucketSliderContainer.classList.toggle('hidden', algo !== 'bucket');

  if (algo === 'bucket') {
    elements.bucketContainer.classList.remove('hidden');
    elements.bucketContainer.innerHTML = '';
    elements.barContainer.style.height = '320px';
    setUpBuckets(state.bucketCount);
  } else {
    elements.bucketContainer.innerHTML = '';
    elements.bucketContainer.classList.add('hidden');
    elements.barContainer.style.height = '420px';
    elements.bucketContainer.innerHTML = '';
    console.log('Hiding bucket container');
  }
}

//Initializes event listeners for all controls
export function initControls(onRunSort) {
  adjustDelay();
  generateValues(elements.barSlider.value);

  elements.barSlider.addEventListener('change', () => {
    generateValues(elements.barSlider.value);
  });

  elements.speedSlider.addEventListener('input', () => {
    adjustDelay();
  });

  elements.bucketSlider.addEventListener('input', () => {
    state.bucketCount = elements.bucketSlider.value;
    document.getElementById('bucket-label').textContent = `Buckets: ${state.bucketCount}`;
    setUpBuckets(state.bucketCount);
  });

  elements.expSlider.addEventListener('input', () => {
    document.getElementById('radix-exp-label').textContent = `Exponent: ${elements.expSlider.value}`;
  });

  document.getElementById('btn-generate').addEventListener('click', () => {
    generateValues(elements.barSlider.value);
    elements.timer.textContent = 'Ready!';
    state.running = false;
  });

  document.getElementById('chosen-sort').addEventListener('click', () => {
    if (state.running) { return; }
    onRunSort();
  });

  //Show/hide algorithm specific elements
  document.getElementById('algorithms').addEventListener('change', (e) => {
    updateSliderVisibility(e.target.value);
  });
}