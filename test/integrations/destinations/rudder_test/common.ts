import { Destination, Connection } from '../../../../src/types';

export const destType = 'rudder_test';
export const destTypeInUpperCase = 'RUDDER_TEST';
export const displayName = 'Rudder Test';

export const destination: Destination = {
  Config: {
    // Empty for now - just for platform testing
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: '123',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: '123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

// CDK v2 destination for testing CDK v2 workflows
export const destinationV2: Destination = {
  Config: {
    // Empty for now - just for platform testing
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: '123-v2',
    Name: destTypeInUpperCase,
    Config: {
      cdkV2Enabled: true,
    },
  },
  Enabled: true,
  ID: '123-v2',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

// Destination with dynamic config for testing dynamic config processing
export const destinationWithDynamicConfig: Destination = {
  Config: {
    apiKey: '{{ message.traits.appId || "default-api-key" }}',
    endpoint: '{{ message.context.endpoint || "https://default.endpoint.com" }}',
    staticValue: 'static-value',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: 'dynamic-123',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: 'dynamic-123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
  hasDynamicConfig: true,
};

// CDK v2 destination with dynamic config
export const destinationWithDynamicConfigV2: Destination = {
  Config: {
    apiKey: '{{ message.traits.appId || "default-api-key" }}',
    endpoint: '{{ message.context.endpoint || "https://default.endpoint.com" }}',
    staticValue: 'static-value',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: 'dynamic-123-v2',
    Name: destTypeInUpperCase,
    Config: {
      cdkV2Enabled: true,
    },
  },
  Enabled: true,
  ID: 'dynamic-123-v2',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
  hasDynamicConfig: true,
};

// Destination without dynamic config (no templates, static config only)
export const destinationWithoutDynamicConfig: Destination = {
  Config: {
    apiKey: 'static-api-key',
    endpoint: 'https://static.endpoint.com',
    staticValue: 'static-value',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: 'static-123',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: 'static-123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
  hasDynamicConfig: false,
};

// CDK v2 destination without dynamic config
export const destinationWithoutDynamicConfigV2: Destination = {
  Config: {
    apiKey: 'static-api-key',
    endpoint: 'https://static.endpoint.com',
    staticValue: 'static-value',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: 'static-123-v2',
    Name: destTypeInUpperCase,
    Config: {
      cdkV2Enabled: true,
    },
  },
  Enabled: true,
  ID: 'static-123-v2',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
  hasDynamicConfig: false,
};

// Connection for compacted payload tests
export const testConnection: Connection = {
  sourceId: 'test-source-id',
  destinationId: 'test-destination-id',
  enabled: true,
  config: {
    connectionMode: 'cloud',
  },
};

// Common test data builders
export const baseRecordMessage = {
  type: 'record' as const,
  action: 'insert',
  fields: {
    email: 'test@example.com',
    name: 'Test User',
  },
  identifiers: {
    userId: 'user123',
  },
  recordId: 'record123',
  messageId: 'msg123',
  timestamp: '2023-01-01T00:00:00.000Z',
};

export const baseSources = {
  job_id: 'job123',
  version: '1.0',
  job_run_id: 'run123',
  task_run_id: 'task123',
};

export const baseTestBehavior = {
  statusCode: 200,
};

export const baseExpectedOutput = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: 'https://test.rudderstack.com/v1/record',
  headers: {
    'Content-Type': 'application/json',
  },
  params: {},
  body: {
    JSON: {
      action: 'insert',
      recordId: 'record123',
      fields: {
        email: 'test@example.com',
        name: 'Test User',
      },
      identifiers: {
        userId: 'user123',
      },
      timestamp: '2023-01-01T00:00:00.000Z',
    },
    JSON_ARRAY: {},
    XML: {},
    FORM: {},
  },
  files: {},
};

// Helper functions to build test data
export const buildMessage = (overrides: any = {}) => ({
  ...baseRecordMessage,
  context: {
    sources: baseSources,
    testBehavior: baseTestBehavior,
    ...overrides.context,
  },
  ...overrides,
});

export const buildDynamicConfigMessage = (endpoint: string, appId: string) =>
  buildMessage({
    context: {
      endpoint,
      sources: baseSources,
      testBehavior: baseTestBehavior,
    },
    traits: {
      appId,
    },
  });

export const buildRouterInput = (message: any, metadata: any, dest: any, connection?: any) => ({
  message,
  metadata,
  destination: dest,
  ...(connection && { connection }),
});

export const buildCompactedRouterInput = (message: any, metadata: any) => ({
  message,
  metadata,
  // Note: destination and connection are omitted in compacted format
});

export const buildRouterOutput = (metadata: any, dest: any, outputOverrides: any = {}) => ({
  batchedRequest: {
    ...baseExpectedOutput,
    ...outputOverrides,
  },
  metadata: Array.isArray(metadata) ? metadata : [metadata],
  statusCode: 200,
  destination: dest,
  batched: false,
});

export const buildProcessorOutput = (metadata: any, outputOverrides: any = {}) => ({
  output: {
    ...baseExpectedOutput,
    userId: '',
    ...outputOverrides,
  },
  statusCode: 200,
  metadata,
});

// Destination with dynamic config but no hasDynamicConfig flag (undefined)
export const destinationWithDynamicConfigUndefined: Destination = {
  Config: {
    apiKey: '{{ message.traits.appId || "default-api-key" }}',
    endpoint: '{{ message.context.endpoint || "https://default.endpoint.com" }}',
    staticValue: 'static-value',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: 'undefined-123',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: 'undefined-123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
  // hasDynamicConfig is undefined
};

// Common headers used across tests
export const commonHeaders = {
  'Content-Type': 'application/json',
  'X-API-Key': 'test-api-key',
};

// Base endpoints for different test scenarios
export const endpoints = {
  record: 'https://test.rudderstack.com/v1/record',
  batch: 'https://test.rudderstack.com/v1/batch',
  identify: 'https://test.rudderstack.com/v1/identify',
  track: 'https://test.rudderstack.com/v1/track',
};

// Common stat tags for error scenarios
export const commonStatTags = {
  destType: 'RUDDER_TEST',
  errorCategory: 'network',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

// Stat tags for different error types
export const errorStatTags = {
  aborted: {
    ...commonStatTags,
    errorType: 'aborted',
  },
  retryable: {
    ...commonStatTags,
    errorType: 'retryable',
  },
  throttled: {
    ...commonStatTags,
    errorType: 'throttled',
  },
};

// Sample test data for record events
export const sampleRecordData = {
  action: 'upsert',
  fields: {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    city: 'New York',
  },
  identifiers: {
    userId: 'user123',
    email: 'john@example.com',
  },
  recordId: 'rec123',
  timestamp: '2024-01-01T12:00:00Z',
};

// Sample batch data for testing
export const sampleBatchData = [
  {
    action: 'upsert',
    fields: { name: 'User 1', email: 'user1@example.com' },
    identifiers: { userId: 'user1' },
    recordId: 'rec1',
    timestamp: '2024-01-01T12:00:00Z',
  },
  {
    action: 'upsert',
    fields: { name: 'User 2', email: 'user2@example.com' },
    identifiers: { userId: 'user2' },
    recordId: 'rec2',
    timestamp: '2024-01-01T12:01:00Z',
  },
  {
    action: 'upsert',
    fields: { name: 'User 3', email: 'user3@example.com' },
    identifiers: { userId: 'user3' },
    recordId: 'rec3',
    timestamp: '2024-01-01T12:02:00Z',
  },
];

// Test behavior scenarios for comprehensive testing
export const testBehaviors = {
  success: {
    statusCode: 200,
  },
  badRequest: {
    statusCode: 400,
    errorMessage: 'Bad Request - Invalid data format',
  },
  unauthorized: {
    statusCode: 401,
    errorMessage: 'Authentication failed - Invalid API key',
  },
  forbidden: {
    statusCode: 403,
    errorMessage: 'Forbidden - insufficient permissions',
  },
  unprocessableEntity: {
    statusCode: 422,
    errorMessage: 'Unprocessable entity - validation failed',
  },
  rateLimited: {
    statusCode: 429,
    errorMessage: 'Too many requests - rate limit exceeded',
  },
  serverError: {
    statusCode: 500,
    errorMessage: 'Internal server error - please retry',
  },
  serviceUnavailable: {
    statusCode: 503,
    errorMessage: 'Service temporarily unavailable',
  },
};

// Batch scenarios for v1 testing
export const batchScenarios = {
  partialFailure: {
    statusCode: 400,
    errorMessage: 'Validation failed',
    batchScenario: 'partial_failure',
    preventFutureBatching: true,
  },
  allFailure: {
    statusCode: 422,
    errorMessage: 'Unprocessable entity',
    batchScenario: 'all_failure',
    preventFutureBatching: true,
  },
  authError: {
    statusCode: 403,
    errorMessage: 'Forbidden - insufficient permissions',
    batchScenario: 'auth_error',
  },
  mixedStatus: {
    batchScenario: 'mixed_status',
  },
  allSuccess: {
    batchScenario: 'all_success',
  },
};

// Helper to create expected response for successful requests
export const createSuccessResponse = (
  status: number,
  message: string,
  destinationResponse: any = { response: '', status },
) => ({
  status,
  message,
  destinationResponse,
});

// Helper to create expected error response
export const createErrorResponse = (status: number, message: string, errorType: string) => ({
  status,
  message,
  statTags: {
    ...commonStatTags,
    errorType,
  },
});
