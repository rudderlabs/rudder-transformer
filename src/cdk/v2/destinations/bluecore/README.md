# Bluecore Destination

Implementation in **Javascript**

## Overview

Bluecore is an AI-powered retail marketing platform that helps brands transform customer data into personalized marketing campaigns. The RudderStack Bluecore integration sends user identification and event data to Bluecore's API for analysis, campaign targeting, and customer engagement optimization.

This integration enables retailers to sync customer profiles, track user behavior, and manage subscription preferences to create highly targeted email and marketing campaigns that drive revenue growth.

## Version Information

- **Current Version**: CDK v2 (Latest)
- **Implementation Type**: CDK v2 (Component Development Kit v2)
- **Last Updated**: 2025
- **Maintainer**: RudderStack Team
- **Status**: Beta

## Features

### Supported Capabilities

- **Customer Profile Management**: Create and update customer profiles with user traits
- **E-commerce Event Tracking**: Track product views, searches, cart actions, and purchases
- **Subscription Management**: Handle email opt-in and unsubscribe events
- **Custom Event Mapping**: Map custom events to Bluecore's standard e-commerce events
- **Real-time Data Sync**: Send events individually for immediate processing

### Key Features

- Real-time customer data synchronization
- Standard e-commerce event support (viewed_product, search, add_to_cart, etc.)
- Custom event name mapping capabilities
- Subscription event handling (optin/unsubscribe)
- Customer identification via email, userId, or external ID
- Product array normalization for e-commerce events

### Limitations

- **No Batching Support**: Events are sent individually, not in batches
- **Cloud Mode Only**: Device mode and hybrid mode are not supported
- **No User Deletion**: User deletion functionality is not available
- **No OAuth Support**: Uses namespace-based authentication only
- **No Proxy Delivery**: Direct API communication only
- **Limited Message Types**: Only identify and track events are supported

## Event Types

### Supported Event Types

#### Identify Events
- **Purpose**: Create or update customer profiles in Bluecore
- **Event Type**: `customer_patch`
- **Required Fields**: Bluecore namespace
- **Recommended Fields**: Email for proper user identification
- **Use Cases**:
  - Creating new customer profiles
  - Updating existing customer information
  - Linking email addresses to customer records

#### Track Events
- **Purpose**: Track user behavior and e-commerce activities
- **Supported Events**:
  - Standard e-commerce events (product views, searches, purchases)
  - Custom events
  - Subscription events (optin/unsubscribe)
- **Required Fields**: Event name, Bluecore namespace
- **Use Cases**:
  - E-commerce tracking
  - Custom behavior tracking
  - Email subscription management

### Unsupported Event Types

- **Page**: Not supported
- **Screen**: Not supported
- **Group**: Not supported
- **Alias**: Not supported
- **Record**: Not supported (RETL functionality not available)

## Standard E-commerce Events

Bluecore supports the following standard e-commerce events:

| Event Name | Description | Required Properties |
|------------|-------------|-------------------|
| `viewed_product` | When a user views a product | `products` array |
| `search` | When a user searches for products | `search_term` |
| `add_to_cart` | When a user adds a product to cart | `products` array |
| `remove_from_cart` | When a user removes a product from cart | `products` array |
| `wishlist` | When a user adds a product to wishlist | `products` array |
| `purchase` | When a user completes a purchase | `products` array, `order_id`, `total` |

## Special Events

Bluecore has special handling for the following events:

### Subscription Events
- `optin` - When a user opts in to email marketing
- `unsubscribe` - When a user unsubscribes from email marketing
- `subscription_event` - Generic subscription event that can be mapped to optin/unsubscribe based on `channelConsents.email` value

### Default Event Mapping

RudderStack provides default mappings for common e-commerce events:

| RudderStack Event | Bluecore Event | Notes |
|-------------------|----------------|-------|
| Product Viewed | `viewed_product` | Standard e-commerce event |
| Products Searched | `search` | Standard e-commerce event |
| Product Added | `add_to_cart` | Standard e-commerce event |
| Product Removed | `remove_from_cart` | Standard e-commerce event |
| Product Added to Wishlist | `wishlist` | Standard e-commerce event |
| Order Completed | `purchase` | Standard e-commerce event |
| `optin` | `optin` | Direct subscription event |
| `unsubscribe` | `unsubscribe` | Direct subscription event |
| `subscription_event` | `optin` or `unsubscribe` | Mapped based on `channelConsents.email` value |

## Configuration

