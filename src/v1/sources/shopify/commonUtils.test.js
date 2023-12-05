const {
  getCartToken,
  getShopifyTopic,
  extractEmailFromPayload,
  getLineItemsToStore,
  getDataFromRedis,
  sanitizePayload,
} = require('./commonUtils');
const { RedisDB } = require('../../../util/redis/redisConnector');
jest.mock('ioredis', () => require('../../../../test/__mocks__/redis'));

describe('Shopify Utils Test', () => {
  describe('sanitizePayload', () => {
    // Returns the input object if it has no null values or price string values.
    it('should return the input object if it has no null values or price string values', () => {
      const obj = { name: 'John', age: 25 };
      const result = sanitizePayload(obj);
      expect(result).toEqual(obj);
    });

    // Returns the input object with null values replaced with undefined.
    it('should return the input object with null values replaced with undefined', () => {
      const obj = { name: 'John', age: null };
      const expected = { name: 'John' };
      const result = sanitizePayload(obj);
      expect(result).toEqual(expected);
    });

    // Returns the input object with price string values parsed as float or integer.
    it('should return the input object with price string values parsed as float or integer', () => {
      const obj = { price1: '10.5', price2: '20', price3: '30.0' };
      const expected = { price1: 10.5, price2: 20, price3: 30 };
      const result = sanitizePayload(obj);
      expect(result).toEqual(expected);
    });

    // Returns null if the input object has only null values.
    it('should return null if the input object has only null values', () => {
      const obj = { value1: null, value2: null };
      const result = sanitizePayload(obj);
      expect(result).toEqual({});
    });

    // Returns one object having null values for inner keys
    it('should return null if the input object has only null values', () => {
      const obj = { value1: null, value2: { innerVal: 'null' } };
      const result = sanitizePayload(obj);
      expect(result).toEqual({ value2: { innerVal: 'null' } });
    });

    // Returns the input object with non-price string values unchanged.
    it('should return the input object with non-price string values unchanged', () => {
      const obj = { name: 'John', age: '25' };
      const result = sanitizePayload(obj);
      expect(result).toEqual(obj);
    });
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
  });

  describe('getCartToken', () => {
    // Returns message.id if shopifyTopic is 'carts_update'
    it("should return message.id when shopifyTopic is 'carts_update'", () => {
      const message = { id: '123' };
      const shopifyTopic = 'carts_update';
      const result = getCartToken(message, shopifyTopic);
      expect(result).toBe(message.id);
    });

    // Returns message.token if shopifyTopic is 'carts_update'
    it("should return message.token when shopifyTopic is 'carts_update'", () => {
      const message = { token: 'abc' };
      const shopifyTopic = 'carts_update';
      const result = getCartToken(message, shopifyTopic);
      expect(result).toBe(message.token);
    });

    // Returns message.properties.cart_id if shopifyTopic is 'carts_update'
    it("should return message.properties.cart_id when shopifyTopic is 'carts_update'", () => {
      const message = { properties: { cart_id: '456' } };
      const shopifyTopic = 'carts_update';
      const result = getCartToken(message, shopifyTopic);
      expect(result).toBe(message.properties.cart_id);
    });
  });

  describe('getLineItemsToStore', () => {
    // Should return 'EMPTY' if cart has no line items
    it('should return "EMPTY" when cart has no line items', () => {
      const cart = {
        line_items: [],
      };
      const result = getLineItemsToStore(cart);
      expect(result).toBe('EMPTY');
    });
  });

  describe('extractEmailFromPayload', () => {
    // The function correctly extracts the email from a flattened JSON payload with a single 'email' key and returns it.
    it("should correctly extract the email from a flattened JSON payload with a single 'email' key and return it", () => {
      const event = { email: 'test@example.com' };
      const result = extractEmailFromPayload(event);
      expect(result).toBe('test@example.com');
    });
  });

  describe('getDataFromRedis', () => {
    // Successfully retrieves data from Redis and returns it
    it('should successfully retrieve data from Redis and return it', async () => {
      const key = 'testKey';
      const metricMetadata = { metric: 'testMetric' };
      const dbData = {
        lineItems:
          'H4sIAAAAAAAAA6tWMjQyVrKqViosTcwrySypVLIy0lEqSyzKBHLjM1OUrExMzXSUslOBEkrF+bmpViCmjlJBUWZyKlDI2EDPwADMz08pTYbosLQw11Eqzi4FSgNlgIbmgFQGZ2QWlSgYKegq+DgGubsCZcpS81Lyi4BSJanFJY55QAuVamsB0AEE35EAAAA=',
      };
      RedisDB.getVal = jest.fn().mockResolvedValue(dbData);

      const result = await getDataFromRedis(key, metricMetadata);

      expect(RedisDB.getVal).toHaveBeenCalledWith(key);
      expect(result).toEqual(dbData);
    });

    // Handles empty data from Redis and returns null
    it('should handle empty data from Redis and return null', async () => {
      const key = 'testKey';
      const metricMetadata = { metric: 'testMetric' };
      RedisDB.getVal = jest.fn().mockResolvedValue(null);

      const result = await getDataFromRedis(key, metricMetadata);

      expect(RedisDB.getVal).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });

    // RedisDB.getVal returns null
    it('should handle RedisDB.getVal returning null', async () => {
      const key = 'testKey';
      const metricMetadata = { metric: 'testMetric' };
      RedisDB.getVal = jest.fn().mockResolvedValue(null);

      const result = await getDataFromRedis(key, metricMetadata);

      expect(RedisDB.getVal).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });

    // RedisDB.getVal returns an empty object
    it('should handle RedisDB.getVal returning an empty object', async () => {
      const key = 'testKey';
      const metricMetadata = { metric: 'testMetric' };
      RedisDB.getVal = jest.fn().mockResolvedValue({});

      const result = await getDataFromRedis(key, metricMetadata);

      expect(RedisDB.getVal).toHaveBeenCalledWith(key);
      expect(result).toEqual({});
    });
  });
});
