# Integration-Specific Documentation

This document provides a template for integration-specific documentation and includes example documentation for selected integrations.

## Documentation Template

The following template should be used for documenting individual integrations:

````markdown
# [Integration Name]

## Overview

Brief description of the integration, including its purpose and key features.

## Version Information

- **Current Version**: [Version number]
- **Implementation Type**: [v0, v1, CDK v2]
- **Last Updated**: [Date]
- **Maintainer**: [Team or individual]

## Features

- List of key features supported by the integration
- Note any limitations or unsupported features

## Event Types

### Supported Event Types

- **Identify**: [Yes/No] - [Any special handling]
- **Track**: [Yes/No] - [Any special handling]
- **Page**: [Yes/No] - [Any special handling]
- **Screen**: [Yes/No] - [Any special handling]
- **Group**: [Yes/No] - [Any special handling]
- **Alias**: [Yes/No] - [Any special handling]

### Custom Event Types

- List of any custom event types supported by the integration
- Include details on how to use them

## Configuration

### Required Settings

- **[Setting Name]**: [Description] - [Example]
- **[Setting Name]**: [Description] - [Example]

### Optional Settings

- **[Setting Name]**: [Description] - [Default value] - [Example]
- **[Setting Name]**: [Description] - [Default value] - [Example]

## API Details

### Endpoints

- **[Endpoint Name]**: [URL] - [Purpose] - [HTTP Method]
- **[Endpoint Name]**: [URL] - [Purpose] - [HTTP Method]

### Authentication

- **Method**: [Authentication method]
- **Credentials**: [Required credentials]
- **Token Expiration**: [If applicable]

### Rate Limits

- **[Limit Type]**: [Limit] - [Period] - [Handling strategy]
- **[Limit Type]**: [Limit] - [Period] - [Handling strategy]

## Data Mapping

### Standard Fields

| RudderStack Field | Integration Field | Notes                  |
| ----------------- | ----------------- | ---------------------- |
| `userId`          | `[Field name]`    | [Any special handling] |
| `anonymousId`     | `[Field name]`    | [Any special handling] |
| `event`           | `[Field name]`    | [Any special handling] |
| `properties`      | `[Field name]`    | [Any special handling] |
| `traits`          | `[Field name]`    | [Any special handling] |

### Custom Fields

| RudderStack Field    | Integration Field | Notes                  |
| -------------------- | ----------------- | ---------------------- |
| `properties.[Field]` | `[Field name]`    | [Any special handling] |
| `context.[Field]`    | `[Field name]`    | [Any special handling] |

## Special Handling

### Data Type Handling

- **Strings**: [Any limitations or special handling]
- **Numbers**: [Any limitations or special handling]
- **Booleans**: [Any limitations or special handling]
- **Arrays**: [Any limitations or special handling]
- **Objects**: [Any limitations or special handling]
- **Dates**: [Any limitations or special handling]

### Edge Cases

- **[Edge Case]**: [Description] - [Handling strategy]
- **[Edge Case]**: [Description] - [Handling strategy]

## Performance Considerations

- **Batch Processing**: [Supported/Not supported] - [Batch size limits]
- **Payload Size**: [Any limitations] - [Handling strategy]
- **Rate Limiting**: [Any limitations] - [Handling strategy]
- **Caching**: [Any caching strategies]

## Error Handling

### Common Errors

- **[Error Code/Message]**: [Description] - [Handling strategy]
- **[Error Code/Message]**: [Description] - [Handling strategy]

### Retry Strategy

- **Retryable Errors**: [List of retryable errors]
- **Max Retries**: [Number]
- **Backoff Strategy**: [Description]

## Code Examples

### Basic Usage

```typescript
// Example code for basic usage
```
````

### Advanced Usage

```typescript
// Example code for advanced usage
```

## Testing

### Unit Tests

- **Location**: [Path to test files]
- **Running Tests**: [Command to run tests]

### Integration Tests

- **Location**: [Path to test files]
- **Running Tests**: [Command to run tests]
- **Test Environment**: [Any special setup required]

## Troubleshooting

### Common Issues

- **[Issue]**: [Description] - [Solution]
- **[Issue]**: [Description] - [Solution]

