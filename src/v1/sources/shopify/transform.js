/* eslint-disable @typescript-eslint/naming-convention */
const { processPixelWebEvents } = require('./webpixelTransformations/pixelTransform');
const { process: processWebhookEvents } = require('../../../v0/sources/shopify/transform');
const {
  process: processPixelWebhookEvents,
} = require('./webhookTransformations/serverSideTransform');
const { processIdentifierEvent, isIdentifierEvent } = require('./utils');

const process = async (inputEvent) => {
  const { event } = inputEvent;
  const { query_parameters } = event;

  // these are the events from the front-end tracking, viz. web-pixel or themea-app extension.
  const { pixelEventLabel: pixelClientEventLabel } = event;
  if (pixelClientEventLabel) {
    // check if the event is an identifier event, used to set the anonymousId in the redis for identity stitching.
    if (isIdentifierEvent(event)) {
      return processIdentifierEvent(event);
    }
    // handle events from the app pixel.
    const pixelWebEventResponse = await processPixelWebEvents(event);
    return pixelWebEventResponse;
  }
  if (query_parameters && query_parameters?.version?.[0] === 'pixel') {
    // this is a server-side event from the webhook subscription made by the pixel app.
    const pixelWebhookEventResponse = await processPixelWebhookEvents(event);
    return pixelWebhookEventResponse;
  }
  // this is a server-side event from the webhook subscription made by the legacy tracker-based app.
  const response = await processWebhookEvents(event);
  return response;
};

module.exports = { process };
