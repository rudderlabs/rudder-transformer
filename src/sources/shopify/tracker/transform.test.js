const {
  identifyPayloadBuilder,
  ecomPayloadBuilder,
  trackPayloadBuilder,
  createMessageForEvent,
  process,
  handleCartsUpdate,
  enrichMessage,
} = require('../tracker/transform');
const { RedisDB } = require('../../../util/redis/redisConnector');
const { EventType } = require('../../../constants');
const Message = require('../../message');
const config = require('../tracker/config');
const { RedisError } = require('@rudderstack/integrations-lib');

// Mock Redis
jest.mock('../../../util/redis/redisConnector', () => ({
  RedisDB: {
    getVal: jest.fn(),
    setVal: jest.fn(),
  },
}));

describe('Shopify tracker transformer', () => {
  describe('Payload Builders', () => {
    const testCases = [
      {
        name: 'identifyPayloadBuilder - basic customer data',
        fn: identifyPayloadBuilder,
        input: {
          id: '123',
          email: 'test@example.com',
          first_name: 'John',
          updated_at: '2024-03-20T10:00:00Z',
        },
        expected: {
          type: EventType.IDENTIFY,
          traits: {
            email: 'test@example.com',
            firstName: 'John',
          },
          timestamp: '2024-03-20T10:00:00.000Z',
        },
      },
      {
        name: 'ecomPayloadBuilder - order created',
        fn: ecomPayloadBuilder,
        input: {
          id: 'order_123',
          total_price: '99.99',
          customer: {
            email: 'test@example.com',
          },
          updated_at: '2024-03-20T10:00:00Z',
        },
        shopifyTopic: 'orders_create',
        expected: {
          type: EventType.TRACK,
          event: 'Order Created',
          properties: {
            order_id: 'order_123',
            value: '99.99',
            products: [],
            updated_at: '2024-03-20T10:00:00Z',
          },
          traits: {
            email: 'test@example.com',
          },
        },
      },
      {
        name: 'trackPayloadBuilder - cart updated',
        fn: trackPayloadBuilder,
        input: {
          token: 'cart_123',
          total_price: '49.99',
          line_items: [
            {
              id: 'item_1',
              title: 'Test Product',
              price: '49.99',
            },
          ],
        },
        shopifyTopic: 'carts_update',
        expected: {
          type: EventType.TRACK,
          event: 'Cart Update',
          properties: {
            token: 'cart_123',
            total_price: '49.99',
            products: [
              {
                price: '49.99',
              },
            ],
          },
        },
      },
    ];

    testCases.forEach(({ name, fn, input, shopifyTopic, expected }) => {
      test(name, () => {
        const result = shopifyTopic ? fn(input, shopifyTopic) : fn(input);
        expect(result).toMatchObject(expected);
      });
    });
  });

  describe('createMessageForEvent', () => {
    const testCases = [
      {
        name: 'creates identify message for customer create',
        input: {
          id: '123',
          email: 'test@example.com',
        },
        shopifyTopic: 'customers_create',
        expectedType: EventType.IDENTIFY,
      },
      {
        name: 'creates track message for order completed',
        input: {
          id: 'order_123',
          total_price: '99.99',
        },
        shopifyTopic: 'orders_create',
        expectedType: EventType.TRACK,
      },
    ];

    testCases.forEach(({ name, input, shopifyTopic, expectedType }) => {
      test(name, () => {
        const result = createMessageForEvent(input, shopifyTopic);
        expect(result.type).toBe(expectedType);
      });
    });
  });

  describe('handleCartsUpdate', () => {
    const metricMetadata = {
      writeKey: 'test-key',
      source: 'SHOPIFY',
    };

    beforeEach(() => {
      RedisDB.getVal.mockClear();
      RedisDB.setVal.mockClear();
    });

    const testCases = [
      {
        name: 'should handle new cart with items',
        input: {
          id: 'cart_123',
          line_items: [{ id: 1, quantity: 2 }],
        },
        redisData: null,
        expected: { redisData: null },
      },
      {
        name: 'should detect invalid event when items unchanged',
        input: {
          id: 'cart_123',
          line_items: [{ id: 1, quantity: 2 }],
        },
        redisData: {
          itemsHash: 'same-hash',
        },
        mockHashResult: 'same-hash',
        expected: { redisData: { itemsHash: 'same-hash' } },
      },
    ];

    testCases.forEach(({ name, input, redisData, expected }) => {
      test(name, async () => {
        // Setup mocks
        RedisDB.getVal.mockResolvedValue(redisData);

        const result = await handleCartsUpdate(input, metricMetadata);
        expect(result).toMatchObject(expected);
      });
    });

    test('should call Redis and return redisData', async () => {
      const input = {
        id: 'cart_123',
        line_items: [{ id: 1, quantity: 2 }],
      };

      RedisDB.getVal.mockResolvedValue({ someData: 'test' });

      const result = await handleCartsUpdate(input, metricMetadata);

      // Verify Redis was called
      expect(RedisDB.getVal).toHaveBeenCalled();

      // Verify result contains Redis data
      expect(result.redisData).toEqual({ someData: 'test' });
    });
  });

  describe('enrichMessage', () => {
    const testCases = [
      {
        name: 'should enrich identify message',
        message: new Message('Shopify'),
        event: {
          email: 'test@example.com',
          cart_token: 'cart_123',
        },
        shopifyTopic: 'customers_create',
        expected: {
          type: 'identify',
          context: {
            cart_token: 'cart_123',
            library: {
              name: 'RudderStack Shopify Cloud',
              version: '1.0.0',
            },
            topic: 'customers_create',
          },
          integrations: {
            Shopify: false,
          },
        },
      },
      {
        name: 'should enrich track message with anonymous user',
        message: new Message('Shopify'),
        event: {
          cart_token: 'cart_123',
        },
        shopifyTopic: 'carts_update',
        redisData: {
          anonymousId: 'anon_123',
          sessionId: 'sess_123',
        },
        expected: {
          type: 'track',
          context: {
            cart_token: 'cart_123',
            library: {
              name: 'RudderStack Shopify Cloud',
              version: '1.0.0',
            },
            topic: 'carts_update',
          },
          integrations: {
            Shopify: false,
          },
        },
      },
    ];

    testCases.forEach(({ name, message, event, shopifyTopic, redisData, expected }) => {
      test(name, async () => {
        message.setEventType(expected.type);
        const metricMetadata = { writeKey: 'test-key', source: 'SHOPIFY' };
        const enrichedMessage = await enrichMessage(
          message,
          event,
          shopifyTopic,
          metricMetadata,
          redisData,
        );
        expect(enrichedMessage).toMatchObject(expected);
      });
    });
  });

  describe('process and processEvent', () => {
    const testCases = [
      {
        name: 'should process identifier event',
        input: {
          event: 'rudderIdentifier',
          cartToken: 'cart_123',
          anonymousId: 'anon_123',
          cart: { items: [] },
        },
        expected: {
          outputToSource: {
            body: Buffer.from('OK').toString('base64'),
            contentType: 'text/plain',
          },
          statusCode: 200,
        },
      },
      {
        name: 'should process valid shopify event',
        input: {
          id: 'order_123',
          customer: {
            id: '123',
            email: 'test@example.com',
          },
          total_price: '99.99',
          query_parameters: {
            writeKey: ['test-key'],
            topic: ['orders_create'],
          },
        },
        topic: 'orders_create',
        expected: {
          type: EventType.TRACK,
          event: 'Order Created',
          userId: '123',
          traits: {
            email: 'test@example.com',
          },
        },
      },
      {
        name: 'should handle unsupported event',
        input: {
          type: 'unsupported_event',
          query_parameters: {
            writeKey: ['test-key'],
            topic: ['unsupported_topic'],
          },
        },
        expected: {
          outputToSource: {
            body: Buffer.from('OK').toString('base64'),
            contentType: 'text/plain',
          },
          statusCode: 200,
        },
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      test(name, async () => {
        const result = await process(input);
        expect(result).toMatchObject(expected);
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      RedisDB.setVal.mockClear();
    });

    const testCases = [
      {
        name: 'should handle Redis errors',
        input: {
          event: 'rudderIdentifier',
          cartToken: 'cart_123',
          anonymousId: 'anon_123',
          cart: { items: [] },
        },
        mockRedisError: new Error('Redis connection failed'),
        expectedError: new RedisError('Error: Redis connection failed', 500),
      },
    ];

    testCases.forEach(({ name, input, mockRedisError, expectedError }) => {
      test(name, async () => {
        RedisDB.setVal.mockRejectedValueOnce(mockRedisError);
        await expect(process(input)).rejects.toThrow(expectedError);
      });
    });
  });
});
