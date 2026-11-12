//Lists global state variables
export const state = {
  inputText:    '',
  outputText:   '',   //Only set once a run has finished
  mode:         'encrypt',   // 'encrypt' | 'decrypt'
  running:      false,
  runId:        0,    //Bumped whenever tiles are rebuilt, which cancels any run in flight
  delay:        70,
  waveform:     'sine',
  audioEnabled: true,
  volume:       0.5,
  theme:        'default',

  //Cipher keys, refreshed from the controls before each run
  keys: {
    caesarShift: 3,
    affineA:     5,
    affineB:     8,
    hillMatrix:  [[3, 3], [2, 5]],
    vigenereKey: 'LEMON',
  },
};
