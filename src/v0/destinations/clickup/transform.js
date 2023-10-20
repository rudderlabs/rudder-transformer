const { TransformationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  getDestinationExternalID,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedNullEmptyExclBoolInt,
  simpleProcessRouterDest,
} = require('../../util');
const {
  validatePriority,
  customFieldsBuilder,
  getListOfAssignees,
  checkEventIfUIMapped,
} = require('./util');
const { CONFIG_CATEGORIES, MAPPING_CONFIG, createTaskEndPoint } = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');

const responseBuilder = async (payload, listId, apiToken) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = createTaskEndPoint(listId);
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: apiToken,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedNullEmptyExclBoolInt(payload);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Something went wrong while constructing the payload');
};

const trackResponseBuilder = async (message, destination) => {
  const { apiToken, keyToCustomFieldName } = destination.Config;
  const { properties } = message;
  const externalListId = getDestinationExternalID(message, 'clickUpListId');
  const listId = externalListId || destination.Config.listId;
  const assignees = getListOfAssignees(message, 'clickUpAssigneeId');

  const customFields = await customFieldsBuilder(
    keyToCustomFieldName,
    properties,
    listId,
    apiToken,
  );

  let payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]);

  payload = { ...payload, assignees, custom_fields: customFields };

  validatePriority(payload.priority);
  return responseBuilder(payload, listId, apiToken);
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  checkEventIfUIMapped(message, destination);

  const messageType = message.type.toLowerCase();
  if (messageType === EventType.TRACK) {
    return trackResponseBuilder(message, destination);
  }

  throw new InstrumentationError(`Event type "${messageType}" is not supported`);
};

const process = async (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
