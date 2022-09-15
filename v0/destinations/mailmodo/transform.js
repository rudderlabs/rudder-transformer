const _ = require("lodash");
const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  ConfigCategory,
  IDENTIFY_MAX_BATCH_SIZE,
  mappingConfig,
  BASE_URL,
  DESTINATION
} = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents,
  generateErrorObject
} = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { deduceAddressFields } = require("./utils");

const responseBuilder = responseConfgs => {
  const { resp, apiKey, endpoint } = responseConfgs;

  const response = defaultRequestConfig();
  if (resp) {
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      mmApiKey: `${apiKey}`,
      "Content-Type": "application/json"
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(resp);
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

  const { address1, address2 } = deduceAddressFields(message);
  if (address1) payload.data.address1 = address1;
  if (address2) payload.data.address2 = address2;

  if (typeof listName === "string" && listName.trim().length === 0) {
    listName = "Rudderstack";
  }

  const valuesArray = [payload];
  const resp = { values: valuesArray, listName };

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
  const resp = constructPayload(
    message,
    mappingConfig[ConfigCategory.TRACK.name]
  );

  const { endpoint } = ConfigCategory.TRACK;

  const responseConfgs = {
    resp,
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

function batchEvents(eventsChunk) {
  const batchedResponseList = [];

  const arrayChunks = _.chunk(eventsChunk, IDENTIFY_MAX_BATCH_SIZE);

  // list of chunks [ [..], [..] ]
  arrayChunks.forEach(chunk => {
    const metadatas = [];
    const values = [];

    // extracting destination
    // from the first event in a batch
    const { destination } = chunk[0];
    const { apiKey } = destination.Config;
    let { listName } = destination.Config;

    // listName will be "Rudderstack", if it is not provided
    if (typeof listName === "string" && listName.trim().length === 0) {
      listName = "Rudderstack";
    }

    let batchEventResponse = defaultBatchRequestConfig();

    // Batch event into dest batch structure
    chunk.forEach(event => {
      values.push(event?.message?.body?.JSON?.values[0]);
      metadatas.push(event.metadata);
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
  // Checking if event type is identify
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

  const identifyEventChunks = []; // list containing identify events in batched format
  const eventResponseList = []; // list containing other events in batched format
  const errorRespList = [];
  Promise.all(
    inputs.map(event => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(event, identifyEventChunks, eventResponseList);
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
        }
      } catch (error) {
        const errObj = generateErrorObject(
          error,
          DESTINATION,
          TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
        );
        errorRespList.push(
          getErrorRespEvents(
            [event.metadata],
            error.response ? error.response.status : 400,
            error.message || "Error occurred while processing payload.",
            errObj.statTags
          )
        );
      }
    })
  );

  // batching identifyEventChunks
  let identifyBatchedResponseList = [];

  if (identifyEventChunks.length) {
    identifyBatchedResponseList = batchEvents(identifyEventChunks);
  }

  let batchedResponseList = [];
  // appending all kinds of batches
  batchedResponseList = batchedResponseList
    .concat(identifyBatchedResponseList)
    .concat(eventResponseList);

  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
