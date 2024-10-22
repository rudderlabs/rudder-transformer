// eslint-disable-next-line @typescript-eslint/naming-convention
const _ = require('lodash');
const stats = require('../../../util/stats');
const logger = require('../../../logger');
const { generateUUID, removeUndefinedAndNullValues } = require('../../../v0/util');
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
} = require('./pixelUtils');
const { INTEGERATION, PIXEL_EVENT_TOPICS, eventToCartTokenLocationMapping } = require('./config');

const NO_OPERATION_SUCCESS = {
  outputToSource: {
    body: Buffer.from('OK').toString('base64'),
    contentType: 'text/plain',
  },
  statusCode: 200,
};

const handleCartTokenRedisOperations = async (inputEvent) => {
  try {
    const cartTokenLocation = eventToCartTokenLocationMapping[inputEvent.name];
    if (!cartTokenLocation) {
      logger.info(`Cart token location not found for event: ${inputEvent.name}`);
      return;
    }

    const cartToken = _.get(inputEvent, cartTokenLocation);
    if (!cartToken) {
      logger.info(`Cart token not found in input event: ${inputEvent.name}`);
      return;
    }

    const storedAnonymousIdInRedis = await RedisDB.getVal(cartToken);
    if (!storedAnonymousIdInRedis) {
      const anonymousId = generateUUID();
      await RedisDB.setVal(cartToken, anonymousId);
      logger.info(`New anonymousId set in Redis for cartToken: ${cartToken}`);
    } else {
      logger.info(`AnonymousId already exists in Redis for cartToken: ${cartToken}`);
    }
  } catch (error) {
    logger.error(`Error handling Redis operations for event: ${inputEvent.name}`, error);
  }
};

function processPixelEvent(inputEvent) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { name, query_parameters, clientId, data } = inputEvent;
  const { checkout } = data ?? {};
  const { order } = checkout ?? {};
  const { customer } = order ?? {};
  let message = {};
  switch (name) {
    case PIXEL_EVENT_TOPICS.PAGE_VIEWED:
      message = pageViewedEventBuilder(inputEvent);
      break;
    case PIXEL_EVENT_TOPICS.CART_VIEWED:
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
      if (customer.id) message.userId = customer.id || '';
      handleCartTokenRedisOperations(inputEvent);
      message = checkoutEventBuilder(inputEvent);
      break;
    case PIXEL_EVENT_TOPICS.CHECKOUT_ADDRESS_INFO_SUBMITTED:
    case PIXEL_EVENT_TOPICS.CHECKOUT_CONTACT_INFO_SUBMITTED:
    case PIXEL_EVENT_TOPICS.CHECKOUT_SHIPPING_INFO_SUBMITTED:
    case PIXEL_EVENT_TOPICS.PAYMENT_INFO_SUBMITTED:
      if (customer.id) message.userId = customer.id || '';
      handleCartTokenRedisOperations(inputEvent);
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
  message.setProperty('context.library', {
    name: 'RudderStack Shopify Cloud',
    eventOrigin: 'client',
    version: '2.0.0',
  });
  message.setProperty('context.topic', name);
  message = removeUndefinedAndNullValues(message);
  return message;
}

const processEventFromPixel = async (event) => {
  const pixelEvent = processPixelEvent(event);
  return removeUndefinedAndNullValues(pixelEvent);
};

module.exports = {
  processEventFromPixel,
};
