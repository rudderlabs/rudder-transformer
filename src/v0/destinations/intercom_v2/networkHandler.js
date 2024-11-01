const { RetryableError, NetworkError } = require('@rudderstack/integrations-lib');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { AUTH_STATUS_INACTIVE } = require('../../../adapters/networkhandler/authConstants');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { TransformerProxyError } = require('../../util/errorTypes');
const tags = require('../../util/tags');
const { isHttpStatusSuccess } = require('../../util');

// ref: https://github.com/intercom/oauth2-intercom
// Intercom's OAuth implementation does not use refresh tokens. Access tokens are valid until a user revokes access manually, or until an app deauthorizes itself.
const getAuthErrCategory = (status) => {
  if (status === 401) {
    return AUTH_STATUS_INACTIVE;
  }
  return '';
};

const errorResponseHandler = (destinationResponse, dest) => {
  const { response, status } = destinationResponse;
  const message = `[Intercom V2 Response Handler] Request failed for destination ${dest} with status: ${status}`;
  if (status === 401) {
    throw new TransformerProxyError(
      `${message}. ${JSON.stringify(response)}`,
      400,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
      getAuthErrCategory(status),
    );
  }
  if (status === 408) {
    throw new RetryableError(message, 500, destinationResponse, getAuthErrCategory(status));
  }
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `${message}. ${JSON.stringify(response)}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }
};

const responseHandler = (responseParams) => {
  const { destinationResponse, destType } = responseParams;
  errorResponseHandler(destinationResponse, destType);
  return {
    destinationResponse: destinationResponse.response,
    message: 'Request Processed Successfully',
    status: destinationResponse.status,
  };
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
