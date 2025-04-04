const {
  groupEventsByEndpoint,
  batchEvents,
  generateBatchedPayloadForArray,
  buildUtmParams,
  trimTraits,
  generatePageOrScreenCustomEventName,
  getTransformedJSON,
  getBaseEndpoint,
  getDeletionTaskBaseEndpoint,
  getCreateDeletionTaskEndpoint,
  toArray,
} = require('./util');
const { FEATURE_GZIP_SUPPORT } = require('../../util/constant');
const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { mappingConfig, ConfigCategory } = require('./config');

const maxBatchSizeMock = 2;

describe('Unit test cases for groupEventsByEndpoint', () => {
  it('should return an object with empty arrays for all properties when the events array is empty', () => {
    const events = [];
    const result = groupEventsByEndpoint(events);
    expect(result).toEqual({
      engageEvents: [],
      groupsEvents: [],
      importEvents: [],
      batchErrorRespList: [],
    });
  });

  it('should return an object with all properties containing their respective events when the events array contains events of all types', () => {
    const events = [
      {
        message: {
          endpoint: '/engage',
          body: {
            JSON_ARRAY: {
              batch: JSON.stringify([{ prop: 1 }]),
            },
          },
          userId: 'user1',
        },
      },
      {
        message: {
          endpoint: '/engage',
          body: {
            JSON_ARRAY: {
              batch: JSON.stringify([{ prop: 2 }]),
            },
          },
          userId: 'user2',
        },
      },
      {
        message: {
          endpoint: '/groups',
          body: {
            JSON_ARRAY: {
              batch: JSON.stringify([{ prop: 3 }]),
            },
          },
          userId: 'user1',
        },
      },
      {
        message: {
          endpoint: '/track',
          body: {
            JSON_ARRAY: {
              batch: JSON.stringify([{ prop: 4 }]),
            },
          },
          userId: 'user1',
        },
      },
      {
        message: {
          endpoint: '/import',
          body: {
            JSON_ARRAY: {
              batch: JSON.stringify([{ prop: 5 }]),
            },
          },
          userId: 'user2',
        },
      },
      { error: 'Message type abc not supported' },
    ];
    const result = groupEventsByEndpoint(events);
    expect(result).toEqual({
      engageEvents: [
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: JSON.stringify([{ prop: 1 }]),
              },
            },
            userId: 'user1',
          },
        },
        {
          message: {
            endpoint: '/engage',
            body: {
              JSON_ARRAY: {
                batch: JSON.stringify([{ prop: 2 }]),
              },
            },
            userId: 'user2',
          },
        },
      ],
      groupsEvents: [
        {
          message: {
            endpoint: '/groups',
            body: {
              JSON_ARRAY: {
                batch: JSON.stringify([{ prop: 3 }]),
              },
            },
            userId: 'user1',
          },
        },
      ],
      importEvents: [
        {
          message: {
            endpoint: '/import',
            body: {
              JSON_ARRAY: {
                batch: JSON.stringify([{ prop: 5 }]),
              },
            },
            userId: 'user2',
          },
        },
      ],
      batchErrorRespList: [{ error: 'Message type abc not supported' }],
    });
  });
});

