const { ConfigurationError } = require('../../util/errorTypes');

/**
 * validate destination config
 * @param {*} param0
 */
const validateDestinationConfig = ({ Config }) => {
  // throw error if google Cloud Function URL is not provided
  if (!Config.googleCloudFunctionUrl) {
    throw new ConfigurationError('[GCF]:: Url not found. Aborting');
  }
  if (Config.requireAuthentication && !Config.credentials) {
    throw new ConfigurationError(
      '[GCF]:: Service Account credentials are required if your function required authentication. Aborting',
    );
  }
};

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
