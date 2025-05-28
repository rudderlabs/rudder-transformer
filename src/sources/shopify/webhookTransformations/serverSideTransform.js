const lodash = require('lodash');
const get = require('get-value');
const { isDefinedNotNullNotEmpty } = require('@rudderstack/integrations-lib');
const stats = require('../../../util/stats');
const { getShopifyTopic } = require('../tracker/util');
const { removeUndefinedAndNullValues } = require('../../../v0/util');
const Message = require('../../message');
const { EventType } = require('../../../constants');
const { SUPPORTED_TRACK_EVENTS, SHOPIFY_TRACK_MAP } = require('../tracker/config');
const {
  INTEGERATION,
  identifyMappingJSON,
  lineItemsMappingJSON,
  addressMappingJSON,
} = require('../config');
const { ECOM_TOPICS, RUDDER_ECOM_MAP } = require('../config');
const {
  createPropertiesForEcomEventFromWebhook,
  getProductsFromLineItems,
  setAnonymousId,
  handleCommonProperties,
  addCartTokenHashToTraits,
  ensureAnonymousId,
} = require('./serverSideUtlis');
const { updateAnonymousIdToUserIdInRedis } = require('../utils');
const { RedisDB } = require('../../../util/redis/redisConnector');

const NO_OPERATION_SUCCESS = {
  outputToSource: {
    body: Buffer.from('OK').toString('base64'),
    contentType: 'text/plain',
  },
  statusCode: 200,
};

const ecomPayloadBuilder = (event, shopifyTopic) => {
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName(RUDDER_ECOM_MAP[shopifyTopic]);

  const properties = createPropertiesForEcomEventFromWebhook(event, shopifyTopic);
  message.properties = removeUndefinedAndNullValues(properties);
  // Map Customer details if present
  const customerDetails = get(event, 'customer');
  // Initialize context.traits
  message.context = message.context || {};
  message.context.traits = {};
  if (customerDetails) {
    const { id } = customerDetails;

    // Apply mappings from identifyMappingJSON
    identifyMappingJSON.forEach((mapping) => {
      if (mapping.destKeys.startsWith('traits.')) {
        const sourceValue = get(customerDetails, mapping.sourceKeys);
        if (sourceValue !== undefined) {
          const destPath = mapping.destKeys.replace('traits.', '');
          lodash.set(message.context.traits, destPath, sourceValue);
        }
      }
    });

    // Handle additional traits from shipping_address using the same mapping logic
    if (id) {
      message.userId = id;
    }

    message.context.traits = removeUndefinedAndNullValues(message.context.traits);
  }
  if (event.updated_at) {
    message.setTimestamp(new Date(event.updated_at).toISOString());
  }
  if (event.shipping_address) {
    addressMappingJSON.forEach((mapping) => {
      const sourceValue = get(event.shipping_address, mapping.sourceKeys);
      if (sourceValue !== undefined) {
        const destPath = mapping.destKeys.replace('traits.', '');
        lodash.set(message.context.traits, destPath, sourceValue);
      }
    });
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
  const { userId, anonymousId, context } = message;
  const { traits } = context;
  const identifyEvent = new Message(INTEGERATION);
  identifyEvent.setEventType(EventType.IDENTIFY);
  if (userId) {
    identifyEvent.userId = userId;
  }
  if (anonymousId) {
    identifyEvent.anonymousId = anonymousId;
  }
  // Set the mapped contextual traits from the parent ecommerce event
  identifyEvent.context.traits = removeUndefinedAndNullValues(lodash.cloneDeep(traits || {}));
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
  // attach anonymousId using note_attributes
  await setAnonymousId(message, event, metricMetadata);

  // Ensure message has an anonymousId always by using uuid as fallback
  message = ensureAnonymousId(message, metricMetadata);

  await updateAnonymousIdToUserIdInRedis(message.anonymousId, message.userId);

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
  ecomPayloadBuilder,
  trackPayloadBuilder,
};
