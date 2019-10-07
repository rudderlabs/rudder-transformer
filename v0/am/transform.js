const _ = require("lodash");
const get = require("get-value");
const set = require("set-value");

const { EventType } = require("../../constants");
const { removeUndefinedValues, defaultGetRequestConfig } = require("../util");
const {
  Event,
  ENDPOINT,
  IDENTIFY_ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
} = require("./config");

// Utility method for creating the structure required for single message processing
// with basic fields populated
function createSingleMessageBasicStructure(message) {
  return _.pick(message, [
    "type",
    "event",
    "context",
    "anonymous_id",
    "timestamp",
    "integrations"
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

  set(rawPayload, "event_proprties", message.properties);
  set(rawPayload, "user_proprties", message.user_properties);

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });

  const endpoint = evType === EventType.IDENTIFY ? IDENTIFY_ENDPOINT : ENDPOINT;

  rawPayload["time"] = new Date(message.timestamp).getTime();
  rawPayload["event_type"] = evType;
  rawPayload["user_id"] = message.anonymous_id;
  const payload = removeUndefinedValues(rawPayload);

  const response = {
    endpoint,
    requestConfig: defaultGetRequestConfig,
    header: {},
    user_id: message.anonymous_id,
    payload: {
      api_key: destination.Config.apiKey,
      [rootElementName]: payload
    }
  };
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
  let payloadObjectName = "event";
  let evType;
  let category = ConfigCategory.DEFAULT;

  var messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      payloadObjectName = "identification";
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
        const isRevenue = false;
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
      return [{ error: "message type not supported" }];
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
    const eventType = message.event.toLowerCase();
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
      respList.push(processSingleMessage(sendEvent, destination));
    });
  });

  return respList;
}

exports.process = process;
