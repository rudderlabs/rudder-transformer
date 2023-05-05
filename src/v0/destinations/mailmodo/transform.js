const _ = require('lodash');
const get = require('get-value');
const { isEmpty } = require('lodash');
const { EventType } = require('../../../constants');
const { ConfigCategory, IDENTIFY_MAX_BATCH_SIZE, mappingConfig, BASE_URL } = require('./config');
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  getErrorRespEvents,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
} = require('../../util');
const { deduceAddressFields, extractCustomProperties } = require('./utils');
const { ConfigurationError, InstrumentationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const responseBuilder = (responseConfgs) => {
  const { resp, apiKey, endpoint } = responseConfgs;

  const response = defaultRequestConfig();
  if (resp) {
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      mmApiKey: `${apiKey}`,
      'Content-Type': JSON_MIME_TYPE,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(resp);
  }
  return response;
};

const identifyResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  let { listName } = Config;

  const payload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);

  // adding unmapped properties(custom properties)
  const customProperties = extractCustomProperties(message);
  if (!isEmpty(customProperties)) {
    if (payload.data) {
      payload.data = { ...customProperties, ...payload.data };
    } else {
      payload.data = { ...customProperties };
    }
  }

  const { address1, address2 } = deduceAddressFields(message);
  if (address1) payload.data.address1 = address1;
  if (address2) payload.data.address2 = address2;

  if (typeof listName === 'string' && listName.trim().length === 0) {
    listName = 'Rudderstack';
  }

  const valuesArray = [payload];
  const resp = { values: valuesArray, listName };

  const { endpoint } = ConfigCategory.IDENTIFY;

  const responseConfgs = {
    resp,
    apiKey,
    endpoint,
  };
  return responseBuilder(responseConfgs);
};

const trackResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  const resp = constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]);

  const { endpoint } = ConfigCategory.TRACK;

  const responseConfgs = {
    resp,
    apiKey,
    endpoint,
  };
  return responseBuilder(responseConfgs);
};

const processEvent = (message, destination) => {
  if (!destination.Config.apiKey) {
    throw new ConfigurationError('API Key is not present, Aborting event');
  }
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
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
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const process = (event) => processEvent(event.message, event.destination);

function batchEvents(eventsChunk) {
  const batchedResponseList = [];

  const arrayChunks = _.chunk(eventsChunk, IDENTIFY_MAX_BATCH_SIZE);

  // list of chunks [ [..], [..] ]
  arrayChunks.forEach((chunk) => {
    const metadatas = [];
    const values = [];

    // extracting destination
    // from the first event in a batch
    const { destination } = chunk[0];
    const { apiKey } = destination.Config;
    const { listName } = chunk[0].message.body.JSON;

    let batchEventResponse = defaultBatchRequestConfig();

    // Batch event into dest batch structure
    chunk.forEach((event) => {
      values.push(event?.message?.body?.JSON?.values[0]);
      metadatas.push(event.metadata);
    });
    // batching into identify batch structure
    batchEventResponse.batchedRequest.body.JSON = {
      listName: `${listName}`,
      values,
    };
    batchEventResponse.batchedRequest.endpoint = `${BASE_URL}/addToList/batch`;

    batchEventResponse.batchedRequest.headers = {
      'Content-Type': JSON_MIME_TYPE,
      mmApiKey: apiKey,
    };

    batchEventResponse = {
      ...batchEventResponse,
      metadata: metadatas,
      destination,
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true,
      ),
    );
  });

  return batchedResponseList;
}

function getEventChunks(event, identifyEventChunks, eventResponseList) {
  // Checking if event type is identify
  if (event.message.endpoint.includes('/addToList/batch')) {
    identifyEventChunks.push(event);
  } else {
    // any other type of event
    const { message, metadata, destination } = event;
    const endpoint = get(message, 'endpoint');

    const batchedResponse = defaultBatchRequestConfig();
    batchedResponse.batchedRequest.headers = message.headers;
    batchedResponse.batchedRequest.endpoint = endpoint;
    batchedResponse.batchedRequest.body = message.body;
    batchedResponse.batchedRequest.params = message.params;
    batchedResponse.batchedRequest.method = defaultPostRequestConfig.requestMethod;
    batchedResponse.metadata = [metadata];
    batchedResponse.destination = destination;

    eventResponseList.push(
      getSuccessRespEvents(
        batchedResponse.batchedRequest,
        batchedResponse.metadata,
        batchedResponse.destination,
      ),
    );
  }
}

const processRouterDest = (inputs, reqMetadata) => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, 'Invalid event array');
    return [respEvents];
  }

  const identifyEventChunks = []; // list containing identify events in batched format
  const eventResponseList = []; // list containing other events in batched format
  const errorRespList = [];
  inputs.forEach((event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        getEventChunks(event, identifyEventChunks, eventResponseList);
      } else {
        // if not transformed
        getEventChunks(
          {
            message: process(event),
            metadata: event.metadata,
            destination: event.destination,
          },
          identifyEventChunks,
          eventResponseList,
        );
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });

  // batching identifyEventChunks
  let identifyBatchedResponseList = [];

  if (identifyEventChunks.length > 0) {
    identifyBatchedResponseList = batchEvents(identifyEventChunks);
  }

  let batchedResponseList = [];
  // appending all kinds of batches
  batchedResponseList = batchedResponseList
    .concat(identifyBatchedResponseList)
    .concat(eventResponseList);

  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
