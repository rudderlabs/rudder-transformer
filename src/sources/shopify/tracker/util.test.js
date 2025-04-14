const {
  getShopifyTopic,
  getProductsListFromLineItems,
  checkAndUpdateCartItems,
  getHashLineItems,
  getAnonymousIdAndSessionId,
  getCartToken,
  createPropertiesForEcomEvent,
  extractEmailFromPayload,
} = require('./util');
const { RedisDB } = require('../../../util/redis/redisConnector');
const stats = require('../../../util/stats');

jest.mock('ioredis', () => require('../../../../test/__mocks__/redis'));
jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
}));

describe('Shopify Utils Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetching Shopify Topic Test Cases', () => {
    it('Invalid Topic Test', () => {
      const input = {
        query_parameters: {},
      };
      const expectedOutput = {
        error: 'Invalid topic in query_parameters',
      };
      try {
        getShopifyTopic(input);
      } catch (error) {
        expect(error.message).toEqual(expectedOutput.error);
      }
    });

    it('No Topic Found Test', () => {
      const input = {
        query_parameters: {
          topic: [],
        },
      };
      const expectedOutput = {
        error: 'Topic not found',
      };
      try {
        getShopifyTopic(input);
      } catch (error) {
        expect(error.message).toEqual(expectedOutput.error);
      }
    });

    it('Successfully fetched topic Test', () => {
      const input = {
        query_parameters: {
          topic: ['<shopify_topic>'],
        },
      };
      const expectedOutput = '<shopify_topic>';
      const actualOutput = getShopifyTopic(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('Empty Query Params Test', () => {
      const input = {
        randomKey: 'randomValue',
      };
      const expectedOutput = {
        error: 'Query_parameters is missing',
      };
      try {
        getShopifyTopic(input);
      } catch (error) {
        expect(error.message).toEqual(expectedOutput.error);
      }
    });

    it('should extract topic from query parameters', () => {
      const event = {
        query_parameters: {
          topic: ['checkouts_update'],
        },
      };
      expect(getShopifyTopic(event)).toBe('checkouts_update');
    });
  });

  describe('Product List Operations', () => {
    describe('getProductsListFromLineItems', () => {
      it('should transform line items to products list', () => {
        const lineItems = [
          {
            id: '1',
            product_id: 'prod1',
            sku: 'SKU1',
            title: 'Product 1',
            price: 10.99,
            quantity: 2,
            variant_id: 'var1',
            variant_title: 'Large',
          },
        ];

        const result = getProductsListFromLineItems(lineItems);
        expect(result).toEqual([
          {
            id: '1',
            product_id: 'prod1',
            sku: 'SKU1',
            title: 'Product 1',
            price: 10.99,
            quantity: 2,
            variant: 'var1  Large',
          },
        ]);
      });

      it('should handle empty line items', () => {
        expect(getProductsListFromLineItems([])).toEqual([]);
      });

      it('should handle null line items', () => {
        expect(getProductsListFromLineItems(null)).toEqual([]);
      });

      it('should handle line items with missing fields', () => {
        const lineItems = [
          {
            product_id: 'prod1',
            quantity: 1,
          },
        ];
        const result = getProductsListFromLineItems(lineItems);
        expect(result).toEqual([
          {
            product_id: 'prod1',
            quantity: 1,
            variant: '  ',
          },
        ]);
      });
    });
  });

  describe('Cart Operations', () => {
    describe('checkAndUpdateCartItems', () => {
      beforeEach(() => {
        jest.spyOn(RedisDB, 'getVal').mockResolvedValue(null);
        jest.spyOn(RedisDB, 'setVal').mockResolvedValue();
      });

      it('should detect new cart items', async () => {
        const inputEvent = {
          token: 'cart123',
          line_items: [
            {
              id: '1',
              product_id: 'prod1',
            },
          ],
          created_at: new Date(Date.now() - 1000).toISOString(),
          updated_at: new Date().toISOString(),
        };

        const result = await checkAndUpdateCartItems(inputEvent, null, {}, 'carts_update');
        expect(result).toBeTruthy();
      });

      it('should detect duplicate cart items', async () => {
        const lineItems = [
          {
            id: '1',
            product_id: 'prod1',
          },
        ];

        const oldEvent = {
          token: 'cart123',
          line_items: lineItems,
          created_at: new Date(Date.now() - 2000).toISOString(),
          updated_at: new Date(Date.now() - 1000).toISOString(),
        };

        const inputEvent = {
          token: 'cart123',
          line_items: lineItems,
          created_at: new Date(Date.now() - 1000).toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Mock Redis to return the same hash that will be generated for the input
        const existingHash = getHashLineItems(oldEvent);
        jest.spyOn(RedisDB, 'getVal').mockResolvedValueOnce({
          itemsHash: existingHash,
        });

        const result = await checkAndUpdateCartItems(inputEvent, null, {}, 'carts_update');
        expect(result).toBeFalsy();
      });

      it('should handle Redis errors gracefully', async () => {
        const inputEvent = {
          token: 'cart123',
          line_items: [
            {
              id: '1',
              product_id: 'prod1',
            },
          ],
        };

        jest.spyOn(RedisDB, 'getVal').mockRejectedValueOnce(new Error('Redis error'));
        const result = await checkAndUpdateCartItems(inputEvent, null, {}, 'carts_update');
        expect(result).toBeTruthy();
        expect(stats.increment).toHaveBeenCalledWith('shopify_redis_calls', {
          field: 'all',
          type: 'get',
          source: undefined,
          writeKey: undefined,
        });
        expect(stats.increment).toHaveBeenCalledWith('shopify_redis_failures', {
          type: 'get',
          source: undefined,
          writeKey: undefined,
        });
      });
    });

    describe('getHashLineItems', () => {
      it('should generate hash for valid line items', () => {
        const cart = {
          line_items: [
            {
              id: '1',
              product_id: 'prod1',
            },
          ],
        };
        expect(getHashLineItems(cart)).toBeTruthy();
      });

      it('should return EMPTY for cart with no line items', () => {
        const cart = { line_items: [] };
        expect(getHashLineItems(cart)).toBe('EMPTY');
      });

      it('should return EMPTY for invalid cart object', () => {
        expect(getHashLineItems(null)).toBe('EMPTY');
        expect(getHashLineItems({})).toBe('EMPTY');
      });
    });
  });

  describe('User Identification', () => {
    describe('getAnonymousIdAndSessionId', () => {
      it('should handle Order Updated event with cart token', async () => {
        const input = {
          event: 'Order Updated',
          properties: {
            cart_token: 'test_token',
          },
        };
        const result = await getAnonymousIdAndSessionId(input, {}, null);
        expect(result).toHaveProperty('anonymousId');
      });

      it('should handle events with note attributes', async () => {
        const input = {
          event: 'Checkout Create',
          properties: {
            note_attributes: [
              { name: 'rudderAnonymousId', value: 'anon123' },
              { name: 'rudderSessionId', value: 'session123' },
            ],
          },
        };
        const result = await getAnonymousIdAndSessionId(input, {}, null);
        expect(result).toEqual({
          anonymousId: 'anon123',
          sessionId: 'session123',
        });
      });
    });
  });

  describe('Email Operations', () => {
    describe('extractEmailFromPayload', () => {
      it('should extract email from customer object', () => {
        const payload = {
          customer: {
            email: 'test@example.com',
          },
        };
        expect(extractEmailFromPayload(payload)).toBe('test@example.com');
      });

      it('should extract email from email field', () => {
        const payload = {
          email: 'test@example.com',
        };
        expect(extractEmailFromPayload(payload)).toBe('test@example.com');
      });

      it('should return undefined when no email is found', () => {
        const payload = {
          customer: {},
        };
        expect(extractEmailFromPayload(payload)).toBeUndefined();
      });
    });
  });

  describe('Cart Token Operations', () => {
    describe('getCartToken', () => {
      it('should extract cart token from properties', () => {
        const event = {
          properties: {
            cart_token: 'test_token',
          },
        };
        expect(getCartToken(event)).toBe('test_token');
      });

      it('should return null when token is not in properties', () => {
        const event = {
          token: 'test_token',
        };
        expect(getCartToken(event)).toBeNull();
      });
    });
  });

  describe('E-commerce Event Properties', () => {
    describe('createPropertiesForEcomEvent', () => {
      it('should create properties for product event', () => {
        const payload = {
          id: 'prod1',
          title: 'Test Product',
          price: '10.99',
          vendor: 'Test Vendor',
        };
        const result = createPropertiesForEcomEvent(payload);
        expect(result).toEqual({
          order_id: 'prod1',
          title: 'Test Product',
          price: '10.99',
          vendor: 'Test Vendor',
          products: [],
        });
      });

      it('should handle missing fields', () => {
        const payload = {
          id: 'prod1',
        };
        const result = createPropertiesForEcomEvent(payload);
        expect(result).toEqual({
          order_id: 'prod1',
          products: [],
        });
      });
    });
  });
});
