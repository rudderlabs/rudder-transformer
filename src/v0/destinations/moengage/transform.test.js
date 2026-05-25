const { mergeCustomAttributes, getCommonDestinationEndpoint } = require('./transform');
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
  test.each([
    {
      description: 'should return EU endpoint for identify',
      input: { apiId: 'testApiId', region: 'EU', category: { type: 'identify' } },
      expectedEndpoint: 'https://api-02.moengage.com/v1/customer/testApiId',
      expectedPath: 'customer',
    },
    {
      description: 'should return EU endpoint for track',
      input: { apiId: 'testApiId', region: 'EU', category: { type: 'track' } },
      expectedEndpoint: 'https://api-02.moengage.com/v1/event/testApiId',
      expectedPath: 'event',
    },
    {
      description: 'should return EU endpoint for device',
      input: { apiId: 'testApiId', region: 'EU', category: { type: 'device' } },
      expectedEndpoint: 'https://api-02.moengage.com/v1/device/testApiId',
      expectedPath: 'device',
    },
    {
      description: 'should return EU endpoint for alias',
      input: { apiId: 'testApiId', region: 'EU', category: { type: 'alias' } },
      expectedEndpoint: 'https://api-02.moengage.com/v1/customer/merge?app_id=testApiId',
      expectedPath: 'customer/merge',
    },
    {
      description: 'should return US endpoint for identify',
      input: { apiId: 'testApiId', region: 'US', category: { type: 'identify' } },
      expectedEndpoint: 'https://api-01.moengage.com/v1/customer/testApiId',
      expectedPath: 'customer',
    },
    {
      description: 'should return US endpoint for track',
      input: { apiId: 'testApiId', region: 'US', category: { type: 'track' } },
      expectedEndpoint: 'https://api-01.moengage.com/v1/event/testApiId',
      expectedPath: 'event',
    },
    {
      description: 'should return US endpoint for device',
      input: { apiId: 'testApiId', region: 'US', category: { type: 'device' } },
      expectedEndpoint: 'https://api-01.moengage.com/v1/device/testApiId',
      expectedPath: 'device',
    },
    {
      description: 'should return US endpoint for alias',
      input: { apiId: 'testApiId', region: 'US', category: { type: 'alias' } },
      expectedEndpoint: 'https://api-01.moengage.com/v1/customer/merge?app_id=testApiId',
      expectedPath: 'customer/merge',
    },
    {
      description: 'should return IND endpoint for identify',
      input: { apiId: 'testApiId', region: 'IND', category: { type: 'identify' } },
      expectedEndpoint: 'https://api-03.moengage.com/v1/customer/testApiId',
      expectedPath: 'customer',
    },
    {
      description: 'should return IND endpoint for track',
      input: { apiId: 'testApiId', region: 'IND', category: { type: 'track' } },
      expectedEndpoint: 'https://api-03.moengage.com/v1/event/testApiId',
      expectedPath: 'event',
    },
    {
      description: 'should return IND endpoint for device',
      input: { apiId: 'testApiId', region: 'IND', category: { type: 'device' } },
      expectedEndpoint: 'https://api-03.moengage.com/v1/device/testApiId',
      expectedPath: 'device',
    },
    {
      description: 'should return IND endpoint for alias',
      input: { apiId: 'testApiId', region: 'IND', category: { type: 'alias' } },
      expectedEndpoint: 'https://api-03.moengage.com/v1/customer/merge?app_id=testApiId',
      expectedPath: 'customer/merge',
    },
    {
      description: 'should return US-DC-04 endpoint for identify',
      input: { apiId: 'testApiId', region: 'US-DC-04', category: { type: 'identify' } },
      expectedEndpoint: 'https://api-04.moengage.com/v1/customer/testApiId',
      expectedPath: 'customer',
    },
    {
      description: 'should return US-DC-04 endpoint for track',
      input: { apiId: 'testApiId', region: 'US-DC-04', category: { type: 'track' } },
      expectedEndpoint: 'https://api-04.moengage.com/v1/event/testApiId',
      expectedPath: 'event',
    },
    {
      description: 'should return US-DC-04 endpoint for device',
      input: { apiId: 'testApiId', region: 'US-DC-04', category: { type: 'device' } },
      expectedEndpoint: 'https://api-04.moengage.com/v1/device/testApiId',
      expectedPath: 'device',
    },
    {
      description: 'should return US-DC-04 endpoint for alias',
      input: { apiId: 'testApiId', region: 'US-DC-04', category: { type: 'alias' } },
      expectedEndpoint: 'https://api-04.moengage.com/v1/customer/merge?app_id=testApiId',
      expectedPath: 'customer/merge',
    },
    {
      description: 'should return SGP-DC-05 endpoint for identify',
      input: { apiId: 'testApiId', region: 'SGP-DC-05', category: { type: 'identify' } },
      expectedEndpoint: 'https://api-05.moengage.com/v1/customer/testApiId',
      expectedPath: 'customer',
    },
    {
      description: 'should return SGP-DC-05 endpoint for track',
      input: { apiId: 'testApiId', region: 'SGP-DC-05', category: { type: 'track' } },
      expectedEndpoint: 'https://api-05.moengage.com/v1/event/testApiId',
      expectedPath: 'event',
    },
    {
      description: 'should return SGP-DC-05 endpoint for device',
      input: { apiId: 'testApiId', region: 'SGP-DC-05', category: { type: 'device' } },
      expectedEndpoint: 'https://api-05.moengage.com/v1/device/testApiId',
      expectedPath: 'device',
    },
    {
      description: 'should return SGP-DC-05 endpoint for alias',
      input: { apiId: 'testApiId', region: 'SGP-DC-05', category: { type: 'alias' } },
      expectedEndpoint: 'https://api-05.moengage.com/v1/customer/merge?app_id=testApiId',
      expectedPath: 'customer/merge',
    },
    {
      description: 'should return IDN-DC-06 endpoint for identify',
      input: { apiId: 'testApiId', region: 'IDN-DC-06', category: { type: 'identify' } },
      expectedEndpoint: 'https://api-06.moengage.com/v1/customer/testApiId',
      expectedPath: 'customer',
    },
    {
      description: 'should return IDN-DC-06 endpoint for track',
      input: { apiId: 'testApiId', region: 'IDN-DC-06', category: { type: 'track' } },
      expectedEndpoint: 'https://api-06.moengage.com/v1/event/testApiId',
      expectedPath: 'event',
    },
    {
      description: 'should return IDN-DC-06 endpoint for device',
      input: { apiId: 'testApiId', region: 'IDN-DC-06', category: { type: 'device' } },
      expectedEndpoint: 'https://api-06.moengage.com/v1/device/testApiId',
      expectedPath: 'device',
    },
    {
      description: 'should return IDN-DC-06 endpoint for alias',
      input: { apiId: 'testApiId', region: 'IDN-DC-06', category: { type: 'alias' } },
      expectedEndpoint: 'https://api-06.moengage.com/v1/customer/merge?app_id=testApiId',
      expectedPath: 'customer/merge',
    },
    {
      description: 'should return DC-101 endpoint for identify',
      input: { apiId: 'testApiId', region: 'DC-101', category: { type: 'identify' } },
      expectedEndpoint: 'https://api-101.moengage.com/v1/customer/testApiId',
      expectedPath: 'customer',
    },
    {
      description: 'should return DC-101 endpoint for track',
      input: { apiId: 'testApiId', region: 'DC-101', category: { type: 'track' } },
      expectedEndpoint: 'https://api-101.moengage.com/v1/event/testApiId',
      expectedPath: 'event',
    },
    {
      description: 'should return DC-101 endpoint for device',
      input: { apiId: 'testApiId', region: 'DC-101', category: { type: 'device' } },
      expectedEndpoint: 'https://api-101.moengage.com/v1/device/testApiId',
      expectedPath: 'device',
    },
    {
      description: 'should return DC-101 endpoint for alias',
      input: { apiId: 'testApiId', region: 'DC-101', category: { type: 'alias' } },
      expectedEndpoint: 'https://api-101.moengage.com/v1/customer/merge?app_id=testApiId',
      expectedPath: 'customer/merge',
    },
  ])('$description', ({ input, expectedEndpoint, expectedPath }) => {
    const result = getCommonDestinationEndpoint(input);
    expect(result.endpoint).toBe(expectedEndpoint);
    expect(result.path).toBe(expectedPath);
  });

  test.each([
    {
      description: 'should throw ConfigurationError for invalid region',
      input: { apiId: 'testApiId', region: 'INVALID', category: { type: 'identify' } },
      expectedError: new ConfigurationError('The region is not valid'),
    },
    {
      description: 'should throw ConfigurationError for null region',
      input: { apiId: 'testApiId', region: null, category: { type: 'identify' } },
      expectedError: new ConfigurationError('The region is not valid'),
    },
    {
      description: 'should throw ConfigurationError for undefined region',
      input: { apiId: 'testApiId', region: undefined, category: { type: 'identify' } },
      expectedError: new ConfigurationError('The region is not valid'),
    },
    {
      description: 'should throw ConfigurationError for empty string region',
      input: { apiId: 'testApiId', region: '', category: { type: 'identify' } },
      expectedError: new ConfigurationError('The region is not valid'),
    },
  ])('$description', ({ input, expectedError }) => {
    expect(() => {
      getCommonDestinationEndpoint(input);
    }).toThrow(expectedError);
  });
});
