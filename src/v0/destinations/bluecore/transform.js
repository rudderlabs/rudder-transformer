const { EventType } = require('../../../constants');
const {
  constructPayload,
  ErrorMessage,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getValueFromMessage,
  isDefinedAndNotNull,
  simpleProcessRouterDest,
} = require('../../util');


const { JSON_MIME_TYPE } = require('../../util/constant');
const {
  TransformationError,
  InstrumentationError,
  ConfigurationError,
} = require('../../util/errorTypes');

const {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  BASE_URL,
  EVENT_NAME_MAPPING,
  BLUECORE_IDENTIFY_EXCLUSION,
} = require('./config');

function checkValidEventName(str) {
  return str.includes('.') || /\d/.test(str) || str.length > 64;
}


const trackResponseBuilder = async (message, category, { Config }) => {
  let event = getValueFromMessage(message, 'event');
  if (!event) {
    throw new InstrumentationError('[BLUECORE] property:: event is required for track call');
  }
  if (!Config.token) {
    throw new ConfigurationError('[BLUECORE] event Api Keys required for Authentication.');
  }
  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }
  event = event.trim();

  if (isDefinedAndNotNull(EVENT_NAME_MAPPING[event])) {
    payload.event = EVENT_NAME_MAPPING[event];
  }
  payload.event = payload.event.replace(/\s+/g, '_');
  if (checkValidEventName(payload.event)) {
    throw new InstrumentationError(
      "[BLUECORE] Event shouldn't contain period(.), numeric value and contains not more than 64 characters",
      );
    }
    
    // Check the event type and create the product list accordingly
    if (payload.event.toLowerCase() === 'viewed_product' || payload.event.toLowerCase() === 'add_to_cart'|| payload.event.toLowerCase() === 'remove_from_cart' || payload.event.toLowerCase() === 'purchase'|| payload.event.toLowerCase() === 'wishlist') {
      let productList = [];
      if (Array.isArray(message.properties.products)) {
        // Multiple products
        productList = message.properties.products.map(product => ({
          id: product.product_id,
          name: product.name,
          price: product.price,
          sku: product.sku,
          category: product.category,
          brand: product.brand,
          variant: product.variant,
          quantity: product.quantity,
          coupon: product.coupon,
          currency: product.currency,
          position: product.position,
          url: product.url,
          image_url: product.image_url,
        }));
      } else if (message.properties) {
        // Single product
        productList.push({
          id: message.properties.product_id,
          name: message.properties.name,
          price: message.properties.price,
          sku: message.properties.sku,
          category: message.properties.category,
          brand: message.properties.brand,
          variant: message.properties.variant,
          quantity: message.properties.quantity,
          coupon: message.properties.coupon,
          currency: message.properties.currency,
          position: message.properties.position,
          url: message.properties.url,
          image_url: message.properties.image_url,
        });
      }
      // Adding the productPayloadList to the payload's properties under the key 'products'
      if (productList.length > 0) {
        payload.properties = {
          ...payload.properties,
          products: productList,
        };
      }
    }
    
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_URL}`;

  response.method = defaultPostRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.token).toString('base64');
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  payload.properties.token = Config.token;
  response.body.JSON = payload;
  return response;
};

const identifyResponseBuilder = async (message, category, { Config }) => {
  if (!Config.token) {
    throw new ConfigurationError('[BLUECORE] User API Key required for Authentication.');
  }

  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  payload.event = 'identify';
  payload.properties.token = Config.token;

  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }
  
    
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_URL}`;
  response.method = defaultPostRequestConfig.requestMethod;
  
  const basicAuth = Buffer.from(Config.token).toString('base64');
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.body.JSON = payload;
  return response;
};


const process = async (event) => {
  const { message, destination } = event;
  console.log('Incoming Event:', event);
  console.log('Incoming Destination:', destination);

  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  const messageType = message.type.toLowerCase();
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  console.log('Category :', category);
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = await trackResponseBuilder(message, category, destination);
      break;
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, category, destination);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  // Log the final response before returning it
  console.log('Final Response:', response);

  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
