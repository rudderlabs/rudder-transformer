const _ = require('lodash');
const {
  getShopifyTopic,
  getDataFromRedis,
  getCartToken
} = require('./commonUtils');
const { identifyLayer } = require('./identifyEventsLayer');
const { trackLayer } = require('./trackEventsLayer');
const { identifierEventLayer } = require('./identifierEventsUtils');
const { removeUndefinedAndNullValues, isDefinedAndNotNull } = require('../../util');
const { IDENTIFY_TOPICS, INTEGERATION } = require('./config');

const processEvent = async (inputEvent, metricMetadata) => {
  let message;
  let redisData = null;
  const shopifyEvent = _.cloneDeep(inputEvent);
  const shopifyTopic = getShopifyTopic(shopifyEvent);
  delete shopifyEvent.query_parameters;
  if (IDENTIFY_TOPICS.includes(shopifyTopic)) {
    message = identifyLayer.identifyPayloadBuilder(shopifyEvent);
  } else {
    const cartToken = getCartToken(shopifyEvent, shopifyTopic);
    if (isDefinedAndNotNull(cartToken)) {
      redisData = await getDataFromRedis(cartToken, metricMetadata);
    }
    message = await trackLayer.processTrackEvent(shopifyEvent, shopifyTopic, redisData, metricMetadata);
  }
  // check for if message is NO_OPERATION_SUCCESS Payload
  if (message.outputToSource) {
    return message;
  }
  message.setProperty(`integrations.${INTEGERATION}`, true);
  message.setProperty('context.library', {
    name: 'RudderStack Shopify Cloud',
    version: '1.0.0',
  });
  message.setProperty('context.topic', shopifyTopic);
  // attaching cart, checkout and order tokens in context object
  message.setProperty(`context.cart_token`, shopifyEvent.cart_token);
  message.setProperty(`context.checkout_token`, shopifyEvent.checkout_token);
  if (shopifyTopic === 'orders_updated') {
    message.setProperty(`context.order_token`, shopifyEvent.token);
  }
  message = removeUndefinedAndNullValues(message);
  return message;
};

const process = async (event) => {
  const metricMetadata = {
    writeKey: event.query_parameters?.writeKey?.[0],
    source: 'SHOPIFY',
  };
  if (identifierEventLayer.isIdentifierEvent(event)) {
    return identifierEventLayer.processIdentifierEvent(event, metricMetadata);
  }
  const response = await processEvent(event, metricMetadata);
  return response;
};


exports.process = process;
