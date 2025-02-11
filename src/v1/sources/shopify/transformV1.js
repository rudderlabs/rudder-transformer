const { PlatformError } = require('@rudderstack/integrations-lib');
const { isIdentifierEvent, processIdentifierEvent } = require('./utils');
const { processWebhookEvents } = require('./webhookTransformations/serverSideTransform');
const { processPixelWebEvents } = require('./webpixelTransformations/pixelTransform');

const processV1Events = async (event) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { query_parameters } = event;

  // these are the events from the front-end tracking, viz. web-pixel or theme-app extension.
  const { pixelEventLabel: clientSideEvent } = event;
  const isServerSideEvent = query_parameters && query_parameters?.version?.[0] === 'pixel';

  if (clientSideEvent) {
    // check if the event is an identifier event, used to set the anonymousId in the redis for identity stitching.
    if (isIdentifierEvent(event)) {
      return processIdentifierEvent(event);
    }
    // handle events from the app pixel.
    const pixelWebEventResponse = await processPixelWebEvents(event);
    return pixelWebEventResponse;
  }
  if (isServerSideEvent) {
    // this is a server-side event from the webhook subscription made by the pixel app.
    const pixelWebhookEventResponse = await processWebhookEvents(event);
    return pixelWebhookEventResponse;
  }
  throw new PlatformError(
    'Invalid Event for Shopiyf V1 (not matching client or server side event requirements)',
    500,
  );
};

module.exports = {
  processV1Events,
};
