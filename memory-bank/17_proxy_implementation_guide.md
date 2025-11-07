# Proxy Implementation Guide

This document provides a comprehensive guide on implementing proxy functionality for destinations in the RudderStack Transformer, with a focus on onboarding destinations to proxy v0 and proxy v1.

## Overview of Proxy Versions

RudderStack Transformer supports two versions of proxy implementations:

1. **Proxy v0**: The original implementation that handles batch requests with an all-or-nothing approach
2. **Proxy v1**: An improved implementation that provides granular handling of partial batch failures

## When to Use Proxy v0 vs Proxy v1

### Use Proxy v0 When:

- You're dealing with **non-batched payloads** that contain a single event or rudder-server job
- Each failure is unique to that specific event
- You don't need to handle partial failures within a batch
- The destination API doesn't support batch operations
- You need a simpler implementation with less complexity

### Use Proxy v1 When:

- You're handling **batched payloads** that require partial failure handling
- You need complex parsing of destination responses
- You need to stitch status codes back to corresponding job metadata so that rudder-server can take proper action
- You want to optimize retries by only retrying failed events instead of the entire batch
- The destination API supports batch operations with individual success/failure indicators
- You need to prevent problematic events from being batched in future attempts using the `dontBatch` flag

**Important**: Proxy v1 is a must when handling batched payloads that require partial failure handling. It provides the necessary infrastructure to parse complex destination responses and associate the appropriate status codes with each event in the batch.

## Proxy Architecture

The proxy functionality in RudderStack Transformer follows a layered architecture:

1. **Routes Layer**: Handles routing of proxy requests to the appropriate endpoints
2. **Controller Layer**: Processes proxy requests and calls the appropriate service
3. **Service Layer**: Handles delivery of proxy requests using the appropriate network handler
4. **Network Handler Factory**: Selects the appropriate network handler for a destination
5. **Destination-Specific Network Handlers**: Implement methods for preparing requests, sending requests, and handling responses

The flow of a proxy request through the system is as follows:

1. The request is received at `/v0/destinations/:destination/proxy` or `/v1/destinations/:destination/proxy`
2. The controller processes the request and calls the service's `deliver` method
3. The service uses the network handler factory to get the appropriate network handler
4. The network handler processes the request and sends it to the destination
5. The network handler processes the response and returns it to the service
6. The service returns the response to the controller
7. The controller returns the response to the client

### Network Handler Factory

The Network Handler Factory is a key component in the proxy architecture. It's responsible for selecting the appropriate network handler for a destination based on the version (v0 or v1) and destination type.

```javascript
// From src/adapters/networkHandlerFactory.js
const getNetworkHandler = (type, version) => {
  let handlerVersion = version;
  let NetworkHandler = handlers[version][type] || handlers.generic;
  if (version === 'v1' && NetworkHandler === handlers.generic) {
    NetworkHandler = handlers.v0[type] || handlers.generic;
    handlerVersion = 'v0';
  }
  const networkHandler = new NetworkHandler();
  return { networkHandler, handlerVersion };
};
```

The factory:

- First tries to find a network handler for the specified destination and version
- Falls back to a generic handler if no specific handler is found
- For v1 requests, falls back to v0 handlers if no v1 handler is found
- Returns both the network handler and the version of the handler used

This fallback mechanism is crucial for backward compatibility, allowing v1 requests to be processed by v0 handlers when necessary.

### Generic Network Handler

The Generic Network Handler serves as a fallback for destinations that don't have a specific network handler. It provides a basic implementation of the network handler interface:

```javascript
// From src/adapters/networkhandler/genericNetworkHandler.js
function networkHandler() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
}
```

The generic handler:

- Uses the common `proxyRequest` and `prepareProxyRequest` functions from the network adapter
- Uses the common `processAxiosResponse` function from the networkUtils adapter
- Implements a basic `responseHandler` that handles success and error responses

### Error Handling

The proxy implementation uses several error types to handle different error scenarios:

1. **NetworkError**: Used for general network errors
2. **TransformerProxyError**: Used specifically for proxy errors, with support for v1 response format
3. **RetryableError**: Used for errors that should be retried
4. **AbortedError**: Used for errors that should not be retried

