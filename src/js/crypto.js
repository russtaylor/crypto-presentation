let Crypto = {
  scytale: function(string, diameter) {
    let output = '';

  },

  caesarCipher: function(string, shiftSize) {
    let output = '';
    let shift = shiftSize % 26;
    for (let i = 0; i < string.length; i++) {
      let charCode = string.charCodeAt(i);
      let newCharCode = charCode;
      if (charCode >= 65 && charCode <= 90 ) {
        newCharCode = ((charCode - 65 + shift) % 26) + 65;
      } else if (charCode >= 97 && charCode <= 122) {
        newCharCode = ((charCode - 97 + shift) % 26) + 97;
      }
      let newCharString = String.fromCharCode(newCharCode);
      output += newCharString;
    }
    return output;
  }
};

module.exports = Crypto;
