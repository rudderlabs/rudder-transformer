/* eslint-disable @typescript-eslint/naming-convention */
const _ = require('lodash');
const { processEventFromPixel } = require('./pixelTransform');
const { process: processWebhookEvents } = require('../../../v0/sources/shopify/transform');
const { RedisDB } = require('../../../util/redis/redisConnector');
const { serverEventToCartTokenLocationMapping } = require('./config');

const enrichServerSideResponseWithAnonymousId = async (response) => {
  if (serverEventToCartTokenLocationMapping[response.event]) {
    const cartTokenLocation = serverEventToCartTokenLocationMapping[response.event];
    const cartToken = _.get(response, cartTokenLocation);
    const anonymousId = await RedisDB.getVal(cartToken); // commented out to prevent the code from running
    response.anonymousId = anonymousId;
  }
};

const process = async (inputEvent) => {
  const { event } = inputEvent;
  // check on the source Config to identify the event is from the tracker-based (legacy)
  // or the pixel-based (latest) implementation.
  const { pixelEventLabel: pixelClientEventLabel } = event;
  if (pixelClientEventLabel) {
    // this is a event fired from the web pixel loaded on the browser
    // by the user interactions with the store.
    const responseV2 = await processEventFromPixel(event);
    return responseV2;
  }
  // this is for common logic for server-side events processing for both pixel and tracker apps.
  const response = await processWebhookEvents(event);
  // get value for anonymousId to enrich the event coming from the webhook.
  enrichServerSideResponseWithAnonymousId(response);
  return response;
};

module.exports = { process };
