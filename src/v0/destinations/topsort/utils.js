const lib = require('@rudderstack/integrations-lib');
const { constructPayload } = require('../../util');
const { ConfigCategory, mappingConfig } = require('./config');

const { ConfigurationError } = lib;

// Function to check if a product array is valid
const isProductArrayValid = (event, properties) =>
  Array.isArray(properties?.products) && properties?.products.length > 0;

// Function to construct item payloads for each product
const getItemPayloads = (products, mappingConfigs) =>
  products.map((product) => constructPayload(product, mappingConfigs));

// Function to add the structured event data to the final payloads array
const addFinalPayload = (eventData, finalPayloads) => {
  switch (eventData.event) {
    case 'impressions':
      finalPayloads.impressions.push(eventData.topsortPayload);
      break;
    case 'clicks':
      finalPayloads.clicks.push(eventData.topsortPayload);
      break;
    case 'purchases':
      finalPayloads.purchases.push(eventData.topsortPayload);
      break;
    default:
      throw new ConfigurationError('Invalid event mapping');
  }
};

// Function to retrieve mapped event name from Topsort event mappings.
const getMappedEventName = (parsedTopsortEventMappings, event) => {
  const eventName = event.toLowerCase();

  const mappedEventNames = parsedTopsortEventMappings[eventName];

  // Check if mapping exists
  if (!mappedEventNames) {
    throw new ConfigurationError(`Event '${eventName}' not found in Topsort event mappings`);
  }

  // If there are multiple mappings, pick the first one or apply your logic
  if (Array.isArray(mappedEventNames)) {
    return mappedEventNames[0]; // Return the first mapping
  }

  return mappedEventNames; // Return the single mapping if not an array
};

const processImpressionsAndClicksUtility = {
  // Create event data object
  createEventData(basePayload, placementPayload, itemPayload, event) {
    return {
      topsortPayload: {
        ...basePayload,
        placement: {
          ...placementPayload,
          ...itemPayload,
        },
        id: lib.generateUUID(),
      },
      event,
    };
  },

  // Process events with a product array
  processProductArray({
    products,
    basePayload,
    placementPayload,
    topsortEventName,
    finalPayloads,
  }) {
    const itemPayloads = getItemPayloads(products, mappingConfig[ConfigCategory.ITEM.name]);
    itemPayloads.forEach((itemPayload) => {
      const eventData = this.createEventData(
        basePayload,
        placementPayload,
        itemPayload,
        topsortEventName,
      );
      addFinalPayload(eventData, finalPayloads);
    });
  },

  // Process events with a single product
  processSingleProduct({
    basePayload,
    placementPayload,
    message,
    topsortEventName,
    finalPayloads,
  }) {
    const itemPayload = constructPayload(message, mappingConfig[ConfigCategory.ITEM.name]);
    const eventData = this.createEventData(
      basePayload,
      placementPayload,
      itemPayload,
      topsortEventName,
    );

    // Ensure messageId is used instead of generating a UUID for single product events
    eventData.topsortPayload.id = message.messageId;

    // Add final payload with appropriate ID and other headers
    addFinalPayload(eventData, finalPayloads);
  },

  processImpressionsAndClicks({
    isProductArrayAvailable,
    basePayload,
    topsortEventName,
    finalPayloads,
    products,
    message,
    placementPayload,
  }) {
    if (isProductArrayAvailable) {
      // If product array is available, process the event with multiple products
      this.processProductArray({
        basePayload,
        topsortEventName,
        finalPayloads,
        products,
        placementPayload,
      });
    } else {
      // Otherwise, process the event with a single product
      this.processSingleProduct({
        basePayload,
        topsortEventName,
        finalPayloads,
        message,
        placementPayload,
      });
    }
  },
};

const processPurchaseEventUtility = {
  // Create event data object for purchase events
  createEventData(basePayload, items, event) {
    return {
      topsortPayload: {
        ...basePayload,
        items,
        id: lib.generateUUID(),
      },
      event,
    };
  },

  // Function to process events with a product array for purchase events
  processProductArray(args) {
    const { products, basePayload, topsortEventName, finalPayloads } = args;
    const itemPayloads = getItemPayloads(
      products,
      mappingConfig[ConfigCategory.PURCHASE_ITEM.name],
    );
    const eventData = this.createEventData(basePayload, itemPayloads, topsortEventName);
    addFinalPayload(eventData, finalPayloads);
  },

  // Function to process events with a single product for purchase events
  processSingleProduct(args) {
    const { basePayload, message, topsortEventName, finalPayloads } = args;
    const itemPayload = constructPayload(message, mappingConfig[ConfigCategory.PURCHASE_ITEM.name]);
    const eventData = this.createEventData(basePayload, [itemPayload], topsortEventName);

    // Ensure messageId is used instead of generating a UUID for single product events
    eventData.topsortPayload.id = message.messageId;

    // Add final payload with appropriate ID and other headers
    addFinalPayload(eventData, finalPayloads);
  },

  // Function to process purchase events (either with a product array or single product)
  processPurchaseEvent(args) {
    if (args.isProductArrayAvailable) {
      // Process the event with multiple products (product array)
      this.processProductArray(args);
    } else {
      // Process the event with a single product
      this.processSingleProduct(args);
    }
  },
};

module.exports = {
  isProductArrayValid,
  getItemPayloads,
  addFinalPayload,
  getMappedEventName,
  processImpressionsAndClicksUtility,
  processPurchaseEventUtility,
};
