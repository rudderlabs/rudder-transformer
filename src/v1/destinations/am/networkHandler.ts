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
  const errorMessage = JSON.stringify(error) || '"unknown error"';
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
      `Request failed during ${DESTINATION} response transformation: with status "${status}" due to ${errorMessage}, (Retryable)`,
      500,
      destinationResponse,
    );
  }
  if (isHttpStatusThrottled(status)) {
    // we don't need to check for throttled users or devices in response and update 429 status code to 500,
    // we can throw a ThrottledError in 429 cases.
    // as there guaranteeUserEventOrder is false for amplitude, 429 status code is not used by server.
    throw new ThrottledError(
      `Request failed during ${DESTINATION} response transformation: with status "${status}" due to ${errorMessage}, (Throttled)`,
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
      message: `Request failed for a batch of events during ${DESTINATION} response transformation: with status "${status}" due to ${errorMessage} (Retryable)`,
      destinationResponse,
      response: populateResponseWithDontBatch(rudderJobMetadata, errorMessage),
    };
  }
  throw new AbortedError(
    `Request failed during ${DESTINATION} response transformation: with status "${status}" due to ${
      errorMessage
    }, (Aborted)`,
    status,
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
