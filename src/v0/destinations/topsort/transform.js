const {
  InstrumentationError,
  ConfigurationError,
  getHashFromArray,
} = require('@rudderstack/integrations-lib');
const {
  mappingConfig,
  ECOMM_EVENTS_WITH_PRODUCT_ARRAY,
  ConfigCategory,
  ENDPOINT,
} = require('./config');
const {
  constructPayload,
  handleRtTfSingleEventError,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
} = require('../../util');
const { isProductArrayValid, getMappedEventName } = require('./utils');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { processPurchaseEventUtility } = require('./purchase');
const { processImpressionsAndClicksUtility } = require('./impressions-and-clicks');

const processTopsortEvents = (message, { Config }, finalPayloads) => {
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

const processEvent = (message, destination, finalPayloads) => {
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

  processTopsortEvents(message, destination, finalPayloads);
};

// Process function that is called per event
const process = (event) => {
  const finalPayloads = {
    impressions: [],
    clicks: [],
    purchases: [],
  };

  processEvent(event.message, event.destination, finalPayloads);

  const response = defaultRequestConfig();
  const { apiKey } = event.destination.Config;

  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = finalPayloads;
  response.headers = {
    'content-type': JSON_MIME_TYPE,
    Authorization: `Bearer ${apiKey}`,
  };

  response.endpoint = ENDPOINT;

  return response;
};

// Router destination handler to process a batch of events
const processRouterDest = async (inputs, reqMetadata) => {
  const finalPayloads = {
    impressions: [],
    clicks: [],
    purchases: [],
  };

  const failureResponses = [];
  const successMetadatas = [];

  inputs.forEach((input) => {
    try {
      // Process the event
      processEvent(input.message, input.destination, finalPayloads);
      // Add to successMetadatas array
      successMetadatas.push(input.metadata);
    } catch (error) {
      // Handle error and store the error details
      const failureResponse = handleRtTfSingleEventError(input, error, reqMetadata);
      failureResponses.push(failureResponse);
    }
  });

  const response = defaultRequestConfig();
  const { destination } = inputs[0];
  const { apiKey } = destination.Config;

  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = finalPayloads;
  response.headers = {
    'content-type': JSON_MIME_TYPE,
    Authorization: `Bearer ${apiKey}`,
  };

  response.endpoint = ENDPOINT;

  const successResponses = getSuccessRespEvents(response, successMetadatas, destination, true);

  return [successResponses, ...failureResponses];
};

module.exports = { process, processRouterDest };