### Debugging

- **Logs**: [How to enable and interpret logs]
- **Metrics**: [Available metrics and how to use them]

## References

- **Official Documentation**: [Link]
- **API Reference**: [Link]
- **Support Channels**: [Links or contact information]

````

## Example Integration Documentation

### Example 1: Amplitude

# Amplitude

## Overview

Amplitude is a product analytics platform that helps companies understand user behavior, ship the right features, and improve business outcomes. The RudderStack Amplitude integration sends event data to Amplitude for analysis.

## Version Information

- **Current Version**: 2.0.0
- **Implementation Type**: v0
- **Last Updated**: 2023-06-15
- **Maintainer**: Integration Team

## Features

- Track user events and properties
- Identify users and set user properties
- Track revenue and e-commerce events
- Support for batch processing
- Support for custom user property operations

## Event Types

### Supported Event Types

- **Identify**: Yes - Maps to Amplitude identify API
- **Track**: Yes - Maps to Amplitude event tracking API
- **Page**: Yes - Converted to track events with name "Viewed [Page]"
- **Screen**: Yes - Converted to track events with name "Viewed [Screen]"
- **Group**: Yes - Sets group properties on events
- **Alias**: No

### Custom Event Types

- **Revenue Events**: Special handling for revenue tracking
  - Use `properties.revenue` to track revenue amount
  - Use `properties.price` and `properties.quantity` for product-specific revenue

## Configuration

### Required Settings

- **apiKey**: Amplitude API Key - Example: `YOUR_AMPLITUDE_API_KEY`

### Optional Settings

- **apiVersion**: Amplitude API version - Default: `2` - Example: `2`
- **batchEvents**: Enable batch processing - Default: `true` - Example: `true`
- **maxBatchSize**: Maximum events per batch - Default: `100` - Example: `50`
- **eventUploadPeriodMillis**: Batch upload period - Default: `10000` - Example: `5000`
- **useNativeSDK**: Use Amplitude's native SDK - Default: `false` - Example: `true`

## API Details

### Endpoints

- **Track**: `https://api.amplitude.com/2/httpapi` - Send events - HTTP Method: POST
- **Identify**: `https://api.amplitude.com/2/httpapi` - Update user properties - HTTP Method: POST
- **Batch**: `https://api.amplitude.com/batch` - Send events in batch - HTTP Method: POST

### Authentication

- **Method**: API Key
- **Credentials**: API Key in request body as `api_key`
- **Token Expiration**: N/A (API Key does not expire)

### Rate Limits

- **Event Upload**: 1000 events per second - Exponential backoff retry
- **API Calls**: 1000 requests per second - Exponential backoff retry

## Data Mapping

### Standard Fields

| RudderStack Field | Amplitude Field | Notes |
|-------------------|-----------------|-------|
| `userId` | `user_id` | Required for identified users |
| `anonymousId` | `device_id` | Used if userId is not available |
| `event` | `event_type` | Name of the event |
| `properties` | `event_properties` | Event-specific properties |
| `traits` | `user_properties` | User-specific properties |
| `timestamp` | `time` | Converted to milliseconds |

### Custom Fields

| RudderStack Field | Amplitude Field | Notes |
|-------------------|-----------------|-------|
| `properties.revenue` | `revenue` | Revenue amount in dollars |
| `properties.price` | `price` | Price of the item |
| `properties.quantity` | `quantity` | Quantity of the item |
| `properties.productId` | `productId` | ID of the product |
| `context.device` | `device_brand`, `device_type`, etc. | Device information |
| `context.os` | `os_name`, `os_version` | OS information |

## Special Handling

### Data Type Handling

- **Strings**: No specific limitations
- **Numbers**: Converted to strings for certain fields
- **Booleans**: Converted to strings
- **Arrays**: Limited to 1000 elements
- **Objects**: Maximum nesting depth of 40
- **Dates**: Converted to milliseconds since epoch

### Edge Cases

- **Revenue Tracking**: Special handling for revenue events
  - Revenue amount must be in dollars
  - Price and quantity are used to calculate revenue if revenue is not provided
