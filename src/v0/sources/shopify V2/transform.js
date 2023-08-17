const _ = require('lodash');
const {
  getShopifyTopic,
  getDataFromRedis,
  getCartToken
} = require('./commonUtils');
const { enrichmentLayer } = require('./enrichmentLayer');
const { identifyLayer } = require('./identifyEventsLayer');
const { trackLayer } = require('./trackEventsLayer');
const { identifierEventLayer } = require('./identifierEventsUtils');
const { removeUndefinedAndNullValues } = require('../../util');
const { IDENTIFY_TOPICS } = require('./config');

const processEvent = async (inputEvent, metricMetadata) => {
  let message;
  let redisData;
  const event = _.cloneDeep(inputEvent);
  const shopifyTopic = getShopifyTopic(event);
  delete event.query_parameters;
  if (IDENTIFY_TOPICS.includes(shopifyTopic)) {
    message = identifyLayer.identifyPayloadBuilder(event);
  } else {
    const cartToken = getCartToken(message);
    redisData = await getDataFromRedis(cartToken, metricMetadata);
    message = trackLayer.processtrackEvent(event, redisData, metricMetadata);
  }
  message = enrichmentLayer.enrichMessage(event, message, redisData, metricMetadata);
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
