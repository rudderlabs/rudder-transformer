const jsonSize = require('json-size');
const { get } = require('lodash');
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
} = require('./util');
const { ConfigCategory, constructEndpoint } = require('./config');

const dataCenter = 'USDC';
const dataCenterEU = 'EUDC';

const getTestMessage = () => {
  let message = {
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
  return message;
};

const getTestConfig = () => {
  let config = {
    apiKey: '12345',
    mapToSingleEvent: false,
    trackAllPages: true,
    trackCategorisedPages: false,
    trackNamedPages: false,
  };
  return config;
};

const getTestEcommMessage = () => {
  let message = {
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
  return message;
};

describe('iterable utils test', () => {
  describe('Unit test cases for iterable constructEndpoint', () => {
    // Constructs endpoint URL by combining USDC base URL with category endpoint
    it('should combine USDC and EUDC base URL with category endpoint', () => {
      const category = { endpoint: 'users/update' };

      const result = constructEndpoint(dataCenter, category);
      const resultEU = constructEndpoint(dataCenterEU, category);

      expect(result).toBe('https://api.iterable.com/api/users/update');
      expect(resultEU).toBe('https://api.eu.iterable.com/api/users/update');
    });

    // Defaults to USDC base URL when invalid dataCenter is provided
    it('should default to USDC base URL when invalid dataCenter provided', () => {
      const dataCenter = 'INVALID';
      const category = { endpoint: 'events/track' };

      const result = constructEndpoint(dataCenter, category);

      expect(result).toBe('https://api.iterable.com/api/events/track');
    });
  });
  describe('Unit test cases for iterable registerDeviceTokenEventPayloadBuilder', () => {
    it('for no device type', async () => {
      let expectedOutput = {
        device: {
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: 1234,
          },
          platform: 'GCM',
          token: 1234,
        },
        email: 'abc@test.com',
        preferUserId: true,
        userId: 'anonId',
      };
      expect(registerDeviceTokenEventPayloadBuilder(getTestMessage(), getTestConfig())).toEqual(
        expectedOutput,
      );
    });
    it('For apple family device type', async () => {
      const fittingPayload = { ...getTestMessage() };
      fittingPayload.context.device.type = 'ios';
      let expectedOutput = {
        device: {
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: 1234,
          },
          platform: 'APNS',
          token: 1234,
        },
        email: 'abc@test.com',
        preferUserId: true,
        userId: 'anonId',
      };
      expect(registerDeviceTokenEventPayloadBuilder(fittingPayload, getTestConfig())).toEqual(
        expectedOutput,
      );
    });

    it('For non apple family device type', async () => {
      let fittingPayload = { ...getTestMessage() };
      fittingPayload.context.device.type = 'android';
      let expectedOutput = {
        device: {
          dataFields: {
            campaignId: 5678,
            category: 'test',
            email: 'test@test.com',
            name: 'pageName',
            templateId: 1234,
          },
          platform: 'GCM',
          token: 1234,
        },
        email: 'abc@test.com',
        preferUserId: true,
        userId: 'anonId',
      };
      expect(registerDeviceTokenEventPayloadBuilder(fittingPayload, getTestConfig())).toEqual(
        expectedOutput,
      );
    });
  });
  describe('Unit test cases for iterable registerBrowserTokenEventPayloadBuilder', () => {
    it('flow check', async () => {
      let expectedOutput = { browserToken: 5678, email: 'abc@test.com', userId: 'anonId' };
      expect(registerBrowserTokenEventPayloadBuilder(getTestMessage())).toEqual(expectedOutput);
    });
  });
  describe('Unit test cases for iterable updateUserEventPayloadBuilder', () => {
    it('flow check without externalId', async () => {
      let expectedOutput = {
        dataFields: {
          address: { city: 'kolkata', country: 'India' },
          createdAt: '2014-05-21T15:54:20Z',
          email: 'abc@test.com',
          name: 'rudder',
          timestamp: '2014-05-21T15:54:20Z',
        },
        email: 'abc@test.com',
        mergeNestedObjects: true,
        preferUserId: true,
        userId: 'anonId',
      };
      expect(
        updateUserEventPayloadBuilder(getTestMessage(), ConfigCategory.IDENTIFY, getTestConfig()),
      ).toEqual(expectedOutput);
    });

    it('flow check with externalId', async () => {
      let fittingPayload = { ...getTestMessage() };
      fittingPayload.context.mappedToDestination = true;
      let expectedOutput = {
        dataFields: {
          address: { city: 'kolkata', country: 'India' },
          createdAt: '2014-05-21T15:54:20Z',
          email: 'abc@test.com',
          name: 'rudder',
          test_identifier: '12345',
          timestamp: '2014-05-21T15:54:20Z',
        },
        email: 'abc@test.com',
        mergeNestedObjects: true,
        preferUserId: true,
        userId: 'anonId',
      };
      expect(
        updateUserEventPayloadBuilder(fittingPayload, ConfigCategory.IDENTIFY, getTestConfig()),
      ).toEqual(expectedOutput);
    });
  });
  describe('Unit test cases for iterbale pageEventPayloadBuilder', () => {
    it('For trackAllPages', async () => {
      let destination = {
        Config: {
          apiKey: '12345',
          mapToSingleEvent: false,
          trackAllPages: true,
          trackCategorisedPages: false,
          trackNamedPages: false,
        },
        Enabled: true,
      };
      let expectedOutput = {
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
        eventName: 'pageName page',
        templateId: 1234,
        userId: 'anonId',
      };
      expect(
        pageEventPayloadBuilder(
          { ...getTestMessage(), type: 'page' },
          destination,
          ConfigCategory.PAGE,
        ),
      ).toEqual(expectedOutput);
    });

    it('For trackCategorisedPages', async () => {
      let destination = {
        Config: {
          apiKey: '12345',
          mapToSingleEvent: false,
          trackAllPages: false,
          trackCategorisedPages: true,
          trackNamedPages: false,
        },
        Enabled: true,
      };
      let expectedOutput = {
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
        eventName: 'pageName page',
        templateId: 1234,
        userId: 'anonId',
      };
      expect(
        pageEventPayloadBuilder(
          { ...getTestMessage(), type: 'page' },
          destination,
          ConfigCategory.PAGE,
        ),
      ).toEqual(expectedOutput);
    });

    it('For trackNamedPages', async () => {
      let destination = {
        Config: {
          apiKey: '12345',
          mapToSingleEvent: false,
          trackAllPages: false,
          trackCategorisedPages: false,
          trackNamedPages: true,
        },
        Enabled: true,
      };
      let expectedOutput = {
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
        eventName: 'pageName page',
        templateId: 1234,
        userId: 'anonId',
      };
      expect(
        pageEventPayloadBuilder(
          { ...getTestMessage(), type: 'page' },
          destination,
          ConfigCategory.PAGE,
        ),
      ).toEqual(expectedOutput);
    });

    it('For mapToSingleEvent', async () => {
      let destination = {
        Config: {
          apiKey: '12345',
          mapToSingleEvent: true,
          trackAllPages: false,
          trackCategorisedPages: false,
          trackNamedPages: true,
        },
        Enabled: true,
      };
      let expectedOutput = {
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
        eventName: 'Loaded a Page',
        templateId: 1234,
        userId: 'anonId',
      };
      expect(
        pageEventPayloadBuilder(
          { ...getTestMessage(), type: 'page' },
          destination,
          ConfigCategory.PAGE,
        ),
      ).toEqual(expectedOutput);
    });

    it('For non-mapToSingleEvent', async () => {
      let destination = {
        Config: {
          apiKey: '12345',
          mapToSingleEvent: false,
          trackAllPages: false,
          trackCategorisedPages: false,
          trackNamedPages: true,
        },
        Enabled: true,
      };
      let expectedOutput = {
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
        eventName: 'pageName page',
        templateId: 1234,
        userId: 'anonId',
      };
      expect(
        pageEventPayloadBuilder(
          { ...getTestMessage(), type: 'page' },
          destination,
          ConfigCategory.PAGE,
        ),
      ).toEqual(expectedOutput);
    });
  });
  describe('Unit test cases for iterbale screenEventPayloadBuilder', () => {
    it('For trackAllPages', async () => {
      let destination = {
        Config: {
          apiKey: '12345',
          mapToSingleEvent: false,
          trackAllPages: true,
          trackCategorisedPages: false,
          trackNamedPages: false,
        },
        Enabled: true,
      };
      let expectedOutput = {
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
      };
      expect(
        screenEventPayloadBuilder(
          { ...getTestMessage(), type: 'screen' },
          destination,
          ConfigCategory.SCREEN,
        ),
      ).toEqual(expectedOutput);
    });

    it('For trackCategorisedPages', async () => {
      let destination = {
        Config: {
          apiKey: '12345',
          mapToSingleEvent: false,
          trackAllPages: false,
          trackCategorisedPages: true,
          trackNamedPages: false,
        },
        Enabled: true,
      };
      let expectedOutput = {
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
      };
      expect(
        screenEventPayloadBuilder(
          { ...getTestMessage(), type: 'screen' },
          destination,
          ConfigCategory.SCREEN,
        ),
      ).toEqual(expectedOutput);
    });

    it('For trackNamedPages', async () => {
      let destination = {
        Config: {
          apiKey: '12345',
          mapToSingleEvent: false,
          trackAllPages: false,
          trackCategorisedPages: false,
          trackNamedPages: true,
        },
        Enabled: true,
      };
      let expectedOutput = {
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
      };
      expect(
        screenEventPayloadBuilder(
          { ...getTestMessage(), type: 'screen' },
          destination,
          ConfigCategory.SCREEN,
        ),
      ).toEqual(expectedOutput);
    });

    it('For mapToSingleEvent', async () => {
      let destination = {
        Config: {
          apiKey: '12345',
          mapToSingleEvent: true,
          trackAllPages: false,
          trackCategorisedPages: false,
          trackNamedPages: true,
        },
        Enabled: true,
      };
      let expectedOutput = {
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
      };
      expect(
        screenEventPayloadBuilder(
          { ...getTestMessage(), type: 'screen' },
          destination,
          ConfigCategory.SCREEN,
        ),
      ).toEqual(expectedOutput);
    });

    it('For non-mapToSingleEvent', async () => {
      let destination = {
        Config: {
          apiKey: '12345',
          mapToSingleEvent: false,
          trackAllPages: false,
          trackCategorisedPages: false,
          trackNamedPages: true,
        },
        Enabled: true,
      };
      let expectedOutput = {
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
      };
      expect(
        screenEventPayloadBuilder(
          { ...getTestMessage(), type: 'screen' },
          destination,
          ConfigCategory.SCREEN,
        ),
      ).toEqual(expectedOutput);
    });
  });
  describe('Unit test cases for iterable trackEventPayloadBuilder', () => {
    it('flow check', async () => {
      let expectedOutput = {
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
      };
      expect(trackEventPayloadBuilder(getTestMessage(), ConfigCategory.TRACK)).toEqual(
        expectedOutput,
      );
    });
  });
  describe('Unit test cases for iterable purchaseEventPayloadBuilder', () => {
    it('flow check without product array', async () => {
      let expectedOutput = {
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
      };
      expect(
        purchaseEventPayloadBuilder(
          getTestEcommMessage(),
          ConfigCategory.TRACK_PURCHASE,
          getTestConfig(),
        ),
      ).toEqual(expectedOutput);
    });

    it('flow check with product array', async () => {
      let fittingPayload = { ...getTestEcommMessage() };
      fittingPayload.properties.products = [
        {
          product_id: 1234,
          sku: 'abcd',
          name: 'no product array present',
          category: 'categoryTest1, categoryTest2',
          price: '10',
          quantity: '2',
          total: '20',
        },
      ];
      let expectedOutput = {
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
              name: 'no product array present',
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
      };
      expect(
        purchaseEventPayloadBuilder(fittingPayload, ConfigCategory.TRACK_PURCHASE, getTestConfig()),
      ).toEqual(expectedOutput);
    });
  });
  describe('Unit test cases for iterable updateCartEventPayloadBuilder', () => {
    it('flow check without product array', async () => {
      let expectedOutput = {
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
      };
      expect(
        updateCartEventPayloadBuilder(getTestEcommMessage(), ConfigCategory.UPDATE_CART),
      ).toEqual(expectedOutput);
    });

    it('flow check with product array', async () => {
      let fittingPayload = { ...getTestEcommMessage() };
      fittingPayload.properties.products = [
        {
          product_id: 1234,
          sku: 'abcd',
          name: 'no product array present',
          category: 'categoryTest1, categoryTest2',
          price: '10',
          quantity: '2',
          total: '20',
        },
      ];
      let expectedOutput = {
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
      };
      expect(updateCartEventPayloadBuilder(fittingPayload, ConfigCategory.UPDATE_CART)).toEqual(
        expectedOutput,
      );
    });
  });
  describe('Unit test cases for iterable hasMultipleResponses', () => {
    it('should return false when message type is not identify', () => {
      const category = getCategoryWithEndpoint(ConfigCategory.IDENTIFY, 'USDC');
      const message = {
        type: 'track',
        context: {
          device: { token: '123' },
          os: { token: '456' },
        },
      };
      const config = { registerDeviceOrBrowserApiKey: 'test-key' };

      expect(hasMultipleResponses(message, category, config)).toBe(false);
    });

    it('should return false when category is not identify', () => {
      const category = getCategoryWithEndpoint(ConfigCategory.PAGE, 'USDC');
      const message = {
        type: 'identify',
        context: {
          device: { token: '123' },
          os: { token: '456' },
        },
      };
      const config = { registerDeviceOrBrowserApiKey: 'test-key' };

      expect(hasMultipleResponses(message, category, config)).toBe(false);
    });

    it('should return false when no device/os token present', () => {
      const category = getCategoryWithEndpoint(ConfigCategory.IDENTIFY, 'USDC');
      const message = {
        type: 'identify',
        context: {
          device: {},
          os: {},
        },
      };
      const config = { registerDeviceOrBrowserApiKey: 'test-key' };

      expect(hasMultipleResponses(message, category, config)).toBe(false);
    });

    it('should return false when registerDeviceOrBrowserApiKey not present in config', () => {
      const category = getCategoryWithEndpoint(ConfigCategory.IDENTIFY, 'USDC');
      const message = {
        type: 'identify',
        context: {
          device: { token: '123' },
          os: { token: '456' },
        },
      };
      const config = {};

      expect(hasMultipleResponses(message, category, config)).toBe(false);
    });

    it('should return true when all conditions are met with device token', () => {
      const category = getCategoryWithEndpoint(ConfigCategory.IDENTIFY, 'USDC');
      const message = {
        type: 'identify',
        context: {
          device: { token: '123' },
        },
      };
      const config = {
        dataCenter: '123',
        registerDeviceOrBrowserApiKey: 'test-key',
      };

      expect(hasMultipleResponses(message, category, config)).toBe(true);
    });

    it('should return true when all conditions are met with os token', () => {
      const category = getCategoryWithEndpoint(ConfigCategory.IDENTIFY, 'USDC');
      const message = {
        type: 'identify',
        context: {
          os: { token: '456' },
        },
      };
      const config = {
        dataCenter: '123',
        registerDeviceOrBrowserApiKey: 'test-key',
      };

      expect(hasMultipleResponses(message, category, config)).toBe(true);
    });
  });
  describe('Unit test cases for iterable getCategoryUsingEventName', () => {
    // Returns TRACK_PURCHASE category when event is 'order completed'
    it('should return TRACK_PURCHASE category when event is order completed', () => {
      const message = {
        event: 'order completed',
        properties: {
          total: 100,
        },
      };

      const result = getCategoryUsingEventName(message, dataCenter);
      const resultEU = getCategoryUsingEventName(message, dataCenterEU);

      expect(result).toEqual({
        name: 'IterableTrackPurchaseConfig',
        action: 'trackPurchase',
        endpoint: 'https://api.iterable.com/api/commerce/trackPurchase',
      });
      expect(resultEU).toEqual({
        ...ConfigCategory.TRACK_PURCHASE,
        endpoint: 'https://api.eu.iterable.com/api/commerce/trackPurchase',
      });
    });

    // Handles event name as product added
    it('should return UPDATE_CART category when event is product added', () => {
      const message = {
        event: 'product added',
        properties: {
          total: 100,
        },
      };

      const result = getCategoryUsingEventName(message, dataCenter);

      expect(result).toEqual({
        ...ConfigCategory.UPDATE_CART,
        endpoint: 'https://api.iterable.com/api/commerce/updateCart',
      });
    });

    // Handles event name as product added
    it('should return UPDATE_CART category when event is product removed', () => {
      const message = {
        event: 'PRODUCT REMOVED',
        properties: {
          total: 100,
        },
      };

      const result = getCategoryUsingEventName(message, dataCenterEU);

      expect(result).toEqual({
        ...ConfigCategory.UPDATE_CART,
        endpoint: 'https://api.eu.iterable.com/api/commerce/updateCart',
      });
    });

    // Handles event name as a generic event
    it('should return TRACK category when event is generic', () => {
      const message = {
        event: 'custom event',
        properties: {
          total: 100,
        },
      };

      const result = getCategoryUsingEventName(message, dataCenter);

      expect(result).toEqual({
        ...ConfigCategory.TRACK,
        endpoint: 'https://api.iterable.com/api/events/track',
      });
    });
  });
  describe('Unit test cases for iterable prepareAndSplitUpdateUserBatchesBasedOnPayloadSize', () => {
    // Function correctly splits events into batches when total size exceeds max body size
    it('should split events into multiple batches when payload size exceeds limit', () => {
      const mockEvents = [
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
      ];

      const registerDeviceOrBrowserTokenEvents = {
        1: { deviceToken: 'token1' },
        2: { deviceToken: 'token2' },
      };

      const result = prepareAndSplitUpdateUserBatchesBasedOnPayloadSize(
        mockEvents,
        registerDeviceOrBrowserTokenEvents,
      );

      expect(result).toHaveLength(2);
      expect(result[0].users).toHaveLength(1);
      expect(result[1].users).toHaveLength(1);
      expect(result[0].nonBatchedRequests).toEqual([{ deviceToken: 'token1' }]);
      expect(result[1].nonBatchedRequests).toEqual([{ deviceToken: 'token2' }]);
    });

    // Empty input chunk array returns empty batches array
    it('should return empty batches array for empty input chunk', () => {
      const emptyChunk = [];
      const registerDeviceOrBrowserTokenEvents = {};

      const result = prepareAndSplitUpdateUserBatchesBasedOnPayloadSize(
        emptyChunk,
        registerDeviceOrBrowserTokenEvents,
      );

      expect(result).toEqual([]);
    });

    // Each batch contains users, metadata, and non-batched requests arrays
    it('should create batches with users, metadata, and non-batched requests arrays', () => {
      const chunk = [
        { metadata: { jobId: '1' }, destination: 'dest1', message: { body: { JSON: {} } } },
        { metadata: { jobId: '2' }, destination: 'dest1', message: { body: { JSON: {} } } },
      ];
      const registerDeviceOrBrowserTokenEvents = {};

      const result = prepareAndSplitUpdateUserBatchesBasedOnPayloadSize(
        chunk,
        registerDeviceOrBrowserTokenEvents,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('users');
      expect(result[0]).toHaveProperty('metadata');
      expect(result[0]).toHaveProperty('nonBatchedRequests');
    });

    // Device/browser token events are added to nonBatchedRequests array
    it('should add device/browser token events to nonBatchedRequests array', () => {
      const chunk = [
        { metadata: { jobId: '1' }, destination: 'dest1', message: { body: { JSON: {} } } },
      ];
      const registerDeviceOrBrowserTokenEvents = {
        1: 'tokenEvent',
      };

      const result = prepareAndSplitUpdateUserBatchesBasedOnPayloadSize(
        chunk,
        registerDeviceOrBrowserTokenEvents,
      );

      expect(result[0].nonBatchedRequests).toContain('tokenEvent');
    });

    // Final batch is created even if size limit not reached
    it('should create final batch even if size limit not reached', () => {
      const chunk = [
        { metadata: { jobId: '1' }, destination: 'dest1', message: { body: { JSON: {} } } },
      ];
      const registerDeviceOrBrowserTokenEvents = {
        1: { deviceToken: 'token1' },
      };

      const result = prepareAndSplitUpdateUserBatchesBasedOnPayloadSize(
        chunk,
        registerDeviceOrBrowserTokenEvents,
      );

      expect(result).toHaveLength(1);
      expect(result[0].users).toHaveLength(1);
      expect(result[0].nonBatchedRequests).toContainEqual({ deviceToken: 'token1' });
    });
  });
});
