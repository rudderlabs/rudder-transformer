const _ = require('lodash');
const get = require('get-value');
const {
  getShopifyTopic,
  getDataFromRedis,
  getCartToken,
  extractEmailFromPayload,
} = require('./commonUtils');
const { identifyLayer } = require('./identifyEventsLayer');
const { TrackLayer } = require('./trackEventsLayer');
const { IdentifierEventLayer } = require('./identifierEventsLayer');
const { removeUndefinedAndNullValues, isDefinedAndNotNull } = require('../../util');
const { IDENTIFY_TOPICS, INTEGRATION } = require('./config');

const processEvent = async (inputEvent, metricMetadata) => {
  let message;
  let dbData = null;
  const shopifyEvent = _.cloneDeep(inputEvent);
  const shopifyTopic = getShopifyTopic(shopifyEvent);
  delete shopifyEvent.query_parameters;
  if (IDENTIFY_TOPICS.includes(shopifyTopic)) {
    message = [identifyLayer.identifyPayloadBuilder(shopifyEvent)];
  } else {
    const cartToken = getCartToken(shopifyEvent, shopifyTopic);
    if (isDefinedAndNotNull(cartToken)) {
      dbData = await getDataFromRedis(cartToken, metricMetadata);
    }
    message = await TrackLayer.processTrackEvent(
      shopifyEvent,
      shopifyTopic,
      dbData,
      metricMetadata,
    );
  }
  message.forEach((event) => {
    // check for if message is NO_OPERATION_SUCCESS Payload
    if (event.outputToSource) {
      return event;
    }
    if (event.userId) {
      // eslint-disable-next-line no-param-reassign
      event.userId = String(event.userId);
    }
    if (!get(event, 'traits.email')) {
      const email = extractEmailFromPayload(shopifyEvent);
      if (email) {
        event.setProperty('traits.email', email);
      }
    }
    event.setProperty(`integrations.${INTEGRATION}`, true);
    event.setProperty('context.library', {
      name: 'RudderStack Shopify Cloud',
      version: '1.0.0',
    });
    event.setProperty('context.topic', shopifyTopic);
    // attaching cart, checkout and order tokens in context object
    event.setProperty(`context.cart_token`, shopifyEvent.cart_token);
    event.setProperty(`context.checkout_token`, shopifyEvent.checkout_token);
    if (shopifyTopic === 'orders_updated') {
      event.setProperty(`context.order_token`, shopifyEvent.token);
    }
    // eslint-disable-next-line no-param-reassign
    event = removeUndefinedAndNullValues(event);
    return event;
  });
  return message;
};

const process = async (event) => {
  const metricMetadata = {
    writeKey: event.query_parameters?.writeKey?.[0],
    source: 'SHOPIFY',
  };
  if (IdentifierEventLayer.isIdentifierEvent(event)) {
    return [await IdentifierEventLayer.processIdentifierEvent(event, metricMetadata)];
  }
  const response = await processEvent(event, metricMetadata);
  return response;
};

exports.process = process;
