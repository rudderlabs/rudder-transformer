const _ = require('lodash');
const {words, wordsWithNumbers, snakeCase, snakeCaseWithNumbers} = require("../../src/warehouse/snakecase/snakecase");

const burredLetters = [
    // Latin-1 Supplement letters.
    '\xc0',
    '\xc1',
    '\xc2',
    '\xc3',
    '\xc4',
    '\xc5',
    '\xc6',
    '\xc7',
    '\xc8',
    '\xc9',
    '\xca',
    '\xcb',
    '\xcc',
    '\xcd',
    '\xce',
    '\xcf',
    '\xd0',
    '\xd1',
    '\xd2',
    '\xd3',
    '\xd4',
    '\xd5',
    '\xd6',
    '\xd8',
    '\xd9',
    '\xda',
    '\xdb',
    '\xdc',
    '\xdd',
    '\xde',
    '\xdf',
    '\xe0',
    '\xe1',
    '\xe2',
    '\xe3',
    '\xe4',
    '\xe5',
    '\xe6',
    '\xe7',
    '\xe8',
    '\xe9',
    '\xea',
    '\xeb',
    '\xec',
    '\xed',
    '\xee',
    '\xef',
    '\xf0',
    '\xf1',
    '\xf2',
    '\xf3',
    '\xf4',
    '\xf5',
    '\xf6',
    '\xf8',
    '\xf9',
    '\xfa',
    '\xfb',
    '\xfc',
    '\xfd',
    '\xfe',
    '\xff',
    // Latin Extended-A letters.
    '\u0100',
    '\u0101',
    '\u0102',
    '\u0103',
    '\u0104',
    '\u0105',
    '\u0106',
    '\u0107',
    '\u0108',
    '\u0109',
    '\u010a',
    '\u010b',
    '\u010c',
    '\u010d',
    '\u010e',
    '\u010f',
    '\u0110',
    '\u0111',
    '\u0112',
    '\u0113',
    '\u0114',
    '\u0115',
    '\u0116',
    '\u0117',
    '\u0118',
    '\u0119',
    '\u011a',
    '\u011b',
    '\u011c',
    '\u011d',
    '\u011e',
    '\u011f',
    '\u0120',
    '\u0121',
    '\u0122',
    '\u0123',
    '\u0124',
    '\u0125',
    '\u0126',
    '\u0127',
    '\u0128',
    '\u0129',
    '\u012a',
    '\u012b',
    '\u012c',
    '\u012d',
    '\u012e',
    '\u012f',
    '\u0130',
    '\u0131',
    '\u0132',
    '\u0133',
    '\u0134',
    '\u0135',
    '\u0136',
    '\u0137',
    '\u0138',
    '\u0139',
    '\u013a',
    '\u013b',
    '\u013c',
    '\u013d',
    '\u013e',
    '\u013f',
    '\u0140',
    '\u0141',
    '\u0142',
    '\u0143',
    '\u0144',
    '\u0145',
    '\u0146',
    '\u0147',
    '\u0148',
    '\u0149',
    '\u014a',
    '\u014b',
    '\u014c',
    '\u014d',
    '\u014e',
    '\u014f',
    '\u0150',
    '\u0151',
    '\u0152',
    '\u0153',
    '\u0154',
    '\u0155',
    '\u0156',
    '\u0157',
    '\u0158',
    '\u0159',
    '\u015a',
    '\u015b',
    '\u015c',
    '\u015d',
    '\u015e',
    '\u015f',
    '\u0160',
    '\u0161',
    '\u0162',
    '\u0163',
    '\u0164',
    '\u0165',
    '\u0166',
    '\u0167',
    '\u0168',
    '\u0169',
    '\u016a',
    '\u016b',
    '\u016c',
    '\u016d',
    '\u016e',
    '\u016f',
    '\u0170',
    '\u0171',
    '\u0172',
    '\u0173',
    '\u0174',
    '\u0175',
    '\u0176',
    '\u0177',
    '\u0178',
    '\u0179',
    '\u017a',
    '\u017b',
    '\u017c',
    '\u017d',
    '\u017e',
    '\u017f',
];
const emojiVar = '\ufe0f';
const flag = '\ud83c\uddfa\ud83c\uddf8';
const heart = `\u2764${emojiVar}`;
const hearts = '\ud83d\udc95';
const comboGlyph = `\ud83d\udc68\u200d${heart}\u200d\ud83d\udc8B\u200d\ud83d\udc68`;
const leafs = '\ud83c\udf42';
const rocket = '\ud83d\ude80';
const stubTrue = function () {
    return true;
};
const stubString = function () {
    return '';
};

