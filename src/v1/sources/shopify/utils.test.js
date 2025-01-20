const { isIdentifierEvent, processIdentifierEvent } = require('./utils');
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
      const event = { cartToken: 'cartTokenTest1', anonymousId: 'anonymousIdTest1' };

      const response = await processIdentifierEvent(event);

      expect(setValSpy).toHaveBeenCalledWith('cartTokenTest1', ['anonymousId', 'anonymousIdTest1']);
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
      const event = { cartToken: 'cartTokenTest1', anonymousId: 'anonymousIdTest1' };

      await expect(processIdentifierEvent(event)).rejects.toThrow('Redis connection failed');
    });
  });
});
