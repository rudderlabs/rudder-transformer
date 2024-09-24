const lodash = require('lodash');
const get = require('get-value');
const { isDefinedNotNullNotEmpty } = require('@rudderstack/integrations-lib');
const stats = require('../../../util/stats');
const { getShopifyTopic, extractEmailFromPayload } = require('../../../v0/sources/shopify/util');
const {
  identifyPayloadBuilder,
  trackPayloadBuilder,
  ecomPayloadBuilder,
} = require('../../../v0/sources/shopify/transform');
const { removeUndefinedAndNullValues, generateUUID } = require('../../../v0/util');
const Message = require('../../../v0/sources/message');
const {
  INTEGERATION,
  IDENTIFY_TOPICS,
  ECOM_TOPICS,
  SUPPORTED_TRACK_EVENTS,
} = require('../../../v0/sources/shopify/config');

const NO_OPERATION_SUCCESS = {
  outputToSource: {
    body: Buffer.from('OK').toString('base64'),
    contentType: 'text/plain',
  },
  statusCode: 200,
};

const processPixelWebhookEvent = async (inputEvent, metricMetadata) => {
  let message = new Message(INTEGERATION);
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
    case 'carts_update':
      message = trackPayloadBuilder(event, shopifyTopic);
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

  if (event.customer && isDefinedNotNullNotEmpty(event?.customer?.id)) {
    message.userId = String(event.customer.id);
  }
  message.anonymousId = generateUUID();

  if (!get(message, 'traits.email')) {
    const email = extractEmailFromPayload(event);
    if (email) {
      message.setProperty('traits.email', email);
    }
  }
  message.setProperty(`integrations.${INTEGERATION}`, true);
  message.setProperty('context.library', {
    name: 'RudderStack Shopify Cloud',
    eventOrigin: 'server',
    version: '2.0.0',
  });
  message.setProperty('context.topic', shopifyTopic);
  // attaching cart, checkout and order tokens in context object
  message.setProperty(`context.cart_token`, event.cart_token);
  message.setProperty(`context.checkout_token`, event.checkout_token);
  if (shopifyTopic === 'orders_updated') {
    message.setProperty(`context.order_token`, event.token);
  }
  message = removeUndefinedAndNullValues(message);
  return message;
};

module.exports = { processPixelWebhookEvent };
