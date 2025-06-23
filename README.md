<p align="center">
⚠️ Docker image for rudder-transformer has been moved to new org <a href="https://hub.docker.com/r/rudderstack/rudder-transformer/tags">rudderstack/rudder-transformer</a>
  <br/><br/>
 </p>

[![codecov](https://codecov.io/gh/rudderlabs/rudder-transformer/branch/develop/graph/badge.svg?token=G24OON85SB)](https://codecov.io/gh/rudderlabs/rudder-transformer)

# RudderStack Transformer

RudderStack Transformer is a service which transforms the RudderStack events to destination-specific singular events. This feature is released under
under the [Elastic License 2.0](https://www.elastic.co/licensing/elastic-license).

## Transformer Setup

### Docker

If you want to run the RudderStack Transformer inside a Docker container, follow these steps:

1. Clone this repository
2. Run `docker-compose up transformer`

### Native Installation

On Mac, if you don't have `make` and `g++`, you would have to install `Xcode Command Line Tools` using `xcode-select --install`.

On Linux, install the required dependencies `python`, `make` and `g++` and follow these steps:

1. Clone this repository
2. Setup the repository with `npm run setup`
3. Build the service with `npm run build:clean`
4. Start the server with `npm start`

## Transformer without User Functions

If you don't need user functions, you can skip those and run a destination-only transformer.

### Docker

If you want to run the RudderStack Transformer (without the user functions) inside a Docker container, follow these steps:

1. Clone this repository
2. Run `docker-compose up transformer-no-func`

### Native Installation

On Mac, if you don't have `make` and `g++`, you would have to install `Xcode Command Line Tools` using `xcode-select --install`.

On Linux, install the required dependencies `python`, `make` and `g++` and follow these steps:

1. Clone this repository
2. Setup the repository with `npm run setup`
3. Build the service with `npm run build:clean`
4. Start the server with `npm start`

### How to run the E2E tests locally

Run `make setup`( `make setup-arm` in case of arm processor(M1 chip)). This operation is needed only once.

Now you can run `make test`.

If you wish you can destroy the cluster manually with `make destroy`.

### Configuring Secrets for Tests

When writing tests for destinations that require authentication, you'll need to configure secrets. The transformer uses a pattern of masked secrets for tests that can be overridden with real secrets when needed.

#### Understanding the maskedSecrets.ts Pattern

Each destination that requires authentication has a `maskedSecrets.ts` file in its test directory (e.g., `test/integrations/destinations/accoil_analytics/maskedSecrets.ts`). This file contains dynamically derived placeholder values that are used by default in tests.

**Important**: `maskedSecrets.ts` files should NEVER contain hardcoded actual secrets. They should only contain derived values that are not real credentials.

Example of a typical `maskedSecrets.ts` file:

```typescript
import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

// Valid secrets for successful API calls - derived from directory name
// This creates unique but predictable values for testing
export const secret1 = path.basename(__dirname) + 1;
export const secretStaging1 = `stg_` + path.basename(__dirname) + 1;

// Invalid secrets for testing error scenarios
export const secretInvalid = path.basename(__dirname) + 'invalid';

// Auth headers constructed from secrets
export const authHeader1 = `Basic ${base64Convertor(secret1 + ':')}`;
export const authHeaderStaging1 = `Basic ${base64Convertor(secretStaging1 + ':')}`;
export const authHeaderInvalid = `Basic ${base64Convertor(secretInvalid + ':')}`;
```

To use real secrets for testing, you have two options:

1. **Use environment variables**:

   - Set environment variables to override secrets in your tests
   - The naming convention is typically `DESTINATION_NAME_SECRET_KEY`

   Example:

   ```bash
   export YOUR_DESTINATION_API_KEY='your-real-api-key'
   ```

   Then in your test code, you can check for the environment variable:

   ```typescript
   // In your test setup
   const apiKey = process.env.YOUR_DESTINATION_API_KEY || secret1;
   ```

2. **Create a local override file**:

   - Create a file with the actual API keys or tokens needed for testing
   - Ensure this file is added to `.gitignore` to prevent committing real secrets

#### Best Practices

- Never commit real secrets to the repository
- Never hardcode actual credentials in `maskedSecrets.ts` files - only use derived values
- Use environment variables for local development and CI/CD environments
- When adding a new destination, follow the existing pattern of creating a `maskedSecrets.ts` file
- Consider using a `.env` file (which is git-ignored) for local development
- Include both valid and invalid derived secrets in your `maskedSecrets.ts` file to test different scenarios
- Use descriptive names for different types of secrets (e.g., `secretInvalid`, `secretExpired`, `secretStaging`)
- When testing error scenarios, make sure to include tests with invalid credentials

### Rudder Test Destination

The `rudder_test` destination is a special testing destination built specifically for platform development, testing, and validation. Unlike regular destinations that send data to external services, this destination provides a controlled, predictable environment for testing RudderStack's transformation pipeline without external dependencies.

#### What is the Rudder Test Destination?

The rudder_test destination is a minimal, self-contained destination implementation that:

- **Processes Record v2 Events**: Handles data warehouse-style events (insert, update, delete operations)
- **Dynamic Config Resolution**: Supports dynamic config templates for endpoint and API key resolution
- **Echo Response Pattern**: Returns the processed event data back in the response, allowing you to verify transformations
- **No External Dependencies**: Runs entirely within the transformer without requiring external APIs or services
- **Controlled Test Behaviors**: Supports programmatic control of responses via event context
- **Multi-Event Testing**: Comprehensive test coverage for dynamic config with multiple events
- **TypeScript Implementation**: Fully typed with proper error handling and validation

#### Why Use the Rudder Test Destination?

1. **Platform Testing**: Test new platform features without setting up external services
2. **Development Workflow**: Quickly validate transformation logic during development
3. **CI/CD Reliability**: Run tests that don't depend on external service availability
4. **Learning & Debugging**: Understand how RudderStack processes events by seeing the exact output
5. **Integration Testing**: Verify end-to-end event processing pipelines
6. **Dynamic Config Testing**: Test dynamic config resolution with multiple events and different template values

#### Quick Start

To run tests for the rudder_test destination:

```bash
npm run test:ts:component:rudder_test
```

#### Features

The rudder_test destination provides:

- **Record v2 Event Support**: Only processes record v2 events (insert, update, delete operations)
- **Dynamic Config Resolution**: Resolves endpoint and API key from destination config templates
- **Echo Pattern**: Returns event data back in the response for verification
- **Context-Based Testing**: Supports controlled test behaviors via `context.testBehavior`
- **Error Simulation**: Can simulate different HTTP status codes and error messages
- **Multi-Event Processing**: Handles multiple events with different dynamic config values
- **Header Injection**: Adds resolved API keys to request headers (X-API-Key)
- **TypeScript Implementation**: Fully typed with proper error handling

#### Test Behavior Control

You can control the destination's behavior using the `testBehavior` field in the event context:

```javascript
{
  "context": {
    "testBehavior": {
      "statusCode": 400,
      "errorMessage": "Custom test error"
    }
  }
}
```

- **Success Response**: Omit `testBehavior` or set `statusCode: 200` to get a successful response
- **Error Response**: Set `statusCode` to any non-200 value to simulate errors
- **Custom Messages**: Use `errorMessage` to specify custom error text

#### Dynamic Config Examples

The rudder_test destination supports dynamic config templates that resolve values from event context:

```javascript
// Destination config with dynamic templates
{
  "endpoint": "{{ event.context.endpoint || 'https://default.endpoint.com' }}",
  "apiKey": "{{ event.traits.appId || 'default-api-key' }}"
}

// Event with template values
{
  "type": "record",
  "context": {
    "endpoint": "https://custom.endpoint.com"
  },
  "traits": {
    "appId": "my-app-123"
  }
}

// Results in resolved config:
// endpoint: "https://custom.endpoint.com"
// apiKey: "my-app-123"
// Headers: { "X-API-Key": "my-app-123" }
```

#### Use Cases

The rudder_test destination is ideal for:

- **Platform Feature Testing**: Testing new platform features without external dependencies
- **Dynamic Config Testing**: Validating dynamic config resolution with multiple events
- **Integration Testing**: Verifying event processing pipelines
- **Development**: Quick testing during destination development
- **Thread Safety Testing**: Testing concurrent processing with different config values
- **CI/CD**: Reliable tests that don't depend on external services

#### Implementation Details

The rudder_test destination follows RudderStack's standard destination architecture:

- **Location**: `src/v0/destinations/rudder_test/`
- **Dual Implementation**: Supports both processor and router transformations
- **Record v2 Schema**: Validates incoming events against the Record v2 schema
- **Dynamic Config Support**: Uses destination config for endpoint and API key resolution
- **Response Format**: Returns standard transformation response objects
- **Error Handling**: Uses RudderStack's standard error handling patterns
- **Comprehensive Testing**: 20 test cases covering all scenarios including multi-event dynamic config

**Key Files:**

- `transform.ts`: Main transformation logic with dynamic config support
- `utils.ts`: Utility functions for request building and config resolution
- `type.ts`: TypeScript type definitions including RudderTestConfig interface
- `config.ts`: Basic configuration constants
- `test/integrations/destinations/rudder_test/`: Comprehensive test cases with multi-event scenarios

The destination demonstrates proper RudderStack destination patterns including dynamic config resolution, making it an excellent reference for destination development and a powerful tool for testing platform features.

### Component Testing with Environment Variable Overrides

Component tests support per-test environment variable overrides, allowing you to test different configurations and combinations without affecting other tests.

#### Basic Usage

Add the `envOverrides` property to any test case to override environment variables for that specific test:

```typescript
{
  name: 'my_destination',
  description: 'Test with production API endpoint',
  feature: 'processor',
  module: 'destination',
  envOverrides: {
    API_BASE_URL: 'https://api.production.com/v1',
    API_ENVIRONMENT: 'production',
    RATE_LIMIT: '1000'
  },
  input: {
    // ... test input
  },
  output: {
    // ... expected output
  }
}
```

#### Features

- **Test Isolation**: Environment variables are automatically restored after each test
- **Variable Deletion**: Use `undefined` to delete environment variables
- **Multiple Combinations**: Test different environment combinations easily
- **Backward Compatible**: Existing tests continue to work unchanged

#### Examples

**Testing Different API Endpoints:**

```typescript
// Production environment test
{
  envOverrides: {
    API_BASE_URL: 'https://api.production.com',
    ENVIRONMENT: 'production'
  }
}

// Staging environment test
{
  envOverrides: {
    API_BASE_URL: 'https://staging.api.com',
    ENVIRONMENT: 'staging'
  }
}
```

**Testing Feature Flags:**

```typescript
// Feature enabled
{
  envOverrides: {
    FEATURE_NEW_API: 'true',
    DEBUG: 'false'
  }
}

// Feature disabled (delete environment variable)
{
  envOverrides: {
    FEATURE_NEW_API: undefined, // This deletes the env var
    FEATURE_LEGACY_SUPPORT: 'true'
  }
}
```

**Testing Common System Variables:**

```typescript
// Override system-wide configuration flags
{
  envOverrides: {
    USE_HAS_DYNAMIC_CONFIG_FLAG: 'false', // Disable dynamic config processing
    LOG_LEVEL: 'debug',                   // Change log level for this test
    NODE_ENV: 'test',                     // Set environment
    BATCH_SIZE: '100',                    // Override batch processing settings
  }
}
```

**Important**: Environment variables must be read **dynamically** (at runtime) for overrides to work. Static constants evaluated at module load time won't be affected by test overrides.

#### Best Practices for Environment Variables in New Code

When adding new environment variables to the codebase, follow these patterns to ensure compatibility with the environment variable override system:

**✅ DO: Use Dynamic Functions**

```typescript
// config.ts - Use functions that read at runtime
export const getApiEndpoint = (): string => process.env.API_ENDPOINT || 'https://default.api.com';

export const isDebugMode = (): boolean => process.env.DEBUG_MODE === 'true';

export const getBatchSize = (): number => parseInt(process.env.BATCH_SIZE || '50', 10);

// utils.ts - Call functions when needed
import { getApiEndpoint, isDebugMode } from './config';

export const buildRequest = () => {
  const endpoint = getApiEndpoint(); // ✅ Read at runtime
  const debug = isDebugMode(); // ✅ Read at runtime

  return {
    url: endpoint,
    debug,
    // ...
  };
};
```

**❌ DON'T: Use Static Constants**

```typescript
// config.ts - Avoid static constants
export const API_ENDPOINT = process.env.API_ENDPOINT || 'https://default.api.com'; // ❌ Read at module load
export const DEBUG_MODE = process.env.DEBUG_MODE === 'true'; // ❌ Read at module load

// utils.ts - These won't work with overrides
import { API_ENDPOINT, DEBUG_MODE } from './config';

export const buildRequest = () => {
  return {
    url: API_ENDPOINT, // ❌ Uses cached value from module load time
    debug: DEBUG_MODE, // ❌ Uses cached value from module load time
  };
};
```

**✅ Pattern for Complex Configuration**

```typescript
// config.ts - Centralized dynamic configuration
export class Config {
  static getApiConfig() {
    return {
      endpoint: process.env.API_ENDPOINT || 'https://default.api.com',
      timeout: parseInt(process.env.API_TIMEOUT || '5000', 10),
      retries: parseInt(process.env.API_RETRIES || '3', 10),
      apiKey: process.env.API_KEY,
    };
  }

  static getFeatureFlags() {
    return {
      enableNewFeature: process.env.ENABLE_NEW_FEATURE === 'true',
      useLegacyMode: process.env.USE_LEGACY_MODE !== 'false',
      debugMode: process.env.DEBUG_MODE === 'true',
    };
  }
}

// usage.ts
import { Config } from './config';

export const processRequest = () => {
  const apiConfig = Config.getApiConfig(); // ✅ Fresh values every time
  const features = Config.getFeatureFlags(); // ✅ Fresh values every time

  // Use config...
};
```

**✅ Lazy Initialization Pattern**

```typescript
// For expensive computations that depend on env vars
let _cachedConfig: ApiConfig | null = null;

export const getApiConfig = (): ApiConfig => {
  // Re-read env vars every time (for test compatibility)
  // Cache can be added later with invalidation if needed
  return {
    endpoint: process.env.API_ENDPOINT || 'https://default.api.com',
    timeout: parseInt(process.env.API_TIMEOUT || '5000', 10),
    // ...
  };
};
```

**✅ Testing Your Environment Variables**

Always add test cases when introducing new environment variables:

```typescript
// In your component test data
{
  id: 'test-new-env-var',
  description: 'Test new environment variable override',
  envOverrides: {
    YOUR_NEW_ENV_VAR: 'test-value',
    ANOTHER_ENV_VAR: 'different-value'
  },
  // ... test case
}
```

**Key Principles:**

1. **Always read `process.env` at runtime**, never at module load time
2. **Use functions or methods** that return fresh values
3. **Avoid caching** environment variable values (or implement cache invalidation)
4. **Test your environment variables** with override test cases
5. **Document** what environment variables your code uses
6. **Provide sensible defaults** for all environment variables

Following these patterns ensures your code works seamlessly with the component test environment variable override system and provides better testability overall.

**Running Component Tests:**

```bash
# Run all component tests
npm run test:ts -- component

# Run tests for specific destination
npm run test:ts -- component --destination=my_destination

# Run specific feature tests
npm run test:ts -- component --destination=my_destination --feature=processor
```

The environment variable override system ensures complete test isolation while providing flexibility to test various configuration combinations.

### Test Migration Utilities

The repository includes utilities for managing and migrating tests to a new, optimized format. For detailed information about test migration strategies, utilities, and case studies, see the [Test Scripts README](test/scripts/README.md).

The test scripts directory contains:

- Test migration utilities for converting legacy tests to the new optimized format
- Documentation on test migration strategies and patterns
- Case studies of successful test migrations
- Guidelines for handling mock functions and test validation

## Contact Us

If you come across any issues while setting up or running the RudderStack Transformer, feel free to start a conversation on our [Slack](https://resources.rudderstack.com/join-rudderstack-slack) channel.
