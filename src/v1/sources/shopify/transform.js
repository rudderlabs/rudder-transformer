/* eslint-disable @typescript-eslint/naming-convention */
const { processEventFromPixel } = require('./pixelTransform');
const { process: processWebhookEvents } = require('../../../v0/sources/shopify/transform');
const { process: processWebhookEventsV2 } = require('./serverSideTransform');

const process = async (inputEvent) => {
  const { event } = inputEvent;
  const { query_parameters } = event;
  // check on the source Config to identify the event is from the tracker-based (legacy)
  // or the pixel-based (latest) implementation.
  const { pixelEventLabel: pixelClientEventLabel } = event;
  if (pixelClientEventLabel) {
    // this is a event fired from the web pixel loaded on the browser
    // by the user interactions with the store.
    const responseV2 = await processEventFromPixel(event);
    return responseV2;
  }
  if (query_parameters && query_parameters.version[0] === 'pixel') {
    // this is a server-side event from the webhook subscription made by the pixel app.
    const responseV2 = await processWebhookEventsV2(event);
    return responseV2;
  }
  // this is a server-side event from the webhook subscription made by the legacy tracker-based app.
  const response = await processWebhookEvents(event);
  return response;
};

module.exports = { process };
