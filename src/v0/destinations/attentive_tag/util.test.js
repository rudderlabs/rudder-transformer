const { arePropertiesValid } = require('./util');

describe('arePropertiesValid', () => {
  // returns true for valid properties object with no special characters in keys
  it('should return true when properties object has no special characters in keys', () => {
    const properties = { key1: 'value1', key2: 'value2' };
    const result = arePropertiesValid(properties);
    expect(result).toBe(true);
  });

  // returns true for null properties input
  it('should return true when properties input is null', () => {
    const properties = null;
    const result = arePropertiesValid(properties);
    expect(result).toBe(true);
  });

  // returns false for properties object with keys containing special characters
  it('should return false for properties object with keys containing special characters', () => {
    const properties = {
      key1: 'value1',
      'key,2': 'value2',
      key3: 'value3',
    };
    expect(arePropertiesValid(properties)).toBe(false);
  });

  // returns true for empty properties object
  it('should return true for empty properties object', () => {
    const properties = {};
    expect(arePropertiesValid(properties)).toBe(true);
  });

  // returns true for undefined properties input
  it('should return true for undefined properties input', () => {
    const result = arePropertiesValid(undefined);
    expect(result).toBe(true);
  });

  // returns true for empty string properties input
  it('should return true for empty string properties input', () => {
    const result = arePropertiesValid('');
    expect(result).toBe(true);
  });

  // returns false for empty string properties input
  it('should return false for non object properties input', () => {
    const result = arePropertiesValid('1234');
    expect(result).toBe(false);
  });
});
