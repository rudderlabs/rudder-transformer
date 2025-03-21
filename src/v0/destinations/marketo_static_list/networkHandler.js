const { marketoResponseHandler } = require('../marketo/util');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { DESTINATION } = require('./config');
const { authCache } = require('./util');

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = 'Request Processed Successfully';
  const { status } = destinationResponse;
  // check for marketo application level failures
  marketoResponseHandler(
    destinationResponse,
    'during Marketo Static List Response Handling',
    rudderJobMetadata,
    authCache,
    DESTINATION,
  );
  // else successfully return status, message and original destination response
  return {
    status,
    message,
    destinationResponse,
  };
};

// eslint-disable-next-line @typescript-eslint/naming-convention
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
