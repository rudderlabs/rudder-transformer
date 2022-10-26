const { getStatusAndStats } = require("../../constants/fbMarketApi");

const { DESTINATION } = require("./config");

const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

const {
  prepareProxyRequest,
  proxyRequest
} = require("../../../adapters/network");

const ErrorBuilder = require("../../util/error");

const responseErrorChecker = destResponse => {
  const { response } = destResponse;
  if (!response.error) {
    // successful response from facebook app event api
    return;
  }
  const { error } = response;
  const statusAndStats = getStatusAndStats(error, DESTINATION);
  throw new ErrorBuilder()
    .setStatus(statusAndStats.status)
    .setDestinationResponse({ ...response, status: destResponse.status })
    .setMessage(
      `Facebook App Event: Failed with ${error.message} during response transformation`
    )
    .setStatTags(statusAndStats.statTags)
    .build();
};

const destResponseHandler = destinationResponse => {
  responseErrorChecker(destinationResponse);
  return {
    destinationResponse: destinationResponse.response,
    message: `[Facebook App Event Response Handler] - Request Processed Successfully`,
    status: destinationResponse.status
  };
};

const networkHandler = () => {
  // The order of execution also happens in this way
  this.prepareProxyRequest = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = destResponseHandler;
};

module.exports = {
  networkHandler
};
