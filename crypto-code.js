function caesarCipher(text, shift) {
  let result=""
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char == " ") { result += " "; continue;}
    if (char == '\n') { result += '\n'; continue;}
    
    let decrypt = 1;
    if (encryptSwap.checked) {
      decrypt = -1;
    } 

    let ch = ((convertCharToInt(char) + shift * decrypt) % 26 + 26) % 26 + 65;
    result += String.fromCharCode(ch);
  }
  return result;
}

function convertCharToInt(char) {
  const isUpper = char === char.toUpperCase();   // toUpperCase() takes no args
  const base = isUpper ? 65 : 97;   // 65 = 'A', 97 = 'a'
  const encryptedVal = char.charCodeAt(0) - base;
  return encryptedVal;
}

const plaintext = document.getElementById('plaintext');
const ciphertext = document.getElementById('ciphertext');
const shift = document.getElementById('caesarShift');
const encrypt_button = document.getElementById('encrypt-button');
const encryptSwap = document.getElementById('encryptSwap');

const cipherLabel = document.getElementById('cipher-label');
const plainLabel = document.getElementById('plain-label');

encrypt_button.addEventListener('click', () => {
  const shiftValue = Number(shift.value);
  if (shift.value === "" || isNaN(shiftValue)) {
    alert('INSERT A SHIFT VALUE!');
    return;
  }
  ciphertext.textContent = caesarCipher(plaintext.value, shift.value);
});

encryptSwap.addEventListener('click', () => {
  if (encryptSwap.checked) {
    encrypt_button.textContent = 'Encrypt';
  } else {
    encrypt_button.textContent = 'Decrypt';
  }
  [cipherLabel.textContent, plainLabel.textContent] = [plainLabel.textContent, cipherLabel.textContent];
})