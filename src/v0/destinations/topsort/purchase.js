const { ConfigCategory, mappingConfig } = require('./config');
const { getItemPayloads, addFinalPayload } = require('./utils');
const { constructPayload, generateUUID } = require('../../util');

const processPurchaseEventUtility = {
  // Create event data object for purchase events
  createEventData(basePayload, items, event) {
    return {
      topsortPayload: {
        ...basePayload,
        items,
        id: generateUUID(),
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
  processPurchaseEventUtility,
};
