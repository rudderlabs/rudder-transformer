const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { errorResponseHandler } = require('../facebook_pixel/networkHandler');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');

const destResponseHandler = (destinationResponse) => {
  errorResponseHandler(destinationResponse);
  return {
    destinationResponse: destinationResponse.response,
    message: 'Request Processed Successfully',
    status: destinationResponse.status,
  };
};

// eslint-disable-next-line @typescript-eslint/naming-convention
class networkHandler {
  constructor() {
    this.prepareProxyRequest = prepareProxyRequest;
    this.proxy = proxyRequest;
    this.processAxiosResponse = processAxiosResponse;
    this.responseHandler = destResponseHandler;
  }
}

module.exports = {
  networkHandler,
};
