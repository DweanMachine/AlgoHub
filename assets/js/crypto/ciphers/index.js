import { caesar } from './caesar.js';
import { affine } from './affine.js';
import { hill } from './hill.js';
import { vigenere } from './vigenere.js';
import { atbash } from './atbash.js';

//Keyed by the <option> values in the algorithm dropdown
export const ciphers = { caesar, affine, hill, vigenere, atbash };
