const { get, set } = require('lodash');
const { NetworkError } = require('@rudderstack/integrations-lib');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');

const tags = require('../../util/tags');
const { getAuthErrCategory } = require('../../util/googleUtils');


const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
  const message = 'Request Processed Successfully';
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // for google ads enhance conversions the partialFailureError returns with status 200
    const { partialFailureError } = destinationResponse.response;
    // non-zero code signifies partialFailure
    // Ref - https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
    if (partialFailureError && partialFailureError.code !== 0) {
      throw new NetworkError(
        JSON.stringify(partialFailureError),
        400,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400),
        },
        partialFailureError,
      );
    }

    return {
      status,
      message,
      destinationResponse,
    };
  }
  // else successfully return status, message and original destination response
  const { response } = destinationResponse;
  const errMessage = get(response, 'error.message', '');
  throw new NetworkError(
    `${errMessage}" during Google_adwords_enhanced_conversions response transformation`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    response,
    getAuthErrCategory(destinationResponse),
  );
};

// eslint-disable-next-line func-names, @typescript-eslint/naming-convention
class networkHandler {
  constructor() {
    this.proxy = proxyRequest;
    this.responseHandler = responseHandler;
    this.processAxiosResponse = processAxiosResponse;
    this.prepareProxy = prepareProxyRequest;
  }
}

module.exports = { networkHandler };
