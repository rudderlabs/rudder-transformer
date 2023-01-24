const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
} = require('../../util');
const { validateConfig, validateEvent } = require('./util');
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

// ref:- https://docs.developers.optimizely.com/experimentation/v3.1.0-full-stack/reference/trackevent
const trackResponseBuilder = (message, destination) => {
  const { event, userId, anonymousId } = message;
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }

  validateEvent(message, destination);
  const { baseUrl, trackKnownUsers } = destination.Config;
  const endpoint = getTrackEndPoint(baseUrl, event);
  const { name } = CONFIG_CATEGORIES.TRACK;
  const payload = constructPayload(message, MAPPING_CONFIG[name]);

  payload.userId = anonymousId;
  if (trackKnownUsers) {
    payload.userId = userId;
  }
  return responseBuilder(payload, endpoint, destination);
};

const pageResponseBuilder = (message, destination) => {
  const { trackCategorizedPages, trackNamedPages } = destination.Config;
  const newMessage = { ...message };
  const returnValue = [];

  if (message.category && trackCategorizedPages) {
    newMessage.event = `Viewed ${message.category} page`;
    returnValue.push(trackResponseBuilder(newMessage, destination));
  }
  if (message.name && trackNamedPages) {
    newMessage.event = `Viewed ${message.name} page`;
    returnValue.push(trackResponseBuilder(newMessage, destination));
  }

  return returnValue;
};

const screenResponseBuilder = (message, destination) => {
  const newMessage = { ...message };
  newMessage.event = 'Viewed screen';
  if (message.name) {
    newMessage.event = `Viewed ${message.name} screen`;
  }
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
    case EventType.SCREEN:
      response = screenResponseBuilder(message, destination);
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
