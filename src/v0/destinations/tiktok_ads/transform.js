/* eslint-disable camelcase */
const _ = require('lodash');
const { SHA256 } = require('crypto-js');
const get = require('get-value');
const set = require('set-value');
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
  getFieldValueFromMessage,
  getHashFromArrayWithDuplicate,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
  batchMultiplexedEvents,
} = require('../../util');
const {
  trackMapping,
  TRACK_ENDPOINT,
  BATCH_ENDPOINT,
  eventNameMapping,
  MAX_BATCH_SIZE,
  PARTNER_NAME,
} = require('./config');
const { ConfigurationError, InstrumentationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const USER_EMAIL_KEY_PATH = 'context.user.email';
const USER_PHONE_NUMBER_KEY_PATH = 'context.user.phone_number';

const getContents = (message) => {
  const contents = [];
  const { properties } = message;
  const { products, content_type, contentType } = properties;
  if (products && Array.isArray(products) && products.length > 0) {
    products.forEach((product) => {
      const singleProduct = {
        content_type:
          product.contentType || contentType || product.content_type || content_type || 'product',
        content_id: product.product_id,
        content_category: product.category,
        content_name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
      };
      contents.push(removeUndefinedAndNullValues(singleProduct));
    });
  }
  return contents;
};

const checkContentType = (contents, contentType) => {
  if (Array.isArray(contents)) {
    contents.forEach((content) => {
      if (!content.content_type) {
        // eslint-disable-next-line no-param-reassign
        content.content_type = contentType || 'product_group';
      }
    });
  }
  return contents;
};

const getTrackResponse = (message, Config, event) => {
  const pixel_code = Config.pixelCode;
  let payload = constructPayload(message, trackMapping);

  // if contents is not an array
  if (payload.properties?.contents && !Array.isArray(payload.properties.contents)) {
    payload.properties.contents = [payload.properties.contents];
  }

  if (payload.properties && !payload.properties?.contents && message.properties?.products) {
    // retreiving data from products only when contents is not present
    payload.properties = {
      ...payload.properties,
      contents: getContents(message),
    };
  }

  if (payload.properties?.contents) {
    payload.properties.contents = checkContentType(
      payload.properties?.contents,
      message.properties?.contentType,
    );
  }

  const externalId = getDestinationExternalID(message, 'tiktokExternalId');
  if (isDefinedAndNotNullAndNotEmpty(externalId)) {
    set(payload, 'context.user.external_id', externalId);
  }

  const traits = getFieldValueFromMessage(message, 'traits');

  // taking user properties like email and phone from traits
  let email = get(payload, USER_EMAIL_KEY_PATH);
  if (!isDefinedAndNotNullAndNotEmpty(email) && traits?.email) {
    set(payload, USER_EMAIL_KEY_PATH, traits.email);
  }

  let phone_number = get(payload, USER_PHONE_NUMBER_KEY_PATH);
  if (!isDefinedAndNotNullAndNotEmpty(phone_number) && traits?.phone) {
    set(payload, USER_PHONE_NUMBER_KEY_PATH, traits.phone);
  }

  payload = { pixel_code, event, ...payload };

  /*
   * Hashing user related detail i.e external_id, email, phone_number
   */

  if (Config.hashUserProperties) {
    const external_id = get(payload, 'context.user.external_id');
    if (isDefinedAndNotNullAndNotEmpty(external_id)) {
      payload.context.user.external_id = SHA256(external_id.trim()).toString();
    }

    email = get(payload, USER_EMAIL_KEY_PATH);
    if (isDefinedAndNotNullAndNotEmpty(email)) {
      payload.context.user.email = SHA256(email.trim().toLowerCase()).toString();
    }

    phone_number = get(payload, USER_PHONE_NUMBER_KEY_PATH);
    if (isDefinedAndNotNullAndNotEmpty(phone_number)) {
      payload.context.user.phone_number = SHA256(phone_number.trim()).toString();
    }
  }
  const response = defaultRequestConfig();
  response.headers = {
    'Access-Token': Config.accessToken,
    'Content-Type': JSON_MIME_TYPE,
  };

  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = TRACK_ENDPOINT;
  // add partner name
  response.body.JSON = removeUndefinedAndNullValues({
    ...payload,
    partner_name: PARTNER_NAME,
  });
  return response;
};

const trackResponseBuilder = async (message, { Config }) => {
  const { eventsToStandard } = Config;

  let event = message.event?.toLowerCase().trim();
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }

  const standardEventsMap = getHashFromArrayWithDuplicate(eventsToStandard);

  if (eventNameMapping[event] === undefined && !standardEventsMap[event]) {
    throw new InstrumentationError(
      `Event name (${event}) is not valid, must be mapped to one of standard events`,
    );
  }

  const responseList = [];
  if (standardEventsMap[event]) {
    Object.keys(standardEventsMap).forEach((key) => {
      if (key === event) {
        standardEventsMap[event].forEach((eventName) => {
          responseList.push(getTrackResponse(message, Config, eventName));
        });
      }
    });
  } else {
    event = eventNameMapping[event];
    responseList.push(getTrackResponse(message, Config, event));
  }

  return responseList;
};

const process = async (event) => {
  const { message, destination } = event;

  if (!destination.Config.accessToken) {
    throw new ConfigurationError('Access Token not found. Aborting ');
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

function batchEvents(eventsChunk) {
  const { destination, events } = eventsChunk;
  const { accessToken, pixelCode } = destination.Config;
  const { batchedRequest } = defaultBatchRequestConfig();

  const batchResponseList = [];
  events.forEach((transformedEvent) => {
    // extracting destination
    // from the first event in a batch
    const cloneTransformedEvent = _.clone(transformedEvent);
    delete cloneTransformedEvent.body.JSON.pixel_code;
    // Partner name must be added above "batch": [..]
    delete cloneTransformedEvent.body.JSON.partner_name;
    cloneTransformedEvent.body.JSON.type = 'track';
    batchResponseList.push(cloneTransformedEvent.body.JSON);
  });

  batchedRequest.body.JSON = {
    pixel_code: pixelCode,
    partner_name: PARTNER_NAME,
    batch: batchResponseList,
  };

  batchedRequest.endpoint = BATCH_ENDPOINT;
  batchedRequest.headers = {
    'Access-Token': accessToken,
    'Content-Type': 'application/json',
  };

  return batchedRequest;
}

function getEventChunks(event, trackResponseList, eventsChunk) {
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
}

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
