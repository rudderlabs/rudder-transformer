const {
  prepareProxyRequest,
  proxyRequest
} = require("../../../adapters/network");
const { isHttpStatusSuccess } = require("../../util/index");
const {
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");

const {
  processAxiosResponse,
  getDynamicErrorType
} = require("../../../adapters/utils/networkUtils");
const {
  AbortedError,
  RetryableError,
  NetworkError
} = require("../../util/errorTypes");
const tags = require("../../util/tags");

/**
 * This function helps to detarmine type of error occured. According to the response
 * we set authErrorCategory to take decision if we need to refresh the access_token
 * or need to disable the destination.
 * @param {*} code
 * @returns
 */
const getAuthErrCategory = code => {
  switch (code) {
    case 401:
      return REFRESH_TOKEN;
    default:
      return "";
  }
};

function checkIfFailuresAreRetryable(response) {
  try {
    if (
      Array.isArray(response.status) &&
      Array.isArray(response.status[0].errors)
    ) {
      return (
        response.status[0].errors[0].code !== "PERMISSION_DENIED" &&
        response.status[0].errors[0].code !== "INVALID_ARGUMENT"
      );
    }
    return true;
  } catch (e) {
    return true;
  }
}

const responseHandler = destinationResponse => {
  const message = `[CAMPAIGN_MANAGER Response Handler] - Request Processed Successfully`;
  const { response, status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // check for Failures
    if (response.hasFailures === true) {
      if (checkIfFailuresAreRetryable(response)) {
        throw new RetryableError(
          `Campaign Manager: Retrying during CAMPAIGN_MANAGER response transformation`,
          500,
          destinationResponse
        );
      } else {
        // abort message
        throw new AbortedError(
          `Campaign Manager: Aborting during CAMPAIGN_MANAGER response transformation`,
          400,
          destinationResponse
        );
      }
    }

    return {
      status,
      message,
      destinationResponse
    };
  }

  throw new NetworkError(
    `Campaign Manager: ${response.error.message} during CAMPAIGN_MANAGER response transformation 3`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status)
    },
    destinationResponse,
    getAuthErrCategory(status)
  );
};

const networkHandler = function() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
};

module.exports = { networkHandler };
