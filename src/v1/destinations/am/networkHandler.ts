import { AbortedError, RetryableError, ThrottledError } from '@rudderstack/integrations-lib';
import { DeliveryJobState, DeliveryV1Response, ProxyMetdata } from '../../../types';
import {
  isHttpStatusSuccess,
  isHttpStatusRetryable,
  isHttpStatusThrottled,
} from '../../../v0/util';

import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';

const DESTINATION = 'amplitude';
const populateResponseWithDontBatch = (rudderJobMetadata: ProxyMetdata[], errorMessage: string) => {
  const responseWithIndividualEvents: DeliveryJobState[] = [];

  rudderJobMetadata.forEach((metadata) => {
    responseWithIndividualEvents.push({
      // dontBatch will only exist if it is in batch + proxy flow.
      statusCode: metadata.dontBatch ? 400 : 500,
      metadata: {
        ...metadata,
        dontBatch: true,
      },
      error: errorMessage,
    });
  });
  return responseWithIndividualEvents;
};

const responseHandler = (responseParams: {
  rudderJobMetadata: ProxyMetdata[];
  destinationResponse: { response: any; status: number };
}): DeliveryV1Response => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `[${DESTINATION} Response Handler] - Request Processed Successfully`;
  const { status, response } = destinationResponse;
  const { error } = response;
  const errorMessage = JSON.stringify(error) || 'unknown error';
  if (isHttpStatusSuccess(status)) {
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
      `Request Failed during ${DESTINATION} response transformation: with status "${status}" due to ${errorMessage}, (Retryable)`,
      500,
      destinationResponse,
    );
  }
  if (isHttpStatusThrottled(status)) {
    const { throttled_users: throttledUsers, throttled_devices: throttledDevices } = response;

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
      message: `Request Failed for a batch of events during ${DESTINATION} response transformation: with status "${status}" due to ${errorMessage} (Retryable)`,
      destinationResponse,
      response: populateResponseWithDontBatch(rudderJobMetadata, errorMessage),
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
