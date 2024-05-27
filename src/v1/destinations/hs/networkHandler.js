/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

const verify = (results, rudderJobMetadata) =>
  Array.isArray(results) && results.length === rudderJobMetadata.length;

const populateResponseWithDontBatch = (rudderJobMetadata, status, response) => {
  const errorMessage = JSON.stringify(response);
  const responseWithIndividualEvents = [];
  for (const metadata of rudderJobMetadata) {
    metadata.dontBatch = true;
    responseWithIndividualEvents.push({
      statusCode: 500,
      metadata,
      error: errorMessage,
    });
  }
  return responseWithIndividualEvents;
};
const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const successMessage = `[HUBSPOT Response V1 Handler] - Request Processed Successfully`;
  const failureMessage =
    'HUBSPOT: Error in transformer proxy v1 during HUBSPOT response transformation';
  const responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    // populate different response for each event
    const results = response?.results;
    if (verify(results, rudderJobMetadata)) {
      for (const [idx] of rudderJobMetadata.entries()) {
        const proxyOutputObj = {
          statusCode: 200,
          metadata: rudderJobMetadata[idx],
          error: 'success',
        };
        responseWithIndividualEvents.push(proxyOutputObj);
      }
      return {
        status,
        message: successMessage,
        destinationResponse,
        response: responseWithIndividualEvents,
      };
    }
    // return the destiantionResponse as it is when the response is not in expected format
    return {
      status,
      message: successMessage,
      destinationResponse,
      response: destinationResponse,
    };
  }

  // At least one event in the batch is invalid.
  if (status === 400 && rudderJobMetadata.length > 1) {
    // sending back 500 for retry only when events came in a batch
    return {
      status: 500,
      message: failureMessage,
      destinationResponse,
      response: populateResponseWithDontBatch(rudderJobMetadata, status, response),
    };
  }
  throw new TransformerProxyError(
    failureMessage,
    status,
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