The error types are mapped to HTTP status codes to help rudder-server decide how to handle the error:

```javascript
// From src/adapters/utils/networkUtils.js
const getDynamicErrorType = (statusCode) => {
  if (isHttpStatusRetryable(statusCode)) {
    return tags.ERROR_TYPES.RETRYABLE;
  }
  if (statusCode === 429) {
    return tags.ERROR_TYPES.THROTTLED;
  }
  return tags.ERROR_TYPES.ABORTED;
};
```

The error types are defined in `src/v0/util/tags.js`:

```javascript
const ERROR_TYPES = {
  INSTRUMENTATION: 'instrumentation',
  CONFIGURATION: 'configuration',
  THROTTLED: 'throttled',
  RETRYABLE: 'retryable',
  ABORTED: 'aborted',
  OAUTH_SECRET: 'oAuthSecret',
  UNSUPPORTED: 'unsupported',
  REDIS: 'redis',
  FILTERED: 'filtered',
};
```

These error types help rudder-server decide whether to retry the request or abort it:

- **RETRYABLE**: The request should be retried (e.g., 500 status codes)
- **THROTTLED**: The request should be retried after a delay (e.g., 429 status codes)
- **ABORTED**: The request should not be retried (e.g., 400 status codes)

### Network Adapter

The Network Adapter (`src/adapters/network.js`) provides common functions for making HTTP requests and handling responses:

```javascript
// From src/adapters/network.js
const proxyRequest = async (request, destType) => {
  const { metadata } = request;
  const { endpoint, data, method, params, headers } = prepareProxyRequest(request);
  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method,
  };
  const response = await httpSend(requestOptions, {
    feature: 'proxy',
    destType,
    metadata,
  });
  return response;
};
```

The `prepareProxyRequest` function extracts the necessary information from the request:

```javascript
const prepareProxyRequest = (request) => {
  const { body, method, params, endpoint, headers, destinationConfig: config } = request;
  const { payload, payloadFormat } = getPayloadData(body);
  const data = extractPayloadForFormat(payload, payloadFormat);
  // Ref: https://github.com/rudderlabs/rudder-server/blob/master/router/network.go#L164
  headers['User-Agent'] = 'RudderLabs';
  return removeUndefinedValues({
    endpoint,
    data,
    params,
    headers,
    method,
    config,
  });
};
```

### Response Processing

The `processAxiosResponse` function in `src/adapters/utils/networkUtils.js` processes the response from the destination and converts it to a standard format:

```javascript
// From src/adapters/utils/networkUtils.js
const processAxiosResponse = (clientResponse) => {
  if (!clientResponse.success) {
    const { response, code } = clientResponse.response;
    // node internal http client failure cases
    if (!response && code) {
      const nodeClientError = nodeSysErrorToStatus(code);
      return {
        response: nodeClientError.message,
        status: nodeClientError.status,
      };
    }
    // non 2xx status handling for axios response
    if (response) {
      const { data, status, headers } = response;
      return {
        response: data || '',
        status: status || 500,
        ...(isDefinedAndNotNullAndNotEmpty(headers) ? { headers } : {}),
      };
    }
    // (edge case) response and code is not present
    return {
      response: clientResponse?.response?.data || '',
      status: getErrorStatusCode(clientResponse, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR),
    };
  }
  // success(2xx) axios response
  const { data, status, headers } = clientResponse.response;
  return {
    response: data || '',
    status: status || 500,
    ...(isDefinedAndNotNullAndNotEmpty(headers) ? { headers } : {}),
  };
};
```

This function handles various response scenarios, including success responses, error responses, and node system errors.

### Adaptation Between V0 and V1

The `NativeIntegrationDestinationService.deliver` method in `src/services/destination/nativeIntegration.ts` includes adaptation logic to handle cases where a v1 request is processed by a v0 handler:

