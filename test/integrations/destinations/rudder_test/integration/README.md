# Rudder Test Integration Example

This directory contains a complete working example of the integration test framework applied to the `rudder_test` destination. This serves as both a functional test suite and a reference implementation for creating integration tests for other destinations.

> **📖 For framework documentation**, see the [Integration Test Framework Guide](../../Integration_Test_Framework_Guide.md)

## What This Example Demonstrates

This implementation showcases all the framework capabilities:

- **Real Service Testing**: Starts actual transformer service instances
- **Environment Variable Management**: Dynamic service configuration and restarts
- **Load Testing**: Configurable concurrency, batch sizes, and stress testing
- **CDK v2 Integration**: Complete CDK v2 vs native performance comparison
- **Comprehensive Scenarios**: 40+ test scenarios covering all use cases

### 🎯 **Real-World Scenarios Based on rudder_test Components**

The test scenarios are derived from the actual rudder_test component tests, including:

- **Dynamic Config Processing**: Tests with Handlebars templates that resolve values from event context
- **Payload Compaction**: Tests with compacted router payloads (`x-content-format: json+compactedv1`)
- **Environment Variable Overrides**: Tests different service configurations via environment variables
- **Error Simulation**: Uses `testBehavior` to simulate various error conditions
- **Multi-Event Batching**: Tests with variable batch sizes and different event combinations

### 🔄 **Environment Variable Management with Service Restarts**

The framework automatically handles environment variable changes that require service restarts:

```typescript
// Service automatically restarts when environment changes
await serviceManager.updateEnvironment({
  RUDDER_TEST_API_ENDPOINT: 'https://staging.rudderstack.com/v1/record',
  RUDDER_TEST_DEBUG: 'true',
});
```

### 📊 **Comprehensive Load Testing**

- Variable batch sizes (1-50 events per request)
- Configurable concurrency levels
- Request rate limiting with cooldown periods
- Real-time metrics collection (response times, throughput, error rates)

### 🎲 **Variable Payload Generation**

Events are generated with different complexity levels:

- **Simple**: Basic record events with minimal fields
- **Medium**: Events with context, device info, and moderate nesting
- **Complex**: Large payloads with deep nesting, custom fields, and stress-testing data

## Available Test Scenarios

### Basic Scenarios

- `basic-processor`: Simple processor transformation
- `basic-router`: Basic router transformation

### Environment Override Scenarios

- `env-override-endpoint`: API endpoint override via environment variables
- `env-override-debug`: Debug mode enabled via environment variables
- `env-override-dynamic-config`: Dynamic config flag override

### Dynamic Config Scenarios

- `dynamic-config-simple`: Basic dynamic config processing
- `dynamic-config-multi-event`: Multiple events with different dynamic configs

### Payload Compaction Scenarios

- `compaction-simple`: Basic payload compaction
- `compaction-with-dynamic-config`: Combined compaction and dynamic config
- `compaction-multi-event`: Large multi-event compacted payloads

### Error Scenarios

- `error-400`: Simulated validation errors
- `error-500`: Simulated server errors

### Stress Test Scenarios

- `stress-large-payload`: Large complex payloads (20+ events)
- `stress-compaction-large`: Large compacted payloads (50+ events)
- `stress-dynamic-config-large`: Large dynamic config payloads (30+ events)

### Special Scenarios

- `mutation-test`: Tests frozen config mutation in compacted payloads
- `mixed-destinations`: Multiple destination configurations

### CDK v2 Scenarios

- `cdk-v2-basic-processor`: Basic CDK v2 processor transformation
- `cdk-v2-basic-router`: Basic CDK v2 router transformation
- `cdk-v2-dynamic-config`: CDK v2 with dynamic config processing
- `cdk-v2-batch-processing`: CDK v2 router with multiple events
- `cdk-v2-dynamic-config-multi-event`: CDK v2 multi-event with dynamic config
- `cdk-v2-compaction`: CDK v2 with payload compaction
- `cdk-v2-compaction-dynamic-config`: CDK v2 with compaction and dynamic config
- `cdk-v2-mutation-error`: CDK v2 frozen config mutation test
- `cdk-v2-error-handling`: CDK v2 error response simulation
- `cdk-v2-stress-large-payload`: CDK v2 stress test with large payloads
- `cdk-v2-stress-compaction-large`: CDK v2 stress test with compaction
- `cdk-v2-stress-dynamic-config-large`: CDK v2 stress test with dynamic config

## Usage

### Quick Start

```bash
# Run quick validation
npm run test:integration:validate

# List all available scenarios
npm run test:integration:list

# Run quick test (30 seconds per scenario)
npm run test:integration:quick

# Run comprehensive test (2 minutes per scenario)
npm run test:integration:comprehensive

# Run stress test (5 minutes per scenario)
npm run test:integration:stress

# Run CDK v2 specific tests
npm run test:integration -- --config cdkV2

# Run CDK v2 vs Native comparison tests
npm run test:integration -- --config comparison
```

