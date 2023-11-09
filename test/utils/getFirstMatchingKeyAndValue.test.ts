import util from '../../src/v0/util';

const getFirstMatchKVCases = [
  {
    description: 'show value and key if present & sourceKeys are Array<string>',
    input: {
      message: {
        player: 'Roger Federer',
        sport: 'Tennis',
        rivals: {
          spain: 'Rafael Nadal',
          serbia: 'Novak Djokovic',
          switzerland: 'Stan Wawrinka',
        },
      },
      sourceKeys: ['spain.rivals', 'rivals.spain'],
    },
    expectedOutput: {
      value: 'Rafael Nadal',
      key: 'rivals.spain',
    },
  },
  {
    description:
      'send value as null & key as empty string("") when the intended key is not present',
    input: {
      message: {
        player: 'Roger Federer',
        sport: 'Tennis',
        rivals: ['Rafael Nadal', 'Novak Djokovic', 'Stan Wawrinka'],
      },
      sourceKeys: ['spain.rivals', 'rivals.spain'],
    },
    expectedOutput: {
      value: null,
      key: '',
    },
  },
  {
    description:
      'send correct value & key when the key is present & sourceKeys is of string data-type',
    input: {
      message: {
        player: 'Roger Federer',
        sport: 'Tennis',
        rivals: ['Rafael Nadal', 'Novak Djokovic', 'Stan Wawrinka'],
      },
      sourceKeys: 'rivals.1',
    },
    expectedOutput: {
      value: 'Novak Djokovic',
      key: 'rivals.1',
    },
  },
  {
    description: 'send message null, sourceKeys as a valid string',
    input: {
      message: null,
      sourceKeys: 'rivals.1',
    },
    expectedOutput: {
      value: null,
      key: '',
    },
  },
  {
    description: 'send message undefined, sourceKeys as a valid string',
    input: {
      sourceKeys: 'rivals.1',
    },
    expectedOutput: {
      value: null,
      key: '',
    },
  },
  {
    description: 'send message as empty string, sourceKeys as a valid string',
    input: {
      message: '',
      sourceKeys: 'rivals.1',
    },
    expectedOutput: {
      value: null,
      key: '',
    },
  },
  {
    description: 'send message as valid string(stringified json), sourceKeys as a valid string',
    input: {
      message: '{"rivals": ["a","b"]}',
      sourceKeys: 'rivals.1',
    },
    expectedOutput: {
      value: null,
      key: '',
    },
  },
  {
    description: 'send message as valid Array<number|string>, sourceKeys as a valid string',
    input: {
      message: [1, 'va'],
      sourceKeys: 'rivals.1',
    },
    expectedOutput: {
      value: null,
      key: '',
    },
  },
  {
    description: 'send message as valid Array<object>, sourceKeys as a valid string',
    input: {
      message: [{ a: { b: 2 } }, { c: { d: 4 } }],
      sourceKeys: ['0.c.d', '1.c.d'],
    },
    expectedOutput: {
      value: 4,
      key: '1.c.d',
    },
  },
  {
    description: 'should get value as "0"',
    input: {
      message: {
        player: 'Roger Federer',
        sport: 'Tennis',
        rivals: {
          spain: 0,
          serbia: 'Novak Djokovic',
          switzerland: 'Stan Wawrinka',
        },
      },
      sourceKeys: ['spain.rivals', 'rivals.spain'],
    },
    expectedOutput: {
      value: 0,
      key: 'rivals.spain',
    },
  },
  {
    description: 'show get value as false',
    input: {
      message: {
        player: 'Roger Federer',
        sport: 'Tennis',
        rivals: {
          spain: false,
          serbia: 'Novak Djokovic',
          switzerland: 'Stan Wawrinka',
        },
      },
      sourceKeys: ['spain.rivals', 'rivals.spain'],
    },
    expectedOutput: {
      value: false,
      key: 'rivals.spain',
    },
  },
];

describe('getFirstMatchingKeyAndValue tests', () => {
  test.each(getFirstMatchKVCases)('$description', ({ input, expectedOutput }) => {
    const actualOutput = util.getFirstMatchingKeyAndValue(input.message, input.sourceKeys);
    expect(actualOutput).toEqual(expectedOutput);
  });
});
