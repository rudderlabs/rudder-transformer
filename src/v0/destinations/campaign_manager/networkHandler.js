const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { AbortedError, RetryableError, NetworkError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

function checkIfFailuresAreRetryable(response) {
  try {
    if (Array.isArray(response.status) && Array.isArray(response.status[0].errors)) {
      return (
        response.status[0].errors[0].code !== 'PERMISSION_DENIED' &&
        response.status[0].errors[0].code !== 'INVALID_ARGUMENT'
      );
    }
    return true;
  } catch (e) {
    return true;
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
