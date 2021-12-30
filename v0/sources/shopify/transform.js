const { getShopifyTopic } = require("./util");
const { generateUUID } = require("../../util");
const Message = require("../message");
const { EventType } = require("../../../constants");
const {
  INTEGERATION,
  MAPPING_CATEGORIES,
  IDENTIFY_TOPICS,
  ECOM_TOPICS
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

const ecomPayloadBuilder = event => {
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName("Checkout Started");
  message.setPropertiesV2(event, MAPPING_CATEGORIES[EventType.TRACK]);

  if (event.updated_at) {
    // converting shopify updated_at timestamp to rudder timestamp format
    message.setTimestamp(new Date(event.updated_at).toISOString());
  }

  return message;
};

const processEvent = event => {
  let message;
  const shopifyTopic = getShopifyTopic(event);
  switch (shopifyTopic) {
    case IDENTIFY_TOPICS.CUSTOMERS_CREATE:
    case IDENTIFY_TOPICS.CUSTOMERS_UPDATE:
      message = identifyPayloadBuilder(event);
      break;
    case ECOM_TOPICS.CHECKOUT_CREATE:
      message = ecomPayloadBuilder(event);
      break;
    default:
      break;
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