### Required Settings

- **Bluecore Namespace**: Your unique Bluecore namespace/token (required for authentication)
  - Found in Bluecore dashboard under Account > Integration Guide
  - Used as the `token` parameter in API requests
  - Must be kept secure as it's marked as a secret key
  - Pattern validation: `(^\\{\\{.*\\|\\|(.*)\\}\\}$)|(^env[.].+)|^(.{1,100})$`
  - Maximum length: 100 characters

### Optional Settings

- **Event Mappings**: Custom mappings from your event names to Bluecore standard events
  - Supports mapping to: `viewed_product`, `search`, `add_to_cart`, `remove_from_cart`, `purchase`, `wishlist`
  - Can be configured via the RudderStack dashboard
  - Allows empty string mapping to disable specific events

### Connection Mode

- **Supported**: Cloud mode only
- **Device Mode**: Not supported
- **Hybrid Mode**: Not supported

### Supported Source Types

- Android, iOS, Unity, AMP, React Native, Flutter, Cordova, Web, Cloud, Shopify, Warehouse

### Authentication

- **Method**: Namespace-based authentication
- **No OAuth**: OAuth authentication is not supported
- **Security**: Namespace is treated as a secret key and encrypted in storage

## Event Mapping Configuration

You can map your custom event names to Bluecore's standard events using the event mapping configuration:

```json
"eventsMapping": [
  {
    "from": "Product Viewed",
    "to": "viewed_product"
  },
  {
    "from": "Products Searched",
    "to": "search"
  },
  {
    "from": "Product Added",
    "to": "add_to_cart"
  },
  {
    "from": "Product Removed",
    "to": "remove_from_cart"
  },
  {
    "from": "Product Added to Wishlist",
    "to": "wishlist"
  },
  {
    "from": "Order Completed",
    "to": "purchase"
  }
]
```

## API Endpoints

### Base Configuration

| Endpoint Type | URL | Method | Authentication |
|---------------|-----|--------|----------------|
| **Base URL** | `https://api.bluecore.app/api/track/mobile/v1` | POST | Namespace Token |
| **Identify Endpoint** | Base URL with `customer_patch` event type | POST | Namespace Token |
| **Track Endpoint** | Base URL with appropriate event type | POST | Namespace Token |

### Authentication Requirements

- **Token**: Bluecore namespace passed as `token` in request properties
- **Headers**: Standard HTTP headers (Content-Type: application/json)
- **Rate Limiting**: NEEDS REVIEW - Specific rate limits not documented

### API Version Information

- **Current Version**: Mobile tracking API v1
- **Versioning**: No versioned releases mentioned in Bluecore documentation
- **Deprecation**: NEEDS REVIEW - No information about API version deprecation
- **New Versions**: NEEDS REVIEW - No information about newer API versions

## Request Format

### Standard Request Structure

```json
{
  "event": "event_type",
  "properties": {
    "token": "your_namespace",
    "distinct_id": "user@example.com",
    "customer": {
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "additional_properties": "value"
  }
}
```

### Data Mapping Configuration

The integration maps RudderStack events to Bluecore's format using the following mapping files:

- **`bluecoreCommonConfig.json`**: Common properties for all events (customer data, device info)
- **`bluecoreIdentifyConfig.json`**: Properties specific to identify events (action field)
- **`bluecoreTrackConfig.json`**: Properties specific to track events (search_term, order_id, total, products)
- **`bluecoreSubscriptionEventConfig.json`**: Properties specific to subscription events

### Field Exclusion Lists

The integration excludes certain fields from being sent to Bluecore to avoid redundancy:

#### Identify Exclusion List
- `name`, `firstName`, `first_name`, `firstname`
- `lastName`, `last_name`, `lastname`
- `email`, `age`, `sex`, `address`, `action`, `event`

#### Track Exclusion List
- All identify exclusions plus:
- `query`, `order_id`, `total`, `products`

#### Subscription Event Exclusion List
- `name`, `firstName`, `first_name`, `firstname`
- `lastName`, `last_name`, `lastname`
- `email`, `age`, `sex`, `address`

## Transformation Details

### Event Type Handling

#### Identify Event Flow
1. Validate that the message type is `identify`
2. Extract user traits from the message
3. Set the event type to `customer_patch`
4. Map user traits to Bluecore customer properties
5. Construct the final payload with the Bluecore namespace
6. Send the payload to Bluecore's API

