const { ThrottledError, AbortedError, RetryableError } = require('@rudderstack/integrations-lib');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const tags = require('../../util/tags');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');

const redditRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;

  const errorMessage = response?.invalid_events[0]?.errorMessage;
  // to handle the case when authorization-token is invalid
  if (status === 401) {
    throw new RetryableError(
      `Request failed due to ${errorMessage}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destResponse,
      REFRESH_TOKEN,
    );
  } else if (status === 429) {
    throw new ThrottledError(
      `Request Failed: ${stageMsg} - due to Request Limit exceeded, (Throttled)`,
      destResponse,
    );
  } else if (status === 503 || status === 500) {
    // see if its 500 internal error or 503 service unavailable
    throw new RetryableError(`Request Failed: ${stageMsg} (Retryable)`, 500, destResponse);
  }
  // else throw the error
  throw new AbortedError(
    `Request Failed: ${stageMsg} with status "${status}" due to "${errorMessage}`,
    400,
    destResponse,
  );
};
const responseHandler = (destinationResponse) => {
  const message = `Request Processed Successfully`;
  const { status } = destinationResponse;
  if (!isHttpStatusSuccess(status)) {
    // if error, successfully return status, message and original destination response
    redditRespHandler(destinationResponse, 'during reddit response transformation');
  }
  // Mostly any error will not have a status of 2xx
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
module.exports = { networkHandler };
