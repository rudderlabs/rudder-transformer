const {
  InstrumentationError,
  ConfigurationError,
  NetworkInstrumentationError,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  getFieldValueFromMessage,
  defaultRequestConfig,
  extractCustomFields,
  removeUndefinedAndNullValues,
  constructPayload,
  getDestinationExternalID,
  isEmptyObject,
  defaultPostRequestConfig,
  getValueFromMessage,
  simpleProcessRouterDest,
} = require('../../util');
const logger = require('../../../logger');
const {
  isValidUserIdOrError,
  eventValidity,
  isValidEmail,
  isValidPhone,
  userValidity,
} = require('./util');
const { ENDPOINT, TRACKING_EXCLUSION_FIELDS, identifyMapping } = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');

const identifyResponseBuilder = (message, { Config }) => {
  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  if (!userId) {
    throw new InstrumentationError('userId is required for identify');
  }
  let channel = getDestinationExternalID(message, 'delightedChannelType') || Config.channel;
  channel = channel.toLowerCase();
  const { userIdType, userIdValue } = isValidUserIdOrError(channel, userId);
  const payload = constructPayload(message, identifyMapping);

  payload[userIdType] = userIdValue;

  if (userIdType === 'email' && payload.phone_number) {
    if (!isValidPhone(payload.phone_number)) {
      payload.phone_number = null;
      logger.error('Phone number format must be E.164.');
    }
  } else if (userIdType === 'phone_number' && payload.email && !isValidEmail(payload.email)) {
    payload.email = null;
    logger.error('Email format is not correct.');
  }

  payload.send = false;
  payload.channel = channel;
  payload.delay = Config.delay || 0;
  if (!payload.name) {
    const fName = getFieldValueFromMessage(message, 'firstName');
    const lName = getFieldValueFromMessage(message, 'lastName');
    const name = `${fName ? fName.trim() : ''} ${lName ? lName.trim() : ''}`.trim();
    if (name) {
      payload.name = name;
    }
  }
  payload.last_sent_at = getValueFromMessage(message, [
    'traits.last_sent_at',
    'context.traits.last_sent_at',
  ]);

  const basicAuth = Buffer.from(Config.apiKey).toString('base64');
  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINT;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const trackResponseBuilder = async (message, { Config }) => {
  // checks if the event is valid if not throws error else nothing
  const isValidEvent = eventValidity(Config, message);
  if (!isValidEvent) {
    throw new ConfigurationError('Event is not configured on your Rudderstack Dashboard');
  }

  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  if (!userId) {
    throw new InstrumentationError('userId is required.');
  }
  let channel = getDestinationExternalID(message, 'delightedChannelType') || Config.channel;
  channel = channel.toLowerCase();

  const { userIdType, userIdValue } = isValidUserIdOrError(channel, userId);

  // checking if user already exists or not, throw error if it doesn't
  const check = await userValidity(channel, Config, userId);

  if (!check) {
    throw new NetworkInstrumentationError(`user ${userId} doesn't exist`);
  }
  let payload = {};
  payload[userIdType] = userIdValue;
  payload.send = true;
  payload.channel = channel;
  if (message.properties) {
    payload.delay = parseInt(Config.delay || message.properties.delay || 0, 10);
    payload.last_sent_at = getValueFromMessage(message, 'properties.last_sent_at');
  }
  let properties = {};
  properties = extractCustomFields(message, properties, ['properties'], TRACKING_EXCLUSION_FIELDS);
  if (!isEmptyObject(properties)) {
    payload = {
      ...payload,
      properties,
    };
  }

  const basicAuth = Buffer.from(Config.apiKey).toString('base64');
  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINT;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const aliasResponseBuilder = (message, { Config }) => {
  let channel = getDestinationExternalID(message, 'delightedChannelType') || Config.channel;
  channel = channel.toLowerCase();

  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  if (!userId) {
    throw new InstrumentationError('userId is required.');
  }
  const payload = {};
  const { previousId } = message;
  if (!previousId) {
    throw new InstrumentationError('Previous Id is required for alias.');
  }
  const emailType = channel === 'email' && isValidEmail(previousId) && isValidEmail(userId);
  if (emailType) {
    payload.email = previousId;
    payload.email_update = userId;
  }
  const phoneType = channel === 'sms' && isValidPhone(previousId) && isValidPhone(userId);
  if (phoneType) {
    payload.phone_number = previousId;
    payload.phone_number_update = userId;
  }
  if (!emailType && !phoneType) {
    throw new InstrumentationError('User Id and Previous Id should be of same type i.e. phone/sms');
  }
  const basicAuth = Buffer.from(Config.apiKey).toString('base64');
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = payload;
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.endpoint = ENDPOINT;
  return response;
};

const process = async (event) => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  if (!destination.Config.apiKey) {
    throw new ConfigurationError('Inavalid API Key. Aborting message.');
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    case EventType.ALIAS:
      response = aliasResponseBuilder(message, destination);
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