describe('Unit test cases for batchEvents', () => {
  it('should return an array of batched events with correct payload and metadata', () => {
    const successRespList = [
      {
        message: {
          endpoint: '/engage',
          body: {
            JSON_ARRAY: {
              batch: JSON.stringify([{ prop: 1 }]),
            },
          },
          headers: {},
          params: {},
          userId: 'user1',
        },
        metadata: { jobId: 3 },
      },
      {
        message: {
          endpoint: '/engage',
          body: {
            JSON_ARRAY: {
              batch: JSON.stringify([{ prop: 2 }]),
            },
          },
          headers: {},
          params: {},
          userId: 'user2',
        },
        metadata: { jobId: 4 },
      },
      {
        message: {
          endpoint: '/engage',
          body: {
            JSON_ARRAY: {
              batch: JSON.stringify([{ prop: 3 }]),
            },
          },
          headers: {},
          params: {},
          userId: 'user2',
        },
        metadata: { jobId: 6 },
      },
    ];

    const result = batchEvents(successRespList, maxBatchSizeMock);

    expect(result).toEqual([
      {
        batched: true,
        batchedRequest: {
          body: {
            FORM: {},
            JSON: {},
            JSON_ARRAY: { batch: JSON.stringify([{ prop: 1 }, { prop: 2 }]) },
            XML: {},
          },
          endpoint: '/engage',
          files: {},
          headers: {},
          method: 'POST',
          params: {},
          type: 'REST',
          version: '1',
        },
        destination: undefined,
        metadata: [{ jobId: 3 }, { jobId: 4 }],
        statusCode: 200,
      },
      {
        batched: true,
        batchedRequest: {
          body: {
            FORM: {},
            JSON: {},
            JSON_ARRAY: { batch: JSON.stringify([{ prop: 3 }]) },
            XML: {},
          },
          endpoint: '/engage',
          files: {},
          headers: {},
          method: 'POST',
          params: {},
          type: 'REST',
          version: '1',
        },
        destination: undefined,
        metadata: [{ jobId: 6 }],
        statusCode: 200,
      },
    ]);
  });

  it('should return an empty array when successRespList is empty', () => {
    const successRespList = [];
    const result = batchEvents(successRespList, maxBatchSizeMock);
    expect(result).toEqual([]);
  });
});

describe('Unit test cases for generateBatchedPayloadForArray', () => {
  it('should generate a batched payload with GZIP payload for /import endpoint when given an array of events', () => {
    const events = [
      {
        body: { JSON_ARRAY: { batch: JSON.stringify([{ event: 'event1' }]) } },
        endpoint: '/import',
        headers: { 'Content-Type': 'application/json' },
        params: {},
      },
      {
        body: { JSON_ARRAY: { batch: JSON.stringify([{ event: 'event2' }]) } },
        endpoint: '/import',
        headers: { 'Content-Type': 'application/json' },
        params: {},
      },
    ];
    const expectedBatchedRequest = {
      body: {
        FORM: {},
        JSON: {},
        JSON_ARRAY: {},
        XML: {},
        GZIP: {
          payload: JSON.stringify([{ event: 'event1' }, { event: 'event2' }]),
        },
      },
      endpoint: '/import',
      files: {},
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      params: {},
      type: 'REST',
      version: '1',
    };

    const result = generateBatchedPayloadForArray(events, {
      features: { [FEATURE_GZIP_SUPPORT]: true },
    });

    expect(result).toEqual(expectedBatchedRequest);
  });

  it('should generate a batched payload with JSON_ARRAY body when given an array of events', () => {
    const events = [
      {
        body: { JSON_ARRAY: { batch: JSON.stringify([{ event: 'event1' }]) } },
        endpoint: '/endpoint',
        headers: { 'Content-Type': 'application/json' },
        params: {},
      },
      {
        body: { JSON_ARRAY: { batch: JSON.stringify([{ event: 'event2' }]) } },
        endpoint: '/endpoint',
        headers: { 'Content-Type': 'application/json' },
        params: {},
      },
    ];
    const expectedBatchedRequest = {
      body: {
        FORM: {},
        JSON: {},
        JSON_ARRAY: { batch: JSON.stringify([{ event: 'event1' }, { event: 'event2' }]) },
        XML: {},
      },
      endpoint: '/endpoint',
      files: {},
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      params: {},
      type: 'REST',
      version: '1',
    };

    const result = generateBatchedPayloadForArray(events, {
      features: { [FEATURE_GZIP_SUPPORT]: true },
    });

    expect(result).toEqual(expectedBatchedRequest);
  });
});

