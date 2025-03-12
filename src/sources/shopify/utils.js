const { RedisDB } = require('../../util/redis/redisConnector');
const stats = require('../../util/stats');

const NO_OPERATION_SUCCESS = {
  outputToSource: {
    body: Buffer.from('OK').toString('base64'),
    contentType: 'text/plain',
  },
  statusCode: 200,
};

/**
 * Updates the anonymousId to userId mapping in Redis
 * @param {String} anonymousId
 * @param {String} userId
 */
const updateAnonymousIdToUserIdInRedis = async (anonymousId, userId) => {
  if (anonymousId && userId) {
    // set the anonymousId to userId mapping in Redis for 24 hours
    await RedisDB.setVal(`pixel:${anonymousId}`, ['userId', userId], 86400).then(() => {
      stats.increment('shopify_pixel_userid_mapping', {
        action: 'stitchUserIdToAnonId',
        operation: 'set',
      });
    });
  }
};

const isIdentifierEvent = (payload) => ['rudderIdentifier'].includes(payload?.event);

/**
 * Sets the cartToken <-> anonymousId mapping or anonymousId <-> userId mapping in Redis based on the event action
 * @param {Object} event
 * @returns {Object} NO_OPERATION_SUCCESS
 */
const processIdentifierEvent = async (event) => {
  const { cartToken, anonymousId, userId, action } = event;
  if (cartToken && anonymousId && action === 'stitchCartTokenToAnonId') {
    // set the cartToken to anonymousId mapping in Redis for 12 hours
    await RedisDB.setVal(`pixel:${cartToken}`, ['anonymousId', anonymousId], 43200).then(() => {
      stats.increment('shopify_pixel_cart_token_mapping', {
        action: 'stitchCartTokenToAnonId',
        operation: 'set',
      });
    });
  }
  if (action === 'stitchUserIdToAnonId') {
    updateAnonymousIdToUserIdInRedis(anonymousId, userId);
  }
  return NO_OPERATION_SUCCESS;
};

const isShopifyPixelEvent = (event) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { query_parameters } = event;
  const { pixelEventLabel: pixelClientEventLabel } = event;

  return !!(
    (query_parameters && query_parameters?.version?.[0] === 'pixel') ||
    pixelClientEventLabel
  );
};

module.exports = {
  processIdentifierEvent,
  isIdentifierEvent,
  isShopifyPixelEvent,
  updateAnonymousIdToUserIdInRedis,
};
