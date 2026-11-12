import { mod } from './math.js';

export const vigenere = {
  name: 'Vigenère Cipher',
  blockSize: 1,
  description: 'Gives each letter its own Caesar shift taken from a repeating keyword, which hides the letter frequencies that make a plain Caesar cipher easy to break. Long considered unbreakable, it still falls to Kasiski examination when the keyword is short.',

  //The key is the keyword converted to a list of shifts (A = 0 ... Z = 25)
  readKey({ vigenereKey }) {
    const word = vigenereKey.toUpperCase().replace(/[^A-Z]/g, '');
    if (word.length === 0) return { error: 'Enter a keyword (letters only).' };
    return { key: [...word].map(char => char.charCodeAt(0) - 65) };
  },

  //index is the letter's position in the message, so the keyword repeats along it
  transform([x], shifts, decrypt, index) {
    const shift = shifts[index % shifts.length];
    return [mod(decrypt ? x - shift : x + shift)];
  },

  formula(shifts, decrypt) {
    const word = shifts.map(n => String.fromCharCode(65 + n)).join('');
    return decrypt
      ? `D(xᵢ) = (xᵢ − kᵢ) mod 26,  key = ${word} (repeating)`
      : `E(xᵢ) = (xᵢ + kᵢ) mod 26,  key = ${word} (repeating)`;
  },
};
