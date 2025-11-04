# Version Differences: v0 vs v1 vs CDK v2

This document explains the different versions of integration implementations in the RudderStack Transformer, their architectural differences, migration guidelines, and the advantages and disadvantages of each approach.

## Overview of Versions

The RudderStack Transformer supports three main versions of integration implementations:

1. **v0 (Legacy)**: The original implementation approach using JavaScript
2. **v1**: An improved implementation approach using TypeScript and the Strategy pattern
3. **CDK v2**: A declarative implementation approach using YAML and the JSON Template Engine

## Why Different Versions Exist

The evolution of integration implementations in RudderStack Transformer has been driven by several factors:

### 1. Technical Evolution

As the RudderStack platform has evolved, so has the approach to implementing integrations:

- **v0**: Initial implementation focused on functionality
- **v1**: Improved implementation focused on maintainability and type safety
- **CDK v2**: Modern implementation focused on declarative configuration and reusability

### 2. Developer Experience

Different versions provide different developer experiences:

- **v0**: Familiar JavaScript approach with minimal structure
- **v1**: More structured TypeScript approach with better tooling
- **CDK v2**: Declarative approach with less code and more configuration

### 3. Maintenance Burden

As the number of integrations grew, maintenance became a significant concern:

- **v0**: High maintenance burden due to inconsistent implementations
- **v1**: Reduced maintenance burden due to standardized patterns
- **CDK v2**: Minimal maintenance burden due to declarative approach

### 4. Backward Compatibility

Maintaining backward compatibility while improving the implementation approach:

- **v0**: Maintained for backward compatibility
- **v1**: Introduced for improved maintainability
- **CDK v2**: Introduced for declarative configuration

## Architectural Differences

### v0 Architecture

The v0 architecture is characterized by:

1. **JavaScript-based Implementation**:

   - Uses CommonJS module system (`require`/`module.exports`)
   - Minimal type checking
   - Flexible but inconsistent structure

2. **Function-based Approach**:

   - Uses functions for transformation logic
   - Often includes a `processEvent` function as the main entry point
   - May include helper functions for specific event types

3. **Direct Utility Usage**:

   - Directly uses utility functions from `../../util`
   - Often duplicates utility functions across integrations
   - Limited abstraction and encapsulation

4. **Minimal Structure Enforcement**:
   - No enforced structure for implementations
   - Varies widely across integrations
   - Often mixes concerns (transformation, network handling, etc.)

Example v0 implementation:

```javascript
const get = require('get-value');
const set = require('set-value');
const { ConfigurationError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  isDefinedAndNotNull,
} = require('../../util');

const processEvent = (event) => {
  const { message, destination } = event;
  const response = defaultRequestConfig();

  // Extract configuration
  const apiKey = destination.Config.apiKey;

  // Validate configuration
  if (!apiKey) {
    throw new ConfigurationError('API Key is required');
  }

  // Process based on event type
  switch (message.type) {
    case 'identify':
      // Handle identify event
      response.endpoint = 'https://api.example.com/identify';
      response.method = 'POST';
      response.body.JSON = {
        apiKey,
        userId: message.userId,
        traits: message.traits,
      };
      break;
    case 'track':
      // Handle track event
      response.endpoint = 'https://api.example.com/track';
      response.method = 'POST';
      response.body.JSON = {
        apiKey,
        userId: message.userId,
        event: message.event,
        properties: message.properties,
      };
      break;
    // Handle other event types
    default:
      // Handle unknown event type
      throw new Error(`Message type ${message.type} not supported`);
  }

  return response;
};

const process = (event) => {
  return processEvent(event);
};

module.exports = { processEvent, process };
```

### v1 Architecture

The v1 architecture is characterized by:

1. **TypeScript-based Implementation**:

   - Uses TypeScript for type safety
   - Uses ES modules (`import`/`export`)
   - More structured and consistent

2. **Object-oriented Approach**:

   - Uses classes and interfaces
   - Implements the Strategy pattern for different event types
   - Better separation of concerns

3. **Abstracted Utility Usage**:

   - Uses abstracted utility functions
   - Reduces duplication across integrations
   - Better encapsulation

4. **Enforced Structure**:
   - More enforced structure for implementations
   - Consistent across integrations
   - Separates concerns (transformation, network handling, etc.)

Example v1 implementation:

