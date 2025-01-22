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
