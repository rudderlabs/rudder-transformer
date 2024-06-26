const { isEmpty } = require('lodash');
const get = require('get-value');
const {
  NetworkError,
  ConfigurationAuthError,
  isDefinedAndNotNull,
  ERROR_TYPES,
  TAG_NAMES,
  METADATA,
} = require('@rudderstack/integrations-lib');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { ErrorDetailsExtractorBuilder } = require('../../../util/error-extractor');
const { isHtmlFormat } = require('./index');

/**
 * Only under below mentioned scenario(s), add the errorCodes, subCodes etc,. to this map
 *
 * The actual API reference doc to which events from Rudderstack are being sent
 * https://developers.facebook.com/docs/marketing-api/reference/ads-pixel/events/v13.0
 *
 * The documents referred while formulating the error responses
 * 1. https://developers.facebook.com/docs/graph-api/guides/error-handling/
 *   - This seems like a generic document that contains errors possible for Graph API
 * 2. https://developers.facebook.com/docs/marketing-api/error-reference/
 *   - The doc seems to be more related to Marketing API
 * 3. https://developers.facebook.com/docs/marketing-api/error-reference/
{
  // A scenario where in we have to know the error with code and subcode, we can conclude that
  // this error will have a particular status, statTags
  code1: {
    subCode1: {
      status: ,
      // Only tags that are unique to this error needs to be provided
      statTags: {},
      messageDetails: {
        message: "",
        field:
      },

    }
  }
}
 */
const errorDetailsMap = {
  100: {
    // This error talks about event being sent after seven days or so
    2804003: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessageField('error_user_title')
      .build(),
    2804001: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessageField('error_user_title')
      .build(),
    2804007: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessageField('error_user_title')
      .build(),
    2804016: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessageField('error_user_title')
      .build(),
    2804017: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessageField('error_user_title')
      .build(),
    2804019: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessageField('error_user_title')
      .build(),
    2804048: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessageField('error_user_title')
      .build(),
    // This error-subcode indicates that the business access token expired or is invalid or sufficient permissions are not provided
    // since there is involvement of changes required on dashboard to make event successful
    // for now, we are aborting this error-subCode combination
    33: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessage(
        "Object with ID 'PIXEL_ID' / 'DATASET_ID' / 'AUDIENCE_ID' does not exist, cannot be loaded due to missing permissions, or does not support this operation",
      )
      .build(),
    default: new ErrorDetailsExtractorBuilder().setStatus(400).setMessageField('message').build(),
  },
  1: {
    // An unknown error occurred.
    // This error may occur if you set level to adset but the correct value should be campaign
    99: new ErrorDetailsExtractorBuilder()
      .setStatus(500)
      .setMessage(
        'This error may occur if you set level to adset but the correct value should be campaign',
      )
      .build(),
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(500)
      .setMessage('An unknown error occurred')
      .build(),
  },
  190: {
    460: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setStat({
        [TAG_NAMES.ERROR_TYPE]: ERROR_TYPES.AUTH,
      })
      .setMessage(
        'The session has been invalidated because the user changed their password or Facebook has changed the session for security reasons',
      )
      .build(),

    463: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setStat({
        [TAG_NAMES.ERROR_TYPE]: ERROR_TYPES.AUTH,
      })
      .setMessageField('message')
      .build(),
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setStat({
        [TAG_NAMES.ERROR_TYPE]: ERROR_TYPES.AUTH,
      })
      .setMessage('Invalid OAuth 2.0 access token')
      .build(),
  },
  3: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessage('Capability or permissions issue.')
      .build(),
  },
  2: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(500)
      .setMessage('Temporary issue due to downtime.')
      .build(),
  },
  341: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(500)
      .setMessage('Application limit reached: Temporary issue due to downtime or throttling')
      .build(),
  },
  368: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(500)
      .setMessage('Temporarily blocked for policies violations.')
      .build(),
  },
  5000: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(500)
      .setMessage('Unknown Error Code')
      .build(),
  },
  4: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(429)
      .setMessage('API Too Many Calls')
      .build(),
  },
  17: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(429)
      .setMessage('API User Too Many Calls')
      .build(),
  },
  // facebook custom audience related error codes
  // ref:
  // https://developers.facebook.com/docs/marketing-api/reference/custom-audience/#error-codes-4
  // https://developers.facebook.com/docs/marketing-api/error-reference/
  294: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessage(
        'Missing permission. Please make sure you have ads_management permission and the application is included in the allowlist',
      )
      .build(),
  },
  1487301: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessage(
        'Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account',
      )
      .build(),
  },
  1487366: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessage('Custom Audience Has Been Deleted')
      .build(),
  },
  2650: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessage('Failed to update the custom audience')
      .build(),
  },
  105: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(400)
      .setMessage('The number of parameters exceeded the maximum for this operation')
      .build(),
  },
  80003: {
    default: new ErrorDetailsExtractorBuilder()
      .setStatus(429)
      .setMessage('There have been too many calls to this ad-account.')
      .build(),
  },
  200: {
    default: new ErrorDetailsExtractorBuilder().setStatus(403).setMessageField('message').build(),
  },
};

const getErrorDetailsFromErrorMap = (error) => {
  const { code, error_subcode: subCode } = error;
  let errDetails;
  if (!isEmpty(errorDetailsMap[code])) {
    errDetails = errorDetailsMap[code][subCode] || errorDetailsMap[code]?.default;
  }
  return errDetails;
};

const getStatus = (error) => {
  const errorDetail = getErrorDetailsFromErrorMap(error);
  let errorStatus = 500;
  const isErrorDetailEmpty = isEmpty(errorDetail);
  if (isErrorDetailEmpty) {
    // Unhandled error response
    return {
      status: errorStatus,
      stats: { [TAG_NAMES.META]: METADATA.UNHANDLED_STATUS_CODE },
    };
  }
  errorStatus = errorDetail.status;

  let errorMessage = errorDetail?.messageDetails?.message;
  if (errorDetail?.messageDetails?.field) {
    errorMessage = get(error, errorDetail?.messageDetails?.field);
  }

  return { status: errorStatus, errorMessage, stats: errorDetail?.stat };
};

const errorResponseHandler = (destResponse) => {
  const { response } = destResponse;
  if (!response.error) {
    // successful response from facebook pixel api
    return;
  }
  const { error } = response;
  const { status, errorMessage, stats: errorStatTags } = getStatus(error);
  if (
    isDefinedAndNotNull(errorStatTags) &&
    errorStatTags?.[TAG_NAMES.ERROR_TYPE] === ERROR_TYPES.AUTH
  ) {
    throw new ConfigurationAuthError(errorMessage, { ...response, status: destResponse.status });
  }
  throw new NetworkError(
    `${errorMessage || error.message || 'Unknown failure during response transformation'}`,
    status,
    {
      ...errorStatTags,
      [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    { ...response, status: destResponse.status },
  );
};

const destResponseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;

  // check If the response is in html format
  if (isHtmlFormat(destinationResponse.response) || isHtmlFormat(destinationResponse)) {
    throw new NetworkError(
      'Invalid response format (HTML) during response transformation',
      500,
      {
        [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(destinationResponse.status),
      },
      destinationResponse,
    );
  }
  errorResponseHandler(destinationResponse);
  return {
    destinationResponse: destinationResponse.response,
    message: 'Request Processed Successfully',
    status: destinationResponse.status,
  };
};

function networkHandler() {
  // The order of execution also happens in this way
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = destResponseHandler;
}

module.exports = {
  networkHandler,
  errorResponseHandler,
};
