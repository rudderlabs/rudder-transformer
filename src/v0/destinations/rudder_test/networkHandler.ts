import { NetworkError } from '@rudderstack/integrations-lib';
import { isHttpStatusSuccess } from '../../util/index';
import { proxyRequest, prepareProxyRequest } from '../../../adapters/network';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TAG_NAMES } from '../../util/tags';
import { TestBehavior } from './type';

const DESTINATION = 'RUDDER_TEST';

/**
 * Extract test behavior from the destination request
 * This helps simulate different response scenarios for testing
 */
const getTestBehaviorFromRequest = (destinationRequest: any): TestBehavior | null => {
  const requestBody = destinationRequest?.body?.JSON;
  if (requestBody?.testBehavior) {
    return requestBody.testBehavior;
  }
  return null;
};

/**
 * Response handler for rudder_test destination proxy v0
 * This is a test destination that simulates various response scenarios
 * based on the request payload for testing purposes
 */
const responseHandler = (responseParams: any): any => {
  const { destinationResponse, destinationRequest } = responseParams;
  const message = `Request for ${DESTINATION} Processed Successfully`;
  const { status } = destinationResponse;

  // Check for test behavior in the request to simulate different responses
  const testBehavior = getTestBehaviorFromRequest(destinationRequest);

  // If the response from destination is not a success case, build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `Request failed for ${DESTINATION} with status: ${status}`,
      status,
      {
        [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }

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

  // Success case
  return {
    status,
    message,
    destinationResponse,
  };
};

class NetworkHandler {
  responseHandler = responseHandler;

  proxy = proxyRequest;

  prepareProxy = prepareProxyRequest;

  processAxiosResponse = processAxiosResponse;
}

export { NetworkHandler as networkHandler, responseHandler, getTestBehaviorFromRequest };
