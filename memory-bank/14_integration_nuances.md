# Integration Nuances and Edge Cases

This document focuses on the special handling requirements, edge cases, and performance considerations for different integrations in the RudderStack Transformer.

## Common Integration Nuances

### 1. Data Type Handling

Many integrations require special handling for different data types:

#### String Length Limitations

```typescript
// Example: Limiting string length for a property
if (typeof property === 'string' && property.length > MAX_STRING_LENGTH) {
  property = property.substring(0, MAX_STRING_LENGTH);
}
```

**Affected Integrations**:

- Mixpanel: Properties must be shorter than 255 characters
- Google Analytics: Custom dimensions limited to 150 bytes
- Facebook Pixel: Parameter values limited to 1000 characters

#### Nested Object Depth

```typescript
// Example: Checking nested object depth
function checkNestedDepth(obj, maxDepth = 2) {
  if (typeof obj !== 'object' || obj === null) return 0;

  let maxNestedDepth = 0;
  Object.values(obj).forEach((value) => {
    if (typeof value === 'object' && value !== null) {
      const nestedDepth = checkNestedDepth(value, maxDepth) + 1;
      maxNestedDepth = Math.max(maxNestedDepth, nestedDepth);
    }
  });

  return maxNestedDepth;
}

if (checkNestedDepth(properties) > MAX_NESTED_DEPTH) {
  // Handle excessive nesting
}
```

**Affected Integrations**:

- Mixpanel: Maximum nesting depth of 3
- Amplitude: Maximum nesting depth of 40
- Segment: Maximum nesting depth of 20

#### Array Size Limitations

```typescript
// Example: Limiting array size
if (Array.isArray(property) && property.length > MAX_ARRAY_LENGTH) {
  property = property.slice(0, MAX_ARRAY_LENGTH);
}
```

**Affected Integrations**:

- Mixpanel: Arrays must have fewer than 255 elements
- Amplitude: Arrays limited to 1000 elements
- Google Analytics: Arrays limited to 200 elements

### 2. Rate Limiting Handling

Different integrations have different rate limiting requirements:

#### Simple Retry Logic

```typescript
// Example: Simple retry with exponential backoff
async function sendWithRetry(payload, maxRetries = 3) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await sendRequest(payload);
      return response;
    } catch (error) {
      if (error.status === 429) {
        // Too Many Requests
        retries++;
        const delay = Math.pow(2, retries) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error; // Non-rate-limiting error
      }
    }
  }

  throw new Error('Max retries exceeded');
}
```

**Affected Integrations**:

- Amplitude: 1000 events per second
- Segment: 50 requests per second
- HubSpot: 100 requests per 10 seconds

#### Batch Size Adjustments

```typescript
// Example: Adjusting batch size based on payload size
function optimizeBatchSize(events, maxBatchSize, maxPayloadSize) {
  const batches = [];
  let currentBatch = [];
  let currentSize = 0;

  events.forEach((event) => {
    const eventSize = JSON.stringify(event).length;

    if (currentBatch.length >= maxBatchSize || currentSize + eventSize > maxPayloadSize) {
      batches.push(currentBatch);
      currentBatch = [event];
      currentSize = eventSize;
    } else {
      currentBatch.push(event);
      currentSize += eventSize;
    }
  });

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}
```

**Affected Integrations**:

- Iterable: Maximum batch size of 1000 events, 30KB per event
- Braze: Maximum batch size of 75 events
- Mixpanel: Maximum payload size of 2MB

### 3. Authentication Handling

Different integrations require different authentication methods:

#### API Key Authentication

```typescript
// Example: API key in header
headers['X-API-Key'] = CONFIG.apiKey;

// Example: API key in query parameter
endpoint = `${baseUrl}/track?api_key=${CONFIG.apiKey}`;

// Example: API key in request body
payload.api_key = CONFIG.apiKey;
```

**Affected Integrations**:

- Amplitude: API key in request body
- Mixpanel: API key in request body
- Segment: API key in Basic Auth header

#### OAuth Authentication

```typescript
// Example: OAuth token in header
headers['Authorization'] = `Bearer ${CONFIG.accessToken}`;

// Example: Refreshing OAuth token
async function refreshToken() {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: JSON.stringify({
      client_id: CONFIG.clientId,
      client_secret: CONFIG.clientSecret,
      refresh_token: CONFIG.refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  return data.access_token;
}
```

**Affected Integrations**:

- HubSpot: OAuth token in header
- Salesforce: OAuth token in header
- Google Analytics: OAuth token in header

