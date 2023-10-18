const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../util');
const { RetryableError, ThrottledError, AbortedError, NetworkError } = require('../../util/errorTypes');
const {
  DESTINATION,
} = require('./config');
const tags = require('../../util/tags');


/**
 * ref: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/errorcodes.htm
 * handles Salesforce application level failures
 * @param {*} destResponse
 * @param {*} sourceMessage
 * @param {*} stage
 * @param {String} authKey
 */
const salesforceResponseHandler = (destResponse, sourceMessage, authKey) => {
  const { status, response } = destResponse;

  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status) && status >= 400) {
    const matchErrorCode = (errorCode) =>
      response && Array.isArray(response) && response.some((resp) => resp?.errorCode === errorCode);
    if (status === 401 && authKey && matchErrorCode('INVALID_SESSION_ID')) {
      // checking for invalid/expired token errors and evicting cache in that case
      // rudderJobMetadata contains some destination info which is being used to evict the cache

      throw new NetworkError(
        `${DESTINATION} Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${sourceMessage}`,
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
        },
        response,
        getAuthErrCategoryFromStCode(status),
      );
    } else if (status === 403 && matchErrorCode('REQUEST_LIMIT_EXCEEDED')) {
      // If the error code is REQUEST_LIMIT_EXCEEDED, you’ve exceeded API request limits in your org.
      throw new ThrottledError(
        `${DESTINATION} Request Failed - due to "REQUEST_LIMIT_EXCEEDED", (Throttled) ${sourceMessage}`,
        destResponse,
      );
    } else if (
      status === 400 &&
      matchErrorCode('CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY') &&
      response.message.includes('UNABLE_TO_LOCK_ROW')
    ) {
      // handling the error case where the record is locked by another background job
      // this is a retryable error
      throw new RetryableError(
        `${DESTINATION} Request Failed - "Row locked due to another background running on the same object", (Retryable) ${sourceMessage}`,
        500,
        destResponse,
      );
    } else if (status === 503 || status === 500) {
      // The salesforce server is unavailable to handle the request. Typically this occurs if the server is down
      // for maintenance or is currently overloaded.
      throw new RetryableError(
        `${DESTINATION} Request Failed - due to "${
          response && Array.isArray(response) && response[0]?.message?.length > 0
            ? response[0].message
            : JSON.stringify(response)
        }", (Retryable) ${sourceMessage}`,
        500,
        destResponse,
      );
    }
    // check the error message
    let errorMessage = '';
    if (response && Array.isArray(response)) {
      errorMessage = response[0].message;
    }
    // aborting for all other error codes
    throw new AbortedError(
      `${DESTINATION} Request Failed: "${status}" due to "${
        errorMessage || JSON.stringify(response)
      }", (Aborted) ${sourceMessage}`,
      400,
      destResponse,
    );
  }
};

/**
 * Utility method to construct the header to be used for SFDC API calls
 * The "Authorization: Bearer <token>" header element needs to be passed
 * for authentication for all SFDC REST API calls
 * @param {*} destination
 * @returns
 */
const getAccessToken = (metadata) => ({
  token : metadata.secret.access_token,
  instanceUrl : metadata.secret.instance_url
});

module.exports = { getAccessToken, salesforceResponseHandler };
