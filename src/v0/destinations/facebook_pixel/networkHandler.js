const { isEmpty } = require('lodash');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { NetworkError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

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
const RETRYABLE_ERROR_CODES = [1, 2, 3, 341, 368, 5000];

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
    },
    // This error-subcode indicates that the business access token expired or is invalid or sufficient permissions are not provided
    // since there is involvement of changes required on dashboard to make event successful
    // for now, we are aborting this error-subCode combination
    33: {
      status: 400,
    },
  },
  1: {
    // An unknown error occurred.
    // This error may occur if you set level to adset but the correct value should be campaign
    99: {
      status: 400,
    },
  },
};

const getErrorDetailsFromErrorMap = (error) => {
  const { code, error_subcode: subCode } = error;
  let errDetails;
  if (!isEmpty(errorDetailsMap[code]) && subCode) {
    errDetails = errorDetailsMap[code][subCode];
  }
  return errDetails;
};

const getStatus = (error) => {
  const errorDetail = getErrorDetailsFromErrorMap(error);
  let errorStatus = 400;
  if (!isEmpty(errorDetail)) {
    errorStatus = errorDetail.status;
  }
  if (RETRYABLE_ERROR_CODES.includes(error.code)) {
    errorStatus = 500;
  }

  if (THROTTLED_ERROR_CODES.includes(error.code)) {
    errorStatus = 429;
  }

  return errorStatus;
};

const errorResponseHandler = (destResponse) => {
  const { response } = destResponse;
  if (!response.error) {
    // successful response from facebook pixel api
    return;
  }
  const { error } = response;
  const status = getStatus(error);
  throw new NetworkError(
    `Failed with ${error.message} during response transformation`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    { ...response, status: destResponse.status },
  );
};

const destResponseHandler = (destinationResponse) => {
  errorResponseHandler(destinationResponse);
  return {
    destinationResponse: destinationResponse.response,
    message: 'Request Processed Successfully',
    status: destinationResponse.status,
  };
};

const networkHandler = function () {
  // The order of execution also happens in this way
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = destResponseHandler;
};

module.exports = {
  networkHandler,
};
