const _ = require('lodash');
const {
  defaultPutRequestConfig,
  handleRtTfSingleEventError,
  checkInvalidRtTfEvents,
  constructPayload,
  defaultPostRequestConfig,
  isDefinedAndNotNull,
  formatTimeStamp,
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
  mailchimpEventsEndpoint,
  stringifyPropertiesValues,
} = require('./utils');
const { MAX_BATCH_SIZE, VALID_STATUSES, TRACK_CONFIG } = require('./config');
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

const responseBuilderSimple = (finalPayload, endpoint, Config, audienceId) => {
  const { apiKey } = Config;
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = endpoint.includes('events')
    ? defaultPostRequestConfig.requestMethod
    : defaultPutRequestConfig.requestMethod;
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

const trackResponseBuilder = (message, { Config }) => {
  const { datacenterId } = Config;
  const audienceId = getAudienceId(message, Config);
  const email = getFieldValueFromMessage(message, 'email');
  if (!email) {
    throw new InstrumentationError('Email is required for track');
  }
  const endpoint = mailchimpEventsEndpoint(datacenterId, audienceId, email);
  const processedPayload = constructPayload(message, TRACK_CONFIG);
  if (processedPayload?.properties) {
    processedPayload.properties = stringifyPropertiesValues(processedPayload.properties);
  }
  processedPayload.name = processedPayload.name.trim().replace(/\s+/g, '_');
  processedPayload.occurred_at = formatTimeStamp(
    processedPayload.occurred_at,
    'YYYY-MM-DDTHH:mm:ssZ',
  );
  if (isDefinedAndNotNull(processedPayload.properties?.isSyncing)) {
    delete processedPayload.properties.isSyncing;
  }
  return responseBuilderSimple(processedPayload, endpoint, Config, audienceId);
};

const identifyResponseBuilder = async (message, { Config }) => {
  const { datacenterId } = Config;
  const email = getFieldValueFromMessage(message, 'email');
  if (!email) {
    throw new InstrumentationError('Email is required for identify');
  }
  const audienceId = getAudienceId(message, Config);
  const endpoint = mailChimpSubscriptionEndpoint(datacenterId, audienceId, email);
  const processedPayload = await processPayload(message, Config, audienceId);
  return responseBuilderSimple(processedPayload, endpoint, Config, audienceId);
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
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
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

// This function separates identify and track call in chunks
const getEventChunks = (event, identifyRespList, trackRespList) => {
  if (event.message.endpoint.includes('events')) {
    trackRespList.push(event);
  } else {
    identifyRespList.push(event);
  }
};

const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }
  let batchResponseList = [];
  const batchErrorRespList = [];
  const identifyRespList = [];
  const trackRespList = [];
  const { destination } = inputs[0];
  await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(
            { message: event.message, metadata: event.metadata, destination },
            identifyRespList,
            trackRespList,
          );
        } else {
          // if not transformed
          getEventChunks(
            {
              message: await process(event),
              metadata: event.metadata,
              destination,
            },
            identifyRespList,
            trackRespList,
          );
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        batchErrorRespList.push(errRespEvent);
      }
    }),
  );
  let batchedIdentifyResponseList = [];
  if (identifyRespList.length > 0) {
    batchedIdentifyResponseList = batchEvents(identifyRespList);
  }
  const trackResponseList = [];
  trackRespList.forEach((resp) => {
    trackResponseList.push(getSuccessRespEvents(resp.message, [resp.metadata], resp.destination));
  });
  batchResponseList = batchResponseList.concat(batchedIdentifyResponseList, trackResponseList);

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
