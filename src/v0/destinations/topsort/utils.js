const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { constructPayload } = require('../../util');

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

module.exports = {
  isProductArrayValid,
  getItemPayloads,
  addFinalPayload,
  getMappedEventName,
};
