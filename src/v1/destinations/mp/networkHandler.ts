import { BaseNetworkHandler } from '../../../adapters/networkhandler/baseNetworkHandler';
import { ResponseParams, ResponseObject } from '../../../types';
import { isHttpStatusSuccess } from '../../../v0/util';
import { DESTINATION } from '../../../v0/destinations/mp/config';
import {
  createSuccessResponse,
  handleNonSuccessResponse,
  handleEndpointSpecificResponses,
} from './utils';

/**
 * NetworkHandler for Mixpanel destination
 * Extends BaseNetworkHandler to provide Mixpanel-specific response handling
 */
class NetworkHandler extends BaseNetworkHandler {
  /**
   * Main response handler that delegates to specific endpoint handlers
   * Implements partial failure handling for batch requests in v1 proxy
   *
   * @param responseParams - The response parameters
   * @returns The processed response
   */
  responseHandler(responseParams: ResponseParams): ResponseObject {
    // Ensure rudderJobMetadata is an array
    const rudderJobMetadata = Array.isArray(responseParams.rudderJobMetadata)
      ? responseParams.rudderJobMetadata
      : [responseParams.rudderJobMetadata];
    const { destinationResponse, destinationRequest } = responseParams;
    const message = `Request for ${DESTINATION} Processed Successfully`;
    const { status } = destinationResponse;
    const endpoint = destinationRequest?.endpoint || '';

    // Handle endpoint-specific responses
    const endpointResponse = handleEndpointSpecificResponses(endpoint, responseParams);
    if (endpointResponse) {
      return endpointResponse;
    }

    // Handle non-success status codes for all endpoints
    if (!isHttpStatusSuccess(status)) {
      handleNonSuccessResponse(responseParams);
    }

    // Default success case for any other endpoints
    return createSuccessResponse(status, message, rudderJobMetadata);
  }
}

export { NetworkHandler as networkHandler };
export default NetworkHandler;
