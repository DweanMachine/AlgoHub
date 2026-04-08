import { state } from '../state.js';
import { highlightTile, transformTile } from '../animations.js';

export async function hillCipher(matrix = state.hillMatrix) {
  const text = state.inputText.replace(/[^A-Z]/g, '');
  const padded = text.length % 2 !== 0 ? text + 'X' : text;

  for (let i = 0; i < padded.length; i += 2) {
    if (!state.running) return;

    const x1 = padded[i].charCodeAt(0) - 65;
    const x2 = padded[i + 1].charCodeAt(0) - 65;

    await highlightTile(i);
    await highlightTile(i + 1);

    const e1 = String.fromCharCode(((matrix[0][0] * x1 + matrix[0][1] * x2) % 26) + 65);
    const e2 = String.fromCharCode(((matrix[1][0] * x1 + matrix[1][1] * x2) % 26) + 65);

    await transformTile(i, e1);
    await transformTile(i + 1, e2);
  }
}