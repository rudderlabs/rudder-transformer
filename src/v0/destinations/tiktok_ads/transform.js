/* eslint-disable camelcase */
const _ = require("lodash");
const { SHA256 } = require("crypto-js");
const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  CustomError,
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
  handleRtTfSingleEventError
} = require("../../util");
const {
  trackMapping,
  TRACK_ENDPOINT,
  BATCH_ENDPOINT,
  eventNameMapping,
  MAX_BATCH_SIZE,
  PARTNER_NAME
} = require("./config");

function checkIfValidPhoneNumber(str) {
  // Ref - https://ads.tiktok.com/marketing_api/docs?id=1727541103358977
  // Regular expression to check whether it has country code
  // but should not include +86
  const regexExp = /^(\+(?!86)\d{1,3})?\d{1,12}$/gi;

  return regexExp.test(str);
}

const getContents = message => {
  const contents = [];
  const { properties } = message;
  const { products } = properties;
  if (products && Array.isArray(products) && products.length > 0) {
    products.forEach(product => {
      const singleProduct = {};
      singleProduct.content_type =
        product.contentType ||
        properties.contentType ||
        product.content_type ||
        properties.content_type ||
        "product_group";
      singleProduct.content_id = product.product_id;
      singleProduct.content_category = product.category;
      singleProduct.content_name = product.name;
      singleProduct.price = product.price;
      singleProduct.quantity = product.quantity;
      singleProduct.description = product.description;
      contents.push(removeUndefinedAndNullValues(singleProduct));
    });
  }
  return contents;
};

const checkContentType = (contents, contentType) => {
  if (Array.isArray(contents)) {
    contents.forEach(content => {
      if (!content.content_type) {
        content.content_type = contentType || "product_group";
      }
    });
  }
  return contents;
};

const getTrackResponse = (message, Config, event) => {
  const pixel_code = Config.pixelCode;
  let payload = constructPayload(message, trackMapping);

  // if contents is not an array
  if (
    payload.properties?.contents &&
    !Array.isArray(payload.properties.contents)
  ) {
    payload.properties.contents = [payload.properties.contents];
  }

  if (
    payload.properties &&
    !payload.properties?.contents &&
    message.properties?.products
  ) {
    // retreiving data from products only when contents is not present
    payload.properties = {
      ...payload.properties,
      contents: getContents(message)
    };
  }

  if (payload.properties?.contents) {
    payload.properties.contents = checkContentType(
      payload.properties?.contents,
      message.properties?.contentType
    );
  }

  const externalId = getDestinationExternalID(message, "tiktokExternalId");
  if (isDefinedAndNotNullAndNotEmpty(externalId)) {
    set(payload, "context.user.external_id", externalId);
  }

  const traits = getFieldValueFromMessage(message, "traits");

  // taking user properties like email and phone from traits
  let email = get(payload, "context.user.email");
  if (!isDefinedAndNotNullAndNotEmpty(email) && traits?.email) {
    set(payload, "context.user.email", traits.email);
  }

  let phone_number = get(payload, "context.user.phone_number");
  if (!isDefinedAndNotNullAndNotEmpty(phone_number) && traits?.phone) {
    set(payload, "context.user.phone_number", traits.phone);
  }

  payload = { pixel_code, event, ...payload };

  /*
   * Hashing user related detail i.e external_id, email, phone_number
   */

  if (Config.hashUserProperties) {
    const external_id = get(payload, "context.user.external_id");
    if (isDefinedAndNotNullAndNotEmpty(external_id)) {
      payload.context.user.external_id = SHA256(external_id.trim()).toString();
    }

    email = get(payload, "context.user.email");
    if (isDefinedAndNotNullAndNotEmpty(email)) {
      payload.context.user.email = SHA256(
        email.trim().toLowerCase()
      ).toString();
    }

    phone_number = get(payload, "context.user.phone_number");
    if (isDefinedAndNotNullAndNotEmpty(phone_number)) {
      if (checkIfValidPhoneNumber(phone_number.trim())) {
        payload.context.user.phone_number = SHA256(
          phone_number.trim()
        ).toString();
      } else {
        throw new CustomError(
          "Invalid phone number. Include proper country code except +86 and the phone number length must be no longer than 15 digit. Aborting",
          400
        );
      }
    }
  }
  const response = defaultRequestConfig();
  response.headers = {
    "Access-Token": Config.accessToken,
    "Content-Type": "application/json"
  };

  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = TRACK_ENDPOINT;
  // add partner name
  response.body.JSON = removeUndefinedAndNullValues({
    ...payload,
    partner_name: PARTNER_NAME
  });
  return response;
};