```typescript
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { BaseStrategy } from './strategies/base';
import { TrackIdentifyStrategy } from './strategies/track-identify';
import { GenericStrategy } from './strategies/generic';
import { ProxyHandlerInput } from './types';

// Strategy registry
const strategyRegistry: { [key: string]: BaseStrategy } = {
  [TrackIdentifyStrategy.name]: new TrackIdentifyStrategy(),
  [GenericStrategy.name]: new GenericStrategy(),
};

// Get response strategy based on endpoint
const getResponseStrategy = (endpoint: string): BaseStrategy => {
  if (endpoint.includes('track') || endpoint.includes('identify')) {
    return strategyRegistry[TrackIdentifyStrategy.name];
  }
  return strategyRegistry[GenericStrategy.name];
};

// Response handler
const responseHandler = (responseParams: ProxyHandlerInput): void => {
  const { destinationRequest } = responseParams;
  const strategy = getResponseStrategy(destinationRequest.endpoint);
  return strategy.handleResponse(responseParams);
};

// Network handler
function networkHandler(this: any): void {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

// Process event function
const processEvent = (event: any): any => {
  const { message, destination } = event;

  // Extract configuration
  const apiKey = destination.Config.apiKey;

  // Validate configuration
  if (!apiKey) {
    throw new Error('API Key is required');
  }

  // Process based on event type
  switch (message.type) {
    case 'identify':
      // Handle identify event
      return {
        endpoint: 'https://api.example.com/identify',
        method: 'POST',
        body: {
          JSON: {
            apiKey,
            userId: message.userId,
            traits: message.traits,
          },
        },
      };
    case 'track':
      // Handle track event
      return {
        endpoint: 'https://api.example.com/track',
        method: 'POST',
        body: {
          JSON: {
            apiKey,
            userId: message.userId,
            event: message.event,
            properties: message.properties,
          },
        },
      };
    // Handle other event types
    default:
      // Handle unknown event type
      throw new Error(`Message type ${message.type} not supported`);
  }
};

export { networkHandler, processEvent };
```

### CDK v2 Architecture

The CDK v2 architecture is characterized by:

1. **YAML-based Implementation**:

   - Uses YAML for configuration
   - Declarative rather than imperative
   - Minimal code, more configuration

2. **Workflow-based Approach**:

   - Defines transformation as a series of steps
   - Each step has a clear purpose and output
   - More declarative and less imperative

3. **Template Engine Usage**:

   - Uses JSON Template Engine for transformation logic
   - More declarative, less imperative
   - Reduces boilerplate code

4. **Highly Structured**:
   - Highly structured and consistent
   - Consistent across integrations
   - Clear separation of concerns

Example CDK v2 implementation:

```yaml
bindings:
  - name: EventType
    path: ../../../../constants
  - path: ../../bindings/jsontemplate
    exportAll: true
  - name: getHashFromArray
    path: ../../../../v0/util

steps:
  - name: validateInput
    template: |
      $.assertConfig(.destination.Config.apiKey, "API Key is required");
  - name: prepareContext
    template: |
      $.context.apiKey = .destination.Config.apiKey;
      $.context.endpoint = "";
      $.context.method = "";
      $.context.payload = {};
  - name: processIdentify
    condition: .message.type == "identify"
    template: |
      $.context.endpoint = "https://api.example.com/identify";
      $.context.method = "POST";
      $.context.payload = {
        apiKey: $.context.apiKey,
        userId: .message.userId,
        traits: .message.traits
      };
  - name: processTrack
    condition: .message.type == "track"
    template: |
      $.context.endpoint = "https://api.example.com/track";
      $.context.method = "POST";
      $.context.payload = {
        apiKey: $.context.apiKey,
        userId: .message.userId,
        event: .message.event,
        properties: .message.properties
      };
  - name: buildResponse
    template: |
      {
        "endpoint": $.context.endpoint,
        "method": $.context.method,
        "body": {
          "JSON": $.context.payload
        }
      }
```

## Migration Guidelines

### Migrating from v0 to v1

1. **Convert to TypeScript**:

   - Convert JavaScript files to TypeScript
   - Add type definitions for input and output
   - Use interfaces for complex types

2. **Implement Strategy Pattern**:

   - Create a base strategy class
   - Implement specific strategies for different event types
   - Use a strategy registry to select the appropriate strategy

