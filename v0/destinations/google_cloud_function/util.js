const { defaultBatchRequestConfig, CustomError } = require("../../util");

const { TRIGGERTYPE } = require("./config");

const validateDestinationConfig = ({ Config }) => {
  if (!Config.googleCloudFunctionUrl) {
    throw new CustomError("[GCF]:: Url not found. Aborting", 400);
  }
  if (Config.triggerType === "https") {
    // Auth Mandatory
    if (!Config.gcloudAuthorization) {
      throw new CustomError("[GCF]:: Access Token not found. Aborting", 400);
    }
  }
};

function generateBatchedPayloadForArray(events) {
  const batchResponseList = [];
  const metadata = [];

  // extracting destination
  // from the first event in a batch
  const { destination } = events[0];
  const Config = destination.Config;
  const {
    googleCloudFunctionUrl,
    triggerType,
    apiKeyId,
    gcloudAuthorization
  } = Config;
  let batchEventResponse = defaultBatchRequestConfig();

  // Batch event into dest batch structure
  events.forEach(ev => {
    batchResponseList.push(ev.message.body.JSON);
    metadata.push(ev.metadata);
  });

  batchEventResponse.batchedRequest.body.JSON_ARRAY = {
    batch: JSON.stringify(batchResponseList)
  };

  batchEventResponse.batchedRequest.endpoint = googleCloudFunctionUrl;

  if (TRIGGERTYPE.HTTPS == triggerType) {
    batchEventResponse.batchedRequest.headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${gcloudAuthorization}`,
      ApiKey: `Basic ${apiKeyId}`
    };
  } else {
    batchEventResponse.batchedRequest.headers = {
      "content-type": "application/json",
      Authorization: `Basic ${apiKeyId}`
    };
  }
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
  const Config = destination.Config;
  const {
    googleCloudFunctionUrl,
    triggerType,
    apiKeyId,
    gcloudAuthorization
  } = Config;
  let batchEventResponse = defaultBatchRequestConfig();

  batchEventResponse.batchedRequest.body.JSON = event.message.body.JSON;

  batchEventResponse.batchedRequest.endpoint = googleCloudFunctionUrl;

  if (TRIGGERTYPE.HTTPS == triggerType) {
    batchEventResponse.batchedRequest.headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${gcloudAuthorization}`,
      ApiKey: `Basic ${apiKeyId}`
    };
  } else {
    batchEventResponse.batchedRequest.headers = {
      "content-type": "application/json",
      Authorization: `Basic ${apiKeyId}`
    };
  }
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
  validateDestinationConfig
};
