const { SHA256 } = require('crypto-js');
const set = require('set-value');
const _ = require('lodash');
const { EventType } = require('../../../constants');
const {
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  isDefinedAndNotNullAndNotEmpty,
  getHashFromArrayWithDuplicate,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
  getSuccessRespEvents,
  defaultBatchRequestConfig,
} = require('../../util');
const {
  CONFIG_CATEGORIES,
  MAX_BATCH_SIZE,
  MAPPING_CONFIG,
  EVENT_NAME_MAPPING,
  PARTNER_NAME,
} = require('./config');
const { ConfigurationError, InstrumentationError } = require('../../util/errorTypes');

const getContents = (message) => {
  const contents = [];
  const { properties } = message;
  const { products } = properties;
  const mappingJson = MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_PROPERTIES_CONTENTS.name];

  const updateContentsArray = (productProps) => {
    const contentObject = constructPayload(productProps, mappingJson);
    const contentObj = removeUndefinedAndNullValues(contentObject);
    if (Object.keys(contentObj).length > 0) {
      contents.push(contentObj);
    }
  };

  if (products && Array.isArray(products) && products.length > 0) {
    products.forEach((product) => updateContentsArray(product));
  } else {
    updateContentsArray(properties);
  }
  return contents;
};

const getTrackResponse = (message, category, Config, event) => {
  const { hashUserProperties, accessToken } = Config;
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  payload.event = event;
  payload.partner_name = PARTNER_NAME;

  // Settings Contents object
  const contents = getContents(message);
  if (contents.length > 0) {
    set(payload, 'properties.contents', contents);
  }

  const email = message?.traits?.email || message?.context?.traits?.email;
  if (isDefinedAndNotNullAndNotEmpty(email)) {
    const emails = hashUserProperties
      ? [SHA256(email.trim().toLowerCase()).toString()]
      : [email.trim().toLowerCase()];
    set(payload, 'context.user.emails', emails);
  }

  const phoneNumber = message?.traits?.phone || message?.context?.traits.phone;
  if (isDefinedAndNotNullAndNotEmpty(phoneNumber)) {
    const phoneNumbers = hashUserProperties
      ? [SHA256(phoneNumber.trim()).toString()]
      : [phoneNumber.trim()];
    set(payload, 'context.user.phone_numbers', phoneNumbers);
  }

  const response = defaultRequestConfig();
  response.headers = {
    'Access-Token': accessToken,
    'Content-Type': 'application/json',
  };

  response.method = category.method;
  response.endpoint = category.endpoint;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return { ...response, event_set_id: payload.event_set_id };
};

const trackResponseBuilder = (message, category, { Config }) => {
  const { eventsToStandard } = Config;

  const event = message.event?.toLowerCase().trim();
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }

  const standardEventsMap = getHashFromArrayWithDuplicate(eventsToStandard);

  if (EVENT_NAME_MAPPING[event] === undefined && !standardEventsMap[event]) {
    throw new InstrumentationError(
      `Event name (${event}) is not valid, must be mapped to one of standard events`,
    );
  }

  const responseList = [];
  if (standardEventsMap[event]) {
    standardEventsMap[event].forEach((eventName) => {
      responseList.push(getTrackResponse(message, category, Config, eventName));
    });
  } else {
    const eventName = EVENT_NAME_MAPPING[event];
    responseList.push(getTrackResponse(message, category, Config, eventName));
  }

  return responseList;
};

const process = (event) => {
  const { message, destination } = event;

  if (!destination.Config.accessToken) {
    throw new ConfigurationError('Access Token not found');
  }
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, CONFIG_CATEGORIES.TRACK, destination);
      break;
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const generateBatch = (eventSetId, events) => {
  const batchRequestObject = defaultBatchRequestConfig();
  const batchPayload = [];
  const metadata = [];
  // extracting destination from the first event in a batch
  const { destination } = events[0];
  // Batch event into dest batch structure
  events.forEach((ev) => {
    batchPayload.push(ev.message.body.JSON);
    metadata.push(ev.metadata);
  });

  batchRequestObject.batchedRequest.body.JSON = {
    event_set_id: eventSetId,
    partner_name: PARTNER_NAME,
    batch: batchPayload,
  };

  batchRequestObject.batchedRequest.endpoint = CONFIG_CATEGORIES.TRACK.batchEndpoint;

  const { accessToken } = destination.Config;

  batchRequestObject.batchedRequest.headers = {
    'Access-Token': accessToken,
    'Content-Type': 'application/json',
  };

  return {
    ...batchRequestObject,
    metadata,
    destination,
  };
};

const batchEvents = (eventChunksArray) => {
  const batchedResponseList = [];

  // {
  //    event_set_id1: [...events]
  //    event_set_id2: [...events]
  // }
  const groupedEventChunks = _.groupBy(eventChunksArray, (event) => event.message.event_set_id);
  Object.keys(groupedEventChunks).forEach((eventSetId) => {
    // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const eventChunks = _.chunk(groupedEventChunks[eventSetId], MAX_BATCH_SIZE);
    eventChunks.forEach((chunk) => {
      const batchEventResponse = generateBatch(eventSetId, chunk);
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

  const batchErrorRespList = [];
  const eventChunksArray = [];
  const { destination } = inputs[0];
  await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          eventChunksArray.push({
            message: event.message,
            metadata: event.metadata,
            destination,
          });
        } else {
          // if not transformed
          const procRespList = await process(event);
          const transformedPayload = procRespList.map((procResponse) => ({
            message: procResponse,
            metadata: event.metadata,
            destination,
          }));
          eventChunksArray.push(...transformedPayload);
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        batchErrorRespList.push(errRespEvent);
      }
    }),
  );

  let batchResponseList = [];
  if (eventChunksArray.length > 0) {
    batchResponseList = batchEvents(eventChunksArray);
  }

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
