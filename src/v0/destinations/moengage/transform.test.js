const { mergeCustomAttributes, getCommonDestinationEndpoint } = require('./transform');
const { endpoints, endpointPaths } = require('./config');
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
      expectedEndpoint: endpoints.EU.identify + 'testApiId',
      expectedPath: endpointPaths.identify,
    },
    {
      description: 'should return EU endpoint for track',
      input: { apiId: 'testApiId', region: 'EU', category: { type: 'track' } },
      expectedEndpoint: endpoints.EU.track + 'testApiId',
      expectedPath: endpointPaths.track,
    },
    {
      description: 'should return EU endpoint for device',
      input: { apiId: 'testApiId', region: 'EU', category: { type: 'device' } },
      expectedEndpoint: endpoints.EU.device + 'testApiId',
      expectedPath: endpointPaths.device,
    },
    {
      description: 'should return EU endpoint for alias',
      input: { apiId: 'testApiId', region: 'EU', category: { type: 'alias' } },
      expectedEndpoint: endpoints.EU.alias + 'testApiId',
      expectedPath: endpointPaths.alias,
    },
    {
      description: 'should return US endpoint for identify',
      input: { apiId: 'testApiId', region: 'US', category: { type: 'identify' } },
      expectedEndpoint: endpoints.US.identify + 'testApiId',
      expectedPath: endpointPaths.identify,
    },
    {
      description: 'should return US endpoint for track',
      input: { apiId: 'testApiId', region: 'US', category: { type: 'track' } },
      expectedEndpoint: endpoints.US.track + 'testApiId',
      expectedPath: endpointPaths.track,
    },
    {
      description: 'should return US endpoint for device',
      input: { apiId: 'testApiId', region: 'US', category: { type: 'device' } },
      expectedEndpoint: endpoints.US.device + 'testApiId',
      expectedPath: endpointPaths.device,
    },
    {
      description: 'should return US endpoint for alias',
      input: { apiId: 'testApiId', region: 'US', category: { type: 'alias' } },
      expectedEndpoint: endpoints.US.alias + 'testApiId',
      expectedPath: endpointPaths.alias,
    },
    {
      description: 'should return IND endpoint for identify',
      input: { apiId: 'testApiId', region: 'IND', category: { type: 'identify' } },
      expectedEndpoint: endpoints.IND.identify + 'testApiId',
      expectedPath: endpointPaths.identify,
    },
    {
      description: 'should return IND endpoint for track',
      input: { apiId: 'testApiId', region: 'IND', category: { type: 'track' } },
      expectedEndpoint: endpoints.IND.track + 'testApiId',
      expectedPath: endpointPaths.track,
    },
    {
      description: 'should return IND endpoint for device',
      input: { apiId: 'testApiId', region: 'IND', category: { type: 'device' } },
      expectedEndpoint: endpoints.IND.device + 'testApiId',
      expectedPath: endpointPaths.device,
    },
    {
      description: 'should return IND endpoint for alias',
      input: { apiId: 'testApiId', region: 'IND', category: { type: 'alias' } },
      expectedEndpoint: endpoints.IND.alias + 'testApiId',
      expectedPath: endpointPaths.alias,
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
