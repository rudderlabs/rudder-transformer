import { DeliveryJobState, DeliveryV1Response } from '../../../types';
import { isHttpStatusSuccess, isHttpStatusRetryable } from '../../../v0/util';

const { AbortedError, RetryableError } = require('@rudderstack/integrations-lib');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');

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

const responseHandler = (responseParams): DeliveryV1Response => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `[${DESTINATION} Response Handler] - Request Processed Successfully`;
  const { status, response } = destinationResponse;
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
      destinationResponse,
      response: populateResponseWithDontBatch(rudderJobMetadata, response),
    };
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
