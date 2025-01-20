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

module.exports = {
  processIdentifierEvent,
  isIdentifierEvent,
};
