export const state = {
  inputText:    '',
  outputText:   '',
  running:      false,
  delay:        50,
  audioEnabled: true,
  waveform:     'triangle',  // triangle fits crypto's mechanical feel better
  cipher:       null,

  // Cipher-specific keys
  caesarShift:  3,
  affineA:      5,
  affineB:      8,
  hillMatrix:   [[2, 1], [5, 3]],
};
