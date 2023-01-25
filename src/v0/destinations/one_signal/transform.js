const get = require('get-value');
const { EventType } = require('../../../constants');
const { ConfigCategory, mappingConfig, BASE_URL, ENDPOINTS } = require('./config');
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  getDestinationExternalID,
  isDefinedAndNotNullAndNotEmpty,
  defaultPutRequestConfig,
} = require('../../util');
const { populateDeviceType, populateTags } = require('./util');
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError,
} = require('../../util/errorTypes');

const responseBuilder = (payload, endpoint, eventType) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (eventType.toLowerCase() === 'identify' && endpoint === '/players') {
      response.method = defaultPostRequestConfig.requestMethod;
    } else {
      response.method = defaultPutRequestConfig.requestMethod;
    }
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  throw new TransformationError('Payload could not be populated due to wrong input');
};

/**
 * This function is used for creating response for identify call, to create a new device or update an existing device.
 * If playerId is present in the input payload, a response for editing that device is being created.
 * If playerId is not present, a responseArray for creating new device is being prepared.
 * If the value of emailDeviceType/smsDeviceType(toggle in dashboard) is true, separate responses will also be created
 * for new device with email/sms as identifier
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const identifyResponseBuilder = (message, { Config }) => {
  const { appId, emailDeviceType, smsDeviceType } = Config;

  let { endpoint } = ENDPOINTS.IDENTIFY;

  // checking if playerId is present in the payload
  const playerId = getDestinationExternalID(message, 'playerId');

  // Populating the tags
  const tags = populateTags(message);

  const payload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);
  // Mapping app_id
  payload.app_id = appId;

  // If playerId is present, creating Edit Device Response for Editing a devic using the playerId
  if (playerId) {
    endpoint = `${endpoint}/${playerId}`;
    payload.tags = tags;
    return responseBuilder(payload, endpoint, message.type);
  }
  // Creating response for creation of new device or updation of an existing device
  populateDeviceType(message, payload);
  const responseArray = [];
  payload.tags = tags;
  // Creating a device with email as asn identifier
  if (emailDeviceType) {
    const emailDevicePayload = { ...payload };
    emailDevicePayload.device_type = 11;
    emailDevicePayload.identifier = getFieldValueFromMessage(message, 'email');
    if (isDefinedAndNotNullAndNotEmpty(emailDevicePayload.identifier)) {
      responseArray.push(responseBuilder(emailDevicePayload, endpoint, message.type));
    }
  }
  // Creating a device with phone as asn identifier
  if (smsDeviceType) {
    const smsDevicePayload = { ...payload };
    smsDevicePayload.device_type = 14;
    smsDevicePayload.identifier = getFieldValueFromMessage(message, 'phone');
    if (isDefinedAndNotNullAndNotEmpty(smsDevicePayload.identifier)) {
      responseArray.push(responseBuilder(smsDevicePayload, endpoint, message.type));
    }
  }
  // checking if device_type is defined or not and checking 0 for device_type iOS
  if (payload.device_type || payload.device_type === 0) {
    responseArray.push(responseBuilder(payload, endpoint, message.type));
  }
  if (responseArray.length === 0) {
    throw new ConfigurationError(
      'Correct identifier is required for creating a device (identify call)',
    );
  }
  return responseArray;
};

/**
 * This function is used to build the response for track call.
 * It is used to edit the OneSignal tags using external_user_id.
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const trackResponseBuilder = (message, { Config }) => {
  const { appId, eventAsTags, allowedProperties } = Config;
  const event = get(message, 'event');
  let { endpoint } = ENDPOINTS.TRACK;
  const externalUserId = getFieldValueFromMessage(message, 'userIdOnly');
  if (!event) {
    throw new InstrumentationError('Event is not present in the input payloads');
  }
  if (!externalUserId) {
    throw new InstrumentationError('userId is required for track events/updating a device');
  }
  endpoint = `${endpoint}/${appId}/users/${externalUserId}`;
  const payload = {};
  const tags = {};
  /* Populating event as true in tags.
  eg. tags: {
    "event_name": true
  }
  */
  tags[event] = true;
  // Populating tags using allowed properties(from dashboard)
  const properties = get(message, 'properties');
  if (properties && allowedProperties && Array.isArray(allowedProperties)) {
    allowedProperties.forEach((item) => {
      if (typeof properties[item.propertyName] === 'string') {
        const tagName = eventAsTags ? `${event}_${[item.propertyName]}` : item.propertyName;
        tags[tagName] = properties[item.propertyName];
      }
    });
  }
  payload.tags = tags;
  return responseBuilder(payload, endpoint, message.type);
};

/**
 * This function is used to build the response for group call.
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const groupResponseBuilder = (message, { Config }) => {
  const { appId, allowedProperties } = Config;
  const groupId = getFieldValueFromMessage(message, 'groupId');
  if (!groupId) {
    throw new InstrumentationError('groupId is required for group events');
  }
  let { endpoint } = ENDPOINTS.GROUP;
  const externalUserId = getFieldValueFromMessage(message, 'userIdOnly');

  if (!externalUserId) {
    throw new InstrumentationError('userId is required for group events');
  }
  endpoint = `${endpoint}/${appId}/users/${externalUserId}`;
  const payload = {};
  const tags = {};
  tags.groupId = groupId;

  // Populating tags using allowed properties(from dashboard)
  const properties = getFieldValueFromMessage(message, 'traits');
  if (properties && allowedProperties && Array.isArray(allowedProperties)) {
    allowedProperties.forEach((item) => {
      if (
        (properties[item.propertyName] || properties[item.propertyName] === '') &&
        typeof properties[item.propertyName] === 'string'
      ) {
        tags[item.propertyName] = properties[item.propertyName];
      }
    });
  }
  payload.tags = tags;
  return responseBuilder(payload, endpoint, message.type);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  if (!destination.Config.appId) {
    throw new ConfigurationError('appId is a required field');
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
      throw new InstrumentationError(`Message type ${messageType} is not supported`);
  }
  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
