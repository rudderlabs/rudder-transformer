const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { OAUTH } = require('../salesforce/config');
const { salesforceResponseHandler } = require('../salesforce/utils');

const responseHandler = (destinationResponse, destType) => {
  const message = `Request for destination: ${destType} Processed Successfully`;

  salesforceResponseHandler(
    destinationResponse,
    'during Salesforce Response Handling',
    destinationResponse?.rudderJobMetadata?.destInfo?.authKey,
    OAUTH
  );

  // else successfully return status as 200, message and original destination response
  return {
    status: 200,
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
