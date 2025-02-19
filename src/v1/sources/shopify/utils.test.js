const {
  isIdentifierEvent,
  processIdentifierEvent,
  updateAnonymousIdToUserIdInRedis,
} = require('./utils');
const { RedisDB } = require('../../../util/redis/redisConnector');

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

    it('should set the anonymousId in redis and return NO_OPERATION_SUCCESS', async () => {
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
      expect(response).toEqual({
        outputToSource: {
          body: Buffer.from('OK').toString('base64'),
          contentType: 'text/plain',
        },
        statusCode: 200,
      });
    });

    it('should handle redis errors', async () => {
      jest.spyOn(RedisDB, 'setVal').mockRejectedValue(new Error('Redis connection failed'));
      const event = {
        cartToken: 'cartTokenTest1',
        anonymousId: 'anonymousIdTest1',
        action: 'stitchCartTokenToAnonId',
      };

      await expect(processIdentifierEvent(event)).rejects.toThrow('Redis connection failed');
    });
  });

  describe('test updateAnonymousIdToUserIdInRedis', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update the anonymousId to userId in redis', async () => {
      const setValSpy = jest.spyOn(RedisDB, 'setVal').mockResolvedValue('OK');
      const event = {
        cartToken: 'cartTokenTest1',
        anonymousId: 'anonymousTest1',
        userId: 'userIdTest1',
        action: 'stitchUserIdToAnonId',
      };

      await updateAnonymousIdToUserIdInRedis(event.anonymousId, event.userId);
      expect(setValSpy).toHaveBeenCalledWith(
        'pixel:anonymousTest1',
        ['userId', 'userIdTest1'],
        86400,
      );
    });

    it('should handle null values', async () => {
      const setValSpy = jest.spyOn(RedisDB, 'setVal').mockResolvedValue('OK');
      const event = {
        cartToken: 'cartTokenTest1',
        anonymousId: null,
        userId: null,
      };

      await updateAnonymousIdToUserIdInRedis(event.anonymousId, event.userId);
      expect(setValSpy).not.toHaveBeenCalled();
    });
  });
});