describe('words', () => {
    it('should match words containing Latin Unicode letters', () => {
        const expected = _.map(burredLetters, (letter) => [letter]);
        const actual = _.map(burredLetters, (letter) => words(letter));
        expect(actual).toEqual(expected);
    });

    it('should work with compound words', () => {
        expect(words('12ft')).toEqual(['12', 'ft']);
        expect(words('aeiouAreVowels')).toEqual(['aeiou', 'Are', 'Vowels']);
        expect(words('enable 6h format')).toEqual(['enable', '6', 'h', 'format']);
        expect(words('enable 24H format')).toEqual(['enable', '24', 'H', 'format']);
        expect(words('isISO8601')).toEqual(['is', 'ISO', '8601']);
        expect(words('LETTERSAeiouAreVowels')).toEqual(['LETTERS', 'Aeiou', 'Are', 'Vowels']);
        expect(words('tooLegit2Quit')).toEqual(['too', 'Legit', '2', 'Quit']);
        expect(words('walk500Miles')).toEqual(['walk', '500', 'Miles']);
        expect(words('xhr2Request')).toEqual(['xhr', '2', 'Request']);
        expect(words('XMLHttp')).toEqual(['XML', 'Http']);
        expect(words('XmlHTTP')).toEqual(['Xml', 'HTTP']);
        expect(words('XmlHttp')).toEqual(['Xml', 'Http']);
    });

    it('should work with compound words containing diacritical marks', () => {
        expect(words('LETTERSÆiouAreVowels')).toEqual(['LETTERS', 'Æiou', 'Are', 'Vowels']);
        expect(words('æiouAreVowels')).toEqual(['æiou', 'Are', 'Vowels']);
        expect(words('æiou2Consonants')).toEqual(['æiou', '2', 'Consonants']);
    });

    it('should not treat contractions as separate words', () => {
        const postfixes = ['d', 'll', 'm', 're', 's', 't', 've'];

        _.each(["'", '\u2019'], (apos) => {
            _.times(2, (index) => {
                const actual = _.map(postfixes, (postfix) => {
                    const string = `a b${apos}${postfix} c`;
                    return words(string[index ? 'toUpperCase' : 'toLowerCase']());
                });
                const expected = _.map(postfixes, (postfix) => {
                    const words = ['a', `b${apos}${postfix}`, 'c'];
                    return _.map(words, (word) =>
                        word[index ? 'toUpperCase' : 'toLowerCase'](),
                    );
                });
                expect(actual).toEqual(expected);
            });
        });
    });

    it('should not treat ordinal numbers as separate words', () => {
        const ordinals = ['1st', '2nd', '3rd', '4th'];

        _.times(2, (index) => {
            const expected = _.map(ordinals, (ordinal) => [
                ordinal[index ? 'toUpperCase' : 'toLowerCase'](),
            ]);
            const actual = _.map(expected, (expectedWords) => words(expectedWords[0]));
            expect(actual).toEqual(expected);
        });
    });

    it('should prevent ReDoS', () => {
        const largeWordLen = 50000;
        const largeWord = 'A'.repeat(largeWordLen);
        const maxMs = 1000;
        const startTime = _.now();

        expect(words(`${largeWord}ÆiouAreVowels`)).toEqual([largeWord, 'Æiou', 'Are', 'Vowels']);

        const endTime = _.now();
        const timeSpent = endTime - startTime;

        expect(timeSpent).toBeLessThan(maxMs);
    });

    it('should account for astral symbols', () => {
        const string = `A ${leafs}, ${comboGlyph}, and ${rocket}`;
        expect(words(string)).toEqual(['A', leafs, comboGlyph, 'and', rocket]);
    });

    it('should account for regional symbols', () => {
        const pair = flag.match(/\ud83c[\udde6-\uddff]/g);
        const regionals = pair.join(' ');

        expect(words(flag)).toEqual([flag]);
        expect(words(regionals)).toEqual([pair[0], pair[1]]);
    });

    it('should account for variation selectors', () => {
        expect(words(heart)).toEqual([heart]);
    });

    it('should match lone surrogates', () => {
        const pair = hearts.split('');
        const surrogates = `${pair[0]} ${pair[1]}`;

        expect(words(surrogates)).toEqual([]);
    });
});

