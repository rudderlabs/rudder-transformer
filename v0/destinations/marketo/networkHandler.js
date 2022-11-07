const { TRANSFORMER_METRIC } = require("../../util/constant");
const { marketoResponseHandler } = require("./util");
const {
  proxyRequest,
  prepareProxyRequest
} = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

// eslint-disable-next-line no-unused-vars
const responseHandler = (destinationResponse, _dest) => {
  const message = `[Marketo Response Handler] - Request Processed Successfully`;
  const { status } = destinationResponse;
  // check for marketo application level failures
  marketoResponseHandler(
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
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
};

module.exports = {
  networkHandler
};