- **User Property Operations**: Special handling for user property operations
  - `$set`: Set user properties
  - `$setOnce`: Set user properties only once
  - `$add`: Add to numeric properties
  - `$append`: Append to list properties
  - `$prepend`: Prepend to list properties
  - `$unset`: Remove properties

## Performance Considerations

- **Batch Processing**: Supported - Maximum 1000 events per batch
- **Payload Size**: Maximum 20MB per request
- **Rate Limiting**: 1000 events per second
- **Caching**: No specific caching strategies

## Error Handling

### Common Errors

- **Invalid API Key**: 401 Unauthorized - Abort and report error
- **Rate Limiting**: 429 Too Many Requests - Retry with exponential backoff
- **Invalid Event Format**: 400 Bad Request - Log error and continue
- **Server Error**: 5xx - Retry with exponential backoff

### Retry Strategy

- **Retryable Errors**: 429, 5xx
- **Max Retries**: 3
- **Backoff Strategy**: Exponential backoff with jitter

## Code Examples

### Basic Usage

```typescript
// Example: Track event
const event = {
  userId: 'user123',
  event: 'Product Purchased',
  properties: {
    productId: 'prod123',
    price: 29.99,
    quantity: 2
  }
};

const amplitudeEvent = processEvent(event);
````

### Advanced Usage

```typescript
// Example: User property operations
const event = {
  userId: 'user123',
  type: 'identify',
  traits: {
    $set: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    $setOnce: {
      first_seen: new Date().toISOString(),
    },
    $add: {
      login_count: 1,
    },
  },
};

const amplitudeEvent = processEvent(event);
```

## Testing

### Unit Tests

- **Location**: `./src/v0/destinations/am/__tests__/`
- **Running Tests**: `npm run test:ts -- unit --destination=am`

### Integration Tests

- **Location**: `./src/v0/destinations/am/__tests__/`
- **Running Tests**: `npm run test:ts -- component --destination=am`
- **Test Environment**: Requires valid Amplitude API key for integration tests

## Troubleshooting

### Common Issues

- **Events Not Appearing in Amplitude**: Check API key and event format
- **User Properties Not Updating**: Ensure proper user identification
- **Revenue Events Not Tracking**: Check revenue, price, and quantity fields

### Debugging

- **Logs**: Enable debug logging with `LOG_LEVEL=debug`
- **Metrics**: Monitor event counts and error rates in Prometheus metrics

## References

- **Official Documentation**: [Amplitude HTTP API](https://developers.amplitude.com/docs/http-api-v2)
- **API Reference**: [Amplitude API Reference](https://developers.amplitude.com/docs/http-api-v2)
- **Support Channels**: [Amplitude Support](https://amplitude.com/contact)

### Example 2: Facebook Pixel

# Facebook Pixel

## Overview

Facebook Pixel is a tracking code that helps advertisers track conversions from Facebook ads, optimize ads based on collected data, build targeted audiences for future ads, and remarket to people who have already taken some action on the website. The RudderStack Facebook Pixel integration sends event data to Facebook for ad targeting and conversion tracking.

## Version Information

- **Current Version**: 1.0.0
- **Implementation Type**: v0
- **Last Updated**: 2023-05-10
- **Maintainer**: Integration Team

## Features

- Track standard Facebook events
- Track custom events
- Support for custom parameters
- Support for advanced matching
- Support for server-side events API

## Event Types

### Supported Event Types

- **Identify**: Yes - Maps to Facebook user data for advanced matching
- **Track**: Yes - Maps to Facebook standard or custom events
- **Page**: Yes - Maps to Facebook PageView event
- **Screen**: Yes - Maps to Facebook PageView event
- **Group**: No
- **Alias**: No

### Custom Event Types

- **Standard Events**: Special handling for Facebook standard events
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

## Configuration

### Required Settings

- **pixelId**: Facebook Pixel ID - Example: `123456789012345`

### Optional Settings

- **accessToken**: Facebook API Access Token - Example: `EAAxxxxx`
- **useNativeSDK**: Use Facebook's native SDK - Default: `false` - Example: `true`
- **sendEventsDirectlyToFacebook**: Send events directly to Facebook - Default: `false` - Example: `true`
- **valueFieldIdentifier**: Field to use for value - Default: `value` - Example: `revenue`
- **advancedMapping**: Enable advanced mapping - Default: `true` - Example: `true`

## API Details

### Endpoints

- **Events API**: `https://graph.facebook.com/v13.0/[pixelId]/events` - Send events - HTTP Method: POST
- **Conversion API**: `https://graph.facebook.com/v13.0/[pixelId]/conversions` - Send conversions - HTTP Method: POST

