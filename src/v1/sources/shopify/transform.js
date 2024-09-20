/* eslint-disable @typescript-eslint/naming-convention */
const { isDefinedAndNotNull } = require('../../../v0/util');
const { processEventFromPixel } = require('./pixelTransform');
const { processPixelWebhookEvent } = require('./pixelWebhookEventTransform');
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
      const responseV2 = await processEventFromPixel(event);
      return responseV2;
    }
    const webhookEventResponse = await processPixelWebhookEvent(event, metricMetadata, source);
    return webhookEventResponse;
  }
  if (isIdentifierEvent(event)) {
    return processIdentifierEvent(event, metricMetadata);
  }
  // this is for default legacy tracker based server-side events processing
  const response = await processEvent(event, metricMetadata, source);
  return response;
};

module.exports = { process };
