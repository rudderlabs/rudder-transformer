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
  validateMixpanelPayloadLimits,
  toArray,
} = require('./util');
const { FEATURE_GZIP_SUPPORT } = require('../../util/constant');
const { ConfigurationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  mappingConfig,
  ConfigCategory,
  MAX_PROPERTY_KEYS_COUNT,
  MAX_ARRAY_ELEMENTS_COUNT,
  MAX_NESTING_DEPTH,
} = require('./config');

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
  const testCases = [
    {
      name: 'should return an object containing traits, contextTraits, and operationTransformedProperties when given valid inputs',
      input: {
        traits: { name: 'John', age: 30, email: 'john@example.com' },
        contextTraits: { email: 'john@example.com' },
        userProfileProperties: ['name', 'email'],
      },
      expected: {
        traits: { age: 30 },
        contextTraits: {},
        operationTransformedProperties: { $name: 'John', $email: 'john@example.com' },
      },
    },
    {
      name: 'should return an object containing empty traits and contextTraits, and an empty operationTransformedProperties when given empty traits and contextTraits objects',
      input: {
        traits: {},
        contextTraits: { phone: '0123456789' },
        userProfileProperties: ['name', 'email'],
      },
      expected: {
        traits: {},
        contextTraits: { phone: '0123456789' },
        operationTransformedProperties: {},
      },
    },
    {
      name: 'should return an object containing the original traits and contextTraits objects, and an empty operationTransformedProperties when given an empty userProfileProperties array',
      input: {
        traits: { name: 'John', age: 30 },
        contextTraits: { email: 'john@example.com' },
        userProfileProperties: [],
      },
      expected: {
        traits: { name: 'John', age: 30 },
        contextTraits: { email: 'john@example.com' },
        operationTransformedProperties: {},
      },
    },
    {
      name: 'should not add properties to the operationTransformedProperties when given userProfileProperties array with non-existent properties',
      input: {
        traits: { name: 'John', age: 30 },
        contextTraits: { email: 'john@example.com' },
        userProfileProperties: ['name', 'email', 'address'],
      },
      expected: {
        traits: { age: 30 },
        contextTraits: {},
        operationTransformedProperties: { $name: 'John', $email: 'john@example.com' },
      },
    },
    {
      name: 'should not add properties to the operationTransformedProperties when given userProfileProperties array with non-existent nested properties',
      input: {
        traits: { name: 'John', age: 30, address: 'kolkata' },
        contextTraits: { email: 'john@example.com' },
        userProfileProperties: ['name', 'email', 'address.city'],
      },
      expected: {
        traits: { age: 30, address: 'kolkata' },
        contextTraits: {},
        operationTransformedProperties: { $name: 'John', $email: 'john@example.com' },
      },
    },
    {
      name: 'should add properties to the operationTransformedProperties when given userProfileProperties array with existent nested properties',
      input: {
        traits: { name: 'John', age: 30, address: { city: 'kolkata' }, isAdult: false },
        contextTraits: { email: 'john@example.com' },
        userProfileProperties: ['name', 'email', 'address.city'],
      },
      expected: {
        traits: { age: 30, address: {}, isAdult: false },
        contextTraits: {},
        operationTransformedProperties: {
          $name: 'John',
          $email: 'john@example.com',
          $city: 'kolkata',
        },
      },
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = trimTraits(input.traits, input.contextTraits, input.userProfileProperties);
      expect(result).toEqual(expected);
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

describe('validateMixpanelPayloadLimits', () => {
  it('should not throw error for valid properties object', () => {
    const properties = {
      prop1: 'value1',
      prop2: 'value2',
      prop3: { nestedProp: 'nestedValue' },
      prop4: [1, 2, 3],
    };

    expect(() => validateMixpanelPayloadLimits(properties)).not.toThrow();
  });

  it('should throw error when properties exceed the maximum key limit', () => {
    // Create an object with MAX_PROPERTY_KEYS_COUNT + 1 properties
    const properties = {};
    for (let i = 0; i < MAX_PROPERTY_KEYS_COUNT + 1; i++) {
      properties[`prop${i}`] = `value${i}`;
    }

    expect(() => validateMixpanelPayloadLimits(properties)).toThrow(InstrumentationError);
    expect(() => validateMixpanelPayloadLimits(properties)).toThrow(
      `Mixpanel properties exceed the limit of ${MAX_PROPERTY_KEYS_COUNT} keys`,
    );
  });

  it('should throw error when nested object properties exceed the maximum key limit', () => {
    // Create a nested object with MAX_PROPERTY_KEYS_COUNT + 1 properties
    const nestedProperties = {};
    for (let i = 0; i < MAX_PROPERTY_KEYS_COUNT + 1; i++) {
      nestedProperties[`nestedProp${i}`] = `nestedValue${i}`;
    }

    const properties = {
      prop1: 'value1',
      prop2: nestedProperties,
    };

    expect(() => validateMixpanelPayloadLimits(properties)).toThrow(InstrumentationError);
    expect(() => validateMixpanelPayloadLimits(properties)).toThrow(
      `Mixpanel properties at prop2 exceed the limit of ${MAX_PROPERTY_KEYS_COUNT} keys`,
    );
  });

  it('should throw error when array properties exceed the maximum element limit', () => {
    // Create an array with MAX_ARRAY_ELEMENTS_COUNT + 1 elements
    const array = [];
    for (let i = 0; i < MAX_ARRAY_ELEMENTS_COUNT + 1; i++) {
      array.push(`element${i}`);
    }

    const properties = {
      prop1: 'value1',
      prop2: array,
    };

    expect(() => validateMixpanelPayloadLimits(properties)).toThrow(InstrumentationError);
    expect(() => validateMixpanelPayloadLimits(properties)).toThrow(
      `Mixpanel array property 'prop2' exceeds the limit of ${MAX_ARRAY_ELEMENTS_COUNT} elements`,
    );
  });

  it('should throw error when nesting depth exceeds the maximum', () => {
    // Create a deeply nested object that exceeds MAX_NESTING_DEPTH
    let deepObject = { value: 'test' };
    for (let i = 0; i < MAX_NESTING_DEPTH; i++) {
      deepObject = { nested: deepObject };
    }

    const properties = {
      prop1: deepObject,
    };

    expect(() => validateMixpanelPayloadLimits(properties)).not.toThrow();
  });

  it('should handle non-object input gracefully', () => {
    expect(() => validateMixpanelPayloadLimits(null)).not.toThrow();
    expect(() => validateMixpanelPayloadLimits(undefined)).not.toThrow();
    expect(() => validateMixpanelPayloadLimits('string')).not.toThrow();
    expect(() => validateMixpanelPayloadLimits(123)).not.toThrow();
    expect(() => validateMixpanelPayloadLimits(true)).not.toThrow();
    expect(() => validateMixpanelPayloadLimits([])).not.toThrow();
  });

  it('should throw error when an object within an array exceeds the property limit', () => {
    // Create an object with MAX_PROPERTY_KEYS_COUNT + 1 properties
    const objectWithTooManyProps = {};
    for (let i = 0; i < MAX_PROPERTY_KEYS_COUNT + 1; i++) {
      objectWithTooManyProps[`prop${i}`] = `value${i}`;
    }

    const properties = {
      prop1: 'value1',
      prop2: [1, 2, objectWithTooManyProps],
    };

    expect(() => validateMixpanelPayloadLimits(properties)).toThrow(InstrumentationError);
    expect(() => validateMixpanelPayloadLimits(properties)).toThrow(
      `Mixpanel properties at prop2[2] exceed the limit of ${MAX_PROPERTY_KEYS_COUNT} keys`,
    );
  });

  it('should handle complex objects with multiple levels of nesting correctly', () => {
    // Create a valid complex object with multiple levels of nesting
    const complexObject = {
      level1: {
        level2: {
          level3: {
            // This is at depth 3, which is the maximum allowed
            property: 'value',
            array: [1, 2, 3],
          },
        },
      },
    };

    expect(() => validateMixpanelPayloadLimits(complexObject)).not.toThrow();

    // Now add one more level to exceed the maximum depth
    const tooDeepObject = {
      level1: {
        level2: {
          level3: {
            level4: {
              // This exceeds MAX_NESTING_DEPTH
              property: 'value',
            },
          },
        },
      },
    };

    expect(() => validateMixpanelPayloadLimits(tooDeepObject)).not.toThrow();
  });
});
