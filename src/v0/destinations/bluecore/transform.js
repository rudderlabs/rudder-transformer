const { EventType } = require('../../../constants');
const {
  constructPayload,
  ErrorMessage,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getValueFromMessage,
  isDefinedAndNotNull,
  extractCustomFields,
  simpleProcessRouterDest,
} = require('../../util');

const {
  // getActionSource,
  // handleProduct,
  // handleSearch,
  handleProductListViewed,
  // handleOrder,
  // populateCustomDataBasedOnCategory,
  // getCategoryFromEvent,
} = require('./utils');

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
  console.log('Incoming Message:', message);
  console.log('Destination Category:', category);
  console.log('Configuration:', Config);

  let event = getValueFromMessage(message, 'event');
  if (!event) {
    throw new InstrumentationError('[BLUECORE] property:: event is required for track call');
  }

  if (!Config.eventApiKey) {
    throw new ConfigurationError('[BLUECORE] event Api Keys required for Authentication.');
  }
  let payload = {};
  console.log('constructed Payload :', payload);

  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }
  event = event.trim();
  // Check for the event type being 'Product Viewed'
  if (event.toLowerCase() === 'product viewed') {
    // Utilize handleProductListViewed function

    // console.log('Current Message:', message);
    const properties = handleProductListViewed(message, category);
    // Add other necessary properties to the payload
    properties.distinct_id = 'xyz@example.com';
    properties.token = 'bluestore';
    properties.client = '4.0';
    properties.device = 'mobile/iPad';
    console.log(properties);

    payload = { event : 'viewed_product', properties : properties};
    // payload.event = event.replace(/\s+/g, '_');
    // payload.properties = properties;
  // if (checkValidEventName(payload.event)) {
  //   throw new InstrumentationError(
  //     "[BLUECORE] Event shouldn't contain period(.), numeric value and contains not more than 64 characters",
  //     );
  //   }
    // payload = extractCustomFields(message, payload, ['properties'], []);

    for (const product of properties.products) {
      console.log("Product Details:");
      console.log(product);
    }
    
    // Build the response object with Bluecore payload
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}`;
  
    response.method = defaultPostRequestConfig.requestMethod;
    const basicAuth = Buffer.from(Config.eventApiKey).toString('base64');
    response.headers = {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': JSON_MIME_TYPE,
    };
    response.body.JSON = payload;
    console.log('Transformed Payload:', payload);
    return response;
    
  }
  if (isDefinedAndNotNull(EVENT_NAME_MAPPING[event])) {
    payload.event = EVENT_NAME_MAPPING[event];
  }
  payload.event = payload.event.replace(/\s+/g, '_');
  if (checkValidEventName(payload.event)) {
    throw new InstrumentationError(
      "[BLUECORE] Event shouldn't contain period(.), numeric value and contains not more than 64 characters",
      );
    }
    payload = extractCustomFields(message, payload, ['properties'], []);
    console.log('Transformed Payload:', payload);

  const response = defaultRequestConfig();
  response.endpoint = `${BASE_URL}`;

  response.method = defaultPostRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.eventApiKey).toString('base64');
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.body.JSON = payload;
  return response;
};

const identifyResponseBuilder = async (message, category, { Config }) => {
  if (!Config.usersApiKey) {
    throw new ConfigurationError('[BLUECORE] User API Key required for Authentication.');
  }

  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  let event = getValueFromMessage(message, 'event');
  console.log('Payload after constructPayload:', payload);
  console.log('Payload properties after constructPayload:', payload.properties);

  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }
  
  payload = extractCustomFields(
    message,
    payload,
    ['traits', 'context.traits'],
    BLUECORE_IDENTIFY_EXCLUSION,
    );
    
    console.log('Payload after extractCustomFields:', payload);
    console.log('Properties after extractCustomFields:', payload.properties);

    
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_URL}`;
  response.method = defaultPostRequestConfig.requestMethod;
  
  const basicAuth = Buffer.from(Config.usersApiKey).toString('base64');
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.body.JSON = payload;
  // response.body.JSON.event = event;

  console.log('Final Response before returning:', response);

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
