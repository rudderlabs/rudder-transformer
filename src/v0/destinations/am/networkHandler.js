const { ThrottledError, AbortedError, RetryableError } = require('@rudderstack/integrations-lib');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, isHttpStatusRetryable, isHttpStatusThrottled } = require('../../util');
const logger = require('../../../logger');
const { DESTINATION } = require('./config');

class NetworkHandler {
  constructor() {
    this.prepareProxyRequest = prepareProxyRequest;
    this.proxy = proxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }

  responseHandler(responseParams) {
    const { destinationResponse } = responseParams;
    const message = `[${DESTINATION} Response Handler] - Request Processed Successfully`;
    const { status, response } = destinationResponse;
    if (isHttpStatusSuccess(status)) {
      return {
        destinationResponse: response,
        message,
        status,
      };
    }
    if (isHttpStatusThrottled(status)) {
      const {
        error,
        throttled_users: throttledUsers,
        throttled_devices: throttledDevices,
      } = response;

      const hasThrottledItems = (obj) =>
        typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;

      if (hasThrottledItems(throttledUsers) || hasThrottledItems(throttledDevices)) {
        logger.error('Too many requests for some devices or users.');
        throw new RetryableError(
          `Request Failed during ${DESTINATION} response transformation: ${error} - due to Request Limit exceeded, (Retryable)`,
          500,
          destinationResponse,
        );
      }
      // throw a ThrottledError in other 429 cases
      throw new ThrottledError(
        `Request Failed during ${DESTINATION} response transformation: ${error} - due to Request Limit exceeded, (Throttled)`,
        destinationResponse,
      );
    }
    if (isHttpStatusRetryable(status)) {
      throw new RetryableError(
        `Request Failed during ${DESTINATION} response transformation: with status "${status}" due to "${JSON.stringify(response)}", (Retryable)`,
        500,
        destinationResponse,
      );
    }
    throw new AbortedError(
      `Request Failed during ${DESTINATION} response transformation: with status "${status}" due to "${JSON.stringify(response)}", (Aborted)`,
      400,
      destinationResponse,
    );
  }
}

module.exports = {
  NetworkHandler,
};
