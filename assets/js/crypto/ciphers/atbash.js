import { ALPHABET_SIZE } from './math.js';

export const atbash = {
  name: 'Atbash Cipher',
  blockSize: 1,
  description: 'Reverses the alphabet: A becomes Z, B becomes Y, and so on. There is no key, and the cipher is its own inverse, so encrypting and decrypting are the same operation.',

  //Nothing to configure, so there is no key (and no key controls on the page)
  readKey: () => ({ key: null }),

  transform: ([x]) => [ALPHABET_SIZE - 1 - x],

  formula: () => 'E(x) = D(x) = 25 − x',
};
