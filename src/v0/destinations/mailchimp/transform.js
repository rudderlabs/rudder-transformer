const _ = require('lodash');
const {
  defaultPutRequestConfig,
  handleRtTfSingleEventError,
  checkInvalidRtTfEvents,
} = require('../../util');
const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
} = require('../../util');
const {
  processPayload,
  mailChimpSubscriptionEndpoint,
  getAudienceId,
  generateBatchedPaylaodForArray,
} = require('./utils');
const { MAX_BATCH_SIZE, VALID_STATUSES } = require('./config');
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

const responseBuilderSimple = (finalPayload, email, Config, audienceId) => {
  const { datacenterId, apiKey } = Config;
  const response = defaultRequestConfig();
  response.endpoint = mailChimpSubscriptionEndpoint(datacenterId, audienceId, email);
  response.method = defaultPutRequestConfig.requestMethod;
  response.body.JSON = finalPayload;
  const basicAuth = Buffer.from(`apiKey:${apiKey}`).toString('base64');
  if (finalPayload.status && !VALID_STATUSES.includes(finalPayload.status)) {
    throw new InstrumentationError(
      'The status must be one of [subscribed, unsubscribed, cleaned, pending, transactional]',
    );
  }
  return {
    ...response,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${basicAuth}`,
    },
    audienceId,
  };
};

const identifyResponseBuilder = async (message, { Config }) => {
  const email = getFieldValueFromMessage(message, 'email');
  if (!email) {
    throw new InstrumentationError('Email is required for identify');
  }
  const audienceId = getAudienceId(message, Config);
  const processedPayload = await processPayload(message, Config, audienceId);
  return responseBuilderSimple(processedPayload, email, Config, audienceId);
};

const process = async (event) => {
  let response;
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();
  const destConfig = destination.Config;

  if (!destConfig.apiKey) {
    throw new ConfigurationError('API Key not found. Aborting');
  }

  if (!destConfig.audienceId) {
    throw new ConfigurationError('Audience Id not found. Aborting');
  }

  if (!destConfig.datacenterId) {
    throw new ConfigurationError('DataCenter Id not found. Aborting');
  }

  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(`message type ${messageType} is not supported`);
  }
  return response;
};

// Batching reference doc: https://mailchimp.com/developer/marketing/api/lists/
const batchEvents = (successRespList) => {
  const batchedResponseList = [];
  // {
  //    audienceId1: [...events]
  //    audienceId2: [...events]
  // }
  const audienceEventGroups = _.groupBy(successRespList, (event) => event.message.audienceId);
  Object.keys(audienceEventGroups).forEach((audienceId) => {
    // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const eventChunks = _.chunk(audienceEventGroups[audienceId], MAX_BATCH_SIZE);
    eventChunks.forEach((chunk) => {
      const batchEventResponse = generateBatchedPaylaodForArray(audienceId, chunk);
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

const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }
  let batchResponseList = [];
  const batchErrorRespList = [];
  const successRespList = [];
  const { destination } = inputs[0];
  await Promise.all(
    inputs.map(async (event) => {
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
            message: await process(event),
            metadata: event.metadata,
            destination,
          };
          successRespList.push(transformedPayload);
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        batchErrorRespList.push(errRespEvent);
      }
    }),
  );
  if (successRespList.length > 0) {
    batchResponseList = batchEvents(successRespList);
  }

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
