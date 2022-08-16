const { defaultBatchRequestConfig, CustomError } = require("../../util");

const { TRIGGERTYPE } = require("./config");

const validateDestinationConfig = ({ Config }) => {
  if (!Config.googleCloudFunctionUrl) {
    throw new CustomError("[GCF]:: Url not found. Aborting", 400);
  }
  if (Config.TriggerType === "https") {
    // Auth Mandatory
    if (!Config.gcloudAuthorization) {
      throw new CustomError("[GCF]:: Access Token not found. Aborting", 400);
    }
  }
};

function addHeader(response, Config) {
  const { TriggerType, apiKeyId, gcloudAuthorization } = Config;
  let basicAuth;
  if (apiKeyId) {
    basicAuth = Buffer.from(`apiKey:${apiKeyId}`).toString("base64");
  }

  response.headers = { "content-type": "application/json" };
  if (TRIGGERTYPE.HTTPS === TriggerType.toLowerCase()) {
    response.headers.Authorization = `Basic ${gcloudAuthorization}`;
  }
  if (basicAuth) {
    if (TRIGGERTYPE.HTTPS === TriggerType.toLowerCase()) {
      response.headers.ApiKey = `Basic ${basicAuth}`;
    } else {
      response.headers.Authorization = `Basic ${basicAuth}`;
    }
  }
}

function generateBatchedPayloadForArray(events) {
  const batchResponseList = [];
  const metadata = [];

  // extracting destination
  // from the first event in a batch
  const { destination } = events[0];
  const { googleCloudFunctionUrl } = destination.Config;
  let batchEventResponse = defaultBatchRequestConfig();

  // Batch event into dest batch structure
  events.forEach(ev => {
    batchResponseList.push(ev.message.body.JSON);
    metadata.push(ev.metadata);
  });

  batchEventResponse.batchedRequest.body.JSON = {
    batch: batchResponseList
  };

  batchEventResponse.batchedRequest.endpoint = googleCloudFunctionUrl;

  addHeader(batchEventResponse.batchedRequest, destination.Config);

  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination
  };

  return batchEventResponse;
}

function generateBatchedPayload(event) {
  // extracting destination
  const { destination, metadata } = event;
  const { googleCloudFunctionUrl } = destination.Config;
  let batchEventResponse = defaultBatchRequestConfig();

  batchEventResponse.batchedRequest.body.JSON = event.message.body.JSON;

  batchEventResponse.batchedRequest.endpoint = googleCloudFunctionUrl;

  addHeader(batchEventResponse.batchedRequest, destination.Config);
  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination
  };

  return batchEventResponse;
}

module.exports = {
  generateBatchedPayloadForArray,
  generateBatchedPayload,
  validateDestinationConfig,
  addHeader
};
