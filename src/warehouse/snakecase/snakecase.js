const { toString } = require('lodash');
const { unicodeWords, unicodeWordsWithNumbers } = require('./unicodeWords');

const hasUnicodeWord = RegExp.prototype.test.bind(
  /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
);

/** Used to match words composed of alphanumeric characters. */
// eslint-disable-next-line no-control-regex
const reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

function asciiWords(string) {
  return string.match(reAsciiWord);
}

function words(string) {
  const result = hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  return result || [];
}

function wordsWithNumbers(string) {
  const result = hasUnicodeWord(string) ? unicodeWordsWithNumbers(string) : asciiWords(string);
  return result || [];
}

const snakeCase = (string) =>
  words(toString(string).replace(/['\u2019]/g, '')).reduce(
    (result, word, index) => result + (index ? '_' : '') + word.toLowerCase(),
    '',
  );
const snakeCaseWithNumbers = (string) =>
  wordsWithNumbers(toString(string).replace(/['\u2019]/g, '')).reduce(
    (result, word, index) => result + (index ? '_' : '') + word.toLowerCase(),
    '',
  );

module.exports = { words, wordsWithNumbers, snakeCase, snakeCaseWithNumbers };
