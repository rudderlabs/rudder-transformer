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

### Test Migration Utilities

The repository includes utilities for managing and migrating tests to a new, optimized format. For detailed information about test migration strategies, utilities, and case studies, see the [Test Scripts README](test/scripts/README.md).

The test scripts directory contains:

- Test migration utilities for converting legacy tests to the new optimized format
- Documentation on test migration strategies and patterns
- Case studies of successful test migrations
- Guidelines for handling mock functions and test validation

## Contact Us

If you come across any issues while setting up or running the RudderStack Transformer, feel free to start a conversation on our [Slack](https://resources.rudderstack.com/join-rudderstack-slack) channel.
