# Rudder Test Destination Implementation Plan - SIMPLIFIED FOR PLATFORM TESTING

## Overview

This document outlines a **SIMPLIFIED** implementation plan for a `rudder-test` destination using TypeScript. This destination is designed specifically for **platform feature testing**, not complex integration logic.

## Simplified Goals

1. **Platform Testing Only**: Simple destination for testing platform features like batching, error handling, etc.
2. **Minimal Implementation**: Keep it as simple as possible - just echo back event data
3. **Context-Based Control**: Use `context.testBehavior` to control response behavior
4. **Record V2 Focus**: Support record events but with minimal validation
5. **No Complex Logic**: Avoid complex transformation logic - just basic response building

## Key Simplifications

- **No complex batching logic** - just individual responses
- **No complex validation** - basic type checking only
- **No complex configuration** - minimal config
- **Inline processing** - avoid separate utility functions where possible
- **Echo pattern** - return event data back as response payload

## Simplified File Structure

```
src/v0/destinations/rudder_test/
├── config.ts                    # Minimal config (just endpoint)
├── transform.ts                  # Simple router-only implementation
├── type.ts                      # Basic types only
└── utils.ts                     # Optional simple helpers (may not be needed)

test/integrations/destinations/rudder_test/
├── router/
│   └── data.ts                  # Router test data only (skip processor tests)
└── common.ts                    # Common test utilities
```

## Implementation Phases

### Phase 1: Core TypeScript Implementation

#### 1.1 Type Definitions (`type.ts`)

**Purpose**: Define minimal TypeScript interfaces for platform testing.

**Key Components**:

- Basic destination configuration interface
- Simple response types
- Minimal message types

**Dependencies**:

```typescript
import { Destination } from '../../../types';
// SIMPLIFIED: No complex imports needed
```

**Simplified Structure**:

```typescript
// SIMPLIFIED: Minimal configuration
export interface RudderTestConfig {
  // Empty for now - just for platform testing
}

// SIMPLIFIED: Basic types only
export type RudderTestMessage = any; // Accept any message for testing
export type RudderTestDestination = Destination<RudderTestConfig>;

// SIMPLIFIED: Basic response type
export interface RudderTestResponse {
  statusCode: number;
  body?: {
    JSON?: any;
  };
  headers?: Record<string, string>;
  endpoint?: string;
  method?: string;
  error?: string;
  metadata?: any;
}
```

#### 1.2 Configuration (`config.ts`)

**Purpose**: Define minimal constants for testing.

**Key Components**:

- Basic endpoint only

**Example Structure**:

```typescript
export const BASE_ENDPOINT = 'https://test.rudderstack.com/v1/record';

// That's it! Keep it minimal
```

#### 1.3 Main Transform Logic (`transform.ts`)

**Purpose**: Simple router-based event processing for testing.

**Key Functions**:

- `processRouterDest(inputs, reqMetadata)`: Process events with inline logic
- Basic validation (message type only)
- Context-based test behavior handling
- Simple response building

**Focus**: Router function only - no processor function needed.

#### 1.4 Utility Functions (`utils.ts`)

**Purpose**: Optional simple helper functions (may not be needed).

**Key Functions**:

- Basic validation helper
- Optional response builder (if needed)

**Simplified Functions**:

```typescript
// SIMPLIFIED: No complex utility functions needed
// The transform function handles everything inline

export const validateEvent = (event: any): boolean => {
  // Basic validation - just check if it's a record type
  if (event.message.type !== 'record') {
    throw new InstrumentationError(
      `Message type "${event.message.type}" is not supported. Only 'record' type is supported.`,
    );
  }
  return true;
};

// Optional: Simple response builder if needed
export const buildTestResponse = (event: any, statusCode: number = 200, errorMessage?: string) => {
  if (statusCode !== 200) {
    return {
      statusCode,
      error: errorMessage || 'Test error',
      metadata: event.metadata,
    };
  }

  return {
    statusCode: 200,
    body: {
      JSON: {
        action: event.message.action,
        fields: event.message.fields || {},
        identifiers: event.message.identifiers || {},
        recordId: event.message.recordId,
        timestamp: new Date().toISOString(),
      },
    },
    headers: { 'Content-Type': 'application/json' },
    endpoint: 'https://test.rudderstack.com/v1/record',
    method: 'POST',
    metadata: [event.metadata],
  };
};
```

#### 1.4 Simplified Implementation Notes

**Key Points**:

