const _ = require("lodash");
const get = require("get-value");
const set = require("set-value");

const { EventType } = require("../../constants");
const { removeUndefinedValues, defaultPostRequestConfig } = require("../util");

const {
  Event,
  ENDPOINT,
  ConfigCategory,
  mappingConfig,
  nameToEventMap
} = require("./config");

function responseBuilderSimple(payload, message, destination) {
  const endpoint = ENDPOINT + message.context.app.namespace;

  const updatedPayload = {
    ...payload,
    af_events_api: "true",
    eventTime: message.timestamp,
    customer_user_id: message.user_id,
    appsflyer_id:
      message.destination_props.AF.af_uid || destination.Config.appsFlyerId
  };

  return {
    endpoint,
    header: {
      "Content-Type": "application/json",
      authentication: destination.Config.apiKey
    },
    requestConfig: defaultPostRequestConfig,
    user_id: message.anonymous_id,
    payload: removeUndefinedValues(updatedPayload)
  };
}

function getEventValueForUnIdentifiedTrackEvent(message) {
  return {
    eventValue: message.properties
  };
}

function getEventValueMapFromMappingJson(message, mappingJson, isMultiSupport) {
  let rawPayload = {};
  set(rawPayload, "properties", message.properties);

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });

  if (isMultiSupport && message.products && message.products.length > 0) {
    const contentIds = [];
    const quantities = [];
    const prices = [];
    message.products.forEach(product => {
      contentIds.push(product.product_id);
      quantityArray.push(product.quantity);
      priceArray.push(product.price);
    });
    rawPayload.eventValue = {
      af_content_id: contentIds,
      af_quantity: quantities,
      af_price: prices
    };
  }
  return rawPayload;
}

function processNonTrackEvents(message, destination, eventName) {
  const payload = getEventValueForUnIdentifiedTrackEvent(message);
  payload.eventName = eventName;
  return payload;
}

function processEventTypeTrack(message, destination) {
  let isMultiSupport = true;
  let isUnIdentifiedEvent = false;
  const evType = message.event.toLowerCase();
  let category = ConfigCategory.DEFAULT;

  switch (evType) {
    case Event.WISHLIST_PRODUCT_ADDED_TO_CART.name:
    case Event.PRODUCT_ADDED_TO_WISHLIST.name:
    case Event.CHECKOUT_STARTED.name:
    case Event.ORDER_COMPLETED.name:
    case Event.PRODUCT_REMOVED.name:
    case Event.PRODUCT_SEARCHED.name:
    case Event.PRODUCT_VIEWED.name:
      category = nameToEventMap[evType].category;
      break;
    default:
      eventName = evType.toLowerCase();
      isMultiSupport = false;
      isUnIdentifiedEvent = true;
      break;
  }
  let payload;
  if (isUnIdentifiedEvent) {
    payload = getEventValueForUnIdentifiedTrackEvent(message);
  } else {
    payload = getEventValueMapFromMappingJson(
      message,
      mappingConfig[category.name],
      isMultiSupport
    );
  }
  payload.eventName = eventName;

  return payload;
}

function processSingleMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let payload;
  switch (messageType) {
    case EventType.TRACK:
      eventName = EventType.TRACK;
      evType = message.event;
      payload = processEventTypeTrack(message, destination);
      break;

    case EventType.SCREEN:
      eventName = EventType.SCREEN;
      evType = message.event;
      payload = processNonTrackEvents(message, destination, eventName);

      break;
    case EventType.PAGE:
      eventName = EventType.PAGE;
      evType = message.event;
      payload = processNonTrackEvents(message, destination, eventName);
      break;

    default:
      break;
  }
  return responseBuilderSimple(payload, message, destination);
}

function process(events) {
  return events.map(event => {
    return processSingleMessage(event.message, event.destination);
  });
}

exports.process = process;
