const { NetworkError, ThrottledError, AbortedError } = require('@rudderstack/integrations-lib');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { DESTINATION } = require('./config');
const { TAG_NAMES } = require('../../util/tags');
const { HTTP_STATUS_CODES } = require('../../util/constant');

const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
  const msg = `[${DESTINATION} Response Handler] - Request Processed Successfully`;
  const {
    response: { code },
    status,
  } = destinationResponse;

  switch (code) {
    case 0:
    case 20001:
      return {
        status: HTTP_STATUS_CODES.OK,
        message: msg,
        destinationResponse,
      };
    case 40100:
      throw new ThrottledError(`Request failed with status: ${code}`, destinationResponse);
    case 40700:
      throw new NetworkError(
        `Request failed with status: ${code}`,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        {
          [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR),
        },
        destinationResponse,
      );
    case 40002:
    case 40001:
      throw new AbortedError(`Request failed with status: ${code}`, null, destinationResponse);
    default:
      throw new NetworkError(
        `Request failed with status: ${status}`,
        status,
        {
          [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
        },
        destinationResponse,
      );
  }
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
