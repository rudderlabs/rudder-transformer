/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
const _ = require('lodash');
const set = require('set-value');
const { ConfigurationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultBatchRequestConfig,
  getSuccessRespEvents,
  isDefinedAndNotNullAndNotEmpty,
  getDestinationExternalID,
  getHashFromArrayWithDuplicate,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
  batchMultiplexedEvents,
} = require('../../util');
const { getContents, hashUserField } = require('./util');
const {
  trackMappingV2,
  trackEndpointV2,
  BATCH_ENDPOINT,
  eventNameMapping,
  MAX_BATCH_SIZE,
  PARTNER_NAME,
  maxBatchSizeV2,
} = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * Generated track payload for an event using TikTokTrackV2.json config mapping,
 * hashing user properties and
 * defining contents from products
 * @param {*} message
 * @param {*} Config
 * @param {*} event
 * @returns track payload
 */
const getTrackResponsePayload = (message, Config, event) => {
  const payload = constructPayload(message, trackMappingV2);

  // if contents is not an array converting it into array
  if (payload.properties?.contents && !Array.isArray(payload.properties.contents)) {
    payload.properties.contents = [payload.properties.contents];
  }

  // if contents is not present but we have properties.products present which has fields with superset of contents fields
  if (payload.properties && !payload.properties?.contents && message.properties?.products) {
    // retreiving data from products only when contents is not present
    payload.properties.contents = getContents(message, false);
  }

  // getting externalId and hashing it and storing it in
  const externalId = getDestinationExternalID(message, 'tiktokExternalId');
  if (isDefinedAndNotNullAndNotEmpty(externalId)) {
    set(payload, 'user.external_id', externalId);
  }
  if (Config.hashUserProperties && isDefinedAndNotNullAndNotEmpty(payload.user)) {
    payload.user = hashUserField(payload.user);
  }
  payload.event = event;
  payload.partner_name = PARTNER_NAME;
  // add partner name and return payload
  return removeUndefinedAndNullValues(payload);
};

const trackResponseBuilder = async (message, { Config }) => {
  const { eventsToStandard, sendCustomEvents, accessToken, pixelCode } = Config;

  let event = message.event?.toLowerCase().trim();
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }

  const standardEventsMap = getHashFromArrayWithDuplicate(eventsToStandard);

  if (!sendCustomEvents && eventNameMapping[event] === undefined && !standardEventsMap[event]) {
    throw new InstrumentationError(
      `Event name (${event}) is not valid, must be mapped to one of standard events`,
    );
  }
  const response = defaultRequestConfig();
  response.headers = {
    'Access-Token': accessToken,
    'Content-Type': JSON_MIME_TYPE,
  };
  // tiktok doc for request: https://business-api.tiktok.com/portal/docs?id=1771100865818625
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = trackEndpointV2;
  const responseList = [];
  if (standardEventsMap[event]) {
    Object.keys(standardEventsMap).forEach((key) => {
      if (key === event) {
        standardEventsMap[event].forEach((eventName) => {
          responseList.push(getTrackResponsePayload(message, Config, eventName));
        });
      }
    });
  } else {
    /* 
    For custom event we do not want to lower case the event or trim it we just want to send those as it is
    Doc https://ads.tiktok.com/help/article/standard-events-parameters?lang=en
    */
    event = eventNameMapping[event] || message.event;
    // if there exists no event mapping we will build payload with custom event recieved
    responseList.push(getTrackResponsePayload(message, Config, event));
  }
  // set event source and event_source_id
  response.body.JSON = { event_source: 'web', event_source_id: pixelCode };
  response.body.JSON.data = responseList;
  return response;
};

const process = async (event) => {
  const { message, destination } = event;

  if (!destination.Config.accessToken) {
    throw new ConfigurationError('Access Token not found. Aborting');
  }

  if (!destination.Config.pixelCode) {
    throw new ConfigurationError('Pixel Code not found. Aborting');
  }

  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();

  let response;
  if (messageType === EventType.TRACK) {
    response = await trackResponseBuilder(message, destination);
  } else {
    throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const batchEvents = (eventsChunk) => {
  const { destination, events } = eventsChunk;
  const { accessToken, pixelCode } = destination.Config;
  const { batchedRequest } = defaultBatchRequestConfig();

  const batchResponseList = [];
  events.forEach((transformedEvent) => {
    // extracting destination
    // from the first event in a batch
    const cloneTransformedEvent = _.clone(transformedEvent);
    delete cloneTransformedEvent.body.JSON.pixelCode;
    // Partner name must be added above "batch": [..]
    delete cloneTransformedEvent.body.JSON.partner_name;
    cloneTransformedEvent.body.JSON.type = 'track';
    batchResponseList.push(cloneTransformedEvent.body.JSON);
  });

  batchedRequest.body.JSON = {
    pixelCode: pixelCode,
    partner_name: PARTNER_NAME,
    batch: batchResponseList,
  };

  batchedRequest.endpoint = BATCH_ENDPOINT;
  batchedRequest.headers = {
    'Access-Token': accessToken,
    'Content-Type': 'application/json',
  };

  return batchedRequest;
};

const getEventChunks = (event, trackResponseList, eventsChunk) => {
  // only for already transformed payload
  // eslint-disable-next-line no-param-reassign
  event.message = Array.isArray(event.message) ? event.message : [event.message];

  if (event.message[0].body.JSON.test_event_code) {
    const { metadata, destination, message } = event;
    trackResponseList.push(getSuccessRespEvents(message, [metadata], destination));
  } else {
    eventsChunk.push({
      message: event.message,
      metadata: event.metadata,
      destination: event.destination,
    });
  }
};

const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const trackResponseList = []; // list containing single track event in batched format
  const eventsChunk = []; // temporary variable to divide payload into chunks
  const errorRespList = [];
  await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(event, trackResponseList, eventsChunk);
        } else {
          // if not transformed
          getEventChunks(
            {
              message: await process(event),
              metadata: event.metadata,
              destination: event.destination,
            },
            trackResponseList,
            eventsChunk,
          );
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        errorRespList.push(errRespEvent);
      }
    }),
  );

  const batchedResponseList = [];
  if (eventsChunk.length > 0) {
    const batchedEvents = batchMultiplexedEvents(eventsChunk, MAX_BATCH_SIZE);
    batchedEvents.forEach((batch) => {
      const batchedRequest = batchEvents(batch);
      batchedResponseList.push(
        getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
      );
    });
  }
  return [...batchedResponseList.concat(trackResponseList), ...errorRespList];
};

module.exports = { process, processRouterDest };