### Authentication

- **Method**: Access Token
- **Credentials**: Access Token in request body as `access_token`
- **Token Expiration**: Varies based on token type (short-lived or long-lived)

### Rate Limits

- **API Calls**: 200 requests per hour per user - Exponential backoff retry
- **Events**: 1000 events per hour per pixel - Exponential backoff retry

## Data Mapping

### Standard Fields

| RudderStack Field | Facebook Field                | Notes                                          |
| ----------------- | ----------------------------- | ---------------------------------------------- |
| `userId`          | `user_data.external_id`       | Used for advanced matching                     |
| `anonymousId`     | `user_data.client_user_agent` | Used if userId is not available                |
| `event`           | `event_name`                  | Mapped to standard event if possible           |
| `properties`      | `custom_data`                 | Event-specific properties                      |
| `traits`          | `user_data`                   | User-specific properties for advanced matching |
| `timestamp`       | `event_time`                  | Converted to seconds since epoch               |

### Custom Fields

| RudderStack Field         | Facebook Field             | Notes                              |
| ------------------------- | -------------------------- | ---------------------------------- |
| `properties.value`        | `custom_data.value`        | Monetary value of the event        |
| `properties.currency`     | `custom_data.currency`     | Currency code (ISO 4217)           |
| `properties.content_name` | `custom_data.content_name` | Name of the content                |
| `properties.content_ids`  | `custom_data.content_ids`  | Array of content IDs               |
| `traits.email`            | `user_data.em`             | Hashed email for advanced matching |
| `traits.phone`            | `user_data.ph`             | Hashed phone for advanced matching |

## Special Handling

### Data Type Handling

- **Strings**: Maximum 1000 characters for parameter values
- **Numbers**: No specific limitations
- **Booleans**: Converted to strings
- **Arrays**: Maximum 10,000 elements for content_ids
- **Objects**: Not supported in custom_data (flattened)
- **Dates**: Converted to seconds since epoch

### Edge Cases

- **Event Name Mapping**: Mapping between RudderStack and Facebook event names
  - `Product Added` → `AddToCart`
  - `Product Added to Wishlist` → `AddToWishlist`
  - `Checkout Started` → `InitiateCheckout`
  - `Order Completed` → `Purchase`
- **Advanced Matching**: Hashing of user data for privacy
  - Email, phone, name, etc. are hashed using SHA-256
  - Normalization is applied before hashing (lowercase, remove spaces, etc.)

## Performance Considerations

- **Batch Processing**: Not supported (events sent individually)
- **Payload Size**: Maximum 1000 characters per parameter value
- **Rate Limiting**: 200 requests per hour per user
- **Caching**: No specific caching strategies

## Error Handling

### Common Errors

- **Invalid Access Token**: 401 Unauthorized - Abort and report error
- **Rate Limiting**: 429 Too Many Requests - Retry with exponential backoff
- **Invalid Event Format**: 400 Bad Request - Log error and continue
- **Server Error**: 5xx - Retry with exponential backoff

### Retry Strategy

- **Retryable Errors**: 429, 5xx
- **Max Retries**: 3
- **Backoff Strategy**: Exponential backoff with jitter

## Code Examples

### Basic Usage

```typescript
// Example: Track standard event
const event = {
  userId: 'user123',
  event: 'Product Added',
  properties: {
    product_id: 'prod123',
    value: 29.99,
    currency: 'USD',
  },
};

const facebookEvent = processEvent(event);
```

### Advanced Usage

```typescript
// Example: Advanced matching
const event = {
  userId: 'user123',
  type: 'identify',
  traits: {
    email: 'john@example.com',
    phone: '+1234567890',
    firstName: 'John',
    lastName: 'Doe',
    address: {
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
      country: 'US',
    },
  },
};

const facebookEvent = processEvent(event);
```

