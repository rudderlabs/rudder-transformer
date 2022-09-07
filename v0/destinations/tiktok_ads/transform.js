/* eslint-disable camelcase */
const _ = require("lodash");
const { SHA256 } = require("crypto-js");
const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  getErrorRespEvents,
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
  getHashFromArrayWithDuplicate
} = require("../../util");
const {
  trackMapping,
  TRACK_ENDPOINT,
  BATCH_ENDPOINT,
  eventNameMapping,
  MAX_BATCH_SIZE
} = require("./config");

function checkIfValidPhoneNumber(str) {
  // Ref - https://ads.tiktok.com/marketing_api/docs?id=1701890979375106
  // Regular expression to check whether it has country code
  // but should not include +86
  const regexExp = /^(\+(?!86)\d{1,3}){0,1}[0-9]{10}$/gi;

  return regexExp.test(str);
}

const getTrackResponse = (message, Config, event) => {
  const pixel_code = Config.pixelCode;
  let payload = constructPayload(message, trackMapping);

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
          "Invalid phone number. Include proper country code except +86. Aborting ",
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
  response.body.JSON = removeUndefinedAndNullValues(payload);

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
      ev.message.body.JSON.type = "track";
      batchResponseList.push(ev.message.body.JSON);
      metadata.push(ev.metadata);
    });

    batchEventResponse.batchedRequest.body.JSON = {
      pixel_code: pixelCode,
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
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
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
        errorRespList.push(
          getErrorRespEvents(
            [event.metadata],
            error.response ? error.response.status : 400,
            error.message || "Error occurred while processing payload."
          )
        );
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
