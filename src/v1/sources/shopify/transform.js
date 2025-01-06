/* eslint-disable @typescript-eslint/naming-convention */
const { processPixelWebEvents } = require('./webpixelTransformations/pixelTransform');
const { process: processWebhookEvents } = require('../../../v0/sources/shopify/transform');
const {
  process: processPixelWebhookEvents,
} = require('./webhookTransformations/serverSideTransform');
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
  await RedisDB.setVal(`${cartToken}`, ['anonymousId', anonymousId]);
  return NO_OPERATION_SUCCESS;
};

const process = async (inputEvent) => {
  const { event } = inputEvent;
  const { query_parameters } = event;
  if (isIdentifierEvent(event)) {
    return processIdentifierEvent(event);
  }
  // check identify the event is from the web pixel based on the pixelEventLabel property.
  const { pixelEventLabel: pixelClientEventLabel } = event;
  if (pixelClientEventLabel) {
    // this is a event fired from the web pixel loaded on the browser
    // by the user interactions with the store.
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
