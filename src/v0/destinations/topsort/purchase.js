const { ConfigCategory, mappingConfig } = require('./config');
const { getItemPayloads } = require('./utils');
const { constructPayload } = require('../../util');

const processPurchaseEventUtility = {
  // Create event data object for purchase events
  createEventData(basePayload, items, event, id) {
    return {
      topsortPayload: {
        ...basePayload,
        items,
        id,
      },
      event,
    };
  },

  // Function to process events with a product array for purchase events
  processProductArray(args) {
    const { products, basePayload, topsortEventName, message } = args;
    const itemPayloads = getItemPayloads(
      products,
      mappingConfig[ConfigCategory.PURCHASE_ITEM.name],
    );
    return [this.createEventData(basePayload, itemPayloads, topsortEventName, message.messageId)];
  },

  // Function to process events with a single product for purchase events
  processSingleProduct(args) {
    const { basePayload, message, topsortEventName } = args;
    const itemPayload = constructPayload(message, mappingConfig[ConfigCategory.PURCHASE_ITEM.name]);
    return [this.createEventData(basePayload, [itemPayload], topsortEventName, message.messageId)];
  },

  // Function to process purchase events (either with a product array or single product)
  processPurchaseEvent(args) {
    if (args.isProductArrayAvailable) {
      // Process the event with multiple products (product array)
      return this.processProductArray(args);
    }
    // Process the event with a single product
    return this.processSingleProduct(args);
  },
};

module.exports = {
  processPurchaseEventUtility,
};
