const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const { SALESFORCE } = require('./config');
// const { salesforceResponseHandler } = require('./utils');
const { default: salesforceRegistry } = require('../../util/salesforce/registry');

const responseHandler = (responseParams) => {
  const { destinationResponse, destType, rudderJobMetadata } = responseParams;
  const message = `Request for destination: ${destType} Processed Successfully`;
  const { status } = destinationResponse;

  if (!isHttpStatusSuccess(status) && status >= 400) {
    salesforceRegistry[SALESFORCE].responseHandler(
      destinationResponse,
      'during Salesforce Response Handling',
      rudderJobMetadata?.destInfo?.authKey,
    );
  }

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
