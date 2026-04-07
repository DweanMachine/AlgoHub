//Lists global state variables
export const state = {
  values: [],
  delay: 15,
  running: false,
  algo: null,
  bucketCount: 5,
  radixExp: 2
};

export function setState(key, value) {
  state[key] = value;
}

export function resetState() {
  state.running = false;
  state.algo = null;
}