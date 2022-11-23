const { TRANSFORMER_METRIC } = require("../../util/constant");
const { marketoResponseHandler } = require("../marketo/util");
const {
  proxyRequest,
  prepareProxyRequest
} = require("../../../adapters/network");
const v0Utils = require("../../util");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { DESTINATION } = require("./config");

// eslint-disable-next-line no-unused-vars
const responseHandler = (destinationResponse, destType) => {
  const message = `[Marketo Static List Response Handler] - Request Processed Successfully`;
  const { status } = destinationResponse;
  const authCache = v0Utils.getDestAuthCacheInstance(destType);
  // check for marketo application level failures
  marketoResponseHandler(
    destinationResponse,
    "during Marketo Static List Response Handling",
    TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
    destinationResponse?.rudderJobMetadata,
    authCache,
    DESTINATION
  );
  // else successfully return status, message and original destination response
  return {
    status,
    message,
    destinationResponse
  };
};

class networkHandler {
  constructor() {
    this.responseHandler = responseHandler;
    this.proxy = proxyRequest;
    this.prepareProxy = prepareProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }
}

module.exports = {
  networkHandler
};
