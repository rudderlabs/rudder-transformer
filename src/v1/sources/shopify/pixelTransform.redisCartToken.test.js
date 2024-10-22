const { handleCartTokenRedisOperations } = require('./pixelTransform');
const { RedisDB } = require('../../../util/redis/redisConnector');
const { eventToCartTokenLocationMapping } = require('./config');
const logger = require('../../../logger');
jest.mock('../../../util/redis/redisConnector', () => ({
  RedisDB: {
    getVal: jest.fn(),
    setVal: jest.fn(),
  },
}));
jest.mock('../../../v0/util', () => ({
  generateUUID: jest.fn().mockReturnValue('generated-uuid'),
}));
jest.mock('./config', () => ({
  eventToCartTokenLocationMapping: { eventName: 'cartToken' },
}));
jest.mock('../../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('handleCartTokenRedisOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log info when cart token location is not found in eventToCartTokenLocationMapping', async () => {
    const inputEvent = { name: 'unknownEvent' };

    await handleCartTokenRedisOperations(inputEvent);

    expect(logger.info).toHaveBeenCalledWith(
      'Cart token location not found for event: unknownEvent',
    );
  });

  it('should log info when cart token is not found in input event', async () => {
    const inputEvent = { name: 'eventName' };

    await handleCartTokenRedisOperations(inputEvent);

    expect(logger.info).toHaveBeenCalledWith('Cart token not found in input event: eventName');
  });

  it('should set new anonymousId in Redis when it does not exist', async () => {
    const inputEvent = { name: 'eventName', cartToken: '12345' };
    RedisDB.getVal.mockResolvedValue(null);

    await handleCartTokenRedisOperations(inputEvent);

    expect(RedisDB.getVal).toHaveBeenCalledWith('12345');
    expect(RedisDB.setVal).toHaveBeenCalledWith('12345', 'generated-uuid');
    expect(inputEvent.anonymousId).toBe('generated-uuid');
    expect(logger.info).toHaveBeenCalledWith('New anonymousId set in Redis for cartToken: 12345');
  });

  it('should use existing anonymousId from Redis when it exists', async () => {
    const inputEvent = { name: 'eventName', cartToken: '12345' };
    RedisDB.getVal.mockResolvedValue('existing-uuid');

    await handleCartTokenRedisOperations(inputEvent);

    expect(RedisDB.getVal).toHaveBeenCalledWith('12345');
    expect(RedisDB.setVal).not.toHaveBeenCalled();
    expect(inputEvent.anonymousId).toBe('existing-uuid');
    expect(logger.info).toHaveBeenCalledWith(
      'AnonymousId already exists in Redis for cartToken: 12345',
    );
  });

  it('should log error when an exception occurs', async () => {
    const inputEvent = { name: 'eventName', cartToken: '12345' };
    const error = new Error('Redis error');
    RedisDB.getVal.mockRejectedValue(error);

    await handleCartTokenRedisOperations(inputEvent);

    expect(logger.error).toHaveBeenCalledWith(
      'Error handling Redis operations for event: eventName',
      error,
    );
  });
});
