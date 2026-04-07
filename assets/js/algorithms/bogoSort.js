import {state} from '../state.js';
import {swapBars} from '../animations.js';

async function isSorted(){
  for(var i = 1; i < state.values.length; i++) {
    if (state.values[i] < state.values[i-1])
      return false;
  }
  return true;
}
    
// To generate permutation of the array
async function shuffle() {
  var i, j = state.values.length;
  for (i = 0; i < state.values.length; i++){
    var rand_index = Math.floor(Math.random() * state.values.length);
    
    [state.values[j-i-1], state.values[rand_index]] = [state.values[rand_index], state.values[j-i-1]];
    if (!state.running) {return;}
    await swapBars(j-i-1, rand_index);
  }
}
    
// Sorts array a[0..n-1] using Bogo sort
export async function bogoSort() {
  // if array is not sorted then shuffle the array again
  while (!await isSorted() && state.running)
    await shuffle();
  return state.values;
}