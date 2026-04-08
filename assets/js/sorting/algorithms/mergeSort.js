import {state} from '../state.js';
import {refreshBar} from '../animations.js';

async function merge(left, mid, right) {
    const leftSize = mid - left + 1;
    const rightSize = right - mid;

    // Create temp arrays
    const leftArr = new Array(leftSize);
    const rightArr = new Array(rightSize);

    // Copy data to temp arrays leftArr[] and rightArr[]
    for (let i = 0; i < leftSize; i++)
        leftArr[i] = state.values[left + i];
    for (let j = 0; j < rightSize; j++)
        rightArr[j] = state.values[mid + 1 + j];

    let i = 0, j = 0;
    let k = left;

    // Merge the temp arrays back into arr[left..right]
    while (i < leftSize && j < rightSize) {
      if (!state.running) return 0;
      if (leftArr[i] <= rightArr[j]) {
          state.values[k] = leftArr[i];
          i++;
      } else {
          state.values[k] = rightArr[j];
          j++;
      }
      k++;

      await refreshBar(k - 1);
    }

    // Copy the remaining elements of leftArr[], if there are any
    while (i < leftSize) {
        state.values[k] = leftArr[i++];
        await refreshBar(k++);
    }

    // Copy the remaining elements of rightArr[], if there are any
    while (j < rightSize) {
        state.values[k] = rightArr[j++];
        await refreshBar(k++);
    }
}

export async function mergeSort(left, right) {
    if (left >= right)
        return;
    const mid = Math.floor(left + (right - left) / 2);

    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);
}