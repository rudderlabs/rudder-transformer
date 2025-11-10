# Integration Development Guide

This guide provides information on how to develop new integrations (sources and destinations) for the RudderStack Transformer based on actual implementation patterns in the codebase.

## Overview

RudderStack Transformer supports two types of integrations:

1. **Source Integrations**: Transform data from external sources into [RudderStack's standard event](https://www.rudderstack.com/docs/event-spec/standard-events/) format
2. **Destination Integrations**: Transform RudderStack events to destination-specific formats

The transformer handles different transformation modes:

1. **Processor Transformation**: Used when events are processed at the server
2. **Router Transformation**: Used when events are routed to destinations
3. **Batch Transformation**: Used for batch processing of events

Integrations can be implemented using different approaches:

1. **Native Integration (v0/v1)**: Traditional implementation pattern
2. **CDK v2 Integration**: Component Development Kit based implementation

## Request Flow

The request flow for transformations follows this pattern:

1. **Routes**: Define API endpoints (`src/routes/`)

   - `destination.ts`: Handles destination transformations
   - `source.ts`: Handles source transformations

2. **Controllers**: Process requests and coordinate services (`src/controllers/`)

   - `DestinationController`: Handles destination transformation requests
   - `SourceController`: Handles source transformation requests

3. **Services**: Implement business logic (`src/services/`)

   - `NativeIntegrationDestinationService`: Handles native destination integrations
   - `CDKV2DestinationService`: Handles CDK (Component Development Kit) v2 destination integrations
   - `NativeIntegrationSourceService`: Handles native source integrations

4. **Integration Implementations**: Actual transformation logic
   - `src/v0/destinations/`: Legacy destination implementations
   - `src/v1/destinations/`: Current destination implementations
   - `src/sources/`: Source implementations

## Destination Integration Development

### Directory Structure

RudderStack supports two versions of destination integrations (v0 and v1). The v1 structure is recommended for new integrations:

```
src/v1/destinations/[destination-name]/
├── config.ts              # Configuration constants
├── index.ts              # Main entry point (exports processEvent function)
├── networkHandler.ts      # Network request handling
├── types.ts               # Type definitions
├── utils.ts               # Utility functions
└── strategies/            # Transformation strategies
    ├── base.ts            # Base strategy class
    ├── track-identify.ts  # Strategy for track/identify events
    └── generic.ts         # Generic fallback strategy
```

### Required Components

#### 1. Configuration (config.ts)

Define constants specific to the destination:

```typescript
// Maximum batch size for the destination
export const MAX_BATCH_SIZE = 100;

// API version
export const API_VERSION = 'v1';

// Endpoints that support bulk operations
export const BULK_ENDPOINTS = ['events/track/bulk', 'users/update/bulk'];

// Response paths for error handling
export const RESPONSE_ERROR_PATHS = ['error', 'errors', 'message'];
```

#### 2. Network Handler (networkHandler.ts)

Implement the network handler to manage API requests and responses:

```typescript
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

// Custom response handler for the destination
function responseHandler(responseParams) {
  const { destinationRequest } = responseParams;
  const strategy = getResponseStrategy(destinationRequest.endpoint);
  return strategy.handleResponse(responseParams);
}

export { networkHandler };
```

#### 3. Types (types.ts)

Define TypeScript interfaces for the destination:

```typescript
export type DestinationResponse = {
  status: number;
  response: {
    msg?: string;
    code?: string;
    params?: Record<string, unknown>;
  };
};

export type EventPayload = {
  userId?: string;
  anonymousId?: string;
  event?: string;
  properties?: Record<string, any>;
  // Other fields as needed
};
```

#### 4. Transformation Strategies

Implement strategies for different event types:

**Base Strategy (strategies/base.ts)**:

```typescript
abstract class BaseStrategy {
  handleResponse(responseParams) {
    const { destinationResponse } = responseParams;
    const { status } = destinationResponse;

    if (!isHttpStatusSuccess(status)) {
      return this.handleError(responseParams);
    }

    return this.handleSuccess(responseParams);
  }

  abstract handleSuccess(responseParams: any): void;
  abstract handleError(responseParams: any): void;
}

export { BaseStrategy };
```

**Track/Identify Strategy (strategies/track-identify.ts)**:

```typescript
import { BaseStrategy } from './base';

class TrackIdentifyStrategy extends BaseStrategy {
  handleSuccess(responseParams) {
    // Implementation for successful track/identify events
  }

  handleError(responseParams) {
    // Error handling for track/identify events
  }
}

export { TrackIdentifyStrategy };
```

#### 5. Utility Functions and Process Event (utils.ts)

Implement helper functions and the main process event function for the destination:

```typescript
// Helper functions
export function formatUserProperties(properties) {
  // Format user properties according to destination requirements
}

export function validateEvent(event) {
  // Validate event against destination requirements
}

export function handleRateLimiting(response) {
  // Handle rate limiting based on destination response
}

// Main process event function - this is the core of the integration
export function processEvent(event) {
  const { message, destination } = event;
  const { type } = message;

  // Common validation
  validateEvent(message);

  // Process based on event type
  switch (type) {
    case 'identify':
      return processIdentify(message, destination);
    case 'track':
      return processTrack(message, destination);
    case 'page':
      return processPage(message, destination);
    case 'screen':
      return processScreen(message, destination);
    case 'group':
      return processGroup(message, destination);
    default:
      throw new Error(`Message type ${type} not supported`);
  }
}

function processIdentify(message, destination) {
  // Transform identify event to destination format
}

function processTrack(message, destination) {
  // Transform track event to destination format
}

export function validateEvent(event) {
  // Validate event against destination requirements
}

export function handleRateLimiting(response) {
  // Handle rate limiting based on destination response
}
```

### Minimum Required Functions

For a destination integration to work properly, you must implement:

1. **Process Function**: Transform RudderStack events to destination format (required)
2. **Response Handler**: Process responses from the destination (required)
3. **Validation**: Validate events against destination requirements (recommended)
4. **Error Handling**: Handle errors from the destination (required)
5. **Network Handler**: Handle API requests to the destination (required)

The main entry point must export an object with at least these properties:

```typescript
export default {
  process: processEvent, // Main transformation function
  networkHandler, // Network handling functionality
};
```

## Source Integration Development

Source integrations transform data from external sources (webhooks, cloud apps) into [RudderStack's standard event](https://www.rudderstack.com/docs/event-spec/standard-events/) format.

### Directory Structure

When creating a new source integration, follow this structure:

```
src/sources/[source-name]/
├── index.ts              # Main entry point
├── processor.ts          # Event processing logic
├── types.ts              # Type definitions
└── utils.ts              # Utility functions
```

### Required Components

#### 1. Main Entry Point (index.ts)

Define the main entry point for the source that exports the process function:

```typescript
import { processEvent } from './processor';
import { validatePayload } from './utils';

async function process(req) {
  const { body } = req;

  // Validate the incoming payload
  validatePayload(body);

  // Process the event
  const events = await processEvent(body);

  return events;
}

export default { process };
```

#### 2. Event Processor (processor.ts)

Implement the logic to transform source data to RudderStack format:

```typescript
import { formatProperties, extractUserInfo } from './utils';

export async function processEvent(payload) {
  // Extract user information
  const userInfo = extractUserInfo(payload);

  // Format event properties
  const properties = formatProperties(payload);

  // Create RudderStack event
  const rudderEvent = {
    type: 'track',
    event: payload.eventName,
    userId: userInfo.userId,
    anonymousId: userInfo.anonymousId,
    properties,
    context: {
      source: 'source-name',
      // Additional context
    },
    timestamp: new Date().toISOString(),
  };

  return [rudderEvent];
}
```

#### 3. Types (types.ts)

Define TypeScript interfaces for the source:

```typescript
export interface SourcePayload {
  eventName: string;
  userId?: string;
  data: Record<string, any>;
  timestamp?: string;
  // Other fields specific to the source
}

export interface UserInfo {
  userId?: string;
  anonymousId?: string;
  traits?: Record<string, any>;
}
```

#### 4. Utility Functions (utils.ts)

Implement helper functions for the source:

```typescript
import { SourcePayload, UserInfo } from './types';

export function validatePayload(payload: SourcePayload) {
  // Validate the incoming payload
  if (!payload.eventName) {
    throw new Error('Event name is required');
  }
  // Additional validation
}

export function extractUserInfo(payload: SourcePayload): UserInfo {
  // Extract user information from the payload
  return {
    userId: payload.userId,
    anonymousId: generateAnonymousId(payload),
    traits: extractUserTraits(payload),
  };
}

export function formatProperties(payload: SourcePayload) {
  // Format properties according to RudderStack standards
  return {
    ...payload.data,
    // Additional formatting
  };
}
```

### Minimum Required Functions

For a source integration to work properly, you must implement:

1. **Process Function**: Main entry point that handles the source request (required)
2. **Payload Validation**: Validate incoming payloads from the source (required)
3. **Event Processing**: Transform source data to RudderStack event format (required)
4. **User Identification**: Extract user identifiers from the source data (required)
5. **Property Formatting**: Format event properties according to RudderStack standards (required)

The main entry point must export an object with at least this property:

```typescript
export default {
  process, // Main processing function
};
```

## Testing Integrations

### Running Tests

RudderStack uses Jest for testing. To run tests for a specific destination:

```bash
# For component tests
npm run test:ts -- component --destination=<destination-name>

# For unit tests
npm run test:ts -- unit --destination=<destination-name>
```

### Destination Testing

1. **Unit Tests**: Test individual functions and components
2. **Component Tests**: Test the integration as a whole using table-driven tests
3. **Network Mock Tests**: Test API interactions with mocked responses

Example of a destination component test:

```typescript
describe('MyDestination', () => {
  describe('processEvent', () => {
    const testCases = [
      {
        name: 'should transform track event correctly',
        input: {
          message: {
            type: 'track',
            event: 'Product Purchased',
            userId: 'user123',
            properties: {
              price: 100,
              currency: 'USD',
            },
          },
          destination: {
            Config: {
              apiKey: 'test-api-key',
            },
          },
        },
        expected: {
          // Expected output for the destination
        },
      },
      // Additional test cases
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
      const output = processEvent(input);
      expect(output).toEqual(expected);
    });
  });

  // Additional test suites
});
```

### Source Testing

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test the source with sample payloads
3. **Validation Tests**: Test payload validation logic

Example of a source test:

```typescript
describe('MySource', () => {
  describe('process', () => {
    const testCases = [
      {
        name: 'should process valid payload correctly',
        input: {
          body: {
            eventName: 'purchase',
            userId: 'user123',
            data: {
              item: 'Product',
              price: 100,
            },
          },
        },
        expected: [
          {
            type: 'track',
            event: 'purchase',
            userId: 'user123',
            properties: {
              item: 'Product',
              price: 100,
            },
            // Additional expected fields
          },
        ],
      },
      // Additional test cases
    ];

    test.each(testCases)('$name', async ({ input, expected }) => {
      const sourceModule = require('../index');
      const output = await sourceModule.default.process(input);
      expect(output).toEqual(expected);
    });
  });

  // Additional test suites
});
```

## Best Practices

### General Best Practices

1. **Use Table Tests**: Always use table-driven tests for testing integrations
2. **Type Safety**: Use TypeScript interfaces for all data structures
3. **Error Handling**: Implement comprehensive error handling
4. **Logging**: Add appropriate logging for debugging
5. **Documentation**: Document all functions and components

### Destination-Specific Best Practices

1. **Rate Limiting**: Implement proper rate limiting handling
2. **Batching**: Optimize for batch operations when supported
3. **Retry Logic**: Implement retry logic for transient errors
4. **Validation**: Validate events before sending to the destination
5. **Response Parsing**: Properly parse and handle destination responses
6. **Configuration Values**: Use configuration values instead of hardcoding values
7. **Fail Individual Items**: Fail individual items that exceed size limits rather than just warning about them

### Source-Specific Best Practices

1. **Payload Validation**: Thoroughly validate incoming payloads
2. **Data Normalization**: Normalize data to RudderStack standards
3. **User Identification**: Implement robust user identification logic
4. **Property Mapping**: Map source properties to RudderStack properties
5. **Error Recovery**: Implement error recovery mechanisms

## Common Pitfalls and Solutions

### Destination Integration Pitfalls

1. **Rate Limiting**: Not handling rate limiting properly

   - Solution: Implement exponential backoff and retry logic

2. **Large Payloads**: Not handling large payloads correctly

   - Solution: Implement payload size validation and chunking

3. **Authentication Errors**: Not handling authentication errors properly

   - Solution: Implement proper error handling for authentication failures

4. **String Concatenation**: Using string concatenation in code

   - Solution: Use template literals or proper string formatting functions

5. **Network Bandwidth**: Not optimizing network bandwidth
   - Solution: Use resource maps and metadata references instead of sending full objects

### Source Integration Pitfalls

1. **Invalid Payloads**: Not validating incoming payloads thoroughly

   - Solution: Implement comprehensive payload validation

2. **Missing User Identifiers**: Not handling missing user identifiers

   - Solution: Implement fallback mechanisms for user identification

3. **Data Type Mismatches**: Not handling data type mismatches
   - Solution: Implement proper type conversion and validation

## Resources

- [RudderStack Event Spec](https://www.rudderstack.com/docs/event-spec/standard-events/)
- [RudderStack API Documentation](https://www.rudderstack.com/docs/api/)
- [RudderStack Event Stream Documentation](https://www.rudderstack.com/docs/data-pipelines/event-stream/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