describe('Unit test cases for buildUtmParams', () => {
  it('should return an empty object when campaign is undefined', () => {
    const campaign = undefined;
    const result = buildUtmParams(campaign);
    expect(result).toEqual({});
  });

  it('should return an empty object when campaign is an empty object', () => {
    const campaign = {};
    const result = buildUtmParams(campaign);
    expect(result).toEqual({});
  });

  it('should return an empty object when campaign is not an object', () => {
    const campaign = [{ name: 'test' }];
    const result = buildUtmParams(campaign);
    expect(result).toEqual({});
  });

  it('should handle campaign object with null/undefined values', () => {
    const campaign = { name: null, source: 'rudder', medium: 'rudder', test: undefined };
    const result = buildUtmParams(campaign);
    expect(result).toEqual({
      utm_campaign: null,
      utm_source: 'rudder',
      utm_medium: 'rudder',
      test: undefined,
    });
  });
});
describe('Unit test cases for trimTraits', () => {
  // Given a valid traits object and contextTraits object, and a valid userProfileProperties array, the function should return an object containing traits, contextTraits, and operationTransformedProperties.
  it('should return an object containing traits, contextTraits, and operationTransformedProperties when given valid inputs', () => {
    const traits = { name: 'John', age: 30 };
    const contextTraits = { email: 'john@example.com' };
    const userProfileProperties = ['name', 'email'];

    const result = trimTraits(traits, contextTraits, userProfileProperties);

    expect(result).toEqual({
      traits: {
        age: 30,
      },
      contextTraits: {},
      operationTransformedProperties: { $name: 'John', $email: 'john@example.com' },
    });
  });

  // Given an empty traits object and contextTraits object, and a valid userProfileProperties array, the function should return an object containing empty traits and contextTraits, and an empty operationTransformedProperties.
  it('should return an object containing empty traits and contextTraits, and an empty operationTransformedProperties when given empty traits and contextTraits objects', () => {
    const traits = {};
    const contextTraits = {};
    const userProfileProperties = ['name', 'email'];

    const result = trimTraits(traits, contextTraits, userProfileProperties);

    expect(result).toEqual({
      traits: {},
      contextTraits: {},
      operationTransformedProperties: {},
    });
  });

  // Given an empty userProfileProperties array, the function should return an object containing the original traits and contextTraits objects, and an empty operationTransformedProperties .
  it('should return an object containing the original traits and contextTraits objects, and an empty operationTransformedProperties when given an empty userProfileProperties array', () => {
    const traits = { name: 'John', age: 30 };
    const contextTraits = { email: 'john@example.com' };
    const userProfileProperties = [];

    const result = trimTraits(traits, contextTraits, userProfileProperties);

    expect(result).toEqual({
      traits: { name: 'John', age: 30 },
      contextTraits: { email: 'john@example.com' },
      operationTransformedProperties: {},
    });
  });

  // Given a userProfileProperties array containing properties that do not exist in either traits or contextTraits objects, the function should not add the property to the operationTransformedProperties.
  it('should not add properties to the operationTransformedProperties when given userProfileProperties array with non-existent properties', () => {
    const traits = { name: 'John', age: 30 };
    const contextTraits = { email: 'john@example.com' };
    const userProfileProperties = ['name', 'email', 'address'];

    const result = trimTraits(traits, contextTraits, userProfileProperties);

    expect(result).toEqual({
      traits: { age: 30 },
      contextTraits: {},
      operationTransformedProperties: { $name: 'John', $email: 'john@example.com' },
    });
  });

  // Given a userProfileProperties array containing properties with nested paths that do not exist in either traits or contextTraits objects, the function should not add the property to the operationTransformedProperties.
  it('should not add properties to the operationTransformedProperties when given userProfileProperties array with non-existent nested properties', () => {
    const traits = { name: 'John', age: 30, address: 'kolkata' };
    const contextTraits = { email: 'john@example.com' };
    const userProfileProperties = ['name', 'email', 'address.city'];

    const result = trimTraits(traits, contextTraits, userProfileProperties);

    expect(result).toEqual({
      traits: { age: 30, address: 'kolkata' },
      contextTraits: {},
      operationTransformedProperties: { $name: 'John', $email: 'john@example.com' },
    });
  });

  it('should add properties to the operationTransformedProperties when given userProfileProperties array with existent nested properties', () => {
    const traits = { name: 'John', age: 30, address: { city: 'kolkata' }, isAdult: false };
    const contextTraits = { email: 'john@example.com' };
    const userProfileProperties = ['name', 'email', 'address.city'];

    const result = trimTraits(traits, contextTraits, userProfileProperties);

    expect(result).toEqual({
      traits: { age: 30, address: {}, isAdult: false },
      contextTraits: {},
      operationTransformedProperties: {
        $name: 'John',
        $email: 'john@example.com',
        $city: 'kolkata',
      },
    });
  });
});

