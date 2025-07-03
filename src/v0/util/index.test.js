const { InstrumentationError } = require('@rudderstack/integrations-lib');
const utilities = require('.');
const { getFuncTestData } = require('../../../test/testHelper');
const { FilteredEventsError } = require('./errorTypes');
const { v5 } = require('uuid');
const {
  hasCircularReference,
  flattenJson,
  generateExclusionList,
  combineBatchRequestsWithSameJobIds,
  validateEventAndLowerCaseConversion,
  groupRouterTransformEvents,
  isAxiosError,
  removeHyphens,
  convertToUuid,
  sortBatchesByMinJobId,
} = require('./index');
const exp = require('constants');
const { ERROR_MESSAGES, FEATURE_FILTER_CODE } = require('./constant');

// Names of the utility functions to test
const functionNames = [
  'getDestinationExternalID',
  'isHybridModeEnabled',
  'handleSourceKeysOperation',
  'getValueFromPropertiesOrTraits',
  'getErrorStatusCode',
  'extractCustomFields',
  'batchMultiplexedEvents',
  'removeUndefinedNullValuesAndEmptyObjectArray',
  'groupEventsByType',
  'isValidInteger',
];

// Names of the utility functions to test which expects multiple arguments as values and not objects
const functionNamesExpectingMultipleArguments = [
  'checkAndCorrectUserId',
  'formatValues',
  'flattenJson',
];

describe('Utility Functions Tests', () => {
  describe.each(functionNames)('%s Tests', (funcName) => {
    const funcTestData = getFuncTestData(__dirname, `./testdata/${funcName}.json`);
    test.each(funcTestData)('$description', async ({ description, input, output }) => {
      try {
        let result;
        // This is to allow sending multiple arguments to the function
        if (Array.isArray(input)) {
          result = utilities[funcName](...input);
        } else {
          result = utilities[funcName](input);
        }
        expect(result).toEqual(output);
      } catch (e) {
        // Explicitly fail the test case
        expect(true).toEqual(false);
      }
    });
  });
  /* This is to allow sending multiple arguments to the function in case  when input is not an array but object
  * Like in case of checkAndCorrectUserId
  * "input": {
            "statusCode": 200,
            "userId": 1234
        }
  * checkAndCorrectUserId function expects two arguments statusCode and userId and not an object so we need to send them as multiple arguments
  * in the same order that they are defined in the function.
  * This order should be maintained in the input Object.
  */
  describe.each(functionNamesExpectingMultipleArguments)('%s Tests', (funcName) => {
    const funcTestData = getFuncTestData(__dirname, `./testdata/${funcName}.json`);
    test.each(funcTestData)('$description', async ({ description, input, output }) => {
      try {
        let result;
        result = utilities[funcName](...Object.values(input));
        expect(result).toEqual(output);
      } catch (e) {
        // Explicitly fail the test case
        expect(true).toEqual(false);
      }
    });
  });
});

//Test cases which can't be fit in above test suite, have individual function level test blocks

describe('hasCircularReference', () => {
  it('should return false when object has no circular reference', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(hasCircularReference(obj)).toBe(false);
  });

  it('should return true when object has circular reference', () => {
    const obj = { a: 1, b: 2 };
    obj.c = obj;
    expect(hasCircularReference(obj)).toBe(true);
  });

  it('should return true when object has nested objects containing circular reference', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    obj1.c = obj2;
    obj2.d = obj1;
    expect(hasCircularReference(obj1)).toBe(true);
  });

  it('should return false when input is null', () => {
    expect(hasCircularReference(null)).toBe(false);
  });

  it('should return false when input is not an object', () => {
    expect(hasCircularReference(123)).toBe(false);
  });

  it('should return true when object has self-reference', () => {
    const obj = { a: 1 };
    obj.b = obj;
    expect(hasCircularReference(obj)).toBe(true);
  });
});

// extra test cases for flattenJson
describe('flattenJson', () => {
  it('should throw an error when flattening a json object with circular reference', () => {
    const data = { name: 'John' };
    data.self = data;
    expect(() => flattenJson(data)).toThrow(
      "Event has circular reference. Can't flatten the event",
    );
  });
});

describe('tests for generateErrorObject', () => {
  test('test-0', () => {
    const myErr = new FilteredEventsError('error-1');
    const outputErrObj = utilities.generateErrorObject(myErr);
    expect(outputErrObj.statTags).toEqual({});
  });
});

