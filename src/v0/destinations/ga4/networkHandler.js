const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { isDefinedAndNotNull, isDefined, isHttpStatusSuccess } = require('../../util');

const { NetworkError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

const responseHandler = (destinationResponse, dest) => {
  const message = `[GA4 Response Handler] - Request Processed Successfully`;
  let { status } = destinationResponse;
  const { response } = destinationResponse;
  if (status === 204) {
    // GA4 always returns a 204 response, other than in case of
    // validation endpoint.
    status = 200;
  } else if (
    status === 200 &&
    isDefinedAndNotNull(response) &&
    isDefined(response.validationMessages)
  ) {
    // for GA4 debug validation endpoint, status is always 200
    // validationMessages[] is empty, thus event is valid
    if (response.validationMessages?.length === 0) {
      status = 200;
    } else {
      // Build the error in case the validationMessages[] is non-empty
      const { description, validationCode, fieldPath } = response.validationMessages[0];
      throw new NetworkError(
        `Validation Server Response Handler:: Validation Error for ${dest} of field path :${fieldPath} | ${validationCode}-${description}`,
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
        },
        response?.validationMessages[0]?.description,
      );
    }
  }

  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `[GA4 Response Handler] Request failed for destination ${dest} with status: ${status}`,
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
