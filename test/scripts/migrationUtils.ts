import { removeUndefinedValues } from '@rudderstack/integrations-lib';
import {
  Metadata,
  Destination,
  ProcessorTransformationRequest,
  RouterTransformationRequest,
  ProxyV1Request,
  ProcessorTransformationResponse,
  RouterTransformationResponse,
} from '../../src/types';

import {
  TestCaseData,
  ProcessorTestData,
  RouterTestData,
  ProxyV1TestData,
} from '../integrations/testTypes';

// Default metadata to fill in missing fields
const defaultMetadata: Metadata = {
  sourceId: 'default-source',
  workspaceId: 'default-workspace',
  namespace: 'default-namespace',
  instanceId: 'default-instance',
  sourceType: 'default-source-type',
  sourceCategory: 'default-category',
  trackingPlanId: 'default-tracking-plan',
  trackingPlanVersion: 1,
  sourceTpConfig: {},
  mergedTpConfig: {},
  destinationId: 'default-destination',
  jobRunId: 'default-job-run',
  jobId: 1,
  sourceBatchId: 'default-batch',
  sourceJobId: 'default-source-job',
  sourceJobRunId: 'default-source-job-run',
  sourceTaskId: 'default-task',
  sourceTaskRunId: 'default-task-run',
  recordId: {},
  destinationType: 'default-destination-type',
  messageId: 'default-message-id',
  oauthAccessToken: 'default-token',
  messageIds: ['default-message-id'],
  rudderId: 'default-rudder-id',
  receivedAt: new Date().toISOString(),
  eventName: 'default-event',
  eventType: 'default-type',
  sourceDefinitionId: 'default-source-def',
  destinationDefinitionId: 'default-dest-def',
  transformationId: 'default-transform',
  dontBatch: false,
};

// Default destination configuration
const defaultDestination: Destination = {
  ID: 'default-destination-id',
  Name: 'Default Destination',
  DestinationDefinition: {
    ID: 'default-dest-def-id',
    Name: 'Default Destination Definition',
    DisplayName: 'Default Display Name',
    Config: {},
  },
  Config: {},
  Enabled: true,
  WorkspaceID: 'default-workspace',
  Transformations: [],
  RevisionID: 'default-revision',
  IsProcessorEnabled: true,
  IsConnectionEnabled: true,
};

// Utility function to migrate generic test cases
export function migrateTestCase(oldTestCase: any): TestCaseData {
  return {
    id: oldTestCase.id || `test-${Date.now()}`,
    name: oldTestCase.name || 'Migrated Test Case',
    description: oldTestCase.description || 'Migrated from legacy test case',
    scenario: oldTestCase.scenario || 'Default scenario',
    successCriteria: oldTestCase.successCriteria || 'Test should pass successfully',
    feature: oldTestCase.feature || 'default-feature',
    module: oldTestCase.module || 'default-module',
    version: oldTestCase.version || '1.0.0',
    input: {
      request: {
        method: oldTestCase.input?.request?.method || 'POST',
        body: oldTestCase.input?.request?.body || {},
        headers: oldTestCase.input?.request?.headers || {},
        params: oldTestCase.input?.request?.params || {},
      },
      pathSuffix: oldTestCase.input?.pathSuffix,
    },
    output: {
      response: {
        status: oldTestCase.output?.response?.status || 200,
        body: oldTestCase.output?.response?.body || {},
        headers: oldTestCase.output?.response?.headers || {},
      },
    },
  };
}

// Utility function to migrate processor test cases
export function migrateProcessorTestCase(oldTestCase: any, index: number): ProcessorTestData {
  const processorRequest: ProcessorTransformationRequest = {
    message: oldTestCase.input?.request?.body[0]?.message || {},
    metadata: { ...defaultMetadata, ...oldTestCase.input?.request?.body[0]?.metadata },
    destination: { ...defaultDestination, ...oldTestCase.input?.request?.body[0]?.destination },
  };

  const processorResponse: ProcessorTransformationResponse = {
    output: oldTestCase.output?.response?.body[0]?.output,
    metadata: { ...defaultMetadata, ...oldTestCase.output?.response?.body[0]?.metadata },
    statusCode: oldTestCase.output?.response?.body[0]?.statusCode || 200,
    error: oldTestCase.output?.response?.body[0]?.error,
    statTags: oldTestCase.output?.response?.body[0]?.statTags,
  };

  return removeUndefinedValues({
    id: oldTestCase.id || `processor-${Date.now()}`,
    name: oldTestCase.name || 'Processor Test Case',
    description: oldTestCase.description || 'Migrated processor test case',
    scenario: oldTestCase.scenario || 'Default processor scenario',
    successCriteria: oldTestCase.successCriteria || 'Processor test should pass successfully',
    feature: oldTestCase.feature || 'processor',
    module: oldTestCase.module || 'transformation',
    version: oldTestCase.version || '1.0.0',
    input: {
      request: {
        method: oldTestCase.input?.request?.method || 'POST',
        body: [processorRequest],
      },
    },
    output: {
      response: {
        status: 200,
        body: [processorResponse],
      },
    },
    mockFns: oldTestCase.mockFns ? `Add mock of index ${index}` : undefined,
  }) as ProcessorTestData;
}

