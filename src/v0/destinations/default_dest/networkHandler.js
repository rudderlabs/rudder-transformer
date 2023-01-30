const { prepareProxyRequest } = require("../../../adapters/network");
const { processAxiosResponse } = require("../../../adapters/utils/networkUtils");

// eslint-disable-next-line no-promise-executor-return
const sleep = (s) => new Promise((r) => setTimeout(r, s*1000));

/**
 * depricating: handles proxying requests to destinations from server, expects requsts in "defaultRequestConfig"
 * note: needed for test api
 * @param {*} request
 * @returns
 */
// eslint-disable-next-line no-unused-vars
const destDefProxyRequest = async _request => {
  await sleep(0.01);
  return {
    response: {
      status: 200,
      data: "success"
    },
    success: true
  };
};

const responseHandler = (destinationResponse) => {
  const message = 'Request Processed Successfully';
  
  // else successfully return status, message and original destination response
  return {
    status: 200,
    message,
    destinationResponse,
  };
};

class networkHandler {
  constructor() {
    this.responseHandler = responseHandler;
    this.proxy = destDefProxyRequest;
    this.prepareProxy = prepareProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }
}

module.exports = {
  networkHandler,
};