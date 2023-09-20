const get = require('get-value');
const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  constructPayload,
  ErrorMessage,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  getValidDynamicFormConfig,
  simpleProcessRouterDest,
} = require('../../util');
const { InstrumentationError, TransformationError } = require('../../util/errorTypes');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const {
  getUserAccountDetails,
  flattenAddress,
  UpdateContactWithSalesActivity,
  UpdateContactWithLifeCycleStage,
  updateAccountWOContact,
  getHeaders,
} = require('./utils');

/*
 * This functions is used for creating response config for identify call.
 * @param {*} Config
 * @returns
 */
const identifyResponseConfig = (Config) => {
  const response = defaultRequestConfig();
  response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = getHeaders(Config.apiKey);
  return response;
};

/*
 * This functions is used for creating response for identify call, to create or update contacts.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const identifyResponseBuilder = (message, { Config }) => {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]);

  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }

  if (payload.address) payload.address = flattenAddress(payload.address);
  const response = defaultRequestConfig();
  response.headers = getHeaders(Config.apiKey);
  response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
  response.method = CONFIG_CATEGORIES.IDENTIFY.method;
  response.body.JSON = {
    contact: payload,
    unique_identifier: { emails: payload.emails },
  };
  return response;
};

/*
 * This functions is used for tracking contacts activities.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const trackResponseBuilder = async (message, { Config }, event) => {
  if (!event) {
    throw new InstrumentationError('Event name is required for track call.');
  }
  let payload;

  const response = defaultRequestConfig();
  switch (event.toLowerCase().trim().replace(/\s+/g, '_')) {
    case 'sales_activity': {
      payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.SALES_ACTIVITY.name]);
      response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.SALES_ACTIVITY.baseUrlCreate}`;
      response.body.JSON.sales_activity = await UpdateContactWithSalesActivity(
        payload,
        message,
        Config,
      );
      break;
    }
    case 'lifecycle_stage': {
      response.body.JSON = await UpdateContactWithLifeCycleStage(message, Config);
      response.endpoint = `https://${Config.domain}${CONFIG_CATEGORIES.IDENTIFY.baseUrl}`;
      break;
    }
    default:
      throw new InstrumentationError(`event name ${event} is not supported. Aborting!`);
  }
  response.headers = getHeaders(Config.apiKey);
  response.method = defaultPostRequestConfig.requestMethod;
  return response;
};

/*
 * This functions is used for associating contacts in account.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const groupResponseBuilder = async (message, { Config }) => {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]);
  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }

  if (payload.address) payload.address = flattenAddress(payload.address);

  const userEmail = getFieldValueFromMessage(message, 'email');
  if (!userEmail) {
    return updateAccountWOContact(payload, Config);
  }

  const accountDetails = await getUserAccountDetails(payload, userEmail, Config);
  const responseIdentify = identifyResponseConfig(Config);
  responseIdentify.body.JSON.contact = { sales_accounts: accountDetails };
  responseIdentify.body.JSON.unique_identifier = { emails: userEmail };
  return responseIdentify;
};

// Checks if there are any mapping events for the track event and returns them
function eventMappingHandler(message, destination) {
  const event = get(message, 'event');
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }

  let { rudderEventsToFreshsalesEvents } = destination.Config;
  const mappedEvents = new Set();

  if (Array.isArray(rudderEventsToFreshsalesEvents)) {
    rudderEventsToFreshsalesEvents = getValidDynamicFormConfig(
      rudderEventsToFreshsalesEvents,
      'from',
      'to',
      'freshsales_conversion',
      destination.ID,
    );
    rudderEventsToFreshsalesEvents.forEach((mapping) => {
      if (mapping.from.toLowerCase() === event.toLowerCase()) {
        mappedEvents.add(mapping.to);
      }
    });
  }

  return [...mappedEvents];
}

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  let response;
  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK: {
      const mappedEvents = eventMappingHandler(message, destination);
      if (mappedEvents.length > 0) {
        const respList = await Promise.all(
          mappedEvents.map(async (mappedEvent) =>
            trackResponseBuilder(message, destination, mappedEvent),
          ),
        );

        response = respList;
      } else {
        response = await trackResponseBuilder(message, destination, get(message, 'event'));
      }
      break;
    }
    case EventType.GROUP:
      response = await groupResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(`message type ${messageType} not supported`);
  }
  return response;
};
const process = async (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
