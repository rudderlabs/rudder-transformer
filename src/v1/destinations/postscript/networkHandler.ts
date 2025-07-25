/**
 * PostScript Destination Network Handler V1
 *
 * This file implements the network response handler for PostScript destination using the V1 API structure.
 * It follows the standard pattern for V1 destinations by including the required 'response' array field
 * for proper delivery status tracking of individual events.
 */

import { NetworkError, RetryableError, ThrottledError } from '@rudderstack/integrations-lib';
import { ResponseHandlerParams, ResponseProxyObject, DeliveryJobState } from '../../../types';
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse, getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import { isHttpStatusSuccess } from '../../../v0/util';
import { DESTINATION_NAME } from '../../../v0/destinations/postscript/config';
import tags from '../../../v0/util/tags';

/**
 * Response handler for PostScript destination (V1)
 *
 * Processes PostScript API responses and handles success/error cases following V1 standards.
 * Includes the required 'response' array field for individual event status tracking.
 *
 * @param responseParams - Response parameters from network layer
 * @returns Formatted response object for RudderStack V1
 */
const responseHandler = (responseParams: ResponseHandlerParams): ResponseProxyObject => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `[${DESTINATION_NAME} Response Handler] - Request processed successfully`;
  const { status } = destinationResponse;

  // Ensure rudderJobMetadata is an array
  const metadata = Array.isArray(rudderJobMetadata) ? rudderJobMetadata : [rudderJobMetadata];

  // Handle successful responses
  if (isHttpStatusSuccess(status)) {
    // Create response array for individual event tracking
    const response: DeliveryJobState[] = metadata.map((meta) => ({
      statusCode: status,
      metadata: meta,
      error: 'success',
    }));

    return {
      status,
      message,
      destinationResponse,
      response,
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
function networkHandler(this) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

export { networkHandler };
