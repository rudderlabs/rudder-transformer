const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  getValueFromMessage,
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  returnArrayOfSubarrays,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
  TransformationError
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
    throw new TransformationError("event is required for track call");
  }
  event = event.trim().toLowerCase();
  let payload = constructPayload(message, trackMapping);
  const eventMapping = eventTypeMapping(Config);
  payload.eventName = event;
  payload.eventType =
    getValueFromMessage(message, "properties.eventType") || eventMapping[event];

  if (!payload.eventType) {
    throw new TransformationError("eventType is mandatory for track call");
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
        throw new TransformationError(
          "length of objectId and position should be equal"
        );
      }
    }
  }
  // for all events either filter or objectID should be there
  if (!payload.filters && !payload.objectIDs) {
    throw new TransformationError("Either filters or  objectIds is required.");
  }
  if (payload.filters && payload.objectIDs) {
    throw new TransformationError(
      "event can't have both objectIds and filters at the same time."
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
    throw new TransformationError(
      "message Type is not present. Aborting message."
    );
  }

  if (!destination.Config.apiKey) {
    throw new TransformationError("Invalid Api Key");
  }
  if (!destination.Config.applicationId) {
    throw new TransformationError("Invalid Application Id");
  }
  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new TransformationError(
        `message type ${messageType} not supported`
      );
  }
  return response;
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    throw new TransformationError("Invalid event array");
  }

  const inputChunks = returnArrayOfSubarrays(inputs, MAX_BATCH_SIZE);
  const successList = [];
  const errorList = [];
  inputChunks.forEach(chunk => {
    const eventsList = [];
    const metadataList = [];

    // using the first destination Config in chunk for
    // transforming the events in one chunk into a batch
    const { destination } = chunk[0];
    chunk.forEach(async input => {
      try {
        set(input, "destination", destination);
        // input.destination = destination;
        const transformedEvent = process(input);
        eventsList.push(...transformedEvent.body.JSON.events);
        metadataList.push(input.metadata);
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(
          input,
          error,
          "ALGOLIA"
        );
        errorList.push(errRespEvent);
      }
    });

    if (eventsList.length !== 0) {
      // setting up the batched request json here
      const batchedRequest = defaultRequestConfig();
      batchedRequest.endpoint = ENDPOINT;
      batchedRequest.headers = {
        "X-Algolia-Application-Id": destination.Config.applicationId,
        "X-Algolia-API-Key": destination.Config.apiKey
      };
      batchedRequest.body.JSON = { events: eventsList };

      successList.push(
        getSuccessRespEvents(batchedRequest, metadataList, destination, true)
      );
    }
  });
  return [...errorList, ...successList];
};

module.exports = { process, processRouterDest };
