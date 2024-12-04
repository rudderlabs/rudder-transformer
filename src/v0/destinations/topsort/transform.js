const {
  InstrumentationError,
  ConfigurationError,
  getHashFromArrayWithDuplicate,
} = require('@rudderstack/integrations-lib');
const { ConfigCategory, mappingConfig, ECOMM_EVENTS_WITH_PRODUCT_ARRAY } = require('./config');
const { constructPayload, simpleProcessRouterDest } = require('../../util');
const {
  constructItemPayloads,
  createEventData,
  isProductArrayValid,
  getMappedEventName,
  addFinalPayload,
} = require('./utils');

// Function to process events with a product array
const processProductArray = (
  products,
  basePayload,
  placementPayload,
  topsortEvent,
  apiKey,
  finalPayloads,
) => {
  const itemPayloads = constructItemPayloads(products, mappingConfig[ConfigCategory.ITEM.name]);
  itemPayloads.forEach((itemPayload) => {
    const eventData = createEventData(basePayload, placementPayload, itemPayload, topsortEvent);
    addFinalPayload(eventData, apiKey, finalPayloads);
  });
};

// Function to process events with a single product or no product data
const processSingleProduct = (
  basePayload,
  placementPayload,
  message,
  topsortEvent,
  apiKey,
  finalPayloads,
  messageId,
) => {
  const itemPayload = constructPayload(message, mappingConfig[ConfigCategory.ITEM.name]);
  const eventData = createEventData(basePayload, placementPayload, itemPayload, topsortEvent);

  // Ensure messageId is used instead of generating a UUID for single product events
  eventData.data.id = messageId;

  // Add final payload with appropriate ID and other headers
  addFinalPayload(eventData, apiKey, finalPayloads);
};

const responseBuilder = (message, { Config }) => {
  const { apiKey, topsortEvents } = Config;
  const { event, properties } = message;

  // Parse Topsort event mappings
  const parsedTopsortEventMappings = getHashFromArrayWithDuplicate(topsortEvents);
  const mappedEventName = getMappedEventName(parsedTopsortEventMappings, event);

  if (!mappedEventName) {
    throw new InstrumentationError("Event not mapped in 'topsortEvents'. Dropping the event.");
  }

  const topsortEvent = mappedEventName;

  // Construct base and placement payloads
  const basePayload = constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]);
  const placementPayload = constructPayload(message, mappingConfig[ConfigCategory.PLACEMENT.name]);

  // Check if the event involves a product array (using ECOMM_EVENTS_WITH_PRODUCT_ARRAY)
  const isProductArrayAvailable =
    ECOMM_EVENTS_WITH_PRODUCT_ARRAY.includes(event) && isProductArrayValid(event, properties);

  const finalPayloads = [];

  // Handle events based on the presence of a product array
  if (isProductArrayAvailable) {
    processProductArray(
      properties.products,
      basePayload,
      placementPayload,
      topsortEvent,
      apiKey,
      finalPayloads,
    );
  } else {
    processSingleProduct(
      basePayload,
      placementPayload,
      message,
      topsortEvent,
      apiKey,
      finalPayloads,
    );
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

  let response;
  // Handle 'track' event type
  if (messageType === 'track') {
    response = responseBuilder(message, destination); // Call responseBuilder to handle the event
  } else {
    throw new InstrumentationError('Only "track" events are supported. Dropping event.', 400);
  }

  return response;
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