#### Track Event Flow
1. Validate that the message type is `track`
2. Extract event name and properties
3. Check if the event name needs to be mapped using the event mapping configuration
4. Handle special events (optin, unsubscribe, subscription_event)
5. Map event properties to Bluecore properties
6. Include user information in the customer object
7. Construct the final payload with the Bluecore namespace
8. Send the payload to Bluecore's API

### Field Mapping

#### Common Field Mappings (All Events)

| RudderStack Field | Bluecore Field | Required | Notes |
|-------------------|----------------|----------|-------|
| `externalId.bluecoreExternalId` | `distinct_id` | No | Preferred identifier |
| `email` | `distinct_id` | No | Fallback identifier |
| `userId` | `distinct_id` | No | Fallback identifier |
| `anonymousId` | `distinct_id` | No | Last resort identifier |
| `traits.name` | `customer.name` | No | Customer name |
| `traits.firstName` | `customer.first_name` | No | Customer first name |
| `traits.lastName` | `customer.last_name` | No | Customer last name |
| `traits.age` | `customer.age` | No | Customer age |
| `traits.gender` | `customer.sex` | No | Customer gender |
| `traits.address` | `customer.address` | No | Customer address |
| `traits.email` | `customer.email` | No | Customer email |
| `context.app.version` | `client` | No | App version |
| `context.device.model` | `device` | No | Device model |
| `destination.Config.bluecoreNamespace` | `token` | Yes | Authentication token |

#### Track Event Specific Mappings

| RudderStack Field | Bluecore Field | Required | Notes |
|-------------------|----------------|----------|-------|
| `properties.query` | `search_term` | For search events | Search query |
| `properties.order_id` | `order_id` | For purchase events | Order identifier |
| `properties.total` | `total` | For purchase events | Order total |
| `properties.products` | `products` | For e-commerce events | Product array |

#### Subscription Event Specific Mappings

| RudderStack Field | Bluecore Field | Required | Notes |
|-------------------|----------------|----------|-------|
| `properties.channelConsents.email` | Event type determination | Yes | `true` → `optin`, `false` → `unsubscribe` |
| `email` | `distinct_id` | Yes | User email for subscription |
| `userId` | `distinct_id` | Fallback | If email not available |
| `anonymousId` | `distinct_id` | Fallback | If email and userId not available |
| `traits.email` | `email` | No | Customer email in properties |
| `context.app.version` | `client` | No | App version |
| `context.device.model` | `device` | No | Device model |

### Special Handling Requirements

#### Product Array Normalization
- Products array is normalized to ensure consistent structure
- Product ID is derived from `product_id`, `sku`, or `id` fields
- Missing product information is handled gracefully

#### Subscription Event Processing
- `subscription_event` events are processed based on `channelConsents.email` value
- `true` value maps to `optin` event
- `false` value maps to `unsubscribe` event
- Direct `optin` and `unsubscribe` events are passed through unchanged

#### Distinct ID Resolution
- Priority order: `bluecoreExternalId` > `email` > `userId` > `anonymousId`
- For identify events, `userId` is preferred over `email`
- For track events, `email` is preferred over `userId`
- Throws error if no valid distinct ID can be determined

### Edge Cases

#### Missing Required Fields
- Missing namespace throws configuration error
- Missing distinct ID throws instrumentation error
- Missing event name for track events throws instrumentation error

#### Invalid Data Types
- Non-string event names are converted to strings
- Invalid email formats are passed through (validation handled by Bluecore)
- Null/undefined values are removed from payload

#### Large Payloads
- No explicit payload size limits enforced by integration
- Bluecore API may have size restrictions (NEEDS REVIEW)

## Error Handling

### Common Error Scenarios

#### Configuration Errors
- **Missing Namespace**: Throws `ConfigurationError` when Bluecore namespace is not provided
- **Invalid Namespace Format**: Validation error for namespace not matching required pattern

#### Instrumentation Errors
- **Missing Distinct ID**: Throws `InstrumentationError` when no valid identifier can be determined
- **Missing Event Name**: Throws `InstrumentationError` for track events without event name
- **Unsupported Message Type**: Throws `InstrumentationError` for unsupported event types

#### Network Errors
- **API Connectivity**: Standard network error handling for API communication failures
- **Authentication Failures**: Errors related to invalid namespace/token
- **Rate Limiting**: NEEDS REVIEW - Specific rate limit error handling not documented

### Error Handling Approach

#### Validation Strategy
- Input validation occurs before transformation
- Required fields are checked early in the process
- Configuration validation happens at destination setup

