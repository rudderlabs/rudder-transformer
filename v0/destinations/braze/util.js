/* eslint-disable no-unused-vars */
const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const {
  proxyRequest,
  prepareProxyRequest
} = require("../../../adapters/network");
const {
  getDynamicMeta,
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const ErrorBuilder = require("../../util/error");
const { DESTINATION } = require("./config");

const responseHandler = (destinationResponse, _dest) => {
  const message = `[Braze Response Handler] Request for ${DESTINATION} Processed Successfully`;
  const { response, status } = destinationResponse;
  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new ErrorBuilder()
      .setStatus(status)
      .setMessage(
        `[Braze Response Handler] Request failed for ${DESTINATION} with status: ${status}`
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
  // application level errors
  if (
    !!response &&
    response.message !== "success" &&
    response.errors &&
    response.errors.length > 0
  ) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(
        `[Braze Response Handler] Request failed for ${DESTINATION} with status: ${status}`
      )
      .setDestinationResponse(destinationResponse)
      .isTransformResponseFailure(true)
      .setStatTags({
        destination: DESTINATION,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        meta: getDynamicMeta(status)
      })
      .build();
  }
  return {
    status,
    message,
    destinationResponse
  };
};

const networkHandler = function() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
};

module.exports = {
  networkHandler
};
