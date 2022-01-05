const { getShopifyTopic, createPropertiesForEcomEvent } = require("./util");
const { generateUUID, CustomError } = require("../../util");
const Message = require("../message");
const { EventType } = require("../../../constants");
const {
  INTEGERATION,
  MAPPING_CATEGORIES,
  IDENTIFY_TOPICS,
  ECOM_TOPICS,
  RUDDER_ECOM_MAP,
  SUPPORTED_TRACK_EVENTS
} = require("./config");

const identifyPayloadBuilder = event => {
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.IDENTIFY);
  message.setPropertiesV2(event, MAPPING_CATEGORIES[EventType.IDENTIFY]);
  if (event.updated_at) {
    // converting shopify updated_at timestamp to rudder timestamp format
    message.setTimestamp(new Date(event.updated_at).toISOString());
  }
  return message;
};

const ecomPayloadBuilder = (event, shopifyTopic) => {
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName(RUDDER_ECOM_MAP[shopifyTopic]);

  const properties = createPropertiesForEcomEvent(event);
  Object.keys(properties).forEach(key =>
    message.setProperty(`properties.${key}`, properties[key])
  );
  if (event.updated_at) {
    // TODO: look for created_at for checkout_create?
    // converting shopify updated_at timestamp to rudder timestamp format
    message.setTimestamp(new Date(event.updated_at).toISOString());
  }
  if (event.user_id) {
    message.setProperty("userId", event.user_id);
  }

  return message;
};

const trackPayloadBuilder = (event, shopifyTopic) => {
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName(shopifyTopic);
  Object.keys(event)
    .filter(key => !key.includes(["type", "event"]))
    .forEach(key => {
      message.setProperty(`properties.${key}`, event[key]);
    });
  if (event.user_id) {
    message.setProperty("userId", event.user_id);
  }
  return message;
};

const processEvent = event => {
  let message;
  const shopifyTopic = getShopifyTopic(event);
  delete event.query_parameters;

  switch (shopifyTopic) {
    case IDENTIFY_TOPICS.CUSTOMERS_CREATE:
    case IDENTIFY_TOPICS.CUSTOMERS_UPDATE:
      message = identifyPayloadBuilder(event);
      break;
    case ECOM_TOPICS.ORDERS_UPDATED:
    case ECOM_TOPICS.CHECKOUTS_CREATE:
      message = ecomPayloadBuilder(event, shopifyTopic);
      break;
    default:
      if (!SUPPORTED_TRACK_EVENTS.includes(shopifyTopic)) {
        throw new CustomError(`event type ${shopifyTopic} not supported`, 400);
      }
      message = trackPayloadBuilder(event, shopifyTopic);
      break;
  }

  if (message.userId) {
    message.userId = String(message.userId);
  }
  message.setProperty("anonymousId", generateUUID());
  message.setProperty(`integrations.${INTEGERATION}`, true);
  return message;
};

const process = event => {
  const response = processEvent(event);
  return response;
};

exports.process = process;
