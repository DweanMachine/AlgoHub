import { mod, modInverse } from './math.js';

export const hill = {
  name: 'Hill Cipher',
  blockSize: 2,
  description: 'Encrypts letters in pairs by multiplying them with a 2×2 key matrix (mod 26). Decryption needs the inverse matrix, which only exists when the determinant shares no factors with 26.',

  //When decrypting, the key returned is the inverse of the matrix entered
  readKey({ hillMatrix }, decrypt) {
    if (!hillMatrix.flat().every(Number.isInteger)) {
      return { error: 'Fill in all four matrix values with whole numbers.' };
    }
    const [[a, b], [c, d]] = hillMatrix.map(row => row.map(n => mod(n)));
    const det = mod(a * d - b * c);
    const detInv = modInverse(det);
    if (detInv === null) {
      return { error: `Matrix can't be inverted mod 26 (determinant = ${det}). Try different values.` };
    }
    if (!decrypt) return { key: [[a, b], [c, d]] };
    return {
      key: [
        [mod(detInv * d),  mod(-detInv * b)],
        [mod(-detInv * c), mod(detInv * a)],
      ],
    };
  },

  transform([x1, x2], [[a, b], [c, d]]) {
    return [mod(a * x1 + b * x2), mod(c * x1 + d * x2)];
  },

  formula([[a, b], [c, d]], decrypt) {
    const k = decrypt ? 'K⁻¹' : 'K';
    return `${decrypt ? 'D' : 'E'}(x) = ${k}·x mod 26,  ${k} = [${a} ${b}; ${c} ${d}]`;
  },
};
