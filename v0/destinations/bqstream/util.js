/* eslint-disable no-param-reassign */
const getValue = require("get-value");
const {
  getDynamicMeta,
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const {
  DISABLE_DEST,
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { isHttpStatusSuccess } = require("../../util");
const ErrorBuilder = require("../../util/error");
const { proxyRequest } = require("../../../adapters/network");

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

const destToRudderStatusMap = {
  403: {
    rateLimitExceeded: 429,
    default: 400
  },
  400: {
    tableUnavailable: 500,
    default: 400
  },
  500: { default: 500 },
  503: { default: 500 },
  401: { default: 500 },
  404: { default: 400 },
  501: { default: 400 }
};

const getStatusAndCategory = (dresponse, status) => {
  const authErrorCategory = getDestAuthCategory(dresponse.error.status);
  const reason =
    dresponse.error.errors &&
    Array.isArray(dresponse.error.errors) &&
    dresponse.error.errors.length > 0 &&
    dresponse.error.errors[0].reason;

  const trStatus = destToRudderStatusMap[status]
    ? destToRudderStatusMap[status][reason] ||
      destToRudderStatusMap[status].default
    : 500;
  return { status: trStatus, authErrorCategory };
};

/**
 * This class actually handles the response for BigQuery Stream API
 * It can also be used for any Google related API but an API related handling has to be done separately
 *
 * Here we are only trying to handle OAuth related error(s)
 * Any destination specific error handling has to be done in their own way
 *
 * Reference doc for OAuth Errors
 * 1. https://cloud.google.com/apigee/docs/api-platform/reference/policies/oauth-http-status-code-reference
 * 2. https://cloud.google.com/bigquery/docs/error-messages
 *
 * Summary:
 * Abortable -> 403, 501, 400
 * Retryable -> 5[0-9][02-9], 401(UNAUTHENTICATED)
 * "Special Cases":
 * status=200, resp.insertErrors.length > 0  === Failure
 * 403 => AccessDenied -> DISABLE_DEST, other 403 => Just abort
 *
 */
const processResponse = ({ dresponse, status } = {}) => {
  const isSuccess =
    !dresponse.error &&
    isHttpStatusSuccess(status) &&
    (!dresponse.insertErrors ||
      (dresponse.insertErrors && dresponse.insertErrors.length === 0));

  if (!isSuccess) {
    if (dresponse.error) {
      const { status: trStatus, authErrorCategory } = getStatusAndCategory(
        dresponse,
        status
      );
      throw new ErrorBuilder()
        .setStatus(trStatus)
        .setMessage(
          dresponse.error.message ||
            `Request failed for ${DESTINATION_NAME} with status: ${status}`
        )
        .setDestinationResponse(dresponse)
        .setAuthErrorCategory(authErrorCategory)
        .isTransformResponseFailure(!isSuccess)
        .setStatTags({
          destination: DESTINATION_NAME,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
          meta: getDynamicMeta(trStatus)
        })
        .build();
    } else if (dresponse.insertErrors && dresponse.insertErrors.length > 0) {
      const temp = trimBqStreamResponse(dresponse);
      throw new ErrorBuilder()
        .setStatus(400)
        .setMessage("Problem during insert operation")
        .setDestinationResponse(dresponse)
        .setAuthErrorCategory("")
        .isTransformResponseFailure(!isSuccess)
        .setStatTags({
          destination: DESTINATION_NAME,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
          meta: getDynamicMeta(temp.status || 400)
        })
        .build();
    }
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("Unhandled error type while sending to destination")
      .setAuthErrorCategory("")
      .setDestinationResponse(dresponse)
      .isTransformResponseFailure(!isSuccess)
      .setStatTags({
        destination: DESTINATION_NAME,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.EXCEPTION.SCOPE,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
      })
      .build();
  }
};

const responseHandler = respTransformPayload => {
  const { response, status } = respTransformPayload;
  processResponse({
    dresponse: response,
    status
  });
  return {
    status,
    destinationResponse: response,
    message: "Request Processed Successfully"
  };
};

const networkHandler = function() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
};

module.exports = { networkHandler };