#### Custom Authentication

```typescript
// Example: Custom authentication header
headers['X-Custom-Auth'] = generateAuthHeader(CONFIG.apiKey, CONFIG.apiSecret);

// Example: Generating a custom auth header
function generateAuthHeader(apiKey, apiSecret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac('sha256', apiSecret).update(`${apiKey}${timestamp}`).digest('hex');

  return `${apiKey}:${timestamp}:${signature}`;
}
```

**Affected Integrations**:

- Intercom: Custom HMAC-based authentication
- Klaviyo: Custom authentication with API key and timestamp
- Braze: Custom authentication with API key and app ID

## Specific Integration Edge Cases

### 1. Mixpanel

#### Property Limitations

- Properties must be shorter than 255 characters
- Nested objects must have fewer than 255 keys
- Maximum nesting depth of 3
- Arrays must have fewer than 255 elements

```typescript
function validateMixpanelProperties(properties) {
  const validatedProperties = {};

  Object.entries(properties).forEach(([key, value]) => {
    // Truncate long keys
    const validKey = key.substring(0, 255);

    // Handle different value types
    if (typeof value === 'string') {
      validatedProperties[validKey] = value.substring(0, 255);
    } else if (Array.isArray(value)) {
      validatedProperties[validKey] = value.slice(0, 255);
    } else if (typeof value === 'object' && value !== null) {
      // Check nesting depth
      if (checkNestedDepth(value) <= 2) {
        // Max depth of 3 including this level
        validatedProperties[validKey] = validateMixpanelProperties(value);
      } else {
        validatedProperties[validKey] = JSON.stringify(value).substring(0, 255);
      }
    } else {
      validatedProperties[validKey] = value;
    }
  });

  return validatedProperties;
}
```

#### Special Events

Mixpanel has special handling for certain events:

- `$identify`: Used for user identification
- `$set`: Used to set user properties
- `$set_once`: Used to set user properties only once
- `$add`: Used to increment numeric properties
- `$append`: Used to append to list properties
- `$union`: Used to add values to list properties without duplicates
- `$remove`: Used to remove values from list properties
- `$unset`: Used to remove properties

```typescript
// Example: Special handling for $set event
if (event.event === '$set') {
  payload.update_operations = {
    $set: event.properties,
  };
} else if (event.event === '$set_once') {
  payload.update_operations = {
    $set_once: event.properties,
  };
}
```

### 2. Amplitude

#### User Property Operations

Amplitude supports various user property operations:

- `$set`: Set user properties
- `$setOnce`: Set user properties only once
- `$add`: Add to numeric properties
- `$append`: Append to list properties
- `$prepend`: Prepend to list properties
- `$unset`: Remove properties

```typescript
// Example: Handling user property operations
function processUserProperties(event) {
  const userProperties = {};

  if (event.properties.$set) {
    userProperties.$set = event.properties.$set;
  }

  if (event.properties.$setOnce) {
    userProperties.$setOnce = event.properties.$setOnce;
  }

  if (event.properties.$add) {
    userProperties.$add = event.properties.$add;
  }

  // Add other operations

  return userProperties;
}
```

#### Revenue Tracking

Amplitude has special handling for revenue events:

```typescript
// Example: Revenue event handling
function processRevenueEvent(event) {
  const revenueProperties = {
    productId: event.properties.productId,
    price: event.properties.price,
    quantity: event.properties.quantity || 1,
    revenueType: event.properties.revenueType,
    revenue: event.properties.revenue || event.properties.price * (event.properties.quantity || 1),
  };

  return {
    event_type: 'revenue_amount',
    user_id: event.userId,
    device_id: event.anonymousId,
    event_properties: event.properties,
    revenue_properties: revenueProperties,
  };
}
```

### 3. Google Analytics

#### Custom Dimensions and Metrics

Google Analytics has special handling for custom dimensions and metrics:

```typescript
// Example: Custom dimensions and metrics
function processCustomDimensionsAndMetrics(properties) {
  const customDimensions = {};
  const customMetrics = {};

  Object.entries(properties).forEach(([key, value]) => {
    if (key.startsWith('dimension') && /^dimension\d+$/.test(key)) {
      const dimensionIndex = key.replace('dimension', '');
      customDimensions[`cd${dimensionIndex}`] = String(value).substring(0, 150);
    } else if (key.startsWith('metric') && /^metric\d+$/.test(key)) {
      const metricIndex = key.replace('metric', '');
      customMetrics[`cm${metricIndex}`] = Number(value);
    }
  });

  return { customDimensions, customMetrics };
}
```

