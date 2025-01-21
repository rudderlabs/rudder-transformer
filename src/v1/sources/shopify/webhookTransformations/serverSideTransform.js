const lodash = require('lodash');
const get = require('get-value');
const stats = require('../../../../util/stats');
const { getShopifyTopic } = require('../../../../v0/sources/shopify/util');
const { removeUndefinedAndNullValues } = require('../../../../v0/util');
const Message = require('../../../../v0/sources/message');
const { EventType } = require('../../../../constants');
const {
  INTEGERATION,
  MAPPING_CATEGORIES,
  IDENTIFY_TOPICS,
  ECOM_TOPICS,
  SUPPORTED_TRACK_EVENTS,
  SHOPIFY_TRACK_MAP,
  lineItemsMappingJSON,
} = require('../../../../v0/sources/shopify/config');
const { RUDDER_ECOM_MAP } = require('../config');
const {
  createPropertiesForEcomEventFromWebhook,
  getProductsFromLineItems,
  handleAnonymousId,
  handleCommonProperties,
} = require('./serverSideUtlis');

const NO_OPERATION_SUCCESS = {
  outputToSource: {
    body: Buffer.from('OK').toString('base64'),
    contentType: 'text/plain',
  },
  statusCode: 200,
};

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

  const properties = createPropertiesForEcomEventFromWebhook(event, shopifyTopic);
  message.properties = removeUndefinedAndNullValues(properties);
  // Map Customer details if present
  const customerDetails = get(event, 'customer');
  if (customerDetails) {
    message.setPropertiesV2(customerDetails, MAPPING_CATEGORIES[EventType.IDENTIFY]);
  }
  if (event.updated_at) {
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
  return message;
};

const trackPayloadBuilder = (event, shopifyTopic) => {
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName(SHOPIFY_TRACK_MAP[shopifyTopic]);
  // eslint-disable-next-line camelcase
  const { line_items: lineItems } = event;
  const productsList = getProductsFromLineItems(lineItems, lineItemsMappingJSON);
  message.setProperty('properties.products', productsList);
  return message;
};

const processEvent = async (inputEvent, metricMetadata) => {
  let message;
  const event = lodash.cloneDeep(inputEvent);
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
        stats.increment('invalid_shopify_event', {
          writeKey: metricMetadata.writeKey,
          source: metricMetadata.source,
          shopifyTopic: metricMetadata.shopifyTopic,
        });
        return NO_OPERATION_SUCCESS;
      }
      message = trackPayloadBuilder(event, shopifyTopic);
      break;
  }
  // attach anonymousId if the event is track event using note_attributes
  if (message.type !== EventType.IDENTIFY) {
    handleAnonymousId(message, event);
  }
  // attach userId, email and other contextual properties
  message = handleCommonProperties(message, event, shopifyTopic);
  message = removeUndefinedAndNullValues(message);
  return message;
};
const process = async (event) => {
  const metricMetadata = {
    writeKey: event.query_parameters?.writeKey?.[0],
    source: 'SHOPIFY',
  };
  const response = await processEvent(event, metricMetadata);
  return response;
};

module.exports = {
  process,
  processEvent,
  identifyPayloadBuilder,
  ecomPayloadBuilder,
  trackPayloadBuilder,
};
