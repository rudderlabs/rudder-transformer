import { handleRtTfSingleEventError } from '../../util';
import { RudderTestRouterRequest, RudderTestMessage, RudderTestDestination } from './type';
import { ProcessorTransformationRequest } from '../../../types';
import {
  validateMessageType,
  buildRequestConfig,
  checkTestBehaviorAndThrow,
  hasTestBehaviorError,
  buildTestBehaviorErrorResponse,
} from './utils';

const processRouterDest = async (
  inputs: RudderTestRouterRequest[],
  reqMetadata: Record<string, unknown>,
) => {
  if (!inputs?.length) return [];

  // SIMPLIFIED: No complex processing patterns
  // SIMPLIFIED: Just process each event individually
  const responses = inputs.map((event) => {
    try {
      // Basic validation using helper function
      validateMessageType(event.message);

      // Check for test behavior error using helper function
      if (hasTestBehaviorError(event.message)) {
        return buildTestBehaviorErrorResponse(event.message, event.metadata, event.destination);
      }

      // Otherwise return success response with event data using helper function
      return {
        batchedRequest: buildRequestConfig(event.message, event.destination),
        metadata: [event.metadata],
        batched: false,
        statusCode: 200,
        destination: event.destination,
      };
    } catch (error) {
      return handleRtTfSingleEventError(event, error, reqMetadata);
    }
  });

  return responses;
};

// Utility functions are now extracted to utils.ts to reduce code duplication

// Simple processor function for single event processing
const process = (event: ProcessorTransformationRequest) => {
  const { message, destination } = event;
  const rudderMessage = message as RudderTestMessage;
  const rudderDestination = destination as RudderTestDestination;

  // Basic validation using helper function
  validateMessageType(rudderMessage);

  // Check for test behavior and throw error if needed using helper function
  checkTestBehaviorAndThrow(rudderMessage);

  // Return success response with event data using helper function
  return buildRequestConfig(rudderMessage, rudderDestination);
};

export { process, processRouterDest };
