import MockConfigBackend from '../../config-backend-server';
import MockExternalApiServer from '../../external-api-server';
import {
  transformationMocks,
  libraryMocks,
  rudderLibraryMocks,
  externalApiMocks,
} from '../test-data';

interface EnvironmentSetupResult {
  configBackendUrl: string;
  externalApiUrl: string;
  configPort: number;
  externalApiPort: number;
}

interface TestEnvironmentOptions {
  transformationMocks?: Record<string, any>;
  libraryMocks?: Record<string, any>;
  rudderLibraryMocks?: Record<string, any>;
  externalApiMocks?: Record<string, any>;
}

interface TestEventMessage {
  messageId: string;
  type: string;
  event: string;
  userId: string;
  properties: Record<string, any>;
  timestamp: string;
  [key: string]: any;
}

interface TestEventMetadata {
  sourceId: string;
  sourceName: string;
  workspaceId: string;
  sourceType: string;
  sourceCategory: string;
  destinationId: string;
  destinationType: string;
  destinationName: string;
  transformationId: string;
  transformationVersionId: string;
  [key: string]: any;
}

interface TestEventDestination {
  ID: string;
  Name: string;
  Config: Record<string, any>;
  [key: string]: any;
}

interface TestEvent {
  message: TestEventMessage;
  metadata: TestEventMetadata;
  destination: TestEventDestination;
}

interface TestEventOverrides {
  message?: Partial<TestEventMessage>;
  metadata?: Partial<TestEventMetadata>;
  destination?: Partial<TestEventDestination>;
  properties?: Record<string, any>;
}

interface TransformationRequest {
  message: TestEventMessage;
  metadata: TestEventMetadata;
  destination: TestEventDestination & {
    Transformations: Array<{ VersionID: string }>;
  };
  libraries: Array<{ VersionID: string }>;
}

interface TransformationResponseItem {
  statusCode: number;
  metadata: Record<string, any>;
  output?: {
    messageId: string;
    type: string;
    properties?: Record<string, any>;
    [key: string]: any;
  };
  error?: string;
  [key: string]: any;
}

export class TestEnvironment {
  private configBackend: MockConfigBackend;
  private externalApiServer: MockExternalApiServer;
  private originalEnv: Record<string, string | undefined>;

  constructor(options: TestEnvironmentOptions = {}) {
    // Inject mock data into servers
    this.configBackend = new MockConfigBackend({
      transformationMocks: options.transformationMocks || transformationMocks,
      libraryMocks: options.libraryMocks || libraryMocks,
      rudderLibraryMocks: options.rudderLibraryMocks || rudderLibraryMocks,
    });
    this.externalApiServer = new MockExternalApiServer({
      externalApiMocks: options.externalApiMocks || externalApiMocks,
    });
    this.originalEnv = {};
  }

  async setup(): Promise<EnvironmentSetupResult> {
    // Start mock servers
    const configPort = await this.configBackend.start();
    const externalApiPort = await this.externalApiServer.start();

    // Configure config backend to replace placeholder URLs
    this.configBackend.setMockExternalApiUrl(this.externalApiServer.getBaseUrl());

    // Store original environment variables
    this.originalEnv = {
      CONFIG_BACKEND_URL: process.env.CONFIG_BACKEND_URL,
      ENABLE_FUNCTIONS: process.env.ENABLE_FUNCTIONS,
    };

    // Set environment variables to point to mock servers
    process.env.CONFIG_BACKEND_URL = this.configBackend.getBaseUrl();
    process.env.ENABLE_FUNCTIONS = 'true';
    process.env.MOCK_EXTERNAL_API_URL = this.externalApiServer.getBaseUrl();

    console.log(`[TestEnvironment] Setup complete:`);
    console.log(`  - Config Backend: ${this.configBackend.getBaseUrl()}`);
    console.log(`  - External API: ${this.externalApiServer.getBaseUrl()}`);

    return {
      configBackendUrl: this.configBackend.getBaseUrl(),
      externalApiUrl: this.externalApiServer.getBaseUrl(),
      configPort,
      externalApiPort,
    };
  }

  async teardown(): Promise<void> {
    // Stop mock servers
    await this.configBackend.stop();
    await this.externalApiServer.stop();

    // Restore original environment variables
    Object.entries(this.originalEnv).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });

    console.log(`[TestEnvironment] Teardown complete`);
  }

  // Helper methods to add mocks during tests
  addTransformationMock(versionId: string, mockData: any): void {
    this.configBackend.addTransformationMock(versionId, mockData);
  }

  addLibraryMock(versionId: string, mockData: any): void {
    this.configBackend.addLibraryMock(versionId, mockData);
  }

  addRudderLibraryMock(name: string, mockData: any): void {
    this.configBackend.addRudderLibraryMock(name, mockData);
  }

  addExternalApiMock(url: string, mockConfig: any): void {
    this.externalApiServer.addApiMock(url, mockConfig);
  }
}

// Helper function to create test events
export function createTestEvent(overrides: TestEventOverrides = {}): TestEvent {
  return {
    message: {
      messageId: 'test-message-id-' + Date.now(),
      type: 'track',
      event: 'Test Event',
      userId: 'test-user-id',
      properties: {
        testProperty: 'testValue',
        ...overrides.properties,
      },
      timestamp: new Date().toISOString(),
      ...overrides.message,
    },
    metadata: {
      sourceId: 'test-source-id',
      sourceName: 'Test Source',
      workspaceId: 'test-workspace-id',
      sourceType: 'javascript',
      sourceCategory: 'web',
      destinationId: 'test-destination-id',
      destinationType: 'webhook',
      destinationName: 'Test Destination',
      transformationId: 'test-transformation-id',
      transformationVersionId: 'test-version-id',
      ...overrides.metadata,
    },
    destination: {
      ID: 'test-destination-id',
      Name: 'Test Destination',
      Config: {},
      ...overrides.destination,
    },
  };
}

// Helper function to create transformation request
export function createTransformationRequest(
  events: TestEvent | TestEvent[],
  versionId: string,
  libraryVersionIds: string[] = [],
): TransformationRequest[] {
  const eventArray = Array.isArray(events) ? events : [events];

  return eventArray.map((event) => ({
    message: event.message,
    metadata: event.metadata,
    destination: {
      ...event.destination,
      Transformations: [
        {
          VersionID: versionId,
        },
      ],
    },
    libraries: libraryVersionIds.map((id) => ({ VersionID: id })),
  }));
}

// Helper function to validate transformation response
export function validateTransformationResponse(
  response: TransformationResponseItem[],
  expectedCount?: number,
): TransformationResponseItem[] {
  expect(Array.isArray(response)).toBe(true);

  if (expectedCount !== undefined) {
    expect(response).toHaveLength(expectedCount);
  }

  response.forEach((item) => {
    // All responses should have these properties
    expect(item).toHaveProperty('statusCode');
    expect(item).toHaveProperty('metadata');

    if (item.statusCode === 200) {
      // Success response structure
      expect(item).toHaveProperty('output');
      expect(item.output).toHaveProperty('messageId');
      expect(item.output).toHaveProperty('type');
    } else {
      // Error response structure
      expect(item).toHaveProperty('error');
    }
  });

  return response;
}

// Helper function to extract successful transformations
export function getSuccessfulTransformations(
  response: TransformationResponseItem[],
): TransformationResponseItem[] {
  return response.filter((item) => item.statusCode === 200);
}

// Helper function to extract failed transformations
export function getFailedTransformations(
  response: TransformationResponseItem[],
): TransformationResponseItem[] {
  return response.filter((item) => item.statusCode !== 200);
}
