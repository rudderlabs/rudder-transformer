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
const { JSON_MIME_TYPE } = require('../../util/constant');
const {
  TransformationError,
  InstrumentationError,
  ConfigurationError,
} = require('../../util/errorTypes');

const {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  BASE_URL_EU,
  BASE_URL,
  EVENT_NAME_MAPPING,
  BLUESHIFT_IDENTIFY_EXCLUSION,
} = require('./config');

function checkValidEventName(str) {
  return str.includes('.') || /\d/.test(str) || str.length > 64;
}

const getBaseURL = (config) => {
  let urlValue;
  if (config.dataCenter === 'eu') {
    urlValue = BASE_URL_EU;
  } else {
    urlValue = BASE_URL;
  }
  return urlValue;
};

const trackResponseBuilder = async (message, category, { Config }) => {
  let event = getValueFromMessage(message, 'event');
  if (!event) {
    throw new InstrumentationError('[Blueshift] property:: event is required for track call');
  }

  if (!Config.eventApiKey) {
    throw new ConfigurationError('[BLUESHIFT] event Api Keys required for Authentication.');
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
      "[Blueshift] Event shouldn't contain period(.), numeric value and contains not more than 64 characters",
    );
  }
  payload = extractCustomFields(message, payload, ['properties'], []);

  const response = defaultRequestConfig();
  const baseURL = getBaseURL(Config);
  response.endpoint = `${baseURL}/api/v1/event`;

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
    throw new ConfigurationError('[BLUESHIFT] User API Key required for Authentication.');
  }
  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }

  payload = extractCustomFields(
    message,
    payload,
    ['traits', 'context.traits'],
    BLUESHIFT_IDENTIFY_EXCLUSION,
  );
  const response = defaultRequestConfig();
  const baseURL = getBaseURL(Config);
  response.endpoint = `${baseURL}/api/v1/customers`;

  response.method = defaultPostRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.usersApiKey).toString('base64');
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.body.JSON = payload;
  return response;
};

const groupResponseBuilder = async (message, category, { Config }) => {
  if (!Config.eventApiKey) {
    throw new ConfigurationError('[BLUESHIFT] event API Key required for Authentication.');
  }

  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }
  payload.event = 'identify';
  payload = extractCustomFields(message, payload, ['traits'], []);

  const baseURL = getBaseURL(Config);
  const response = defaultRequestConfig();
  response.endpoint = `${baseURL}/api/v1/event`;

  response.method = defaultPostRequestConfig.requestMethod;
  const basicAuth = Buffer.from(Config.eventApiKey).toString('base64');
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.body.JSON = payload;
  return response;
};

const process = async (event) => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  const messageType = message.type.toLowerCase();
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = await trackResponseBuilder(message, category, destination);
      break;
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, category, destination);
      break;
    case EventType.GROUP:
      response = await groupResponseBuilder(message, category, destination);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