## Testing

### Unit Tests

- **Location**: `./src/v0/destinations/fb/__tests__/`
- **Running Tests**: `npm run test:ts -- unit --destination=fb`

### Integration Tests

- **Location**: `./src/v0/destinations/fb/__tests__/`
- **Running Tests**: `npm run test:ts -- component --destination=fb`
- **Test Environment**: Requires valid Facebook Pixel ID and Access Token for integration tests

## Troubleshooting

### Common Issues

- **Events Not Appearing in Facebook**: Check Pixel ID and Access Token
- **Advanced Matching Not Working**: Ensure proper user identification and data hashing
- **Conversion Tracking Not Working**: Check event names and parameters

### Debugging

- **Logs**: Enable debug logging with `LOG_LEVEL=debug`
- **Facebook Events Manager**: Use Facebook Events Manager to debug events
- **Facebook Pixel Helper**: Use the Chrome extension to debug client-side events

## References

- **Official Documentation**: [Facebook Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api/)
- **API Reference**: [Facebook Graph API Reference](https://developers.facebook.com/docs/graph-api/reference/v13.0/)
- **Support Channels**: [Facebook Developer Support](https://developers.facebook.com/support/)

## Integration Documentation Management

To effectively manage integration-specific documentation, consider the following approaches:

### 1. Documentation Generation

Implement a documentation generation system that extracts information from the codebase and generates documentation automatically:

```typescript
function generateIntegrationDocs(integrationName, version) {
  // Extract information from the codebase
  const integrationInfo = extractIntegrationInfo(integrationName, version);

  // Generate documentation from the extracted information
  const documentation = generateDocumentation(integrationInfo);

  // Save the documentation to a file
  saveDocumentation(integrationName, documentation);
}
```

### 2. Documentation Testing

Implement tests to ensure that the documentation is accurate and up-to-date:

```typescript
function testDocumentation(integrationName) {
  // Load the documentation
  const documentation = loadDocumentation(integrationName);

  // Extract information from the codebase
  const integrationInfo = extractIntegrationInfo(integrationName);

  // Compare the documentation with the extracted information
  const differences = compareDocumentation(documentation, integrationInfo);

  // Report any differences
  if (differences.length > 0) {
    console.error(`Documentation for ${integrationName} is out of date:`, differences);
    return false;
  }

  return true;
}
```

### 3. Documentation Versioning

Implement versioning for integration documentation to track changes over time:

```typescript
function versionDocumentation(integrationName, version) {
  // Load the current documentation
  const currentDocumentation = loadDocumentation(integrationName);

  // Save the current documentation as a versioned copy
  saveVersionedDocumentation(integrationName, version, currentDocumentation);

  // Update the version information in the current documentation
  currentDocumentation.version = version;

  // Save the updated documentation
  saveDocumentation(integrationName, currentDocumentation);
}
```

### 4. Documentation Review Process

Implement a review process for integration documentation to ensure quality and accuracy:

1. **Automated Checks**:

   - Check for missing required sections
   - Validate links and references
   - Check for outdated information

2. **Manual Review**:

   - Review by integration developers
   - Review by technical writers
   - Review by product managers

3. **Approval Process**:
   - Submit documentation for review
   - Address review comments
   - Get approval from reviewers
   - Publish the documentation

### 5. Documentation Publishing

Implement a publishing system for integration documentation:

1. **Internal Documentation**:

   - Publish to internal knowledge base
   - Make available to internal teams

2. **External Documentation**:

   - Publish to external documentation site
   - Make available to customers and partners

3. **API Reference**:
   - Generate API reference documentation
   - Make available to developers

## Conclusion

Integration-specific documentation is crucial for understanding, using, and maintaining integrations effectively. By following the template and examples provided in this document, developers can create comprehensive and consistent documentation for all integrations in the RudderStack Transformer.

The documentation management approaches outlined in this document provide a framework for generating, testing, versioning, reviewing, and publishing integration documentation, ensuring that it remains accurate, up-to-date, and useful for all stakeholders.
