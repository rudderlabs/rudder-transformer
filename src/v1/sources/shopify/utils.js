const { RedisDB } = require('../../../util/redis/redisConnector');

const NO_OPERATION_SUCCESS = {
  outputToSource: {
    body: Buffer.from('OK').toString('base64'),
    contentType: 'text/plain',
  },
  statusCode: 200,
};

const isIdentifierEvent = (payload) => ['rudderIdentifier'].includes(payload?.event);

const processIdentifierEvent = async (event) => {
  const { cartToken, anonymousId } = event;
  await RedisDB.setVal(`pixel:${cartToken}`, ['anonymousId', anonymousId]);
  return NO_OPERATION_SUCCESS;
};

const isShopifyV1Event = (event) => {
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
  isShopifyV1Event,
};
