/* eslint-disable no-restricted-syntax */
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `[ALGOLIA Response V1 Handler] - Request Processed Successfully`;
  const responseWithIndividualEvents = [];
  // response:
  // {status: 200, message: 'OK'}
  // {response:'[ENOTFOUND] :: DNS lookup failed', status: 400}
  // destinationResponse = {
  //   response: {"status": 422, "message": "EventType must be one of \"click\", \"conversion\" or \"view\""}, status: 422
  // }
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
  let serverStatus = 400;
  for (const metadata of rudderJobMetadata) {
    // handling case if dontBatch is true, and again we got invalid from destination
    if (metadata.dontBatch && status === 422) {
      responseWithIndividualEvents.push({
        statusCode: 400,
        metadata,
        error: errorMessage,
      });
    } else {
      serverStatus = 500;
      metadata.dontBatch = true;
      responseWithIndividualEvents.push({
        statusCode: 500,
        metadata,
        error: errorMessage,
      });
    }
  }

  // sending back 500 for retry
  throw new TransformerProxyError(
    `ALGOLIA: Error transformer proxy v1 during ALGOLIA response transformation`,
    serverStatus,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    getAuthErrCategoryFromStCode(status),
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
