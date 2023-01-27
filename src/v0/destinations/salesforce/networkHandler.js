const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { salesforceResponseHandler } = require('./utils');

const responseHandler = (destinationResponse, destType) => {
  const message = `Request for destination: ${destType} Processed Successfully`;

  salesforceResponseHandler(
    destinationResponse,
    'during Salesforce Response Handling',
    destinationResponse?.rudderJobMetadata?.destInfo?.authKey,
  );

  // else successfully return status as 200, message and original destination response
  return {
    status: 200,
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
