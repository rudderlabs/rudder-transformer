const { ConfigurationError } = require('../../util/errorTypes');

/**
 * validate destination config
 * @param {*} param0
 */
const validateDestinationConfig = ({ Config }) => {
  // throw error if google Cloud Function is not provided
  if (!Config.googleCloudFunctionUrl) {
    throw new ConfigurationError('[GCF]:: Url not found. Aborting');
  }
  if (Config.requireAuthentication && !Config.credentials) {
    throw new ConfigurationError(
      '[GCF]:: Service Account credentials are required if your function required authentication. Aborting',
    );
  }
};

// /**
//  * add headers  in the payload that is provided in destination config
//  * @param {*} response
//  * @param {*} Config
//  */
// function addHeader(response, Config) {
//   const { triggerType, apiKeyId, gcloudAuthorization } = Config;

//   response.headers = { 'content-type': JSON_MIME_TYPE };
//   if (apiKeyId) {
//     const basicAuth = Buffer.from(`apiKey:${apiKeyId}`).toString('base64');
//     response.headers.ApiKey = `Basic ${basicAuth}`;
//   }
//   if (TRIGGERTYPE.HTTPS === triggerType.toLowerCase()) {
//     response.headers.Authorization = `bearer ${gcloudAuthorization}`;
//   }
// }

/**
 * Create GoogleCloudFunction Batch payload based on the passed events
 * @param {*} events
 * @returns
 */

function generateBatchedPayload(events) {
  const metadata = [];
  // extracting destination
  // from the first event in a batch
  const { destination } = events[0];
  let batchEventResponse = events.map((event) => event.message);
  // Batch event into dest batch structure
  events.forEach((ev) => {
    // batchResponseList.push(ev.message.body.JSON);
    metadata.push(ev.metadata);
  });
  batchEventResponse = {
    message: batchEventResponse,
    destination,
    metadata,
  };
  return batchEventResponse;
}

module.exports = {
  validateDestinationConfig,
  generateBatchedPayload,
};
