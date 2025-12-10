const {
  RetryableError,
  ThrottledError,
  AbortedError,
  OAuthSecretError,
  isDefinedAndNotNullAndNotEmpty,
  NetworkInstrumentationError,
} = require('@rudderstack/integrations-lib');
const { handleHttpRequest } = require('../../../adapters/network');
const {
  isHttpStatusSuccess,
  getAuthErrCategoryFromStCode,
  isDefinedAndNotNull,
} = require('../../util');
const Cache = require('../../util/cache');
const stats = require('../../../util/stats');
const {
  CLIENT_ID,
  CLIENT_SECRET,
  ACCESS_TOKEN_CACHE_TTL,
  SF_TOKEN_REQUEST_URL_SANDBOX,
  SF_TOKEN_REQUEST_URL,
  DESTINATION,
  LEGACY,
  OAUTH,
  SALESFORCE_OAUTH_SANDBOX,
  SF_API_VERSION,
} = require('./config');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');

const ACCESS_TOKEN_CACHE = new Cache('SALESFORCE_ACCESS_TOKEN', ACCESS_TOKEN_CACHE_TTL);

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
    )}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=password`;
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

const isWorkspaceSupportedForSoql = (workspaceId) => {
  const soqlSupportedWorkspaceIds = process.env.DEST_SALESFORCE_SOQL_SUPPORTED_WORKSPACE_IDS?.split(
    ',',
  )?.map?.((s) => s?.trim?.());
  return soqlSupportedWorkspaceIds?.includes(workspaceId) ?? false;
};

/**
 * Look up to salesforce using details passed as external id through payload
 *
 * @param {string} objectType The Salesforce object type.
 * @param {string} identifierType The Salesforce field type.
 * @param {string} identifierValue The Salesforce field value.
 * @param {{ destination: Record<string, any>, metadata: Record<string, object> }} params The destination and metadata.
 * @param {{ authorizationData: Record<string, any>, authorizationFlow: string }} authInfo The authorization data and flow.
 * @returns {Promise<string>} The Salesforce ID for the record. Returns undefined if the record is not found.
 */
async function getSalesforceIdForRecordUsingHttp(
  objectType,
  identifierType,
  identifierValue,
  { destination, metadata },
  authInfo,
) {
  const { authorizationData, authorizationFlow } = authInfo;
  const objSearchUrl = `${authorizationData.instanceUrl}/services/data/v${SF_API_VERSION}/parameterizedSearch/?q=${identifierValue}&sobject=${objectType}&in=${identifierType}&${objectType}.fields=id,${identifierType}`;
  const { processedResponse: processedsfSearchResponse } = await handleHttpRequest(
    'get',
    objSearchUrl,
    {
      headers: getAuthHeader({ authorizationFlow, authorizationData }),
    },
    {
      metadata,
      destType: 'salesforce',
      feature: 'transformation',
      endpointPath: '/parameterizedSearch',
      requestMethod: 'GET',
      module: 'router',
    },
  );
  if (!isHttpStatusSuccess(processedsfSearchResponse.status)) {
    salesforceResponseHandler(
      processedsfSearchResponse,
      `:- SALESFORCE SEARCH BY ID`,
      destination.ID,
      authorizationFlow,
    );
  }
  const searchRecord = processedsfSearchResponse.response?.searchRecords?.find(
    (rec) =>
      typeof identifierValue !== 'undefined' &&
      // eslint-disable-next-line eqeqeq
      rec[identifierType] == identifierValue,
  );

  return searchRecord?.Id;
}

/**
 * Get the Salesforce ID for a record using the Salesforce SDK
 * @param {SalesforceSDK} salesforceSdk The Salesforce SDK instance.
 * @param {string} objectType The Salesforce object type.
 * @param {string} identifierType The Salesforce field type.
 * @param {string} identifierValue The Salesforce field value.
 * @returns {Promise<string>} The Salesforce ID for the record. Returns undefined if the record is not found.
 */
async function getSalesforceIdForRecordUsingSdk(
  salesforceSdk,
  objectType,
  identifierType,
  identifierValue,
) {
  let queryResponse;
  try {
    queryResponse = await salesforceSdk.query(
      `SELECT Id FROM ${objectType} WHERE ${identifierType} = '${identifierValue}'`,
    );
  } catch (error) {
    // check if the error message contains 'session expired'
    if (
      typeof error.message === 'string' &&
      error.message.toLowerCase().includes('session expired')
    ) {
      throw new RetryableError(
        `${DESTINATION} Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${error.message}`,
        500,
        {
          message: error.message,
          status: 401,
          response: {
            errorCode: 'INVALID_SESSION_ID',
            message: error.message,
          },
        },
        REFRESH_TOKEN,
      );
    }
    throw new NetworkInstrumentationError(`Failed to query Salesforce: ${error.message}`);
  }

  if (queryResponse.totalSize > 1) {
    throw new NetworkInstrumentationError(
      `Multiple ${objectType} records found with ${identifierType} '${identifierValue}'`,
    );
  }

  if (queryResponse.totalSize === 0) {
    return undefined;
  }
  return queryResponse.records[0].Id;
}

/**
 * Get the Salesforce ID for a record using the Salesforce SDK or HTTP
 * @param {string} objectType The Salesforce object type.
 * @param {string} identifierType The Salesforce field type.
 * @param {string} identifierValue The Salesforce field value.
 * @param {Record<string, any>} destination The destination.
 * @param {Record<string, any>} metadata The metadata.
 * @param {Record<string, any>} stateInfo The state info.
 * @returns {Promise<string>} The Salesforce ID for the record. Returns undefined if the record is not found.
 */
async function getSalesforceIdForRecord({
  objectType,
  identifierType,
  identifierValue,
  destination,
  metadata,
  stateInfo,
}) {
  if (isWorkspaceSupportedForSoql(metadata?.workspaceId ?? '')) {
    stats.increment('salesforce_soql_lookup_count', {
      method: 'getSalesforceIdForRecordUsingSdk',
      workspaceId: metadata?.workspaceId ?? '',
      objectType,
    });
    return getSalesforceIdForRecordUsingSdk(
      stateInfo.salesforceSdk,
      objectType,
      identifierType,
      identifierValue,
    );
  }

  return getSalesforceIdForRecordUsingHttp(
    objectType,
    identifierType,
    identifierValue,
    { destination, metadata },
    stateInfo.authInfo,
  );
}

/**
 * Get the Salesforce ID for a lead using the Salesforce SDK
 * @param {SalesforceSDK} salesforceSdk The Salesforce SDK instance.
 * @param {string} email The email of the lead.
 * @param {Record<string, any>} destination The destination.
 * @returns {Promise<{ salesforceType: string, salesforceId: string }>} The Salesforce type and ID for the lead.
 */
async function getSalesforceIdForLeadUsingSdk(salesforceSdk, email, destination) {
  let queryResponse;
  try {
    queryResponse = await salesforceSdk.query(
      `SELECT Id, IsConverted, ConvertedContactId, IsDeleted FROM Lead WHERE Email = '${email}'`,
    );
  } catch (error) {
    // check if the error message contains 'session expired'
    if (
      typeof error.message === 'string' &&
      error.message.toLowerCase().includes('session expired')
    ) {
      throw new RetryableError(
        `${DESTINATION} Request Failed - due to "INVALID_SESSION_ID", (Retryable) ${error.message}`,
        500,
        {
          message: error.message,
          status: 401,
          response: {
            errorCode: 'INVALID_SESSION_ID',
            message: error.message,
          },
        },
        REFRESH_TOKEN,
      );
    }
    throw new NetworkInstrumentationError(`Failed to query Salesforce: ${error.message}`);
  }
  if (queryResponse.totalSize === 0) {
    return {
      salesforceType: 'Lead',
      salesforceId: undefined,
    };
  }

  if (queryResponse.totalSize > 1) {
    throw new NetworkInstrumentationError(`Multiple lead records found with email '${email}'`);
  }

  // If exactly one record is found, check if the lead has been deleted
  const record = queryResponse.records[0];
  if (record.IsDeleted === true) {
    if (record.IsConverted) {
      throw new NetworkInstrumentationError('The contact has been deleted');
    }
    throw new NetworkInstrumentationError('The lead has been deleted.');
  }
  if (record.IsConverted && destination.Config.useContactId) {
    if (record.ConvertedContactId === null) {
      throw new NetworkInstrumentationError(
        'The lead is converted but the converted contact id not found',
      );
    }
    return {
      salesforceType: 'Contact',
      salesforceId: record.ConvertedContactId,
    };
  }
  return {
    salesforceType: 'Lead',
    salesforceId: record.Id,
  };
}

/**
 * Get the Salesforce ID for a lead using HTTP
 * @param {string} email The email of the lead.
 * @param {Record<string, any>} destination The destination.
 * @param {Record<string, any>} authInfo The authorization info.
 * @param {Record<string, any>} metadata The metadata.
 * @returns {Promise<{ salesforceType: string, salesforceId: string }>} The Salesforce type and ID for the lead.
 */
async function getSalesforceIdForLeadUsingHttp(email, destination, authInfo, metadata) {
  const encodedEmail = encodeURIComponent(email);
  const { authorizationData, authorizationFlow } = authInfo;
  const leadQueryUrl = `${authorizationData.instanceUrl}/services/data/v${SF_API_VERSION}/parameterizedSearch/?q=${encodedEmail}&sobject=Lead&Lead.fields=id,IsConverted,ConvertedContactId,IsDeleted`;

  // request configuration will be conditional
  const { processedResponse: processedLeadQueryResponse } = await handleHttpRequest(
    'get',
    leadQueryUrl,
    {
      headers: getAuthHeader({ authorizationFlow, authorizationData }),
    },
    {
      metadata,
      destType: 'salesforce',
      feature: 'transformation',
      endpointPath: '/parameterizedSearch',
      requestMethod: 'GET',
      module: 'router',
    },
  );

  if (!isHttpStatusSuccess(processedLeadQueryResponse.status)) {
    salesforceResponseHandler(
      processedLeadQueryResponse,
      `:- during Lead Query`,
      destination.ID,
      authorizationFlow,
    );
  }

  if (processedLeadQueryResponse.response.searchRecords.length > 0) {
    // if count is greater than zero, it means that lead exists, then only update it
    // else the original endpoint, which is the one for creation - can be used
    const record = processedLeadQueryResponse.response.searchRecords[0];
    if (record.IsDeleted === true) {
      if (record.IsConverted) {
        throw new NetworkInstrumentationError('The contact has been deleted.');
      } else {
        throw new NetworkInstrumentationError('The lead has been deleted.');
      }
    }
    if (record.IsConverted && destination.Config.useContactId) {
      return {
        salesforceType: 'Contact',
        salesforceId: record.ConvertedContactId,
      };
    }
    return {
      salesforceType: 'Lead',
      salesforceId: record.Id,
    };
  }
  return {
    salesforceType: 'Lead',
    salesforceId: undefined,
  };
}

/**
 * Get the Salesforce ID for a lead using the Salesforce SDK or HTTP
 * @param {string} email The email of the lead.
 * @param {Record<string, any>} destination The destination.
 * @param {Record<string, any>} metadata The metadata.
 * @param {Record<string, any>} stateInfo The state info.
 * @returns {Promise<{ salesforceType: string, salesforceId: string }>} The Salesforce type and ID for the lead.
 */
async function getSalesforceIdForLead({ email, destination, metadata, stateInfo }) {
  if (isWorkspaceSupportedForSoql(metadata?.workspaceId ?? '')) {
    stats.increment('salesforce_soql_lookup_count', {
      method: 'getSalesforceIdForLeadUsingSdk',
      workspaceId: metadata?.workspaceId ?? '',
      objectType: 'Lead',
    });
    return getSalesforceIdForLeadUsingSdk(stateInfo.salesforceSdk, email, destination);
  }
  return getSalesforceIdForLeadUsingHttp(email, destination, stateInfo.authInfo, metadata);
}

module.exports = {
  getAccessTokenOauth,
  salesforceResponseHandler,
  getAccessToken,
  collectAuthorizationInfo,
  getAuthHeader,
  getSalesforceIdForRecord,
  getSalesforceIdForRecordUsingHttp,
  getSalesforceIdForRecordUsingSdk,
  getSalesforceIdForLead,
  getSalesforceIdForLeadUsingHttp,
  getSalesforceIdForLeadUsingSdk,
  isWorkspaceSupportedForSoql,
};
