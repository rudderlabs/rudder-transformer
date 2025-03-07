const { mergeCustomAttributes } = require('./transform');

describe('mergeCustomAttributes', () => {
  test('should return attributes as is if data is not present', () => {
    const attributes = { key1: 'value1', key2: 'value2' };
    const result = mergeCustomAttributes(attributes);
    expect(result).toEqual(attributes);
  });

  test('should merge data into attributes if data is an object', () => {
    const attributes = { key1: 'value1', data: { key2: 'value2', key3: 'value3' } };
    const result = mergeCustomAttributes(attributes);
    expect(result).toEqual({ key1: 'value1', key2: 'value2', key3: 'value3' });
  });

  test('should return attributes without data if data is not an object', () => {
    const attributes = { key1: 'value1', data: 'notAnObject' };
    const result = mergeCustomAttributes(attributes);
    expect(result).toEqual({ key1: 'value1' });
  });

  test('should handle empty attributes', () => {
    const attributes = {};
    const result = mergeCustomAttributes(attributes);
    expect(result).toEqual(attributes);
  });

  test('should handle attributes with empty data object', () => {
    const attributes = { key1: 'value1', data: {} };
    const result = mergeCustomAttributes(attributes);
    expect(result).toEqual({ key1: 'value1' });
  });
});
