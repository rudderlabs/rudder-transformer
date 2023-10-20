/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { RetryableError, NetworkError, AbortedError, TransformerProxyError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function checkIfFailuresAreRetryable(response, proxyOutputObj) {
  const { status } = response;
  try {
    if (Array.isArray(status)) {
      // iterate over each status, and if found retryable in conversations ..retry else discard
      /* status : [{
        "conversion": {
          object (Conversion)
        },
        "errors": [
          {
            object (ConversionError)
          }
        ],
        "kind": string
      }] */
      for (const st of status) {
        for(const err of st.errors) {
          // if code is any of these, event is not retryable
          if (
            err.code === 'PERMISSION_DENIED' ||
            err.code === 'INVALID_ARGUMENT' ||
            err.code === 'NOT_FOUND'
          ) {
            return false;
          }
        }
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

function isEventRetryable(element, proxyOutputObj) {
  let flag = false;
  let errorMsg = "";
  // success event
  if (!element.errors) {
    return flag;
  }
  for(const err of element.errors) {
    errorMsg += `${err.message}, `;
    if (err.code === 'INTERNAL') {
      flag = true;
    }
  }
  if (errorMsg) {
    proxyOutputObj.error = errorMsg;
  }
  return flag;
}

function isEventAbortable(element, proxyOutputObj) {
  let flag = false;
  let errorMsg = "";
  // success event
  if (!element.errors) {
    return flag;
  }
  for(const err of element.errors) {
    errorMsg += `${err.message}, `;
    // if code is any of these, event is not retryable
    if (
      err.code === 'PERMISSION_DENIED' ||
      err.code === 'INVALID_ARGUMENT' ||
      err.code === 'NOT_FOUND'
    ) {
      flag = true;
    }
  }
  if (errorMsg) {
    proxyOutputObj.error = errorMsg;
  }
  return flag;
}

const responseHandler = (destinationResponse) => {
  const message = `[CAMPAIGN_MANAGER Response Handler] - Request Processed Successfully`;
  const responseWithIndividualEvents = [];
  const { response, status, rudderJobMetadata } = destinationResponse;

  if (Array.isArray(rudderJobMetadata)) {
    if (isHttpStatusSuccess(status)) {
      // check for Partial Event failures and Successes 
      const destPartialStatus = response.status;
      
      for (const [idx, element] of destPartialStatus.entries()) {
        const proxyOutputObj = {
          statusCode: 200,
          metadata: rudderJobMetadata[idx],
          error: "success"
        };
        // update status of partial event as per retriable or abortable
        if (isEventRetryable(element, proxyOutputObj)) {
          proxyOutputObj.statusCode = 500;
        } else if (isEventAbortable(element, proxyOutputObj)) { 
          proxyOutputObj.statusCode = 400;
        }
        responseWithIndividualEvents.push(proxyOutputObj);
      }
  
      return {
        status,
        message,
        destinationResponse,
        response: responseWithIndividualEvents
      }
    }
  
    // in case of failure status, populate response to maintain len(metadata)=len(response)
    const errorMessage = response.error?.message || 'unknown error format';
    for (const metadata of rudderJobMetadata) {
      responseWithIndividualEvents.push({
        statusCode: 500,
        metadata,
        error: errorMessage
      });
    }
  
    throw new TransformerProxyError(
      `Campaign Manager: Error proxy during CAMPAIGN_MANAGER response transformation`,
      500,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
      getAuthErrCategoryFromStCode(status),
      responseWithIndividualEvents
    );
  }

  if (isHttpStatusSuccess(status)) {
    // check for Failures
    if (response.hasFailures === true) {
      if (checkIfFailuresAreRetryable(response)) {
        throw new RetryableError(
          `Campaign Manager: Retrying during CAMPAIGN_MANAGER response transformation`,
          500,
          destinationResponse,
        );
      } else {
        // abort message
        throw new AbortedError(
          `Campaign Manager: Aborting during CAMPAIGN_MANAGER response transformation`,
          400,
          destinationResponse,
        );
      }
    }

    return {
      status,
      message,
      destinationResponse,
    };
  }

  throw new NetworkError(
    `Campaign Manager: ${response.error?.message} during CAMPAIGN_MANAGER response transformation 3`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    getAuthErrCategoryFromStCode(status),
  );

};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
