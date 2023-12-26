const { RetryableError } = require('@rudderstack/integrations-lib');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');

const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');

const redditRespHandler = (destResponse) => {
  const { status, response } = destResponse;

  // to handle the case when authorization-token is invalid
  if (status === 401 && response.includes('Authorization Required')) {
    throw new RetryableError(
      `Request failed due to ${response} 'during reddit response transformation'`,
      500,
      destResponse,
      REFRESH_TOKEN,
    );
  }
};
const responseHandler = (destinationResponse) => {
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
