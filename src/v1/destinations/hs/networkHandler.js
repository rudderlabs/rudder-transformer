/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
const { removeUndefinedAndNullValues } = require('@rudderstack/integrations-lib');
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

const populateErrorMessage = (response) => {
  const errorResponse = {
    message: response?.message || null,
    category: response?.category || null,
    correlationId: response?.correlationId || null,
  };
  removeUndefinedAndNullValues(errorResponse);
  if (Object.keys(errorResponse).length === 0) {
    return 'unknown error format';
  }
  return JSON.stringify(errorResponse);
};

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `[HUBSPOT Response V1 Handler] - Request Processed Successfully`;
  const responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    // populate different response for each event
    const results = response?.results;
    if (Array.isArray(results)) {
      for (const [idx] of results.entries()) {
        const proxyOutputObj = {
          statusCode: 200,
          metadata: rudderJobMetadata[idx],
          error: 'success',
        };
        responseWithIndividualEvents.push(proxyOutputObj);
      }
    }

    return {
      status,
      message,
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }

  // in case of failure status, populate response to maintain len(metadata)=len(response)
  const errorMessage = populateErrorMessage(response);

  // At least one event in the batch is invalid.
  if (status === 400 && rudderJobMetadata.length > 1) {
    if (rudderJobMetadata.length > 1) {
      for (const metadata of rudderJobMetadata) {
        metadata.dontBatch = true;
        responseWithIndividualEvents.push({
          statusCode: status,
          metadata,
          error: errorMessage,
        });
      }
    }
    // sending back 500 for retry only when events came in a batch
    throw new TransformerProxyError(
      `HUBSPOT: Error transformer proxy v1 during HUBSPOT response transformation`,
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
    `HUBSPOT: Error transformer proxy v1 during HUBSPOT response transformation`,
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
