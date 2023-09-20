const { EventType } = require('../../../constants');
const {
  getDestinationExternalID,
  getFieldValueFromMessage,
  constructPayload,
  extractCustomFields,
  isEmptyObject,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getValueFromMessage,
  isObject,
  simpleProcessRouterDest,
} = require('../../util');
const logger = require('../../../logger');
const {
  ENDPOINT,
  identifyMapping,
  trackMapping,
  campaignMapping,
  IDENTIFY_EXCLUSION_FIELDS,
  TRACKING_EXLCUSION_FIELDS,
  ecomEvents,
  ecomMapping,
  eventNameMapping,
} = require('./config');
const {
  userExists,
  isValidEmail,
  isValidTimestamp,
  createUpdateUser,
  createList,
} = require('./util');
const {
  InstrumentationError,
  ConfigurationError,
  NetworkInstrumentationError,
} = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const identifyResponseBuilder = async (message, { Config }) => {
  const id = getDestinationExternalID(message, 'dripId');

  let email = getFieldValueFromMessage(message, 'email');
  if (!isValidEmail(email)) {
    email = null;
    logger.error('Email format is incorrect');
  }

  const userId = getFieldValueFromMessage(message, 'userId');
  if (!(id || email)) {
    throw new InstrumentationError('dripId or email is required for the call');
  }

  let payload = constructPayload(message, identifyMapping);
  if (payload.address1 && isObject(payload.address1)) {
    let addressString = '';
    Object.keys(payload.address1).forEach((key) => {
      addressString = addressString.concat(` ${payload.address1[key]}`);
    });
    payload.address1 = addressString.trim();
  }

  payload.id = id;
  payload.email = email;
  payload.user_id = userId;

  if (!payload.first_name && !payload.last_name) {
    const name = getFieldValueFromMessage(message, 'name');
    if (name && typeof name === 'string') {
      const [fname, lname] = name.trim().split(' ');
      payload.first_name = fname;
      payload.last_name = lname;
    }
  }
  if (!payload.custom_fields) {
    let customFields = {};
    customFields = extractCustomFields(
      message,
      customFields,
      ['traits', 'context.traits'],
      IDENTIFY_EXCLUSION_FIELDS,
    );

    /* 
      Validations for custom_fields object keys 
      Validation 1 : keys name should only contain letters, numbers and underscores
      Validation 2 : the length of the keys value should not be more then 910 characters in case of array and objects and should not be more then 1000 characters for rest of the data types 
    */
    const keys = Object.keys(customFields);
    const regex = /^\w+$/;
    keys.forEach((key) => {
      if (
        !regex.test(key) ||
        (typeof customFields[key] === 'object' && JSON.stringify(customFields[key]).length > 910) ||
        customFields[key].toString().length > 1000
      ) {
        delete customFields[key];
      }
    });

    if (!isEmptyObject(customFields)) {
      payload.custom_fields = customFields;
    }
  }

  payload = removeUndefinedAndNullValues(payload);
  const finalpayload = {
    subscribers: [payload],
  };
  const basicAuth = Buffer.from(Config.apiKey).toString('base64');
  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  const campaignId = getDestinationExternalID(message, 'dripCampaignId') || Config.campaignId;
  if (campaignId && email) {
    const check = await createUpdateUser(finalpayload, Config, basicAuth);
    if (!check) {
      throw new NetworkInstrumentationError('Unable to create/update user.');
    }

    let campaignPayload = constructPayload(message, campaignMapping);
    campaignPayload.email = email;

    campaignPayload = removeUndefinedAndNullValues(campaignPayload);
    const finalCampaignPayload = {
      subscribers: [campaignPayload],
    };

    response.endpoint = `${ENDPOINT}/v2/${Config.accountId}/campaigns/${campaignId}/subscribers`;
    response.body.JSON = finalCampaignPayload;
    return response;
  }
  response.endpoint = `${ENDPOINT}/v2/${Config.accountId}/subscribers`;
  response.body.JSON = finalpayload;
  return response;
};

const trackResponseBuilder = async (message, { Config }) => {
  const id = getDestinationExternalID(message, 'dripId');

  let email = getValueFromMessage(message, [
    'properties.email',
    'traits.email',
    'context.traits.email',
  ]);
  if (!isValidEmail(email)) {
    email = null;
    logger.error('Enter correct email format.');
  }
  if (!id && !email) {
    throw new InstrumentationError('Drip Id or email is required.');
  }

  let event = getValueFromMessage(message, 'event');
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }
  event = event.trim().toLowerCase();

  if (!Config.enableUserCreation && !id) {
    const check = await userExists(Config, email);
    if (!check) {
      throw new NetworkInstrumentationError(
        'User creation mode is disabled and user does not exist. Track call aborted.',
      );
    }
  }
  if (ecomEvents.includes(event)) {
    const payload = constructPayload(message, ecomMapping);
    payload.email = email;
    payload.person_id = id;

    if (payload.occurred_at && !isValidTimestamp(payload.occurred_at)) {
      payload.occurred_at = null;
      logger.error('Timestamp format must be ISO-8601.');
    }
    const productList = getValueFromMessage(message, 'properties.products');
    if (productList) {
      const itemList = createList(productList);
      if (itemList && itemList.length > 0) {
        payload.items = itemList;
      }
    }
    payload.action = eventNameMapping[event];
    const basicAuth = Buffer.from(Config.apiKey).toString('base64');
    const response = defaultRequestConfig();
    response.headers = {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': JSON_MIME_TYPE,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.endpoint = `${ENDPOINT}/v3/${Config.accountId}/shopper_activity/order`;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }

  let payload = constructPayload(message, trackMapping);
  payload.action = event;
  payload.id = id;
  payload.email = email;
  if (payload.occurred_at && !isValidTimestamp(payload.occurred_at)) {
    payload.occurred_at = null;
    logger.error('Timestamp format must be ISO-8601.');
  }

  if (!payload.properties) {
    let properties = {};
    properties = extractCustomFields(
      message,
      properties,
      ['properties'],
      TRACKING_EXLCUSION_FIELDS,
    );
    if (!isEmptyObject(properties)) {
      payload = {
        ...payload,
        properties,
      };
    }
  }
  payload = removeUndefinedAndNullValues(payload);
  const finalpayload = {
    events: [payload],
  };
  const basicAuth = Buffer.from(Config.apiKey).toString('base64');
  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = `${ENDPOINT}/v2/${Config.accountId}/events`;
  response.body.JSON = finalpayload;
  return response;
};

const process = async (event) => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  if (!destination.Config.accountId) {
    throw new ConfigurationError('Invalid Account Id. Aborting message.');
  }
  if (!destination.Config.apiKey) {
    throw new ConfigurationError('Inavalid API Key. Aborting message.');
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
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
