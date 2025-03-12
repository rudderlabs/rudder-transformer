const { process: processTrackerEvents } = require('./tracker/transform');
const { getBodyFromV2SpecPayload } = require('../../v0/util');
const { processPixelEvents } = require('./transformPixel');
const { isShopifyPixelEvent } = require('./utils');

/*
V0
{
  query_parameters: { }
  key: value
}

V1
{
  event: {
    query_parameters: { }
    key: value
  },
  source: {}
}

V2
{
  request: {
    body: {
      
    },
    query_parameters: { },
    headers: {},
    method: 'POST',
    url: 'https://api.shopify.com/v1/shopify/events'
  },
  source: {}
}
*/

function getEventFromV2Request(sourceEvent) {
  const event = getBodyFromV2SpecPayload(sourceEvent);
  const queryParams = sourceEvent.request.query_parameters;
  if (typeof queryParams === 'object') {
    event.query_parameters = queryParams;
  }

  return event;
}

const process = async (payload) => {
  const event = getEventFromV2Request(payload);

  if (isShopifyPixelEvent(event)) {
    return processPixelEvents(event);
  }
  return processTrackerEvents(event);
};

module.exports = { process };
