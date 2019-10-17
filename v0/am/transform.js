const _ = require("lodash");
const get = require("get-value");
const set = require("set-value");

const { EventType, SpecedTraits, TraitsMapping } = require("../../constants");
const { removeUndefinedValues, defaultPostRequestConfig } = require("../util");
const {
  Event,
  ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
} = require("./config");

// Get the spec'd traits, for now only address needs treatment as 2 layers.
const populateSpecedTraits = (payload, message) => {
  SpecedTraits.forEach(trait => {
    const mapping = TraitsMapping[trait];
    const keys = Object.keys(mapping);
    keys.forEach(key => {
      set(payload, "user_properties." + key, get(message, mapping[key]));
    });
  });
};

// Utility method for creating the structure required for single message processing
// with basic fields populated
function createSingleMessageBasicStructure(message) {
  return _.pick(message, [
    "type",
    "event",
    "context",
    "userId",
    "originalTimestamp",
    "integrations",
    "session_id"
  ]);
}

// Build response for Amplitude. In this case, endpoint will be different depending
// on the event type being sent to Amplitude

function responseBuilderSimple(
  rootElementName,
  message,
  evType,
  mappingJson,
  destination
) {
  const rawPayload = {};

  set(rawPayload, "event_properties", message.properties);
  set(rawPayload, "user_properties", message.user_properties);

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });

  const endpoint = ENDPOINT; // evType === EventType.IDENTIFY ? IDENTIFY_ENDPOINT : ENDPOINT; // identify on same endpoint also works

  // in case of identify, populate user_properties from traits as well, don't need to send evType
  if (evType === EventType.IDENTIFY) {
    populateSpecedTraits(rawPayload, message);
    const traits = Object.keys(message.context.traits);
    traits.forEach(trait => {
      if (!SpecedTraits.includes(trait)) {
        set(
          rawPayload,
          "user_properties." + trait,
          get(message, "context.traits." + trait)
        );
      }
    });
    rawPayload.event_type = EventType.IDENTIFY_AM;
  } else {
    rawPayload.event_type = evType;
  }

  rawPayload.time = new Date(message.originalTimestamp).getTime();
  rawPayload.user_id = message.userId ? message.userId : message.anonymousId;
  const payload = removeUndefinedValues(rawPayload);

  //console.log(payload);

  const response = {
    endpoint,
    requestConfig: defaultPostRequestConfig,
    header: {
      "Content-Type": "application/json"
    },
    userId: message.userId ? message.userId : message.anonymousId,
    payload: {
      api_key: destination.Config.apiKey,
      [rootElementName]: payload
    }
  };
  //console.log(response);
  return response;
}

const isRevenueEvent = product => {
  if (
    product.quantity &&
    product.quantity.length > 0 &&
    product.price &&
    product.price.length > 0
  ) {
    return true;
  }
  return false;
};

// Generic process function which invokes specific handler functions depending on message type
// and event type where applicable
function processSingleMessage(message, destination) {
  const payloadObjectName = "events";
  let evType;
  let category = ConfigCategory.DEFAULT;

  var messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      // payloadObjectName = "identification"; // identify same as events
      evType = "identify";
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.PAGE:
      evType = "pageview";
      category = ConfigCategory.PAGE;
      break;
    case EventType.SCREEN:
      evType = "screenview";
      category = ConfigCategory.SCREEN;
      break;
    case EventType.TRACK:
      evType = message.event;

      if (message.products && message.products.length > 0) {
        let isRevenue = false;
        message.products.forEach(product => {
          if (isRevenueEvent(product)) {
            isRevenue = true;
          }
        });
        if (isRevenue) {
          category = ConfigCategory.REVENUE;
          break;
        }
      }

      switch (evType) {
        case Event.PROMOTION_CLICKED.name:
        case Event.PROMOTION_VIEWED.name:
        case Event.PRODUCT_CLICKED.name:
        case Event.PRODUCT_VIEWED.name:
        case Event.PRODUCT_ADDED.name:
        case Event.PRODUCT_REMOVED.name:
        case Event.PRODUCT_ADDED_TO_WISHLIST.name:
        case Event.PRODUCT_REMOVED_FROM_WISHLIST.name:
        case Event.PRODUCT_LIST_VIEWED.name:
        case Event.PRODUCT_LIST_CLICKED.name:
          category = nameToEventMap[evType].category;
          break;
        default:
          category = ConfigCategory.DEFAULT;
          break;
      }
      break;
    default:
      console.log("could not determine type");
      return { statusCode: 400, error: "message type not supported" };
  }

  return responseBuilderSimple(
    payloadObjectName,
    message,
    evType,
    mappingConfig[category.name],
    destination
  );
}

// Method for handling product list actions
function processProductListAction(message) {
  const eventList = [];
  const products = message.properties.products;

  // Now construct complete payloads for each product and
  // get them processed through single message processing logic
  products.forEach(product => {
    const productEvent = createSingleMessageBasicStructure(message);
    productEvent.properties = product;
    eventList.push(productEvent);
  });

  return eventList;
}

function processTransaction(message) {
  // For order cancel or refund, amounts need to be made negative
  const eventType = message.event.toLowerCase();

  // Why are we skipping Checkout started and Order Updated?
  // Order Cancelled is not being sent, but we are handling it here
  if (
    eventType === EventType.ORDER_CANCELLED.name ||
    eventType === EventType.ORDER_REFUNDED.name
  ) {
    return processProductListAction(message);
  }
  return [];
}

function process(events) {
  const respList = [];

  events.forEach(event => {
    const { message, destination } = event;
    const messageType = message.type.toLowerCase();
    const eventType = message.event ? message.event.toLowerCase() : undefined;
    const toSendEvents = [];
    if (
      messageType === EventType.TRACK &&
      (eventType === Event.PRODUCT_LIST_VIEWED.name ||
        eventType === Event.PRODUCT_LIST_CLICKED)
    ) {
      toSendEvents.push(processProductListAction(message));
    } else if (
      messageType === EventType.TRACK &&
      (eventType == Event.CHECKOUT_STARTED.name ||
        eventType == Event.ORDER_UPDATED.name ||
        eventType == Event.ORDER_COMPLETED.name ||
        eventType == Event.ORDER_CANCELLED.name)
    ) {
      toSendEvents.push(processTransaction(message));
    } else {
      toSendEvents.push(message);
    }

    toSendEvents.forEach(sendEvent => {
      const result = processSingleMessage(sendEvent, destination);
      if (!result.statusCode) {
        result.statusCode = 200;
      }
      respList.push(result);
    });
  });

  //console.log(JSON.stringify(respList));
  return respList;
}

exports.process = process;
