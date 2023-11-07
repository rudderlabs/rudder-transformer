const { isHttpStatusSuccess } = require('../../util/index');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { NetworkError, AbortedError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

const responseHandler = (destinationResponse) => {
  const message = 'Request Processed Successfully';
  const { response, status } = destinationResponse;

  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `Request failed  with status: ${status}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }

  // check for clevertap application level failures
  // clevertap returns 200 with response body status :success, partial, fail
  //   {
  //     "status": "fail",
  //     "processed": 0,
  //     "unprocessed": []
  //   }

  if (!!response && response.status !== 'success') {
    throw new AbortedError(`Request failed  with status: ${status}`, 400, destinationResponse);
  }

  // else successfully return status, message and original destination response
  return {
    status,
    message,
    destinationResponse,
  };
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
