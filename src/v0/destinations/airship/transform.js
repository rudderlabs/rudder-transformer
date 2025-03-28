const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');

const {
  identifyMapping,
  trackMapping,
  groupMapping,
  BASE_URL_EU,
  BASE_URL_US,
  AIRSHIP_TRACK_EXCLUSION,
} = require('./config');

const {
  constructPayload,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson,
  isDefinedAndNotNullAndNotEmpty,
  extractCustomFields,
  isEmptyObject,
  simpleProcessRouterDest,
  convertToUuid,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { prepareAttributePayload, prepareTagPayload } = require('./utils');

const DEFAULT_ACCEPT_HEADER = 'application/vnd.urbanairship+json; version=3';

const transformSessionId = (rawSessionId) => {
  try {
    return convertToUuid(rawSessionId);
  } catch (error) {
    throw new InstrumentationError(`Failed to transform session ID: ${error.message}`);
  }
};

const identifyResponseBuilder = (message, { Config }) => {
  const initialTagPayload = constructPayload(message, identifyMapping);
  const { apiKey, dataCenter, timestampAttributes } = Config;

  if (!apiKey)
    throw new ConfigurationError('API Key is required for authorization for Identify events');

  let BASE_URL = BASE_URL_US;
  // check the region and which api end point should be used
  BASE_URL = dataCenter ? BASE_URL_EU : BASE_URL;

  const traits = flattenJson(getFieldValueFromMessage(message, 'traits'));
  if (!isDefinedAndNotNullAndNotEmpty(traits)) {
    throw new InstrumentationError(
      'For identify, tags or attributes properties are required under traits',
    );
  }

  // Creating tags and attribute payload
  const tagPayload = prepareTagPayload(traits, initialTagPayload);

  // Creating attribute payload
  const attributePayload = prepareAttributePayload(traits, message, timestampAttributes);

  let tagResponse;
  let attributeResponse;
  const arrayPayload = [];
  // Creating tag response
  if (
    tagPayload.add.rudderstack_integration.length > 0 ||
    tagPayload.remove.rudderstack_integration.length > 0
  ) {
    if (tagPayload.add.rudderstack_integration.length === 0) delete tagPayload.add;
    if (tagPayload.remove.rudderstack_integration.length === 0) delete tagPayload.remove;
    tagResponse = defaultRequestConfig();
    tagResponse.endpoint = `${BASE_URL}/api/named_users/tags`;
    tagResponse.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Accept: DEFAULT_ACCEPT_HEADER,
      Authorization: `Bearer ${apiKey}`,
    };
    tagResponse.method = defaultPostRequestConfig.requestMethod;
    tagResponse.body.JSON = removeUndefinedAndNullValues(tagPayload);
    arrayPayload.push(tagResponse);
  }
  // Creating attribute response
  if (attributePayload.attributes.length > 0) {
    attributeResponse = defaultRequestConfig();
    attributeResponse.endpoint = `${BASE_URL}/api/named_users/${getFieldValueFromMessage(
      message,
      'userId',
    )}/attributes`;
    attributeResponse.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Accept: DEFAULT_ACCEPT_HEADER,
      Authorization: `Bearer ${apiKey}`,
    };
    attributeResponse.method = defaultPostRequestConfig.requestMethod;
    attributeResponse.body.JSON = removeUndefinedAndNullValues(attributePayload);
    arrayPayload.push(attributeResponse);
  }

  return arrayPayload;
};

