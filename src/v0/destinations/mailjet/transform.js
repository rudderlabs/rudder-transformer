const lodash = require('lodash');
const { TransformationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const stats = require('../../../util/stats');
const {
  getSuccessRespEvents,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultBatchRequestConfig,
  handleRtTfSingleEventError,
  removeUndefinedAndNullValues,
} = require('../../util');

const { MAX_BATCH_SIZE } = require('./config');
const { EventType } = require('../../../constants');
const { createOrUpdateContactResponseBuilder } = require('./utils');
const { JSON_MIME_TYPE } = require('../../util/constant');

const responseBuilder = (payload) => {
  if (payload) {
    const response = defaultRequestConfig();
    const { listId, action, ...rest } = payload;
    response.body.JSON = removeUndefinedAndNullValues(rest);
    return {
      ...response,
      listId,
      action,
    };
  }
  // fail-safety for developer error
  throw new TransformationError('Something went wrong while constructing the payload');
};

const identifyResponseBuilder = (message, destination) => {
  const payload = createOrUpdateContactResponseBuilder(message, destination);
  return responseBuilder(payload);
};

const processEvent = (message, destination) => {
  // Validating if message type is even given or not
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  const messageType = message.type.toLowerCase();

  if (messageType === EventType.IDENTIFY) {
    return identifyResponseBuilder(message, destination);
  }

  throw new InstrumentationError(`Event type "${messageType}" is not supported`);
};

const process = (event) => processEvent(event.message, event.destination);

const generateBatchedPaylaodForArray = (events, combination) => {
  let batchEventResponse = defaultBatchRequestConfig();
  const metadata = [];
  // extracting destination from the first event in a batch
  const { destination } = events[0];
  const { apiKey, apiSecret } = destination.Config;
  const token = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  const Contacts = [];
  // Batch event into destination batch structure
  events.forEach((event) => {
    Contacts.push(event.message.body.JSON);
    metadata.push(event.metadata);
  });

  const configurations = combination.split('&&');
  // first -> listId, second -> action
  const [first, second] = configurations;
  batchEventResponse.batchedRequest.body.JSON = {
    Action: second,
    Contacts,
  };
  batchEventResponse.batchedRequest.endpoint = `https://api.mailjet.com/v3/REST/contactslist/${first}/managemanycontacts`;

  batchEventResponse.batchedRequest.method = defaultPostRequestConfig.requestMethod;

  batchEventResponse.batchedRequest.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Basic ${token}`,
  };
  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination,
  };
  return batchEventResponse;
};

const batchEvents = (successRespList) => {
  const batchedResponseList = [];
  /*
  ------------- eventGroups ---------------------
  "listId1&&Action1" : [{message : {}, metadata : {}, destination: {}}],
  "listId1&&Action2": [{message : {}, metadata : {}, destination: {}}],
  "listId2&&Action2": [{message : {}, metadata : {}, destination: {}}],
  "listId2&&Action1": [{message : {}, metadata : {}, destination: {}}]
  */
  const eventGroups = lodash.groupBy(successRespList, (event) => {
    const { listId, action } = event.message;
    return `${listId}&&${action}`;
  });
  Object.keys(eventGroups).forEach((combination) => {
    const eventChunks = lodash.chunk(eventGroups[combination], MAX_BATCH_SIZE);
    // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    eventChunks.forEach((chunk) => {
      stats.gauge('mailjet_packing_size', chunk.length, {
        group: combination,
      });
      const batchEventResponse = generateBatchedPaylaodForArray(chunk, combination);
      batchedResponseList.push(
        getSuccessRespEvents(
          batchEventResponse.batchedRequest,
          batchEventResponse.metadata,
          batchEventResponse.destination,
          true,
        ),
      );
    });
  });
  return batchedResponseList;
};

const processRouterDest = (inputs, reqMetadata) => {
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
