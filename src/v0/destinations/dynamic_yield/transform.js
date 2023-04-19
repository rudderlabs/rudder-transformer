const sha256 = require('sha256');
const { EventType } = require('../../../constants');
const { BASE_URL, ConfigCategory, mappingConfig } = require('./config');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  simpleProcessRouterDest,
  removeUndefinedAndNullAndEmptyValues,
  constructPayload,
} = require('../../util');
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError,
} = require('../../util/errorTypes');
const { preparePayload } = require('./util');

const responseBuilder = (payload, apiKey, endpoint) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      'Content-Type': 'application/json',
      'DY-API-Key': apiKey,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullAndEmptyValues(payload);
    return response;
  }
  throw new TransformationError('Payload could not be populated due to wrong input');
};

const identifyResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;

  const payload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);
  payload.events = [];
  const eventsObj = {
    name: 'Identify User',
    properties: {
      dyType: 'identify-v1',
      hashedEmail:
        message.traits?.email || message.context?.traits?.email
          ? sha256(message.traits?.email || message.context?.traits?.email)
          : null,
    },
  };
  if (!eventsObj.properties.hashedEmail) {
    delete eventsObj.properties.hashedEmail;
    eventsObj.properties.cuidType = 'userId';
    eventsObj.properties.cuid = payload.user.id;
  }
  payload.events.push(eventsObj);
  const endpoint = `${BASE_URL}/collect/user/event`;
  return responseBuilder(payload, apiKey, endpoint);
};

/**
 * This function is used to build the response for track call.
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const trackResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  const { event } = message;

  if (!event) {
    throw new InstrumentationError('Event is not present in the input payload');
  }

  const payload = preparePayload(message, event);
  const endpoint = `${BASE_URL}/collect/user/event`;

  return responseBuilder(payload, apiKey, endpoint);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  if (!destination.Config.apiKey) {
    throw new ConfigurationError('Api Key is a required field');
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const process = async (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
