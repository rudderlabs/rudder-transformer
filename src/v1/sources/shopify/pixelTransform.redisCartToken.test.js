const { handleCartTokenRedisOperations } = require('./pixelTransform');
const { RedisDB } = require('../../../util/redis/redisConnector');
const { eventToCartTokenLocationMapping } = require('./config');
const stats = require('../../../util/stats');
const logger = require('../../../logger');

jest.mock('../../../util/redis/redisConnector', () => ({
  RedisDB: {
    getVal: jest.fn(),
    setVal: jest.fn(),
  },
}));

jest.mock('./config', () => ({
  eventToCartTokenLocationMapping: { eventName: 'cartToken' },
}));

jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
}));

jest.mock('../../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('handleCartTokenRedisOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should increment stats and return when cart token location is not found', async () => {
    const inputEvent = { name: 'unknownEvent', query_parameters: { writeKey: 'testKey' } };

    await handleCartTokenRedisOperations(inputEvent, 'clientId');

    expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_cart_token_not_found', {
      event: 'unknownEvent',
      writeKey: 'testKey',
    });
  });

  it('should set new anonymousId in Redis and increment stats', async () => {
    const inputEvent = {
      name: 'eventName',
      query_parameters: { writeKey: 'testKey' },
      cartToken: 'shopify/cart/12345',
    };
    RedisDB.setVal.mockResolvedValue();

    await handleCartTokenRedisOperations(inputEvent, 'clientId');

    expect(RedisDB.setVal).toHaveBeenCalledWith('12345', 'clientId');
    expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_cart_token_set', {
      event: 'eventName',
      writeKey: 'testKey',
    });
  });

  it('should log error and increment stats when exception occurs', async () => {
    const inputEvent = {
      name: 'eventName',
      query_parameters: { writeKey: 'testKey' },
      cartToken: 'shopify/cart/12345',
    };
    const error = new Error('Redis error');
    RedisDB.setVal.mockRejectedValue(error);

    await handleCartTokenRedisOperations(inputEvent, 'clientId');

    expect(logger.error).toHaveBeenCalledWith(
      'Error handling Redis operations for event: eventName',
      error,
    );
    expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_cart_token_redis_error', {
      event: 'eventName',
      writeKey: 'testKey',
    });
  });
});
