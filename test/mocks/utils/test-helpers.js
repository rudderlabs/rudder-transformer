const MockConfigBackend = require('../config-backend-server');
const MockExternalApiServer = require('../external-api-server');

class TestEnvironment {
  constructor() {
    this.configBackend = new MockConfigBackend();
    this.externalApiServer = new MockExternalApiServer();
    this.originalEnv = {};
  }

  async setup() {
    // Start mock servers
    const configPort = await this.configBackend.start();
    const externalApiPort = await this.externalApiServer.start();

    // Store original environment variables
    this.originalEnv = {
      CONFIG_BACKEND_URL: process.env.CONFIG_BACKEND_URL,
      ENABLE_FUNCTIONS: process.env.ENABLE_FUNCTIONS,
    };

    // Set environment variables to point to mock servers
    process.env.CONFIG_BACKEND_URL = this.configBackend.getBaseUrl();
    process.env.ENABLE_FUNCTIONS = 'true';

    console.log(`[TestEnvironment] Setup complete:`);
    console.log(`  - Config Backend: ${this.configBackend.getBaseUrl()}`);
    console.log(`  - External API: ${this.externalApiServer.getBaseUrl()}`);

    return {
      configBackendUrl: this.configBackend.getBaseUrl(),
      externalApiUrl: this.externalApiServer.getBaseUrl(),
      configPort,
      externalApiPort
    };
  }

  async teardown() {
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
  addTransformationMock(versionId, mockData) {
    this.configBackend.addTransformationMock(versionId, mockData);
  }

  addLibraryMock(versionId, mockData) {
    this.configBackend.addLibraryMock(versionId, mockData);
  }

  addRudderLibraryMock(name, mockData) {
    this.configBackend.addRudderLibraryMock(name, mockData);
  }

  addExternalApiMock(url, mockConfig) {
    this.externalApiServer.addApiMock(url, mockConfig);
  }
}

// Helper function to create test events
function createTestEvent(overrides = {}) {
  return {
    message: {
      messageId: 'test-message-id-' + Date.now(),
      type: 'track',
      event: 'Test Event',
      userId: 'test-user-id',
      properties: {
        testProperty: 'testValue',
        ...overrides.properties
      },
      timestamp: new Date().toISOString(),
      ...overrides.message
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
      ...overrides.metadata
    },
    destination: {
      ID: 'test-destination-id',
      Name: 'Test Destination',
      Config: {},
      ...overrides.destination
    }
  };
}

// Helper function to create transformation request
function createTransformationRequest(events, versionId, libraryVersionIds = []) {
  if (!Array.isArray(events)) {
    events = [events];
  }

  return events.map(event => ({
    message: event.message,
    metadata: event.metadata,
    destination: {
      ...event.destination,
      Transformations: [{
        VersionID: versionId
      }]
    },
    libraries: libraryVersionIds.map(id => ({ VersionID: id }))
  }));
}

// Helper function to validate transformation response
function validateTransformationResponse(response, expectedCount) {
  expect(Array.isArray(response)).toBe(true);
  
  if (expectedCount !== undefined) {
    expect(response).toHaveLength(expectedCount);
  }

  response.forEach(item => {
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
function getSuccessfulTransformations(response) {
  return response.filter(item => item.statusCode === 200);
}

// Helper function to extract failed transformations
function getFailedTransformations(response) {
  return response.filter(item => item.statusCode !== 200);
}

module.exports = {
  TestEnvironment,
  createTestEvent,
  createTransformationRequest,
  validateTransformationResponse,
  getSuccessfulTransformations,
  getFailedTransformations
};