describe('generateExclusionList', () => {
  it('should return an array of excluded keys when given a mapping config', () => {
    const mappingConfig = [
      {
        destKey: 'item_code',
        sourceKeys: ['product_id', 'sku'],
      },
      {
        destKey: 'name',
        sourceKeys: 'name',
      },
    ];
    const expected = ['product_id', 'sku', 'name'];
    const result = generateExclusionList(mappingConfig);
    expect(result).toEqual(expected);
  });

  it('should return an empty array when the mapping config is empty', () => {
    const mappingConfig = [];
    const expected = [];
    const result = generateExclusionList(mappingConfig);
    expect(result).toEqual(expected);
  });

  it('should return an array with unique keys when the mapping config has duplicate destination keys', () => {
    const mappingConfig = [
      {
        destKey: 'item_code',
        sourceKeys: ['product_id'],
      },
      {
        destKey: 'item_code',
        sourceKeys: ['sku'],
      },
    ];
    const expected = ['product_id', 'sku'];
    const result = generateExclusionList(mappingConfig);
    expect(result).toEqual(expected);
  });
});

describe('Unit test cases for combineBatchRequestsWithSameJobIds', () => {
  it('Combine batch request with same jobIds', async () => {
    const input = [
      {
        batchedRequest: {
          endpoint: 'https://endpoint1',
        },
        metadata: [
          {
            jobId: 1,
          },
          {
            jobId: 4,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
      {
        batchedRequest: {
          endpoint: 'https://endpoint2',
        },
        metadata: [
          {
            jobId: 3,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
      {
        batchedRequest: {
          endpoint: 'https://endpoint1',
        },
        metadata: [
          {
            jobId: 5,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
      {
        batchedRequest: {
          endpoint: 'https://endpoint3',
        },
        metadata: [
          {
            jobId: 1,
          },
          {
            jobId: 3,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
      {
        batchedRequest: {
          endpoint: 'https://endpoint2',
        },
        metadata: [
          {
            jobId: 6,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
    ];

    const expectedOutput = [
      {
        batchedRequest: [
          {
            endpoint: 'https://endpoint1',
          },
          {
            endpoint: 'https://endpoint3',
          },
          {
            endpoint: 'https://endpoint2',
          },
        ],
        metadata: [
          {
            jobId: 1,
          },
          {
            jobId: 3,
          },
          {
            jobId: 4,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
      {
        batchedRequest: {
          endpoint: 'https://endpoint1',
        },
        metadata: [
          {
            jobId: 5,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
      {
        batchedRequest: {
          endpoint: 'https://endpoint2',
        },
        metadata: [
          {
            jobId: 6,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
    ];
    expect(await combineBatchRequestsWithSameJobIds(input)).toEqual(expectedOutput);
  });

  it('Each batchRequest contains unique jobIds (no event multiplexing)', async () => {
    const input = [
      {
        batchedRequest: {
          endpoint: 'https://endpoint1',
        },
        metadata: [
          {
            jobId: 1,
          },
          {
            jobId: 4,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
      {
        batchedRequest: {
          endpoint: 'https://endpoint3',
        },
        metadata: [
          {
            jobId: 2,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
      {
        batchedRequest: {
          endpoint: 'https://endpoint3',
        },
        metadata: [
          {
            jobId: 5,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
    ];

    const expectedOutput = [
      {
        batchedRequest: {
          endpoint: 'https://endpoint1',
        },

        metadata: [
          {
            jobId: 1,
          },
          {
            jobId: 4,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
      {
        batchedRequest: {
          endpoint: 'https://endpoint3',
        },
        metadata: [
          {
            jobId: 2,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
      {
        batchedRequest: {
          endpoint: 'https://endpoint3',
        },
        metadata: [
          {
            jobId: 5,
          },
        ],
        batched: true,
        statusCode: 200,
        destination: {
          Config: {
            key: 'value',
          },
        },
      },
    ];
    expect(await combineBatchRequestsWithSameJobIds(input)).toEqual(expectedOutput);
  });
});

describe('validateEventAndLowerCaseConversion Tests', () => {
  it('should return string conversion of number types', () => {
    const ev = 0;
    expect(validateEventAndLowerCaseConversion(ev, false, true)).toBe('0');
    expect(validateEventAndLowerCaseConversion(ev, true, false)).toBe('0');
  });

  it('should convert string types to lowercase', () => {
    const ev = 'Abc';
    expect(validateEventAndLowerCaseConversion(ev, true, true)).toBe('abc');
  });

  it('should throw error if event is object type', () => {
    expect(() => {
      validateEventAndLowerCaseConversion({}, true, true);
    }).toThrow(InstrumentationError);
    expect(() => {
      validateEventAndLowerCaseConversion([1, 2], false, true);
    }).toThrow(InstrumentationError);
    expect(() => {
      validateEventAndLowerCaseConversion({ a: 1 }, true, true);
    }).toThrow(InstrumentationError);
  });

  it('should convert string to lowercase', () => {
    expect(validateEventAndLowerCaseConversion('Abc', true, true)).toBe('abc');
    expect(validateEventAndLowerCaseConversion('ABC', true, false)).toBe('ABC');
    expect(validateEventAndLowerCaseConversion('abc55', false, true)).toBe('abc55');
    expect(validateEventAndLowerCaseConversion(123, false, true)).toBe('123');
  });

  it('should throw error for null and undefined', () => {
    expect(() => {
      validateEventAndLowerCaseConversion(null, true, true);
    }).toThrow(InstrumentationError);
    expect(() => {
      validateEventAndLowerCaseConversion(undefined, false, true);
    }).toThrow(InstrumentationError);
  });

  it('should throw error for boolean values', () => {
    expect(() => {
      validateEventAndLowerCaseConversion(true, true, true);
    }).toThrow(InstrumentationError);
    expect(() => {
      validateEventAndLowerCaseConversion(false, false, false);
    }).toThrow(InstrumentationError);
  });
});

describe('extractCustomFields', () => {
  // Handle reserved words in message keys
  it('should handle reserved word "prototype" in message keys when keys are provided', () => {
    const message = {
      traits: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        prototype: 'reserved',
      },
      context: {
        traits: {
          phone: '1234567890',
          city: 'New York',
          country: 'USA',
          prototype: 'reserved',
        },
      },
      properties: {
        title: 'Developer',
        organization: 'ABC Company',
        zip: '12345',
        prototype: 'reserved',
      },
    };

    const payload = {};

    const keys = ['properties', 'context.traits', 'traits'];

    const exclusionFields = [
      'firstName',
      'lastName',
      'phone',
      'title',
      'organization',
      'city',
      'region',
      'country',
      'zip',
      'image',
      'timezone',
    ];

    const result = utilities.extractCustomFields(message, payload, keys, exclusionFields);

    expect(result).toEqual({
      email: 'john.doe@example.com',
    });
  });

  it('should handle reserved word "__proto__" in message keys when keys are provided', () => {
    const message = {
      traits: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        __proto__: 'reserved',
      },
      context: {
        traits: {
          phone: '1234567890',
          city: 'New York',
          country: 'USA',
          __proto__: 'reserved',
        },
      },
      properties: {
        title: 'Developer',
        organization: 'ABC Company',
        zip: '12345',
        __proto__: 'reserved',
      },
    };

    const payload = {};

    const keys = ['properties', 'context.traits', 'traits'];

    const exclusionFields = [
      'firstName',
      'lastName',
      'phone',
      'title',
      'organization',
      'city',
      'region',
      'country',
      'zip',
      'image',
      'timezone',
    ];
    const result = utilities.extractCustomFields(message, payload, keys, exclusionFields);
    expect(result).toEqual({
      email: 'john.doe@example.com',
    });
  });

  it('should handle reserved word "constructor" in message keys when keys are provided', () => {
    const message = {
      traits: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        constructor: 'reserved',
      },
      context: {
        traits: {
          phone: '1234567890',
          city: 'New York',
          country: 'USA',
          constructor: 'reserved',
        },
      },
      properties: {
        title: 'Developer',
        organization: 'ABC Company',
        zip: '12345',
        constructor: 'reserved',
      },
    };

    const payload = {};

    const keys = ['properties', 'context.traits', 'traits'];

    const exclusionFields = [
      'firstName',
      'lastName',
      'phone',
      'title',
      'organization',
      'city',
      'region',
      'country',
      'zip',
      'image',
      'timezone',
    ];
    const result = utilities.extractCustomFields(message, payload, keys, exclusionFields);
    expect(result).toEqual({
      email: 'john.doe@example.com',
    });
  });

  it('should handle reserved words in message keys when key is root', () => {
    const message = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      prototype: 'reserved',
      phone: '1234567890',
      city: 'New York',
      country: 'USA',
      __proto__: 'reserved',
      constructor: 'reserved',
    };

    const payload = {};

    const keys = 'root';

    const exclusionFields = [
      'firstName',
      'lastName',
      'phone',
      'title',
      'organization',
      'city',
      'region',
      'country',
      'zip',
      'image',
      'timezone',
    ];

    const result = utilities.extractCustomFields(message, payload, keys, exclusionFields);

    expect(result).toEqual({
      email: 'john.doe@example.com',
    });
  });
});

describe('groupRouterTransformEvents', () => {
  it('should group events by destination.ID and context.sources.job_id', async () => {
    const events = [
      {
        destination: { ID: 'dest1' },
        context: { sources: { job_id: 'job1' } },
      },
      {
        destination: { ID: 'dest1' },
        context: { sources: { job_id: 'job2' } },
      },
      {
        destination: { ID: 'dest2' },
        context: { sources: { job_id: 'job1' } },
      },
    ];
    const result = await groupRouterTransformEvents(events);

    expect(result.length).toBe(3); // 3 unique groups
    expect(result).toEqual([
      [{ destination: { ID: 'dest1' }, context: { sources: { job_id: 'job1' } } }],
      [{ destination: { ID: 'dest1' }, context: { sources: { job_id: 'job2' } } }],
      [{ destination: { ID: 'dest2' }, context: { sources: { job_id: 'job1' } } }],
    ]);
  });

  it('should group events by default job_id if context.sources.job_id is missing', async () => {
    const events = [
      {
        destination: { ID: 'dest1' },
        context: { sources: {} },
      },
      {
        destination: { ID: 'dest1' },
        context: { sources: { job_id: 'job1' } },
      },
    ];
    const result = await groupRouterTransformEvents(events);

    expect(result.length).toBe(2); // 2 unique groups
    expect(result).toEqual([
      [{ destination: { ID: 'dest1' }, context: { sources: {} } }],
      [{ destination: { ID: 'dest1' }, context: { sources: { job_id: 'job1' } } }],
    ]);
  });

  it('should group events by default job_id if context or context.sources is missing', async () => {
    const events = [
      {
        destination: { ID: 'dest1' },
      },
      {
        destination: { ID: 'dest1' },
        context: { sources: { job_id: 'job1' } },
      },
    ];
    const result = await groupRouterTransformEvents(events);

    expect(result.length).toBe(2); // 2 unique groups
    expect(result).toEqual([
      [{ destination: { ID: 'dest1' } }],
      [{ destination: { ID: 'dest1' }, context: { sources: { job_id: 'job1' } } }],
    ]);
  });

  it('should use "default" when destination.ID is missing', async () => {
    const events = [
      {
        context: { sources: { job_id: 'job1' } },
      },
      {
        destination: { ID: 'dest1' },
        context: { sources: { job_id: 'job1' } },
      },
    ];
    const result = await groupRouterTransformEvents(events);

    expect(result.length).toBe(2); // 2 unique groups
    expect(result).toEqual([
      [{ context: { sources: { job_id: 'job1' } } }],
      [{ destination: { ID: 'dest1' }, context: { sources: { job_id: 'job1' } } }],
    ]);
  });

  it('should return an empty array when there are no events', async () => {
    const events = [];
    const result = await groupRouterTransformEvents(events);

    expect(result).toEqual([]);
  });

  it('should handle events with completely missing context and destination', async () => {
    const events = [
      {},
      { destination: { ID: 'dest1' } },
      { context: { sources: { job_id: 'job1' } } },
    ];
    const result = await groupRouterTransformEvents(events);

    expect(result.length).toBe(3); // 3 unique groups
    expect(result).toEqual([
      [{}],
      [{ destination: { ID: 'dest1' } }],
      [{ context: { sources: { job_id: 'job1' } } }],
    ]);
  });

  it('should group events by destination config when hasDynamicConfig is true', async () => {
    const events = [
      {
        destination: {
          ID: 'dest1',
          hasDynamicConfig: true,
          Config: { key1: 'value1' },
        },
        context: { sources: { job_id: 'job1' } },
      },
      {
        destination: {
          ID: 'dest1',
          hasDynamicConfig: true,
          Config: { key1: 'value2' },
        },
        context: { sources: { job_id: 'job1' } },
      },
    ];
    const result = await groupRouterTransformEvents(events);

    expect(result.length).toBe(2); // 2 unique groups due to different configs
    expect(result[0][0].destination.Config.key1).toBe('value1');
    expect(result[1][0].destination.Config.key1).toBe('value2');
  });

  it('should not group events by destination config when hasDynamicConfig is false', async () => {
    const events = [
      {
        destination: {
          ID: 'dest1',
          hasDynamicConfig: false,
          Config: { key1: 'value1' },
        },
        context: { sources: { job_id: 'job1' } },
      },
      {
        destination: {
          ID: 'dest1',
          hasDynamicConfig: false,
          Config: { key1: 'value2' },
        },
        context: { sources: { job_id: 'job1' } },
      },
    ];
    const result = await groupRouterTransformEvents(events);

    expect(result.length).toBe(1); // 1 group because configs are ignored
    expect(result[0].length).toBe(2); // Both events in the same group
  });

  it('should handle undefined hasDynamicConfig flag (backward compatibility)', async () => {
    const events = [
      {
        destination: {
          ID: 'dest1',
          // hasDynamicConfig is undefined (older server versions)
          Config: { key1: 'value1' },
        },
        context: { sources: { job_id: 'job1' } },
      },
      {
        destination: {
          ID: 'dest1',
          // hasDynamicConfig is undefined (older server versions)
          Config: { key1: 'value2' },
        },
        context: { sources: { job_id: 'job1' } },
      },
    ];
    const result = await groupRouterTransformEvents(events);

    expect(result.length).toBe(2); // 2 unique groups due to different configs
    // Should group by config even when hasDynamicConfig is undefined
    // This maintains backward compatibility with older server versions
    expect(result[0][0].destination.Config.key1).toBe('value1');
    expect(result[1][0].destination.Config.key1).toBe('value2');
  });

  it('should handle configs with different key orders as the same config', async () => {
    const events = [
      {
        destination: {
          ID: 'dest1',
          hasDynamicConfig: true,
          Config: { key1: 'value1', key2: 'value2' },
        },
        context: { sources: { job_id: 'job1' } },
      },
      {
        destination: {
          ID: 'dest1',
          hasDynamicConfig: true,
          Config: { key2: 'value2', key1: 'value1' }, // Same values but different order
        },
        context: { sources: { job_id: 'job1' } },
      },
    ];
    const result = await groupRouterTransformEvents(events);

    expect(result.length).toBe(1); // 1 group because configs are equivalent
    expect(result[0].length).toBe(2); // Both events in the same group
  });
});

describe('applyJSONStringTemplate', () => {
  it('should apply JSON string template to the payload', () => {
    const payload = {
      domain: 'abc',
    };
    const template = '`https://{{$.domain}}.com`';

    const result = utilities.applyJSONStringTemplate(payload, template);
    expect(result).toEqual('https://abc.com');
  });

  it('should apply JSON string template to the payload multiple times', () => {
    const payload = {
      domain: 'abc',
      subdomain: 'def',
    };
    const template = '`https://{{$.subdomain}}.{{$.domain}}.com`';

    const result = utilities.applyJSONStringTemplate(payload, template);
    expect(result).toEqual('https://def.abc.com');
  });
});

describe('get relative path from url', () => {
  test('valid url', () => {
    expect(utilities.getRelativePathFromURL('https://google.com/a/b/c')).toEqual('/a/b/c');
  });
  test('valid url with query parameters', () => {
    expect(utilities.getRelativePathFromURL('https://google.com/a/b/c?q=1&n=2')).toEqual('/a/b/c');
  });
  test('normal string', () => {
    expect(utilities.getRelativePathFromURL('s=1&n=2')).toEqual('s=1&n=2');
  });
  test('undefined', () => {
    expect(utilities.getRelativePathFromURL(undefined)).toEqual(undefined);
  });
  test('number', () => {
    expect(utilities.getRelativePathFromURL(1)).toEqual(1);
  });
  test('null', () => {
    expect(utilities.getRelativePathFromURL(null)).toEqual(null);
  });
});

describe('isAxiosError', () => {
  const validAxiosError = {
    config: {
      adapter: ['xhr', 'fetch'],
    },
    request: {
      socket: {},
      protocol: 'https:',
      headers: {},
      method: 'GET',
      path: '/api/data',
    },
    status: 404,
    statusText: 'Not Found',
  };

  it('should return true for a valid Axios error object', () => {
    expect(isAxiosError(validAxiosError)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isAxiosError(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isAxiosError(undefined)).toBe(false);
  });

  it('should return false for non-object types', () => {
    expect(isAxiosError('string')).toBe(false);
    expect(isAxiosError(123)).toBe(false);
    expect(isAxiosError(true)).toBe(false);
    expect(isAxiosError([])).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isAxiosError({})).toBe(false);
  });

  it('should return false when config is missing', () => {
    const { config, ...errorWithoutConfig } = validAxiosError;
    expect(isAxiosError(errorWithoutConfig)).toBe(false);
  });

  it('should return false when config.adapter is not an array', () => {
    const error = { ...validAxiosError, config: { adapter: 'not an array' } };
    expect(isAxiosError(error)).toBe(false);
  });

  it('should return false when config.adapter has length <= 1', () => {
    const error = { ...validAxiosError, config: { adapter: ['some'] } };
    expect(isAxiosError(error)).toBe(false);
  });

  it('should return false when request is missing', () => {
    const { request, ...errorWithoutRequest } = validAxiosError;
    expect(isAxiosError(errorWithoutRequest)).toBe(false);
  });

  it('should return false when request.socket is missing', () => {
    const error = {
      ...validAxiosError,
      request: { ...validAxiosError.request, socket: undefined },
    };
    expect(isAxiosError(error)).toBe(false);
  });

  it('should return false when request.socket is not an object', () => {
    const error = {
      ...validAxiosError,
      request: { ...validAxiosError.request, socket: 'not an object' },
    };
    expect(isAxiosError(error)).toBe(false);
  });

  it('should return false when request.protocol is missing', () => {
    const error = {
      ...validAxiosError,
      request: { ...validAxiosError.request, protocol: undefined },
    };
    expect(isAxiosError(error)).toBe(false);
  });

  it('should return false when request.method is missing', () => {
    const error = {
      ...validAxiosError,
      request: { ...validAxiosError.request, method: undefined },
    };
    expect(isAxiosError(error)).toBe(false);
  });

  it('should return false when request.path is missing', () => {
    const error = {
      ...validAxiosError,
      request: { ...validAxiosError.request, path: undefined },
    };
    expect(isAxiosError(error)).toBe(false);
  });

  it('should return false when status is missing', () => {
    const { status, ...errorWithoutStatus } = validAxiosError;
    expect(isAxiosError(errorWithoutStatus)).toBe(false);
  });

  it('should return true when all required properties are present and valid, even with extra properties', () => {
    const errorWithExtraProps = {
      ...validAxiosError,
      extraProp: 'some value',
    };
    expect(isAxiosError(errorWithExtraProps)).toBe(true);
  });

  it('should return false when config.adapter is an empty array', () => {
    const error = { ...validAxiosError, config: { adapter: [] } };
    expect(isAxiosError(error)).toBe(false);
  });

  it('should return false when status is 0', () => {
    const error = { ...validAxiosError, status: 0 };
    expect(isAxiosError(error)).toBe(false);
  });
});

describe('removeHyphens', () => {
  const data = [
    { input: 'hello-w--orld', expected: 'helloworld' },
    { input: '', expected: '' },
    { input: null, expected: null },
    { input: undefined, expected: undefined },
    { input: 12345, expected: 12345 },
    { input: '123-12-241', expected: '12312241' },
  ];
  it('should remove hyphens from string else return the input as it is', () => {
    data.forEach(({ input, expected }) => {
      expect(removeHyphens(input)).toBe(expected);
    });
  });
});

describe('convertToUuid', () => {
  const NAMESPACE = v5.DNS;

  test('should generate UUID for valid string input', () => {
    const input = 'testInput';
    const expectedUuid = '7ba1e88f-acf9-5528-9c1c-0c897ed80e1e';
    const result = convertToUuid(input);
    expect(result).toBe(expectedUuid);
  });

  test('should generate UUID for valid numeric input', () => {
    const input = 123456;
    const expectedUuid = 'a52b2702-9bcf-5701-852a-2f4edc640fe1';
    const result = convertToUuid(input);
    expect(result).toBe(expectedUuid);
  });

  test('should trim spaces and generate UUID', () => {
    const input = '   testInput   ';
    const expectedUuid = '7ba1e88f-acf9-5528-9c1c-0c897ed80e1e';
    const result = convertToUuid(input);
    expect(result).toBe(expectedUuid);
  });

  test('should throw an error for empty input', () => {
    const input = '';
    expect(() => convertToUuid(input)).toThrow(InstrumentationError);
    expect(() => convertToUuid(input)).toThrow('Input is empty or invalid.');
  });

  test('to throw an error for null input', () => {
    const input = null;
    expect(() => convertToUuid(input)).toThrow(InstrumentationError);
    expect(() => convertToUuid(input)).toThrow('Input is undefined or null');
  });

  test('to throw an error for undefined input', () => {
    const input = undefined;
    expect(() => convertToUuid(input)).toThrow(InstrumentationError);
    expect(() => convertToUuid(input)).toThrow('Input is undefined or null');
  });

  test('should throw an error for input that is whitespace only', () => {
    const input = '   ';
    expect(() => convertToUuid(input)).toThrow(InstrumentationError);
    expect(() => convertToUuid(input)).toThrow('Input is empty or invalid.');
  });

  test('should handle long string input gracefully', () => {
    const input = 'a'.repeat(1000);
    const expectedUuid = v5(input, NAMESPACE);
    const result = convertToUuid(input);
    expect(result).toBe(expectedUuid);
  });

  test('any invalid input if stringified does not throw error', () => {
    const input = {};
    const result = convertToUuid(input);
    expect(result).toBe('672ca00c-37f4-5d71-b8c3-6ae0848080ec');
  });
});

describe('', () => {
  it('should return original value when regex pattern is invalid', () => {
    const value = 'test value';
    const metadata = {
      regex: `\\b(?!1000\\b)\\d{4,}\\b`,
    };
    try {
      const result = utilities.handleMetadataForValue(value, metadata);
    } catch (e) {
      expect(e.message).toBe(
        `The value 'test value' does not match the regex pattern, \\b(?!1000\\b)\\d{4,}\\b`,
      );
    }
  });
  it('should return true when the regex matches', () => {
    const value = 1003;
    const metadata = {
      regex: `\\b(?!1000\\b)\\d{4,}\\b`,
    };
    const res = utilities.handleMetadataForValue(value, metadata);
    expect(res).toBe(1003);
  });
});

describe('isAndroidFamily', () => {
  it('should return true for "android" platform', () => {
    expect(utilities.isAndroidFamily('android')).toBe(true);
  });

  it('should return true for "ANDROID" platform (case insensitive)', () => {
    expect(utilities.isAndroidFamily('ANDROID')).toBe(true);
  });

  it('should return false for non-android platforms', () => {
    expect(utilities.isAndroidFamily('ios')).toBe(false);
    expect(utilities.isAndroidFamily('web')).toBe(false);
    expect(utilities.isAndroidFamily('windows')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(utilities.isAndroidFamily('')).toBe(false);
  });

  it('should return false for non-string inputs', () => {
    expect(utilities.isAndroidFamily(null)).toBe(false);
    expect(utilities.isAndroidFamily(undefined)).toBe(false);
    expect(utilities.isAndroidFamily(123)).toBe(false);
    expect(utilities.isAndroidFamily({})).toBe(false);
    expect(utilities.isAndroidFamily([])).toBe(false);
    expect(utilities.isAndroidFamily(true)).toBe(false);
  });
});

describe('getBodyFromV2SpecPayload', () => {
  it('should successfully parse valid JSON body', () => {
    const input = {
      request: {
        body: '{"key": "value", "number": 123}',
      },
    };
    const expected = {
      key: 'value',
      number: 123,
    };
    expect(utilities.getBodyFromV2SpecPayload(input)).toEqual(expected);
  });

  it('should throw TransformationError for malformed JSON', () => {
    const input = {
      request: {
        body: '{invalid json}',
      },
    };
    expect(() => utilities.getBodyFromV2SpecPayload(input)).toThrow(
      ERROR_MESSAGES.MALFORMED_JSON_IN_REQUEST_BODY,
    );
  });

  it('should throw TransformationError when request body is missing', () => {
    const input = {
      request: {},
    };
    expect(() => utilities.getBodyFromV2SpecPayload(input)).toThrow(
      ERROR_MESSAGES.REQUEST_BODY_NOT_PRESENT_IN_V2_SPEC_PAYLOAD,
    );
  });

  it('should throw TransformationError when request is missing', () => {
    const input = {};
    expect(() => utilities.getBodyFromV2SpecPayload(input)).toThrow(
      ERROR_MESSAGES.REQUEST_BODY_NOT_PRESENT_IN_V2_SPEC_PAYLOAD,
    );
  });

  it('should parse empty JSON object', () => {
    const input = {
      request: {
        body: '{}',
      },
    };
    expect(utilities.getBodyFromV2SpecPayload(input)).toEqual({});
  });

  it('should parse JSON array', () => {
    const input = {
      request: {
        body: '[1,2,3]',
      },
    };
    expect(utilities.getBodyFromV2SpecPayload(input)).toEqual([1, 2, 3]);
  });

  describe('sortBatchesByMinJobId', () => {
    const testCases = [
      {
        description: 'should sort batches by the minimum jobId in each batch (ascending)',
        input: [
          { metadata: [{ jobId: 3 }, { jobId: 4 }] },
          { metadata: [{ jobId: 1 }, { jobId: 5 }] },
          { metadata: [{ jobId: 2 }] },
        ],
        expected: [
          { metadata: [{ jobId: 1 }, { jobId: 5 }] },
          { metadata: [{ jobId: 2 }] },
          { metadata: [{ jobId: 3 }, { jobId: 4 }] },
        ],
      },
      {
        description: 'should handle batches with single metadata item',
        input: [
          { metadata: [{ jobId: 10 }] },
          { metadata: [{ jobId: 2 }] },
          { metadata: [{ jobId: 5 }] },
        ],
        expected: [
          { metadata: [{ jobId: 2 }] },
          { metadata: [{ jobId: 5 }] },
          { metadata: [{ jobId: 10 }] },
        ],
      },
      {
        description: 'should handle batches with multiple metadata items and unordered jobIds',
        input: [
          { metadata: [{ jobId: 8 }, { jobId: 3 }] },
          { metadata: [{ jobId: 2 }, { jobId: 7 }] },
          { metadata: [{ jobId: 5 }, { jobId: 9 }] },
        ],
        expected: [
          { metadata: [{ jobId: 2 }, { jobId: 7 }] },
          { metadata: [{ jobId: 8 }, { jobId: 3 }] },
          { metadata: [{ jobId: 5 }, { jobId: 9 }] },
        ],
      },
      {
        description: 'should handle empty input array',
        input: [],
        expected: [],
      },
      {
        description: 'should not mutate the original array order if already sorted',
        input: [
          { metadata: [{ jobId: 1 }] },
          { metadata: [{ jobId: 2 }] },
          { metadata: [{ jobId: 3 }] },
        ],
        expected: [
          { metadata: [{ jobId: 1 }] },
          { metadata: [{ jobId: 2 }] },
          { metadata: [{ jobId: 3 }] },
        ],
      },
    ];

    test.each(testCases)('$description', ({ input, expected }) => {
      expect(sortBatchesByMinJobId(input)).toEqual(expected);
    });
  });
});

describe('isNewStatusCodesAccepted', () => {
  const testCases = [
    {
      description:
        'should return true when features object contains FEATURE_FILTER_CODE with truthy value',
      input: {
        features: {
          [FEATURE_FILTER_CODE]: true,
        },
      },
      expected: true,
    },
    {
      description:
        'should return false when features object contains FEATURE_FILTER_CODE with falsy value',
      input: {
        features: {
          [FEATURE_FILTER_CODE]: false,
        },
      },
      expected: false,
    },
    {
      description: 'should return false when features object is empty',
      input: {
        features: {},
      },
      expected: false,
    },
    {
      description: 'should return false when features property is missing',
      input: {},
      expected: false,
    },
    {
      description: 'should return false when reqMetadata is a string',
      input: 'string',
      expected: false,
    },
    {
      description: 'should return false when reqMetadata is a number',
      input: 123,
      expected: false,
    },
    {
      description: 'should return false when reqMetadata is a boolean',
      input: true,
      expected: false,
    },
    {
      description: 'should return false when reqMetadata is an array',
      input: [],
      expected: false,
    },
    {
      description: 'should return false when reqMetadata is undefined',
      input: undefined,
      expected: false,
    },
    {
      description: 'should return false when reqMetadata is null',
      input: null,
      expected: false,
    },
  ];

  test.each(testCases)('$description', ({ input, expected }) => {
    expect(utilities.isNewStatusCodesAccepted(input)).toBe(expected);
  });
});

describe('getType', () => {
  const testCases = [
    {
      description: 'should handle null value',
      input: null,
      expected: 'NULL',
    },
    {
      description: 'should handle undefined value',
      input: undefined,
      expected: 'NULL',
    },
    {
      description: 'should handle empty array',
      input: [],
      expected: 'array',
    },
    {
      description: 'should handle non-empty array',
      input: [1, 2, 3],
      expected: 'array',
    },
    {
      description: 'should handle array constructor',
      input: new Array(),
      expected: 'array',
    },
    {
      description: 'should handle empty string',
      input: '',
      expected: 'string',
    },
    {
      description: 'should handle non-empty string',
      input: 'hello',
      expected: 'string',
    },
    {
      description: 'should handle string constructor',
      input: String('test'),
      expected: 'string',
    },
    {
      description: 'should handle zero number',
      input: 0,
      expected: 'number',
    },
    {
      description: 'should handle positive integer',
      input: 123,
      expected: 'number',
    },
    {
      description: 'should handle negative number',
      input: -456,
      expected: 'number',
    },
    {
      description: 'should handle floating point number',
      input: 1.234,
      expected: 'number',
    },
    {
      description: 'should handle number constructor',
      input: Number(789),
      expected: 'number',
    },
    {
      description: 'should handle true boolean',
      input: true,
      expected: 'boolean',
    },
    {
      description: 'should handle false boolean',
      input: false,
      expected: 'boolean',
    },
    {
      description: 'should handle boolean constructor',
      input: Boolean(true),
      expected: 'boolean',
    },
    {
      description: 'should handle empty object',
      input: {},
      expected: 'object',
    },
    {
      description: 'should handle non-empty object',
      input: { key: 'value' },
      expected: 'object',
    },
    {
      description: 'should handle object constructor',
      input: new Object(),
      expected: 'object',
    },
    {
      description: 'should handle arrow function',
      input: () => {},
      expected: 'function',
    },
    {
      description: 'should handle function declaration',
      input: function () {},
      expected: 'function',
    },
    {
      description: 'should handle built-in function',
      input: Date,
      expected: 'function',
    },
    {
      description: 'should handle symbol',
      input: Symbol(),
      expected: 'symbol',
    },
    {
      description: 'should handle symbol with description',
      input: Symbol('test'),
      expected: 'symbol',
    },
  ];

  test.each(testCases)('$description', ({ input, expected }) => {
    expect(utilities.getType(input)).toBe(expected);
  });
});