describe('wordsWithoutNumbers', () => {
    it('should match words containing Latin Unicode letters', () => {
        const expected = _.map(burredLetters, (letter) => [letter]);
        const actual = _.map(burredLetters, (letter) => wordsWithNumbers(letter));
        expect(actual).toEqual(expected);
    });

    it('should work with compound words', () => {
        expect(wordsWithNumbers('12ft')).toEqual(['12ft']);
        expect(wordsWithNumbers('aeiouAreVowels')).toEqual(['aeiou', 'Are', 'Vowels']);
        expect(wordsWithNumbers('enable 6h format')).toEqual(['enable', '6h', 'format']);
        expect(wordsWithNumbers('enable 24H format')).toEqual(['enable', '24H', 'format']);
        expect(wordsWithNumbers('isISO8601')).toEqual(['is', 'ISO8601']);
        expect(wordsWithNumbers('LETTERSAeiouAreVowels')).toEqual(['LETTERS', 'Aeiou', 'Are', 'Vowels']);
        expect(wordsWithNumbers('tooLegit2Quit')).toEqual(['too', 'Legit2', 'Quit']);
        expect(wordsWithNumbers('walk500Miles')).toEqual(['walk500', 'Miles']);
        expect(wordsWithNumbers('xhr2Request')).toEqual(['xhr2', 'Request']);
        expect(wordsWithNumbers('XMLHttp')).toEqual(['XML', 'Http']);
        expect(wordsWithNumbers('XmlHTTP')).toEqual(['Xml', 'HTTP']);
        expect(wordsWithNumbers('XmlHttp')).toEqual(['Xml', 'Http']);
    });

    it('should work with compound words containing diacritical marks', () => {
        expect(wordsWithNumbers('LETTERSÆiouAreVowels')).toEqual(['LETTERS', 'Æiou', 'Are', 'Vowels']);
        expect(wordsWithNumbers('æiouAreVowels')).toEqual(['æiou', 'Are', 'Vowels']);
        expect(wordsWithNumbers('æiou2Consonants')).toEqual(['æiou2', 'Consonants']);
    });

    it('should not treat contractions as separate words', () => {
        const postfixes = ['d', 'll', 'm', 're', 's', 't', 've'];

        _.each(["'", '\u2019'], (apos) => {
            _.times(2, (index) => {
                const actual = _.map(postfixes, (postfix) => {
                    const string = `a b${apos}${postfix} c`;
                    return wordsWithNumbers(string[index ? 'toUpperCase' : 'toLowerCase']());
                });
                const expected = _.map(postfixes, (postfix) => {
                    const words = ['a', `b${apos}${postfix}`, 'c'];
                    return _.map(words, (word) =>
                        word[index ? 'toUpperCase' : 'toLowerCase'](),
                    );
                });
                expect(actual).toEqual(expected);
            });
        });
    });

    it('should not treat ordinal numbers as separate words', () => {
        const ordinals = ['1st', '2nd', '3rd', '4th'];

        _.times(2, (index) => {
            const expected = _.map(ordinals, (ordinal) => [
                ordinal[index ? 'toUpperCase' : 'toLowerCase'](),
            ]);
            const actual = _.map(expected, (expectedWords) => wordsWithNumbers(expectedWords[0]));
            expect(actual).toEqual(expected);
        });
    });

    it('should prevent ReDoS', () => {
        const largeWordLen = 50000;
        const largeWord = 'A'.repeat(largeWordLen);
        const maxMs = 1000;
        const startTime = _.now();

        expect(wordsWithNumbers(`${largeWord}ÆiouAreVowels`)).toEqual([largeWord, 'Æiou', 'Are', 'Vowels']);

        const endTime = _.now();
        const timeSpent = endTime - startTime;

        expect(timeSpent).toBeLessThan(maxMs);
    });

    it('should account for astral symbols', () => {
        const string = `A ${leafs}, ${comboGlyph}, and ${rocket}`;
        expect(wordsWithNumbers(string)).toEqual(['A', leafs, comboGlyph, 'and', rocket]);
    });

    it('should account for regional symbols', () => {
        const pair = flag.match(/\ud83c[\udde6-\uddff]/g);
        const regionals = pair.join(' ');

        expect(wordsWithNumbers(flag)).toEqual([flag]);
        expect(wordsWithNumbers(regionals)).toEqual([pair[0], pair[1]]);
    });

    it('should account for variation selectors', () => {
        expect(wordsWithNumbers(heart)).toEqual([heart]);
    });

    it('should match lone surrogates', () => {
        const pair = hearts.split('');
        const surrogates = `${pair[0]} ${pair[1]}`;

        expect(wordsWithNumbers(surrogates)).toEqual([]);
    });
});

