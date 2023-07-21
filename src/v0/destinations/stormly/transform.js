/* eslint-disable no-nested-ternary */
const get = require('get-value');
const set = require('set-value');
const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  constructPayload,
  isDefinedAndNotNull,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  getDestinationExternalID,
} = require('../../util');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const { TransformationError, InstrumentationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const responseBuilder = (payload, endpoint, destination) => {
  if (payload) {
    const response = defaultRequestConfig();
    const { apiKey } = destination.Config;
    response.endpoint = endpoint;
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Basic ${apiKey}`,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Something went wrong while constructing the payload');
};

const identifyResponseBuilder = (message, destination) => {
  const { endpoint, name } = CONFIG_CATEGORIES.IDENTIFY;
  const payload = constructPayload(message, MAPPING_CONFIG[name]);
  return responseBuilder(payload, endpoint, destination);
};

const trackResponseBuilder = (message, destination) => {
  const { endpoint, name } = CONFIG_CATEGORIES.TRACK;
  const groupId = getDestinationExternalID(message, 'stormlyGroupId') || message.properties?.groupId;
  let payload = constructPayload(message, MAPPING_CONFIG[name]);

  if (groupId) {
    payload = { ...payload, context: { groupId } };
  }

  return responseBuilder(payload, endpoint, destination);
};

const groupResponseBuilder = (message, destination) => {
  const { endpoint, name } = CONFIG_CATEGORIES.GROUP;
  const payload = constructPayload(message, MAPPING_CONFIG[name]);
  return responseBuilder(payload, endpoint, destination);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  // set context.ip from request_ip if it is missing
  if (!get(message, 'context.ip') && isDefinedAndNotNull(message.request_ip)) {
    set(message, 'context.ip', message.request_ip);
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
    case EventType.GROUP:
      response = groupResponseBuilder(message, destination);
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
