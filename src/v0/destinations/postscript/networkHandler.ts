/**
 * PostScript Destination Network Handler
 *
 * This file implements basic network response handling for PostScript API responses.
 * It follows the standard pattern used across RudderStack destinations with simple
 * success/error handling based on HTTP status codes.
 */

import { NetworkError, RetryableError, ThrottledError } from '@rudderstack/integrations-lib';
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse, getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import { isHttpStatusSuccess } from '../../util';
import { DESTINATION_NAME } from './config';
import tags from '../../util/tags';

/**
 * Simplified response handler for PostScript destination
 *
 * Processes PostScript API responses and handles success/error cases
 * using basic HTTP status code patterns with general retry logic.
 *
 * @param responseParams - Response parameters from network layer
 * @returns Formatted response object for RudderStack
 */
const responseHandler = (responseParams: any): any => {
  const { destinationResponse } = responseParams;
  const message = `[${DESTINATION_NAME} Response Handler] - Request processed successfully`;
  const { status } = destinationResponse;

  // Handle successful responses
  if (isHttpStatusSuccess(status)) {
    return {
      status,
      message,
      destinationResponse,
    };
  }

  // Handle specific error cases based on standard HTTP status codes

  // Rate limiting (429) - should be retried with throttling
  if (status === 429) {
    throw new ThrottledError(`[${DESTINATION_NAME}] Rate limit exceeded`, destinationResponse);
  }

  // Server errors (5xx) - generally retryable
  if (status >= 500) {
    throw new RetryableError(
      `[${DESTINATION_NAME}] Server error occurred`,
      500,
      destinationResponse,
    );
  }

  // Client errors (4xx) - generally not retryable
  // Throw as NetworkError for proper error categorization
  throw new NetworkError(
    `[${DESTINATION_NAME}] Request failed with status: ${status}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
  );
};

/**
 * PostScript Network Handler
 *
 * Implements the standard network handler interface for PostScript destination.
 * Uses the common pattern found across RudderStack destinations.
 */
function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

export { networkHandler };