describe('snakeCase snakeCaseWithNumbers', () => {
    const caseMethods = {
        snakeCase,
        snakeCaseWithNumbers,
    };

    _.each(['snakeCase', 'snakeCaseWithNumbers'], (caseName) => {
        const methodName = caseName;
        const func = caseMethods[methodName];

        const strings = [
            'foo bar',
            'Foo bar',
            'foo Bar',
            'Foo Bar',
            'FOO BAR',
            'fooBar',
            '--foo-bar--',
            '__foo_bar__',
        ];

        const converted = (function () {
            switch (caseName) {
                case 'snakeCase':
                    return 'foo_bar';
                case 'snakeCaseWithNumbers':
                    return 'foo_bar';
            }
        })();

        it(`\`_.${methodName}\` should convert \`string\` to ${caseName} case`, () => {
            const actual = _.map(strings, (string) => {
                const expected = caseName === 'start' && string === 'FOO BAR' ? string : converted;
                return func(string) === expected;
            });
            expect(actual).toEqual(_.map(strings, stubTrue));
        });

        it(`\`_.${methodName}\` should handle double-converting strings`, () => {
            const actual = _.map(strings, (string) => {
                const expected = caseName === 'start' && string === 'FOO BAR' ? string : converted;
                return func(func(string)) === expected;
            });
            expect(actual).toEqual(_.map(strings, stubTrue));
        });

        it(`\`_.${methodName}\` should remove contraction apostrophes`, () => {
            const postfixes = ['d', 'll', 'm', 're', 's', 't', 've'];

            _.each(["'", '\u2019'], (apos) => {
                const actual = _.map(postfixes, (postfix) =>
                    func(`a b${apos}${postfix} c`),
                );
                const expected = _.map(postfixes, (postfix) => {
                    switch (caseName) {
                        case 'snakeCase':
                            return `a_b${postfix}_c`;
                        case 'snakeCaseWithNumbers':
                            return `a_b${postfix}_c`;
                    }
                });
                expect(actual).toEqual(expected);
            });
        });

        it(`\`_.${methodName}\` should remove Latin mathematical operators`, () => {
            const actual = _.map(['\xd7', '\xf7'], func);
            expect(actual).toEqual(['', '']);
        });

        it(`\`_.${methodName}\` should coerce \`string\` to a string`, () => {
            const string = 'foo bar';
            expect(func(Object(string))).toBe(converted);
            expect(func({toString: _.constant(string)})).toBe(converted);
        });

        it(`\`_.${methodName}\` should return an empty string for empty values`, () => {
            const values = [, null, undefined, ''];
            const expected = _.map(values, stubString);

            const actual = _.map(values, (value, index) =>
                index ? func(value) : func(),
            );

            expect(actual).toEqual(expected);
        });
    });
});