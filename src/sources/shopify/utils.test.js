const { processIdentifierEvent, updateAnonymousIdToUserIdInRedis } = require('./utils');
const { RedisDB } = require('../../util/redis/redisConnector');
const stats = require('../../util/stats');

// Mock the Redis module
jest.mock('../../util/redis/redisConnector', () => ({
  RedisDB: {
    setVal: jest.fn().mockResolvedValue({ status: 'OK' }),
    getVal: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('../../util/stats', () => ({
  increment: jest.fn(),
}));

describe('Shopify Utils Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    RedisDB.setVal.mockResolvedValue({ status: 'OK' });
    RedisDB.getVal.mockResolvedValue(null);
  });

  describe('processIdentifierEvent', () => {
    it('should process valid identifier event', async () => {
      const event = {
        event: 'rudderIdentifier',
        anonymousId: 'anon123',
        userId: 'user123',
        cartToken: 'cart123',
        action: 'stitchCartTokenToAnonId',
      };

      const result = await processIdentifierEvent(event);
      expect(result).toEqual({
        outputToSource: {
          body: Buffer.from('OK').toString('base64'),
          contentType: 'text/plain',
        },
        statusCode: 200,
      });
      expect(RedisDB.setVal).toHaveBeenCalledWith(
        'pixel:cart123',
        ['anonymousId', 'anon123'],
        43200,
      );
    });

    it('should handle missing cart token', async () => {
      const event = {
        event: 'rudderIdentifier',
        anonymousId: 'anon123',
        userId: 'user123',
        action: 'stitchUserIdToAnonId',
      };

      const result = await processIdentifierEvent(event);
      expect(result).toEqual({
        outputToSource: {
          body: Buffer.from('OK').toString('base64'),
          contentType: 'text/plain',
        },
        statusCode: 200,
      });
      expect(RedisDB.setVal).toHaveBeenCalledWith('pixel:anon123', ['userId', 'user123'], 86400);
    });
  });

  describe('updateAnonymousIdToUserIdInRedis', () => {
    it('should update mapping successfully', async () => {
      const anonymousId = 'anon123';
      const userId = 'user123';

      await updateAnonymousIdToUserIdInRedis(anonymousId, userId);
      expect(RedisDB.setVal).toHaveBeenCalledWith('pixel:anon123', ['userId', 'user123'], 86400);
      expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_userid_mapping', {
        action: 'stitchUserIdToAnonId',
        operation: 'set',
      });
    });

    it('should handle missing parameters', async () => {
      await updateAnonymousIdToUserIdInRedis(null, 'user123');
      expect(RedisDB.setVal).not.toHaveBeenCalled();

      await updateAnonymousIdToUserIdInRedis('anon123', null);
      expect(RedisDB.setVal).not.toHaveBeenCalled();
    });
  });
});
