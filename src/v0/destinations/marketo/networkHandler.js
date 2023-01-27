const v0Utils = require('../../util');
const { marketoResponseHandler } = require('./util');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');

// eslint-disable-next-line no-unused-vars
const responseHandler = (destinationResponse, destType) => {
  const message = 'Request Processed Successfully';
  const { status, rudderJobMetadata } = destinationResponse;
  const authCache = v0Utils.getDestAuthCacheInstance(destType);
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

const networkHandler = function () {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
};

module.exports = {
  networkHandler,
};
