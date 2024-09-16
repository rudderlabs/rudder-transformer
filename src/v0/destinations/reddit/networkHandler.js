const { RetryableError, TAG_NAMES, NetworkError } = require('@rudderstack/integrations-lib');
const isString = require('lodash/isString');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');

const redditRespHandler = (destResponse) => {
  const { status, response } = destResponse;

  // to handle the case when authorization-token is invalid
  if (status === 401) {
    let errorMessage = 'Authorization failed';
    let authErrorCategory = '';

    if (isString(response) && response.includes('Authorization Required')) {
      errorMessage = `Request failed due to ${response}`;
      authErrorCategory = REFRESH_TOKEN;
    } else if (response?.error?.reason === 'UNAUTHORIZED') {
      errorMessage = response.error.explanation || errorMessage;
      authErrorCategory = REFRESH_TOKEN;
    }

    throw new RetryableError(
      `${errorMessage} during reddit response transformation`,
      status,
      destResponse,
      authErrorCategory,
    );
  }
  throw new NetworkError(
    `${JSON.stringify(response)} during reddit response transformation`,
    status,
    {
      [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destResponse,
  );
};
const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
  const message = `Request Processed Successfully`;
  const { status } = destinationResponse;
  if (!isHttpStatusSuccess(status)) {
    // if error, successfully return status, message and original destination response
    redditRespHandler(destinationResponse);
  }
  const { response } = destinationResponse;
  const errorMessage =
    response.invalid_events && Array.isArray(response.invalid_events)
      ? response?.invalid_events[0]?.error_message
      : null;
  const destResp = errorMessage || destinationResponse;
  // Mostly any error will not have a status of 2xx
  return {
    status,
    message,
    destResp,
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
module.exports = { networkHandler };
