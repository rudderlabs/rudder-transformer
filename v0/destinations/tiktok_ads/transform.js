/* eslint-disable camelcase */
const { SHA256 } = require("crypto-js");
const get = require("get-value");
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
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");
const {
  trackMapping,
  TRACK_ENDPOINT,
  BATCH_ENDPOINT,
  eventNameMapping,
  MAX_BATCH_SIZE
} = require("./config");

function checkIfValidSHA256(str) {
  // Regular expression to check if string is a SHA256 hash
  const regexExp = /^[a-f0-9]{64}$/gi;

  return regexExp.test(str);
}

function checkIfValidPhoneNumber(str) {
  // Ref - https://ads.tiktok.com/marketing_api/docs?id=1701890979375106
  // Regular expression to check whether it has country code
  // but should not include +86
  const regexExp = /^(\+(?!86)\d{1,3}){0,1}[0-9]{10}$/gi;

  return regexExp.test(str);
}

const trackResponseBuilder = async (message, { Config }) => {
  const pixel_code = Config.pixelCode;

  let event = get(message, "event").toLowerCase();
  if (!event) {
    throw new CustomError("Event name is required", 400);
  }

  if (eventNameMapping[event] === undefined) {
    throw new CustomError(`Event name (${event}) is not valid`, 400);
  }
  event = eventNameMapping[event];

  let payload = constructPayload(message, trackMapping);
  payload = { pixel_code, event, ...payload };

  /*
   * Hashing user related detail i.e external_id, email, phone_number
   */

  const external_id = payload.context.user.external_id.trim();
  if (
    isDefinedAndNotNullAndNotEmpty(external_id) &&
    !checkIfValidSHA256(external_id)
  ) {
    payload.context.user.external_id = SHA256(external_id).toString();
  }

  const email = payload.context.user.email.trim().toLowerCase();
  if (isDefinedAndNotNullAndNotEmpty(email) && !checkIfValidSHA256(email)) {
    payload.context.user.email = SHA256(email).toString();
  }

  const phone_number = payload.context.user.phone_number.trim();
  if (
    isDefinedAndNotNullAndNotEmpty(phone_number) &&
    !checkIfValidSHA256(phone_number)
  ) {
    if (checkIfValidPhoneNumber(phone_number)) {
      payload.context.user.phone_number = SHA256(phone_number).toString();
    } else {
      throw new CustomError(
        "Invalid phone number. Include proper country code except +86. Aborting ",
        400
      );
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

function batchEvents(destEvents) {
  const batchedResponseList = [];
  const trackResponseList = [];
  let eventsChunk = [];
  const arrayChunks = [];
  destEvents.forEach((event, index) => {
    // handler for track call
    // if test_event_code is present then do not batch
    if (event.message.body.JSON.test_event_code) {
      const { message, metadata, destination } = event;
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
      eventsChunk.push(event);
    }
    if (
      eventsChunk.length &&
      (eventsChunk.length === MAX_BATCH_SIZE || index === destEvents.length - 1)
    ) {
      arrayChunks.push(eventsChunk);
      eventsChunk = [];
    }
  });

  // list of chunks [ [..], [..] ]
  arrayChunks.forEach(chunk => {
    const batchResponseList = [];
    const metadata = [];

    // extracting destination
    // from the first event in a batch
    const { destination } = chunk[0];
    const { accessToken, pixelCode } = destination.Config;

    let batchEventResponse = defaultBatchRequestConfig();

    chunk.forEach(ev => {
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

  return batchedResponseList.concat(trackResponseList);
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const successRespList = [];
  const errorRespList = [];
  await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          successRespList.push({
            message: input.message,
            metadata: input.metadata,
            destination: input.destination
          });
        } else {
          // if not transformed
          successRespList.push({
            message: await process(input),
            metadata: input.metadata,
            destination: input.destination
          });
        }
      } catch (error) {
        errorRespList.push(
          getErrorRespEvents(
            [input.metadata],
            error.response ? error.response.status : 400,
            error.message || "Error occurred while processing payload."
          )
        );
      }
    })
  );

  let batchedResponseList = [];
  if (successRespList.length) {
    batchedResponseList = await batchEvents(successRespList);
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
