const { convertToISODate } = require('./utils');
const { TransformationError } = require('@rudderstack/integrations-lib');

describe('convertToISODate', () => {
  // Converts valid numeric timestamp to ISO date string
  it('should return ISO date string when given a valid numeric timestamp', () => {
    const timestamp = 1633072800; // Example timestamp for 2021-10-01T00:00:00.000Z
    const result = convertToISODate(timestamp);
    expect(result).toBe('2021-10-01T07:20:00.000Z');
  });

  // Throws error for non-numeric string input
  it('should throw TransformationError when given a non-numeric string', () => {
    const invalidTimestamp = 'invalid';
    expect(() => convertToISODate(invalidTimestamp)).toThrow(TransformationError);
  });

  // Converts valid numeric string timestamp to ISO date string
  it('should convert valid numeric string timestamp to ISO date string', () => {
    const rawTimestamp = '1633072800'; // Corresponds to 2021-10-01T00:00:00.000Z
    const result = convertToISODate(rawTimestamp);
    expect(result).toBe('2021-10-01T07:20:00.000Z');
  });

  // Throws error for non-number and non-string input
  it('should throw error for non-number and non-string input', () => {
    expect(() => convertToISODate({})).toThrow(TransformationError);
    expect(() => convertToISODate([])).toThrow(TransformationError);
    expect(() => convertToISODate(null)).toThrow(TransformationError);
    expect(() => convertToISODate(undefined)).toThrow(TransformationError);
  });

  it('should throw error for timestamp that results in invalid date when multiplied', () => {
    const hugeTimestamp = 999999999999999; // This will become invalid when multiplied by 1000
    expect(() => convertToISODate(hugeTimestamp)).toThrow(TransformationError);
  });
});

describe('flattenParams', () => {
  const { flattenParams } = require('./utils');

  it('should flatten object with array values to their first elements', () => {
    const input = {
      key1: ['value1'],
      key2: ['value2'],
      key3: [123],
    };
    const expected = {
      key1: 'value1',
      key2: 'value2',
      key3: 123,
    };
    expect(flattenParams(input)).toEqual(expected);
  });

  it('should return empty object when input is null or undefined', () => {
    expect(flattenParams(null)).toEqual({});
    expect(flattenParams(undefined)).toEqual({});
  });

  it('should handle empty object input', () => {
    expect(flattenParams({})).toEqual({});
  });

  it('should handle array with undefined or null first elements', () => {
    const input = {
      key1: [undefined],
      key2: [null],
    };
    const expected = {
      key1: undefined,
      key2: null,
    };
    expect(flattenParams(input)).toEqual(expected);
  });

  it('should handle mixed type values in arrays', () => {
    const input = {
      number: [42],
      string: ['test'],
      boolean: [true],
      object: [{ nested: 'value' }],
    };
    const expected = {
      number: 42,
      string: 'test',
      boolean: true,
      object: { nested: 'value' },
    };
    expect(flattenParams(input)).toEqual(expected);
  });

  it('should handle empty arrays as values', () => {
    const input = {
      key1: [],
      key2: ['value'],
      key3: [],
    };
    const expected = {
      key1: undefined,
      key2: 'value',
      key3: undefined,
    };
    expect(flattenParams(input)).toEqual(expected);
  });

  it('should keep non-array values unchanged', () => {
    const input = {
      string: 'direct string',
      number: 42,
      boolean: true,
      object: { test: 'value' },
      array: ['first', 'second'],
    };
    const expected = {
      string: 'direct string',
      number: 42,
      boolean: true,
      object: { test: 'value' },
      array: 'first',
    };
    expect(flattenParams(input)).toEqual(expected);
  });

  it('should handle mixed array and non-array values', () => {
    const input = {
      arrayValue: ['first'],
      emptyArray: [],
      directValue: 'string',
      nullValue: null,
      undefinedValue: undefined,
    };
    const expected = {
      arrayValue: 'first',
      emptyArray: undefined,
      directValue: 'string',
      nullValue: null,
      undefinedValue: undefined,
    };
    expect(flattenParams(input)).toEqual(expected);
  });
});
