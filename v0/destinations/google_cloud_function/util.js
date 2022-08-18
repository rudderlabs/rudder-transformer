const { defaultBatchRequestConfig, CustomError } = require("../../util");

const { TRIGGERTYPE } = require("./config");

/**
 * validate destination config
 * @param {*} param0
 */
const validateDestinationConfig = ({ Config }) => {
  // throw error if google Cloud Function is not provided
  if (!Config.googleCloudFunctionUrl) {
    throw new CustomError("[GCF]:: Url not found. Aborting", 400);
  }
  if (Config.TriggerType === "https") {
    // for TriggerType https gcloud Authorization is mandatory
    if (!Config.gcloudAuthorization) {
      throw new CustomError("[GCF]:: Access Token not found. Aborting", 400);
    }
  }
};

/**
 * add headers  in the payload that is provided in destination config
 * @param {*} response
 * @param {*} Config
 */
function addHeader(response, Config) {
  const { TriggerType, apiKeyId, gcloudAuthorization } = Config;
  let basicAuth;
  // API Key (apikey)
  if (apiKeyId) {
    basicAuth = Buffer.from(`apiKey:${apiKeyId}`).toString("base64");
  }

  response.headers = { "content-type": "application/json" };
  if (TRIGGERTYPE.HTTPS === TriggerType.toLowerCase()) {
    response.headers.Authorization = `bearer ${gcloudAuthorization}`;
  }
  if (basicAuth) {
    if (TRIGGERTYPE.HTTPS === TriggerType.toLowerCase()) {
      response.headers.ApiKey = `Basic ${basicAuth}`;
    } else {
      response.headers.Authorization = `Basic ${basicAuth}`;
    }
  }
}

/**
 * Create GoogleCloudFunction Batch payload based on the passed events
 * @param {*} events
 * @returns
 */
function generateBatchedPayload(events) {
  const batchResponseList = [];
  const metadata = [];

  let destination;
  if (Array.isArray(events)) {
    // extracting destination
    // from the first event in a batch
    destination = events[0].destination;
  } else {
    destination = events.destination;
  }

  // const { destination } = events[0];
  const { googleCloudFunctionUrl, enableBatchInput } = destination.Config;
  let batchEventResponse = defaultBatchRequestConfig();

  batchEventResponse.batchedRequest.endpoint = googleCloudFunctionUrl;
  addHeader(batchEventResponse.batchedRequest, destination.Config);

  if (enableBatchInput) {
    // if enableBatchInput is true add Batch event into dest batch structure
    events.forEach(ev => {
      batchResponseList.push(ev.message.body.JSON);
      metadata.push(ev.metadata);
    });
    batchEventResponse.batchedRequest.body.JSON_ARRAY = {
      batch: JSON.stringify(batchResponseList)
    };
  } else {
    batchEventResponse.batchedRequest.body.JSON = events.message.body.JSON;
    metadata.push(events.metadata);
  }
  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination
  };

  return batchEventResponse;
}

module.exports = {
  validateDestinationConfig,
  addHeader,
  generateBatchedPayload
};
