const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { DESTINATION } = require('./config');
const { AbortedError } = require('../../util/errorTypes');

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