- **No separate recordTransform.ts** - keep everything in transform.ts
- **No complex action handling** - just echo back the action in response
- **No complex validation** - basic type check only
- **Inline processing** - avoid creating separate utility functions unless absolutely necessary

### Phase 2: Testing Implementation

#### 2.1 Common Test Utilities (`common.ts`)

**Purpose**: Shared test configuration and utilities.

**Key Components**:

- Destination configuration for tests
- Common test data
- Helper functions

**Example Structure**:

```typescript
import { Destination } from '../../../../src/types';

export const destType = 'rudder_test';
export const destTypeInUpperCase = 'RUDDER_TEST';
export const displayName = 'Rudder Test';

export const destination: Destination = {
  Config: {
    testMode: 'success',
    // ... other config
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: '123',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: '123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};
```

#### 2.2 Router Test Data (`router/data.ts`)

**Purpose**: Test cases for router transformation only.

**Key Components**:

- Basic record event test cases
- Error scenarios with testBehavior
- Success scenarios

**Note**: Skip processor tests - router tests only for simplified implementation.

## Simplified Implementation Details

### Basic Validation

**SIMPLIFIED**: Just check if message type is 'record' - no complex schema validation needed.

```typescript
// Simple validation
if (event.message.type !== 'record') {
  throw new InstrumentationError('Only record type supported');
}
```

### Response Handling

**SIMPLIFIED**: Just echo back the event data - no complex action-specific logic.

### Test Scenarios

1. **Basic record event with success response**
2. **Record event with error response via testBehavior**
3. **Invalid message type**

## Record V2 Test Behavior via Event Context

### Context-Based Test Control

Use `context.testBehavior` in the event to control test behavior:

```typescript
// Success case
{
  "context": {
    "testBehavior": {
      "statusCode": 200
    }
  }
}

// Failure case
{
  "context": {
    "testBehavior": {
      "statusCode": 400,
      "errorMessage": "Test validation error"
    }
  }
}
```

### Behavior Logic

- **No testBehavior**: Continue with normal processing (returns actual event data with 200)
- **statusCode: 200**: Continue with normal processing (returns actual event data with 200)
- **statusCode: 4xx/5xx**: Return error response with specified status code (skip normal processing)
- **errorMessage**: Include custom error message in error response

## Simplified Dependencies and Imports

### Minimal Dependencies

```typescript
// From @rudderstack/integrations-lib (minimal)
import { InstrumentationError } from '@rudderstack/integrations-lib';

// From types (basic only)
import { Destination } from '../../../types';

// From utilities (minimal)
import { handleRtTfSingleEventError } from '../../util';

// SIMPLIFIED: No complex schema validation or zod imports needed
```

## Simplified Implementation Guidelines

### Code Style

- Follow existing TypeScript patterns in the codebase
- Use basic error handling (InstrumentationError only)
- Keep validation minimal - just message type checking
- Use simple response format patterns

### Testing

- Use table-driven tests for better readability
- Include basic positive and negative test cases
- Test record message types with testBehavior control
- Focus on platform testing scenarios

### Error Handling

- Use InstrumentationError for basic validation errors
- Provide simple error messages
- Handle testBehavior context for controlled error responses

## Next Steps

1. **Review this plan** and provide feedback
2. **Implement Phase 1** - Core TypeScript files
3. **Implement Phase 2** - Testing infrastructure
4. **Test and validate** the implementation
5. **Phase 3 (Later)** - Add destination configuration files

## Detailed Implementation Examples

### Simplified Type Definitions Example (`type.ts`)

```typescript
import { Destination } from '../../../types';

// SIMPLIFIED: Minimal configuration
export interface RudderTestConfig {
  // Empty for now - just for platform testing
}

// SIMPLIFIED: Basic types only
export type RudderTestMessage = any; // Accept any message for testing
export type RudderTestDestination = Destination<RudderTestConfig>;

// SIMPLIFIED: Basic response type
export interface RudderTestResponse {
  statusCode: number;
  body?: {
    JSON?: any;
  };
  headers?: Record<string, string>;
  endpoint?: string;
  method?: string;
  error?: string;
  metadata?: any;
}
```

### Complete Transform Implementation Example (`transform.ts`) - Router Only

