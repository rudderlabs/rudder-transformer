import { DeliveryJobState, DeliveryV1Response } from '../../../types';
import {
  isHttpStatusSuccess,
  isHttpStatusThrottled,
  isHttpStatusRetryable,
} from '../../../v0/util';

const { ThrottledError, AbortedError, RetryableError } = require('@rudderstack/integrations-lib');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');

const logger = require('../../../logger');

const DESTINATION = 'amplitude';
const populateResponseWithDontBatch = (rudderJobMetadata, response) => {
  const { error } = response;
  const errorMessage = error || 'unknown error';
  const responseWithIndividualEvents: DeliveryJobState[] = [];

  rudderJobMetadata.forEach((metadata) => {
    responseWithIndividualEvents.push({
      statusCode: 500,
      metadata: { ...metadata, dontBatch: true },
      error: errorMessage,
    });
  });
  return responseWithIndividualEvents;
};

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
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
  if (
    !isHttpStatusSuccess(status) &&
    Array.isArray(rudderJobMetadata) &&
    rudderJobMetadata.length > 1
  ) {
    return {
      status: 500,
      message: `Request Failed for a batch of events during ${DESTINATION} response transformation: with status "${status}" due to "${JSON.stringify(response)}", (Retryable)`,
      response: populateResponseWithDontBatch(rudderJobMetadata, response),
    } as DeliveryV1Response;
  }
  throw new AbortedError(
    `Request Failed during ${DESTINATION} response transformation: with status "${status}" due to "${JSON.stringify(response.error)}", (Aborted)`,
    400,
    destinationResponse,
  );
};

function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
