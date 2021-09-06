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

const { ENDPOINT, MAX_BATCH_SIZE, trackMapping } = require("./config");

const {
  genericpayloadValidator,
  createObjectArray,
  eventTypeMapping,
  clickPayloadValidator
} = require("./util");

const trackResponseBuilder = (message, { Config }) => {
  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("event is required for track call", 400);
  }
  event = event.trim().toLowerCase();
  let payload = constructPayload(message, trackMapping);
  const eventMapping = eventTypeMapping(Config);
  payload.eventName = event;
  if (eventMapping[event]) {
    payload.eventType = eventMapping[event];
  }
  if (!payload.eventType) {
    throw new CustomError("eventType is mandatory for track call", 400);
  }
  payload = genericpayloadValidator(payload);

  if (event === "product list viewed" || event === "order completed") {
    const products = getValueFromMessage(message, "properties.products");
    if (products) {
      const { objectList, positionList } = createObjectArray(
        products,
        payload.eventType
      );
      const objLen = objectList.length;
      const posLen = positionList.length;
      if (objLen > 0) {
        payload.objectIDs = objectList;
        payload.objectIDs.splice(20);
      }
      if (posLen > 0) {
        payload.positions = positionList;
        payload.positions.splice(20);
      }
      // making size of object list and position list equal
      if (posLen > 0 && objLen > 0 && posLen !== objLen) {
        throw new CustomError(
          "length of objectId and position should be equal ",
          400
        );
      }
    }
  }
  // for all events either filter or objectID should be there
  if (!payload.filters && !payload.objectIDs) {
    throw new CustomError("Either filters or  objectIds is required.", 400);
  }
  if (payload.filters && payload.objectIDs) {
    throw new CustomError(
      "event can’t have both objectIds and filters at the same time.",
      400
    );
  }
  if (payload.eventType === "click") {
    payload = clickPayloadValidator(payload); // click event validator
  }
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = { events: [removeUndefinedAndNullValues(payload)] };
  response.endpoint = ENDPOINT;
  response.headers = {
    "X-Algolia-Application-Id": Config.applicationId,
    "X-Algolia-API-Key": Config.apiKey
  };
  return response;
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
  if (!destination.Config.applicationId) {
    throw new CustomError("Invalid Application Id", 400);
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

    // extracting the apiKey, applicationId and destination value
    // from the first event in a batch
    const { destination } = chunk[0];
    const { apiKey, applicationId } = destination.Config;
    let batchEventResponse = defaultBatchRequestConfig();

    chunk.forEach(ev => {
      respList.push(ev.message.body.JSON.events[0]);
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
