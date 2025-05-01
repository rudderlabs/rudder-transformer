/**
 * Network handler for the dummy destination
 * This provides proxy functionality for the dummy destination
 */

import { NetworkError } from '@rudderstack/integrations-lib';
import { isHttpStatusSuccess } from '../../util/index';
import { proxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { DESTINATION } from './config';
import tags from '../../util/tags';

/**
 * NetworkHandler class for the dummy destination
 * Handles network operations and response processing
 */
class NetworkHandler {
  private proxyRequestFn: typeof proxyRequest;

  private processAxiosResponseFn: typeof processAxiosResponse;

  constructor() {
    this.proxyRequestFn = proxyRequest;
    this.processAxiosResponseFn = processAxiosResponse;
  }

  /**
   * Proxy function for the dummy destination (used by the service)
   * @param request - The proxy request
   * @returns The proxy response
   */
  async proxy(request: Record<string, any>, destinationType?: string) {
    try {
      return await this.proxyRequestFn(request, destinationType || DESTINATION);
    } catch (error: any) {
      // For test purposes, if the error has a response property with a status, use that status
      if (error.response && error.response.status) {
        // For dataDelivery tests, we need to propagate the status code
        return {
          status: error.response.status,
          response: error.response.data || error.response,
        };
      }

      // Handle network errors
      throw new NetworkError(
        `[${DESTINATION}] Failed to connect to the API: ${error.message || 'Unknown error'}`,
        500,
        error as Record<string, string>,
      );
    }
  }

  /**
   * Proxy function for the dummy destination (for backward compatibility)
   * @param request - The proxy request
   * @returns The proxy response
   */
  async proxyRequest(request: Record<string, any>) {
    return this.proxy(request);
  }

  /**
   * Process Axios response
   * @param response - The Axios response
   * @returns The processed response
   */
  processAxiosResponse(response: Record<string, any>) {
    return this.processAxiosResponseFn(response);
  }

  /**
   * Response handler for the dummy destination
   * @param responseParams - The response parameters
   * @returns The processed response
   */
  responseHandler(responseParams: Record<string, any>) {
    const { destinationResponse } = responseParams;
    const { status, response } = destinationResponse;

    // Check if the response is successful
    if (isHttpStatusSuccess(status)) {
      return {
        status,
        message: `[${DESTINATION}] Request processed successfully`,
        destinationResponse,
      };
    }

    // Handle rate limiting
    if (status === 429) {
      throw new NetworkError(
        `[${DESTINATION}] Rate limit exceeded. Please try again later.`,
        429,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: 'throttled',
        },
        destinationResponse,
      );
    }

    // Handle authentication errors
    if (status === 401 || status === 403) {
      throw new NetworkError(
        `[${DESTINATION}] Authentication failed: ${response?.error || 'Invalid credentials'}`,
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: 'auth',
        },
        destinationResponse,
      );
    }

    // Handle other errors
    throw new NetworkError(
      `[${DESTINATION}] Request failed with status ${status}: ${response?.error || 'Unknown error'}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }
}

// Export the NetworkHandler class as expected by the networkHandlerFactory
export { NetworkHandler as networkHandler };
