const get = require('get-value');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { defaultRequestConfig, simpleProcessRouterDest, getHashFromArray } = require('../../util');

const responseBuilder = (message, { Config }) => {
  const { tuneEvents } = Config; // Extract tuneEvents from config
  const { properties, event: messageEvent } = message; // Destructure properties and event from message

  // Find the relevant tune event based on the message's event name
  const tuneEvent = tuneEvents.find((event) => event.eventName === messageEvent);

  if (tuneEvent) {
    const standardHashMap = getHashFromArray(tuneEvent.standardMapping);
    const advSubIdHashMap = getHashFromArray(tuneEvent.advSubIdMapping);
    const advUniqueIdHashMap = getHashFromArray(tuneEvent.advUniqueIdMapping);

    const mapPropertiesWithNestedSupport = (msg, mappings) => {
      const newParams = {}; // Create a new object for parameters
      Object.entries(mappings).forEach(([key, value]) => {
        let data; // Declare data variable

        if (key.split('.').length > 1) {
          // Handle nested keys
          data = get(msg, key); // Use `get` to retrieve nested data
          if (data) {
            newParams[value] = data; // Map to the corresponding destination key
          }
        } else {
          // Handle non-nested keys
          data = get(properties, key); // Retrieve data from properties directly
          if (data) {
            newParams[value] = data; // Map to the corresponding destination key
          }
        }
      });
      return newParams; // Return the new params object
    };

    const params = {
      ...mapPropertiesWithNestedSupport(message, standardHashMap),
      ...mapPropertiesWithNestedSupport(message, advSubIdHashMap),
      ...mapPropertiesWithNestedSupport(message, advUniqueIdHashMap),
    };

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
