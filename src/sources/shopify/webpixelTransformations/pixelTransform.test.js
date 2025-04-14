const { processPixelWebEvents, extractCartToken } = require('./pixelTransform');
const { RedisDB } = require('../../../util/redis/redisConnector');
const { PIXEL_EVENT_TOPICS } = require('../config');

jest.mock('../../../util/redis/redisConnector');
jest.mock('../../../util/stats');
jest.mock('../../../logger');

describe('pixelTransform', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractCartToken', () => {
    const testCases = [
      {
        name: 'should extract cart token from valid path',
        input: {
          name: PIXEL_EVENT_TOPICS.CHECKOUT_STARTED,
          payload: { checkout_url: '/checkout/cn/abc123' },
          context: {
            document: {
              location: {
                pathname: '/checkout/cn/abc123',
              },
            },
          },
          query_parameters: { writeKey: 'test' },
        },
        expected: 'abc123',
      },
      {
        name: 'should return undefined for invalid event type',
        input: {
          name: 'invalid_event',
          payload: { checkout_url: '/checkout/cn/abc123' },
          query_parameters: { writeKey: 'test' },
        },
        expected: undefined,
      },
      {
        name: 'should return undefined for malformed path',
        input: {
          name: PIXEL_EVENT_TOPICS.CHECKOUT_STARTED,
          payload: { checkout_url: 'invalid_path' },
          query_parameters: { writeKey: 'test' },
        },
        expected: undefined,
      },
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
      const result = extractCartToken(input);
      expect(result).toBe(expected);
    });
  });

  describe('processPixelWebEvents', () => {
    const testCases = [
      {
        name: 'should process PAGE_VIEWED event',
        input: {
          name: PIXEL_EVENT_TOPICS.PAGE_VIEWED,
          clientId: 'test-client',
          id: 'test-id',
          timestamp: '2024-01-01',
          context: {},
          query_parameters: { writeKey: 'test' },
        },
        expected: {
          type: 'page',
          anonymousId: 'test-client',
          messageId: 'test-id',
          timestamp: '2024-01-01',
        },
      },
      {
        name: 'should return NO_OPERATION_SUCCESS for invalid event',
        input: {
          name: 'INVALID_EVENT',
          clientId: 'test-client',
          query_parameters: { writeKey: 'test' },
        },
        expected: {
          outputToSource: {
            body: 'T0s=',
            contentType: 'text/plain',
          },
          statusCode: 200,
        },
      },
    ];

    test.each(testCases)('$name', async ({ input, expected }) => {
      RedisDB.getVal.mockResolvedValue(null);
      const result = await processPixelWebEvents(input);
      expect(result).toMatchObject(expected);
    });

    it('should attach userId from Redis if available', async () => {
      RedisDB.getVal.mockResolvedValue({ userId: 'test-user' });

      const input = {
        name: PIXEL_EVENT_TOPICS.PAGE_VIEWED,
        clientId: 'test-client',
        id: 'test-id',
        timestamp: '2024-01-01',
        context: {},
        query_parameters: { writeKey: 'test' },
      };

      const result = await processPixelWebEvents(input);
      expect(result.userId).toBe('test-user');
    });
  });
});
