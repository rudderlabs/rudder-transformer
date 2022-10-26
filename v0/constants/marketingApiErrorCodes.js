const { TRANSFORMER_METRIC } = require("../util/constant");

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
    },
    // This error-subcode indicates that the business access token expired or is invalid or sufficient permissions are not provided
    // since there is involvement of changes required on dashboard to make event successful
    // for now, we are aborting this error-subCode combination
    33: {
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

module.exports = {
  RETRYABLE_ERROR_CODES,
  THROTTLED_ERROR_CODES,
  errorDetailsMap
};
