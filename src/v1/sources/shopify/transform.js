/* eslint-disable @typescript-eslint/naming-convention */
const { processEventFromPixel } = require('./pixelTransform');
const { process: processWebhookEvents } = require('../../../v0/sources/shopify/transform');

const process = async (inputEvent) => {
  const { event } = inputEvent;
  // check on the source Config to identify the event is from the tracker-based (legacy)
  // or the pixel-based (latest) implementation.
  const { pixelEventLabel: pixelClientEventLabel, id } = event;
  if (pixelClientEventLabel) {
    // this is a event fired from the web pixel loaded on the browser
    // by the user interactions with the store.
    const responseV2 = await processEventFromPixel(event);
    return responseV2;
  }
  // this is for common logic for server-side events processing for both pixel and tracker apps.
  const response = await processWebhookEvents(event);
  // attach everything that is part of webhook event to the context inside a key called shopifyDetails
  response.context.shopifyDetails = { ...event };
  // set the messageId to the id property if present the event.
  if (id) {
    response.messageId = id;
  }
  return response;
};

module.exports = { process };
