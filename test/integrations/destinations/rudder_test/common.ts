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
