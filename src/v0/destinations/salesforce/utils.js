const {
  RetryableError,
  ThrottledError,
  AbortedError,
  OAuthSecretError,
  isDefinedAndNotNullAndNotEmpty,
} = require('@rudderstack/integrations-lib');
const { handleHttpRequest } = require('../../../adapters/network');
const {
  isHttpStatusSuccess,
  getAuthErrCategoryFromStCode,
  isDefinedAndNotNull,
} = require('../../util');
const Cache = require('../../util/cache');
const {
  ACCESS_TOKEN_CACHE_TTL,
  SF_TOKEN_REQUEST_URL_SANDBOX,
  SF_TOKEN_REQUEST_URL,
  DESTINATION,
  LEGACY,
  OAUTH,
  SALESFORCE_OAUTH_SANDBOX,
} = require('./config');

const ACCESS_TOKEN_CACHE = new Cache(ACCESS_TOKEN_CACHE_TTL);

/**
 * Extracts and returns the error message from a response object.
 * If the response is an array and contains a message in the first element,
 * it returns that message. Otherwise, it returns the stringified response.
 * Error Message Format Example: ref: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/errorcodes.htm#:~:text=Incorrect%20ID%20example
        [
        {
          "fields" : [ "Id" ],
          "message" : "Account ID: id value of incorrect type: 001900K0001pPuOAAU",
          "errorCode" : "MALFORMED_ID"
        }
        ]
 * @param {Object|Array} response - The response object or array to extract the message from.
 * @returns {string} The extracted error message or the stringified response.
 */

const getErrorMessage = (response) => {
  if (Array.isArray(response) && response?.[0]?.message && response?.[0]?.message?.length > 0) {
    return response[0].message;
  }
  return JSON.stringify(response);
};

/**
 * ref: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/errorcodes.htm
 * handles Salesforce application level failures
 * @param {*} destResponse
 * @param {*} sourceMessage
 * @param {*} stage
 * @param {String} authKey
 */
const salesforceResponseHandler = (destResponse, sourceMessage, authKey, authorizationFlow) => {
  const { status, response } = destResponse;

  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status) && status >= 400) {
    const matchErrorCode = (errorCode) =>
      response && Array.isArray(response) && response.some((resp) => resp?.errorCode === errorCode);
    if (status === 401 && authKey && matchErrorCode('INVALID_SESSION_ID')) {
      if (authorizationFlow === OAUTH) {
        throw new RetryableError(
          `${DESTINATION} Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${sourceMessage}`,
          500,
          destResponse,
          getAuthErrCategoryFromStCode(status),
        );
      }
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
    } else if (
      status === 400 &&
      matchErrorCode('CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY') &&
      (response?.message?.includes('UNABLE_TO_LOCK_ROW') ||
        response?.message?.includes('Too many SOQL queries'))
    ) {
      // handling the error case where the record is locked by another background job
      // this is a retryable error
      throw new RetryableError(
        `${DESTINATION} Request Failed - "${response.message}", (Retryable) ${sourceMessage}`,
        500,
        destResponse,
      );
    } else if (status === 503 || status === 500) {
      // The salesforce server is unavailable to handle the request. Typically this occurs if the server is down
      // for maintenance or is currently overloaded.
      // ref : https://help.salesforce.com/s/articleView?id=000387190&type=1
      if (matchErrorCode('SERVER_UNAVAILABLE')) {
        throw new ThrottledError(
          `${DESTINATION} Request Failed: ${status} - due to ${getErrorMessage(response)}, ${sourceMessage}`,
          destResponse,
        );
      } else {
        throw new RetryableError(
          `${DESTINATION} Request Failed: ${status} - due to "${getErrorMessage(response)}", (Retryable) ${sourceMessage}`,
          500,
          destResponse,
        );
      }
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
 * @param {destination: Record<string, any>, metadata: Record<string, object>}
 * @returns
 */
const getAccessTokenOauth = (metadata) => {
  if (!isDefinedAndNotNull(metadata?.secret)) {
    throw new OAuthSecretError(
      'Secret is undefined/null. This might be a platform issue. Please contact RudderStack support for assistance.',
    );
  }

  if (!isDefinedAndNotNullAndNotEmpty(metadata.secret?.access_token)) {
    throw new OAuthSecretError(
      'access_token is undefined/null. This might be a platform issue. Please contact RudderStack support for assistance.',
    );
  }

  if (!isDefinedAndNotNullAndNotEmpty(metadata.secret?.instance_url)) {
    throw new OAuthSecretError(
      'instance_url is undefined/null. This might be a platform issue. Please contact RudderStack support for assistance.',
    );
  }

  return {
    token: metadata.secret?.access_token,
    instanceUrl: metadata.secret?.instance_url,
  };
};

const getAccessToken = async ({ destination, metadata }) => {
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
    const { httpResponse, processedResponse } = await handleHttpRequest(
      'post',
      authUrl,
      {},
      {},
      {
        destType: 'salesforce',
        feature: 'transformation',
        endpointPath: '/services/oauth2/token',
        requestMethod: 'POST',
        module: 'router',
        metadata,
      },
    );
    // If the request fails, throwing error.
    if (!httpResponse.success) {
      salesforceResponseHandler(
        processedResponse,
        `:- authentication failed during fetching access token.`,
        accessTokenKey,
        LEGACY,
      );
    }
    const token = httpResponse.response.data;
    // If the httpResponse.success is true it will not come, It's an extra security for developer's.
    if (!token.access_token || !token.instance_url) {
      salesforceResponseHandler(
        processedResponse,
        `:- authentication failed could not retrieve authorization token.`,
        accessTokenKey,
        LEGACY,
      );
    }
    return {
      token: `Bearer ${token.access_token}`,
      instanceUrl: token.instance_url,
    };
  });
};

const collectAuthorizationInfo = async (event) => {
  let authorizationFlow;
  let authorizationData;
  const { Name } = event.destination.DestinationDefinition;
  const lowerCaseName = Name?.toLowerCase?.();
  if (isDefinedAndNotNull(event?.metadata?.secret) || lowerCaseName === SALESFORCE_OAUTH_SANDBOX) {
    authorizationFlow = OAUTH;
    authorizationData = getAccessTokenOauth(event.metadata);
  } else {
    authorizationFlow = LEGACY;
    authorizationData = await getAccessToken(event);
  }
  return { authorizationFlow, authorizationData };
};

const getAuthHeader = (authInfo) => {
  const { authorizationFlow, authorizationData } = authInfo;
  return authorizationFlow === OAUTH
    ? { Authorization: `Bearer ${authorizationData.token}` }
    : { Authorization: authorizationData.token };
};

module.exports = {
  getAccessTokenOauth,
  salesforceResponseHandler,
  getAccessToken,
  collectAuthorizationInfo,
  getAuthHeader,
};
