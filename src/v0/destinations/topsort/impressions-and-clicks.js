const { ConfigCategory, mappingConfig } = require('./config');
const { getItemPayloads, addFinalPayload } = require('./utils');
const { constructPayload, generateUUID } = require('../../util');

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
        id: generateUUID(),
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

module.exports = { processImpressionsAndClicksUtility };
