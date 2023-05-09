const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { DESTINATION } = require('./config');
const { AbortedError, RetryableError } = require('../../util/errorTypes');

const responseHandler = (destinationResponse) => {
  const msg = `[${DESTINATION} Response Handler] - Request Processed Successfully`;
  const { code } = destinationResponse.response;
  const status = 200;

  if (code === 0 || code === 20001) {
    return {
      status,
      message: msg,
      destinationResponse,
    };
  }
  if (code === 40100) {
    throw new RetryableError(`Request failed with status: ${code}`, 429, destinationResponse);
  }
  throw new AbortedError(`Request failed with status: ${code}`, 400, destinationResponse);
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
  networkHandler,
};
