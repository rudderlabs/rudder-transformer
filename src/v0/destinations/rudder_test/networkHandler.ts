import { NetworkError } from '@rudderstack/integrations-lib';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import { TAG_NAMES } from '../../util/tags';
import { TestBehavior } from './type';

const DESTINATION = 'RUDDER_TEST';

/**
 * Extract test behavior from the destination request
 * This helps simulate different response scenarios for testing
 */
const getTestBehaviorFromRequest = (
  destinationRequest: DestinationRequest,
): TestBehavior | undefined => destinationRequest?.body?.JSON?.testBehavior;

/**
 * Mock proxy request function that simulates HTTP calls without making real network requests
 * This is used for rudder_test destination which is a test/mock destination
 */
const mockProxyRequest = async (destinationRequest: DestinationRequest): Promise<MockResponse> => {
  // Extract test behavior to determine response
  const testBehavior = getTestBehaviorFromRequest(destinationRequest);

  // Simulate different response scenarios based on test behavior
  if (testBehavior?.statusCode && testBehavior.statusCode !== 200) {
    const errorMessage = testBehavior.errorMessage ?? 'Test error simulated';
    // Simulate error response
    return {
      success: false,
      response: {
        status: testBehavior.statusCode,
        statusText: testBehavior.errorMessage ?? 'Test Error',
        data: {
          error: errorMessage,
        },
      },
    };
  }

  // Simulate successful response
  return {
    success: true,
    response: {
      status: 200,
      statusText: 'OK',
      data: {
        message: `Mock response for ${DESTINATION}`,
        recordId: destinationRequest?.body?.JSON?.recordId,
        timestamp: new Date().toISOString(),
      },
    },
  };
};

/**
 * Mock prepare proxy request function
 * Since this is a test destination, we don't need to prepare real network requests
 */
const mockPrepareProxyRequest = (destinationRequest: DestinationRequest): DestinationRequest =>
  destinationRequest;

/**
 * Mock process axios response function
 * Processes the mock response to extract relevant data
 */
const mockProcessAxiosResponse = (response: MockResponse | unknown): unknown => {
  if (response && typeof response === 'object' && 'response' in response) {
    const mockResponse = response as MockResponse;
    return {
      response: mockResponse.response.data,
      status: mockResponse.response.status,
    };
  }
  return response;
};

/**
 * Response handler for rudder_test destination proxy v0
 * This is a test destination that simulates various response scenarios
 * based on the request payload for testing purposes
 */
const responseHandler = (responseParams: ResponseParams): unknown => {
  const { destinationResponse, destinationRequest } = responseParams;
  const message = `Request for ${DESTINATION} Processed Successfully`;

  // Get status from the mock response
  const status = destinationResponse?.status || 200;

  // Check for test behavior in the request to simulate different responses
  const testBehavior = getTestBehaviorFromRequest(destinationRequest);

  // Simulate errors based on test behavior using existing statusCode and errorMessage
  if (testBehavior?.statusCode && testBehavior.statusCode !== 200) {
    const errorStatus = testBehavior.statusCode;
    const errorMsg = testBehavior.errorMessage ?? `Test error simulated for ${DESTINATION}`;

    throw new NetworkError(
      errorMsg,
      errorStatus,
      {
        [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
      },
      destinationResponse,
    );
  }

  // If the mock response indicates an error, handle it
  if (status >= 400) {
    throw new NetworkError(
      `Request failed for ${DESTINATION} with status: ${status}`,
      status,
      {
        [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }

  // Success case
  return {
    status,
    message,
    destinationResponse,
  };
};

class NetworkHandler {
  responseHandler = responseHandler;

  proxy = mockProxyRequest;

  prepareProxy = mockPrepareProxyRequest;

  processAxiosResponse = mockProcessAxiosResponse;
}

export { NetworkHandler as networkHandler, responseHandler, getTestBehaviorFromRequest };
