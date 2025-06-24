# Integration Test Framework

This directory contains comprehensive utilities for integration testing in the Rudder Transformer project. The framework provides tools for performance analysis, service management, load testing, and comprehensive test validation.

## Overview

The integration test framework consists of several key components:

1. **Integration Test Utilities** (`integrationTestUtils.ts`) - Core utilities for performance analysis and response validation
2. **Service Manager** (`transformerServiceManager.ts`) - Lifecycle management for transformer services
3. **Base Integration Test** (`baseIntegrationTest.ts`) - Abstract base class for integration tests
4. **Test Utilities** (`testUtils.ts`) - Comprehensive test data generation and validation utilities
5. **Environment Utilities** (`envUtils.ts`) - Environment variable management for tests

## Quick Start

### Running Integration Tests

```bash
# Run basic integration tests
npm run test:integration

# Run quick performance tests
npm run test:integration:quick

# Run comprehensive tests
npm run test:integration:comprehensive

# Run stress tests
npm run test:integration:stress

# Run proxy-specific tests
npm run test:integration:proxy

# Validate test configurations
npm run test:integration:validate

# List available test scenarios
npm run test:integration:list
```

## Core Components

### 1. Integration Test Utilities (`integrationTestUtils.ts`)

Provides utilities for:
- **Performance Analysis**: Compare CDK v2 vs native transformation performance
- **Response Validation**: Validate processor/router/proxy-v0 responses
- **Load Testing**: Manage load test results and file operations
- **Generic Endpoint Handling**: Support for all destination types

Key functions:
```typescript
// Performance analysis
const results = await analyzePerformance(testData, destination);

// Response validation
const isValid = validateProcessorResponse(response, testCase);

// Load testing
const loadResults = await runLoadTest(scenarios, config);

// Generic endpoint handling
const response = await handleGenericEndpoint(endpoint, payload, config);
```

### 2. Service Manager (`transformerServiceManager.ts`)

Manages transformer service lifecycle:
- **Service Startup/Shutdown**: Automatic health checks and port management
- **Environment Management**: Test-specific environment variable handling
- **Port Management**: Automatic port allocation and fallback
- **Graceful Restart**: Service restart capabilities

Example usage:
```typescript
import { TransformerServiceManager } from './transformerServiceManager';

const serviceManager = new TransformerServiceManager();

// Start service
await serviceManager.startService({
  port: 9090,
  env: { LOG_LEVEL: 'debug' }
});

// Stop service
await serviceManager.stopService();
```

### 3. Base Integration Test (`baseIntegrationTest.ts`)

Abstract base class providing:
- **Scenario Management**: CLI interface for test scenarios
- **Results Aggregation**: Comprehensive test result reporting
- **Load Testing Framework**: Configurable load testing scenarios
- **Performance Metrics**: Detailed performance analysis

Example implementation:
```typescript
import { BaseIntegrationTest } from './baseIntegrationTest';

class MyIntegrationTest extends BaseIntegrationTest {
  async runScenario(scenarioName: string): Promise<void> {
    // Implement your test scenario
  }
}
```

### 4. Test Utilities (`testUtils.ts`)

Comprehensive utilities for:
- **Test Data Generation**: Generate various payload types (identify, track, page, etc.)
- **Mock Management**: Axios mock registration and management
- **Payload Validation**: ZOD schema validation
- **Test Data Production**: Generate test data files

Key functions:
```typescript
// Generate test payloads
const identifyPayload = generateIdentifyPayload({ userId: 'test-user' });
const trackPayload = generateTrackPayload({ event: 'Test Event' });

// Validate responses
validateTestWithZOD(testPayload, response);

// Generate proxy payloads
const proxyV0Payload = generateProxyV0Payload(parameters, metadata);
```

### 5. Environment Utilities (`envUtils.ts`)

Provides environment variable management:
- **Snapshot Management**: Save and restore environment states
- **Override Application**: Apply test-specific environment variables
- **Automatic Cleanup**: Ensure environment restoration after tests

Example usage:
```typescript
import { EnvManager } from './envUtils';

const envManager = new EnvManager();

// Apply test environment
envManager.applyOverrides({ API_ENDPOINT: 'http://test-api' });

// Restore original environment
envManager.restoreSnapshot();
```

## Complete Working Example

