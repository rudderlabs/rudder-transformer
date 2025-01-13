const { set } = require('lodash');
const { TransformationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  constructPayload,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  simpleProcessRouterDest,
  defaultPutRequestConfig,
  defaultDeleteRequestConfig,
} = require('../../util');

const { getDestinationExternalID } = require('../../util');

const { EventType } = require('../../../constants');
const { mappingConfig, ConfigCategories } = require('./config');
const { refinePayload, generatePageName, getLists } = require('./utils');
const { JSON_MIME_TYPE } = require('../../util/constant');

const UID_ERROR_MSG = 'Neither externalId nor userId is available';

const responseBuilder = (payload, endpoint, method, Config) => {
  if (!payload) {
    throw new TransformationError('Parameters could not be found.');
  }
  const { publicKey, privateKey } = Config;
  const response = defaultRequestConfig();
  // Authentication Ref : https://engage.so/docs/api/
  const basicAuth = Buffer.from(`${publicKey}:${privateKey}`).toString('base64');
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Basic ${basicAuth}`,
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.endpoint = endpoint;
  response.method = method;
  return response;
};

// Engage Api Doc for identify, track, page calls Ref:https://engage.so/docs/api/users

const identifyResponseBuilder = (message, Config) => {
  const payload = constructPayload(message, mappingConfig[ConfigCategories.IDENTIFY.name]);
  const { traits } = message;
  const uid =
    getDestinationExternalID(message, 'engageId') ||
    getFieldValueFromMessage(message, 'userIdOnly');
  if (!uid) {
    throw new InstrumentationError(UID_ERROR_MSG);
  }
  const endpoint = `${ConfigCategories.IDENTIFY.endpoint.replace('uid', uid)}`;
  const refinedPayload = refinePayload(traits, ConfigCategories.IDENTIFY.genericFields);
  set(payload, 'meta', refinedPayload);
  const listIds = getLists(message, Config);
  if (listIds.length > 0) {
    set(payload, 'lists', listIds);
  }
  return responseBuilder(payload, endpoint, ConfigCategories.IDENTIFY.method, Config);
};

const trackResponseBuilder = (message, Config) => {
  if (!message.event) {
    throw new InstrumentationError('Event Name can not be empty.');
  }
  const { properties, event } = message;
  const payload = {};
  const meta = refinePayload(properties, ConfigCategories.TRACK.genericFields);
  const uid =
    getDestinationExternalID(message, 'engageId') ||
    getFieldValueFromMessage(message, 'userIdOnly');
  if (!uid) {
    throw new InstrumentationError(UID_ERROR_MSG);
  }
  const endpoint = `${ConfigCategories.TRACK.endpoint.replace('uid', uid)}`;
  payload.properties = meta;
  payload.event = event;
  payload.timestamp = getFieldValueFromMessage(message, 'timestamp');
  return responseBuilder(payload, endpoint, ConfigCategories.TRACK.method, Config);
};
const pageResponseBuilder = (message, Config) => {
  const uid =
    getDestinationExternalID(message, 'engageId') ||
    getFieldValueFromMessage(message, 'userIdOnly');
  if (!uid) {
    throw new InstrumentationError(UID_ERROR_MSG);
  }
  const endpoint = `${ConfigCategories.PAGE.endpoint.replace('uid', uid)}`;

  const { properties } = message;
  const payload = {};
  const meta = refinePayload(properties, ConfigCategories.PAGE.genericFields);
  const pagePayload = constructPayload(message, mappingConfig[ConfigCategories.PAGE.name]);
  const mergedPayload = { ...meta, ...pagePayload };
  payload.properties = mergedPayload;
  payload.timestamp = getFieldValueFromMessage(message, 'timestamp');
  const name = generatePageName(message);
  payload.event = name;
  return responseBuilder(payload, endpoint, ConfigCategories.PAGE.method, Config);
};

// Engage Api Doc for group calls Ref: https://engage.so/docs/api/lists
const groupResponseBuilder = (message, Config) => {
  const { groupId, context } = message;
  if (!groupId) {
    throw new InstrumentationError('Group Id can not be empty.');
  }
  const uid =
    getDestinationExternalID(message, 'engageId') ||
    getFieldValueFromMessage(message, 'userIdOnly');
  const traits = getFieldValueFromMessage(message, 'traits');
  if (traits.operation && traits.operation !== 'remove' && traits.operation !== 'add') {
    throw new InstrumentationError(
      `${traits.operation} is invalid for Operation field. Available are add or remove.`,
    );
  }
  const operation = traits.operation ? traits.operation : 'add';
  if (!uid && operation === 'remove') {
    throw new InstrumentationError('engageID is required for remove operation.');
  }
  let { method } = ConfigCategories.GROUP;
  const { genericFields, name } = ConfigCategories.GROUP;
  let endpoint = `${ConfigCategories.GROUP.endpoint.replace('id', groupId)}`;
  const subscriberStatus = context?.traits?.subscriberStatus || true;
  let payload = { subscribed: subscriberStatus };
  if (uid) {
    endpoint = `${endpoint}/${uid}`;
    if (operation === 'add') {
      method = defaultPutRequestConfig.requestMethod;
    } else {
      method = defaultDeleteRequestConfig.requestMethod;
    }
  } else {
    const userPayload = constructPayload(message, mappingConfig[name]);
    payload = { ...payload, ...userPayload };

    const refinedPayload = refinePayload(traits, genericFields);
    set(payload, 'meta', refinedPayload);
  }
  return responseBuilder(payload, endpoint, method, Config);
};
const process = (event) => {
  const { message, destination } = event;
  const { Config } = destination;

  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, Config);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, Config);
      break;
    case EventType.PAGE:
      response = pageResponseBuilder(message, Config);
      break;
    case EventType.GROUP:
      response = groupResponseBuilder(message, Config);
      break;
    default:
      throw new InstrumentationError(`Message type ${(messageType, Config)} not supported.`);
  }
  return response;
};
const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
