const logger = require("../../../logger");
const { EventType } = require("../../../constants");
const {
  CustomError,
  getValueFromMessage,
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  returnArrayOfSubarrays,
  defaultBatchRequestConfig
} = require("../../util/index");

const {
  ENDPOINT,
  MAX_BATCH_SIZE,
  EVENT_TYPE,
  trackMapping
} = require("./config");

const { payloadValidator, createObjectArray } = require("./util");

const trackResponseBuilder = (message, { Config }) => {
  const event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("Event name is required for track call.", 400);
  }
  let payload = constructPayload(message, trackMapping);
  payload.eventName = event;
  payload.eventType = payload.eventType.trim().toLowerCase();
  if (!EVENT_TYPE.includes(payload.eventType)) {
    throw new CustomError(
      "eventType should be either click, conversion or view.",
      400
    );
  }
  payload = payloadValidator(payload);
  if (payload.filters && payload.filters.length > 10) {
    payload.filters.splice(10);
  }

  const products = getValueFromMessage(message, "properties.products");
  if (products) {
    const { objectList, positionList } = createObjectArray(
      products,
      payload.eventType
    );
    const objLen = objectList.length;
    const posLen = positionList.length;
    if (objectList && objLen > 0) {
      payload.objectIDs = objectList;
      payload.objectIDs.splice(20);
    }
    if (positionList && posLen > 0) {
      payload.positions = positionList;
      payload.positions.splice(20);
    }
    // making size of object list and position list equal
    if (positionList && objectList && posLen > 0 && objLen > 0) {
      if (posLen !== objLen) {
        const minSize = posLen > objLen ? objLen : posLen;
        payload.positions.splice(minSize);
        payload.objectIDs.splice(minSize);
      }
    }
  }
  if (
    payload.positions &&
    !Array.isArray(payload.positions) &&
    typeof payload.positions[0] !== "number"
  ) {
    payload.positions = null;
    logger.error("positions should be an array of integers.");
  }
  // click event validator
  if (payload.eventType === "click" && !payload.filters) {
    if (payload.positions || payload.queryID) {
      if (!payload.positions) {
        throw new CustomError(
          "positions is required with objectId when queryId is provided.",
          400
        );
      }
      if (!payload.queryID) {
        throw new CustomError(
          "queryId is required with in click event when positions is provided.",
          400
        );
      }
    }
  }

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.endpoint = ENDPOINT;
  response.headers = {
    "X-Algolia-Application-Id": Config.applicationId,
    "X-Algolia-API-Key": Config.apiKey
  };
};

const process = event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "message Type is not present. Aborting message.",
      400
    );
  }

  if (!destination.Config.apiKey) {
    throw new CustomError("Invalid Api Key", 400);
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  return response;
};

const batch = destEvents => {
  const batchedResponse = [];
  const arrayChunks = returnArrayOfSubarrays(destEvents, MAX_BATCH_SIZE);

  arrayChunks.forEach(chunk => {
    const respList = [];
    const metadata = [];

    // extracting the apiKey and destination value
    // from the first event in a batch
    const { destination } = chunk[0];
    const { apiKey, applicationId } = destination.Config;
    let batchEventResponse = defaultBatchRequestConfig();

    chunk.forEach(ev => {
      respList.push(ev.message.body.JSON[0]);
      metadata.push(ev.metadata);
    });

    batchEventResponse.batchedRequest.body.JSON = { events: respList };
    batchEventResponse.batchedRequest.endpoint = ENDPOINT;
    batchEventResponse.batchedRequest.headers = {
      "X-Algolia-Application-Id": applicationId,
      "X-Algolia-API-Key": apiKey
    };
    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination
    };
    batchedResponse.push(batchEventResponse);
  });

  return batchedResponse;
};

module.exports = { process, batch };