```typescript
import { RecordAction } from '../../../types/rudderEvents';
import { handleRtTfSingleEventError } from '../../util';
import { RudderTestDestination } from './type';
// SIMPLIFIED: No complex imports needed

const processRouterDest = async (inputs: any[], reqMetadata: any) => {
  if (!inputs?.length) return [];

  const { destination } = inputs[0];
  // SIMPLIFIED: No need to extract connection or cast types

  // SIMPLIFIED: No complex processing patterns
  // SIMPLIFIED: Just process each event individually
  const responses = inputs.map((event) => {
    try {
      // Check for test behavior in context
      const testBehavior = event.message.context?.testBehavior;

      // If error status code requested, return error immediately
      if (testBehavior?.statusCode && testBehavior.statusCode !== 200) {
        return {
          statusCode: testBehavior.statusCode,
          error: testBehavior.errorMessage || 'Test error',
          metadata: event.metadata,
        };
      }

      // Otherwise return success response with event data
      return {
        statusCode: 200,
        body: {
          JSON: {
            action: event.message.action,
            fields: event.message.fields || {},
            identifiers: event.message.identifiers || {},
            recordId: event.message.recordId,
            timestamp: new Date().toISOString(),
          },
        },
        headers: { 'Content-Type': 'application/json' },
        endpoint: 'https://test.rudderstack.com/v1/record',
        method: 'POST',
        metadata: [event.metadata],
      };
    } catch (error) {
      return handleRtTfSingleEventError(event, error, reqMetadata);
    }
  });

  return responses;
};

// SIMPLIFIED: No separate utility functions needed
// All logic is inline in the processRouterDest function above

export { processRouterDest };

// SIMPLIFIED: No process function needed - router only
```

## SIMPLIFIED IMPLEMENTATION SUMMARY

### What We're Building:

1. **Minimal Transform Function**: Just echo back event data with configurable status codes
2. **Context-Based Testing**: Use `context.testBehavior` to control responses
3. **No Complex Batching**: Individual responses for each event
4. **Basic Validation**: Just check if message type is 'record'
5. **Echo Pattern**: Return the event fields/identifiers back as JSON payload

### Key Benefits of This Approach:

- **Simple to implement** - minimal code required
- **Easy to test** - predictable behavior
- **Platform focused** - tests platform features, not integration logic
- **Maintainable** - no complex business logic to maintain
- **Flexible** - can control behavior via event context

### Next Steps:

1. Implement the simplified transform.ts with inline processing
2. Create minimal type.ts and config.ts files
3. Add basic router tests
4. Skip complex utility functions and processor tests for now

This simplified approach gives us a working destination for platform testing without the complexity of a full integration.

````

### Simplified Implementation Notes

**No separate recordTransform.ts file needed** - all logic is inline in transform.ts for simplicity.

## Simplified Test Data Structure

### Router Test Cases (`router/data.ts` excerpt)

```typescript
// INSERT record test case
{
  name: 'rudder_test',
  description: 'Test record INSERT operation',
  feature: 'router',
  module: 'destination',
  version: 'v0',
  input: {
    request: {
      body: [
        {
          message: {
            type: 'record',
            action: 'insert',
            fields: {
              email: 'test@example.com',
              name: 'Test User',
              age: 30,
            },
            identifiers: {
              userId: 'user123',
            },
            recordId: 'record123',
            context: {
              sources: {
                job_id: 'job123',
                version: '1.0',
                job_run_id: 'run123',
                task_run_id: 'task123',
              },
              testBehavior: {
                statusCode: 200
              },
            },
            messageId: 'msg123',
            timestamp: '2023-01-01T00:00:00.000Z',
          },
          destination: destination,
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
            statusCode: 200,
            body: {
              JSON: {
                action: 'insert',
                recordId: 'record123',
                fields: {
                  email: 'test@example.com',
                  name: 'Test User',
                  age: 30,
                },
                context: {
                  job_id: 'job123',
                  version: '1.0',
                  job_run_id: 'run123',
                  task_run_id: 'task123',
                },
                timestamp: '2023-01-01T00:00:00.000Z',
              },
            },
            headers: {
              'Content-Type': 'application/json',
            },
            endpoint: 'https://test.rudderstack.com/v1/record',
            method: 'POST',
          },
          statusCode: 200,
        },
      ],
    },
  },
},
````

## References

- CustomerIO Audience destination for record handling patterns: `src/v0/destinations/customerio_audience/`
- Stormly destination for basic TypeScript structure: `src/v0/destinations/stormly/`
- Integration test patterns from existing destinations: `test/integrations/destinations/`
- Record V2 schema definition: `src/types/rudderEvents.ts`
- Utility functions reference: `src/v0/util/`
- Error types reference: `@rudderstack/integrations-lib`
