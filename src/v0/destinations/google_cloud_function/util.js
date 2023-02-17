const { defaultBatchRequestConfig } = require('../../util');
const { ConfigurationError } = require('../../util/errorTypes');

const { TRIGGERTYPE } = require('./config');

/**
 * validate destination config
 * @param {*} param0
 */
const validateDestinationConfig = ({ Config }) => {
  // throw error if google Cloud Function is not provided
  if (!Config.googleCloudFunctionUrl) {
    throw new ConfigurationError('[GCF]:: Url not found. Aborting');
  }
  if (
    Config.triggerType === 'https' && // for triggerType https gcloud Authorization is mandatory
    !Config.gcloudAuthorization
  ) {
    throw new ConfigurationError('[GCF]:: Access Token not found. Aborting');
  }
};

/**
 * add headers  in the payload that is provided in destination config
 * @param {*} response
 * @param {*} Config
 */
function addHeader(response, Config) {
  const { triggerType, apiKeyId, gcloudAuthorization } = Config;

  response.headers = { 'content-type': 'application/json' };
  if (apiKeyId) {
    const basicAuth = Buffer.from(`apiKey:${apiKeyId}`).toString('base64');
    response.headers.ApiKey = `Basic ${basicAuth}`;
  }
  if (TRIGGERTYPE.HTTPS === triggerType.toLowerCase()) {
    response.headers.Authorization = `bearer ${gcloudAuthorization}`;
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
  // extracting destination
  // from the first event in a batch
  const { destination } = events[0];
  const { googleCloudFunctionUrl } = destination.Config;
  let batchEventResponse = defaultBatchRequestConfig();
  // Batch event into dest batch structure
  events.forEach((ev) => {
    batchResponseList.push(ev.message.body.JSON);
    metadata.push(ev.metadata);
  });
  batchEventResponse.batchedRequest.body.JSON_ARRAY = {
    batch: JSON.stringify(batchResponseList),
  };
  batchEventResponse.batchedRequest.endpoint = googleCloudFunctionUrl;
  addHeader(batchEventResponse.batchedRequest, destination.Config);
  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination,
  };
  return batchEventResponse;
}

module.exports = {
  validateDestinationConfig,
  addHeader,
  generateBatchedPayload,
};
