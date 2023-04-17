const { handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util');
const Cache = require('../../util/cache');
const { RetryableError, ThrottledError, AbortedError } = require('../../util/errorTypes');
const {
  ACCESS_TOKEN_CACHE_TTL,
  SF_TOKEN_REQUEST_URL_SANDBOX,
  SF_TOKEN_REQUEST_URL,
  DESTINATION,
} = require('./config');

const ACCESS_TOKEN_CACHE = new Cache(ACCESS_TOKEN_CACHE_TTL);

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
      ACCESS_TOKEN_CACHE.del(authKey);
      throw new RetryableError(
        `${DESTINATION} Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${sourceMessage}`,
        500,
        destResponse,
      );
    } else if (status === 403 && matchErrorCode('REQUEST_LIMIT_EXCEEDED')) {
      // If the error code is REQUEST_LIMIT_EXCEEDED, you’ve exceeded API request limits in your org.
      throw new ThrottledError(
        `${DESTINATION} Request Failed - due to "REQUEST_LIMIT_EXCEEDED", (Throttled) ${sourceMessage}`,
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
const getAccessToken = async (destination) => {
  const accessTokenKey = destination.ID;

  return ACCESS_TOKEN_CACHE.get(accessTokenKey, async () => {
    let SF_TOKEN_URL;
    if (destination.Config.sandbox) {
      SF_TOKEN_URL = SF_TOKEN_REQUEST_URL_SANDBOX;
    } else {
      SF_TOKEN_URL = SF_TOKEN_REQUEST_URL;
    }
    const authUrl = `${SF_TOKEN_URL}?username=${
      destination.Config.userName
    }&password=${encodeURIComponent(destination.Config.password)}${encodeURIComponent(
      destination.Config.initialAccessToken,
    )}&client_id=${destination.Config.consumerKey}&client_secret=${
      destination.Config.consumerSecret
    }&grant_type=password`;
    const { httpResponse, processedResponse } = await handleHttpRequest('post', authUrl, {});
    // If the request fails, throwing error.
    if (!httpResponse.success) {
      salesforceResponseHandler(
        processedResponse,
        `:- authentication failed during fetching access token.`,
        accessTokenKey,
      );
    }
    const token = httpResponse.response.data;
    // If the httpResponse.success is true it will not come, It's an extra security for developer's.
    if (!token.access_token || !token.instance_url) {
      salesforceResponseHandler(
        processedResponse,
        `:- authentication failed could not retrieve authorization token.`,
        accessTokenKey,
      );
    }
    return {
      token: `Bearer ${token.access_token}`,
      instanceUrl: token.instance_url,
    };
  });
};

module.exports = { getAccessToken, salesforceResponseHandler };
