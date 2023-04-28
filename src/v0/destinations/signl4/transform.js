const { EventType } = require('../../../constants');
const { BASE_URL } = require('./config');
const { populatePayload } = require('./utils');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  simpleProcessRouterDest,
  removeUndefinedAndNullAndEmptyValues,
} = require('../../util');
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError,
} = require('../../util/errorTypes');

const responseBuilder = (payload, endpoint) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      'Content-Type': 'application/json',
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullAndEmptyValues(payload);
    return response;
  }
  throw new TransformationError('Payload could not be populated due to wrong input');
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

  const endpoint = `${BASE_URL}/${apiKey}`;

  const payload = populatePayload(message, Config);

  return responseBuilder(payload, endpoint);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  if (!destination.Config.apiKey) {
    throw new ConfigurationError('ApiKey is a required field');
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
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
