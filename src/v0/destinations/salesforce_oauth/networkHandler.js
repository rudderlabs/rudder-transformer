const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const { SALESFORCE_OAUTH } = require('../salesforce/config');
const { default: salesforceRegistry } = require('../../util/salesforce/registry');

const responseHandler = (responseParams) => {
  const { destinationResponse, destType } = responseParams;
  const message = `Request for destination: ${destType} Processed Successfully`;
  const { status } = destinationResponse;

  if (!isHttpStatusSuccess(status) && status >= 400) {
    salesforceRegistry[SALESFORCE_OAUTH].responseHandler(
      destinationResponse,
      'during Salesforce Response Handling',
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
