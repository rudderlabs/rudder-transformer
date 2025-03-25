/* eslint-disable no-param-reassign */
// eslint-disable-next-line @typescript-eslint/naming-convention
const _ = require('lodash');
const { isDefinedNotNullNotEmpty } = require('@rudderstack/integrations-lib');
const stats = require('../../../util/stats');
const logger = require('../../../logger');
const { removeUndefinedAndNullValues } = require('../../../v0/util');
const { RedisDB } = require('../../../util/redis/redisConnector');
const {
  pageViewedEventBuilder,
  cartViewedEventBuilder,
  productListViewedEventBuilder,
  productViewedEventBuilder,
  productToCartEventBuilder,
  checkoutEventBuilder,
  checkoutStepEventBuilder,
  searchEventBuilder,
  extractCampaignParams,
} = require('./pixelUtils');
const campaignObjectMappings = require('../pixelEventsMappings/campaignObjectMappings.json');
const {
  INTEGERATION,
  PIXEL_EVENT_TOPICS,
  pixelEventToCartTokenLocationMapping,
} = require('../config');

const NO_OPERATION_SUCCESS = {
  outputToSource: {
    body: Buffer.from('OK').toString('base64'),
    contentType: 'text/plain',
  },
  statusCode: 200,
};

/**
 * Parses and extracts cart token value from the input event
 * @param {Object} inputEvent
 * @returns {String} cartToken
 */
function extractCartToken(inputEvent) {
  const cartTokenLocation = pixelEventToCartTokenLocationMapping[inputEvent.name];
  if (!cartTokenLocation) {
    stats.increment('shopify_pixel_cart_token_not_found', {
      event: inputEvent.name,
      writeKey: inputEvent.query_parameters.writeKey,
    });
    return undefined;
  }
  // the unparsedCartToken is a string like '/checkout/cn/1234'
  const unparsedCartToken = _.get(inputEvent, cartTokenLocation);
  if (typeof unparsedCartToken !== 'string') {
    logger.error(`Cart token is not a string`);
    stats.increment('shopify_pixel_cart_token_not_found', {
      event: inputEvent.name,
      writeKey: inputEvent.query_parameters.writeKey,
    });
    return undefined;
  }
  const cartTokenParts = unparsedCartToken.split('/');
  const cartToken = cartTokenParts[3];
  return cartToken;
}

/**
 * Handles storing cart token and anonymousId (clientId) in Redis
 * @param {Object} inputEvent
 * @param {String} clientId
 */
const handleCartTokenRedisOperations = async (inputEvent, clientId) => {
  const cartToken = extractCartToken(inputEvent);
  try {
    if (isDefinedNotNullNotEmpty(clientId) && isDefinedNotNullNotEmpty(cartToken)) {
      await RedisDB.setVal(`pixel:${cartToken}`, ['anonymousId', clientId], 43200);
      stats.increment('shopify_pixel_cart_token_set', {
        event: inputEvent.name,
        writeKey: inputEvent.query_parameters.writeKey,
      });
    }
  } catch (error) {
    logger.error(`Error handling Redis operations for event: ${inputEvent.name}`, error);
    stats.increment('shopify_pixel_cart_token_redis_error', {
      event: inputEvent.name,
      writeKey: inputEvent.query_parameters.writeKey,
    });
  }
};

async function processPixelEvent(inputEvent) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { name, query_parameters, context, clientId, id, timestamp } = inputEvent;
  const shopifyDetails = { ...inputEvent };
  delete shopifyDetails.query_parameters;
  delete shopifyDetails.pixelEventLabel;
  let message = {};
  switch (name) {
    case PIXEL_EVENT_TOPICS.PAGE_VIEWED:
      message = pageViewedEventBuilder(inputEvent);
      break;
    case PIXEL_EVENT_TOPICS.CART_VIEWED:
      handleCartTokenRedisOperations(inputEvent, clientId);
      message = cartViewedEventBuilder(inputEvent);
      break;
    case PIXEL_EVENT_TOPICS.COLLECTION_VIEWED:
      message = productListViewedEventBuilder(inputEvent);
      break;
    case PIXEL_EVENT_TOPICS.PRODUCT_VIEWED:
      message = productViewedEventBuilder(inputEvent);
      break;
    case PIXEL_EVENT_TOPICS.PRODUCT_ADDED_TO_CART:
    case PIXEL_EVENT_TOPICS.PRODUCT_REMOVED_FROM_CART:
      message = productToCartEventBuilder(inputEvent);
      break;
    case PIXEL_EVENT_TOPICS.CHECKOUT_STARTED:
    case PIXEL_EVENT_TOPICS.CHECKOUT_COMPLETED:
      handleCartTokenRedisOperations(inputEvent, clientId);
      message = checkoutEventBuilder(inputEvent);
      break;
    case PIXEL_EVENT_TOPICS.CHECKOUT_ADDRESS_INFO_SUBMITTED:
    case PIXEL_EVENT_TOPICS.CHECKOUT_CONTACT_INFO_SUBMITTED:
    case PIXEL_EVENT_TOPICS.CHECKOUT_SHIPPING_INFO_SUBMITTED:
    case PIXEL_EVENT_TOPICS.PAYMENT_INFO_SUBMITTED:
      handleCartTokenRedisOperations(inputEvent, clientId);
      message = checkoutStepEventBuilder(inputEvent);
      break;
    case PIXEL_EVENT_TOPICS.SEARCH_SUBMITTED:
      message = searchEventBuilder(inputEvent);
      break;
    default:
      logger.debug(`{{SHOPIFY::}} Invalid pixel event ${name}`);
      stats.increment('invalid_shopify_event', {
        writeKey: query_parameters.writeKey,
        source: 'SHOPIFY',
        shopifyTopic: name,
      });
      return NO_OPERATION_SUCCESS;
  }
  message.anonymousId = clientId;
  message.setProperty(`integrations.${INTEGERATION}`, true);
  message.setProperty('integrations.DATA_WAREHOUSE', {
    options: {
      jsonPaths: [`${message.type}.context.shopifyDetails`],
    },
  });
  message.setProperty('context.library', {
    name: 'RudderStack Shopify Cloud',
    eventOrigin: 'client',
    version: '2.0.0',
  });
  message.setProperty('context.topic', name);
  message.setProperty('context.shopifyDetails', shopifyDetails);

  // adding campaign object with utm parameters to the message context
  const campaignParams = extractCampaignParams(context, campaignObjectMappings);
  if (campaignParams) {
    message.context.campaign = campaignParams;
  }
  message.messageId = id;

  // attach userId to the message if anonymousId is present in Redis
  // this allows stitching of events from the same user across multiple checkouts
  const redisData = await RedisDB.getVal(`pixel:${message.anonymousId}`);
  if (isDefinedNotNullNotEmpty(redisData)) {
    message.userId = redisData.userId;
    stats.increment('shopify_pixel_userid_mapping', {
      action: 'stitchUserIdToAnonId',
      operation: 'get',
    });
  }
  message.setProperty('timestamp', timestamp);
  message = removeUndefinedAndNullValues(message);
  return message;
}

const processPixelWebEvents = async (event) => {
  const pixelEvent = await processPixelEvent(event);
  return removeUndefinedAndNullValues(pixelEvent);
};

module.exports = {
  processPixelWebEvents,
  handleCartTokenRedisOperations,
  extractCartToken,
};
