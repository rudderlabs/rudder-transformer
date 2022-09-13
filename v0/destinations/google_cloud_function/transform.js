const _ = require("lodash");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError
} = require("../../util");

const {
  generateBatchedPayload,
  validateDestinationConfig,
  addHeader
} = require("./util");

// Main process Function to handle transformation
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
function batchEvents(successRespList, maxBatchSize = 10) {
  const batchedResponseList = [];

  // arrayChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  const arrayChunks = _.chunk(successRespList, maxBatchSize);
  arrayChunks.forEach(chunk => {
    const batchEventResponse = generateBatchedPayload(chunk);
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

// Router transform with batching by default
const processRouterDest = async inputs => {
  const errorRespEvents = checkInvalidRtTfEvents(
    inputs,
    "GOOGLE_CLOUD_FUNCTION"
  );
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const successResponseList = [];
  const errorRespList = [];
  const { destination } = inputs[0];
  await Promise.all(
    inputs.map(event => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          successResponseList.push({
            message: event.message,
            metadata: event.metadata,
            destination
          });
        } else {
          // if not transformed
          const response = process(event);
          successResponseList.push({
            message: response,
            metadata: event.metadata,
            destination
          });
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(
          event,
          error,
          "GOOGLE_CLOUD_FUNCTION"
        );
        errorRespList.push(errRespEvent);
      }
    })
  );
  let batchedResponseList = [];
  if (successResponseList.length && destination.Config.enableBatchInput) {
    batchedResponseList = batchEvents(
      successResponseList,
      destination.Config.maxBatchSize
    );
    return [...batchedResponseList, ...errorRespList];
  }
  const processedSuccessRespList = successResponseList.map(e => {
    return getSuccessRespEvents(e.message, [e.metadata], e.destination);
  });
  return [...processedSuccessRespList, ...errorRespList];
};

module.exports = {
  process,
  processRouterDest
};
