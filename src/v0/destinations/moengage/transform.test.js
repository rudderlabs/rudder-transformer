const { mergeCustomAttributes, getCommonDestinationEndpoint } = require('./transform');
const { endpointEU, endpointUS, endpointIND } = require('./config');
const { ConfigurationError } = require('@rudderstack/integrations-lib');

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

describe('getCommonDestinationEndpoint', () => {
  test('should return EU endpoint', () => {
    const result = getCommonDestinationEndpoint({
      apiId: 'testApiId',
      region: 'EU',
      category: { type: 'identify' },
    });
    expect(result).toBe(endpointEU.identify + 'testApiId');
  });

  test('should return US endpoint', () => {
    const result = getCommonDestinationEndpoint({
      apiId: 'testApiId',
      region: 'US',
      category: { type: 'track' },
    });
    expect(result).toBe(endpointUS.track + 'testApiId');
  });

  test('should return IND endpoint', () => {
    const result = getCommonDestinationEndpoint({
      apiId: 'testApiId',
      region: 'IND',
      category: { type: 'device' },
    });
    expect(result).toBe(endpointIND.device + 'testApiId');
  });

  test('should throw ConfigurationError for invalid region', () => {
    expect(() => {
      getCommonDestinationEndpoint({
        apiId: 'testApiId',
        region: 'INVALID',
        category: { type: 'identify' },
      });
    }).toThrow(new ConfigurationError('The region is not valid'));
  });
});
