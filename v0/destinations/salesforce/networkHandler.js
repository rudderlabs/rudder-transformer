const {
  proxyRequest,
  prepareProxyRequest
} = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { salesforceResponseHandler } = require("./utils");

const responseHandler = (destinationResponse, destType) => {
  const { status } = destinationResponse;
  const message = `Request for destination: ${destType} Processed Successfully`;

  salesforceResponseHandler(
    destinationResponse,
    "during Salesforce Response Handling",
    TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
    destinationResponse?.rudderJobMetadata
  );

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
