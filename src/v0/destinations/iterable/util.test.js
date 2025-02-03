const {
  pageEventPayloadBuilder,
  trackEventPayloadBuilder,
  screenEventPayloadBuilder,
  purchaseEventPayloadBuilder,
  updateCartEventPayloadBuilder,
  updateUserEventPayloadBuilder,
  registerDeviceTokenEventPayloadBuilder,
  registerBrowserTokenEventPayloadBuilder,
  hasMultipleResponses,
  getCategoryWithEndpoint,
  getCategoryUsingEventName,
  prepareAndSplitUpdateUserBatchesBasedOnPayloadSize,
  getMergeNestedObjects,
} = require('./util');
const { ConfigCategory, constructEndpoint } = require('./config');

const testMessage = {
  event: 'testEventName',
  anonymousId: 'anonId',
  traits: {
    email: 'abc@test.com',
    name: 'rudder',
    address: {
      city: 'kolkata',
      country: 'India',
    },
    createdAt: '2014-05-21T15:54:20Z',
    timestamp: '2014-05-21T15:54:20Z',
  },
  properties: {
    category: 'test',
    email: 'test@test.com',
    templateId: 1234,
    campaignId: 5678,
    name: 'pageName',
  },
  context: {
    device: {
      token: 1234,
    },
    os: {
      token: 5678,
    },
    mappedToDestination: false,
    externalId: [
      {
        id: '12345',
        identifierType: 'test_identifier',
      },
    ],
  },
};

const testConfig = {
  apiKey: '12345',
  mapToSingleEvent: false,
  trackAllPages: true,
  trackCategorisedPages: false,
  trackNamedPages: false,
};

const testEcommMessage = {
  event: 'testEventName',
  anonymousId: 'anonId',
  traits: {
    userId: 'userId',
    email: 'abc@test.com',
    name: 'rudder',
    address: {
      city: 'kolkata',
      country: 'India',
    },
    createdAt: '2014-05-21T15:54:20Z',
    timestamp: '2014-05-21T15:54:20Z',
  },
  properties: {
    product_id: 1234,
    sku: 'abcd',
    name: 'no product array present',
    category: 'categoryTest1, categoryTest2',
    price: '10',
    quantity: '2',
    total: '20',
    campaignId: '1111',
    templateId: '2222',
  },
  context: {
    device: {
      token: 1234,
    },
    os: {
      token: 5678,
    },
    mappedToDestination: false,
    externalId: [
      {
        id: '12345',
        identifierType: 'test_identifier',
      },
    ],
  },
};

