const { extractCartToken, handleCartTokenRedisOperations } = require('./pixelTransform');
const { RedisDB } = require('../../../../util/redis/redisConnector');
const stats = require('../../../../util/stats');
const logger = require('../../../../logger');
const { pixelEventToCartTokenLocationMapping } = require('../config');

jest.mock('../../../../util/redis/redisConnector', () => ({
  RedisDB: {
    setVal: jest.fn(),
  },
}));

jest.mock('../../../../util/stats', () => ({
  increment: jest.fn(),
}));

jest.mock('../../../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../config', () => ({
  pixelEventToCartTokenLocationMapping: { cart_viewed: 'properties.cart_id' },
}));

describe('extractCartToken', () => {
  it('should return undefined if cart token location is not found', () => {
    const inputEvent = { name: 'unknownEvent', query_parameters: { writeKey: 'testWriteKey' } };

    const result = extractCartToken(inputEvent);

    expect(result).toBeUndefined();
    expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_cart_token_not_found', {
      event: 'unknownEvent',
      writeKey: 'testWriteKey',
    });
  });

  it('should return undefined if cart token is not a string', () => {
    const inputEvent = {
      name: 'cart_viewed',
      properties: { cart_id: 12345 },
      query_parameters: { writeKey: 'testWriteKey' },
    };

    const result = extractCartToken(inputEvent);

    expect(result).toBeUndefined();
    expect(logger.error).toHaveBeenCalledWith('Cart token is not a string');
    expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_cart_token_not_found', {
      event: 'cart_viewed',
      writeKey: 'testWriteKey',
    });
  });

  it('should return the cart token if it is a valid string', () => {
    const inputEvent = {
      name: 'cart_viewed',
      properties: { cart_id: '/checkout/cn/1234' },
      query_parameters: { writeKey: 'testWriteKey' },
    };

    const result = extractCartToken(inputEvent);

    expect(result).toBe('1234');
  });
});

describe('handleCartTokenRedisOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle undefined or null cart token gracefully', async () => {
    const inputEvent = {
      name: 'unknownEvent',
      query_parameters: {
        writeKey: 'testWriteKey',
      },
    };
    const clientId = 'testClientId';

    await handleCartTokenRedisOperations(inputEvent, clientId);

    expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_cart_token_not_found', {
      event: 'unknownEvent',
      writeKey: 'testWriteKey',
    });
  });

  it('should log error and increment stats when exception occurs', async () => {
    const inputEvent = {
      name: 'cart_viewed',
      properties: {
        cart_id: '/checkout/cn/1234',
      },
      query_parameters: {
        writeKey: 'testWriteKey',
      },
    };
    const clientId = 'testClientId';
    const error = new Error('Redis error');
    RedisDB.setVal.mockRejectedValue(error);

    await handleCartTokenRedisOperations(inputEvent, clientId);

    expect(logger.error).toHaveBeenCalledWith(
      'Error handling Redis operations for event: cart_viewed',
      error,
    );
    expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_cart_token_redis_error', {
      event: 'cart_viewed',
      writeKey: 'testWriteKey',
    });
  });
});
