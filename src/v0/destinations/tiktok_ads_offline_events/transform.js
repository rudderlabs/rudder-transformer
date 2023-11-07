const { SHA256 } = require('crypto-js');
const set = require('set-value');
const lodash = require('lodash');
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
  batchMultiplexedEvents,
} = require('../../util');
const {
  CONFIG_CATEGORIES,
  MAX_BATCH_SIZE,
  MAPPING_CONFIG,
  EVENT_NAME_MAPPING,
  PARTNER_NAME,
} = require('./config');
const { ConfigurationError, InstrumentationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

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

  const email = message.traits?.email || message.context?.traits?.email;
  let emails;
  if (isDefinedAndNotNullAndNotEmpty(email)) {
    if (Array.isArray(email)) {
      emails = email.map((em) =>
        hashUserProperties ? SHA256(em.trim().toLowerCase()).toString() : em.trim().toLowerCase(),
      );
    } else {
      emails = hashUserProperties
        ? [SHA256(email.trim().toLowerCase()).toString()]
        : [email.trim().toLowerCase()];
    }
    set(payload, 'context.user.emails', emails);
  }

  const phoneNumber = message.traits?.phone || message.context?.traits?.phone;
  let phoneNumbers;
  if (isDefinedAndNotNullAndNotEmpty(phoneNumber)) {
    if (Array.isArray(phoneNumber)) {
      phoneNumbers = phoneNumber.map((pn) =>
        hashUserProperties ? SHA256(pn.trim().toLowerCase()).toString() : pn.trim().toLowerCase(),
      );
    } else {
      phoneNumbers = hashUserProperties
        ? [SHA256(phoneNumber.trim()).toString()]
        : [phoneNumber.trim()];
    }
    set(payload, 'context.user.phone_numbers', phoneNumbers);
  }

  const response = defaultRequestConfig();
  response.headers = {
    'Access-Token': accessToken,
    'Content-Type': JSON_MIME_TYPE,
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
  if (messageType === EventType.TRACK) {
    response = trackResponseBuilder(message, CONFIG_CATEGORIES.TRACK, destination);
  } else {
    throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const createBatch = (events, eventSetId, destination) => {
  const batchPayload = [];
  const { batchedRequest } = defaultBatchRequestConfig();
  events.forEach((ev) => {
    batchPayload.push(ev.body.JSON);
  });
  batchedRequest.body.JSON = {
    event_set_id: eventSetId,
    partner_name: PARTNER_NAME,
    batch: batchPayload,
  };

  batchedRequest.endpoint = CONFIG_CATEGORIES.TRACK.batchEndpoint;

  const { accessToken } = destination.Config;

  batchedRequest.headers = {
    'Access-Token': accessToken,
    'Content-Type': JSON_MIME_TYPE,
  };
  return batchedRequest;
};

const generateBatch = (batch, eventSetId) => {
  // extracting destination from the first event in a batch
  const { destination, events } = batch;
  // Batch event into dest batch structure
  if (Array.isArray(events[0])) {
    const batchedRequests = [];
    events.forEach((event) => {
      batchedRequests.push(createBatch(event, eventSetId, destination));
    });
    return batchedRequests;
  }
  return createBatch(events, eventSetId, destination);
};
const batchEvents = (eventChunksArray) => {
  // {
  //    event_set_id1: [...events]
  //    event_set_id2: [...events]
  // }
  const groupedEventChunks = lodash.groupBy(eventChunksArray, ({ message }) => {
    if (Array.isArray(message)) return message[0].event_set_id;
    return message.event_set_id;
  });
  return groupedEventChunks;
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
          const transformedPayload = {
            message: procRespList,
            metadata: event.metadata,
            destination,
          };
          eventChunksArray.push(transformedPayload);
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        batchErrorRespList.push(errRespEvent);
      }
    }),
  );
  const batchedResponseList = [];
  const chunksOnEventSetId = batchEvents(eventChunksArray);
  Object.keys(chunksOnEventSetId).forEach((eventSetId) => {
    if (chunksOnEventSetId[eventSetId].length > 0) {
      const batchedEvents = batchMultiplexedEvents(chunksOnEventSetId[eventSetId], MAX_BATCH_SIZE);
      batchedEvents.forEach((batch) => {
        const batchedRequest = generateBatch(batch, eventSetId);
        batchedResponseList.push(
          getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
        );
      });
    }
  });

  return [...batchedResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
