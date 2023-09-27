const { identifierEvents, NO_OPERATION_SUCCESS } = require('./config');
const stats = require('../../../util/stats');
const { getLineItemsToStore } = require('./commonUtils');
const { RedisDB } = require('../../../util/redis/redisConnector');
const logger = require('../../../logger');

const identifierEventLayer = {
  isIdentifierEvent(event) {
    return identifierEvents.includes(event?.event);
  },

  async processIdentifierEvent(event, metricMetadata) {
    let value;
    let field;
    if (event.event === 'rudderIdentifier') {
      field = 'anonymousId';
      const lineItemshash = getLineItemsToStore(event.cart);
      value = ['anonymousId', event.anonymousId, 'lineItems', lineItemshash];
      stats.increment('shopify_redis_calls', {
        type: 'set',
        field: 'lineItems',
        ...metricMetadata,
      });
      /* cart_token: {
           anonymousId: 'anon_id1',
           lineItemshash: '0943gh34pg'
          }
      */
    } else {
      field = 'sessionId';
      value = ['sessionId', event.sessionId];
      /* cart_token: {
          anonymousId:'anon_id1',
          lineItemshash:'90fg348fg83497u',
          sessionId: 'session_id1'
         }
      */
    }
    try {
      stats.increment('shopify_redis_calls', {
        type: 'set',
        field,
        ...metricMetadata,
      });
      await RedisDB.setVal(`${event.cartToken}`, value);
    } catch (e) {
      logger.debug(`{{SHOPIFY::}} cartToken map set call Failed due redis error ${e}`);
      stats.increment('shopify_redis_failures', {
        type: 'set',
        ...metricMetadata,
      });
    }
    return [NO_OPERATION_SUCCESS];
  },
};

module.exports = { identifierEventLayer };
