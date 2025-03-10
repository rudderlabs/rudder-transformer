const { marketoResponseHandler } = require('./util');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { authCache } = require('./transform');

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = 'Request Processed Successfully';
  const { status } = destinationResponse;
  // check for marketo application level failures
  marketoResponseHandler(
    destinationResponse,
    'during Marketo Response Handling',
    rudderJobMetadata,
    authCache,
    'marketo',
  );
  // else successfully return status, message and original destination response
  return {
    status,
    message,
    destinationResponse,
  };
};

function networkHandler() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
}

module.exports = {
  networkHandler,
};