3. **Separate Concerns**:

   - Separate transformation logic from network handling
   - Separate event type handling from general transformation
   - Separate configuration management from transformation logic

4. **Use Modern Patterns**:
   - Use ES modules instead of CommonJS
   - Use classes and interfaces
   - Use modern JavaScript features

Example migration steps:

1. **Create TypeScript Files**:

   - Create `networkHandler.ts`, `types.ts`, and `utils.ts`
   - Create `strategies/base.ts`, `strategies/track-identify.ts`, and `strategies/generic.ts`

2. **Implement Base Strategy**:

   ```typescript
   // strategies/base.ts
   export abstract class BaseStrategy {
     handleResponse(responseParams: any): void {
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
   ```

3. **Implement Specific Strategies**:

   ```typescript
   // strategies/track-identify.ts
   import { BaseStrategy } from './base';

   export class TrackIdentifyStrategy extends BaseStrategy {
     handleSuccess(responseParams: any): void {
       // Implementation for successful track/identify events
     }

     handleError(responseParams: any): void {
       // Error handling for track/identify events
     }
   }
   ```

4. **Implement Network Handler**:

   ```typescript
   // networkHandler.ts
   import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
   import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
   import { TrackIdentifyStrategy } from './strategies/track-identify';
   import { GenericStrategy } from './strategies/generic';

   const strategyRegistry = {
     [TrackIdentifyStrategy.name]: new TrackIdentifyStrategy(),
     [GenericStrategy.name]: new GenericStrategy(),
   };

   const getResponseStrategy = (endpoint: string) => {
     if (endpoint.includes('track') || endpoint.includes('identify')) {
       return strategyRegistry[TrackIdentifyStrategy.name];
     }
     return strategyRegistry[GenericStrategy.name];
   };

   const responseHandler = (responseParams: any) => {
     const { destinationRequest } = responseParams;
     const strategy = getResponseStrategy(destinationRequest.endpoint);
     return strategy.handleResponse(responseParams);
   };

   function networkHandler(this: any) {
     this.prepareProxy = prepareProxyRequest;
     this.proxy = proxyRequest;
     this.processAxiosResponse = processAxiosResponse;
     this.responseHandler = responseHandler;
   }

   export { networkHandler };
   ```

5. **Implement Process Event Function**:
   ```typescript
   // utils.ts
   export function processEvent(event: any): any {
     // Implementation from v0, converted to TypeScript
   }
   ```

### Migrating from v1 to CDK v2

1. **Create YAML Workflow Files**:

   - Create `procWorkflow.yaml` for processor transformation
   - Create `rtWorkflow.yaml` for router transformation

2. **Define Bindings**:

   - Import required dependencies
   - Import utility functions
   - Import constants

3. **Define Steps**:

   - Break down the transformation logic into steps
   - Define conditions for each step
   - Use templates for transformation logic

4. **Use JSON Template Engine**:
   - Convert imperative code to declarative templates
   - Use template expressions for logic
   - Use context for sharing data between steps

Example migration steps:

1. **Create YAML Workflow Files**:

   ```yaml
   # procWorkflow.yaml
   bindings:
     - name: EventType
       path: ../../../../constants
     - path: ../../bindings/jsontemplate
       exportAll: true
     - name: getHashFromArray
       path: ../../../../v0/util

   steps:
     # Steps will be defined here
   ```

2. **Define Validation Step**:

   ```yaml
   - name: validateInput
     template: |
       $.assertConfig(.destination.Config.apiKey, "API Key is required");
   ```

3. **Define Context Preparation Step**:

   ```yaml
   - name: prepareContext
     template: |
       $.context.apiKey = .destination.Config.apiKey;
       $.context.endpoint = "";
       $.context.method = "";
       $.context.payload = {};
   ```

4. **Define Event Type Processing Steps**:

   ```yaml
   - name: processIdentify
     condition: .message.type == "identify"
     template: |
       $.context.endpoint = "https://api.example.com/identify";
       $.context.method = "POST";
       $.context.payload = {
         apiKey: $.context.apiKey,
         userId: .message.userId,
         traits: .message.traits
       };

   - name: processTrack
     condition: .message.type == "track"
     template: |
       $.context.endpoint = "https://api.example.com/track";
       $.context.method = "POST";
       $.context.payload = {
         apiKey: $.context.apiKey,
         userId: .message.userId,
         event: .message.event,
         properties: .message.properties
       };
   ```

