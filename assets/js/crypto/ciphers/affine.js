import { state } from '../state.js';
import { highlightTile, transformTile } from '../animations.js';

export async function affineCipher(a = state.affineA, b = state.affineB) {
  const text = state.inputText;

  for (let i = 0; i < text.length; i++) {
    if (!state.running) return;

    await highlightTile(i);

    const char = text[i];
    if (/[A-Z]/.test(char)) {
      const x = char.charCodeAt(0) - 65;
      const encrypted = String.fromCharCode(((a * x + b) % 26) + 65);
      await transformTile(i, encrypted);
    }
  }
}