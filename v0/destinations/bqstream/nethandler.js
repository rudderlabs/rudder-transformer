/* eslint-disable no-param-reassign */
const getValue = require("get-value");
const { sendRequest } = require("../../../adapters/network");
const { getDynamicMeta } = require("../../../adapters/utils/networkUtils");
const {
  DestinationResponseBuilder: DestinationRespBuilder
} = require("../../util/response-builders");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const { TRANSFORMER_METRIC } = require("../../util/constant");

const DESTINATION_NAME = "bqstream";

const trimBqStreamResponse = response => ({
  code: getValue(response, "response.response.data.error.code"), // data.error.status which contains PERMISSION_DENIED
  status: getValue(response, "response.response.status"),
  statusText: getValue(response, "response.response.statusText"),
  headers: getValue(response, "response.response.headers"),
  data: getValue(response, "response.response.data"), // Incase of errors, this contains error data
  success: getValue(response, "suceess")
});
/**
 * Obtains the Destination OAuth Error Category based on the error code obtained from destination
 *
 * - If an error code is such that the user will not be allowed inside the destination,
 * such error codes fall under DISABLE_DESTINATION
 * - If an error code is such that upon refresh we can get a new token which can be used to send event,
 * such error codes fall under REFRESH_TOKEN category
 * - If an error code doesn't fall under both categories, we can return an empty string
 * @param {string} errorCategory - The error code obtained from the destination
 * @returns Destination OAuth Error Category
 */
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
 * @param {Object} payload - Request to the destination will contain accessToken for OAuth supported destinations
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
  const isSuccess =
    !dresponse.error &&
    (!dresponse.insertErrors ||
      (dresponse.insertErrors && dresponse.insertErrors.length === 0));
  if (isSuccess) {
    return new DestinationRespBuilder()
      .setStatus(200)
      .setMessage("Request Processed successfully")
      .setAuthErrorCategory("")
      .setDestinationResponse({ ...dresponse, success: isSuccess })
      .setMetadata(metadata)
      .isFailure(!isSuccess)
      .setStatTags({
        destination: DESTINATION_NAME,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(200)
      })
      .setStatName(TRANSFORMER_METRIC.MEASUREMENT.INTEGRATION_SUCCESS_METRIC)
      .build();
  }
  /**
    {
      "status" : 429,
      "destination": {
        "response": "",
        "status": 200/400...
      },
      "apiLimit" {
        "available": 455,
        "resetAt": timestamp
      },
      "metadata": {},
      "message" : "simplified message for understannding"
    }
   */
  /** Reference-Link: https://cloud.google.com/bigquery/docs/error-messages */
  if (dresponse.error) {
    const destAuthCategory = getDestAuthCategory(dresponse.error.status);
    const status = destAuthCategory ? 500 : dresponse.error.code;
    throw new DestinationRespBuilder()
      .setStatus(status)
      .setMessage(dresponse.error.message)
      .setDestinationResponse({ ...dresponse, success: isSuccess })
      .setMetadata(metadata)
      .setAuthErrorCategory(destAuthCategory)
      .setAccessToken(accessToken)
      .isFailure(!isSuccess)
      .setStatName(TRANSFORMER_METRIC.MEASUREMENT.INTEGRATION_ERROR_METRIC)
      .setStatTags({
        destination: DESTINATION_NAME,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(status)
      })
      .build();
  } else if (dresponse.insertErrors && dresponse.insertErrors.length > 0) {
    const temp = trimBqStreamResponse(dresponse);
    throw new DestinationRespBuilder()
      .setStatus(400)
      .setMessage("Problem during insert operation")
      .setAuthErrorCategory("")
      .setDestinationResponse({ ...dresponse, success: isSuccess })
      .setMetadata(metadata)
      .setAccessToken(accessToken)
      .isFailure(!isSuccess)
      .setStatTags({
        destination: DESTINATION_NAME,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(temp.status || 400)
      })
      .setStatName(TRANSFORMER_METRIC.MEASUREMENT.INTEGRATION_ERROR_METRIC)
      .build();
  }
  throw new DestinationRespBuilder()
    .setStatus(400)
    .setMessage("Unhandled error type while sending to destination")
    .setAuthErrorCategory("")
    .setAccessToken(accessToken)
    .setDestinationResponse({ ...dresponse, success: isSuccess })
    .isFailure(!isSuccess)
    .setStatTags({
      destination: DESTINATION_NAME,
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
      meta: getDynamicMeta(400)
    })
    .setStatName(TRANSFORMER_METRIC.MEASUREMENT.INTEGRATION_ERROR_METRIC)
    .setMetadata(metadata)
    .build();
};

/**
 * This function sets the refreshed access token into the header for bqstream destination
 *
 * Note: This should be used only for OAuth Destinations.
 * For re-trial of event in case a Refresh token request takes place
 * @param {Object} payload - The event payload
 * @param {*} accessToken - AccessToken, this is more like a refreshed Access Token
 */
const putAccessTokenIntoPayload = payload => {
  const request = payload;
  request.headers.Authorization = `Bearer ${payload.accessToken}`;
};

const sendData = async payload => {
  const { metadata } = payload;
  if (payload.accessToken) {
    putAccessTokenIntoPayload(payload);
    delete payload.accessToken;
    if (payload.expirationDate) {
      delete payload.expirationDate;
    }
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

const responseTransform = async ({ payload, dResponse, status }) => {
  const { metadata } = payload;
  if (payload.accessToken) {
    putAccessTokenIntoPayload(payload);
    delete payload.accessToken;
    if (payload.expirationDate) {
      delete payload.expirationDate;
    }
  }
  const accessToken = getAccessTokenFromDestRequest(payload);
  let dresponse;
  try {
    dresponse = JSON.parse(dResponse);
  } catch (error) {
    throw new DestinationRespBuilder()
      .setStatus(430)
      .setAuthErrorCategory("")
      .setMessage("Uncaught error here")
      .setStatTags({
        destination: DESTINATION_NAME,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(400)
      })
      .setFailureAt("RESP_TRANSFORM_JSON_PARSING")
      .setDestinationResponse({ ...error, isSuccess: false })
      .isFailure(true)
      .build();
  }
  const parsedResponse = responseHandler({
    dresponse,
    metadata,
    accessToken
  });
  return {
    status: parsedResponse.status,
    destination: {
      response: parsedResponse.data,
      status
    },
    apiLimit: {
      available: "",
      resetAt: ""
    },
    metadata,
    message: parsedResponse.statusText || "Request Processed Successfully",
    statName: parsedResponse.statName,
    statTags: parsedResponse.statTags
  };
};

module.exports = { sendData, responseTransform };