5. **Define Response Building Step**:
   ```yaml
   - name: buildResponse
     template: |
       {
         "endpoint": $.context.endpoint,
         "method": $.context.method,
         "body": {
           "JSON": $.context.payload
         }
       }
   ```

## Advantages and Disadvantages

### v0 (Legacy)

#### Advantages

1. **Simplicity**:

   - Simple JavaScript-based implementation
   - Minimal structure and constraints
   - Easy to understand for JavaScript developers

2. **Flexibility**:

   - Flexible implementation approach
   - Can be adapted to various integration requirements
   - Minimal constraints on implementation details

3. **Backward Compatibility**:
   - Maintains backward compatibility with existing integrations
   - No need to migrate existing integrations
   - Familiar to existing developers

#### Disadvantages

1. **Type Safety**:

   - Lacks type safety
   - Prone to runtime errors
   - Difficult to refactor

2. **Inconsistency**:

   - Inconsistent implementation across integrations
   - Varies widely in structure and approach
   - Difficult to maintain and extend

3. **Duplication**:

   - Often duplicates utility functions
   - Lacks abstraction and encapsulation
   - Increases maintenance burden

4. **Testing Difficulty**:
   - Difficult to test due to lack of structure
   - Often lacks clear separation of concerns
   - Requires more complex test setup

### v1

#### Advantages

1. **Type Safety**:

   - Uses TypeScript for type safety
   - Reduces runtime errors
   - Easier to refactor

2. **Structured Approach**:

   - More structured and consistent
   - Uses object-oriented patterns
   - Better separation of concerns

3. **Maintainability**:

   - More maintainable due to consistent structure
   - Better abstraction and encapsulation
   - Reduces duplication

4. **Testability**:
   - Easier to test due to clear separation of concerns
   - Can test strategies independently
   - Requires less complex test setup

#### Disadvantages

1. **Complexity**:

   - More complex than v0
   - Requires understanding of TypeScript and OOP
   - Steeper learning curve

2. **Boilerplate**:

   - Requires more boilerplate code
   - Needs multiple files for a single integration
   - More setup required for new integrations

3. **Migration Effort**:
   - Requires effort to migrate from v0
   - Needs refactoring of existing code
   - May introduce regressions during migration

### CDK v2

#### Advantages

1. **Declarative Approach**:

   - Declarative rather than imperative
   - More configuration, less code
   - Easier to understand and maintain

2. **Consistency**:

   - Highly consistent across integrations
   - Standardized structure and approach
   - Easier to maintain and extend

3. **Reusability**:

   - More reusable components
   - Reduces duplication
   - Easier to share functionality

4. **Reduced Boilerplate**:
   - Minimal boilerplate code
   - Focus on business logic
   - Less setup required for new integrations

#### Disadvantages

1. **Learning Curve**:

   - Requires learning YAML and JSON Template Engine
   - Different paradigm from traditional programming
   - May be unfamiliar to some developers

2. **Debugging Difficulty**:

   - Can be harder to debug
   - Error messages may be less clear
   - Requires understanding of the template engine

3. **Limited Flexibility**:

   - Less flexible than code-based approaches
   - May not handle all edge cases
   - May require custom code for complex scenarios

4. **Migration Complexity**:
   - Complex to migrate from v0 or v1
   - Requires rewriting rather than refactoring
   - Significant effort for complex integrations

## Version Selection Guidelines

When implementing a new integration or migrating an existing one, consider the following guidelines:

### When to Use v0

- **Legacy Compatibility**: When maintaining backward compatibility is critical
- **Simple Integrations**: For very simple integrations with minimal logic
- **Temporary Solutions**: For quick, temporary implementations

### When to Use v1

- **Complex Logic**: For integrations with complex business logic
- **Type Safety**: When type safety is important
- **Maintainability**: For integrations that will be maintained long-term
- **Team Familiarity**: When the team is familiar with TypeScript and OOP

### When to Use CDK v2

- **Standardization**: For new integrations that follow standard patterns
- **Declarative Preference**: When a declarative approach is preferred
- **Reduced Boilerplate**: To minimize boilerplate code
- **Consistency**: To ensure consistency across integrations

## Proxy V0 vs Proxy V1

In addition to the differences in integration implementation approaches, there are significant differences between proxy v0 and proxy v1 in how they handle event delivery and response processing.

