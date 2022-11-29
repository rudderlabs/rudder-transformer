const { handleHttpRequest } = require("../../../adapters/network");
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
    const { httpResponse, processedResponse } = await handleHttpRequest(
      "post",
      [authUrl, {}]
    );
    // const salesforceAxiosResponse = processAxiosResponse(
    //   salesforceAuthorisationData
    // );
    // If the request fails, throwing error.
    if (!httpResponse.success) {
      const { error } = httpResponse.response.response.data;
      throw new ApiError(
        `${DESTINATION} Request Failed: access token could not be generated due to ${error}`,
        400,
        {
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
        },
        processedResponse.response,
        undefined,
        DESTINATION
      );
    }
    const token = httpResponse.response.data;
    return {
      token: `Bearer ${token.access_token}`,
      instanceUrl: token.instance_url
    };
  });
};

const salesforceResponseHandler = (
  destResponse,
  sourceMessage,
  stage,
  authKey
) => {
  const { status, response } = destResponse;

  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    const isTokenExpiredError =
      response &&
      Array.isArray(response) &&
      response?.some(resp => {
        return resp.errorCode === "INVALID_SESSION_ID";
      });
    if (status === 401 && authKey && isTokenExpiredError) {
      // checking for invalid/expired token errors and evicting cache in that case
      // rudderJobMetadata contains some destination info which is being used to evict the cache
      ACCESS_TOKEN_CACHE.del(authKey);
      throw new ApiError(
        `${DESTINATION} Request Failed - due to ${response[0].message}, (Retryable).${sourceMessage}`,
        500,
        {
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE,
          stage
        },
        response,
        undefined,
        DESTINATION
      );
    }
    // check the error message
    let errorMessage = "";
    if (response && Array.isArray(response)) {
      errorMessage = response[0].message;
    }

    throw new ApiError(
      `${DESTINATION} Request Failed: ${status} due to ${errorMessage}, Aborted.`,
      status,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE,
        stage
      },
      destResponse,
      undefined,
      DESTINATION
    );
  }
};

module.exports = { getAccessToken, salesforceResponseHandler };
