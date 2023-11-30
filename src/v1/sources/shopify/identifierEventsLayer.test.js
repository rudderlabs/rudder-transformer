const { IdentifierEventLayer } = require('./identifierEventsLayer');
const { NO_OPERATION_SUCCESS } = require('./config');
const { RedisDB } = require('../../../util/redis/redisConnector');

describe('processIdentifierEvent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle "rudderIdentifier" event', async () => {
    const message = {
      event: 'rudderIdentifier',
      anonymousId: 'anon_id1',
      cart: { line_items: [] },
      cartToken: 'cart_token1',
    };

    const metricMetadata = {
      // ...
    };
    const result = await IdentifierEventLayer.processIdentifierEvent(message, metricMetadata);
    expect(result).toEqual([NO_OPERATION_SUCCESS]);
  });

  it('should handle other events', async () => {
    const message = {
      event: 'otherEvent',
      sessionId: 'session_id1',
      cartToken: 'cart_token1',
    };

    const metricMetadata = {
      // ...
    };

    const result = await IdentifierEventLayer.processIdentifierEvent(message, metricMetadata);

    expect(result).toEqual([NO_OPERATION_SUCCESS]);
  });
});
