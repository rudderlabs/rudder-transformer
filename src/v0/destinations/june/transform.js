const {
  isEmptyObject,
  constructPayload,
  defaultRequestConfig,
  simpleProcessRouterDest,
  defaultPostRequestConfig,
  getDestinationExternalID,
  removeUndefinedAndNullValues,
} = require('../../util');
const { EventType } = require('../../../constants');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const { TransformationError, InstrumentationError } = require('../../util/errorTypes');

const responseBuilder = (payload, endpoint, destination) => {
  const destPayload = payload;
  if (destPayload) {
    if (isEmptyObject(destPayload.context)) {
      delete destPayload.context;
    }
    const response = defaultRequestConfig();
    const { apiKey } = destination.Config;
    response.endpoint = endpoint;
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Basic ${apiKey}`,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(destPayload);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Something went wrong while constructing the payload');
};

// ref :- https://www.june.so/docs/tracking/http-api/track
const trackResponseBuilder = (message, destination) => {
  const { endpoint, name } = CONFIG_CATEGORIES.TRACK;
  const groupId = getDestinationExternalID(message, 'juneGroupId') || message.properties?.groupId;
  let payload = constructPayload(message, MAPPING_CONFIG[name]);

  if (groupId) {
    payload = { ...payload, context: { groupId } };
  }

  return responseBuilder(payload, endpoint, destination);
};

const genericResponseBuilder = (message, destination, category) => {
  const { endpoint, name } = CONFIG_CATEGORIES[category];
  const payload = constructPayload(message, MAPPING_CONFIG[name]);
  return responseBuilder(payload, endpoint, destination);
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = genericResponseBuilder(message, destination, 'IDENTIFY');
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.PAGE:
      response = genericResponseBuilder(message, destination, 'PAGE');
      break;
    case EventType.GROUP:
      response = genericResponseBuilder(message, destination, 'GROUP');
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