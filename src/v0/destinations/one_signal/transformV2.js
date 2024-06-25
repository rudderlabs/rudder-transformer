const get = require('get-value');
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const { ConfigCategory, mappingConfig, BASE_URL_V2 } = require('./config');
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
} = require('../../util');
const {
  populateTags,
  getProductPurchasesDetails,
  getSubscriptions,
  getOneSignalAliases,
} = require('./util');
const { JSON_MIME_TYPE } = require('../../util/constant');

const responseBuilder = (payload, Config) => {
  const { appId } = Config;
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL_V2.replace('{{app_id}}', appId)}`;
    response.headers = {
      Accept: JSON_MIME_TYPE,
      'Content-Type': JSON_MIME_TYPE,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  throw new TransformationError('Payload could not be populated due to wrong input');
};

/**
 * This function is used for creating response for identify call, to create a new user or update an existing user.
 * a responseArray for creating/updating user is being prepared.
 * If the value of emailDeviceType/smsDeviceType(toggle in dashboard) is true, separate responses will also be created
 * for new subscriptions to be added to user with email/sms as token.
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const identifyResponseBuilder = (message, { Config }) => {
  // Populating the tags
  const tags = populateTags(message);

  const payload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY_V2.name]);
  if (!payload?.identity?.external_id) {
    const alias = getOneSignalAliases(message);
    if (Object.keys(alias).length === 0) {
      throw new InstrumentationError('userId or any other alias is required for identify');
    }
    payload.identity = alias;
  }
  // Following check is to intialise properties object in case we don't get properties object from construct payload
  if (!payload.properties) {
    payload.properties = {};
  }
  payload.subscriptions = getSubscriptions(message, Config);
  payload.properties.tags = tags;
  return responseBuilder(removeUndefinedAndNullValues(payload), Config);
};

/**
 * This function is used to build the response for track call and Group call.
 * It is used to edit the OneSignal tags using external_id.
 * It edits tags[event] as true for track call
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const trackOrGroupResponseBuilder = (message, { Config }, msgtype) => {
  const { eventAsTags, allowedProperties } = Config;
  const event = get(message, 'event');
  const groupId = getFieldValueFromMessage(message, 'groupId');
  // validation and adding tags for track and group call respectively
  const tags = {};
  const payload = { properties: {} };
  if (msgtype === EventType.TRACK) {
    if (!event) {
      throw new InstrumentationError('Event is not present in the input payloads');
    }
    /* Populating event as true in tags.
      eg. tags: {
        "event_name": true
      }
      */
    tags[event] = true;
    payload.properties.purchases = getProductPurchasesDetails(message);
  }
  if (msgtype === EventType.GROUP) {
    if (!groupId) {
      throw new InstrumentationError('groupId is required for group events');
    }
    tags.groupId = groupId;
  }

  const externalUserId = getFieldValueFromMessage(message, 'userIdOnly');
  if (!externalUserId) {
    const alias = getOneSignalAliases(message);
    if (Object.keys(alias).length === 0) {
      throw new InstrumentationError('userId or any other alias is required for track and group');
    }
    payload.identity = alias;
  } else {
    payload.identity = {
      external_id: externalUserId,
    };
  }

  // Populating tags using allowed properties(from dashboard)
  const properties = get(message, 'properties');
  if (properties && allowedProperties && Array.isArray(allowedProperties)) {
    allowedProperties.forEach((item) => {
      if (typeof properties[item.propertyName] === 'string') {
        const tagName =
          event && eventAsTags ? `${event}_${[item.propertyName]}` : item.propertyName;
        tags[tagName] = properties[item.propertyName];
      }
    });
  }
  payload.properties.tags = tags;
  return responseBuilder(removeUndefinedAndNullValues(payload), Config);
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
      response = trackOrGroupResponseBuilder(message, destination, EventType.TRACK);
      break;
    case EventType.GROUP:
      response = trackOrGroupResponseBuilder(message, destination, EventType.GROUP);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} is not supported`);
  }
  return response;
};

const process = (message, destination) => processEvent(message, destination);

module.exports = { process };
