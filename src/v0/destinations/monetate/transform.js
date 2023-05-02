const get = require('get-value');
const { removeUndefinedValues, simpleProcessRouterDest } = require('../../util');
const {
  handleProductViewed,
  handleProductListViewed,
  handleProductAdded,
  handleCartViewed,
  handleOrderCompleted,
  constructPayload,
  responseBuilder,
} = require('./utils');
const { EventType } = require('../../../constants');
const { mappingConfig } = require('./config');
const { InstrumentationError } = require('../../util/errorTypes');

function track(message, destination) {
  const rawPayload = constructPayload(message, mappingConfig.MONETATETrack);

  if (message.userId) {
    rawPayload.customerId = message.userId;
  } else {
    rawPayload.deviceId = message.anonymousId;
  }

  // Add Ecomm Events if applicable
  const evName = message.event;
  const properties = message.properties || {};
  let updatedPayload = {};
  if (evName) {
    switch (evName) {
      case 'Product Viewed':
        updatedPayload = { ...handleProductViewed(properties, rawPayload) };
        break;
      case 'Product List Viewed':
        updatedPayload = { ...handleProductListViewed(properties, rawPayload) };
        break;
      case 'Product Added':
        updatedPayload = { ...handleProductAdded(properties, rawPayload) };
        break;
      case 'Cart Viewed':
        updatedPayload = { ...handleCartViewed(properties, rawPayload) };
        break;
      case 'Order Completed':
        updatedPayload = { ...handleOrderCompleted(properties, rawPayload) };
        break;
      default:
        // The Engine API does not currently support custom events.
        // For lifecycle events, we would prefer to add them to our spec,
        // rather than support free-form custom events.  Nevertheless, if
        // custom event support is added to the Engine API, the following
        // block can be uncommented.
        /*
        rawPayload.events.push({
          "eventType": "monetate:context:CustomEvents",
          "customEvents": [{
              name: evName,
              value: true,
          }],
        });
      */
        updatedPayload = { ...rawPayload };
        break;
    }
  }

  return responseBuilder(removeUndefinedValues(updatedPayload), destination);
}

function page(message, destination) {
  const rawPayload = constructPayload(message, mappingConfig.MONETATEPage);

  return responseBuilder(removeUndefinedValues(rawPayload), destination);
}

function screen(message, destination) {
  const rawPayload = constructPayload(message, mappingConfig.MONETATEScreen);

  return responseBuilder(removeUndefinedValues(rawPayload), destination);
}

function process(event) {
  // get the event type
  let evType = get(event, 'message.type');
  evType = evType ? evType.toLowerCase() : undefined;

  // call the appropriate handler based on event type
  if (evType) {
    switch (evType) {
      case EventType.TRACK:
        return track(event.message, event.destination);
      case EventType.PAGE:
        return page(event.message, event.destination);
      case EventType.SCREEN:
        return screen(event.message, event.destination);
      default:
        throw new InstrumentationError(`Event type ${evType} is not supported`);
    }
  }
  throw new InstrumentationError('Event type is required');
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
