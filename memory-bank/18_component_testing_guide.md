# Component Testing Guide for rudder-transformer

This document provides a comprehensive guide on how to write component tests for the rudder-transformer project. Component tests are essential for verifying that integrations work correctly with the rudder-transformer API endpoints.

> **Note**: This guide uses examples from the Algolia integration tests located at `/test/integrations/destinations/algolia/` to illustrate best practices.

## Table of Contents

1. [Introduction](#introduction)
2. [Test Structure](#test-structure)
3. [Test Data Files](#test-data-files)
4. [Network Mocking](#network-mocking)
5. [Running Tests](#running-tests)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

## Introduction

Component tests in rudder-transformer are designed to test the integration between different components of the system, particularly focusing on how destinations and sources interact with the rudder-transformer API endpoints. These tests verify that:

1. The API endpoints correctly handle requests
2. The transformation logic works as expected
3. The network requests to external services are properly formatted
4. The responses are correctly processed and returned

Component tests use a combination of:

- Test data files that define test cases
- Network mocks to simulate external API responses
- A test runner that executes the tests against a local instance of the rudder-transformer API

## Test Structure

The component tests are organized in the following directory structure:

```
test/
└── integrations/
    ├── component.test.ts         # Main test runner
    ├── testTypes.ts              # Type definitions for test data
    ├── testUtils.ts              # Utility functions for tests
    ├── destinations/             # Destination-specific tests
    │   └── {destination}/        # Tests for a specific destination
    │       ├── processor/        # Tests for processor transformation
    │       │   └── data.ts       # Test data for processor
    │       ├── router/           # Tests for router transformation
    │       │   └── data.ts       # Test data for router
    │       ├── dataDelivery/     # Tests for data delivery (proxy)
    │       │   └── data.ts       # Test data for data delivery
    │       ├── batch/            # Tests for batch processing
    │       │   └── data.ts       # Test data for batch
    │       ├── network.ts        # Network mocks for the destination
    │       └── maskedSecrets.ts  # Masked secrets for tests
    └── sources/                  # Source-specific tests
        └── {source}/             # Tests for a specific source
            ├── data.ts           # Test data for the source
            └── network.ts        # Network mocks for the source
```

## Test Data Files

Test data files (`data.ts`) define the test cases for a specific feature of a destination or source. Each test case includes:

1. Input: The request to be sent to the rudder-transformer API
2. Expected output: The expected response from the API
3. Metadata: Information about the test case (name, description, etc.)

The Algolia integration has separate test data files for different features:

- `/test/integrations/destinations/algolia/processor/data.ts` - Tests for processor transformation
- `/test/integrations/destinations/algolia/router/data.ts` - Tests for router transformation

### Test Case Structure

A test case follows this structure:

```typescript
{
  name: string;              // Name of the destination/source
  description: string;       // Description of the test case
  feature: string;           // Feature being tested (processor, router, dataDelivery, batch)
  module: string;            // Module being tested (destination, source)
  version?: string;          // API version (v0, v1, v2)
  input: {                   // Input to the API
    request: {
      method: string;        // HTTP method (GET, POST, etc.)
      body: any;             // Request body
      headers?: Record<string, string>; // Request headers
      params?: Record<string, string>;  // Request query parameters
    };
    pathSuffix?: string;     // Additional path to append to the API endpoint
  };
  output: {                  // Expected output from the API
    response?: {
      status: number;        // Expected HTTP status code
      body?: any;            // Expected response body
      headers?: Record<string, string>; // Expected response headers
    };
  };
  mock?: mockType[];         // Mock data for external API calls
  mockFns?: (mockAdapter: MockAdapter) => {}; // Custom mock functions
}
```

#### Example from Algolia Processor Test

Here's an example test case from the Algolia processor tests:

```typescript
{
  name: 'algolia',
  description: 'Test 0',
  feature: 'processor',
  module: 'destination',
  version: 'v0',
  input: {
    request: {
      body: [
        {
          message: {
            channel: 'web',
            type: 'track',
            event: 'product clicked',
            userId: 'testuserId1',
            properties: {
              index: 'products',
              filters: ['field1:hello', 'val1:val2'],
            },
          },
          destination: {
            Config: {
              apiKey: 'defaultApiKey',
              applicationId: 'O2YARRI15I',
              eventTypeSettings: [
                {
                  from: 'product clicked',
                  to: 'cLick ',
                },
              ],
            },
          },
          metadata: {
            destinationId: 'destId',
            workspaceId: 'wspId',
          },
        },
      ],
    },
  },
  output: {
    response: {
      status: 200,
      body: [
        {
          output: {
            body: {
              JSON: {
                events: [
                  {
                    eventName: 'product clicked',
                    eventType: 'click',
                    filters: ['field1:hello', 'val1:val2'],
                    index: 'products',
                    userToken: 'testuserId1',
                  },
                ],
              },
            },
            endpoint: 'https://insights.algolia.io/1/events',
            headers: {
              'X-Algolia-API-Key': 'defaultApiKey',
              'X-Algolia-Application-Id': 'O2YARRI15I',
            },
            method: 'POST',
          },
          statusCode: 200,
          metadata: {
            destinationId: 'destId',
            workspaceId: 'wspId',
          },
        },
      ],
    },
  },
}
```

### Feature Types

The `feature` field in a test case indicates which API endpoint is being tested:

1. **processor**: Tests the processor transformation endpoint (`/v0/destinations/{destination}`)
2. **router**: Tests the router transformation endpoint (`/routerTransform`)
3. **batch**: Tests the batch processing endpoint (`/batch`)
4. **dataDelivery**: Tests the data delivery endpoint (`/v0/destinations/{destination}/proxy` or `/v1/destinations/{destination}/proxy`)
5. **userDeletion**: Tests the user deletion endpoint (`/deleteUsers`)

### Module Types

The `module` field indicates whether the test is for a destination or source:

1. **destination**: Tests for destination integrations
2. **source**: Tests for source integrations

## Network Mocking

Network mocking is used to simulate responses from external APIs. This is done using the `axios-mock-adapter` library. Network mocks are defined in a `network.ts` file for each destination or source.

### Network Mock Structure

A network mock follows this structure:

```typescript
{
  httpReq: {                 // Request to match
    url: string;             // URL to match
    method: string;          // HTTP method to match
    data?: any;              // Request body to match
    params?: any;            // Request query parameters to match
    headers?: any;           // Request headers to match
  },
  httpRes: {                 // Response to return
    data: any;               // Response body
    status: number;          // Response status code
    statusText?: string;     // Response status text
    headers?: any;           // Response headers
  }
}
```

### Example from Algolia Network Mocks

Here's an example of network mocks from the Algolia integration:

```typescript
// From /test/integrations/destinations/algolia/network.ts
export const networkCallsData = [
  {
    httpReq: {
      url: 'https://insights.algolia.io/1/events',
      data: {
        events: [
          {
            eventName: 'product clicked',
            eventType: 'abc',
            filters: ['field1:hello', 'val1:val2'],
            index: 'products',
            userToken: 'testuserId1',
          },
        ],
      },
      params: {},
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        status: 422,
        message: 'EventType must be one of "click", "conversion" or "view"',
      },
      status: 422,
    },
  },
  // More mock responses...
];
```

This mock simulates a 422 error response from the Algolia API when an invalid event type is provided. The test can then verify that the transformer correctly handles this error case.

### Generating Network Mocks

You can generate network mocks by running the tests with the `--generate=true` flag:

```bash
npm run test:ts -- component --destination=zendesk --generate=true
```

This will record all network requests made during the test and save them to the `network.ts` file.

## Running Tests

You can run component tests using the following commands:

### Run All Component Tests

```bash
npm run test:ts -- component
```

### Run Tests for a Specific Destination

```bash
npm run test:ts -- component --destination=zendesk
```

### Run Tests for a Specific Feature

```bash
npm run test:ts -- component --destination=zendesk --feature=router
```

### Run a Specific Test Case by Index

```bash
npm run test:ts -- component --destination=zendesk --feature=dataDelivery --index=0
```

### Run a Specific Test Case by ID

```bash
npm run test:ts -- component --destination=zendesk --id=test-case-id
```

## Best Practices

### 1. Test Case Organization

- Group related test cases in separate files
- Use descriptive names for test cases
- Include a clear description of what the test is verifying
- Use the `id` field to uniquely identify test cases

The Algolia integration organizes tests by feature:

- Processor tests in `/test/integrations/destinations/algolia/processor/data.ts`
- Router tests in `/test/integrations/destinations/algolia/router/data.ts`

### 2. Test Data

- Use realistic data that represents actual use cases
- Include edge cases and error scenarios
- Keep test data concise and focused on what's being tested
- Use variables for common values to avoid duplication

The Algolia tests include various scenarios:

- Testing different event types (track, identify, etc.)
- Testing error handling (invalid event types, missing required fields)
- Testing configuration options (event type mappings, custom parameters)

### 3. Network Mocks

- Mock all external API calls
- Include both success and error responses
- Use realistic response data
- Group related mocks together

The Algolia network mocks in `/test/integrations/destinations/algolia/network.ts` include:

- Success responses (200 status code)
- Error responses (422 status code for validation errors)
- Different API endpoints (events, objects, etc.)

### 4. Secrets Management

- Use masked secrets for sensitive information
- Store masked secrets in a separate `maskedSecrets.ts` file
- Never commit real secrets to the repository

For example, in the Algolia tests, API keys are represented as placeholders like `'defaultApiKey'` rather than actual API keys.

## Examples

### Processor Transformation Test

Here's an example of a processor transformation test from the Algolia integration:

```typescript
// From /test/integrations/destinations/algolia/processor/data.ts
export const data = [
  {
    name: 'algolia',
    description: 'Test track event with valid event type mapping',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              type: 'track',
              event: 'product clicked',
              userId: 'testuserId1',
              properties: {
                index: 'products',
                filters: ['field1:hello', 'val1:val2'],
              },
            },
            destination: {
              Config: {
                apiKey: 'defaultApiKey',
                applicationId: 'O2YARRI15I',
                eventTypeSettings: [
                  {
                    from: 'product clicked',
                    to: 'cLick ',
                  },
                ],
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                JSON: {
                  events: [
                    {
                      eventName: 'product clicked',
                      eventType: 'click',
                      filters: ['field1:hello', 'val1:val2'],
                      index: 'products',
                      userToken: 'testuserId1',
                    },
                  ],
                },
              },
              endpoint: 'https://insights.algolia.io/1/events',
              headers: {
                'X-Algolia-API-Key': 'defaultApiKey',
                'X-Algolia-Application-Id': 'O2YARRI15I',
              },
              method: 'POST',
            },
            statusCode: 200,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
          },
        ],
      },
    },
  },
];
```

This test verifies that:

1. The processor correctly transforms a track event with the event name "product clicked"
2. The event type is mapped from "product clicked" to "click" based on the configuration
3. The properties from the input are correctly mapped to the output
4. The headers include the API key and application ID from the configuration

### Router Transformation Test

Here's an example of a router transformation test from the Algolia integration:

```typescript
// From /test/integrations/destinations/algolia/router/data.ts
export const data = [
  {
    name: 'algolia',
    description: 'Test router transformation for track event',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                type: 'track',
                event: 'product clicked',
                userId: 'testuserId1',
                properties: {
                  index: 'products',
                  filters: ['field1:hello', 'val1:val2'],
                },
              },
              destination: {
                Config: {
                  apiKey: 'defaultApiKey',
                  applicationId: 'O2YARRI15I',
                  eventTypeSettings: [
                    {
                      from: 'product clicked',
                      to: 'cLick ',
                    },
                  ],
                },
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
              },
            },
          ],
          destType: 'algolia',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                body: {
                  JSON: {
                    events: [
                      {
                        eventName: 'product clicked',
                        eventType: 'click',
                        filters: ['field1:hello', 'val1:val2'],
                        index: 'products',
                        userToken: 'testuserId1',
                      },
                    ],
                  },
                },
                endpoint: 'https://insights.algolia.io/1/events',
                headers: {
                  'X-Algolia-API-Key': 'defaultApiKey',
                  'X-Algolia-Application-Id': 'O2YARRI15I',
                },
                method: 'POST',
              },
              metadata: {
                destinationId: 'destId',
                workspaceId: 'wspId',
              },
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
```

This test verifies that:

1. The router transformation correctly processes a track event
2. The event type is mapped from "product clicked" to "click" based on the configuration
3. The properties from the input are correctly mapped to the output
4. The response includes the correct batchedRequest format for the router

### Data Delivery Test (Proxy v1)

Although the Algolia integration doesn't have data delivery tests, here's an example of how to write a data delivery test for proxy v1:

```typescript
// Example data delivery test for proxy v1
import { generateProxyV1Payload, generateMetadata } from '../../../testUtils';

export const data = [
  {
    id: 'algolia_v1_scenario_1',
    name: 'algolia',
    description: 'Test data delivery with valid input',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Algolia-API-Key': 'defaultApiKey',
              'X-Algolia-Application-Id': 'O2YARRI15I',
            },
            params: {},
            JSON: {
              events: [
                {
                  eventName: 'product clicked',
                  eventType: 'click',
                  filters: ['field1:hello', 'val1:val2'],
                  index: 'products',
                  userToken: 'testuserId1',
                },
              ],
            },
            endpoint: 'https://insights.algolia.io/1/events',
          },
          [generateMetadata('destId', 'wspId')],
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[ALGOLIA] Request Processed Successfully',
            response: [
              {
                statusCode: 200,
                error: 'success',
                metadata: generateMetadata('destId', 'wspId'),
              },
            ],
          },
        },
      },
    },
  },
];
```

This test verifies that:

1. The data delivery endpoint correctly processes a proxy v1 request
2. The request is properly formatted with the correct headers and body
3. The response includes the correct status code and message
4. The response includes the correct metadata for each event in the batch

### Network Mocks

Here's an example of network mocks from the Algolia integration:

```typescript
// From /test/integrations/destinations/algolia/network.ts
export const networkCallsData = [
  {
    httpReq: {
      url: 'https://insights.algolia.io/1/events',
      data: {
        events: [
          {
            eventName: 'product clicked',
            eventType: 'click',
            filters: ['field1:hello', 'val1:val2'],
            index: 'products',
            userToken: 'testuserId1',
          },
        ],
      },
      params: {},
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        status: 200,
        message: 'OK',
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://insights.algolia.io/1/events',
      data: {
        events: [
          {
            eventName: 'product clicked',
            eventType: 'abc', // Invalid event type
            filters: ['field1:hello', 'val1:val2'],
            index: 'products',
            userToken: 'testuserId1',
          },
        ],
      },
      params: {},
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        status: 422,
        message: 'EventType must be one of "click", "conversion" or "view"',
      },
      status: 422,
    },
  },
];
```

These mocks simulate:

1. A successful response (200) for a valid event type
2. An error response (422) for an invalid event type

The network mocks are used by the test runner to simulate responses from the Algolia API without making actual network requests.

## Conclusion

Component tests are a critical part of ensuring that integrations work correctly with the rudder-transformer API. By following the guidelines in this document, you can create comprehensive tests that verify the functionality of your integrations and catch issues before they reach production.

The Algolia integration tests demonstrate best practices for component testing, including:

- Organizing tests by feature (processor, router)
- Testing different event types and configurations
- Mocking network responses for both success and error cases
- Using descriptive test names and clear descriptions

Remember to:

- Write tests for all features of your integration
- Include both success and error scenarios
- Mock all external API calls
- Use descriptive names and clear descriptions for your test cases
- Follow the best practices outlined in this document

By writing thorough component tests, you can ensure that your integrations work correctly and reliably in all scenarios, making it easier to maintain and extend them in the future.

Happy testing!
