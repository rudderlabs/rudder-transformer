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
