import { DeliveryJobState, DeliveryV1Response, ProxyMetdata } from '../../../types';
import {
  isHttpStatusSuccess,
  isHttpStatusRetryable,
  isHttpStatusThrottled,
} from '../../../v0/util';

const { AbortedError, RetryableError, ThrottledError } = require('@rudderstack/integrations-lib');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');

const DESTINATION = 'amplitude';
const populateResponseWithDontBatch = (rudderJobMetadata: ProxyMetdata[], response) => {
  const { error } = response;
  const errorMessage = error || 'unknown error';
  const responseWithIndividualEvents: DeliveryJobState[] = [];

  rudderJobMetadata.forEach((metadata) => {
    responseWithIndividualEvents.push({
      statusCode: metadata.dontBatch ? 400 : 500,
      metadata: {
        ...metadata,
        dontBatch: true,
        secret: undefined,
      },
      error: errorMessage,
    });
  });
  return responseWithIndividualEvents;
};

const responseHandler = (responseParams): DeliveryV1Response => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  console.log('responseParams here', responseParams);
  const message = `[${DESTINATION} Response Handler] - Request Processed Successfully`;
  const { status, response } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    console.log('responseParams here', responseParams);
    const responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: 200,
      metadata,
      error: 'success',
    }));

    return {
      status,
      message,
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }
  if (isHttpStatusRetryable(status)) {
    throw new RetryableError(
      `Request Failed during ${DESTINATION} response transformation: with status "${status}" due to ${JSON.stringify(
        response,
      )}, (Retryable)`,
      500,
      destinationResponse,
    );
  }
  if (isHttpStatusThrottled(status)) {
    const {
      error,
      throttled_users: throttledUsers,
      throttled_devices: throttledDevices,
    } = response;

    const hasThrottledItems = (obj: Record<string, number>) =>
      typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;

    if (hasThrottledItems(throttledUsers) || hasThrottledItems(throttledDevices)) {
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
  if (
    !isHttpStatusSuccess(status) &&
    Array.isArray(rudderJobMetadata) &&
    rudderJobMetadata.length > 1
  ) {
    return {
      status, // this status is not used by server, server uses the status of response
      message: `Request Failed for a batch of events during ${DESTINATION} response transformation: with status "${status}" due to "${JSON.stringify(
        response,
      )}", (Retryable)`,
      destinationResponse,
      response: populateResponseWithDontBatch(rudderJobMetadata, response),
    };
  }
  throw new AbortedError(
    `Request Failed during ${DESTINATION} response transformation: with status "${status}" due to "${
      JSON.stringify(response.error) || 'unknown error'
    }", (Aborted)`,
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
