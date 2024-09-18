/* eslint-disable @typescript-eslint/naming-convention */
const { isDefinedAndNotNull } = require('../../../v0/util');
const { processEventV2 } = require('./pixelTransform');
const {
  processEvent,
  isIdentifierEvent,
  processIdentifierEvent,
} = require('../../../v0/sources/shopify/transform');

const process = async (inputEvent) => {
  const { event, source } = inputEvent;
  const metricMetadata = {
    // eslint-disable-next-line unicorn/consistent-destructuring
    writeKey: source?.WriteKey || event.query_parameters?.writeKey?.[0],
    sourceId: source?.ID,
    source: 'SHOPIFY',
  };
  // check on the source Config to identify the event is from the tracker-based (legacy)
  // or the pixel-based (latest) implementation.
  if (source && isDefinedAndNotNull(source.Config) && source?.Config?.version === 'pixel') {
    const { pixelEventLabel } = event;
    if (pixelEventLabel) {
      // this is a event fired from the web pixel loaded on the browser
      // by the user interactions with the store.
      const responseV2 = await processEventV2(event);
      return responseV2;
    }
    const webhookEventResponse = await processEvent(event, metricMetadata, source);
    webhookEventResponse.context.library = {
      name: 'RudderStack Shopify Cloud',
      version: '2.0.0',
    };
    return webhookEventResponse;
  }
  if (isIdentifierEvent(event)) {
    return processIdentifierEvent(event, metricMetadata);
  }
  const response = await processEvent(event, metricMetadata, source);
  return response;
};

module.exports = { process };