describe('iterable utils test', () => {
  describe('Unit test cases for iterable constructEndpoint', () => {
    test.each([
      {
        dataCenter: 'USDC',
        category: { endpoint: 'users/update' },
        expected: 'https://api.iterable.com/api/users/update',
      },
      {
        dataCenter: 'EUDC',
        category: { endpoint: 'users/update' },
        expected: 'https://api.eu.iterable.com/api/users/update',
      },
      {
        dataCenter: 'INVALID',
        category: { endpoint: 'events/track' },
        expected: 'https://api.iterable.com/api/events/track',
      },
    ])(
      'should construct endpoint for dataCenter=$dataCenter and category=$category',
      ({ dataCenter, category, expected }) => {
        const result = constructEndpoint(dataCenter, category);
        expect(result).toBe(expected);
      },
    );
  });

  describe('Unit test cases for iterable registerDeviceTokenEventPayloadBuilder', () => {
    test.each([
      {
        deviceType: undefined,
        expectedPlatform: 'GCM',
      },
      {
        deviceType: 'ios',
        expectedPlatform: 'APNS',
      },
      {
        deviceType: 'android',
        expectedPlatform: 'GCM',
      },
    ])(
      'should build payload for deviceType=$deviceType with platform=$expectedPlatform',
      ({ deviceType, expectedPlatform }) => {
        const message = { ...testMessage };
        if (deviceType) {
          message.context.device.type = deviceType;
        }
        const expectedOutput = {
          device: {
            dataFields: {
              campaignId: 5678,
              category: 'test',
              email: 'test@test.com',
              name: 'pageName',
              templateId: 1234,
            },
            platform: expectedPlatform,
            token: 1234,
          },
          email: 'abc@test.com',
          preferUserId: true,
          userId: 'anonId',
        };
        expect(registerDeviceTokenEventPayloadBuilder(message, testConfig)).toEqual(expectedOutput);
      },
    );
  });

  describe('Unit test cases for iterable registerBrowserTokenEventPayloadBuilder', () => {
    it('should build payload for browser token', () => {
      const expectedOutput = { browserToken: 5678, email: 'abc@test.com', userId: 'anonId' };
      expect(registerBrowserTokenEventPayloadBuilder(testMessage)).toEqual(expectedOutput);
    });
  });

  describe('Unit test cases for iterable updateUserEventPayloadBuilder', () => {
    test.each([
      {
        mappedToDestination: false,
        externalId: undefined,
        expectedDataFields: {
          address: { city: 'kolkata', country: 'India' },
          createdAt: '2014-05-21T15:54:20Z',
          email: 'abc@test.com',
          name: 'rudder',
          timestamp: '2014-05-21T15:54:20Z',
        },
      },
      {
        mappedToDestination: true,
        externalId: '12345',
        expectedDataFields: {
          address: { city: 'kolkata', country: 'India' },
          createdAt: '2014-05-21T15:54:20Z',
          email: 'abc@test.com',
          name: 'rudder',
          test_identifier: '12345',
          timestamp: '2014-05-21T15:54:20Z',
        },
      },
    ])(
      'should build payload with mappedToDestination=$mappedToDestination and externalId=$externalId',
      ({ mappedToDestination, externalId, expectedDataFields }) => {
        const message = { ...testMessage };
        message.context.mappedToDestination = mappedToDestination;
        if (externalId) {
          message.context.externalId[0].id = externalId;
        }
        const expectedOutput = {
          dataFields: expectedDataFields,
          email: 'abc@test.com',
          mergeNestedObjects: true,
          preferUserId: true,
          userId: 'anonId',
        };
        expect(updateUserEventPayloadBuilder(message, ConfigCategory.IDENTIFY, testConfig)).toEqual(
          expectedOutput,
        );
      },
    );
  });

  describe('Unit test cases for iterable pageEventPayloadBuilder', () => {
    test.each([
      {
        config: { trackAllPages: true, trackCategorisedPages: false, trackNamedPages: false },
        eventName: 'pageName page',
      },
      {
        config: { trackAllPages: false, trackCategorisedPages: true, trackNamedPages: false },
        eventName: 'pageName page',
      },
      {
        config: { trackAllPages: false, trackCategorisedPages: false, trackNamedPages: true },
        eventName: 'pageName page',
      },
      {
        config: {
          mapToSingleEvent: true,
          trackAllPages: false,
          trackCategorisedPages: false,
          trackNamedPages: true,
        },
        eventName: 'Loaded a Page',
      },
    ])('should build page event payload with config=$config', ({ config, eventName }) => {
      const destination = { Config: { ...testConfig, ...config }, Enabled: true };
      const expectedOutput = {
        campaignId: 5678,
        createdAt: 1400687660000,
        dataFields: {
          campaignId: 5678,
          category: 'test',
          email: 'test@test.com',
          name: 'pageName',
          templateId: 1234,
        },
        email: 'test@test.com',
        eventName,
        templateId: 1234,
        userId: 'anonId',
      };
      expect(
        pageEventPayloadBuilder({ ...testMessage, type: 'page' }, destination, ConfigCategory.PAGE),
      ).toEqual(expectedOutput);
    });
  });

  describe('Unit test cases for iterable screenEventPayloadBuilder', () => {
    test.each([
      {
        description: 'For trackAllPages',
        destination: {
          Config: {
            apiKey: '12345',
            mapToSingleEvent: false,
            trackAllPages: true,
            trackCategorisedPages: false,
            trackNamedPages: false,
          },
          Enabled: true,
        },
        expectedOutput: {
          campaignId: 5678,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: 1234,
          },
          email: 'test@test.com',
          eventName: 'pageName screen',
          templateId: 1234,
          userId: 'anonId',
        },
      },
      {
        description: 'For trackCategorisedPages',
        destination: {
          Config: {
            apiKey: '12345',
            mapToSingleEvent: false,
            trackAllPages: false,
            trackCategorisedPages: true,
            trackNamedPages: false,
          },
          Enabled: true,
        },
        expectedOutput: {
          campaignId: 5678,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: 1234,
          },
          email: 'test@test.com',
          eventName: 'pageName screen',
          templateId: 1234,
          userId: 'anonId',
        },
      },
      {
        description: 'For trackNamedPages',
        destination: {
          Config: {
            apiKey: '12345',
            mapToSingleEvent: false,
            trackAllPages: false,
            trackCategorisedPages: false,
            trackNamedPages: true,
          },
          Enabled: true,
        },
        expectedOutput: {
          campaignId: 5678,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: 1234,
          },
          email: 'test@test.com',
          eventName: 'pageName screen',
          templateId: 1234,
          userId: 'anonId',
        },
      },
      {
        description: 'For mapToSingleEvent',
        destination: {
          Config: {
            apiKey: '12345',
            mapToSingleEvent: true,
            trackAllPages: false,
            trackCategorisedPages: false,
            trackNamedPages: true,
          },
          Enabled: true,
        },
        expectedOutput: {
          campaignId: 5678,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: 1234,
          },
          email: 'test@test.com',
          eventName: 'Loaded a Screen',
          templateId: 1234,
          userId: 'anonId',
        },
      },
      {
        description: 'For non-mapToSingleEvent',
        destination: {
          Config: {
            apiKey: '12345',
            mapToSingleEvent: false,
            trackAllPages: false,
            trackCategorisedPages: false,
            trackNamedPages: true,
          },
          Enabled: true,
        },
        expectedOutput: {
          campaignId: 5678,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: 1234,
          },
          email: 'test@test.com',
          eventName: 'pageName screen',
          templateId: 1234,
          userId: 'anonId',
        },
      },
    ])('$description', ({ destination, expectedOutput }) => {
      const message = { ...testMessage, type: 'screen' };
      const result = screenEventPayloadBuilder(message, destination, ConfigCategory.SCREEN);
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('Unit test cases for iterable trackEventPayloadBuilder', () => {
    test.each([
      {
        description: 'Valid payload with all fields',
        message: testMessage,
        category: ConfigCategory.TRACK,
        expectedOutput: {
          campaignId: 5678,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: 1234,
          },
          email: 'test@test.com',
          eventName: 'testEventName',
          templateId: 1234,
          userId: 'anonId',
        },
      },
      {
        description: 'Payload without campaignId and templateId',
        message: {
          ...testMessage,
          properties: {
            ...testMessage.properties,
            campaignId: undefined,
            templateId: undefined,
          },
        },
        category: ConfigCategory.TRACK,
        expectedOutput: {
          campaignId: undefined,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: undefined,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: undefined,
          },
          email: 'test@test.com',
          eventName: 'testEventName',
          templateId: undefined,
          userId: 'anonId',
        },
      },
      {
        description: 'Payload without email',
        message: {
          ...testMessage,
          properties: {
            ...testMessage.properties,
            email: undefined,
          },
        },
        category: ConfigCategory.TRACK,
        expectedOutput: {
          campaignId: 5678,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: undefined,
            name: 'pageName',
            templateId: 1234,
          },
          email: undefined,
          eventName: 'testEventName',
          templateId: 1234,
          userId: 'anonId',
        },
      },
      {
        description: 'Payload without userId',
        message: {
          ...testMessage,
          anonymousId: undefined,
        },
        category: ConfigCategory.TRACK,
        expectedOutput: {
          campaignId: 5678,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: 1234,
          },
          email: 'test@test.com',
          eventName: 'testEventName',
          templateId: 1234,
          userId: undefined,
        },
      },
    ])('$description', ({ message, category, expectedOutput }) => {
      const result = trackEventPayloadBuilder(message, category);
      expect(result).toEqual(expectedOutput);
    });

    test('should throw an error if neither email nor userId is present', () => {
      const invalidMessage = {
        ...testMessage,
        properties: { ...testMessage.properties, email: undefined },
        anonymousId: undefined,
      };

      expect(() => trackEventPayloadBuilder(invalidMessage, ConfigCategory.TRACK)).toThrow(
        'userId or email is mandatory for this request',
      );
    });
  });

  describe('Unit test cases for iterable purchaseEventPayloadBuilder', () => {
    test.each([
      {
        description: 'Valid payload without product array',
        message: testEcommMessage,
        category: ConfigCategory.TRACK_PURCHASE,
        config: testConfig,
        expectedOutput: {
          campaignId: 1111,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: '1111',
            category: 'categoryTest1, categoryTest2',
            name: 'no product array present',
            price: '10',
            product_id: 1234,
            quantity: '2',
            sku: 'abcd',
            templateId: '2222',
            total: '20',
          },
          items: [
            {
              categories: ['categoryTest1', ' categoryTest2'],
              id: 1234,
              name: 'no product array present',
              price: 10,
              quantity: 2,
              sku: 'abcd',
            },
          ],
          templateId: 2222,
          total: 20,
          user: {
            dataFields: {
              address: { city: 'kolkata', country: 'India' },
              createdAt: '2014-05-21T15:54:20Z',
              email: 'abc@test.com',
              name: 'rudder',
              timestamp: '2014-05-21T15:54:20Z',
              userId: 'userId',
            },
            email: 'abc@test.com',
            mergeNestedObjects: true,
            preferUserId: true,
            userId: 'userId',
          },
        },
      },
      {
        description: 'Valid payload with product array',
        message: {
          ...testEcommMessage,
          properties: {
            ...testEcommMessage.properties,
            products: [
              {
                product_id: 1234,
                sku: 'abcd',
                name: 'product 1',
                category: 'categoryTest1, categoryTest2',
                price: '10',
                quantity: '2',
                total: '20',
              },
            ],
          },
        },
        category: ConfigCategory.TRACK_PURCHASE,
        config: testConfig,
        expectedOutput: {
          campaignId: 1111,
          createdAt: 1400687660000,
          dataFields: {
            campaignId: '1111',
            category: 'categoryTest1, categoryTest2',
            name: 'no product array present',
            price: '10',
            product_id: 1234,
            products: [
              {
                category: 'categoryTest1, categoryTest2',
                name: 'product 1',
                price: '10',
                product_id: 1234,
                quantity: '2',
                sku: 'abcd',
                total: '20',
              },
            ],
            quantity: '2',
            sku: 'abcd',
            templateId: '2222',
            total: '20',
          },
          items: [
            {
              categories: ['categoryTest1', ' categoryTest2'],
              id: 1234,
              name: 'product 1',
              price: 10,
              quantity: 2,
              sku: 'abcd',
            },
          ],
          templateId: 2222,
          total: 20,
          user: {
            dataFields: {
              address: { city: 'kolkata', country: 'India' },
              createdAt: '2014-05-21T15:54:20Z',
              email: 'abc@test.com',
              name: 'rudder',
              timestamp: '2014-05-21T15:54:20Z',
              userId: 'userId',
            },
            email: 'abc@test.com',
            mergeNestedObjects: true,
            preferUserId: true,
            userId: 'userId',
          },
        },
      },
    ])('$description', ({ message, category, config, expectedOutput }) => {
      const result = purchaseEventPayloadBuilder(message, category, config);
      expect(result).toEqual(expectedOutput);
    });

    test('should throw an error if neither email nor userId is present', () => {
      const invalidMessage = {
        ...testEcommMessage,
        traits: { ...testEcommMessage.traits, email: undefined, userId: undefined },
        anonymousId: undefined,
      };

      expect(() =>
        purchaseEventPayloadBuilder(invalidMessage, ConfigCategory.TRACK_PURCHASE, testConfig),
      ).toThrow('userId or email is mandatory for this request');
    });
  });

  describe('Unit test cases for iterable updateCartEventPayloadBuilder', () => {
    test.each([
      {
        description: 'Valid payload without product array',
        message: testEcommMessage,
        config: testConfig,
        expectedOutput: {
          items: [
            {
              categories: ['categoryTest1', ' categoryTest2'],
              id: 1234,
              name: 'no product array present',
              price: 10,
              quantity: 2,
              sku: 'abcd',
            },
          ],
          user: {
            dataFields: {
              address: { city: 'kolkata', country: 'India' },
              createdAt: '2014-05-21T15:54:20Z',
              email: 'abc@test.com',
              name: 'rudder',
              timestamp: '2014-05-21T15:54:20Z',
              userId: 'userId',
            },
            email: 'abc@test.com',
            mergeNestedObjects: true,
            preferUserId: true,
            userId: 'userId',
          },
        },
      },
      {
        description: 'Valid payload with product array',
        message: {
          ...testEcommMessage,
          properties: {
            ...testEcommMessage.properties,
            products: [
              {
                product_id: 1234,
                sku: 'abcd',
                name: 'product 1',
                category: 'categoryTest1, categoryTest2',
                price: '10',
                quantity: '2',
                total: '20',
              },
            ],
          },
        },
        config: testConfig,
        expectedOutput: {
          items: [
            {
              categories: ['categoryTest1', ' categoryTest2'],
              id: 1234,
              name: 'product 1',
              price: 10,
              quantity: 2,
              sku: 'abcd',
            },
          ],
          user: {
            dataFields: {
              address: { city: 'kolkata', country: 'India' },
              createdAt: '2014-05-21T15:54:20Z',
              email: 'abc@test.com',
              name: 'rudder',
              timestamp: '2014-05-21T15:54:20Z',
              userId: 'userId',
            },
            email: 'abc@test.com',
            mergeNestedObjects: true,
            preferUserId: true,
            userId: 'userId',
          },
        },
      },
    ])('$description', ({ message, config, expectedOutput }) => {
      const result = updateCartEventPayloadBuilder(message, config);
      expect(result).toEqual(expectedOutput);
    });

    test('should throw an error if neither email nor userId is present', () => {
      const invalidMessage = {
        ...testEcommMessage,
        traits: { ...testEcommMessage.traits, email: undefined, userId: undefined },
        anonymousId: undefined,
      };

      expect(() => updateCartEventPayloadBuilder(invalidMessage, testConfig)).toThrow(
        'userId or email is mandatory for this request',
      );
    });
  });

  describe('Unit test cases for iterable hasMultipleResponses', () => {
    test.each([
      {
        description: 'should return false when message type is not identify',
        message: {
          type: 'track',
          context: {
            device: { token: '123' },
            os: { token: '456' },
          },
        },
        category: getCategoryWithEndpoint(ConfigCategory.IDENTIFY, 'USDC'),
        config: { registerDeviceOrBrowserApiKey: 'test-key' },
        expected: false,
      },
      {
        description: 'should return false when category is not identify',
        message: {
          type: 'identify',
          context: {
            device: { token: '123' },
            os: { token: '456' },
          },
        },
        category: getCategoryWithEndpoint(ConfigCategory.PAGE, 'USDC'),
        config: { registerDeviceOrBrowserApiKey: 'test-key' },
        expected: false,
      },
      {
        description: 'should return false when no device/os token is present',
        message: {
          type: 'identify',
          context: {
            device: {},
            os: {},
          },
        },
        category: getCategoryWithEndpoint(ConfigCategory.IDENTIFY, 'USDC'),
        config: { registerDeviceOrBrowserApiKey: 'test-key' },
        expected: false,
      },
      {
        description:
          'should return false when registerDeviceOrBrowserApiKey is not present in config',
        message: {
          type: 'identify',
          context: {
            device: { token: '123' },
            os: { token: '456' },
          },
        },
        category: getCategoryWithEndpoint(ConfigCategory.IDENTIFY, 'USDC'),
        config: {},
        expected: false,
      },
      {
        description: 'should return true when all conditions are met with device token',
        message: {
          type: 'identify',
          context: {
            device: { token: '123' },
          },
        },
        category: getCategoryWithEndpoint(ConfigCategory.IDENTIFY, 'USDC'),
        config: {
          dataCenter: 'USDC',
          registerDeviceOrBrowserApiKey: 'test-key',
        },
        expected: true,
      },
      {
        description: 'should return true when all conditions are met with os token',
        message: {
          type: 'identify',
          context: {
            os: { token: '456' },
          },
        },
        category: getCategoryWithEndpoint(ConfigCategory.IDENTIFY, 'USDC'),
        config: {
          dataCenter: 'USDC',
          registerDeviceOrBrowserApiKey: 'test-key',
        },
        expected: true,
      },
    ])('$description', ({ message, category, config, expected }) => {
      const result = hasMultipleResponses(message, category, config);
      expect(result).toBe(expected);
    });
  });

  describe('Unit test cases for iterable getCategoryUsingEventName', () => {
    test.each([
      {
        description: 'should return TRACK_PURCHASE category when event is "order completed"',
        message: {
          event: 'order completed',
          properties: {
            total: 100,
          },
        },
        dataCenter: 'USDC',
        expected: {
          name: 'IterableTrackPurchaseConfig',
          action: 'trackPurchase',
          endpoint: 'https://api.iterable.com/api/commerce/trackPurchase',
        },
      },
      {
        description: 'should return UPDATE_CART category when event is "product added"',
        message: {
          event: 'product added',
          properties: {
            total: 100,
          },
        },
        dataCenter: 'USDC',
        expected: {
          ...ConfigCategory.UPDATE_CART,
          endpoint: 'https://api.iterable.com/api/commerce/updateCart',
        },
      },
      {
        description: 'should return UPDATE_CART category when event is "product removed"',
        message: {
          event: 'PRODUCT REMOVED',
          properties: {
            total: 100,
          },
        },
        dataCenter: 'EUDC',
        expected: {
          ...ConfigCategory.UPDATE_CART,
          endpoint: 'https://api.eu.iterable.com/api/commerce/updateCart',
        },
      },
      {
        description: 'should return TRACK category when event is a generic event',
        message: {
          event: 'custom event',
          properties: {
            total: 100,
          },
        },
        dataCenter: 'USDC',
        expected: {
          ...ConfigCategory.TRACK,
          endpoint: 'https://api.iterable.com/api/events/track',
        },
      },
    ])('$description', ({ message, dataCenter, expected }) => {
      const result = getCategoryUsingEventName(message, dataCenter);
      expect(result).toEqual(expected);
    });
  });
  describe('Unit test cases for iterable prepareAndSplitUpdateUserBatchesBasedOnPayloadSize', () => {
    test.each([
      {
        description: 'should split events into multiple batches when payload size exceeds limit',
        chunk: [
          {
            metadata: { jobId: '1' },
            destination: 'dest1',
            message: { body: { JSON: { id: '1', data: 'a'.repeat(3000000) } } },
          },
          {
            metadata: { jobId: '2' },
            destination: 'dest1',
            message: { body: { JSON: { id: '2', data: 'b'.repeat(3000000) } } },
          },
        ],
        registerDeviceOrBrowserTokenEvents: {
          1: { deviceToken: 'token1' },
          2: { deviceToken: 'token2' },
        },
        expectedBatches: [
          {
            users: [{ id: '1', data: 'a'.repeat(3000000) }],
            metadata: [{ jobId: '1' }],
            nonBatchedRequests: [{ deviceToken: 'token1' }],
            destination: 'dest1',
          },
          {
            users: [{ id: '2', data: 'b'.repeat(3000000) }],
            metadata: [{ jobId: '2' }],
            nonBatchedRequests: [{ deviceToken: 'token2' }],
            destination: 'dest1',
          },
        ],
      },
      {
        description: 'should return empty batches array for empty input chunk',
        chunk: [],
        registerDeviceOrBrowserTokenEvents: {},
        expectedBatches: [],
      },
      {
        description: 'should create batches with users, metadata, and non-batched requests arrays',
        chunk: [
          {
            metadata: { jobId: '1' },
            destination: 'dest1',
            message: { body: { JSON: { id: '1' } } },
          },
          {
            metadata: { jobId: '2' },
            destination: 'dest1',
            message: { body: { JSON: { id: '2' } } },
          },
        ],
        registerDeviceOrBrowserTokenEvents: {},
        expectedBatches: [
          {
            users: [{ id: '1' }, { id: '2' }],
            metadata: [{ jobId: '1' }, { jobId: '2' }],
            nonBatchedRequests: [],
            destination: 'dest1',
          },
        ],
      },
      {
        description: 'should add device/browser token events to nonBatchedRequests array',
        chunk: [
          {
            metadata: { jobId: '1' },
            destination: 'dest1',
            message: { body: { JSON: { id: '1' } } },
          },
        ],
        registerDeviceOrBrowserTokenEvents: {
          1: { deviceToken: 'token1' },
        },
        expectedBatches: [
          {
            users: [{ id: '1' }],
            metadata: [{ jobId: '1' }],
            nonBatchedRequests: [{ deviceToken: 'token1' }],
            destination: 'dest1',
          },
        ],
      },
      {
        description: 'should create final batch even if size limit not reached',
        chunk: [
          {
            metadata: { jobId: '1' },
            destination: 'dest1',
            message: { body: { JSON: { id: '1' } } },
          },
        ],
        registerDeviceOrBrowserTokenEvents: {
          1: { deviceToken: 'token1' },
        },
        expectedBatches: [
          {
            users: [{ id: '1' }],
            metadata: [{ jobId: '1' }],
            nonBatchedRequests: [{ deviceToken: 'token1' }],
            destination: 'dest1',
          },
        ],
      },
    ])('$description', ({ chunk, registerDeviceOrBrowserTokenEvents, expectedBatches }) => {
      const result = prepareAndSplitUpdateUserBatchesBasedOnPayloadSize(
        chunk,
        registerDeviceOrBrowserTokenEvents,
      );

      expect(result).toEqual(expectedBatches);
    });
  });

  describe('Unit test cases for iterable getMergeNestedObjects', () => {
    test.each([
      {
        description: 'should return true when mergeNestedObjects is undefined',
        config: {},
        expected: true,
      },
      {
        description: 'should return true when mergeNestedObjects is true',
        config: { mergeNestedObjects: true },
        expected: true,
      },
      {
        description: 'should return false when mergeNestedObjects is false',
        config: { mergeNestedObjects: false },
        expected: false,
      },
    ])('$description', ({ config, expected }) => {
      const result = getMergeNestedObjects(config);
      expect(result).toBe(expected);
    });
  });
});
