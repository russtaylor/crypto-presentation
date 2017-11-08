let Reveal = require('reveal.js');
let Crypto = require('./crypto.js');

let encryptionMap = {
  "scytale": {
    "encipher-function": Crypto.scytaleEncode,
    "decipher-function": Crypto.scytaleDecode
  },
  "caesar": {
    "encipher-function": Crypto.caesarCipherEncode,
    "decipher-function": Crypto.caesarCipherDecode
  },
  "monoalphabetic": {
    "encipher-function": Crypto.monoalphabeticEncipher,
    "decipher-function": Crypto.monoalphabeticDecipher
  },
  "vigenere": {
    "encipher-function": Crypto.vigenereEncipher,
    "decipher-function": Crypto.vigenereDecipher
  }
};

// Depends on convention, no real error-checking. Gotta make sure the names are right.
for(let encryptionScheme in encryptionMap) {
  document.getElementById(encryptionScheme + '-encipher').addEventListener('click', function() {
    let encryptText = document.getElementById(encryptionScheme + '-input').value;
    let encryptKey = document.getElementById(encryptionScheme + '-key').value;
    let encodedText = encryptionMap[encryptionScheme]['encipher-function'](encryptText, encryptKey);
    document.getElementById(encryptionScheme + '-output').value = encodedText;
  });

  document.getElementById(encryptionScheme + '-decipher').addEventListener('click', function() {
    let encryptText = document.getElementById(encryptionScheme + '-output').value;
    let encryptKey = document.getElementById(encryptionScheme + '-key').value;
    let encodedText = encryptionMap[encryptionScheme]['decipher-function'](encryptText, encryptKey);
    document.getElementById(encryptionScheme + '-input').value = encodedText;
  });
}

Reveal.initialize({
  controls: true,
  progress: true,
  history: true,
  center: true,
  transition: 'concave'
});
