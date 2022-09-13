const { isEmpty } = require("lodash");
const {
  processAxiosResponse,
  getDynamicMeta
} = require("../../../adapters/utils/networkUtils");
const {
  prepareProxyRequest,
  proxyRequest
} = require("../../../adapters/network");
const { DESTINATION } = require("./config");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");

const defaultStatTags = {
  destType: DESTINATION,
  stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
  scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
  meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
};
/**
 * The actual API reference doc to which events from Rudderstack are being sent
 * https://developers.facebook.com/docs/marketing-api/reference/ads-pixel/events/v13.0
 *
 * The documents referred while formulating the error responses
 * 1. https://developers.facebook.com/docs/graph-api/guides/error-handling/
 *   - This seems like a generic document that contains errors possible for Graph API
 * 2. https://developers.facebook.com/docs/marketing-api/error-reference/
 *   - The doc seems to be more related to Marketing API
 */
const RETRYABLE_ERROR_CODES = [1, 2, 3, 341, 368, 5000, 190];

/**
 * These error codes were chosen from the below reference:
 * https://developers.facebook.com/docs/marketing-api/error-reference/
 *
 */
const THROTTLED_ERROR_CODES = [4, 17];

/**
 * Only under below mentioned scenario(s), add the errorCodes, subCodes etc,. to this map
{
  // A scenario where in we have to know the error with code and subcode, we can conclude that
  // this error will have a particular status, statTags
  code1: {
    subCode1: {
      status: ,
      // Only tags that are unique to this error needs to be provided
      statTags: 
    }
  }
}
 */
const errorDetailsMap = {
  100: {
    // This error talks about event being sent after seven days or so
    2804003: {
      status: 400,
      statTags: {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
      }
    }
  },
  1: {
    // An unknown error occurred.
    // This error may occur if you set level to adset but the correct value should be campaign
    99: {
      status: 400,
      statTags: {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
      }
    }
  }
};

const getErrorDetailsFromErrorMap = error => {
  const { code, error_subcode: subCode } = error;
  let errDetails;
  if (!isEmpty(errorDetailsMap[code]) && subCode) {
    errDetails = errorDetailsMap[code][subCode];
  }
  return errDetails;
};

const getStatusAndStats = error => {
  const errorDetail = getErrorDetailsFromErrorMap(error);
  let errorStatus = 400;
  let statTags = { ...defaultStatTags };
  if (!isEmpty(errorDetail)) {
    errorStatus = errorDetail.status;
    statTags = {
      ...statTags,
      ...errorDetail.statTags
    };
  }
  if (RETRYABLE_ERROR_CODES.includes(error.code)) {
    errorStatus = 500;
    statTags = {
      ...statTags,
      meta: getDynamicMeta(errorStatus)
    };
  }

  if (THROTTLED_ERROR_CODES.includes(error.code)) {
    errorStatus = 429;
    statTags = {
      ...statTags,
      meta: getDynamicMeta(errorStatus)
    };
  }

  return {
    status: errorStatus,
    statTags
  };
};

const errorResponseHandler = destResponse => {
  const { response } = destResponse;
  if (!response.error) {
    // successful response from facebook pixel api
    return;
  }
  const { error } = response;
  const statusAndStats = getStatusAndStats(error);
  throw new ErrorBuilder()
    .setStatus(statusAndStats.status)
    .setDestinationResponse({ ...response, status: destResponse.status })
    .setMessage(
      `Facebook Pixel: Failed with ${error.message} during response transformation`
    )
    .setStatTags(statusAndStats.statTags)
    .build();
};

const destResponseHandler = destinationResponse => {
  errorResponseHandler(destinationResponse);
  return {
    destinationResponse: destinationResponse.response,
    message: `[Facebook_pixel Response Handler] - Request Processed Successfully`,
    status: destinationResponse.status
  };
};

const networkHandler = function() {
  // The order of execution also happens in this way
  this.prepareProxyRequest = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = destResponseHandler;
};

module.exports = {
  networkHandler
};