const trackResponseBuilder = async (message, { Config }) => {
  let name = message.event;
  if (!name) {
    throw new InstrumentationError('event name is required for track');
  }

  name = name.toLowerCase();
  const payload = constructPayload(message, trackMapping);

  // ref : https://docs.airship.com/api/ua/#operation-api-custom-events-post
  if (isDefinedAndNotNullAndNotEmpty(payload.session_id)) {
    payload.session_id = transformSessionId(payload.session_id);
  }
  let properties = {};
  properties = extractCustomFields(message, properties, ['properties'], AIRSHIP_TRACK_EXCLUSION);
  if (!isEmptyObject(properties)) {
    payload.properties = properties;
  }

  payload.name = name.replace(/\s+/g, '_');
  if (payload.value && typeof payload.value === 'string') {
    payload.value.replace(/\s+/g, '_');
  }
  const { appKey, dataCenter, apiKey } = Config;

  if (!appKey || !apiKey) {
    if (!appKey)
      throw new ConfigurationError('App Key is required for authorization for track events');
    else throw new ConfigurationError('API Key is required for authorization for track events');
  }
  let BASE_URL = BASE_URL_US;
  // check the region and which api end point should be used
  BASE_URL = dataCenter ? BASE_URL_EU : BASE_URL;

  const response = defaultRequestConfig();
  const timestamp = getFieldValueFromMessage(message, 'timestamp');
  if (timestamp) response.body.JSON.occured = timestamp;
  response.body.JSON.user = {};
  response.body.JSON.user.named_user_id = message.userId;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Accept: DEFAULT_ACCEPT_HEADER,
    'X-UA-Appkey': `${appKey}`,
    Authorization: `Bearer ${apiKey}`,
  };

  response.endpoint = `${BASE_URL}/api/custom-events`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON.body = {};
  response.body.JSON.body = payload;
  return response;
};

const groupResponseBuilder = (message, { Config }) => {
  const initTagPayload = constructPayload(message, groupMapping);
  const { apiKey, dataCenter, timestampAttributes } = Config;

  if (!apiKey)
    throw new ConfigurationError('API Key is required for authorization for group events');

  let BASE_URL = BASE_URL_US;
  // check the region and which api end point should be used
  BASE_URL = dataCenter ? BASE_URL_EU : BASE_URL;

  const traits = flattenJson(getFieldValueFromMessage(message, 'traits'));
  if (!isDefinedAndNotNullAndNotEmpty(traits)) {
    throw new InstrumentationError(
      'For group, tags or attributes properties are required under traits',
    );
  }

  const tagPayload = prepareTagPayload(traits, initTagPayload, 'group');

  const attributePayload = prepareAttributePayload(traits, message, timestampAttributes);

  let tagResponse;
  let attributeResponse;
  const arrayPayload = [];
  // Creating tag response
  if (
    tagPayload.add.rudderstack_integration_group.length > 0 ||
    tagPayload.remove.rudderstack_integration_group.length > 0
  ) {
    if (tagPayload.add.rudderstack_integration_group.length === 0) delete tagPayload.add;
    if (tagPayload.remove.rudderstack_integration_group.length === 0) delete tagPayload.remove;

    tagResponse = defaultRequestConfig();
    tagResponse.endpoint = `${BASE_URL}/api/named_users/tags`;
    tagResponse.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Accept: DEFAULT_ACCEPT_HEADER,
      Authorization: `Bearer ${apiKey}`,
    };
    tagResponse.method = defaultPostRequestConfig.requestMethod;
    tagResponse.body.JSON = removeUndefinedAndNullValues(tagPayload);
    arrayPayload.push(tagResponse);
  }
  // Creating attribute response
  if (attributePayload.attributes.length > 0) {
    attributeResponse = defaultRequestConfig();
    attributeResponse.endpoint = `${BASE_URL}/api/named_users/${getFieldValueFromMessage(
      message,
      'userId',
    )}/attributes`;
    attributeResponse.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Accept: DEFAULT_ACCEPT_HEADER,
      Authorization: `Bearer ${apiKey}`,
    };
    attributeResponse.method = defaultPostRequestConfig.requestMethod;
    attributeResponse.body.JSON = removeUndefinedAndNullValues(attributePayload);
    arrayPayload.push(attributeResponse);
  }
  return arrayPayload;
};

const process = async (event) => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = await groupResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(`message type ${messageType} not supported`);
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
