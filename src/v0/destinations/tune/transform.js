const get = require('get-value');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  getHashFromArray,
  isDefinedAndNotNull,
  isNotEmpty,
} = require('../../util');

const getTuneEndpoint = (subdomain) => `https://${subdomain}.go2cloud.org/aff_l`;

const mapPropertiesWithNestedSupport = (msg, properties, mappings) => {
  const mappedObj = {}; // Create a new object for parameters
  Object.entries(mappings).forEach(([key, value]) => {
    const keyStr = `${key}`;
    const args = { object: properties, key: keyStr };
    if (args.key.split('.').length > 1) {
      // Handle nested keys
      args.object = msg; // This line modifies the object property of args
    }
    const data = get(args.object, args.key);
    if (isDefinedAndNotNull(data) && isNotEmpty(data)) {
      mappedObj[value] = data; // Map to the corresponding destination key
    }
  });
  return mappedObj; // Return the new params object
};

const responseBuilder = (message, { Config }) => {
  const { tuneEvents, subdomain } = Config; // Extract tuneEvents from config
  const { properties, event: messageEvent } = message; // Destructure properties and event from message

  // Find the relevant tune event based on the message's event name
  const tuneEvent = tuneEvents.find((event) => event.eventName === messageEvent);

  if (tuneEvent) {
    const standardHashMap = getHashFromArray(tuneEvent.standardMapping, 'from', 'to', false);
    const advSubIdHashMap = getHashFromArray(tuneEvent.advSubIdMapping, 'from', 'to', false);
    const advUniqueIdHashMap = getHashFromArray(tuneEvent.advUniqueIdMapping, 'from', 'to', false);

    const params = {
      ...mapPropertiesWithNestedSupport(message, properties, standardHashMap),
      ...mapPropertiesWithNestedSupport(message, properties, advSubIdHashMap),
      ...mapPropertiesWithNestedSupport(message, properties, advUniqueIdHashMap),
    };

    const endpoint = getTuneEndpoint(subdomain);

    // Prepare the response
    const response = defaultRequestConfig();
    response.params = params; // Set only the mapped params
    response.endpoint = endpoint;

    return response;
  }

  throw new InstrumentationError('No matching tune event found for the provided event.', 400);
};

const processEvent = (message, destination) => {
  // Validate message type
  if (!isDefinedAndNotNull(message.type) || typeof message.type !== 'string') {
    throw new InstrumentationError(
      'Message Type is not present or is not a string. Aborting message.',
      400,
    );
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
  process,
  processRouterDest,
};
