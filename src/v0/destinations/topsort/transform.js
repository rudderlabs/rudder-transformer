const {
  InstrumentationError,
  ConfigurationError,
  getHashFromArray,
} = require('@rudderstack/integrations-lib');
const {
  BASE_URL,
  ConfigCategory,
  mappingConfig,
  ECOMM_EVENTS_WITH_PRODUCT_ARRAY,
} = require('./config');
const { defaultRequestConfig, constructPayload, simpleProcessRouterDest } = require('../../util');

const responseBuilder = (message, { Config }) => {
  const { apiKey, topsortEvents } = Config; // Fetch the API Key and event mappings
  const { event, properties } = message;

  // // Construct the payload based on the message
  // const payload = constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]);

  /*
    {
      product_added : click
      product_added: impression
      product_removed : click
      product_viewed : view
      product_clicked : click
    }
*/
  const parsedTopsortEventMappings = getHashFromArray(topsortEvents);
  console.log(parsedTopsortEventMappings);

  let mappedEventName;

  // Use topsortEvents to map the incoming event to a Topsort event
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(parsedTopsortEventMappings)) {
    if (key === event) {
      mappedEventName = value;
      break;
    }
  }

  if (!mappedEventName) {
    throw new InstrumentationError("Event not mapped in 'topsortEvents'. Dropping the event.");
  }

  // If the event is valid and mapped, get the corresponding Topsort event
  const topsortEvent = mappedEventName;

  const basepayload = constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]);
  const placementPayload = constructPayload(message, mappingConfig[ConfigCategory.PLACEMENT.name]);

  let isProductArrayAvailable = ECOMM_EVENTS_WITH_PRODUCT_ARRAY.includes(event);
  const { products } = properties;
  if (!Array.isArray(products)) {
    isProductArrayAvailable = false; // or we can throw error
  }

  const finalPayloads = [];

  if (isProductArrayAvailable) {
    const topsortItems = products.map((product) => {
      const itemPayload = constructPayload(product, mappingConfig[ConfigCategory.ITEM.name]);
      return itemPayload;
    });

    data = {
      ...basepayload,
      items: topsortItems,
    };

    topsortItems.forEach((item) => {
      const data = {
        ...basepayload,
        placement: {
          ...placementPayload,
          ...item,
        },
        id: 'id', // generate
      };

      finalPayloads.push({
        data,
        event: topsortEvent,
      });
    });
  } else {
    const topsortItem = constructPayload(message, mappingConfig[ConfigCategory.ITEM.name]);

    const data = {
      ...basepayload,
      placement: {
        ...placementPayload,
        ...topsortItem,
      },
      id: 'messageID', // generate
    };

    finalPayloads.push({
      data,
      event: topsortEvent,
    });
  }

  return finalPayloads;
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
