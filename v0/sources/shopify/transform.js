const _ = require("lodash");
const get = require("get-value");
const {
  getShopifyTopic,
  createPropertiesForEcomEvent,
  getProductsListFromLineItems,
  extractEmailFromPayload,
  setAnonymousId
} = require("./util");
const { CustomError, removeUndefinedAndNullValues } = require("../../util");
const Message = require("../message");
const { EventType } = require("../../../constants");
const {
  INTEGERATION,
  MAPPING_CATEGORIES,
  IDENTIFY_TOPICS,
  ECOM_TOPICS,
  RUDDER_ECOM_MAP,
  SUPPORTED_TRACK_EVENTS,
  SHOPIFY_TRACK_MAP
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

  let properties = createPropertiesForEcomEvent(event);
  properties = removeUndefinedAndNullValues(properties);
  Object.keys(properties).forEach(key =>
    message.setProperty(`properties.${key}`, properties[key])
  );
  // Map Customer details if present
  const customerDetails = get(event, "customer");
  if (customerDetails) {
    message.setPropertiesV2(
      customerDetails,
      MAPPING_CATEGORIES[EventType.IDENTIFY]
    );
  }
  if (event.updated_at) {
    // TODO: look for created_at for checkout_create?
    // converting shopify updated_at timestamp to rudder timestamp format
    message.setTimestamp(new Date(event.updated_at).toISOString());
  }
  if (event.customer) {
    message.setPropertiesV2(
      event.customer,
      MAPPING_CATEGORIES[EventType.IDENTIFY]
    );
  }
  if (event.shipping_address) {
    message.setProperty("traits.shippingAddress", event.shipping_address);
  }
  if (event.billing_address) {
    message.setProperty("traits.billingAddress", event.billing_address);
  }
  if (!message.userId && event.user_id) {
    message.setProperty("userId", event.user_id);
  }

  return message;
};

const trackPayloadBuilder = (event, shopifyTopic) => {
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName(SHOPIFY_TRACK_MAP[shopifyTopic]);
  Object.keys(event)
    .filter(
      key =>
        ![
          "type",
          "event",
          "line_items",
          "customer",
          "shipping_address",
          "billing_address"
        ].includes(key)
    )
    .forEach(key => {
      message.setProperty(`properties.${key}`, event[key]);
    });
  const { line_items: lineItems } = event;
  const productsList = getProductsListFromLineItems(lineItems);
  message.setProperty("properties.products", productsList);
  if (event.customer) {
    message.setPropertiesV2(
      event.customer,
      MAPPING_CATEGORIES[EventType.IDENTIFY]
    );
  }
  if (event.shipping_address) {
    message.setProperty("traits.shippingAddress", event.shipping_address);
  }
  if (event.billing_address) {
    message.setProperty("traits.billingAddress", event.billing_address);
  }
  if (!message.userId && event.user_id) {
    message.setProperty("userId", event.user_id);
  }
  return message;
};

const processEvent = inputEvent => {
  let message;
  const event = _.cloneDeep(inputEvent);
  const shopifyTopic = getShopifyTopic(event);
  delete event.query_parameters;
  switch (shopifyTopic) {
    case IDENTIFY_TOPICS.CUSTOMERS_CREATE:
    case IDENTIFY_TOPICS.CUSTOMERS_UPDATE:
      message = identifyPayloadBuilder(event);
      break;
    case ECOM_TOPICS.ORDERS_CREATE:
    case ECOM_TOPICS.ORDERS_UPDATE:
    case ECOM_TOPICS.CHECKOUTS_CREATE:
    case ECOM_TOPICS.CHECKOUTS_UPDATE:
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
  if (!get(message, "traits.email")) {
    const email = extractEmailFromPayload(event);
    if (email) {
      message.setProperty("traits.email", email);
    }
  }
  if (message.type !== EventType.IDENTIFY) {
    setAnonymousId(message);
  }
  message.setProperty(`integrations.${INTEGERATION}`, true);
  message.setProperty("context.library", {
    name: "RudderStack Shopify Cloud",
    version: "1.0.0"
  });
  message = removeUndefinedAndNullValues(message);
  return message;
};

const process = event => {
  return processEvent(event);
};

exports.process = process;
