const { IDENTIFIER_EVENTS, NO_OPERATION_SUCCESS } = require('./config');
const stats = require('../../../util/stats');
const { getLineItemsToStore } = require('./commonUtils');
const { RedisDB } = require('../../../util/redis/redisConnector');
const logger = require('../../../logger');

const IdentifierEventLayer = {
  isIdentifierEvent(message) {
    return IDENTIFIER_EVENTS.includes(message?.event);
  },

  async processIdentifierEvent(message, metricMetadata) {
    let value;
    let field;
    if (message.event === 'rudderIdentifier') {
      field = 'anonymousId';
      const lineItemshash = getLineItemsToStore(message.cart);
      value = ['anonymousId', message.anonymousId, 'lineItems', lineItemshash];
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
      value = ['sessionId', message.sessionId];
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
      await RedisDB.setVal(`${message.cartToken}`, value);
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

module.exports = { IdentifierEventLayer };
