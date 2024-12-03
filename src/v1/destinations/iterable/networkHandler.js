const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { BULK_ENDPOINTS } = require('../../../v0/destinations/iterable/config');
const { CommonStrategy } = require('./commonStrategy');
const { TrackIdentifyStrategy } = require('./trackIdentifyStrategy');

const strategyRegistry = {
  [TrackIdentifyStrategy.name]: new TrackIdentifyStrategy(),
  [CommonStrategy.name]: new CommonStrategy(),
};

const getResponseStrategy = (endpoint) => {
  if (BULK_ENDPOINTS.some((path) => endpoint.includes(path))) {
    return strategyRegistry[TrackIdentifyStrategy.name];
  }
  return strategyRegistry[CommonStrategy.name];
};

const responseHandler = (responseParams) => {
  const { destinationRequest } = responseParams;
  const strategy = getResponseStrategy(destinationRequest.endpoint);
  return strategy.handleResponse(responseParams);
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
