# Rudder Test Destination - Proxy Implementation

This document explains how to use the proxy functionality with the `rudder_test` destination for testing various proxy scenarios.

## Overview

The `rudder_test` destination now supports both **Proxy v0** and **Proxy v1** implementations:

- **Proxy v0**: Simple proxy handling for single events with all-or-nothing error handling
- **Proxy v1**: Advanced proxy handling with batch processing and partial failure support

## Test Behavior Configuration

The proxy implementations reuse the existing `TestBehavior` interface properties:

```typescript
interface TestBehavior {
  statusCode: number;                    // Controls response status code
  errorMessage?: string;                 // Custom error message
  batchScenario?: string;               // v1 batch processing scenarios
  preventFutureBatching?: boolean;      // Sets dontBatch flag for failed events
  mutateDestinationConfig?: boolean;    // Config mutation testing
  replaceDestinationConfig?: boolean;   // Config replacement testing
}
```

## Proxy v0 Usage

### Basic Error Simulation

```javascript
// Simulate a 400 error
const testBehavior = {
  statusCode: 400,
  errorMessage: "Bad Request - Invalid data format"
};

// Simulate a 401 authentication error
const testBehavior = {
  statusCode: 401,
  errorMessage: "Authentication failed - Invalid API key"
};

// Simulate a 500 server error (retryable)
const testBehavior = {
  statusCode: 500,
  errorMessage: "Internal server error"
};
```

### Including Test Behavior in Requests

Include test behavior in the JSON body of your request:

```javascript
{
  "body": {
    "JSON": {
      "action": "upsert",
      "fields": { "name": "test" },
      "testBehavior": {
        "statusCode": 400,
        "errorMessage": "Custom error message"
      }
    }
  }
}
```

## Proxy v1 Usage

### Batch Scenarios

Proxy v1 supports several batch processing scenarios:

#### 1. Partial Failure (`partial_failure`)
Some events succeed, some fail (alternating pattern):

```javascript
const testBehavior = {
  statusCode: 400,                    // Status for failed events
  errorMessage: "Validation failed", // Message for failed events
  batchScenario: "partial_failure",
  preventFutureBatching: true        // Set dontBatch flag
};
```

#### 2. Complete Failure (`all_failure`)
All events in the batch fail:

```javascript
const testBehavior = {
  statusCode: 422,
  errorMessage: "Unprocessable entity",
  batchScenario: "all_failure",
  preventFutureBatching: true
};
```

#### 3. Authentication Error (`auth_error`)
Authentication failure affecting all events:

```javascript
const testBehavior = {
  statusCode: 401,
  errorMessage: "Invalid credentials",
  batchScenario: "auth_error"
};
```

#### 4. Mixed Status Codes (`mixed_status`)
Events get different status codes (200, 400, 500 rotation):

```javascript
const testBehavior = {
  batchScenario: "mixed_status"
};
```

#### 5. All Success (`all_success` or default)
All events succeed (default behavior):

```javascript
const testBehavior = {
  batchScenario: "all_success"
};
```

### Batch Request Example

```javascript
{
  "body": {
    "JSON_ARRAY": [
      {
        "action": "upsert",
        "fields": { "name": "user1" },
        "testBehavior": {
          "statusCode": 400,
          "errorMessage": "Custom validation error",
          "batchScenario": "partial_failure",
          "preventFutureBatching": true
        }
      },
      {
        "action": "upsert",
        "fields": { "name": "user2" }
      }
    ]
  }
}
```

## Testing Different Scenarios

### 1. Success Cases
```javascript
// All succeed (default)
const testBehavior = null; // or { statusCode: 200 }
```

### 2. Client Errors (4xx) - Non-retryable
```javascript
const testBehavior = {
  statusCode: 400,
  errorMessage: "Bad request"
};
```

### 3. Server Errors (5xx) - Retryable
```javascript
const testBehavior = {
  statusCode: 500,
  errorMessage: "Internal server error"
};
```

### 4. Authentication Errors
```javascript
const testBehavior = {
  statusCode: 401,
  errorMessage: "Unauthorized"
};
// or
const testBehavior = {
  statusCode: 403,
  errorMessage: "Forbidden"
};
```

### 5. Rate Limiting
```javascript
const testBehavior = {
  statusCode: 429,
  errorMessage: "Too many requests"
};
```

## Error Response Format

### Proxy v0 Response
```javascript
{
  "status": 400,
  "message": "Custom error message",
  "destinationResponse": { /* original response */ }
}
```

### Proxy v1 Response
```javascript
{
  "status": 207, // or appropriate batch status
  "message": "Request for RUDDER_TEST Processed Successfully",
  "destinationResponse": { /* original response */ },
  "response": [
    {
      "statusCode": 200,
      "metadata": { /* job metadata */ },
      "error": "success"
    },
    {
      "statusCode": 400,
      "metadata": { /* job metadata with dontBatch: true */ },
      "error": "{\"error\":\"Validation failed (Event 1)\",\"details\":\"Simulated partial failure for testing\"}"
    }
  ]
}
```

## Configuration

The destination uses these endpoints for testing:

```typescript
export const PROXY_ENDPOINTS = {
  RECORD: 'https://test.rudderstack.com/v1/record',
  BATCH: 'https://test.rudderstack.com/v1/batch',
  IDENTIFY: 'https://test.rudderstack.com/v1/identify',
  TRACK: 'https://test.rudderstack.com/v1/track',
};
```

## Testing Proxy Endpoints

### v0 Proxy Endpoint
```
POST /v0/destinations/rudder_test/proxy
```

### v1 Proxy Endpoint  
```
POST /v1/destinations/rudder_test/proxy
```

Both endpoints will automatically use the appropriate network handler and provide the expected response format for comprehensive proxy testing. 