#### Hit Types

Google Analytics supports different hit types:

- `pageview`: Page view tracking
- `screenview`: Screen view tracking
- `event`: Event tracking
- `transaction`: E-commerce transaction tracking
- `item`: E-commerce item tracking
- `social`: Social interaction tracking
- `exception`: Exception tracking
- `timing`: User timing tracking

```typescript
// Example: Hit type handling
function processHitType(event) {
  switch (event.type) {
    case 'page':
      return {
        t: 'pageview',
        dp: event.properties.path,
        dt: event.properties.title,
      };
    case 'track':
      return {
        t: 'event',
        ec: event.properties.category || 'All',
        ea: event.event,
        el: event.properties.label,
        ev: event.properties.value,
      };
    case 'screen':
      return {
        t: 'screenview',
        cd: event.properties.name,
      };
    // Handle other hit types
    default:
      return {
        t: 'event',
        ec: 'All',
        ea: event.event,
      };
  }
}
```

### 4. Facebook Pixel

#### Standard Events

Facebook Pixel has a set of standard events:

- `PageView`: Page view tracking
- `ViewContent`: Content view tracking
- `Search`: Search tracking
- `AddToCart`: Add to cart tracking
- `AddToWishlist`: Add to wishlist tracking
- `InitiateCheckout`: Checkout initiation tracking
- `AddPaymentInfo`: Payment info tracking
- `Purchase`: Purchase tracking
- `Lead`: Lead tracking
- `CompleteRegistration`: Registration tracking

```typescript
// Example: Standard event handling
function processStandardEvent(event) {
  const standardEvents = [
    'PageView',
    'ViewContent',
    'Search',
    'AddToCart',
    'AddToWishlist',
    'InitiateCheckout',
    'AddPaymentInfo',
    'Purchase',
    'Lead',
    'CompleteRegistration',
  ];

  let eventName = event.event;

  // Convert to [standard event format](https://www.rudderstack.com/docs/event-spec/standard-events/) if possible
  if (eventName === 'Product Added') {
    eventName = 'AddToCart';
  } else if (eventName === 'Product Added to Wishlist') {
    eventName = 'AddToWishlist';
  } else if (eventName === 'Checkout Started') {
    eventName = 'InitiateCheckout';
  } else if (eventName === 'Order Completed') {
    eventName = 'Purchase';
  }

  // Use standard event if available, otherwise use custom event
  if (standardEvents.includes(eventName)) {
    return { eventName };
  } else {
    return { eventName: 'CustomEvent', customEventName: event.event };
  }
}
```

#### Custom Data

Facebook Pixel has special handling for custom data:

```typescript
// Example: Custom data handling
function processCustomData(properties) {
  const customData = {};

  // Standard parameters
  if (properties.value) {
    customData.value = properties.value;
  }

  if (properties.currency) {
    customData.currency = properties.currency;
  }

  if (properties.content_name) {
    customData.content_name = properties.content_name;
  }

  if (properties.content_ids) {
    customData.content_ids = Array.isArray(properties.content_ids)
      ? properties.content_ids
      : [properties.content_ids];
  }

  // Additional custom parameters
  Object.entries(properties).forEach(([key, value]) => {
    if (!['value', 'currency', 'content_name', 'content_ids'].includes(key)) {
      customData[key] = value;
    }
  });

  return customData;
}
```

## Performance Considerations

### 1. Payload Size Optimization

#### JSON Minification

```typescript
// Example: Minifying JSON payload
function minifyPayload(payload) {
  // Remove null and undefined values
  const cleanPayload = JSON.parse(JSON.stringify(payload));

  // Remove empty objects and arrays
  function removeEmpty(obj) {
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        removeEmpty(value);
        if (Object.keys(value).length === 0) {
          delete obj[key];
        }
      } else if (value === null || value === undefined) {
        delete obj[key];
      }
    });
    return obj;
  }

  return removeEmpty(cleanPayload);
}
```

**Affected Integrations**:

- All integrations benefit from payload size optimization
- Especially important for integrations with size limitations (Mixpanel, Amplitude, etc.)

#### Property Filtering

```typescript
// Example: Filtering properties based on allowlist
function filterProperties(properties, allowlist) {
  if (!allowlist || allowlist.length === 0) return properties;

  const filteredProperties = {};

  Object.entries(properties).forEach(([key, value]) => {
    if (allowlist.includes(key)) {
      filteredProperties[key] = value;
    }
  });

  return filteredProperties;
}
```