#### Error Recovery
- No automatic retry logic implemented
- Errors are propagated to RudderStack's error handling system
- Failed events are not automatically requeued

#### Debugging Support
- Detailed error messages include context about missing fields
- Error messages specify the exact requirement that failed
- Integration provides clear guidance on how to fix common issues

### Retry Logic

- **No Built-in Retry**: The integration does not implement custom retry logic
- **RudderStack Retry**: Relies on RudderStack's standard retry mechanisms
- **Error Propagation**: Errors are passed to RudderStack for handling according to configured retry policies

## Testing

### Test Coverage

#### Unit Tests
- **Utility Functions**: Comprehensive tests for all utility functions in `utils.js`
- **Event Processing**: Tests for identify and track event processing
- **Field Mapping**: Tests for all field mapping scenarios
- **Error Conditions**: Tests for all error scenarios

#### Test Scenarios

##### Identify Event Tests
- Valid identify event with all fields
- Identify event with minimal required fields
- Identify event with custom traits
- Identify event with external ID
- Error cases: missing namespace, invalid data types

##### Track Event Tests
- Standard e-commerce events (viewed_product, search, purchase, etc.)
- Custom events with mapping
- Subscription events (optin, unsubscribe, subscription_event)
- Events with product arrays
- Error cases: missing event name, invalid event types

##### Edge Case Tests
- Large payloads
- Special characters in event names
- Null/undefined values in properties
- Empty product arrays
- Invalid email formats

### Test Data

#### Sample Identify Event
```javascript
{
  "type": "identify",
  "userId": "user123",
  "traits": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 30
  },
  "context": {
    "app": { "version": "1.0.0" },
    "device": { "model": "iPhone" }
  }
}
```

#### Sample Track Event
```javascript
{
  "type": "track",
  "event": "Product Viewed",
  "properties": {
    "product_id": "123",
    "name": "Test Product",
    "price": 99.99,
    "category": "Electronics"
  },
  "userId": "user123",
  "context": {
    "traits": {
      "email": "user@example.com"
    }
  }
}
```

## Performance

### Rate Limits and Batch Sizes

#### Rate Limits
- **NEEDS REVIEW**: Specific rate limits for Bluecore API not documented in available sources
- **Recommendation**: Contact Bluecore support for current rate limit information
- **Best Practice**: Implement reasonable delays between requests to avoid potential rate limiting

#### Batch Processing
- **Not Supported**: Bluecore integration does not support batching
- **Individual Events**: Each event is sent individually to the Bluecore API
- **Reason**: Bluecore API design or integration choice prioritizes real-time processing

#### Performance Considerations
- **Real-time Processing**: Events are processed immediately upon receipt
- **Network Latency**: Each event requires a separate API call, which may impact latency
- **Throughput**: Limited by individual request processing time and potential rate limits

### Optimization Recommendations

#### Event Volume Management
- **Filter Unnecessary Events**: Use RudderStack's event filtering to reduce volume
- **Optimize Event Mapping**: Only map events that are actually used in Bluecore campaigns
- **Monitor Performance**: Track event processing times and error rates

#### Payload Optimization
- **Minimize Payload Size**: Only include necessary properties in events
- **Use Exclusion Lists**: Leverage built-in exclusion lists to reduce payload size
- **Validate Data**: Ensure data quality to reduce processing errors

## Version Information

### Current Implementation
- **Version**: CDK v2 (Component Development Kit v2)
- **Implementation Language**: JavaScript
- **Framework**: RudderStack CDK v2 with YAML workflow processing
- **Status**: Beta

### API Version Details
- **Bluecore API Version**: Mobile tracking API v1
- **Endpoint**: `https://api.bluecore.app/api/track/mobile/v1`
- **Versioning Strategy**: NEEDS REVIEW - No information about Bluecore's API versioning strategy

### Deprecation Information
- **Current Status**: No known deprecation notices
- **End-of-Life**: NEEDS REVIEW - No information about API version end-of-life
- **Migration Path**: NEEDS REVIEW - No information about migration to newer versions

### Compatibility
- **RudderStack Compatibility**: Compatible with RudderStack CDK v2 framework
- **Source Compatibility**: All supported RudderStack sources
- **Backward Compatibility**: Maintains compatibility with existing configurations

## Code Examples

### Identify Call

```javascript
rudderanalytics.identify('user123', {
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105'
  }
});
```

