/* eslint-disable no-restricted-syntax */
const { AbortedError, RetryableError, NetworkError } = require('@rudderstack/integrations-lib');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');

function checkIfFailuresAreRetryable(response) {
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
        for (const err of st.errors) {
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

const responseHandler = (destinationResponse) => {
  const message = `[CAMPAIGN_MANAGER Response Handler] - Request Processed Successfully`;
  const { response, status } = destinationResponse;

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
    500,
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
