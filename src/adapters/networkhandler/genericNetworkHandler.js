const { isHttpStatusSuccess } = require('../../v0/util/index');
const { proxyRequest, prepareProxyRequest } = require('../network');
const { getDynamicErrorType, processAxiosResponse } = require('../utils/networkUtils');
const { NetworkError } = require('../../v0/util/errorTypes');
const tags = require('../../v0/util/tags');

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
  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `[Generic Response Handler] Request failed for destination ${dest} with status: ${status}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }
  return {
    status,
    message,
    destinationResponse,
  };
};

function networkHandler() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
}

module.exports = { networkHandler };
