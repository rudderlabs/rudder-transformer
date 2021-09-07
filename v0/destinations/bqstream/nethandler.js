const getValue = require("get-value");
const { sendRequest } = require("../../../adapters/network");
const { trimResponse } = require("../../../adapters/utils/networkUtils");
const { ErrorBuilder } = require("../../util/index");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");

const trimBqStreamResponse = response => ({
  code: getValue(response, "response.response.data.error.code"), // data.error.status which contains PERMISSION_DENIED
  status: getValue(response, "response.response.status"),
  statusText: getValue(response, "response.response.statusText"),
  headers: getValue(response, "response.response.headers"),
  data: getValue(response, "response.response.data"), // Incase of errors, this contains error data
  success: getValue(response, "suceess")
});

const getDestAuthCategory = errorCategory => {
  switch (errorCategory) {
    case "PERMISSION_DENIED":
      return DISABLE_DEST;
    case "UNAUTHENTICATED":
      return REFRESH_TOKEN;
    default:
      return "";
  }
};

/**
 * Gets accessToken information from the destination request
 * This is used to send the information to the token endpoint for refreshing purposes
 *
 * @param {*} payload - Request to the destination will contain accessToken for OAuth supported destinations
 * @returns Access token from the request
 */
const getAccessTokenFromDestRequest = payload =>
  payload.headers.Authorization.split(" ")[1];

/**
 * This class actually handles the response for BigQuery Stream API
 * It can also be used for any Google related API but an API related handling has to be done separately
 *
 * Here we are only trying to handle OAuth related error(s)
 * Any destination specific error handling has to be done in their own way
 *
 * Reference doc for OAuth Errors
 * https://cloud.google.com/apigee/docs/api-platform/reference/policies/oauth-http-status-code-reference
 */
const responseHandler = ({
  dresponse,
  metadata,
  sourceMessage,
  authRequest,
  accessToken
} = {}) => {
  // success case
  if (dresponse.success) {
    const trimmedResponse = trimResponse(dresponse);
    const { data } = trimmedResponse;

    if (data && authRequest) {
      // for authentication requests
      return trimmedResponse;
    }

    if (data && !data.insertErrors) {
      // success
      return trimmedResponse;
    }
    /**
     * Not sure if such a scenario(http success but data not present) can happen in bigquery
     */
    // http success but data not present

    // throw new ErrorBuilder()
    //   .setStatus(500)
    //   .setMessage(`Request Failed for Marketo (Retryable).${sourceMessage}`)
    //   .setDestinationResponse({
    //     ...trimmedResponse,
    //     success: false
    //   })
    //   .setMetadata(metadata)
    //   .isTransformerNetwrokFailure(true)
    //   .build();
  }
  // http failure cases
  const { response } = dresponse.response;
  const destAuthCategory = getDestAuthCategory(response.data.error.status);
  const temp = trimBqStreamResponse(dresponse);
  throw new ErrorBuilder()
    .setStatus(temp.status || 500)
    .setMessage(temp.statusText)
    .setAuthErrorCategory(destAuthCategory)
    .setDestinationResponse({ ...temp, success: false })
    .setMetadata(metadata)
    .setAccessToken(accessToken)
    .isTransformerNetwrokFailure(true)
    .build();
};
// This should be used only for OAuth Destinations
// For re-trial of event in case a Refresh token request takes place
const putAccessTokenIntoPayload = (payload, accessToken) => {
  const request = payload;
  request.headers.Authorization = `Bearer ${accessToken}`;
};

const sendData = async payload => {
  const { metadata, accessToken: aToken } = payload;
  if (aToken) {
    putAccessTokenIntoPayload(payload, aToken);
    // eslint-disable-next-line no-param-reassign
    delete payload.accessToken;
  }
  const res = await sendRequest(payload);
  const accessToken = getAccessTokenFromDestRequest(payload);
  const parsedResponse = responseHandler({
    dresponse: res,
    metadata,
    accessToken
  });
  return {
    status: parsedResponse.status,
    destination: {
      response: parsedResponse.data,
      status: parsedResponse.status
    },
    apiLimit: {
      available: "",
      resetAt: ""
    },
    metadata,
    message: parsedResponse.statusText || "Request Processed Successfully"
  };
};

module.exports = { sendData };