describe('generatePageOrScreenCustomEventName', () => {
  it('should throw a ConfigurationError when userDefinedEventTemplate is not provided', () => {
    const message = { name: 'Home' };
    const userDefinedEventTemplate = undefined;
    expect(() => {
      generatePageOrScreenCustomEventName(message, userDefinedEventTemplate);
    }).toThrow(ConfigurationError);
  });

  it('should generate a custom event name when userDefinedEventTemplate contains event template and message object is provided', () => {
    let message = { name: 'Doc', properties: { category: 'Integration' } };
    const userDefinedEventTemplate = 'Viewed {{ category }} {{ name }} page';
    let expected = 'Viewed Integration Doc page';
    let result = generatePageOrScreenCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);

    message = { name: true, properties: { category: 0 } };
    expected = 'Viewed 0 true page';
    result = generatePageOrScreenCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);
  });

  it('should generate a custom event name when userDefinedEventTemplate contains event template and category or name is missing in message object', () => {
    const message = { name: 'Doc', properties: { category: undefined } };
    const userDefinedEventTemplate = 'Viewed   {{ category }}   {{ name }} page  someKeyword';
    const expected = 'Viewed     Doc page  someKeyword';
    const result = generatePageOrScreenCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);
  });

  it('should generate a custom event name when userDefinedEventTemplate contains only category or name placeholder and message object is provided', () => {
    const message = { name: 'Doc', properties: { category: 'Integration' } };
    const userDefinedEventTemplate = 'Viewed {{ name }} page';
    const expected = 'Viewed Doc page';
    const result = generatePageOrScreenCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);
  });

  it('should return the userDefinedEventTemplate when it does not contain placeholder {{}}', () => {
    const message = { name: 'Index' };
    const userDefinedEventTemplate = 'Viewed a Home page';
    const expected = 'Viewed a Home page';
    const result = generatePageOrScreenCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);
  });

  it('should return a event name when message object is not provided/empty', () => {
    const message = {};
    const userDefinedEventTemplate = 'Viewed  {{ category }}  {{ name }}  page  someKeyword';
    const expected = 'Viewed    page  someKeyword';
    const result = generatePageOrScreenCustomEventName(message, userDefinedEventTemplate);
    expect(result).toBe(expected);
  });
});