The `test/integrations/destinations/rudder_test/integration/` directory contains a **complete working example** that demonstrates all framework capabilities:

- **40+ Test Scenarios**: Real-world scenarios based on component tests
- **CDK v2 Integration**: Performance comparison between CDK v2 and native
- **CLI Interface**: Full command-line interface with multiple configurations
- **Load Testing**: Stress testing with configurable parameters
- **Environment Management**: Dynamic service configuration

### Quick Start

```bash
# Run all scenarios
npm run test:integration

# Run quick test (30 seconds per scenario)
npm run test:integration:quick

# List all 40+ available scenarios
npm run test:integration:list

# Validate test setup
npm run test:integration:validate
```

> **📖 For detailed usage and all available scenarios**, see the [Rudder Test Integration Example README](./destinations/rudder_test/integration/README.md)

## Creating Your Own Integration Tests

### Step 1: Create Test Structure

```bash
mkdir -p test/integrations/destinations/your_destination/integration
```

### Step 2: Implement Test Class

```typescript
// integrationTest.ts
import { BaseIntegrationTest } from '../../../baseIntegrationTest';

export class YourDestinationIntegrationTest extends BaseIntegrationTest {
  async runScenario(scenarioName: string): Promise<void> {
    switch (scenarioName) {
      case 'quick':
        await this.runQuickTest();
        break;
      case 'comprehensive':
        await this.runComprehensiveTest();
        break;
      default:
        throw new Error(`Unknown scenario: ${scenarioName}`);
    }
  }

  private async runQuickTest(): Promise<void> {
    // Implement quick test logic
  }

  private async runComprehensiveTest(): Promise<void> {
    // Implement comprehensive test logic
  }
}
```

### Step 3: Create CLI Entry Point

```typescript
// run.ts
import { Command } from 'commander';
import { YourDestinationIntegrationTest } from './integrationTest';

const program = new Command();
const integrationTest = new YourDestinationIntegrationTest();

program
  .command('run')
  .option('--config <config>', 'Test configuration', 'quick')
  .action(async (options) => {
    await integrationTest.runScenario(options.config);
  });

program
  .command('list-scenarios')
  .action(() => {
    integrationTest.listScenarios();
  });

program.parse();
```

### Step 4: Add NPM Scripts

```json
{
  "scripts": {
    "test:integration:your_destination": "ts-node test/integrations/destinations/your_destination/integration/run.ts run",
    "test:integration:your_destination:quick": "ts-node test/integrations/destinations/your_destination/integration/run.ts run --config quick"
  }
}
```

## Best Practices

### 1. Environment Management
- Always use `EnvManager` for environment variable overrides
- Ensure proper cleanup with try/finally blocks
- Use snapshots for complex environment setups

### 2. Service Management
- Use `TransformerServiceManager` for service lifecycle
- Implement proper health checks
- Handle port conflicts gracefully

### 3. Performance Testing
- Use `analyzePerformance` for CDK v2 vs native comparison
- Implement load testing for high-traffic scenarios
- Monitor memory usage and response times

### 4. Test Data Management
- Use `testUtils.ts` functions for consistent payload generation
- Implement proper mock management
- Validate responses with ZOD schemas

### 5. Logging and Debugging
- Use structured logging for test execution
- Implement debug modes for detailed analysis
- Save test results for later analysis

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Use `TransformerServiceManager` with automatic port allocation
2. **Environment Pollution**: Always use `EnvManager` for environment variable management
3. **Service Startup Failures**: Implement proper health checks and timeouts
4. **Memory Leaks**: Ensure proper cleanup in finally blocks

### Debug Mode

Enable debug mode for detailed logging:
```bash
DEBUG=true npm run test:integration
```

### Performance Analysis

For performance issues, use the built-in analysis tools:
```typescript
const results = await analyzePerformance(testData, destination);
console.log('Performance Analysis:', results);
```

## Contributing

When adding new integration test utilities:

1. Follow the existing patterns in `baseIntegrationTest.ts`
2. Add comprehensive documentation
3. Include working examples
4. Ensure proper cleanup and error handling
5. Add appropriate npm scripts

## Additional Resources

- [Rudder Test Integration Example](./destinations/rudder_test/integration/README.md)
- [Component Test Framework](./component.test.ts)
- [Test Types Documentation](./testTypes.ts) 