const {
  RetryableError,
  ThrottledError,
  AbortedError,
  OAuthSecretError,
  isDefinedAndNotNull,
} = require('@rudderstack/integrations-lib');
const { handleHttpRequest } = require('../../../adapters/network');
const { getAuthErrCategoryFromStCode } = require('../../util');
const Cache = require('../../util/cache');
const {
  ACCESS_TOKEN_CACHE_TTL,
  SF_TOKEN_REQUEST_URL_SANDBOX,
  SF_TOKEN_REQUEST_URL,
  DESTINATION,
  LEGACY,
  OAUTH,
  SALESFORCE_OAUTH,
  SALESFORCE_OAUTH_SANDBOX,
} = require('./config');

const ACCESS_TOKEN_CACHE = new Cache(ACCESS_TOKEN_CACHE_TTL);

// ref: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/errorcodes.htm?q=error%20code
/**
 * 
 * @param {*} response is of structure
 * [
 * {
 *  "message" : "The requested resource does not exist",
 *  "errorCode" : "NOT_FOUND"
}
]
 * @returns error message
 */
const getErrorMessage = (response) => {
  if (response && Array.isArray(response) && response[0]?.message?.length > 0) {
    return response[0].message;
  }
  return JSON.stringify(response);
};

const handleAuthError = (
  errorCode,
  authKey,
  authorizationFlow,
  sourceMessage,
  destResponse,
  status,
) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (errorCode) {
    case 'INVALID_SESSION_ID':
      if (authorizationFlow === OAUTH) {
        throw new RetryableError(
          `${DESTINATION} Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${sourceMessage}`,
          500,
          destResponse,
          getAuthErrCategoryFromStCode(status),
        );
      }
      ACCESS_TOKEN_CACHE.del(authKey);
      throw new RetryableError(
        `${DESTINATION} Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${sourceMessage}`,
        500,
        destResponse,
      );
    default:
      throw new AbortedError(
        `${DESTINATION} Request Failed: "${status}" due to "${getErrorMessage(destResponse.response)}", (Aborted) ${sourceMessage}`,
        400,
        destResponse,
      );
  }
};

const handleCommonAbortableError = (destResponse, sourceMessage, status) => {
  throw new AbortedError(
    `${DESTINATION} Request Failed: "${status}" due to "${getErrorMessage(destResponse.response)}", (Aborted) ${sourceMessage}`,
    400,
    destResponse,
  );
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

  /**
   *
   * @param {*} errorCode
   * response is of structure
   * [
   * {
   *  "message" : "Request limit exceeded",
   *  "errorCode" : "REQUEST_LIMIT_EXCEEDED"
   * }
   * ]
   * @returns true if errorCode is found in the response
   */
  const matchErrorCode = (errorCode) =>
    response && Array.isArray(response) && response.some((resp) => resp?.errorCode === errorCode);

  switch (status) {
    case 401: {
        let errorCode = 'DEFAULT';
        if (authKey && matchErrorCode('INVALID_SESSION_ID')) {
          errorCode = 'INVALID_SESSION_ID';
        }
        handleAuthError(errorCode, authKey, authorizationFlow, sourceMessage, destResponse, status);
        break;
      }
    case 403:
      if (matchErrorCode('REQUEST_LIMIT_EXCEEDED')) {
        throw new ThrottledError(
          `${DESTINATION} Request Failed - due to "REQUEST_LIMIT_EXCEEDED", (Throttled) ${sourceMessage}`,
          destResponse,
        );
      }
      handleCommonAbortableError(destResponse, sourceMessage, status);
      break;

    case 400:
      if (
        matchErrorCode('CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY') &&
        (response?.message?.includes('UNABLE_TO_LOCK_ROW') ||
          response?.message?.includes('Too many SOQL queries'))
      ) {
        throw new RetryableError(
          `${DESTINATION} Request Failed - "${response.message}", (Retryable) ${sourceMessage}`,
          500,
          destResponse,
        );
      }
      handleCommonAbortableError(destResponse, sourceMessage, status);
      break;

    case 503:
    case 500:
      throw new RetryableError(
        `${DESTINATION} Request Failed: ${status} - due to "${getErrorMessage(response)}", (Retryable) ${sourceMessage}`,
        500,
        destResponse,
      );

    default:
      // Default case: aborting for all other error codes
      throw new AbortedError(
        `${DESTINATION} Request Failed: "${status}" due to "${getErrorMessage(response)}", (Aborted) ${sourceMessage}`,
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
    throw new OAuthSecretError('secret is undefined/null');
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
  if (lowerCaseName === SALESFORCE_OAUTH_SANDBOX || lowerCaseName === SALESFORCE_OAUTH) {
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
