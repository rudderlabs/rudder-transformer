const get = require('get-value');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { EventType, MappedToDestinationKey } = require('../../../constants');
const { ConfigCategory } = require('./config');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  addExternalIdToTraits,
  simpleProcessRouterDest,
} = require('../../util');
const { processIdentify, processTrack, processGroup } = require('./util');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * This function validates the message and builds the response
 * it handles for all the supported events for custify
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const validateAndBuildResponse = async ({ message, destination, metadata }) => {
  const messageType = message.type.toLowerCase();
  const response = defaultRequestConfig();
  let responseBody;
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      responseBody = processIdentify(message, destination);
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.TRACK:
      responseBody = processTrack(message, destination);
      category = ConfigCategory.TRACK;
      break;
    case EventType.GROUP:
      responseBody = await processGroup(message, destination, metadata);
      category = ConfigCategory.GROUP_USER;
      break;
    default:
      throw new InstrumentationError('Message type not supported');
  }

  if (get(message, MappedToDestinationKey)) {
    addExternalIdToTraits(message);
    responseBody = getFieldValueFromMessage(message, 'traits');
  }
  response.body.JSON = responseBody;
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = category.endpoint;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${destination.Config.apiKey}`,
    Accept: JSON_MIME_TYPE,
  };
  response.userId = responseBody.user_id;
  return response;
};

const processSingleMessage = async ({ message, destination, metadata }) => {
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Ignoring message.');
  }
  return validateAndBuildResponse({ message, destination, metadata });
};

const process = (event) => processSingleMessage(event);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