### Custom Test Execution

```bash
# Run specific scenarios
npx ts-node test/integrations/destinations/rudder_test/run.ts run --scenarios "basic-processor,dynamic-config-simple,error-400"

# Custom duration and concurrency
npx ts-node test/integrations/destinations/rudder_test/run.ts run \
  --duration 60000 \
  --requests 15 \
  --interval 50 \
  --cooldown 5000

# Save results to file
npx ts-node test/integrations/destinations/rudder_test/run.ts run \
  --config comprehensive \
  --output results/integration-test-$(date +%Y%m%d-%H%M%S).json
```

### CLI Options

```
Options:
  -c, --config <type>        Test configuration (quick, comprehensive, stress)
  -s, --scenarios <list>     Comma-separated list of specific scenarios
  -d, --duration <ms>        Test duration per scenario in milliseconds
  -r, --requests <count>     Maximum concurrent requests
  -i, --interval <ms>        Interval between requests in milliseconds
  -p, --port <port>          Service port (default: 9090)
  -o, --output <file>        Output file for results (JSON format)
  --cooldown <ms>           Cooldown period between scenarios
  --list-scenarios          List all available scenarios
```

## CDK v2 Integration Testing

The CDK v2 integration tests are specifically designed to validate the CDK v2 workflow implementation for the rudder_test destination. These tests ensure that the CDK v2 workflows (`procWorkflow.yaml` and `rtWorkflow.yaml`) function correctly under various conditions.

### CDK v2 Test Features

- **Workflow Validation**: Tests both processor and router CDK v2 workflows
- **Performance Comparison**: Compares CDK v2 vs native implementation performance
- **Comprehensive Scenarios**: All CDK v2 scenarios including dynamic config, compaction, and error handling
- **Detailed Analytics**: CDK v2-specific performance metrics and insights

### Running CDK v2 Tests

```bash
# Run all CDK v2 scenarios
npm run test:integration -- --config cdkV2

# Run CDK v2 vs Native comparison (both types of scenarios)
npm run test:integration -- --config comparison

# Run specific CDK v2 scenarios
npx ts-node test/integrations/destinations/rudder_test/run.ts run --scenarios "cdk-v2-basic-processor,cdk-v2-dynamic-config"

# Run CDK v2 stress tests
npx ts-node test/integrations/destinations/rudder_test/run.ts run --scenarios "cdk-v2-stress-large-payload,cdk-v2-stress-compaction-large"

# Custom CDK v2 test configuration
npx ts-node test/integrations/destinations/rudder_test/run.ts run \
  --scenarios "cdk-v2-basic-processor,cdk-v2-basic-router,cdk-v2-compaction" \
  --duration 45000 \
  --requests 8 \
  --interval 75
```

### CDK v2 Test Output

The CDK v2 integration tests provide detailed performance analysis:

```
🚀 Starting CDK v2 Integration Test Suite
This test suite focuses on CDK v2 workflow validation
Testing scenarios: processor, router, dynamic config, compaction, and error handling

🚀 CDK v2 Performance Analysis:
==================================================
📊 CDK v2 Processor Performance:
   Average Response Time: 42.35ms
   Success Rate: 100.0%

📊 CDK v2 Router Performance:
   Average Response Time: 58.12ms
   Success Rate: 100.0%

📊 CDK v2 Dynamic Config Performance:
   Average Response Time: 67.89ms
   Success Rate: 100.0%

📊 CDK v2 Compaction Performance:
   Average Response Time: 71.23ms
   Success Rate: 100.0%

📊 CDK v2 Stress Test Performance:
   Average Response Time: 95.67ms
   Success Rate: 98.5%
   Max Throughput: 12.34 req/s

🎯 Overall CDK v2 Performance:
   Total Requests: 1,247
   Successful Requests: 1,234
   Overall Success Rate: 99.0%
   Overall Avg Response Time: 63.45ms

💡 CDK v2 Performance Insights:
   ✅ Excellent success rate (99.0%)
   ✅ Excellent response time (63.45ms)
```

## Test Execution Flow

1. **Service Startup**: The transformer service is started with initial configuration
2. **Scenario Execution**: For each scenario:
   - Environment variables are updated (service restarts if needed)
   - Test data is generated based on scenario specifications
   - Load test runs for the specified duration
   - Metrics are collected and results are calculated
   - Cooldown period before next scenario
3. **Results Summary**: Final summary with performance metrics and scenario comparisons
4. **Service Cleanup**: Transformer service is gracefully stopped

## Example Output

