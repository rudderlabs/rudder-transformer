const {
  TransformationError,
  InstrumentationError,
  ConfigurationError,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { API_URL } = require('./config');

const responseBuilder = (payload, endpoint, destination) => {
  if (payload) {
    const response = defaultRequestConfig();
    const { apiKey } = destination.Config;
    response.endpoint = endpoint;
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${apiKey}`,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  throw new TransformationError('Something went wrong while constructing the payload');
};

const identifyResponseBuilder = (message, destination) => {
  const payload = message;
  payload.traits = message.traits || message.context.traits;
  if (!payload.traits) {
    throw new InstrumentationError('traits is a required field for identify call');
  }
  return responseBuilder(payload, API_URL, destination);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  if (!destination.Config.apiKey) {
    throw new ConfigurationError('apiKey is required');
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = responseBuilder(message, API_URL, destination);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} is not supported`);
  }
  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
