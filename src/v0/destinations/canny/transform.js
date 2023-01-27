const { EventType } = require('../../../constants');
const { ConfigCategory, mappingConfig, BASE_URL } = require('./config');
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  getHashFromArrayWithDuplicate,
  simpleProcessRouterDest,
} = require('../../util');
const {
  retrieveUserId,
  validateIdentifyFields,
  validateCreatePostFields,
  validateEventMapping,
} = require('./util');
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

const responseBuilder = (responseConfgs) => {
  const { payload, apiKey, endpoint, contentType, responseBody } = responseConfgs;

  const response = defaultRequestConfig();
  if (payload) {
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      Authorization: `Basic ${apiKey}`,
      'Content-Type': contentType,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body[`${responseBody}`] = removeUndefinedAndNullValues(payload);
  }
  return response;
};

const identifyResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  const contentType = 'application/json';
  const responseBody = 'JSON';

  const payload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);
  payload.apiKey = apiKey;

  validateIdentifyFields(payload);

  const { endpoint } = ConfigCategory.IDENTIFY;

  const responseConfgs = {
    payload,
    apiKey,
    endpoint,
    contentType,
    responseBody,
  };
  return responseBuilder(responseConfgs);
};

const getTrackResponse = async (apiKey, message, operationType) => {
  let endpoint;
  let responseBody;
  let contentType;
  let payload;
  if (operationType === 'createVote') {
    responseBody = 'FORM';
    contentType = 'application/x-www-form-urlencoded';

    payload = constructPayload(message, mappingConfig[ConfigCategory.CREATE_VOTE.name]);
    if (!payload.postID) {
      throw new InstrumentationError('PostID is not present. Aborting message.');
    }

    payload.apiKey = apiKey;
    const voterID = await retrieveUserId(apiKey, message);
    payload.voterID = voterID;
    endpoint = ConfigCategory.CREATE_VOTE.endpoint;
  } else if (operationType === 'createPost') {
    contentType = 'application/json';
    responseBody = 'JSON';

    payload = constructPayload(message, mappingConfig[ConfigCategory.CREATE_POST.name]);

    validateCreatePostFields(payload);

    payload.apiKey = apiKey;
    payload.authorID = await retrieveUserId(apiKey, message);

    endpoint = ConfigCategory.CREATE_POST.endpoint;
  }

  const responseConfgs = {
    payload,
    apiKey,
    endpoint,
    contentType,
    responseBody,
  };
  return responseBuilder(responseConfgs);
};

const trackResponseBuilder = async (message, { Config }) => {
  const { apiKey, eventsToEvents } = Config;
  const configuredEventsMap = getHashFromArrayWithDuplicate(eventsToEvents);

  const event = message.event?.toLowerCase().trim();
  validateEventMapping(configuredEventsMap, event);

  const responseArray = [];
  const configuredSourceEvents = Object.keys(configuredEventsMap);
  // eslint-disable-next-line no-restricted-syntax
  for (const configuredSourceEvent of configuredSourceEvents) {
    if (configuredSourceEvent === event) {
      const destinationEvents = configuredEventsMap[event];
      // eslint-disable-next-line no-restricted-syntax
      for (const destinationEvent of destinationEvents) {
        // eslint-disable-next-line no-await-in-loop
        const response = await getTrackResponse(apiKey, message, destinationEvent);
        responseArray.push(response);
      }
    }
  }

  return responseArray;
};

const processEvent = (message, destination) => {
  if (!destination.Config.apiKey) {
    throw new ConfigurationError('API Key is not present. Aborting message.');
  }
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
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
    default:
      throw new InstrumentationError('Message type not supported');
  }
  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
