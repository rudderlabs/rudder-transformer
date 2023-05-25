const {
  BASE_ENDPOINT,
  ENDPOINTS,
  BINGADS_SUPPORTED_OPERATION,
  AUDIENCE_ATTRIBUTE,
} = require('./config');
const {
  defaultRequestConfig,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  getAccessToken,
} = require('../../util');

const { createPayload } = require('./util');
const { InstrumentationError } = require('../../util/errorTypes');

/**
 * This function is used for building the final response to be returned.
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const responseBuilder = async (message, destination, accessToken) => {
  let bingListPayload = {};
  const { Config } = destination;
  const { listData } = message.properties;
  const { audienceId, audienceType } = Config;

  const traitsList = listData[BINGADS_SUPPORTED_OPERATION];
  if (!traitsList) {
    throw new InstrumentationError(
      `The only supported operation for audience updation '${BINGADS_SUPPORTED_OPERATION}' is not present`,
    );
  }

  /**
   * The below written switch case is used to build the response for each of the supported audience type.
   *  eg. ["email"].
   */
  const audienceAttribute = AUDIENCE_ATTRIBUTE[audienceType];
  switch (audienceAttribute) {
    case 'email':
      // creating the output payload using the audience list and Config
      bingListPayload = createPayload(traitsList, Config);
      break;
    default:
      throw new InstrumentationError(`Audience Type ${audienceType} is not supported`);
  }

  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}`;
  response.body.JSON = removeUndefinedAndNullValues(bingListPayload);
  response.method = defaultPutRequestConfig.requestMethod;
  response.headers = {
    'X-Auth-Token': accessToken,
    'X-Auth-Method': 'OAuth2',
    'Content-Type': 'application/json',
  };
  return response;
};

const processEvent = async (metadata, message, destination) => {
  const accessToken = getAccessToken(metadata, 'access_token');
  let response;
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  if (!message.properties) {
    throw new InstrumentationError('Message properties is not present. Aborting message');
  }
  if (!message.properties.listData) {
    throw new InstrumentationError('listData is not present inside properties. Aborting message');
  }
  if (message.type.toLowerCase() === 'audiencelist') {
    response = await responseBuilder(message, destination, accessToken);
  } else {
    throw new InstrumentationError(`Event type ${message.type} is not supported`, 400);
  }
  return response;
};

const process = async (event) => processEvent(event.metadata, event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
