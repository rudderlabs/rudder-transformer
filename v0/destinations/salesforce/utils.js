const { logger } = require("../../../logger");
const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse,
  getDynamicMeta
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const Cache = require("../../util/cache");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { ApiError } = require("../../util/errors");
const {
  ACCESS_TOKEN_CACHE_TTL,
  SF_TOKEN_REQUEST_URL_SANDBOX,
  SF_TOKEN_REQUEST_URL,
  DESTINATION
} = require("./config");

const DESTINATION_NAME = "salesforce";

const ACCESS_TOKEN_CACHE = new Cache(ACCESS_TOKEN_CACHE_TTL);

// Utility method to construct the header to be used for SFDC API calls
// The "Authorization: Bearer <token>" header element needs to be passed for
// authentication for all SFDC REST API calls
const getAccessToken = async destination => {
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
    }&password=${encodeURIComponent(
      destination.Config.password
    )}${encodeURIComponent(destination.Config.initialAccessToken)}&client_id=${
      destination.Config.consumerKey
    }&client_secret=${destination.Config.consumerSecret}&grant_type=password`;
    const salesforceAuthorisationData = await httpPOST(authUrl, {});
    const salesforceAxiosResponse = processAxiosResponse(
      salesforceAuthorisationData
    );
    // If the request fails, throwing error.
    if (salesforceAuthorisationData.success === false) {
      const { error } = salesforceAuthorisationData.response.response.data;
      throw new ApiError(
        `Request Failed for Salesforce, access token could not be generated due to ${error}`,
        400,
        {
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
        },
        salesforceAxiosResponse.response,
        undefined,
        DESTINATION_NAME
      );
    }
    const token = salesforceAuthorisationData.response.data;
    return {
      token: `Bearer ${token.access_token}`,
      instanceUrl: token.instance_url
    };
  });
};

const processResponseHandler = (
  destResponse,
  sourceMessage,
  stage,
  authKey
) => {
  const { status, response } = destResponse;

  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    if (status === 401 && authKey) {
      if (
        response &&
        Array.isArray(response) &&
        response[0].errorCode === "INVALID_SESSION_ID"
      ) {
        // checking for invalid/expired token errors and evicting cache in that case
        // rudderJobMetadata contains some destination info which is being used to evict the cache
        ACCESS_TOKEN_CACHE.del(authKey);
        throw new ApiError(
          `Request Failed for Salesforce due to ${response[0].message}, (Retryable).${sourceMessage}`,
          500,
          {
            scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
            meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
          },
          sourceMessage,
          undefined,
          DESTINATION
        );
      }
    }
    let errorMessage = "";
    if (response && Array.isArray(response)) {
      errorMessage = response[0].message;
    }

    throw new ApiError(
      `[Salesforce Response Handler] - Request failed  with status: ${status} due to ${errorMessage}`,
      status,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(status)
      },
      400,
      undefined,
      DESTINATION
    );
  }
  if (isHttpStatusSuccess(status)) {
    // checking for invalid/expired token errors and evicting cache in that case
    // rudderJobMetadata contains some destination info which is being used to evict the cache
    if (
      response &&
      Array.isArray(response) &&
      response[0].errorCode === "INVALID_SESSION_ID" &&
      authKey &&
      ACCESS_TOKEN_CACHE
    ) {
      logger.info(
        `[Salesforce] Cache token evicting due to invalid/expired access_token for destinationId (${authKey})`
      );
      ACCESS_TOKEN_CACHE.del(authKey);
      throw new ApiError(
        `Request Failed for Salesforce, (Retryable).${sourceMessage}`,
        500,
        {
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
        },
        sourceMessage,
        undefined,
        DESTINATION
      );
    }
  }
};

module.exports = { getAccessToken, processResponseHandler };
