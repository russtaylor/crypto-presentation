const Crypto = require('../crypto');

test('Caesar Shift works!', () => {
  expect(Crypto.caesarCipher('Hello', 3)).toBe('Khoor');
  expect(Crypto.caesarCipher('This is a longer string, with some punctuation!', 5))
    .toBe('Ymnx nx f qtsljw xywnsl, bnym xtrj uzshyzfynts!');
  expect(Crypto.caesarCipher('Yg ctg iqkpi dcemyctfu pqy!', -2))
    .toBe('We are going backwards now!');
  expect(Crypto.caesarCipher('ZZZZzzzz', 20)).toBe('TTTTtttt');
});
