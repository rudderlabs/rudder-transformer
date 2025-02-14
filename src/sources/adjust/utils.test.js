const { convertToISODate } = require('./utils');
const { TransformationError } = require('@rudderstack/integrations-lib');

describe('convertToISODate', () => {
  const testCases = [
    {
      name: 'valid numeric timestamp',
      input: 1633072800,
      expected: '2021-10-01T07:20:00.000Z',
      shouldThrow: false,
    },
    {
      name: 'non-numeric string',
      input: 'invalid',
      shouldThrow: true,
      errorType: TransformationError,
    },
    {
      name: 'valid numeric string timestamp',
      input: '1633072800',
      expected: '2021-10-01T07:20:00.000Z',
      shouldThrow: false,
    },
    {
      name: 'object input',
      input: {},
      shouldThrow: true,
      errorType: TransformationError,
    },
    {
      name: 'array input',
      input: [],
      shouldThrow: true,
      errorType: TransformationError,
    },
    {
      name: 'null input',
      input: null,
      shouldThrow: true,
      errorType: TransformationError,
    },
    {
      name: 'undefined input',
      input: undefined,
      shouldThrow: true,
      errorType: TransformationError,
    },
    {
      name: 'huge timestamp that becomes invalid',
      input: 999999999999999,
      shouldThrow: true,
      errorType: TransformationError,
    },
  ];

  testCases.forEach(({ name, input, expected, shouldThrow, errorType }) => {
    it(`should handle ${name}`, () => {
      if (shouldThrow) {
        expect(() => convertToISODate(input)).toThrow(errorType);
      } else {
        const result = convertToISODate(input);
        expect(result).toBe(expected);
      }
    });
  });
});

describe('flattenParams', () => {
  const { flattenParams } = require('./utils');

  const testCases = [
    {
      name: 'flatten array values to first elements',
      input: {
        key1: ['value1'],
        key2: ['value2'],
        key3: [123],
      },
      expected: {
        key1: 'value1',
        key2: 'value2',
        key3: 123,
      },
    },
    {
      name: 'handle null input',
      input: null,
      expected: {},
    },
    {
      name: 'handle undefined input',
      input: undefined,
      expected: {},
    },
    {
      name: 'handle empty object',
      input: {},
      expected: {},
    },
    {
      name: 'ignore null/undefined array elements',
      input: {
        key1: [undefined],
        key2: [null],
        key3: [undefined, 'value'],
        key4: [null, 'value'],
      },
      expected: {},
    },
    {
      name: 'handle mixed type values in arrays',
      input: {
        number: [42],
        string: ['test'],
        boolean: [true],
        object: [{ nested: 'value' }],
        date: [new Date('2024-01-01')],
      },
      expected: {
        number: 42,
        string: 'test',
        boolean: true,
        object: { nested: 'value' },
        date: new Date('2024-01-01'),
      },
    },
    {
      name: 'handle empty arrays',
      input: {
        key1: [],
        key2: ['value'],
        key3: [],
      },
      expected: {
        key2: 'value',
      },
    },
    {
      name: 'keep non-array values unchanged',
      input: {
        string: 'direct string',
        number: 42,
        boolean: true,
        object: { test: 'value' },
        array: ['first', 'second'],
      },
      expected: {
        string: 'direct string',
        number: 42,
        boolean: true,
        object: { test: 'value' },
        array: 'first',
      },
    },
    {
      name: 'handle mixed array and non-array values',
      input: {
        arrayValue: ['first'],
        emptyArray: [],
        directValue: 'string',
        nullValue: null,
        undefinedValue: undefined,
      },
      expected: {
        arrayValue: 'first',
        directValue: 'string',
      },
    },
    {
      name: 'handle nested arrays',
      input: {
        nested: [
          [1, 2],
          [3, 4],
        ],
        mixed: [['a', 'b'], 'c'],
      },
      expected: {
        nested: [1, 2],
        mixed: ['a', 'b'],
      },
    },
    {
      name: 'handle special values in arrays',
      input: {
        nan: [NaN],
        infinity: [Infinity],
        negInfinity: [-Infinity],
        zero: [0],
        negZero: [-0],
      },
      expected: {
        nan: NaN,
        infinity: Infinity,
        negInfinity: -Infinity,
        zero: 0,
        negZero: -0,
      },
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(`should ${name}`, () => {
      expect(flattenParams(input)).toEqual(expected);
    });
  });
});
