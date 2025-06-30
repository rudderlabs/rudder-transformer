import { InstrumentationError } from '@rudderstack/integrations-lib';
import { getBaseEndpoint } from './config';
import { RudderTestMessage, RudderTestDestination } from './type';
import { Metadata } from '../../../types';

// Helper function to validate message type
export const validateMessageType = (message: RudderTestMessage): void => {
  if (message.type !== 'record') {
    throw new InstrumentationError(
      `Message type "${message.type}" is not supported. Only 'record' type is supported.`,
    );
  }
};

// Helper function to build JSON payload
export const buildJsonPayload = (message: RudderTestMessage) => ({
  action: message.action,
  fields: message.fields || {},
  identifiers: message.identifiers || {},
  recordId: message.recordId,
  timestamp: message.timestamp || new Date().toISOString(),
});

// Helper function to build request configuration
export const buildRequestConfig = (
  message: RudderTestMessage,
  destination?: RudderTestDestination,
) => {
  // Use destination config endpoint if available, otherwise fall back to base endpoint
  const endpoint = destination?.Config?.endpoint || getBaseEndpoint();

  return {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint,
    headers: {
      'Content-Type': 'application/json',
      // Include apiKey in headers if available from destination config
      ...(destination?.Config?.apiKey && { 'X-API-Key': destination.Config.apiKey }),
    },
    params: {},
    body: {
      JSON: buildJsonPayload(message),
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    files: {},
  };
};

// Helper function to get test behavior from message
export const getTestBehavior = (message: RudderTestMessage) => message.context?.testBehavior;

// Helper function to check if test behavior indicates an error
export const hasTestBehaviorError = (message: RudderTestMessage): boolean => {
  const testBehavior = getTestBehavior(message);
  return !!(testBehavior?.statusCode && testBehavior.statusCode !== 200);
};

// Helper function to check test behavior and throw error if needed (for processor)
export const checkTestBehaviorAndThrow = (message: RudderTestMessage): void => {
  const testBehavior = getTestBehavior(message);

  if (testBehavior?.statusCode && testBehavior.statusCode !== 200) {
    throw new InstrumentationError(testBehavior.errorMessage || 'Test error');
  }
};

// Helper function to build error response for router
export const buildTestBehaviorErrorResponse = (
  message: RudderTestMessage,
  metadata: Metadata,
  destination: RudderTestDestination,
) => {
  const testBehavior = getTestBehavior(message);

  return {
    statusCode: testBehavior?.statusCode || 400,
    error: testBehavior?.errorMessage || 'Test error',
    metadata: [metadata],
    destination,
    batched: false,
    statTags: {
      destType: 'rudder_test',
      errorCategory: 'dataValidation',
      errorType: 'instrumentation',
      feature: 'router',
      implementation: 'native',
      module: 'destination',
    },
  };
};
