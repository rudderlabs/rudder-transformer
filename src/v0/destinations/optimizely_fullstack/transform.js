const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
} = require('../../util');
const { validateConfig } = require('./util');
const { CONFIG_CATEGORIES, MAPPING_CONFIG, getTrackEndPoint } = require('./config');
const { TransformationError, InstrumentationError } = require('../../util/errorTypes');

const responseBuilder = (payload, endpoint, destination) => {
  if (payload) {
    const response = defaultRequestConfig();
    const { sdkKey } = destination.Config;
    response.endpoint = endpoint;
    response.headers = {
      'Content-Type': 'application/json',
      'X-Optimizely-SDK-Key': sdkKey,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Something went wrong while constructing the payload');
};

const trackResponseBuilder = (message, destination) => {
  const { event } = message;
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }
  const { baseUrl } = destination.Config;
  const endpoint = getTrackEndPoint(baseUrl, event);
  const { name } = CONFIG_CATEGORIES.TRACK;
  const payload = constructPayload(message, MAPPING_CONFIG[name]);
  return responseBuilder(payload, endpoint, destination);
};

const pageResponseBuilder = (message, destination) => {
  let event;
  if (message.category && destination.Config.trackCategorizedPages) {
    event = `Viewed ${message.category} page`;
  }
  if (message.name && destination.Config.trackNamedPages) {
    event = `Viewed ${message.name} page`;
  }

  const newMessage = { ...message };
  newMessage.event = event;

  return trackResponseBuilder(newMessage, destination);
};

const processEvent = (message, destination) => {
  validateConfig(destination);
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.PAGE:
      response = pageResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(`Event type "${messageType}" is not supported`);
  }
  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
