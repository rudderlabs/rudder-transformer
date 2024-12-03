const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { BASE_URL, ConfigCategory, mappingConfig } = require('./config');
const { defaultRequestConfig, constructPayload, simpleProcessRouterDest } = require('../../util');

const responseBuilder = (message, { Config }) => {
  const { apiKey, topsortEvents } = Config; // Fetch the API Key and event mappings
  const { event } = message;

  let finalParams = {};

  // Construct the payload based on the message
  const payload = constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]);

  // Use topsortEvents to map the incoming event to a Topsort event
  const mappedEvent = topsortEvents.find((mapping) => mapping.from === event);
  if (!mappedEvent) {
    throw new InstrumentationError("Event not mapped in 'topsortEvents'. Dropping the event.");
  }

  // If the event is valid and mapped, get the corresponding Topsort event
  const topsortEvent = mappedEvent.to;

  // Add the mapped event into the payload (you can choose to modify the payload as needed)
  finalParams = {
    ...payload.params, // Include existing parameters from the payload
    event: topsortEvent, // Add the mapped Topsort event to the final parameters
  };

  // Prepare the response
  const response = defaultRequestConfig();
  response.params = finalParams; // Attach the parameters to the response
  response.endpoint = BASE_URL; // Set the appropriate API endpoint

  // Set the headers, including the API key for authentication
  response.headers = {
    'Content-Type': 'application/json',
    api_key: apiKey, // Add the API key here for authentication
  };

  return response;
};

// Function to validate and process incoming event
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
