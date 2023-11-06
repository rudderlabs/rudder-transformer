const get = require('get-value');
const btoa = require('btoa');

const { EventType, MappedToDestinationKey } = require('../../../constants');

const {
  getErrorRespEvents,
  getSuccessRespEvents,
  defaultRequestConfig,
  addExternalIdToTraits,
  removeUndefinedValues,
  adduserIdFromExternalId,
  getFieldValueFromMessage,
  handleRtTfSingleEventError,
  validateEventName,
} = require('../../util');

const logger = require('../../../logger');
const {
  getEventChunks,
  identifyResponseBuilder,
  aliasResponseBuilder,
  groupResponseBuilder,
  defaultResponseBuilder,
  validateConfigFields,
} = require('./util');
const { InstrumentationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

function responseBuilder(message, evType, evName, destination, messageType) {
  let identifyResponse;
  let aliasResponse;
  let groupResponse;
  let defaultResponse;
  let temporaryResponseDetails = {};

  // let requestConfig = defaultPostRequestConfig;
  // override userId with externalId in context(if present) and event is mapped to destination
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    addExternalIdToTraits(message);
    adduserIdFromExternalId(message);
  }

  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  const response = defaultRequestConfig();
  response.userId = userId || message.anonymousId;
  response.headers = {
    Authorization: `Basic ${btoa(`${destination.Config.siteID}:${destination.Config.apiKey}`)}`,
  };

  switch (evType) {
    case EventType.IDENTIFY:
      identifyResponse = identifyResponseBuilder(userId, message);
      temporaryResponseDetails = { ...identifyResponse };
      break;
    case EventType.ALIAS:
      aliasResponse = aliasResponseBuilder(message, userId);
      temporaryResponseDetails = { ...aliasResponse };
      break;
    case EventType.GROUP:
      groupResponse = groupResponseBuilder(message);
      temporaryResponseDetails = { ...groupResponse };
      break;
    default:
      defaultResponse = defaultResponseBuilder(
        message,
        evName,
        userId,
        evType,
        destination,
        messageType,
      );
      temporaryResponseDetails = { ...defaultResponse };
      break;
  }

  const payload = removeUndefinedValues(temporaryResponseDetails.rawPayload);
  response.endpoint = temporaryResponseDetails.endpoint;
  response.method = temporaryResponseDetails.requestConfig.requestMethod;
  response.body.JSON = payload;

  return response;
}

function processSingleMessage(message, destination) {
  validateConfigFields(destination);
  const messageType = message.type?.toLowerCase();
  let evType;
  let evName;
  switch (messageType) {
    case EventType.IDENTIFY:
      evType = 'identify';
      break;
    case EventType.PAGE:
      evType = 'page'; // customerio mandates sending 'page' for pageview events
      evName = message.name || message.properties?.url;
      break;
    case EventType.SCREEN:
      evType = 'event';
      evName = `Viewed ${message.event || message.properties?.name} Screen`;
      break;
    case EventType.TRACK:
      evType = 'event';
      validateEventName(message.event);
      evName = message.event;
      break;
    case EventType.ALIAS:
      evType = 'alias';
      break;
    case EventType.GROUP:
      evType = 'group';
      break;
    default:
      logger.error(`could not determine type ${messageType}`);
      throw new InstrumentationError(`could not determine type ${messageType}`);
  }
  evName = evName ? String(evName) : evName;
  const response = responseBuilder(message, evType, evName, destination, messageType);

  // replace default domain with EU data center domainc for EU based account
  if (destination.Config?.datacenter === 'EU' || destination.Config?.datacenterEU) {
    response.endpoint = response.endpoint.replace('track.customer.io', 'track-eu.customer.io');
  }

  return response;
}

function process(event) {
  const { message, destination } = event;
  const result = processSingleMessage(message, destination);
  if (!result.statusCode) {
    result.statusCode = 200;
  }
  return result;
}

const batchEvents = (successRespList) => {
  const batchedResponseList = [];
  const groupEvents = [];
  // Filtering out group calls to process batching
  successRespList.forEach((resp) => {
    if (!resp.message.endpoint.includes('v2/batch')) {
      batchedResponseList.push(
        getSuccessRespEvents(resp.message, [resp.metadata], resp.destination),
      );
    } else {
      groupEvents.push(resp);
    }
  });

  if (groupEvents.length > 0) {
    // Extracting metadata, destination and message from the first event in a batch
    const { destination, message } = groupEvents[0];
    const { headers, endpoint } = message;

    // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const eventChunks = getEventChunks(groupEvents);

    /**
     * Ref : https://www.customer.io/docs/api/track/#operation/batch
     */
    eventChunks.forEach((chunk) => {
      const request = defaultRequestConfig();
      request.endpoint = endpoint;
      request.headers = { ...headers, 'Content-Type': JSON_MIME_TYPE };
      // Setting the request body to an object with a single property called "batch" containing the batched data
      request.body.JSON = { batch: chunk.data };

      batchedResponseList.push(getSuccessRespEvents(request, chunk.metadata, destination));
    });
  }
  return batchedResponseList;
};

const processRouterDest = (inputs, reqMetadata) => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, 'Invalid event array');
    return [respEvents];
  }
  let batchResponseList = [];
  const batchErrorRespList = [];
  const successRespList = [];
  const { destination } = inputs[0];
  inputs.forEach((event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        successRespList.push({
          message: event.message,
          metadata: event.metadata,
          destination,
        });
      } else {
        // if not transformed
        const transformedPayload = {
          message: process(event),
          metadata: event.metadata,
          destination,
        };
        successRespList.push(transformedPayload);
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      batchErrorRespList.push(errRespEvent);
    }
  });

  if (successRespList.length > 0) {
    batchResponseList = batchEvents(successRespList);
  }

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