**Transformed Bluecore Payload:**
```json
{
  "event": "customer_patch",
  "properties": {
    "token": "your_namespace",
    "distinct_id": "user@example.com",
    "customer": {
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1234567890",
      "age": 30,
      "address": {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94105"
      }
    }
  }
}
```

### Track Call - E-commerce Event

```javascript
rudderanalytics.track('Product Viewed', {
  product_id: 'prod123',
  sku: 'sku123',
  name: 'Wireless Headphones',
  price: 199.99,
  category: 'Electronics',
  brand: 'AudioTech',
  variant: 'Black',
  quantity: 1
});
```

**Transformed Bluecore Payload:**
```json
{
  "event": "viewed_product",
  "properties": {
    "token": "your_namespace",
    "distinct_id": "user@example.com",
    "customer": {
      "email": "user@example.com"
    },
    "products": [
      {
        "id": "prod123",
        "name": "Wireless Headphones",
        "price": 199.99
      }
    ]
  }
}
```

### Track Call - Subscription Event

```javascript
// Opt-in example
rudderanalytics.track('subscription_event', {
  channelConsents: {
    email: true
  },
  source: 'newsletter_signup',
  campaign: 'welcome_series'
});

// Unsubscribe example
rudderanalytics.track('subscription_event', {
  channelConsents: {
    email: false
  },
  reason: 'user_request',
  source: 'email_footer'
});
```

**Transformed Bluecore Payload (Opt-in):**
```json
{
  "event": "optin",
  "properties": {
    "token": "your_namespace",
    "distinct_id": "user@example.com",
    "email": "user@example.com",
    "source": "newsletter_signup",
    "campaign": "welcome_series"
  }
}
```

### Track Call - Purchase Event

```javascript
rudderanalytics.track('Order Completed', {
  order_id: 'order_123',
  total: 299.98,
  currency: 'USD',
  products: [
    {
      product_id: 'prod123',
      sku: 'sku123',
      name: 'Wireless Headphones',
      price: 199.99,
      quantity: 1,
      category: 'Electronics'
    },
    {
      product_id: 'prod456',
      sku: 'sku456',
      name: 'Phone Case',
      price: 99.99,
      quantity: 1,
      category: 'Accessories'
    }
  ]
});
```

**Transformed Bluecore Payload:**
```json
{
  "event": "purchase",
  "properties": {
    "token": "your_namespace",
    "distinct_id": "user@example.com",
    "order_id": "order_123",
    "total": 299.98,
    "customer": {
      "email": "user@example.com"
    },
    "products": [
      {
        "id": "prod123",
        "name": "Wireless Headphones",
        "price": 199.99
      },
      {
        "id": "prod456",
        "name": "Phone Case",
        "price": 99.99
      }
    ]
  }
}
```

## Troubleshooting

### Common Issues

#### Events Not Appearing in Bluecore
- **Cause**: Incorrect namespace configuration or event format issues
- **Solution**:
  - Verify namespace is correctly configured in RudderStack dashboard
  - Check that events are being sent with proper format
  - Ensure distinct_id is properly set (email, userId, or external ID)

#### User Properties Not Updating
- **Cause**: Missing or incorrect user identification
- **Solution**:
  - Ensure email is included in identify events
  - Verify distinct_id resolution is working correctly
  - Check that user traits are properly formatted

#### Event Mapping Not Working
- **Cause**: Incorrect event mapping configuration
- **Solution**:
  - Verify event mapping configuration in RudderStack dashboard
  - Check that event names match exactly (case-sensitive)
  - Ensure mapped events are valid Bluecore standard events

#### Subscription Events Not Working
- **Cause**: Incorrect channelConsents format or missing email
- **Solution**:
  - Ensure email is included in event properties or user context
  - Verify channelConsents.email is boolean (true/false)
  - Check that subscription_event format matches expected structure

#### Authentication Errors
- **Cause**: Invalid or missing Bluecore namespace
- **Solution**:
  - Verify namespace is correctly copied from Bluecore dashboard
  - Check that namespace follows required pattern validation
  - Ensure namespace is properly configured as secret in RudderStack

### Debugging Steps

#### 1. Verify Configuration
- Check Bluecore namespace in RudderStack destination settings
- Verify event mapping configuration if using custom events
- Ensure connection mode is set to Cloud mode

#### 2. Check Event Format
- Verify event structure matches expected format
- Check that required fields are present
- Validate data types (strings, numbers, booleans)

