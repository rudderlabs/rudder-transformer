const { process: processV0 } = require('../../../v0/sources/shopify/transform');
const { processV1Events } = require('./transformV1');
const { isShopifyV1Event } = require('./utils');

const process = async (inputEvent) => {
  const { event } = inputEvent;
  if (isShopifyV1Event(event)) {
    const v1EventResponse = await processV1Events(event);
    return v1EventResponse;
  }
  return processV0(event);
};

module.exports = { process };
