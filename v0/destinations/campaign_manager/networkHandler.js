const {
  prepareProxyRequest,
  proxyRequest
} = require("../../../adapters/network");
const { isHttpStatusSuccess } = require("../../util/index");
const ErrorBuilder = require("../../util/error");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");

const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { ApiError } = require("../../util/errors");
const { TRANSFORMER_METRIC } = require("../../util/constant");

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
    case 403: // Access Denied
      return DISABLE_DEST;
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
        throw new ApiError(
          `Campaign Manager: Retrying during CAMPAIGN_MANAGER response transformation`,
          500,
          {
            scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
            meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
          },
          destinationResponse,
          undefined,
          "CAMPAIGN_MANAGER"
        );
      } else {
        // abort message
        throw new ApiError(
          `Campaign Manager: Aborting during CAMPAIGN_MANAGER response transformation`,
          400,
          {
            scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
            meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
          },
          destinationResponse,
          undefined,
          "CAMPAIGN_MANAGER"
        );
      }
    }

    return {
      status,
      message,
      destinationResponse
    };
  }

  throw new ErrorBuilder()
    .setStatus(status)
    .setDestinationResponse(response)
    .setMessage(
      `Campaign Manager: ${response.error.message} during CAMPAIGN_MANAGER response transformation 3`
    )
    .setAuthErrorCategory(getAuthErrCategory(status))
    .build();
};

const networkHandler = function() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
};

module.exports = { networkHandler };
