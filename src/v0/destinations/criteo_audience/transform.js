const get = require('get-value');
const { BASE_ENDPOINT, operation } = require('./config');
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  defaultPatchRequestConfig,
  getAccessToken,
  getEventType,
  getDestinationExternalIDInfoForRetl,
} = require('../../util');
const { InstrumentationError } = require('../../util/errorTypes');
const { MappedToDestinationKey } = require('../../../constants');

const { preparePayload } = require('./util');

const prepareResponse = (payload, audienceId, accessToken) => {
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}audiences/${audienceId}/contactlist`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.method = defaultPatchRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  return response;
};
/**
 * This function is used for building the final response to be returned.
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const responseBuilder = (message, destination, accessToken) => {
  const responseArray = [];
  const { Config } = destination;
  const { audienceId } = Config;
  const { listData } = message.properties;

  let finalAudienceId = audienceId;
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (!finalAudienceId && mappedToDestination) {
    const { objectType } = getDestinationExternalIDInfoForRetl(message, 'CRITEO_AUDIENCE');
    finalAudienceId = objectType;
  }
  operation.forEach((op) => {
    if (listData[op]) {
      const criteoPayloadArray = preparePayload(listData[op], op, Config);
      criteoPayloadArray.forEach((criteoPayload) => {
        responseArray.push(prepareResponse(criteoPayload, finalAudienceId, accessToken));
      });
    }
  });

  if (responseArray.length === 0) {
    throw new InstrumentationError(`Payload could not be populated`);
  }
  return responseArray;
};

const processEvent = async (metadata, message, destination) => {
  const accessToken = getAccessToken(metadata, 'accessToken');
  let response;
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  if (!message.properties) {
    throw new InstrumentationError('Message properties is not present. Aborting message.');
  }
  if (!message.properties.listData) {
    throw new InstrumentationError('listData is not present inside properties. Aborting message.');
  }
  if (getEventType(message) === 'audiencelist') {
    response = responseBuilder(message, destination, accessToken);
  } else {
    throw new InstrumentationError(`Event type ${message.type} is not supported`);
  }
  return response;
};

const process = async (event) => processEvent(event.metadata, event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