describe('Unit test cases for getTransformedJSON', () => {
  it('should transform the message payload to appropriate payload if device.token is present', () => {
    const message = {
      context: {
        app: {
          build: '1',
          name: 'LeanPlumIntegrationAndroid',
          namespace: 'com.android.SampleLeanPlum',
          version: '1.0',
        },
        device: {
          id: '5094f5704b9cf2b3',
          manufacturer: 'Google',
          model: 'Android SDK built for x86',
          name: 'generic_x86',
          type: 'ios',
          token: 'test_device_token',
        },
        network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
        os: { name: 'iOS', version: '8.1.0' },
        timezone: 'Asia/Kolkata',
        traits: { userId: 'test_user_id' },
      },
    };
    const result = getTransformedJSON(message, mappingConfig[ConfigCategory.IDENTIFY.name], true);

    const expectedResult = {
      $carrier: 'Android',
      $manufacturer: 'Google',
      $model: 'Android SDK built for x86',
      $wifi: true,
      userId: 'test_user_id',
      $ios_devices: ['test_device_token'],
      $os: 'iOS',
      $ios_device_model: 'Android SDK built for x86',
      $ios_version: '8.1.0',
      $ios_app_release: '1.0',
      $ios_app_version: '1',
    };

    expect(result).toEqual(expectedResult);
  });

  it('should transform the message payload to appropriate payload if device.token is present and device.token is null', () => {
    const message = {
      context: {
        app: {
          build: '1',
          name: 'LeanPlumIntegrationAndroid',
          namespace: 'com.android.SampleLeanPlum',
          version: '1.0',
        },
        device: {
          id: '5094f5704b9cf2b3',
          manufacturer: 'Google',
          model: 'Android SDK built for x86',
          name: 'generic_x86',
          type: 'android',
          token: null,
        },
        network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
        os: { name: 'Android', version: '8.1.0' },
        timezone: 'Asia/Kolkata',
        traits: { userId: 'test_user_id' },
      },
    };
    const result = getTransformedJSON(message, mappingConfig[ConfigCategory.IDENTIFY.name], true);

    const expectedResult = {
      $carrier: 'Android',
      $manufacturer: 'Google',
      $model: 'Android SDK built for x86',
      $wifi: true,
      userId: 'test_user_id',
      $os: 'Android',
      $android_model: 'Android SDK built for x86',
      $android_os_version: '8.1.0',
      $android_manufacturer: 'Google',
      $android_app_version: '1.0',
      $android_app_version_code: '1',
      $android_brand: 'Google',
    };

    expect(result).toEqual(expectedResult);
  });

  it('should transform the message payload to appropriate payload if device.token is not present for apple device', () => {
    const message = {
      context: {
        app: {
          build: '1',
          name: 'LeanPlumIntegrationAndroid',
          namespace: 'com.android.SampleLeanPlum',
          version: '1.0',
        },
        device: {
          id: '5094f5704b9cf2b3',
          manufacturer: 'Google',
          model: 'Android SDK built for x86',
          name: 'generic_x86',
          type: 'ios',
        },
        network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
        os: { name: 'iOS', version: '8.1.0' },
        timezone: 'Asia/Kolkata',
        traits: { userId: 'test_user_id' },
      },
    };
    const result = getTransformedJSON(message, mappingConfig[ConfigCategory.IDENTIFY.name], true);

    const expectedResult = {
      $carrier: 'Android',
      $manufacturer: 'Google',
      $model: 'Android SDK built for x86',
      $wifi: true,
      userId: 'test_user_id',
      $os: 'iOS',
      $ios_device_model: 'Android SDK built for x86',
      $ios_version: '8.1.0',
      $ios_app_release: '1.0',
      $ios_app_version: '1',
    };

    expect(result).toEqual(expectedResult);
  });

  it('should transform the message payload to appropriate payload if device.token is not present for android device', () => {
    const message = {
      context: {
        app: {
          build: '1',
          name: 'LeanPlumIntegrationAndroid',
          namespace: 'com.android.SampleLeanPlum',
          version: '1.0',
        },
        device: {
          id: '5094f5704b9cf2b3',
          manufacturer: 'Google',
          model: 'Android SDK built for x86',
          name: 'generic_x86',
          type: 'android',
          token: undefined,
        },
        network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
        os: { name: 'Android', version: '8.1.0' },
        timezone: 'Asia/Kolkata',
        traits: { userId: 'test_user_id' },
      },
    };
    const result = getTransformedJSON(message, mappingConfig[ConfigCategory.IDENTIFY.name], true);

    const expectedResult = {
      $carrier: 'Android',
      $manufacturer: 'Google',
      $model: 'Android SDK built for x86',
      $wifi: true,
      userId: 'test_user_id',
      $os: 'Android',
      $android_model: 'Android SDK built for x86',
      $android_os_version: '8.1.0',
      $android_manufacturer: 'Google',
      $android_app_version: '1.0',
      $android_app_version_code: '1',
      $android_brand: 'Google',
    };

    expect(result).toEqual(expectedResult);
  });

  it('should transform the message payload to appropriate payload if device is not present', () => {
    const message = {
      context: {
        app: {
          build: '1',
          name: 'LeanPlumIntegrationAndroid',
          namespace: 'com.android.SampleLeanPlum',
          version: '1.0',
        },
        network: { carrier: 'Android', bluetooth: false, cellular: true, wifi: true },
        os: { name: 'iOS', version: '8.1.0' },
        timezone: 'Asia/Kolkata',
        traits: { userId: 'test_user_id' },
      },
    };
    const result = getTransformedJSON(message, mappingConfig[ConfigCategory.IDENTIFY.name], true);

    const expectedResult = {
      $carrier: 'Android',
      $wifi: true,
      userId: 'test_user_id',
    };

    expect(result).toEqual(expectedResult);
  });
});

