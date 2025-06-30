import { handleRtTfSingleEventError } from '../../util';
import {
  RudderTestRouterRequest,
  RudderTestMessage,
  RudderTestDestination,
  RudderTestProcessorRequest,
} from './type';
import { validateMessageType, buildRequestConfig, checkTestBehaviorAndThrow } from './utils';

// Simple processor function for single event processing
const process = (event: RudderTestProcessorRequest) => {
  const { message, destination } = event;
  const rudderMessage = message as RudderTestMessage;
  const rudderDestination = destination as RudderTestDestination;

  // Basic validation using helper function
  validateMessageType(rudderMessage);

  // Check for test behavior and throw error if needed using helper function
  checkTestBehaviorAndThrow(rudderMessage);

  // Test behavior: attempt to mutate destination config if requested
  if (rudderMessage.context?.testBehavior?.mutateDestinationConfig) {
    // This should throw an error if the config is frozen (compacted payload)
    rudderDestination.Config.mutatedByTest = true;
  }

  // Test behavior: attempt to replace destination config reference if requested
  if (rudderMessage.context?.testBehavior?.replaceDestinationConfig) {
    // This should throw an error if the config is frozen (compacted payload)
    rudderDestination.Config = { replaced: true } as any;
  }

  // Return success response with event data using helper function
  return buildRequestConfig(rudderMessage, rudderDestination);
};

const processRouterDest = async (
  inputs: RudderTestRouterRequest[],
  reqMetadata: Record<string, unknown>,
) => {
  if (!inputs?.length) return [];

  const responses = inputs.map((event) => {
    try {
      return {
        batchedRequest: process(event),
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

export { process, processRouterDest };
