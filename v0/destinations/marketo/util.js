const {
  httpGET,
  httpPOST,
  proxyRequest
} = require("../../../adapters/network");
const {
  getDynamicMeta,
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");

const MARKETO_RETRYABLE_CODES = ["601", "602", "604", "611"];
const MARKETO_ABORTABLE_CODES = ["600", "603", "605", "609", "610", "612"];
const MARKETO_THROTTLED_CODES = ["502", "606", "607", "608", "615"];
const { DESTINATION } = require("./config");

// handles marketo application level failures
const marketoApplicationErrorHandler = (
  marketoResponse,
  sourceMessage,
  stage
) => {
  const { response } = marketoResponse;
  const { errors } = response;
  if (errors && MARKETO_ABORTABLE_CODES.indexOf(errors[0].code) > -1) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(
        `Request Failed for Marketo, ${errors[0].message} (Aborted).${sourceMessage}`
      )
      .setDestinationResponse(marketoResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        stage,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE
      })
      .build();
  } else if (errors && MARKETO_THROTTLED_CODES.indexOf(errors[0].code) > -1) {
    throw new ErrorBuilder()
      .setStatus(429)
      .setMessage(
        `Request Failed for Marketo, ${errors[0].message} (Throttled).${sourceMessage}`
      )
      .setDestinationResponse(marketoResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        stage,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.THROTTLED
      })
      .build();
  } else if (errors && MARKETO_RETRYABLE_CODES.indexOf(errors[0].code) > -1) {
    throw new ErrorBuilder()
      .setStatus(500)
      .setMessage(
        `Request Failed for Marketo, ${errors[0].message} (Retryable).${sourceMessage}`
      )
      .setDestinationResponse(marketoResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        stage,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE
      })
      .build();
  }
};

const marketoResponseHandler = (destResponse, sourceMessage, stage) => {
  const { status, response } = destResponse;
  if (isHttpStatusSuccess(status)) {
    // for authentication requests
    if (response && response.access_token) {
      return response;
    }
    // marketo application level success
    if (response && response.success) {
      return response;
    }
    // marketo application level failure
    if (response && !response.success) {
      marketoApplicationErrorHandler(destResponse, sourceMessage, stage);
    }
  }
  // non 2xx failure
  throw new ErrorBuilder()
    .setStatus(status)
    .setMessage(`Error occured ${sourceMessage}`)
    .setDestinationResponse(destResponse)
    .setStatTags({
      destination: DESTINATION,
      stage,
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
      meta: getDynamicMeta(status)
    })
    .build();
};

/**
 *
 * @param {*} url
 * @param {*} options
 * @returns { response, status }
 */
const sendGetRequest = async (url, options) => {
  const clientResponse = await httpGET(url, options);
  const processedResponse = processAxiosResponse(clientResponse);
  return processedResponse;
};

/**
 *
 * @param {*} url
 * @param {*} options
 * @returns { response, status }
 */
const sendPostRequest = async (url, data, options) => {
  const clientResponse = await httpPOST(url, options);
  const processedResponse = processAxiosResponse(clientResponse);
  return processedResponse;
};

// eslint-disable-next-line no-unused-vars
const responseHandler = (destinationResponse, _dest) => {
  const message = `[Marketo Response Handler] - Request Processed Successfully`;
  const { status } = destinationResponse;
  // if the responsee from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new ErrorBuilder()
      .setStatus(status)
      .setMessage(
        `[Marketo Response Handler] - Request failed  with status: ${status}`
      )
      .setDestinationResponse(destinationResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(status)
      })
      .build();
  }
  // check for marketo application level failures
  marketoApplicationErrorHandler(
    destinationResponse,
    "during Marketo Response Handling",
    TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
  );
  // else successfully return status, message and original destination response
  return {
    status,
    message,
    destinationResponse
  };
};

const networkHandler = function() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
};

module.exports = {
  marketoResponseHandler,
  sendGetRequest,
  sendPostRequest,
  networkHandler
};