describe('getBaseEndpoint', () => {
  const testCases = [
    {
      name: 'should return BASE_ENDPOINT_EU when dataResidency is eu',
      input: { dataResidency: 'eu' },
      expected: 'https://api-eu.mixpanel.com',
    },
    {
      name: 'should return BASE_ENDPOINT_IN when dataResidency is in',
      input: { dataResidency: 'in' },
      expected: 'https://api-in.mixpanel.com',
    },
    {
      name: 'should return default BASE_ENDPOINT when dataResidency is other',
      input: { dataResidency: 'us' },
      expected: 'https://api.mixpanel.com',
    },
    {
      name: 'should return BASE_ENDPOINT when dataResidency is not provided',
      input: {},
      expected: 'https://api.mixpanel.com',
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(getBaseEndpoint(input)).toEqual(expected);
    });
  });
});

describe('getDeletionTaskBaseEndpoint', () => {
  const testCases = [
    {
      name: 'should return CREATE_DELETION_TASK_ENDPOINT_EU when dataResidency is eu',
      input: { dataResidency: 'eu' },
      expected: 'https://eu.mixpanel.com/api/app/data-deletions/v3.0/',
    },
    {
      name: 'should return CREATE_DELETION_TASK_ENDPOINT_IN when dataResidency is in',
      input: { dataResidency: 'in' },
      expected: 'https://in.mixpanel.com/api/app/data-deletions/v3.0/',
    },
    {
      name: 'should return default CREATE_DELETION_TASK_ENDPOINT when dataResidency is other',
      input: { dataResidency: 'us' },
      expected: 'https://mixpanel.com/api/app/data-deletions/v3.0/',
    },
    {
      name: 'should return CREATE_DELETION_TASK_ENDPOINT when dataResidency is not provided',
      input: {},
      expected: 'https://mixpanel.com/api/app/data-deletions/v3.0/',
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(getDeletionTaskBaseEndpoint(input)).toEqual(expected);
    });
  });
});

describe('getCreateDeletionTaskEndpoint', () => {
  const testCases = [
    {
      name: 'should return endpoint',
      input: {
        config: {
          dataResidency: 'eu',
        },
        token: 'dummy-Token',
      },
      expected: 'https://eu.mixpanel.com/api/app/data-deletions/v3.0/?token=dummy-Token',
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(getCreateDeletionTaskEndpoint(input.config, input.token)).toEqual(expected);
    });
  });
});

describe('toArray', () => {
  const testCases = [
    {
      name: 'should return an empty array for null value',
      input: null,
      expected: [],
    },
    {
      name: 'should return an empty array for undefined value',
      input: undefined,
      expected: [],
    },
    {
      name: 'should return the same array if input is already an array',
      input: [1, 2, 3],
      expected: [1, 2, 3],
    },
    {
      name: 'should return an array with the value if input is a primitive type',
      input: 42,
      expected: [42],
    },
    {
      name: 'should return an array with the string value if input is a string',
      input: 'test',
      expected: ['test'],
    },
    {
      name: 'should return an array with boolean value if input is a boolean',
      input: false,
      expected: [false],
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(toArray(input)).toEqual(expected);
    });
  });
});
