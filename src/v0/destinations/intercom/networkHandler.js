const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');

const { RetryableError } = require('../../util/errorTypes');

const errorResponseHandler = (destinationResponse, dest) => {
  const { status } = destinationResponse;
  if (status === 408) {
    throw new RetryableError(
      `[Intercom Response Handler] Request failed for destination ${dest} with status: ${status}`,
      500,
      destinationResponse,
    );
  }
};

const destResponseHandler = (destinationResponse, dest) => {
  errorResponseHandler(destinationResponse, dest);
  return {
    destinationResponse: destinationResponse.response,
    message: 'Request Processed Successfully',
    status: destinationResponse.status,
  };
};

// eslint-disable-next-line @typescript-eslint/naming-convention
class networkHandler {
  constructor() {
    this.responseHandler = destResponseHandler;
    this.proxy = proxyRequest;
    this.prepareProxy = prepareProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }
}

module.exports = {
  networkHandler,
};
