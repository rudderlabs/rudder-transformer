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

function isEventAbortableAndExtractErrMsg(element, proxyOutputObj) {
  let isAbortable = false;
  let errorMsg = '';
  // success event
  if (!element.errors) {
    return isAbortable;
  }
  for (const err of element.errors) {
    errorMsg += `${err.message}, `;
    // if code is any of these, event is not retryable
    if (
      err.code === 'PERMISSION_DENIED' ||
      err.code === 'INVALID_ARGUMENT' ||
      err.code === 'NOT_FOUND'
    ) {
      isAbortable = true;
    }
  }
  if (errorMsg) {
    proxyOutputObj.error = errorMsg;
  }
  return isAbortable;
}

const responseHandler = (destinationResponse) => {
  const message = `[CAMPAIGN_MANAGER Response V1 Handler] - Request Processed Successfully`;
  const responseWithIndividualEvents = [];
  const { response, status, rudderJobMetadata } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    // check for Partial Event failures and Successes
    const destPartialStatus = response.status;

    for (const [idx, element] of destPartialStatus.entries()) {
      const proxyOutputObj = {
        statusCode: 200,
        metadata: rudderJobMetadata[idx],
        error: 'success',
      };
      // update status of partial event if abortable
      if (isEventAbortableAndExtractErrMsg(element, proxyOutputObj)) {
        proxyOutputObj.statusCode = 400;
      }
      responseWithIndividualEvents.push(proxyOutputObj);
    }

    return {
      status,
      message,
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }

  // in case of failure status, populate response to maintain len(metadata)=len(response)
  const errorMessage = response.error?.message || 'unknown error format';
  for (const metadata of rudderJobMetadata) {
    responseWithIndividualEvents.push({
      statusCode: 500,
      metadata,
      error: errorMessage,
    });
  }

  throw new TransformerProxyError(
      `Campaign Manager: Error transformer proxy v1 during CAMPAIGN_MANAGER response transformation`,
      500,
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
