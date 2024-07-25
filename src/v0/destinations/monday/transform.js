const get = require('get-value');
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const { ENDPOINT } = require('./config');
const { populatePayload, getBoardDetails, checkAllowedEventNameFromUI } = require('./util');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  getDestinationExternalID,
  validateEventName,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');

const responseBuilder = (payload, endpoint, apiToken) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `${apiToken}`,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
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
const trackResponseBuilder = async ({ message, destination: { Config }, metadata }) => {
  const { apiToken } = Config;
  let boardId = getDestinationExternalID(message, 'boardId');
  const event = get(message, 'event');
  validateEventName(event);
  if (!boardId) {
    boardId = Config.boardId;
  }
  if (!boardId) {
    throw new ConfigurationError('boardId is a required field');
  }
  if (!checkAllowedEventNameFromUI(event, Config)) {
    throw new ConfigurationError('Event Discarded. To allow this event, add this in Allowlist');
  }
  const endpoint = ENDPOINT;

  const processedResponse = await getBoardDetails(endpoint, boardId, apiToken, metadata);

  const payload = populatePayload(message, Config, processedResponse);

  return responseBuilder(payload, endpoint, apiToken);
};

const processEvent = async ({ message, destination, metadata }) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  if (!destination.Config.apiToken) {
    throw new ConfigurationError('ApiToken is a required field');
  }
  const messageType = message.type.toLowerCase();
  let response;
  if (messageType === EventType.TRACK) {
    response = await trackResponseBuilder({ message, destination, metadata });
  } else {
    throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const process = async (event) => processEvent(event);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
