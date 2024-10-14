const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { defaultRequestConfig, simpleProcessRouterDest } = require('../../util');

const responseBuilder = (message, { Config }) => {
  const { tuneEvents } = Config; // Extract tuneEvents from config
  const { properties, event: messageEvent } = message; // Destructure properties and event from message

  // Find the relevant tune event based on the message's event name
  const tuneEvent = tuneEvents.find((event) => event.eventName === messageEvent);

  if (tuneEvent) {
    const params = {};

    // Map the properties to their corresponding destination keys
    tuneEvent.eventsMapping.forEach((mapping) => {
      if (properties && properties[mapping.from] !== undefined) {
        params[mapping.to] = properties[mapping.from]; // Map the property to the destination key
      }
    });

    // Prepare the response
    const response = defaultRequestConfig();
    response.params = params; // Set only the mapped params
    response.endpoint = tuneEvent.url; // Use the user-defined URL

    // Add query parameters from the URL to params
    const urlParams = new URLSearchParams(new URL(tuneEvent.url).search);
    urlParams.forEach((value, key) => {
      params[key] = value; // Add each query parameter to params
    });

    // Include the event name in the response, not in params
    response.event = tuneEvent.eventName;

    return response;
  }

  throw new InstrumentationError('No matching tune event found for the provided event.', 400);
};

const processEvent = (message, destination) => {
  // Validate message type
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.', 400);
  }
  const messageType = message.type.toLowerCase();

  // Initialize response variable
  let response;

  // Process 'track' messages using the responseBuilder
  if (messageType === 'track') {
    response = responseBuilder(message, destination);
  } else {
    throw new InstrumentationError('Message type not supported. Only "track" is allowed.', 400);
  }

  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = {
  responseBuilder,
  processEvent,
  process,
  processRouterDest,
};