```typescript
// From src/services/destination/nativeIntegration.ts
public async deliver(
  deliveryRequest: ProxyRequest,
  destinationType: string,
  _requestMetadata: NonNullable<unknown>,
  version: string,
): Promise<DeliveryV0Response | DeliveryV1Response> {
  try {
    const { networkHandler, handlerVersion } = networkHandlerFactory.getNetworkHandler(
      destinationType,
      version,
    );

    const rawProxyResponse = await networkHandler.proxy(deliveryRequest, destinationType);
    const processedProxyResponse = networkHandler.processAxiosResponse(rawProxyResponse);

    let rudderJobMetadata =
      version.toLowerCase() === 'v1'
        ? (deliveryRequest as ProxyV1Request).metadata
        : (deliveryRequest as ProxyV0Request).metadata;

    if (version.toLowerCase() === 'v1' && handlerVersion.toLowerCase() === 'v0') {
      rudderJobMetadata = rudderJobMetadata[0];
    }

    const responseParams = {
      destinationResponse: processedProxyResponse,
      rudderJobMetadata,
      destinationRequest: deliveryRequest,
      destType: destinationType,
    };

    let responseProxy = networkHandler.responseHandler(responseParams);

    // Adaption Logic for V0 to V1
    if (handlerVersion.toLowerCase() === 'v0' && version.toLowerCase() === 'v1') {
      const v0Response = responseProxy as DeliveryV0Response;
      const jobStates = (deliveryRequest as ProxyV1Request).metadata.map(
        (metadata) => ({
          error: JSON.stringify(
            v0Response.destinationResponse?.response === undefined
              ? v0Response.destinationResponse
              : v0Response.destinationResponse?.response,
          ),
          statusCode: v0Response.status,
          metadata,
        }) as DeliveryJobState,
      );

      responseProxy = {
        response: jobStates,
        status: v0Response.status,
        message: v0Response.message,
        authErrorCategory: v0Response.authErrorCategory,
      } as DeliveryV1Response;
    }

    return responseProxy;
  } catch (err: any) {
    // Error handling logic
  }
}
```

This adaptation logic ensures backward compatibility by:

1. Using the appropriate network handler based on the version and destination type
2. Adjusting the metadata format based on the handler version
3. Converting v0 responses to v1 format when necessary

This allows v1 requests to be processed by v0 handlers, which is important for destinations that don't have a v1 handler yet.

## Proxy v0 Implementation

### Overview

Proxy v0 is the original implementation of the proxy functionality in RudderStack Transformer. It handles batch requests with an all-or-nothing approach, meaning that if any event in a batch fails, the entire batch is retried.

### Response Structure

Proxy v0 returns a single status code for the entire batch of events:

```typescript
type DeliveryV0Response = {
  status: number;
  message: string;
  destinationResponse: any;
  statTags: object;
  authErrorCategory?: string;
};
```

### Onboarding a Destination to Proxy v0

#### Step 1: Create the Network Handler

Create a new file at `src/v0/destinations/{destination}/networkHandler.js` with the following structure:

