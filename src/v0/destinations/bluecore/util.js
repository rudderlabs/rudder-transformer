const { InstrumentationError, isDefinedAndNotNullAndNotEmpty, getHashFromArrayWithDuplicate, isDefinedAndNotNull } = require("@rudderstack/integrations-lib");
const { getFieldValueFromMessage, validateEventName } = require("../../util");
const { EVENT_NAME_MAPPING } = require("./config");

const verifyPayload = (payload, message) => {
    switch (payload.event) {
        case 'search':
            if (!payload.properties.search_term) {
                throw new InstrumentationError('[Bluecore] property:: search_query is required for search event');
            }
            break;
        case 'purchase':
            if (!payload.properties.order_id) {
                throw new InstrumentationError('[Bluecore] property:: order_id is required for purchase event');
            }
            if (!payload.properties.total) {
                throw new InstrumentationError('[Bluecore] property:: total is required for purchase event');
            }
            break;
        case 'identify':
            if (!isDefinedAndNotNullAndNotEmpty(getFieldValueFromMessage(message, 'email'))) {
                throw new InstrumentationError('[Bluecore] property:: email is required for identify event');
            }
            break;
        default:
            break;
    }
};

const deduceTrackEventName = (trackEventName, Config) => {
    let eventName;
    const { eventsMapping } = Config;
    validateEventName(trackEventName);
    /*
    Step 1: Will look for the event name in the eventsMapping array if mapped to a standard bluecore event.
            and return the corresponding event name if found.
     */
    if (eventsMapping.length > 0) {
        const keyMap = getHashFromArrayWithDuplicate(eventsMapping, 'from', 'to', false);
        eventName = keyMap[trackEventName];
        return eventName;
    }
    /*
    Step 2: To find if the particular event is amongst the list of standard
            Rudderstack ecommerce events, used specifically for Bluecore API
            mappings.
    */

    const eventMapInfo = EVENT_NAME_MAPPING.find((eventMap) => {
        if (eventMap.src.includes(trackEventName.toLowerCase())) {
            return eventMap;
        }
        return false;
    });
    if (isDefinedAndNotNull(eventMapInfo)) {
        return [eventMapInfo.dest];
    }

    // Step 3: if nothing matches this is to be considered as a custom event
    return trackEventName;
};

const addProductArray = (message, products, eventName) => {
    if (!isDefinedAndNotNull(products)) {
      throw new InstrumentationError(`Product array is required for ${eventName} event`);
    }
    const productArray =  Array.isArray(products) ? products : [products];
    productArray.forEach(({ product_id, query, order_id, total, ...rest }) => ({
      id: product_id,
      ...rest
    }));
    return productArray;
  }

module.exports = {
    verifyPayload,
    deduceTrackEventName,
    addProductArray
};

