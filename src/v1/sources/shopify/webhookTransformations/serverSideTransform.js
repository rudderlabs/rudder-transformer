const lodash = require('lodash');
const get = require('get-value');
const { isDefinedNotNullNotEmpty } = require('@rudderstack/integrations-lib');
const stats = require('../../../../util/stats');
const { getShopifyTopic } = require('../../../../v0/sources/shopify/util');
const { removeUndefinedAndNullValues } = require('../../../../v0/util');
const Message = require('../../../../sources/message');
const { EventType } = require('../../../../constants');
const {
  IDENTIFY_TOPICS,
  SUPPORTED_TRACK_EVENTS,
  SHOPIFY_TRACK_MAP,
} = require('../../../../v0/sources/shopify/config');
const { INTEGERATION, identifyMappingJSON, lineItemsMappingJSON } = require('../config');
const { ECOM_TOPICS, RUDDER_ECOM_MAP } = require('../config');
const {
  createPropertiesForEcomEventFromWebhook,
  getProductsFromLineItems,
  setAnonymousId,
  handleCommonProperties,
  addCartTokenHashToTraits,
} = require('./serverSideUtlis');
const { updateAnonymousIdToUserIdInRedis } = require('../utils');
const { RedisDB } = require('../../../../util/redis/redisConnector');

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
  message.setPropertiesV2(event, identifyMappingJSON);
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
    message.setPropertiesV2(customerDetails, identifyMappingJSON);
  }
  if (event.updated_at) {
    message.setTimestamp(new Date(event.updated_at).toISOString());
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

/**
 * Creates an identify event with userId and anonymousId from message object and identifyMappingJSON
 * @param {String} message
 * @returns {Message} identifyEvent
 */
const createIdentifyEvent = (message) => {
  const { userId, anonymousId, traits } = message;
  const identifyEvent = new Message(INTEGERATION);
  identifyEvent.setEventType(EventType.IDENTIFY);
  if (userId) {
    identifyEvent.userId = userId;
  }
  if (anonymousId) {
    identifyEvent.anonymousId = anonymousId;
  }
  const mappedTraits = {};
  identifyMappingJSON.forEach((mapping) => {
    if (mapping.destKeys.startsWith('traits.')) {
      const traitKey = mapping.destKeys.replace('traits.', '');
      const sourceValue = get(traits, traitKey);
      if (sourceValue !== undefined) {
        lodash.set(mappedTraits, traitKey, sourceValue);
      }
    }
  });
  // Set the mapped traits
  identifyEvent.context.traits = removeUndefinedAndNullValues(mappedTraits);
  identifyEvent.setProperty(`integrations.${INTEGERATION}`, true);
  identifyEvent.setProperty('context.library', {
    eventOrigin: 'server',
    name: 'RudderStack Shopify Cloud',
    version: '2.0.0',
  });
  return identifyEvent;
};

const processEvent = async (inputEvent, metricMetadata) => {
  let message;
  const event = lodash.cloneDeep(inputEvent);
  const { customer } = event;
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
    case ECOM_TOPICS.ORDERS_CANCELLED:
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
    await setAnonymousId(message, event, metricMetadata);
    await updateAnonymousIdToUserIdInRedis(message.anonymousId, message.userId);
  }
  // attach email and other contextual properties
  message = handleCommonProperties(message, event, shopifyTopic);
  // add cart_token_hash to traits if cart_token is present
  message = addCartTokenHashToTraits(message, event);
  const redisData = await RedisDB.getVal(`pixel:${message.anonymousId}`);
  if (isDefinedNotNullNotEmpty(redisData)) {
    message.userId = redisData.userId;
    stats.increment('shopify_pixel_userid_mapping', {
      action: 'stitchUserIdToAnonId',
      operation: 'get',
    });
  }
  if (message.userId) {
    message.userId = String(message.userId);
  }
  message = removeUndefinedAndNullValues(message);

  // if the message payload contains both anonymousId and userId or contains customer object, hence the user is identified
  // then create an identify event by multiplexing the original event and return both the message and identify event
  if (
    (message.userId && message.anonymousId) ||
    (message.userId && customer) ||
    (message.anonymousId && customer)
  ) {
    const identifyEvent = createIdentifyEvent(message);
    return [message, identifyEvent];
  }
  return message;
};
const processWebhookEvents = async (event) => {
  const metricMetadata = {
    writeKey: event.query_parameters?.writeKey?.[0],
    source: 'SHOPIFY',
  };
  const response = await processEvent(event, metricMetadata);
  return response;
};

module.exports = {
  processWebhookEvents,
  processEvent,
  identifyPayloadBuilder,
  ecomPayloadBuilder,
  trackPayloadBuilder,
};
