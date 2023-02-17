const _ = require('lodash');
const get = require('get-value');
const stats = require('../../../util/stats');
const {
  getShopifyTopic,
  createPropertiesForEcomEvent,
  getProductsListFromLineItems,
  extractEmailFromPayload,
  setAnonymousId,
} = require('./util');
const { removeUndefinedAndNullValues } = require('../../util');
const Message = require('../message');
const { EventType } = require('../../../constants');
const {
  INTEGERATION,
  MAPPING_CATEGORIES,
  IDENTIFY_TOPICS,
  ECOM_TOPICS,
  RUDDER_ECOM_MAP,
  SUPPORTED_TRACK_EVENTS,
  SHOPIFY_TRACK_MAP,
} = require('./config');
const { TransformationError } = require('../../util/errorTypes');

const identifyPayloadBuilder = (event) => {
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
  Object.keys(properties).forEach((key) =>
    message.setProperty(`properties.${key}`, properties[key]),
  );
  // Map Customer details if present
  const customerDetails = get(event, 'customer');
  if (customerDetails) {
    message.setPropertiesV2(customerDetails, MAPPING_CATEGORIES[EventType.IDENTIFY]);
  }
  if (event.updated_at) {
    // TODO: look for created_at for checkout_create?
    // converting shopify updated_at timestamp to rudder timestamp format
    message.setTimestamp(new Date(event.updated_at).toISOString());
  }
  if (event.customer) {
    message.setPropertiesV2(event.customer, MAPPING_CATEGORIES[EventType.IDENTIFY]);
  }
  if (event.shipping_address) {
    message.setProperty('traits.shippingAddress', event.shipping_address);
  }
  if (event.billing_address) {
    message.setProperty('traits.billingAddress', event.billing_address);
  }
  if (!message.userId && event.user_id) {
    message.setProperty('userId', event.user_id);
  }

  return message;
};

const trackPayloadBuilder = (event, shopifyTopic) => {
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName(SHOPIFY_TRACK_MAP[shopifyTopic]);
  Object.keys(event)
    .filter(
      (key) =>
        ![
          'type',
          'event',
          'line_items',
          'customer',
          'shipping_address',
          'billing_address',
        ].includes(key),
    )
    .forEach((key) => {
      message.setProperty(`properties.${key}`, event[key]);
    });
  // eslint-disable-next-line camelcase
  const { line_items: lineItems, billing_address, user_id, shipping_address, customer } = event;
  const productsList = getProductsListFromLineItems(lineItems);
  message.setProperty('properties.products', productsList);
  if (customer) {
    message.setPropertiesV2(customer, MAPPING_CATEGORIES[EventType.IDENTIFY]);
  }
  // eslint-disable-next-line camelcase
  if (shipping_address) {
    message.setProperty('traits.shippingAddress', shipping_address);
  }
  // eslint-disable-next-line camelcase
  if (billing_address) {
    message.setProperty('traits.billingAddress', billing_address);
  }
  // eslint-disable-next-line camelcase
  if (!message.userId && user_id) {
    message.setProperty('userId', user_id);
  }
  return message;
};

const processEvent = (inputEvent) => {
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
        throw new TransformationError(`event type ${shopifyTopic} not supported`);
      }
      message = trackPayloadBuilder(event, shopifyTopic);
      break;
  }

  if (message.userId) {
    message.userId = String(message.userId);
  }
  if (!get(message, 'traits.email')) {
    const email = extractEmailFromPayload(event);
    if (email) {
      message.setProperty('traits.email', email);
    }
  }
  if (message.type !== EventType.IDENTIFY) {
    setAnonymousId(message);
  }
  message.setProperty(`integrations.${INTEGERATION}`, true);
  message.setProperty('context.library', {
    name: 'RudderStack Shopify Cloud',
    version: '1.0.0',
  });
  message.setProperty('context.topic', shopifyTopic);

  // attaching cart, checkout and order tokens in context object
  message.setProperty(`context.cart_token`, event.cart_token);
  message.setProperty(`context.checkout_token`, event.checkout_token);
  if (shopifyTopic === 'orders_updated') {
    message.setProperty(`context.order_token`, event.token);
  }

  message = removeUndefinedAndNullValues(message);
  stats.increment('shopify_server_side_identifier_event', 1, {
    writeKey: inputEvent.query_parameters?.writeKey?.[0],
    timestamp: Date.now(),
  });
  return message;
};
const isIdentifierEvent = (event) => {
  if (event?.event === 'rudderIdentifier') {
    stats.increment('shopify_client_side_identifier_event', 1, {
      writeKey: event.query_parameters?.writeKey?.[0],
      timestamp: Date.now(),
    });
    return true;
  }
  return false;
};
const processIdentifierEvent = () => {
  const result = {
    outputToSource: {
      body: Buffer.from('OK').toString('base64'),
      contentType: 'text/plain',
    },
    statusCode: 200,
  };
  return result;
};
const process = (event) =>
  isIdentifierEvent(event) ? processIdentifierEvent() : processEvent(event);

exports.process = process;
