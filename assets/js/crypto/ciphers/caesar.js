import { state } from '../state.js';
import { highlightTile, transformTile } from '../animations.js';

export async function caesarCipher(shift = state.caesarShift) {
  const text = state.inputText;

  for (let i = 0; i < text.length; i++) {
    if (!state.running) return;

    await highlightTile(i);

    const char = text[i];
    if (/[A-Z]/.test(char)) {
      const shifted = String.fromCharCode(
        ((char.charCodeAt(0) - 65 + shift) % 26) + 65
      );
      await transformTile(i, shifted);
    }
  }
}