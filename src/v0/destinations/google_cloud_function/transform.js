const _ = require('lodash');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
} = require('../../util');

const { generateBatchedPayload, validateDestinationConfig, addHeader } = require('./util');

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
  arrayChunks.forEach((chunk) => {
    const batchEventResponse = generateBatchedPayload(chunk);
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true,
      ),
    );
  });

  return batchedResponseList;
}

// Router transform with batching by default
const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const successResponseList = [];
  const errorRespList = [];
  const { destination } = inputs[0];
  inputs.forEach((event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        successResponseList.push({
          message: event.message,
          metadata: event.metadata,
          destination,
        });
      } else {
        // if not transformed
        const response = process(event);
        successResponseList.push({
          message: response,
          metadata: event.metadata,
          destination,
        });
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });
  let batchedResponseList = [];
  if (successResponseList.length > 0 && destination.Config.enableBatchInput) {
    batchedResponseList = batchEvents(successResponseList, destination.Config.maxBatchSize);
    return [...batchedResponseList, ...errorRespList];
  }
  const processedSuccessRespList = successResponseList.map((e) =>
    getSuccessRespEvents(e.message, [e.metadata], e.destination),
  );
  return [...processedSuccessRespList, ...errorRespList];
};

module.exports = {
  process,
  processRouterDest,
};
