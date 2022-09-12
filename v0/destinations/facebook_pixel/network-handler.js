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
const RETRYABLE_ERROR_CODES = [1, 2, 3, 4, 341, 368, 5000, 190];

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
const errorDetailMap = {
  100: {
    // This error talks about event being sent after seven days or so
    // Kind of a "badEvent" case?
    2804003: {
      status: 400,
      statTags: {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
      }
    },
    // This is for testing purpose, not to committed
    // TODO: Remove after testing
    33: {
      status: 402,
      statTags: {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
      }
    }
  },
  1: {
    // This error talks about event being sent after seven days or so
    // Kind of a "badEvent" case?
    99: {
      status: 400,
      statTags: {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
      }
    }
  }
};

const getErrorDetailFromErrorMap = error => {
  const { code, error_subcode: subCode } = error;
  if (!isEmpty(errorDetailMap[code]) && subCode) {
    return errorDetailMap[code][subCode];
  }
  // This is done to fix the eslint error, if no return is defined
  return undefined;
};

const getStatusAndStats = error => {
  const errorDetail = getErrorDetailFromErrorMap(error);
  let defaultStatus = 400;
  let statTags = { ...defaultStatTags };
  if (!isEmpty(errorDetail)) {
    defaultStatus = errorDetail.status;
    statTags = {
      ...statTags,
      ...errorDetail.statTags
    };
  }
  if (RETRYABLE_ERROR_CODES.includes(error.code)) {
    defaultStatus = 500;
    statTags = {
      ...statTags,
      meta: getDynamicMeta(defaultStatus)
    };
  }

  return {
    status: defaultStatus,
    statTags
  };
};

const errorResponseHandler = destResponse => {
  const { response } = destResponse;
  if (!response.error) {
    // successful response from facebook pixel api
    return destResponse;
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

const fbPixelResponseHandler = destinationResponse => {
  errorResponseHandler(destinationResponse);
  return {
    destinationResponse: destinationResponse.response,
    message: `[Facebook_pixel Response Handler] - Request Processed Successfully`,
    status: destinationResponse.status
  };
};

const networkHandler = function() {
  this.processAxiosResponse = processAxiosResponse;
  this.proxy = proxyRequest;
  this.prepareProxyRequest = prepareProxyRequest;
  this.responseHandler = fbPixelResponseHandler;
};

module.exports = {
  networkHandler
};
