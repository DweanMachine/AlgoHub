//Shared modular arithmetic helpers for the classical ciphers
export const ALPHABET_SIZE = 26;

//Modulo that always returns a non-negative result (JavaScript's % can return negatives)
export function mod(n, m = ALPHABET_SIZE) {
  return ((n % m) + m) % m;
}

//Multiplicative inverse of a (mod m), or null if a and m share a factor
export function modInverse(a, m = ALPHABET_SIZE) {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}
