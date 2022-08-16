const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util");

const {
  generateBatchedPayloadForArray,
  generateBatchedPayload,
  validateDestinationConfig,
  addHeader
} = require("./util");

function process(event) {
  const { message, destination } = event;
  const { googleCloudFunctionUrl } = destination.Config;

  // Config Validation
  validateDestinationConfig(destination);

  const response = defaultRequestConfig();
  // adding header
  addHeader(response, destination.Config);
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = message;
  response.endpoint = googleCloudFunctionUrl;

  return response;
}

// Returns a batched response list for a for list of inputs(successRespList)
function batchEvents(eventsChunk, destination) {
  const batchedResponseList = [];
  const { enableBatchInput } = destination.Config;
  if (enableBatchInput) {
    const batchEventResponse = generateBatchedPayloadForArray(eventsChunk);
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true
      )
    );
  } else {
    eventsChunk.forEach(chunk => {
      const batchEventResponse = generateBatchedPayload(chunk);
      batchedResponseList.push(
        getSuccessRespEvents(
          batchEventResponse.batchedRequest,
          batchEventResponse.metadata,
          batchEventResponse.destination
        )
      );
    });
  }
  return batchedResponseList;
}

function getEventChunks(event, eventsChunk) {
  eventsChunk.push(event);
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const eventsChunk = []; // temporary variable to divide payload into chunks
  const errorRespList = [];
  await Promise.all(
    inputs.map(event => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          getEventChunks(event, eventsChunk);
        } else {
          // if not transformed
          let response = process(event);
          response = Array.isArray(response) ? response : [response];
          response.forEach(res => {
            getEventChunks(
              {
                message: res,
                metadata: event.metadata,
                destination: event.destination
              },
              eventsChunk
            );
          });
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
  const { destination } = inputs[0];
  if (eventsChunk.length) {
    batchedResponseList = batchEvents(eventsChunk, destination);
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = {
  process,
  processRouterDest
};