```
🚀 Starting Rudder Transformer Integration Test Suite
📊 Running 3 scenarios
⏱️  Test duration: 30s
🔧 Service port: 9090
📈 Max concurrent requests: 5

🎯 Running scenario: basic-processor
📝 Basic processor transformation with simple events

📊 Results for basic-processor:
   Total Requests: 289
   Successful: 289 (100.0%)
   Failed: 0 (0.0%)
   Avg Response Time: 45.23ms
   Min Response Time: 12.45ms
   Max Response Time: 156.78ms
   Throughput: 9.63 req/s

🎯 Running scenario: dynamic-config-simple
📝 Test dynamic config processing without compaction
🔧 Updating environment variables: {}

📊 Results for dynamic-config-simple:
   Total Requests: 284
   Successful: 284 (100.0%)
   Failed: 0 (0.0%)
   Avg Response Time: 52.31ms
   Min Response Time: 15.67ms
   Max Response Time: 189.45ms
   Throughput: 9.47 req/s

🎉 Integration Test Complete!

📈 Summary:
   Total Scenarios: 3
   Total Requests: 847
   Overall Success Rate: 100.0%
   Average Throughput: 9.53 req/s
   Average Response Time: 48.67ms

🏆 Best Performing: basic-processor (9.63 req/s)
🐌 Most Errors: dynamic-config-simple (0.0% failure rate)
```

## Results Output

When using the `--output` option, results are saved in JSON format:

```json
{
  "config": {
    "scenarios": ["basic-processor", "dynamic-config-simple"],
    "duration": 30000,
    "maxConcurrentRequests": 5,
    "requestInterval": 100
  },
  "results": [
    {
      "scenario": "basic-processor",
      "totalRequests": 289,
      "successfulRequests": 289,
      "failedRequests": 0,
      "averageResponseTime": 45.23,
      "minResponseTime": 12.45,
      "maxResponseTime": 156.78,
      "throughput": 9.63,
      "errors": []
    }
  ],
  "summary": {
    "totalScenarios": 2,
    "totalRequests": 847,
    "totalSuccessful": 847,
    "totalFailed": 0,
    "averageThroughput": 9.53,
    "averageResponseTime": 48.67
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Design Principles

### 🎯 **Real-World Simulation**

- Uses actual rudder_test component test scenarios
- Variable payload sizes and complexity
- Realistic request patterns with cooldown periods
- Environment variable testing with service restarts

### 🔄 **Service Lifecycle Management**

- Automatic service startup and shutdown
- Environment variable change detection
- Graceful restart handling
- Health check validation

### 📊 **Comprehensive Metrics**

- Request/response metrics
- Error tracking and categorization
- Performance benchmarking
- Scenario comparison

### 🛠 **Flexibility**

- Configurable test parameters
- Scenario selection
- Custom duration and concurrency
- Multiple output formats

## When to Use

### ✅ **Use Integration Tests For:**

- End-to-end service validation
- Performance benchmarking
- Environment variable testing
- Real-world load simulation
- Service stability testing
- Memory and resource usage validation

### ❌ **Don't Use Integration Tests For:**

- Unit testing individual functions
- Quick development feedback loops
- Detailed error condition testing (use component tests)
- CI/CD pipelines (too slow and resource-intensive)

## Performance Considerations

- **Service Startup**: Each test run includes service startup time (~10-30 seconds)
- **Environment Restarts**: Scenarios with environment changes trigger service restarts
- **Resource Usage**: Tests run a real service instance with full middleware stack
- **Duration**: Comprehensive tests can take 30+ minutes to complete all scenarios
- **Concurrency**: High concurrency may overwhelm the test service or system resources

## Extending the Framework

### Adding New Scenarios

1. Add scenario definition to `RUDDER_TEST_SCENARIOS` in `rudderTestDataGenerator.ts`:

```typescript
{
  name: 'my-custom-scenario',
  description: 'My custom test scenario',
  envOverrides: { MY_ENV_VAR: 'value' },
  useCompaction: true,
  useDynamicConfig: false,
  batchSize: 10,
  complexity: 'medium',
}
```

2. The scenario will automatically be available in the test runner

### Custom Test Configurations

Add new configurations to `DEFAULT_LOAD_TEST_CONFIGS` in `integrationTest.ts`:

```typescript
myCustomConfig: {
  scenarios: ['my-custom-scenario'],
  duration: 45000,
  maxConcurrentRequests: 8,
  requestInterval: 75,
  cooldownPeriod: 3000,
  servicePort: 9090,
  enableMetrics: true,
}
```

## Troubleshooting

### Service Startup Issues

- Check if port 9090 is available
- Verify Node.js and npm dependencies
- Check system resources (memory, CPU)

### Environment Variable Issues

- Ensure service restarts are completing successfully
- Check environment variable names match transformer expectations
- Verify timeout settings allow for restart completion

### Performance Issues

- Reduce concurrency levels
- Increase request intervals
- Check system resource usage
- Monitor service logs for bottlenecks

### Test Failures

- Check service health endpoint
- Verify test data generation
- Review error logs and response details
- Validate scenario configurations

This integration testing framework provides a robust way to validate the Rudder Transformer service under realistic conditions, ensuring it performs well with the complex scenarios it will encounter in production.
