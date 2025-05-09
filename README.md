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

### Test Migration Utilities

The repository includes utilities for managing and migrating tests to a new, optimized format. For detailed information about test migration strategies, utilities, and case studies, see the [Test Scripts README](test/scripts/README.md).

The test scripts directory contains:
- Test migration utilities for converting legacy tests to the new optimized format
- Documentation on test migration strategies and patterns
- Case studies of successful test migrations
- Guidelines for handling mock functions and test validation

## Contact Us

If you come across any issues while setting up or running the RudderStack Transformer, feel free to start a conversation on our [Slack](https://resources.rudderstack.com/join-rudderstack-slack) channel.
