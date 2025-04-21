const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `[ALGOLIA Response V1 Handler] - Request Processed Successfully`;
  const { response, status } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    return {
      status,
      message,
      destinationResponse,
      response: rudderJobMetadata.map((metadata) => ({
        statusCode: 200,
        metadata,
        error: 'success',
      })),
    };
  }

  // in case of non 2xx status sending 500 for every event, populate response and update dontBatch to true
  const responseWithIndividualEvents = rudderJobMetadata.map((metadata) => {
    // eslint-disable-next-line no-param-reassign
    metadata.dontBatch = true;
    return {
      statusCode: 500,
      metadata: { ...metadata, dontBatch: true },
      error: response?.error?.message || response?.message || 'unknown error format',
    };
  });

  // At least one event in the batch is invalid in case of 422
  // sending back 500 for retry
  const newStatus = status === 422 ? 500 : status;
  throw new TransformerProxyError(
    `ALGOLIA: Error transformer proxy v1 during ALGOLIA response transformation`,
    newStatus,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(newStatus),
    },
    destinationResponse,
    '',
    responseWithIndividualEvents,
  );
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