**Affected Integrations**:

- Integrations with property limitations (Mixpanel, Google Analytics, etc.)
- Integrations with specific property requirements (Facebook Pixel, etc.)

### 2. Batching Optimization

#### Dynamic Batch Sizing

```typescript
// Example: Dynamic batch sizing based on event complexity
function optimizeBatchSize(events, maxBatchSize) {
  // Calculate complexity score for each event
  const eventComplexity = events.map((event) => {
    const size = JSON.stringify(event).length;
    const nestedDepth = checkNestedDepth(event);
    const propertyCount = Object.keys(event.properties || {}).length;

    return size * (1 + nestedDepth * 0.1) * (1 + propertyCount * 0.01);
  });

  // Calculate optimal batch size based on complexity
  const totalComplexity = eventComplexity.reduce((sum, complexity) => sum + complexity, 0);
  const averageComplexity = totalComplexity / events.length;
  const optimalBatchSize = Math.min(
    maxBatchSize,
    Math.max(1, Math.floor(10000 / averageComplexity)),
  );

  // Create batches
  const batches = [];
  for (let i = 0; i < events.length; i += optimalBatchSize) {
    batches.push(events.slice(i, i + optimalBatchSize));
  }

  return batches;
}
```

**Affected Integrations**:

- Integrations with batch support (Amplitude, Segment, etc.)
- Integrations with payload size limitations (Mixpanel, etc.)

#### Parallel Processing

```typescript
// Example: Parallel batch processing
async function processBatchesInParallel(batches, processFn, maxConcurrent = 5) {
  const results = [];

  for (let i = 0; i < batches.length; i += maxConcurrent) {
    const batchPromises = batches.slice(i, i + maxConcurrent).map((batch) => processFn(batch));

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}
```

**Affected Integrations**:

- All integrations with batch support
- Especially beneficial for high-volume integrations

### 3. Caching Strategies

#### Token Caching

```typescript
// Example: Caching authentication tokens
const tokenCache = new Map();

async function getAuthToken(integration, credentials) {
  const cacheKey = `${integration}:${credentials.clientId}`;

  // Check cache
  if (tokenCache.has(cacheKey)) {
    const cachedToken = tokenCache.get(cacheKey);

    // Check if token is still valid
    if (cachedToken.expiresAt > Date.now()) {
      return cachedToken.token;
    }
  }

  // Get new token
  const token = await fetchAuthToken(integration, credentials);

  // Cache token
  tokenCache.set(cacheKey, {
    token: token.access_token,
    expiresAt: Date.now() + token.expires_in * 1000,
  });

  return token.access_token;
}
```

**Affected Integrations**:

- Integrations with OAuth authentication (HubSpot, Salesforce, etc.)
- Integrations with token-based authentication (Google Analytics, etc.)

#### Response Caching

```typescript
// Example: Caching API responses
const responseCache = new Map();

async function cachedApiCall(endpoint, payload, cacheTime = 60000) {
  const cacheKey = `${endpoint}:${JSON.stringify(payload)}`;

  // Check cache
  if (responseCache.has(cacheKey)) {
    const cachedResponse = responseCache.get(cacheKey);

    // Check if response is still valid
    if (cachedResponse.expiresAt > Date.now()) {
      return cachedResponse.data;
    }
  }

  // Make API call
  const response = await makeApiCall(endpoint, payload);

  // Cache response
  responseCache.set(cacheKey, {
    data: response,
    expiresAt: Date.now() + cacheTime,
  });

  return response;
}
```

**Affected Integrations**:

- Integrations with rate limiting (Amplitude, Segment, etc.)
- Integrations with expensive API calls (HubSpot, Salesforce, etc.)

## Integration-Specific Recommendations

### 1. Mixpanel

#### Recommendations

1. **Property Validation**:

   - Validate property names and values against Mixpanel's limitations
   - Truncate long strings, limit array sizes, and flatten deep objects

2. **Batch Processing**:

   - Use batch endpoints for high-volume data
   - Limit batch size to avoid exceeding payload size limits

3. **Special Events**:
   - Use special events ($identify, $set, etc.) for user identification and property updates
   - Follow Mixpanel's event naming conventions

### 2. Amplitude

#### Recommendations

1. **User Property Operations**:

   - Use appropriate user property operations ($set, $setOnce, etc.)
   - Validate user properties against Amplitude's limitations

