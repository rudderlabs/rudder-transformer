const { extractCartTokenAndConfigureAnonymousId } = require('./pixelTransform');
const { RedisDB } = require('../../../util/redis/redisConnector');
const stats = require('../../../util/stats');
const logger = require('../../../logger');
const { pixelEventToCartTokenLocationMapping } = require('./config');

jest.mock('../../../util/redis/redisConnector', () => ({
  RedisDB: {
    setVal: jest.fn(),
  },
}));

jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
}));

jest.mock('../../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock('./config', () => ({
  pixelEventToCartTokenLocationMapping: { cart_viewed: 'properties.cart_id' },
}));

describe('extractCartTokenAndConfigureAnonymousId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should map inputEvent name to correct cart token location', async () => {
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

    await extractCartTokenAndConfigureAnonymousId(inputEvent, clientId);

    expect(RedisDB.setVal).toHaveBeenCalledWith('1234', ['anonymousId', clientId]);
    expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_cart_token_set', {
      event: 'cart_viewed',
      writeKey: 'testWriteKey',
    });
  });

  it('should handle inputEvent with undefined or null name gracefully', async () => {
    const inputEvent = {
      name: null,
      query_parameters: {
        writeKey: 'testWriteKey',
      },
    };
    const clientId = 'testClientId';

    await extractCartTokenAndConfigureAnonymousId(inputEvent, clientId);

    expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_cart_token_not_found', {
      event: null,
      writeKey: 'testWriteKey',
    });
  });

  it('should log error when cart token is not a string', async () => {
    const inputEvent = {
      name: 'cart_viewed',
      properties: {
        cart_id: 12345,
      },
      query_parameters: {
        writeKey: 'testWriteKey',
      },
    };
    const clientId = 'testClientId';

    await extractCartTokenAndConfigureAnonymousId(inputEvent, clientId);

    expect(logger.error).toHaveBeenCalledWith('Cart token is not a string');
  });

  it('should log error and increment stats when exception occurs', async () => {
    const inputEvent = {
      name: 'cart_viewed',
      properties: {
        cart_id: 'shopify/cart/1234',
      },
      query_parameters: {
        writeKey: 'testWriteKey',
      },
    };
    const clientId = 'testClientId';
    const error = new Error('Redis error');
    RedisDB.setVal.mockRejectedValue(error);

    await extractCartTokenAndConfigureAnonymousId(inputEvent, clientId);

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
