const { generateUUID } = require('@rudderstack/integrations-lib');
const { constructPayload } = require('../../util');
const { BASE_URL } = require('./config');

// Function to check if a product array is valid
const isProductArrayValid = (event, properties) =>
  Array.isArray(properties?.products) && properties?.products.length > 0;

// Function to construct item payloads for each product
const constructItemPayloads = (products, mappingConfig) =>
  products.map((product) => constructPayload(product, mappingConfig));

// Function to create a single event data structure
const createEventData = (basePayload, placementPayload, itemPayload, event) => ({
  data: {
    ...basePayload,
    placement: {
      ...placementPayload,
      ...itemPayload,
    },
    id: generateUUID(),
  },
  event,
});

// Function to add the structured event data to the final payloads array
const addFinalPayload = (eventData, apiKey, finalPayloads) => {
  finalPayloads.push({
    ...eventData,
    endpoint: BASE_URL, // Set the destination API URL
    headers: {
      'Content-Type': 'application/json',
      api_key: apiKey, // Add the API key here for authentication
    },
  });
};

// Function to retrieve mapped event name from Topsort event mappings.
const getMappedEventName = (parsedTopsortEventMappings, event) => {
  const mappedEventNames = parsedTopsortEventMappings[event];

  // Check if mapping exists
  if (!mappedEventNames) {
    throw new Error(`Event '${event}' not found in Topsort event mappings`);
  }

  // If there are multiple mappings, pick the first one or apply your logic
  if (Array.isArray(mappedEventNames)) {
    return mappedEventNames[0]; // Return the first mapping
  }

  return mappedEventNames; // Return the single mapping if not an array
};

module.exports = {
  isProductArrayValid,
  constructItemPayloads,
  createEventData,
  addFinalPayload,
  getMappedEventName,
};
