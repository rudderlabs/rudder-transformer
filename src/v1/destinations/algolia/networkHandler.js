/* eslint-disable no-restricted-syntax */
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
  const responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    for (const mData of rudderJobMetadata) {
      const proxyOutputObj = {
        statusCode: 200,
        metadata: mData,
        error: 'success',
      };
      responseWithIndividualEvents.push(proxyOutputObj);
    }

    return {
      status,
      message,
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }

  // in case of non 2xx status sending 500 for every event, populate response and update dontBatch to true
  const errorMessage = response?.error?.message || response?.message || 'unknown error format';
  for (const metadata of rudderJobMetadata) {
    metadata.dontBatch = true;
    responseWithIndividualEvents.push({
      statusCode: 500,
      metadata,
      error: errorMessage,
    });
  }

  // At least one event in the batch is invalid.
  if (status === 422) {
    // sending back 500 for retry
    throw new TransformerProxyError(
      `ALGOLIA: Error transformer proxy v1 during ALGOLIA response transformation`,
      500,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(500),
      },
      destinationResponse,
      '',
      responseWithIndividualEvents,
    );
  }

  throw new TransformerProxyError(
    `ALGOLIA: Error transformer proxy v1 during ALGOLIA response transformation`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
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