2. **Revenue Tracking**:

   - Use revenue events for tracking purchases
   - Include required revenue properties (price, quantity, etc.)

3. **Batch Processing**:
   - Use batch endpoints for high-volume data
   - Implement retry logic for rate limiting

### 3. Google Analytics

#### Recommendations

1. **Hit Type Selection**:

   - Use appropriate hit types for different events
   - Include required parameters for each hit type

2. **Custom Dimensions and Metrics**:

   - Use custom dimensions and metrics for additional data
   - Follow Google Analytics' naming conventions

3. **E-commerce Tracking**:
   - Use transaction and item hit types for e-commerce tracking
   - Include required e-commerce parameters

### 4. Facebook Pixel

#### Recommendations

1. **Standard Events**:

   - Use standard events when possible
   - Map custom events to standard events when appropriate

2. **Custom Data**:

   - Include relevant custom data for each event
   - Follow Facebook's parameter naming conventions

3. **Deduplication**:
   - Implement deduplication for events sent both client-side and server-side
   - Use event_id parameter for deduplication

## Proxy V1 and Partial Batch Failure Handling

The proxy v1 implementation in rudder-transformer provides sophisticated handling of partial batch failures, which is a significant improvement over proxy v0.

### 1. Response Structure

Proxy v1 returns individual responses for each event in a batch, allowing for granular error reporting:

```typescript
// Example: DeliveryV1Response structure
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

### 2. Destination-Specific Implementations

Many destinations implement custom logic to detect and handle partial failures:

```typescript
// Example: Handling partial failures in a batch
response.forEach((event, idx) => {
  const proxyOutput = {
    statusCode: 200,
    error: 'success',
    metadata: rudderJobMetadata[idx],
  };
  // Update status of partial event if abortable
  const { isAbortable, errorMsg } = checkIfEventIsAbortableAndExtractErrorMessage(event);
  if (isAbortable) {
    proxyOutput.error = errorMsg;
    proxyOutput.statusCode = 400;
  }
  responseWithIndividualEvents.push(proxyOutput);
});
```

### 3. Common Patterns

#### Strategy Pattern

Many implementations use a strategy pattern to handle different types of responses:

```typescript
// Example: Strategy pattern for response handling
const getResponseStrategy = (endpoint: string): BaseStrategy => {
  if (endpoint.includes('track') || endpoint.includes('identify')) {
    return strategyRegistry[TrackIdentifyStrategy.name];
  }
  return strategyRegistry[GenericStrategy.name];
};

const responseHandler = (responseParams: ProxyHandlerInput): void => {
  const { destinationRequest } = responseParams;
  const strategy = getResponseStrategy(destinationRequest.endpoint);
  return strategy.handleResponse(responseParams);
};
```

#### Error Extraction

Custom logic to extract error messages from destination-specific response formats:

```typescript
// Example: Extracting error messages
function checkIfEventIsAbortableAndExtractErrorMessage(event) {
  // Check for specific error conditions in the response
  const isAbortable = event.status === 'error' || event.code === 'invalid_data';
  const errorMsg = event.message || 'Unknown error';

  return { isAbortable, errorMsg };
}
```

#### DontBatch Flag

Setting the `dontBatch` flag for problematic events to prevent them from being batched in future attempts:

```typescript
// Example: Setting dontBatch flag
for (const metadata of rudderJobMetadata) {
  metadata.dontBatch = true;
  responseWithIndividualEvents.push({
    statusCode: 500,
    metadata,
    error: errorMessage,
  });
}
```

### 4. Key Improvements over Proxy V0

- **Granular Error Reporting**: Individual status codes and error messages for each event in a batch
- **Selective Retries**: Ability to retry only failed events rather than the entire batch
- **Batch Optimization**: Prevention of problematic events from being batched in future attempts
- **Destination-Specific Handling**: Custom logic for interpreting responses from different destinations
- **Status Code Mapping**: Converting destination-specific error codes to standard HTTP status codes (e.g., 500 for retryable errors, 400 for non-retryable errors)

## Conclusion

Understanding the nuances and edge cases of different integrations is crucial for building robust and efficient integrations. By following the recommendations and best practices outlined in this document, developers can ensure that their integrations handle data correctly, optimize performance, and avoid common pitfalls.

The code examples and integration-specific recommendations provide a starting point for implementing these best practices in real-world integrations. However, it's important to consult the official documentation for each integration to ensure that the implementation meets the latest requirements and guidelines.
