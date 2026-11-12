import { mod } from './math.js';

export const caesar = {
  name: 'Caesar Cipher',
  blockSize: 1,
  description: 'Shifts every letter a fixed number of places along the alphabet. Simple, but with only 25 possible keys it falls to brute force instantly.',

  readKey: ({ caesarShift }) => ({ key: caesarShift }),

  transform: ([x], shift, decrypt) => [mod(decrypt ? x - shift : x + shift)],

  formula: (shift, decrypt) =>
    decrypt ? `D(x) = (x − ${shift}) mod 26` : `E(x) = (x + ${shift}) mod 26`,
};
