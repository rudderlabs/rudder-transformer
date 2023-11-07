const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { DESTINATION } = require('./config');
const { NetworkError, ThrottledError, AbortedError } = require('../../util/errorTypes');
const { TAG_NAMES } = require('../../util/tags');
const { HTTP_STATUS_CODES } = require('../../util/constant');

const responseHandler = (destinationResponse) => {
  const msg = `[${DESTINATION} Response Handler] - Request Processed Successfully`;
  const {
    response: { code },
    status,
  } = destinationResponse;

  if (code === 0 || code === 20001) {
    return {
      status: HTTP_STATUS_CODES.OK,
      message: msg,
      destinationResponse,
    };
  }
  if (code === 40100) {
    throw new ThrottledError(`Request failed with status: ${code}`, destinationResponse);
  }

  if (code === 40002 || code === 40001) {
    throw new AbortedError(`Request failed with status: ${code}`, null, destinationResponse);
  }

  throw new NetworkError(
    `Request failed with status: ${status}`,
    status,
    {
      [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
  );
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
