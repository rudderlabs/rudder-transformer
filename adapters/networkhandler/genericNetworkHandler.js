const ErrorBuilder = require("../../v0/util/error");
const { isHttpStatusSuccess } = require("../../v0/util/index");
const { TRANSFORMER_METRIC } = require("../../v0/util/constant");
const { proxyRequest, prepareProxyRequest } = require("../network");
const {
  getDynamicMeta,
  processAxiosResponse
} = require("../utils/networkUtils");

/**
 * network handler as a fall back for all destination nethandlers, this file provides abstraction
 * for all the network comms btw dest transformer.
 *
 * --responseTransform-- this is a function which can be used to handle responses which are not-compatible with
 * rudder-server. If responseTransform for a destination is enabled rudder-server will send the response recieved
 * from destination back to transformer where it expects a compatible response with statusCode as output
 *
 * Individual responsetransform logic can exist for specific destination based on requirement, in case a destination
 * has responseTransformation enabled and it doesnot contain custom transformation, transformation locgic at genericnethandler
 * will act as fall-fack for such scenarios.
 *
 */
const responseHandler = (destinationResponse, dest) => {
  const { status } = destinationResponse;
  const message = `[Generic Response Handler] Request for destination: ${dest} Processed Successfully`;
  // if the responsee from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new ErrorBuilder()
      .setStatus(status)
      .setMessage(
        `[Generic Response Handler] Request failed for destination ${dest} with status: ${status}`
      )
      .isTransformResponseFailure(true)
      .setDestinationResponse(destinationResponse)
      .setStatTags({
        destination: dest,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
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

module.exports = { networkHandler };