// Utility function to migrate router test cases
export function migrateRouterTestCase(oldTestCase: any, index: number): RouterTestData {
  const input = Array.isArray(oldTestCase.input.request.body.input)
    ? oldTestCase.input.request.body.input.map((item: any) => ({
        message: item.message || {},
        metadata: { ...defaultMetadata, ...item.metadata },
        destination: { ...defaultDestination, ...item.destination },
      }))
    : {
        message: oldTestCase.input.request.body.input?.message || {},
        metadata: { ...defaultMetadata, ...oldTestCase.input.request.body.input?.metadata },
        destination: {
          ...defaultDestination,
          ...oldTestCase.input.request.body.input?.destination,
        },
      };
  const routerRequest: RouterTransformationRequest = {
    input: input,
    destType: oldTestCase.input?.request?.body?.destType || 'default-destination-type',
  };

  const routerResponse: RouterTransformationResponse = oldTestCase.output.response.body.output.map(
    (op) => {
      return removeUndefinedValues({
        batchedRequest: op.batchedRequest,
        metadata: op.metadata.map((m: any) => ({ ...defaultMetadata, ...m })),
        statusCode: op.statusCode || 200,
        destination: { ...defaultDestination, ...op.destination },
        batched: op.batched || false,
        error: op.error,
        statTags: op.statTags,
      });
    },
  );

  return removeUndefinedValues({
    id: oldTestCase.id || `router-${Date.now()}`,
    name: oldTestCase.name || 'Router Test Case',
    description: oldTestCase.description || 'Migrated router test case',
    scenario: oldTestCase.scenario || 'Default router scenario',
    successCriteria: oldTestCase.successCriteria || 'Router test should pass successfully',
    feature: oldTestCase.feature || 'router',
    module: oldTestCase.module || 'transformation',
    version: oldTestCase.version || '1.0.0',
    input: {
      request: {
        body: routerRequest,
        method: oldTestCase.input?.request?.method || 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: routerResponse,
        },
      },
    },
    mockFns: oldTestCase.mockFns ? `Add mock of index ${index}` : undefined,
  }) as RouterTestData;
}

// Utility function to migrate proxy test cases
export function migrateProxyTestCase(oldTestCase: any, index: number): ProxyV1TestData {
  const proxyRequest: ProxyV1Request = {
    version: oldTestCase.input?.request?.body?.version || '1.0.0',
    type: oldTestCase.input?.request?.body?.type || 'default-type',
    method: oldTestCase.input?.request?.body?.method || 'POST',
    endpoint: oldTestCase.input?.request?.body?.endpoint || '/default-endpoint',
    userId: oldTestCase.input?.request?.body?.userId || 'default-user',
    metadata: [
      {
        jobId: 1,
        attemptNum: 1,
        userId: 'default-user',
        sourceId: 'default-source',
        destinationId: 'default-destination',
        workspaceId: 'default-workspace',
        secret: {},
        dontBatch: false,
      },
    ],
    destinationConfig: {},
  };

  return {
    id: oldTestCase.id || `proxy-${Date.now()}`,
    name: oldTestCase.name || 'Proxy Test Case',
    description: oldTestCase.description || 'Migrated proxy test case',
    scenario: oldTestCase.scenario || 'Default proxy scenario',
    successCriteria: oldTestCase.successCriteria || 'Proxy test should pass successfully',
    feature: oldTestCase.feature || 'proxy',
    module: oldTestCase.module || 'delivery',
    version: oldTestCase.version || '1.0.0',
    input: {
      request: {
        body: proxyRequest,
        method: oldTestCase.input?.request?.method || 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: proxyRequest.metadata[0],
              },
            ],
          },
        },
      },
    },
  };
}

interface CommonValues {
  metadata?: Metadata;
  destination?: Destination;
  baseRequest?: {
    headers?: Record<string, string>;
    params?: Record<string, string>;
  };
  commonConfig?: Record<string, any>;
}

function deepDiff(obj1: any, obj2: any): any {
  const diff: any = {};

  for (const key in obj1) {
    if (typeof obj1[key] === 'object' && obj1[key] !== null) {
      const nestedDiff = deepDiff(obj1[key], obj2[key] || {});
      if (Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff;
      }
    } else if (obj1[key] !== obj2[key]) {
      diff[key] = obj2[key];
    }
  }

  return diff;
}

