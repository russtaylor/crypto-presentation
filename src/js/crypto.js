let _ = require('lodash');
let Enigma = require('enigma-js');
let aes = require('aes-js');

const uppercaseLowerBound = 65;
const uppercaseUpperBound = 90;
const lowercaseLowerBound = 97;
const lowercaseUpperBound = 122;

let Crypto = {

  padEnd: function(string, desiredLength) {
    if (string.length >= desiredLength) {
      return string;
    }

    let extraLength = desiredLength - string.length;
    let padding = new Array(extraLength + 1).join(' ');
    return string + padding;
  },

  isUppercase: function(character) {
    return uppercaseLowerBound <= character && character <= uppercaseUpperBound;
  },

  isLowercase: function(character) {
    return lowercaseLowerBound <= character && character <= lowercaseUpperBound;
  },

  isLetter: function(character) {
    return module.exports.isLowercase(character) || module.exports.isUppercase(character);
  },

  /*
   * Scytale Cipher
   */
  scytaleEncode: function(string, diameter) {
    let output = '';
    let depth = Math.ceil(string.length / diameter);
    let paddedString = module.exports.padEnd(string, diameter * depth);
    for (let i = 0; i < diameter; i++) {
      for (let j = 0; j < depth; j++) {
        let stringIndex = (j * depth) + i;
        output += paddedString[(j * diameter) + i];
      }
    }
    return output.trimRight();
  },

  scytaleDecode: function(string, diameter) {
    let output = '';
    let depth = Math.ceil(string.length / diameter);
    let paddedString = module.exports.padEnd(string, diameter * depth);
    for (let i = 0; i < depth; i++) {
      for (let j = 0; j < diameter; j++) {
        output += paddedString[(j * depth) + i];
      }
    }
    return output.trimRight();
  },

  /*
   * Caesar Cipher
   */

  caesarCipherEncode: function(string, shiftSize) {
    return module.exports.caesarCipher(string, shiftSize);
  },

  caesarCipherDecode: function(string, shiftSize) {
    return module.exports.caesarCipher(string, (26 - shiftSize));
  },

  caesarCipher: function(string, shiftSize) {
    let output = '';
    let shift = shiftSize % 26;
    for (let i = 0; i < string.length; i++) {
      let charCode = string.charCodeAt(i);
      let newCharCode = charCode;
      if (module.exports.isUppercase(charCode)) {
        newCharCode = ((charCode - uppercaseLowerBound + shift) % 26) + uppercaseLowerBound;
      } else if (module.exports.isLowercase(charCode)) {
        newCharCode = ((charCode - lowercaseLowerBound + shift) % 26) + lowercaseLowerBound;
      }
      let newCharString = String.fromCharCode(newCharCode);
      output += newCharString;
    }
    return output;
  },


  /*
   * Monoalphabetic Substitution Cipher
   */
  processMonoalphabeticKey: function(string) {
    let characterArray = _.range(uppercaseLowerBound, uppercaseUpperBound + 1);
    let alphabetArray = characterArray.map((element) => {
      return String.fromCharCode(element);
    });

    let stringMap = {};
    for (let character in alphabetArray) {
      stringMap[alphabetArray[character]] = string[character];
    }
    return stringMap;
  },

  monoalphabeticEncipher: function(string, key) {
    let capitalString = string.toUpperCase();
    let codeMap = module.exports.processMonoalphabeticKey(key);
    let encipheredString = '';
    for (let stringCharacter in capitalString) {
      let character = capitalString[stringCharacter];
      if (codeMap.hasOwnProperty(character)) {
        encipheredString += codeMap[character];
      } else {
        encipheredString += character;
      }
    }
    return encipheredString;
  },

  monoalphabeticDecipher: function(string, key) {
    let codeMap = module.exports.processMonoalphabeticKey(key);
    let invertedMap = _.invert(codeMap);
    let decipheredString = '';
    for (let stringCharacter in string) {
      let character = string[stringCharacter];
      if (invertedMap.hasOwnProperty(character)) {
        decipheredString += invertedMap[character];
      } else {
        decipheredString += character;
      }
    }
    return decipheredString.toLowerCase();
  },

  /**
   * Vigenère Cipher
   */
  runVigenere: function(string, key) {
    let output = '';
    for (let i = 0; i < string.length; i++) {
      let character = string.charCodeAt(i);
      if (module.exports.isUppercase(character)) {
        let encipheredCharacter =
          (character - uppercaseLowerBound + key[i % key.length]) % 26 + uppercaseLowerBound;
        output += String.fromCharCode(encipheredCharacter);
      } else if (module.exports.isLowercase(character)) {
        let encipheredCharacter =
          (character - lowercaseLowerBound + key[i % key.length]) % 26 + lowercaseLowerBound;
        output += String.fromCharCode(encipheredCharacter);
      } else {
        output += string[i];
      }
    }
    return output;
  },

  vigenereEncipher: function(string, key) {
    let processedKey = module.exports.filterVigenereKey(key);
    return module.exports.runVigenere(string, processedKey);
  },

  vigenereDecipher: function(string, key) {
    let processedKey = module.exports.filterVigenereKey(key);
    // Invert the key, for use in deciphering
    for (let i = 0; i < processedKey.length; i++) {
      processedKey[i] = (26 - processedKey[i]) % 26;
    }
    return module.exports.runVigenere(string, processedKey);
  },

  filterVigenereKey: function(key) {
    let output = [];
    for (let i = 0; i < key.length; i++) {
      let character = key.charCodeAt(i);
      if (module.exports.isLetter(character)) {
        output.push((character - 65) % 32);
      }
    }
    return output;
  },

  /**
   * Enigma (external library)
   */
  enigmaEncode: function(string, rawKey) {
    let enigmaConfig = JSON.parse(rawKey);
    Enigma.load(enigmaConfig);
    return Enigma.process(string.toUpperCase());
  },

  /**
   * AES (external library)
   */
  aesEncode: function(string, hexKey) {
    let key = module.exports.hexToBytes(hexKey);

    let stringBytes = aes.utils.utf8.toBytes(string);

    let aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5));
    let encryptedBytes = aesCtr.encrypt(stringBytes);

    let encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
  },

  aesDecode: function(string, hexKey) {
    let key = module.exports.hexToBytes(hexKey);

    let stringBytes = aes.utils.hex.toBytes(string);

    let aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5));
    let encryptedBytes = aesCtr.decrypt(stringBytes);

    let encryptedHex = aes.utils.utf8.fromBytes(encryptedBytes);
    return encryptedHex;
  },

  hexToBytes: function(hexString) {
    let bytes = [];
    for (i = 0; i < hexString.length; i += 2) {
      bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    return bytes;
  }
};

module.exports = Crypto;
