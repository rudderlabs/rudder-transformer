import utils from '../../../../src/v0/util';
import { RedisDB } from '../../../../src/util/redis/redisConnector';

export const mockFns = (_) => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('5d3e2cb6-4011-5c9c-b7ee-11bc1e905097');
  jest.spyOn(RedisDB, 'getVal').mockImplementation((key) => {
    if (key === 'pixel:c7b3f99b-4d34-463b-835f-c879482a7750') {
      return Promise.resolve({ userId: 'test-user-id' });
    }
    return Promise.resolve({});
  });
  // Mock setVal to track anonymousId to userId mapping
  jest.spyOn(RedisDB, 'setVal').mockReturnValue(Promise.resolve());
};