#### 3. Monitor Logs
- Check RudderStack transformation logs for errors
- Look for validation errors or missing field warnings
- Monitor network requests to Bluecore API

#### 4. Test with Simple Events
- Start with basic identify event with minimal fields
- Test standard track events before custom events
- Verify subscription events work with direct optin/unsubscribe

### Error Messages

#### Common Error Messages and Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `[BLUECORE] account namespace required for Authentication` | Missing namespace | Configure Bluecore namespace in destination settings |
| `property:: distinct_id could not be set` | No valid identifier found | Include email, userId, or external ID in event |
| `event_name could not be mapped` | Missing event name in track call | Include event name in track() call |
| `Message type X not supported` | Unsupported event type | Use only identify or track events |

## General Use Cases

### E-commerce Tracking
The Bluecore integration is ideal for e-commerce businesses that want to:
- Track customer product interactions (views, searches, purchases)
- Create personalized product recommendations
- Trigger abandoned cart campaigns
- Analyze customer purchase behavior

### Email Marketing Automation
Perfect for businesses looking to:
- Manage email subscription preferences
- Trigger automated email campaigns based on user behavior
- Segment customers based on purchase history
- Personalize email content with product data

### Customer Profile Management
Suitable for organizations that need to:
- Maintain unified customer profiles across channels
- Update customer information in real-time
- Link anonymous users to identified profiles
- Enrich customer data with behavioral insights

## Data Replay and Event Ordering

### Event Ordering Requirements
- **Identify Events**: Event ordering is recommended to ensure user profiles are updated with the most recent data
- **Track Events**: Event ordering is not strictly required for discrete user actions
- **Subscription Events**: Event ordering is recommended to maintain correct subscription status

### Data Replay Feasibility
- **Missing Data Replay**: Feasible for track events; use caution with identify events to avoid overwriting newer data
- **Duplicate Event Handling**: NEEDS REVIEW - No information about Bluecore's duplicate event handling capabilities
- **Historical Data**: Can replay historical events, but consider impact on campaign triggers and user profiles

### Best Practices for Data Replay
- Test replay with small data sets first
- Consider temporal order when replaying events
- Monitor for unexpected campaign triggers during replay
- Coordinate with Bluecore team for large-scale replays

## Multiplexing

### Multiplexing Support
- **Supported**: No
- **Description**: The Bluecore destination does not generate multiple API calls from a single input event
- **Processing**: Each RudderStack event results in exactly one Bluecore API call

### Event Processing
- **One-to-One Mapping**: Each RudderStack event maps to one Bluecore event
- **No Event Splitting**: Events are not split into multiple Bluecore events
- **No Event Combining**: Multiple RudderStack events are not combined into single Bluecore events

## References

### Official Documentation
- **Bluecore Platform**: [https://www.bluecore.com/](https://www.bluecore.com/)
- **Bluecore API Documentation**: [https://www.bluecore.com/api-docs](https://www.bluecore.com/api-docs)
- **Bluecore Transactional API**: [https://www.bluecore.com/apis/transactional-api/](https://www.bluecore.com/apis/transactional-api/)

### RudderStack Documentation
- **RudderStack Bluecore Destination**: [https://www.rudderstack.com/docs/destinations/streaming-destinations/bluecore/](https://www.rudderstack.com/docs/destinations/streaming-destinations/bluecore/)
- **RudderStack Event Specification**: [https://www.rudderstack.com/docs/event-spec/](https://www.rudderstack.com/docs/event-spec/)

### Support Channels
- **RudderStack Support**: [https://rudderstack.com/join-rudderstack-slack-community](https://rudderstack.com/join-rudderstack-slack-community)
- **RudderStack Documentation**: [https://docs.rudderstack.com/](https://docs.rudderstack.com/)
- **Bluecore Support**: Contact through Bluecore dashboard or support channels

### Additional Resources
- **Business Logic Documentation**: [./docs/businesslogic.md](./docs/businesslogic.md)
- **RETL Functionality Documentation**: [./docs/retl.md](./docs/retl.md)
- **GitHub Repository**: [RudderStack Transformer - Bluecore](https://github.com/rudderlabs/rudder-transformer/tree/main/src/cdk/v2/destinations/bluecore)

---

**Note**: This documentation covers the current implementation of the Bluecore destination integration. For the most up-to-date information about Bluecore's API capabilities and limitations, please refer to the official Bluecore documentation or contact their support team. Areas marked with "NEEDS REVIEW" require additional information that was not available in the provided sources.