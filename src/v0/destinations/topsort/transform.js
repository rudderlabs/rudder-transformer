const {
  InstrumentationError,
  ConfigurationError,
  getHashFromArray,
} = require('@rudderstack/integrations-lib');
const { mappingConfig, ECOMM_EVENTS_WITH_PRODUCT_ARRAY, ConfigCategory } = require('./config');
const { constructPayload, simpleProcessRouterDest } = require('../../util');
const {
  isProductArrayValid,
  getMappedEventName,
  processImpressionsAndClicksUtility,
  processPurchaseEventUtility,
} = require('./utils');

const responseBuilder = (message, { Config }) => {
  const { topsortEvents } = Config;
  const { event, properties } = message;
  const { products } = properties;

  // Parse Topsort event mappings
  const mappedEventName = getMappedEventName(getHashFromArray(topsortEvents), event);

  if (!mappedEventName) {
    throw new InstrumentationError("Event not mapped in 'topsortEvents'. Dropping the event.");
  }

  const topsortEventName = mappedEventName;

  // Construct base and placement payloads
  const basePayload = constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]);

  const finalPayloads = {
    impressions: [],
    clicks: [],
    purchases: [],
  };

  const commonArgs = {
    basePayload,
    topsortEventName,
    finalPayloads,
    products,
    message,
    isProductArrayAvailable:
      ECOMM_EVENTS_WITH_PRODUCT_ARRAY.includes(event) && isProductArrayValid(event, properties),
  };

  // Process events based on type and construct payload within each logic block
  if (topsortEventName === 'impressions' || topsortEventName === 'clicks') {
    const placementPayload = constructPayload(
      message,
      mappingConfig[ConfigCategory.PLACEMENT.name],
    );
    processImpressionsAndClicksUtility.processImpressionsAndClicks({
      ...commonArgs,
      placementPayload, // Only pass placementPayload for impressions and clicks
    });
  } else if (topsortEventName === 'purchases') {
    processPurchaseEventUtility.processPurchaseEvent({
      ...commonArgs,
    });
  } else {
    throw new InstrumentationError(`Event not mapped: ${topsortEventName}`);
  }

  return finalPayloads;
};

const processEvent = (message, destination) => {
  // Check for missing API Key or missing Advertiser ID
  if (!destination.Config.apiKey) {
    throw new ConfigurationError('API Key is missing. Aborting message.', 400);
  }
  if (!message.type) {
    throw new InstrumentationError('Message Type is missing. Aborting message.', 400);
  }

  const messageType = message.type.toLowerCase();

  // Handle 'track' event type
  if (messageType !== 'track') {
    throw new InstrumentationError('Only "track" events are supported. Dropping event.', 400);
  }

  return responseBuilder(message, destination);
};

// Process function that is called per event
const process = (event) => processEvent(event.message, event.destination);

// Router destination handler to process a batch of events
const processRouterDest = async (inputs, reqMetadata) => {
  // Process all events through the simpleProcessRouterDest utility
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
