const {
  defaultBatchRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");
const { TRIGGERTYPE } = require("./config");

function process(event) {
  const { destination } = event;

  const {
    googleCloudFunctionUrl,
    TriggerType,
    gcloudAuthorization
  } = destination.Config;

  if (!googleCloudFunctionUrl) {
    throw new CustomError("Cloud Function Url not found. Aborting", 400);
  }

  if (TRIGGERTYPE.HTTPS === TriggerType && !gcloudAuthorization) {
    throw new CustomError(
      "For HTTPS requests, Google Cloud Authorization token is mandatory ",
      400
    );
  }

  return event;
}

const deduceResponseHeaders = (gcloudAuthorization, apiKeyId, TriggerType) => {
  const basicAuth = apiKeyId
    ? Buffer.from(`apiKey:${apiKeyId}`).toString("base64")
    : undefined;
  const headers = {
    "content-type": "application/json"
  };
  if (basicAuth) {
    headers.ApiKey = `Basic ${basicAuth}`;
  }
  if (TRIGGERTYPE.HTTPS === TriggerType) {
    headers.Authorization = `Bearer ${gcloudAuthorization}`;
  }
  return headers;
};

// Returns a batched response list for a for list of inputs(successRespList)
function batchEvents(successRespList, destination) {
  const batchEventResponse = defaultBatchRequestConfig();
  const batchedResponseList = [];
  const {
    enableBatchInput,
    googleCloudFunctionUrl,
    apiKeyId,
    gcloudAuthorization,
    TriggerType
  } = destination.Config;
  batchEventResponse.batchedRequest.endpoint = googleCloudFunctionUrl;
  batchEventResponse.batchedRequest.headers = deduceResponseHeaders(
    gcloudAuthorization,
    apiKeyId,
    TriggerType
  );

  // if enable batching is true, then we club all the events together. There is no concept of batch size
  if (enableBatchInput) {
    const msgList = [];
    const batchMetadata = [];
    successRespList.forEach(event => {
      msgList.push(event.payload.message);
      batchMetadata.push(event.metadata);
    });
    const batchPayload = { payload: msgList };
    batchEventResponse.batchedRequest.body.JSON = batchPayload;
    batchedResponseList.push(
      getSuccessRespEvents(batchEventResponse, batchMetadata, destination, true)
    );
  } else {
    // otherwise the events are sent normally
    successRespList.forEach(event => {
      batchEventResponse.batchedRequest.body.JSON = event.payload.message;
      batchedResponseList.push(
        getSuccessRespEvents(batchEventResponse, [event.metadata], destination)
      );
    });
  }
  return batchedResponseList;
}

// Router transform with batching by default
const processRouterDest = inputs => {
  const { destination } = inputs[0];
  let batchResponseList = [];
  const batchErrorRespList = [];
  const successRespList = [];

  inputs.forEach(input => {
    try {
      successRespList.push({
        payload: process(input),
        metadata: input.metadata
      });
    } catch (error) {
      batchErrorRespList.push(
        getErrorRespEvents(
          [input.metadata],
          error.response ? error.response?.status : 400,
          error.message || "Error occurred while processing payload."
        )
      );
    }
  });

  if (successRespList.length > 0) {
    batchResponseList = batchEvents(successRespList, destination);
  }
  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
