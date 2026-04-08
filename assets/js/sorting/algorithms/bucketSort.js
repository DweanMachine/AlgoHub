import {state} from '../state.js';
import {swapBarElements, refreshBar, getBar, sleep} from '../animations.js';
import {setUpBuckets, elements} from '../dom.js';
import { playTone } from '../audio.js';

async function bucketInsertionSort(bucket) {
  const size = bucket.length
  for (let i = 1; i < size; i++) {
    let j = i;
    while (j > 0 && bucket[j - 1].value > bucket[j].value && state.running) {
      const bar1 = bucket[j].bar;
      const bar2 = bucket[j - 1].bar;
      [bucket[j], bucket[j - 1]] = [bucket[j - 1], bucket[j]];
      await swapBarElements(bar1, bar2);
      j = j - 1;
    }
  }
}

//Sorting logic
export async function bucketSort() {
  await setUpBuckets(state.bucketCount);
  let buckets = Array.from({length: state.bucketCount}, () => []);

  // Snapshot everything BEFORE any DOM moves
  const snapshot = state.values.map((v, i) => ({value: v, bar: getBar(i)}));
  const maxValue = Math.max(...state.values);
  const minValue = Math.min(...state.values);
  const range = maxValue - minValue || 1;

  //Fill buckets from snapshot
  for (let i = 0; i < snapshot.length; i++) {
    let bucket_index = Math.floor(((snapshot[i].value - minValue) / range) * state.bucketCount);
    bucket_index = Math.min(bucket_index, state.bucketCount - 1);
    buckets[bucket_index].push(snapshot[i]);
    playTone(snapshot[i].value);
    document.getElementById(`bucket-${bucket_index}`).appendChild(snapshot[i].bar);
    
    if (!state.running) { return; }
    snapshot[i].bar.classList.add('swapping');
    await sleep(state.delay);
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
      if (!state.running) { return; }
      await refreshBar(index);
      state.values[index] = buckets[i][j].value;
      const bar = buckets[i][j].bar;
      bar.id = `bar-${index}`;
      elements.barContainer.appendChild(bar);
      await refreshBar(index);
      index++;
    }
  }
}