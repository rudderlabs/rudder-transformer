/* eslint-disable no-unused-vars */
const { isHttpStatusSuccess } = require('../../util/index');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { DESTINATION } = require('./config');
const { NetworkError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

const responseHandler = (destinationResponse, _dest) => {
  const message = `Request for ${DESTINATION} Processed Successfully`;
  const { response, status } = destinationResponse;
  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `Request failed for ${DESTINATION} with status: ${status}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }
  // application level errors
  if (
    !!response &&
    response.message !== 'success' &&
    response.errors &&
    response.errors.length > 0
  ) {
    throw new NetworkError(
      `Request failed for ${DESTINATION} with status: ${status}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }
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
