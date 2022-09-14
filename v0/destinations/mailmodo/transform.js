const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  ConfigCategory,
  IDENTIFY_MAX_BATCH_SIZE,
  mappingConfig,
  BASE_URL
} = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  isDefinedAndNotNullAndNotEmpty,
  defaultPostRequestConfig,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");
const { deduceAddressFields } = require("./utils");

const responseBuilder = responseConfgs => {
  const { resp, apiKey, endpoint } = responseConfgs;

  const response = defaultRequestConfig();
  if (resp) {
    const responseBody = "JSON";
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      mmApiKey: `${apiKey}`,
      "Content-Type": "application/json"
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body[`${responseBody}`] = removeUndefinedAndNullValues(resp);
  }
  return response;
};

const identifyResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  let { listName } = Config;

  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.IDENTIFY.name]
  );

  if (!payload.email) {
    throw new CustomError("Email is required for identify call", 400);
  }
  if (isDefinedAndNotNullAndNotEmpty(message.address)) {
    const { address1, address2 } = deduceAddressFields(message);
    payload.data.address1 = address1;
    payload.data.address2 = address2;
  }
  if (typeof listName === "string" && listName.trim().length === 0) {
    listName = "rudderstack";
  }
  const valuesArray = [];
  valuesArray.push(payload);
  const resp = {};
  resp.values = valuesArray;

  const { endpoint } = ConfigCategory.IDENTIFY;

  const responseConfgs = {
    resp,
    apiKey,
    endpoint
  };
  return responseBuilder(responseConfgs);
};

const trackResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.TRACK.name]
  );

  const { endpoint } = ConfigCategory.TRACK;

  const responseConfgs = {
    payload,
    apiKey,
    endpoint
  };
  return responseBuilder(responseConfgs);
};

const processEvent = (message, destination) => {
  if (!destination.Config.apiKey) {
    throw new CustomError("API Key is not present. Aborting message.", 400);
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
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

function batchEvents(arrayChunks) {
  const batchedResponseList = [];

  // list of chunks [ [..], [..] ]
  arrayChunks.forEach(chunk => {
    const metadatas = [];
    const values = [];

    // extracting destination
    // from the first event in a batch
    const { destination } = chunk[0];
    const { apiKey, listName } = destination.Config;

    let batchEventResponse = defaultBatchRequestConfig();

    // Batch event into dest batch structure
    chunk.forEach(ev => {
      values.push(ev?.message?.body?.JSON?.values[0]);
      metadatas.push(ev.metadata);
    });
    // batching into identify batch structure
    batchEventResponse.batchedRequest.body.JSON = {
      listName: `${listName}`,
      values
    };
    batchEventResponse.batchedRequest.endpoint = `${BASE_URL}/addToList/batch`;

    batchEventResponse.batchedRequest.headers = {
      "Content-Type": "application/json",
      mmApiKey: apiKey
    };

    batchEventResponse = {
      ...batchEventResponse,
      metadata: metadatas,
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

function getEventChunks(event, identifyEventChunks, eventResponseList) {
  // Categorizing identify and track type of events
  // Checking if it is identify type event
  if (event.message.endpoint.includes("/addToList/batch")) {
    identifyEventChunks.push(event);
  } else {
    // any other type of event
    const { message, metadata, destination } = event;
    const endpoint = get(message, "endpoint");

    const batchedResponse = defaultBatchRequestConfig();
    batchedResponse.batchedRequest.headers = message.headers;
    batchedResponse.batchedRequest.endpoint = endpoint;
    batchedResponse.batchedRequest.body = message.body;
    batchedResponse.batchedRequest.params = message.params;
    batchedResponse.batchedRequest.method =
      defaultPostRequestConfig.requestMethod;
    batchedResponse.metadata = [metadata];
    batchedResponse.destination = destination;

    eventResponseList.push(
      getSuccessRespEvents(
        batchedResponse.batchedRequest,
        batchedResponse.metadata,
        batchedResponse.destination
      )
    );
  }
}

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  let identifyEventChunks = []; // list containing identify events in batched format
  const eventResponseList = []; // list containing other events in batched format
  const identifyArrayChunks = [];
  const errorRespList = [];
  Promise.all(
    inputs.map((event, index) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(event, identifyEventChunks, eventResponseList);
          // slice according to batch size
          if (
            identifyEventChunks.length &&
            (identifyEventChunks.length >= IDENTIFY_MAX_BATCH_SIZE ||
              index === inputs.length - 1)
          ) {
            identifyArrayChunks.push(identifyEventChunks);
            identifyEventChunks = [];
          }
        } else {
          // if not transformed
          getEventChunks(
            {
              message: process(event),
              metadata: event.metadata,
              destination: event.destination
            },
            identifyEventChunks,
            eventResponseList
          );

          // slice according to batch size
          if (
            identifyEventChunks.length &&
            (identifyEventChunks.length >= IDENTIFY_MAX_BATCH_SIZE ||
              index === inputs.length - 1)
          ) {
            identifyArrayChunks.push(identifyEventChunks);
            identifyEventChunks = [];
          }
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

  // batching identifyArrayChunks
  let identifyBatchedResponseList = [];

  if (identifyEventChunks.length) {
    identifyArrayChunks.push(identifyEventChunks);
    identifyEventChunks = [];
  }

  if (identifyArrayChunks.length) {
    identifyBatchedResponseList = batchEvents(identifyArrayChunks);
  }

  let batchedResponseList = [];
  // appending all kinds of batches
  batchedResponseList = batchedResponseList
    .concat(identifyBatchedResponseList)
    .concat(eventResponseList);

  //   console.log([...batchedResponseList, ...errorRespList]);
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
