import { NetworkError } from '@rudderstack/integrations-lib';
import { isHttpStatusSuccess } from '../../v0/util/index';
import { proxyRequest, prepareProxyRequest } from '../network';
import { getDynamicErrorType, processAxiosResponse } from '../utils/networkUtils';
import tags from '../../v0/util/tags';
import { ResponseParams, ResponseObject } from '../../types';

/**
 * Base class for all network handlers
 * Provides common functionality for network operations
 * Destination-specific handlers can extend this class and override responseHandler method
 */
export class BaseNetworkHandler {
  proxy: typeof proxyRequest;

  prepareProxy: typeof prepareProxyRequest;

  processAxiosResponse: typeof processAxiosResponse;

  constructor() {
    this.proxy = proxyRequest;
    this.prepareProxy = prepareProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }

  /**
   * Handles responses from destinations
   * This method can be overridden by destination-specific handlers
   *
   * --responseTransform-- this is a function which can be used to handle responses which are not compatible with
   * rudder-server. If responseTransform for a destination is enabled, rudder-server will send the response received
   * from destination back to transformer where it expects a compatible response with statusCode as output
   *
   * Individual response transform logic can exist for specific destinations based on requirements. If a destination
   * has responseTransformation enabled but doesn't contain custom transformation, this method will act as a fallback.
   *
   * @param responseParams - The response parameters
   * @returns The processed response
   */
  responseHandler(responseParams: ResponseParams): ResponseObject {
    // Ensure rudderJobMetadata is an array
    const rudderJobMetadata = Array.isArray(responseParams.rudderJobMetadata)
      ? responseParams.rudderJobMetadata
      : [responseParams.rudderJobMetadata];
    const { destinationResponse, destType } = responseParams;
    const { status } = destinationResponse;
    const message = `[Base Response Handler] Request for destination: ${destType} Processed Successfully`;

    // If the response from destination is not a success case, build an explicit error
    if (!isHttpStatusSuccess(status)) {
      throw new NetworkError(
        `[Base Response Handler] Request failed for destination ${destType} with status: ${status}`,
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
        },
        destinationResponse,
      );
    }

    return {
      status,
      message,
      destinationResponse,
      response: rudderJobMetadata.map((metadata) => ({
        statusCode: status,
        metadata,
        error: 'success',
      })),
    };
  }
}

export default BaseNetworkHandler;