### Response Structure

#### Proxy V0

- Returns a single status code for the entire batch of events
- Uses a simple response structure with a single message and status
- Cannot differentiate between successful and failed events in a batch

```typescript
type DeliveryV0Response = {
  status: number;
  message: string;
  destinationResponse: any;
  statTags: object;
  authErrorCategory?: string;
};
```

#### Proxy V1

- Returns individual status codes for each event in a batch
- Uses an array of responses, one for each event
- Can differentiate between successful and failed events in a batch

```typescript
type DeliveryV1Response = {
  status: number;
  message: string;
  statTags?: object;
  destinationResponse?: any;
  authErrorCategory?: string;
  response: DeliveryJobState[];
};

type DeliveryJobState = {
  error: string;
  statusCode: number;
  metadata: ProxyMetdata;
};
```

### Batch Handling

#### Proxy V0

- All-or-nothing approach to batch processing
- If any event in a batch fails, the entire batch is retried
- No way to prevent problematic events from being batched again

#### Proxy V1

- Granular approach to batch processing
- Only failed events are retried, successful events are not
- Supports the `dontBatch` flag to prevent problematic events from being batched in future attempts

### Error Handling

#### Proxy V0

- Limited error information for batch failures
- Cannot provide specific error messages for individual events
- Relies on destination-specific error handling in the response handler

#### Proxy V1

- Detailed error information for each event in a batch
- Can provide specific error messages for individual events
- Supports destination-specific error extraction and status code mapping
- Uses strategies to handle different types of responses based on endpoint or event type

### Status Code Mapping

#### Proxy V0

- Maps destination response codes to a single HTTP status code
- Limited ability to differentiate between retryable and non-retryable errors

#### Proxy V1

- Maps destination response codes to individual HTTP status codes for each event
- Can differentiate between retryable (500, 429) and non-retryable (400) errors at the event level
- Provides more accurate information to rudder-server for retry decisions

### Implementation Examples

#### Proxy V0 Response Handler

```javascript
function responseHandler(response) {
  const { status } = response;

  if (isHttpStatusSuccess(status)) {
    return {
      status,
      message: 'Request processed successfully',
      destinationResponse: response,
    };
  }

  throw new Error(`Request failed with status: ${status}`);
}
```

#### Proxy V1 Response Handler

```javascript
function responseHandler(responseParams) {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const { status, response } = destinationResponse;
  const responseWithIndividualEvents = [];

  if (isHttpStatusSuccess(status)) {
    // Process individual events in the batch
    response.forEach((event, idx) => {
      const proxyOutput = {
        statusCode: 200,
        error: 'success',
        metadata: rudderJobMetadata[idx],
      };

      // Check for partial failures
      const { isAbortable, errorMsg } = checkIfEventIsAbortableAndExtractErrorMessage(event);
      if (isAbortable) {
        proxyOutput.statusCode = 400;
        proxyOutput.error = errorMsg;
      }

      responseWithIndividualEvents.push(proxyOutput);
    });

    return {
      status,
      message: 'Request processed successfully',
      response: responseWithIndividualEvents,
    };
  }

  // Handle batch failure
  throw new TransformerProxyError(
    `Error during response transformation`,
    status,
    { errorType: getDynamicErrorType(status) },
    destinationResponse,
    '',
    responseWithIndividualEvents,
  );
}
```

## Future Direction

The future direction of integration implementations in RudderStack Transformer is likely to favor CDK v2 for new integrations, with gradual migration of existing integrations from v0 and v1. The benefits of a declarative, consistent approach outweigh the learning curve and migration effort for most use cases.

Similarly, proxy v1 is preferred over proxy v0 for new integrations due to its superior handling of partial batch failures and more granular error reporting.

However, v0 and v1 will continue to be supported for backward compatibility and for integrations with complex requirements that are not well-suited to the declarative approach of CDK v2.

## Conclusion

The evolution of integration implementations in RudderStack Transformer from v0 to v1 to CDK v2 reflects a broader trend in software development toward more declarative, consistent, and maintainable approaches. Each version has its advantages and disadvantages, and the choice of which to use depends on the specific requirements and constraints of the integration.

By understanding the differences between these versions and following the migration guidelines, developers can make informed decisions about which approach to use for new integrations and how to migrate existing ones.
