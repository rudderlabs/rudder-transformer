const { ConfigCategory, mappingConfig } = require('./config');
const { getItemPayloads } = require('./utils');
const { constructPayload } = require('../../util');

const processImpressionsAndClicksUtility = {
  // Create event data object
  createEventData(basePayload, placementPayload, itemPayload, event, id) {
    return {
      topsortPayload: {
        ...basePayload,
        placement: {
          ...placementPayload,
          ...itemPayload,
        },
        id,
      },
      event,
    };
  },

  // Process events with a product array
  processProductArray({ products, basePayload, placementPayload, topsortEventName, message }) {
    const itemPayloads = getItemPayloads(products, mappingConfig[ConfigCategory.ITEM.name]);
    // One message fans out to one event per product, so the messageId alone would
    // repeat across them. Topsort dedupes on `id`, so suffix with the product's
    // index to keep each event distinct while staying stable across retries.
    return itemPayloads.map((itemPayload, index) =>
      this.createEventData(
        basePayload,
        placementPayload,
        itemPayload,
        topsortEventName,
        `${message.messageId}-${index}`,
      ),
    );
  },

  // Process events with a single product
  processSingleProduct({ basePayload, placementPayload, message, topsortEventName }) {
    const itemPayload = constructPayload(message, mappingConfig[ConfigCategory.ITEM.name]);
    return [
      this.createEventData(
        basePayload,
        placementPayload,
        itemPayload,
        topsortEventName,
        message.messageId,
      ),
    ];
  },

  processImpressionsAndClicks({
    isProductArrayAvailable,
    basePayload,
    topsortEventName,
    products,
    message,
    placementPayload,
  }) {
    if (isProductArrayAvailable) {
      // If product array is available, process the event with multiple products
      return this.processProductArray({
        basePayload,
        topsortEventName,
        products,
        message,
        placementPayload,
      });
    }
    // Otherwise, process the event with a single product
    return this.processSingleProduct({
      basePayload,
      topsortEventName,
      message,
      placementPayload,
    });
  },
};

module.exports = { processImpressionsAndClicksUtility };