export function extractCommonValues(testCases: any[]): CommonValues {
  const commonValues: CommonValues = {};

  // Only proceed if we have test cases
  if (testCases.length === 0) return commonValues;

  // Extract metadata from first test case as base
  const firstCase = testCases[0];
  let isMetadataCommon = true;
  let isDestinationCommon = true;
  let baseMetadata: Metadata | undefined;
  let baseDestination: Destination | undefined;

  // For processor and router cases
  if (firstCase.input?.request?.body) {
    if (Array.isArray(firstCase.input.request.body)) {
      baseMetadata = firstCase.input.request.body[0]?.metadata;
      baseDestination = firstCase.input.request.body[0]?.destination;
    } else {
      baseMetadata = firstCase.input.request.body?.metadata;
      baseDestination = firstCase.input.request.body?.destination;
    }
  }

  // Compare with other test cases
  for (const testCase of testCases.slice(1)) {
    let currentMetadata;
    let currentDestination;

    if (testCase.input?.request?.body) {
      if (Array.isArray(testCase.input.request.body)) {
        currentMetadata = testCase.input.request.body[0]?.metadata;
        currentDestination = testCase.input.request.body[0]?.destination;
      } else {
        currentMetadata = testCase.input.request.body?.metadata;
        currentDestination = testCase.input.request.body?.destination;
      }
    }

    // Check if metadata is common
    if (baseMetadata && currentMetadata) {
      const metadataDiff = deepDiff(baseMetadata, currentMetadata);
      if (Object.keys(metadataDiff).length > 0) {
        isMetadataCommon = false;
      }
    }

    // Check if destination is common
    if (baseDestination && currentDestination) {
      const destinationDiff = deepDiff(baseDestination, currentDestination);
      if (Object.keys(destinationDiff).length > 0) {
        isDestinationCommon = false;
      }
    }
  }

  if (isMetadataCommon && baseMetadata) {
    commonValues.metadata = baseMetadata;
  }

  if (isDestinationCommon && baseDestination) {
    commonValues.destination = baseDestination;
  }

  return commonValues;
}

export function generateOptimizedTestFile(
  testCases: any[],
  commonValues: CommonValues,
  feature: string,
): string {
  const variables: string[] = [];
  const imports: Set<string> = new Set([]);

  // Add necessary imports based on common values
  if (commonValues.metadata) imports.add('Metadata');
  if (commonValues.destination) imports.add('Destination');

  // Generate common variables
  if (commonValues.metadata) {
    variables.push(
      `const baseMetadata: Metadata = ${JSON.stringify(commonValues.metadata, null, 2)};`,
    );
  }

  if (commonValues.destination) {
    variables.push(`
const baseDestination: Destination = ${JSON.stringify(commonValues.destination, null, 2)};`);
  }

  // Process test cases to use common variables
  const processedTests = testCases.map((testCase) => {
    const processedCase = { ...testCase };

    if (commonValues.metadata && testCase.input?.request?.body) {
      // Handle input metadata
      if (Array.isArray(testCase.input.request.body)) {
        processedCase.input.request.body = testCase.input.request.body.map((item: any) => ({
          ...item,
          metadata: 'baseMetadata', // special marker
        }));
      } else {
        processedCase.input.request.body.metadata = 'baseMetadata'; // special marker
        processedCase.output.metadata = 'baseMetadata'; // special marker
      }
      // Handle output metadata
      if (Array.isArray(testCase.output.response.body)) {
        processedCase.output.response.body = testCase.output.response.body.map((item: any) => ({
          ...item,
          metadata: 'baseMetadata', // special marker
        }));
      } else {
        processedCase.output.response.body.metadata = 'baseMetadata'; // special marker
      }
    }

    if (commonValues.destination && testCase.input?.request?.body) {
      // Handle input destination
      if (Array.isArray(testCase.input.request.body)) {
        processedCase.input.request.body = testCase.input.request.body.map((item: any) => ({
          ...item,
          destination: 'baseDestination', // special marker
        }));
      } else {
        processedCase.input.request.body.destination = 'baseDestination'; // special marker
      }
      // Handle output destination
      if (Array.isArray(testCase.output.response.body)) {
        processedCase.output.response.body = testCase.output.response.body.map((item: any) => ({
          ...item,
          metadata: 'baseMetadata', // special marker
        }));
      } else {
        processedCase.output.response.body.metadata = 'baseMetadata'; // special marker
      }
    }

    return processedCase;
  });

  // const functionReplacer = (key, value) => {
  //   if (typeof value === 'function') {
  //     return value.toString();
  //   }
  //   return value;
  // };

  let type = '';
  if (feature === 'processor') {
    type = 'ProcessorTestData';
  } else if (feature === 'router') {
    type = 'RouterTestData';
  }

  // Generate the final file content
  const content = `/**
  * Auto-migrated and optimized test cases
  * Generated on: ${new Date().toISOString()}
  */

  import { ${type} } from '../../../testTypes';
  import { ${Array.from(imports).join(', ')} } from '../../../../../src/types';

  ${variables.join('\n')}

  export const data: ${type}[] = ${JSON.stringify(processedTests, null, 2)};
  `;

  // Replace our special markers with actual variable references
  return content
    .replaceAll('"baseMetadata"', 'baseMetadata')
    .replaceAll('"baseDestination"', 'baseDestination');
}