const trackResponseBuilder = async (message, { Config }) => {
  const { eventsToStandard } = Config;

  let event = message.event?.toLowerCase().trim();
  if (!event) {
    throw new CustomError("Event name is required", 400);
  }

  const standardEventsMap = getHashFromArrayWithDuplicate(eventsToStandard);

  if (eventNameMapping[event] === undefined && !standardEventsMap[event]) {
    throw new CustomError(`Event name (${event}) is not valid`, 400);
  }

  const responseList = [];
  if (standardEventsMap[event]) {
    Object.keys(standardEventsMap).forEach(key => {
      if (key === event) {
        standardEventsMap[event].forEach(eventName => {
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

const process = async event => {
  const { message, destination } = event;

  if (!destination.Config.accessToken) {
    throw new CustomError("Access Token not found. Aborting ", 400);
  }

  if (!destination.Config.pixelCode) {
    throw new CustomError("Pixel Code not found. Aborting", 400);
  }

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

function batchEvents(eventsChunk) {
  const batchedResponseList = [];
  // arrayChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // transformed payload of (n) batch size
  const arrayChunks = _.chunk(eventsChunk, MAX_BATCH_SIZE);

  arrayChunks.forEach(chunk => {
    const batchResponseList = [];
    const metadata = [];

    // extracting destination
    // from the first event in a batch
    const { destination } = chunk[0];
    const { accessToken, pixelCode } = destination.Config;

    let batchEventResponse = defaultBatchRequestConfig();

    // Batch event into dest batch structure
    chunk.forEach(ev => {
      // Pixel code must be added above "batch": [..]
      delete ev.message.body.JSON.pixel_code;
      // Partner name must be added above "batch": [..]
      delete ev.message.body.JSON.partner_name;
      ev.message.body.JSON.type = "track";
      batchResponseList.push(ev.message.body.JSON);
      metadata.push(ev.metadata);
    });

    batchEventResponse.batchedRequest.body.JSON = {
      pixel_code: pixelCode,
      partner_name: PARTNER_NAME,
      batch: batchResponseList
    };

    batchEventResponse.batchedRequest.endpoint = BATCH_ENDPOINT;
    batchEventResponse.batchedRequest.headers = {
      "Access-Token": accessToken,
      "Content-Type": "application/json"
    };
    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true
      )
    );
  });

  return batchedResponseList;
}

function getEventChunks(event, trackResponseList, eventsChunk) {
  // only for already transformed payload
  // eslint-disable-next-line no-param-reassign
  event.message = Array.isArray(event.message)
    ? event.message
    : [event.message];

  event.message.forEach(element => {
    // Do not apply batching if the payload contains test_event_code
    // which corresponds to track endpoint
    if (element.body.JSON.test_event_code) {
      const message = element;
      const { metadata, destination } = event;
      const endpoint = get(message, "endpoint");
      delete message.body.JSON.type;

      const batchedResponse = defaultBatchRequestConfig();
      batchedResponse.batchedRequest.headers = message.headers;
      batchedResponse.batchedRequest.endpoint = endpoint;
      batchedResponse.batchedRequest.body = message.body;
      batchedResponse.batchedRequest.params = message.params;
      batchedResponse.batchedRequest.method =
        defaultPostRequestConfig.requestMethod;
      batchedResponse.metadata = [metadata];
      batchedResponse.destination = destination;

      trackResponseList.push(
        getSuccessRespEvents(
          batchedResponse.batchedRequest,
          batchedResponse.metadata,
          batchedResponse.destination
        )
      );
    } else {
      eventsChunk.push({
        message: element,
        metadata: event.metadata,
        destination: event.destination
      });
    }
  });
}

const processRouterDest = async inputs => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs, "TIKTOK_ADS");
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const trackResponseList = []; // list containing single track event in batched format
  const eventsChunk = []; // temporary variable to divide payload into chunks
  const errorRespList = [];
  await Promise.all(
    inputs.map(async event => {
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
              destination: event.destination
            },
            trackResponseList,
            eventsChunk
          );
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(
          event,
          error,
          "TIKTOK_ADS"
        );
        errorRespList.push(errRespEvent);
      }
    })
  );

  let batchedResponseList = [];
  if (eventsChunk.length) {
    batchedResponseList = await batchEvents(eventsChunk);
  }
  return [...batchedResponseList.concat(trackResponseList), ...errorRespList];
};

module.exports = { process, processRouterDest };