```javascript
const { NetworkError } = require('@rudderstack/integrations-lib');
const { isHttpStatusSuccess } = require('../../util/index');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { DESTINATION } = require('./config');
const tags = require('../../util/tags');

// Response handler function
const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
  const message = `Request for ${DESTINATION} Processed Successfully`;
  const { response, status } = destinationResponse;

  // If the response from destination is not a success case, build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `Request failed for ${DESTINATION} with status: ${status}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }

  // Check for application-level errors
  if (
    !!response &&
    response.message !== 'success' &&
    response.errors &&
    response.errors.length > 0
  ) {
    throw new NetworkError(
      `Request failed for ${DESTINATION} with status: ${status}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }

  return {
    status,
    message,
    destinationResponse,
  };
};

function networkHandler() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.prepareProxy = prepareProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
}

module.exports = {
  networkHandler,
};
```

#### Step 2: Implement Error Handling

The key to proxy v0 is handling errors at the batch level. If any event in the batch fails, the entire batch is considered failed and will be retried.

```javascript
// Example: Handling errors in proxy v0
if (!isHttpStatusSuccess(status)) {
  throw new NetworkError(
    `Request failed for ${DESTINATION} with status: ${status}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
  );
}
```

#### Step 3: Handle Authentication Errors

For authentication errors, it's important to set the appropriate error type to help rudder-server handle the error appropriately:

```javascript
// Example: Handling authentication errors in proxy v0
if (status === 401 || status === 403) {
  throw new NetworkError(
    `Authentication failed for ${DESTINATION}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: 'auth',
    },
    destinationResponse,
  );
}
```

#### Step 4: Test the Implementation

Create tests for your proxy v0 implementation to ensure it handles various scenarios correctly:

1. **Success Case**: All events in the batch succeed
2. **Failure Case**: The batch fails due to an error
3. **Authentication Error Case**: The request fails due to authentication issues

### Best Practices for Proxy v0

1. **Error Handling**:

   - Provide clear error messages that include the destination name and status code
   - Use appropriate error types to help rudder-server handle errors correctly

2. **Response Parsing**:

   - Handle various response formats from the destination
   - Check for application-level errors even if the HTTP status code indicates success

3. **Status Code Mapping**:
   - Map destination-specific error codes to appropriate HTTP status codes
   - Use 400 for non-retryable errors, 429 for rate limiting errors, and 500 for retryable errors

## Proxy v1 Advantages

Proxy v1 offers several advantages over proxy v0:

- **Granular Error Reporting**: Individual status codes and error messages for each event in a batch
- **Selective Retries**: Ability to retry only failed events rather than the entire batch
- **Batch Optimization**: Prevention of problematic events from being batched in future attempts
- **Destination-Specific Handling**: Custom logic for interpreting responses from different destinations
- **Status Code Mapping**: Converting destination-specific error codes to standard HTTP status codes

## Onboarding a Destination to Proxy v1

### Prerequisites

Before implementing proxy v1 for a destination, ensure you have:

1. A good understanding of the destination's API
2. Knowledge of how the destination handles batch requests and errors
3. Familiarity with the RudderStack Transformer codebase, particularly the proxy v1 architecture

### Step 1: Create the Network Handler

Create a new file at `src/v1/destinations/{destination}/networkHandler.js` or `.ts` with the following structure:

```typescript
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import { TAG_NAMES } from '../../../v0/util/tags';
import { isHttpStatusSuccess } from '../../../v0/util';

// Optional: Import any destination-specific constants or utilities
// import { BULK_ENDPOINTS } from './config';

// Response handler function
const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
  const { status, response } = destinationResponse;
  const responseWithIndividualEvents = [];

  if (isHttpStatusSuccess(status)) {
    // Process successful responses
    // This is where you'll implement destination-specific logic for handling partial failures

    // Example implementation for a simple case:
    rudderJobMetadata.forEach((metadata) => {
      responseWithIndividualEvents.push({
        statusCode: 200,
        metadata,
        error: 'success',
      });
    });

    return {
      status,
      message: `[DESTINATION_NAME] Request Processed Successfully`,
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }

  // Handle error responses
  // Example implementation for a simple case:
  const errorMessage = response?.error?.message || 'unknown error format';

  rudderJobMetadata.forEach((metadata) => {
    responseWithIndividualEvents.push({
      statusCode: status,
      metadata,
      error: errorMessage,
    });
  });

  throw new TransformerProxyError(
    `DESTINATION_NAME: Error encountered in transformer proxy V1`,
    status,
    {
      [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    '',
    responseWithIndividualEvents,
  );
};

// Network handler constructor
function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

// Export the network handler
module.exports = { networkHandler };
// For TypeScript: export { networkHandler };
```

### Step 2: Implement Partial Batch Failure Handling

The key to proxy v1 is handling partial batch failures. Depending on the destination's API, you'll need to implement custom logic to detect and handle partial failures.

#### Example 1: Destination with Individual Success/Failure Indicators

If the destination's API returns an array of results with individual success/failure indicators:

```typescript
if (isHttpStatusSuccess(status)) {
  // Assuming response is an array of results with success/error indicators
  response.forEach((result, idx) => {
    const proxyOutput = {
      statusCode: 200,
      error: 'success',
      metadata: rudderJobMetadata[idx],
    };

    // Check if this specific result has an error
    if (result.error || result.status === 'error') {
      proxyOutput.statusCode = 400; // or appropriate error code
      proxyOutput.error = result.errorMessage || 'Failed to process event';
    }

    responseWithIndividualEvents.push(proxyOutput);
  });

  return {
    status,
    message: `[DESTINATION_NAME] Request Processed Successfully`,
    destinationResponse,
    response: responseWithIndividualEvents,
  };
}
```

#### Example 2: Destination with Separate Success and Error Arrays

If the destination's API returns separate arrays for successful and failed events:

```typescript
if (isHttpStatusSuccess(status)) {
  const { successful, failed } = response;

  // Create a map of failed events by ID for quick lookup
  const failedMap = {};
  failed.forEach((failedEvent) => {
    failedMap[failedEvent.id] = failedEvent.error;
  });

  // Process each event in the batch
  rudderJobMetadata.forEach((metadata, idx) => {
    const eventId = destinationRequest.body.JSON_ARRAY[idx].id;

    if (failedMap[eventId]) {
      // This event failed
      responseWithIndividualEvents.push({
        statusCode: 400, // or appropriate error code
        metadata,
        error: failedMap[eventId],
      });
    } else {
      // This event succeeded
      responseWithIndividualEvents.push({
        statusCode: 200,
        metadata,
        error: 'success',
      });
    }
  });

  return {
    status,
    message: `[DESTINATION_NAME] Request Processed Successfully`,
    destinationResponse,
    response: responseWithIndividualEvents,
  };
}
```

#### Example 3: Using the Strategy Pattern

For more complex destinations with different endpoints that require different handling logic:

```typescript
// In networkHandler.js
import { BaseStrategy } from './strategies/base';
import { TrackStrategy } from './strategies/track';
import { IdentifyStrategy } from './strategies/identify';
import { GenericStrategy } from './strategies/generic';

const strategyRegistry = {
  [TrackStrategy.name]: new TrackStrategy(),
  [IdentifyStrategy.name]: new IdentifyStrategy(),
  [GenericStrategy.name]: new GenericStrategy(),
};

const getResponseStrategy = (endpoint) => {
  if (endpoint.includes('/track')) {
    return strategyRegistry[TrackStrategy.name];
  } else if (endpoint.includes('/identify')) {
    return strategyRegistry[IdentifyStrategy.name];
  }
  return strategyRegistry[GenericStrategy.name];
};

const responseHandler = (responseParams) => {
  const { destinationRequest } = responseParams;
  const strategy = getResponseStrategy(destinationRequest.endpoint);
  return strategy.handleResponse(responseParams);
};
```

```typescript
// In strategies/base.ts
abstract class BaseStrategy {
  handleResponse(responseParams) {
    const { destinationResponse } = responseParams;
    const { status } = destinationResponse;

    if (!isHttpStatusSuccess(status)) {
      return this.handleError(responseParams);
    }

    return this.handleSuccess(responseParams);
  }

  abstract handleSuccess(responseParams): any;
  abstract handleError(responseParams): any;
}

export { BaseStrategy };
```

```typescript
// In strategies/track.ts
import { BaseStrategy } from './base';

class TrackStrategy extends BaseStrategy {
  handleSuccess(responseParams) {
    // Implement track-specific success handling
  }

  handleError(responseParams) {
    // Implement track-specific error handling
  }
}

export { TrackStrategy };
```

### Step 3: Implement the DontBatch Flag

One of the key features of proxy v1 is the ability to prevent problematic events from being batched in future attempts using the `dontBatch` flag:

```typescript
// Example: Setting dontBatch flag for events that should not be batched in future attempts
for (const metadata of rudderJobMetadata) {
  metadata.dontBatch = true;
  responseWithIndividualEvents.push({
    statusCode: 500,
    metadata,
    error: errorMessage,
  });
}
```

### Step 4: Handle Authentication Errors

For authentication errors, it's important to set the `authErrorCategory` to help rudder-server handle the error appropriately:

```typescript
// Example: Handling authentication errors
if (status === 401 || status === 403) {
  throw new TransformerProxyError(
    `DESTINATION_NAME: Authentication error`,
    status,
    {
      [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    'auth', // authErrorCategory
    responseWithIndividualEvents,
  );
}
```

### Step 5: Test the Implementation

Create tests for your proxy v1 implementation to ensure it handles various scenarios correctly:

1. **Success Case**: All events in the batch succeed
2. **Partial Failure Case**: Some events in the batch succeed, some fail
3. **Complete Failure Case**: All events in the batch fail
4. **Authentication Error Case**: The request fails due to authentication issues

Example test structure:

```typescript
// In test/integrations/destinations/{destination}/dataDelivery/data.ts
export const data: ProxyV1TestData[] = [
  {
    id: 'destination_v1_business_scenario_1',
    name: destType,
    description: '[Proxy v1 API] :: Test for a valid record request',
    successCriteria: 'Should return 200 with success response',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            headers,
            params: {},
            JSON: {},
            JSON_ARRAY: {
              batch: JSON.stringify([
                { id: 'event1', properties: { test: '1' } },
                { id: 'event2', properties: { test: '2' } },
              ]),
            },
            endpoint: updateEndpoint,
          },
          [generateMetadata(1), generateMetadata(2)],
        ),
      },
      response: {
        status: 200,
        body: {
          successful: [{ id: 'event1' }, { id: 'event2' }],
          failed: [],
        },
      },
    },
    output: {
      status: 200,
      message: '[DESTINATION_NAME] Request Processed Successfully',
      response: [
        {
          statusCode: 200,
          error: 'success',
          metadata: generateMetadata(1),
        },
        {
          statusCode: 200,
          error: 'success',
          metadata: generateMetadata(2),
        },
      ],
    },
  },
  // Add more test cases for partial failures, complete failures, etc.
];
```

## Best Practices

### 1. Error Handling

- **Be Specific**: Provide specific error messages for each failed event
- **Status Codes**: Use appropriate status codes (400 for non-retryable errors, 500 for retryable errors)
- **DontBatch Flag**: Set the `dontBatch` flag for events that should not be batched in future attempts

### 2. Response Parsing

- **Robust Parsing**: Handle various response formats from the destination
- **Fallbacks**: Provide fallbacks for unexpected response formats
- **Logging**: Log detailed information about the response for debugging

### 3. Batch Processing

- **Maintain Order**: Ensure the order of events in the response matches the order in the request
- **Handle Missing Events**: Handle cases where the destination response doesn't include all events
- **Validate Counts**: Validate that the number of events in the response matches the number in the request

### 4. Strategy Pattern

- **Use Strategies**: Use the Strategy pattern for destinations with different endpoints that require different handling logic
- **Base Strategy**: Create a base strategy class with common functionality
- **Specific Strategies**: Create specific strategies for different endpoints or event types

## Common Pitfalls

### 1. Incorrect Error Mapping

**Problem**: Mapping destination-specific error codes to incorrect HTTP status codes

**Solution**: Understand the destination's error codes and map them appropriately:

- 400: Non-retryable errors (invalid data, validation errors)
- 429: Rate limiting errors (retry after a delay)
- 500: Retryable errors (server errors, temporary failures)

### 2. Missing Events in Response

**Problem**: The destination response doesn't include all events from the request

**Solution**: Handle missing events by assuming they succeeded or failed based on the context:

```typescript
// Example: Handling missing events in the response
const responseMap = {};
response.forEach((result) => {
  responseMap[result.id] = result;
});

rudderJobMetadata.forEach((metadata, idx) => {
  const eventId = destinationRequest.body.JSON_ARRAY[idx].id;

  if (responseMap[eventId]) {
    // Process the event based on the response
  } else {
    // Handle missing event (assume success or failure)
    responseWithIndividualEvents.push({
      statusCode: 200, // or appropriate status code
      metadata,
      error: 'Event not found in response, assuming success',
    });
  }
});
```

### 3. Inconsistent Response Formats

**Problem**: The destination's response format varies depending on the endpoint or error type

**Solution**: Use the Strategy pattern to handle different response formats:

```typescript
// Example: Using different strategies for different endpoints
const getResponseStrategy = (endpoint, response) => {
  if (endpoint.includes('/track')) {
    return new TrackStrategy();
  } else if (endpoint.includes('/identify')) {
    return new IdentifyStrategy();
  } else if (response.error && response.error.type === 'validation') {
    return new ValidationErrorStrategy();
  }
  return new GenericStrategy();
};
```

## Migrating from Proxy v0 to Proxy v1

Migrating a destination from proxy v0 to proxy v1 involves creating a new network handler that supports the v1 response format and handles partial batch failures. Here's a step-by-step guide for migrating:

### Step 1: Create a New Network Handler

Create a new file at `src/v1/destinations/{destination}/networkHandler.js` or `.ts` based on the existing v0 implementation:

```typescript
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import { TAG_NAMES } from '../../../v0/util/tags';
import { isHttpStatusSuccess } from '../../../v0/util';

// Import any destination-specific constants or utilities from the v0 implementation
import { DESTINATION } from '../../v0/destinations/{destination}/config';

// Response handler function
const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
  const { status, response } = destinationResponse;
  const responseWithIndividualEvents = [];

  if (isHttpStatusSuccess(status)) {
    // Process successful responses
    // This is where you'll implement destination-specific logic for handling partial failures

    // Example implementation for a simple case:
    rudderJobMetadata.forEach((metadata) => {
      responseWithIndividualEvents.push({
        statusCode: 200,
        metadata,
        error: 'success',
      });
    });

    return {
      status,
      message: `[${DESTINATION}] Request Processed Successfully`,
      response: responseWithIndividualEvents,
    };
  }

  // Handle error responses
  // Example implementation for a simple case:
  const errorMessage = response?.error?.message || 'unknown error format';

  rudderJobMetadata.forEach((metadata) => {
    responseWithIndividualEvents.push({
      statusCode: status,
      metadata,
      error: errorMessage,
    });
  });

  throw new TransformerProxyError(
    `${DESTINATION}: Error encountered in transformer proxy V1`,
    status,
    {
      [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    '',
    responseWithIndividualEvents,
  );
};

// Network handler constructor
function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

// Export the network handler
module.exports = { networkHandler };
// For TypeScript: export { networkHandler };
```

### Step 2: Adapt the Response Handler

Modify the response handler to handle partial batch failures based on the destination's API response format. This is the most important part of the migration, as it's where you'll implement the logic to detect and handle partial failures.

### Step 3: Use TransformerProxyError

Replace `NetworkError` with `TransformerProxyError` to support the v1 response format:

```typescript
// v0 implementation
throw new NetworkError(
  `Request failed for ${DESTINATION} with status: ${status}`,
  status,
  {
    [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
  },
  destinationResponse,
);

// v1 implementation
throw new TransformerProxyError(
  `${DESTINATION}: Error encountered in transformer proxy V1`,
  status,
  {
    [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
  },
  destinationResponse,
  '',
  responseWithIndividualEvents,
);
```

The key difference is that `TransformerProxyError` includes a `response` parameter that contains the individual event responses.

### Step 4: Test the Implementation

Create tests for your proxy v1 implementation to ensure it handles various scenarios correctly, including partial batch failures.

### Step 5: Update Documentation

Update the documentation to reflect the new proxy v1 implementation and its benefits.

## Conclusion

Implementing proxy v1 for a destination requires careful consideration of how the destination handles batch requests and errors. By following this guide, you can create a robust proxy v1 implementation that provides granular handling of partial batch failures, improving the reliability and efficiency of event delivery.

The key benefits of migrating from proxy v0 to proxy v1 include:

1. **Granular Error Reporting**: Individual status codes and error messages for each event in a batch
2. **Selective Retries**: Ability to retry only failed events rather than the entire batch
3. **Batch Optimization**: Prevention of problematic events from being batched in future attempts
4. **Destination-Specific Handling**: Custom logic for interpreting responses from different destinations

Remember that each destination is unique, and you may need to adapt these guidelines to fit the specific requirements of the destination you're working with. Always refer to the destination's API documentation and test your implementation thoroughly to ensure it handles all possible scenarios correctly.
