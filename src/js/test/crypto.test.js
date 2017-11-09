const Crypto = require('../crypto');

test('Scytale can encypher...', () => {
  expect(Crypto.scytaleEncode('Testing', 2)).toBe('Tsigetn');
  expect(Crypto.scytaleEncode('Help me I am under attack', 5))
    .toBe('Hmadteemetl  rapIu c  nak');
  expect(Crypto.scytaleEncode('How many chickens are in the chicken coop?', 8))
    .toBe('H s cpoc tk?whahe  iren mce   ak cc neiho ynnio');
  expect(Crypto.scytaleEncode("It's a trap!", 6))
    .toBe("I tt'rsa pa!");
});

test('Scytale can decipher...', () => {
  expect(Crypto.scytaleDecode('Tsigetn', 2)).toBe('Testing');
  expect(Crypto.scytaleEncode('Hmadteemetl  rapIu c  nak', 5))
    .toBe('Help me I am under attack');
  expect(Crypto.scytaleDecode('H s cpoc tk?whahe  iren mce   ak cc neiho ynnio', 8))
    .toBe('How many chickens are in the chicken coop?');
  expect(Crypto.scytaleDecode("I tt'rsa pa!", 6))
    .toBe("It's a trap!");
});

test('Caesar Shift works!', () => {
  expect(Crypto.caesarCipher('Hello', 3)).toBe('Khoor');
  expect(Crypto.caesarCipher('This is a longer string, with some punctuation!', 5))
    .toBe('Ymnx nx f qtsljw xywnsl, bnym xtrj uzshyzfynts!');
  expect(Crypto.caesarCipher('Yg ctg iqkpi dcemyctfu pqy!', -2))
    .toBe('We are going backwards now!');
  expect(Crypto.caesarCipher('ZZZZzzzz', 20)).toBe('TTTTtttt');
});

test('Can split monoalphabetic cipher key.', () => {
  expect(Crypto.processMonoalphabeticKey('PHYEUFSMQNJVKOWCTDABGIXRZL')).toEqual({
    A: 'P',
    B: 'H',
    C: 'Y',
    D: 'E',
    E: 'U',
    F: 'F',
    G: 'S',
    H: 'M',
    I: 'Q',
    J: 'N',
    K: 'J',
    L: 'V',
    M: 'K',
    N: 'O',
    O: 'W',
    P: 'C',
    Q: 'T',
    R: 'D',
    S: 'A',
    T: 'B',
    U: 'G',
    V: 'I',
    W: 'X',
    X: 'R',
    Y: 'Z',
    Z: 'L'
  });
});

test('Can encipher monoalphabetically', () => {
  expect(Crypto.monoalphabeticEncipher('TEST', 'PHYEUFSMQNJVKOWCTDABGIXRZL')).toEqual('BUAB');
  expect(Crypto.monoalphabeticEncipher('test', 'PHYEUFSMQNJVKOWCTDABGIXRZL')).toEqual('BUAB');
  expect(Crypto.monoalphabeticEncipher('testing!', 'PHYEUFSMQNJVKOWCTDABGIXRZL'))
    .toEqual('BUABQOS!');
  expect(Crypto.monoalphabeticEncipher('Hello, world!', 'PHYEUFSMQNJVKOWCTDABGIXRZL'))
    .toEqual('MUVVW, XWDVE!');
});

test('Can decipher monoalphabetically', () => {
  expect(Crypto.monoalphabeticDecipher('BUAB', 'PHYEUFSMQNJVKOWCTDABGIXRZL')).toEqual('test');
  expect(Crypto.monoalphabeticDecipher('BUABQOS!', 'PHYEUFSMQNJVKOWCTDABGIXRZL'))
    .toEqual('testing!');
});

test('Can encipher with Vigènere', () => {
  expect(Crypto.vigenereEncipher('The quick brown fox.', 'abc')).toEqual('Tig rwidm ctoxp gqx.');
  expect(Crypto.vigenereEncipher('I ate a bagel for breakfast.', 'bagels'))
    .toEqual('J gxp b herwm lsc crkevxbsz.');
});

test('Can decipher with Vigènere', () => {
  expect(Crypto.vigenereDecipher('Tig rwidm ctoxp gqx.', 'abc')).toEqual('The quick brown fox.');
  expect(Crypto.vigenereDecipher('J gxp b herwm lsc crkevxbsz.', 'bagels'))
    .toEqual('I ate a bagel for breakfast.');
});

test('Can encipher/decipher with Enigma', () => {
  let enigmaSettings = '{"rotors":[{"type":"III","ring":0,"position":"X"},{"type":"II","ring":0,"position":"R"},{"type":"I","ring":0,"position":"D"}],"plugboard":["AB","CD","EF","GH"],"reflector":"B","spacing":4}'
  expect(Crypto.enigmaEncode('HELLOWORLD', enigmaSettings)).toBe('OXUW QMJI RC');
  expect(Crypto.enigmaEncode('wedowhatwemustbecausewecan', enigmaSettings))
    .toBe('AXCJ YFBN QIBK MVJQ NPVD KCTG IL');
});

test('Can encipher with AES', () => {
  let key = '2FAE57CC2F9692AAF683A54F52585B6F';
  expect(Crypto.aesEncode('Hello!', key)).toBe('0beaee3e87cf');
});

test('Can encipher with AES', () => {
  let key = '2FAE57CC2F9692AAF683A54F52585B6F';
  expect(Crypto.aesEncode('0beaee3e87cf', key)).toBe('Hello!');
});

