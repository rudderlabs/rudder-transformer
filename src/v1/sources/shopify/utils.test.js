const {
  isIdentifierEvent,
  processIdentifierEvent,
  updateAnonymousIdToUserIdInRedis,
} = require('./utils');
const { RedisDB } = require('../../../util/redis/redisConnector');
const stats = require('../../../util/stats');

jest.mock('../../../util/stats', () => ({
  increment: jest.fn(),
}));

describe('Identifier Utils Tests', () => {
  describe('test isIdentifierEvent', () => {
    it('should return true if the event is rudderIdentifier', () => {
      const event = { event: 'rudderIdentifier' };
      expect(isIdentifierEvent(event)).toBe(true);
    });

    it('should return false if the event is not rudderIdentifier', () => {
      const event = { event: 'checkout started' };
      expect(isIdentifierEvent(event)).toBe(false);
    });
  });

  describe('test processIdentifierEvent', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should set the cartToken mapping in redis and increment stats', async () => {
      const setValSpy = jest.spyOn(RedisDB, 'setVal').mockResolvedValue('OK');
      const event = {
        cartToken: 'cartTokenTest1',
        anonymousId: 'anonymousIdTest1',
        action: 'stitchCartTokenToAnonId',
      };

      const response = await processIdentifierEvent(event);

      expect(setValSpy).toHaveBeenCalledWith(
        'pixel:cartTokenTest1',
        ['anonymousId', 'anonymousIdTest1'],
        43200,
      );
      expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_cart_token_mapping', {
        action: 'stitchCartTokenToAnonId',
        operation: 'set',
      });
      expect(response).toEqual({
        outputToSource: {
          body: Buffer.from('OK').toString('base64'),
          contentType: 'text/plain',
        },
        statusCode: 200,
      });
    });

    it('should update the anonymousId to userId mapping in redis and increment stats', async () => {
      const setValSpy = jest.spyOn(RedisDB, 'setVal').mockResolvedValue('OK');
      const event = {
        anonymousId: 'anonymousIdTest1',
        userId: 'userIdTest1',
        action: 'stitchUserIdToAnonId',
      };

      const response = await processIdentifierEvent(event);

      expect(setValSpy).toHaveBeenCalled();
      expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_userid_mapping', {
        action: 'stitchUserIdToAnonId',
        operation: 'set',
      });
      expect(response).toEqual({
        outputToSource: {
          body: Buffer.from('OK').toString('base64'),
          contentType: 'text/plain',
        },
        statusCode: 200,
      });
    });

    it('should handle redis errors and increment error stats', async () => {
      const error = new Error('Redis connection failed');
      jest.spyOn(RedisDB, 'setVal').mockRejectedValue(error);
      const event = {
        cartToken: 'cartTokenTest1',
        anonymousId: 'anonymousIdTest1',
        action: 'stitchCartTokenToAnonId',
      };

      await expect(processIdentifierEvent(event)).rejects.toThrow('Redis connection failed');
      expect(stats.increment).not.toHaveBeenCalled();
    });
  });

  describe('test updateAnonymousIdToUserIdInRedis', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update the anonymousId to userId in redis and increment stats', async () => {
      const setValSpy = jest.spyOn(RedisDB, 'setVal').mockResolvedValue('OK');
      const event = {
        anonymousId: 'anonymousTest1',
        userId: 'userIdTest1',
      };

      await updateAnonymousIdToUserIdInRedis(event.anonymousId, event.userId);

      expect(setValSpy).toHaveBeenCalledWith(
        'pixel:anonymousTest1',
        ['userId', 'userIdTest1'],
        86400,
      );
      expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_userid_mapping', {
        action: 'stitchUserIdToAnonId',
        operation: 'set',
      });
    });

    it('should handle redis errors in updateAnonymousIdToUserIdInRedis', async () => {
      const error = new Error('Redis connection failed');
      jest.spyOn(RedisDB, 'setVal').mockRejectedValue(error);
      const event = {
        anonymousId: 'anonymousTest1',
        userId: 'userIdTest1',
      };

      await expect(
        updateAnonymousIdToUserIdInRedis(event.anonymousId, event.userId),
      ).rejects.toThrow('Redis connection failed');
      expect(stats.increment).not.toHaveBeenCalled();
    });

    it('should handle null values and not call Redis or stats', async () => {
      const setValSpy = jest.spyOn(RedisDB, 'setVal').mockResolvedValue('OK');
      const event = {
        anonymousId: null,
        userId: null,
      };

      await updateAnonymousIdToUserIdInRedis(event.anonymousId, event.userId);
      expect(setValSpy).not.toHaveBeenCalled();
      expect(stats.increment).not.toHaveBeenCalled();
    });
  });
});
