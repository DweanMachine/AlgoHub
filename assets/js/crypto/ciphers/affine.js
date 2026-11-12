import { mod, modInverse } from './math.js';

export const affine = {
  name: 'Affine Cipher',
  blockSize: 1,
  description: 'Multiplies each letter by a, then adds b. The value of a must share no factors with 26, otherwise two letters would encrypt to the same thing and the message could not be decrypted.',

  readKey({ affineA, affineB }) {
    if (!Number.isInteger(affineA) || !Number.isInteger(affineB)) {
      return { error: 'Enter whole numbers for a and b.' };
    }
    if (modInverse(affineA) === null) {
      return { error: `a = ${affineA} shares a factor with 26. Pick another value.` };
    }
    return { key: { a: mod(affineA), b: mod(affineB) } };
  },

  transform([x], { a, b }, decrypt) {
    return decrypt ? [mod(modInverse(a) * (x - b))] : [mod(a * x + b)];
  },

  formula({ a, b }, decrypt) {
    return decrypt
      ? `D(x) = ${modInverse(a)}(x − ${b}) mod 26`
      : `E(x) = (${a}x + ${b}) mod 26`;
  },
};
