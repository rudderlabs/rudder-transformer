# Bluecore Destination

Implementation in **Javascript**

## Overview

Bluecore is an AI-powered retail marketing platform that helps brands transform customer data into personalized marketing campaigns. The RudderStack Bluecore integration sends user identification and event data to Bluecore's Events/Tracking API for customer profile management, behavioral tracking, and campaign targeting.

This integration enables retailers to sync customer profiles, track user behavior, and manage subscription preferences to create highly targeted email and marketing campaigns that drive revenue growth.

**Note**: This integration uses Bluecore's Events/Tracking API (endpoint: `https://api.bluecore.app/api/track/mobile/v1`) for customer data collection and event tracking, not the Transactional API which is used for sending transactional emails.

## Configuration

### Required Settings

- **Bluecore Namespace**: Your unique Bluecore namespace/token (required for authentication)
  - Found in Bluecore dashboard under Account > Integration Guide
  - Used as the `token` parameter in API requests
  - Must be kept secure as it's marked as a secret key
  - Pattern validation: `(^\\{\\{.*\\|\\|(.*)\\}\\}$)|(^env[.].+)|^(.{1,100})$`
  - Maximum length: 100 characters
  
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

## Version Information

- **Current Version**: CDK v2 (Latest)
- **Implementation Type**: CDK v2 (Component Development Kit v2)
- **Last Updated**: 2024
- **Maintainer**: RudderStack Team
- **Status**: Beta

## Features

### Supported Capabilities

- **Customer Profile Management**: Create and update customer profiles with user traits
- **E-commerce Event Tracking**: Track product views, searches, cart actions, and purchases
- **Subscription Management**: Handle email opt-in and unsubscribe events
- **Custom Event Mapping**: Map custom events to Bluecore's standard e-commerce events
- **Real-time Data Sync**: Send events individually for immediate processing

## Integration Functionalities

### Implementation Details

- **Implementation Type**: CDK v2
- **Connection Mode**: Cloud mode only

### Supported Message Types

- **Identify**: Maps user traits to Bluecore customer properties
- **Track**: Maps event data to Bluecore events

### Batching Support

- Bluecore integration does not support batching. Each event is sent individually to the Bluecore API.

### Proxy Delivery

- **Supported**: No

### User Deletion

- **Supported**: No

### OAuth Support

- **Supported**: No

### Intermediate Calls

- **Supported**: No
- **Description**: The Bluecore integration does not make intermediate API calls. Each RudderStack event results in exactly one API call to Bluecore's tracking endpoint.

### Additional Functionalities

- **Event Mapping**: Custom event names can be mapped to Bluecore's standard events
- **Subscription Event Handling**: Special handling for subscription-related events (optin, unsubscribe)

### Validations

- Email is required for proper user identification
- Bluecore namespace is required in the destination configuration
- Only identify and track event types are supported

### Rate Limits

| Endpoint | Event Types | Rate Limit | Batch Limits | Description |
|----------|-------------|------------|--------------|-------------|
| `https://api.bluecore.app/api/track/mobile/v1` | `customer_patch`, `viewed_product`, `search`, `add_to_cart`, `remove_from_cart`, `wishlist`, `purchase`, `optin`, `unsubscribe` | Not publicly documented | No batching support - events sent individually | Bluecore Events/Tracking API for customer data collection and event tracking. Uses namespace-based authentication. Standard HTTP payload limits apply. |

**Best Practices**:
- Implement reasonable delays between requests to avoid overwhelming the API
- Monitor response times and error rates to detect potential rate limiting
- Use event filtering to reduce unnecessary volume

**Note**: The rate limiting information differs from Bluecore's Transactional API, which has documented limits of 200 calls/second and 900 KB payloads. The Events/Tracking API that RudderStack uses may have different limitations that are not publicly documented.

## Standard E-commerce Events

Bluecore supports the following standard e-commerce events:

| Event Name         | Description                             | Required Properties                   |
| ------------------ | --------------------------------------- | ------------------------------------- |
| `viewed_product`   | When a user views a product             | `products` array                      |
| `search`           | When a user searches for products       | `search_term`                         |
| `add_to_cart`      | When a user adds a product to cart      | `products` array                      |
| `remove_from_cart` | When a user removes a product from cart | `products` array                      |
| `wishlist`         | When a user adds a product to wishlist  | `products` array                      |
| `purchase`         | When a user completes a purchase        | `products` array, `order_id`, `total` |

## Special Events

Bluecore has special handling for the following events:

### Subscription Events

- `optin` - When a user opts in to email marketing
- `unsubscribe` - When a user unsubscribes from email marketing
- `subscription_event` - Generic subscription event that can be mapped to optin/unsubscribe based on `channelConsents.email` value

### Default Event Mapping

RudderStack provides default mappings for common e-commerce events:

| RudderStack Event         | Bluecore Event           | Notes                                         |
| ------------------------- | ------------------------ | --------------------------------------------- |
| Product Viewed            | `viewed_product`         | Standard e-commerce event                     |
| Products Searched         | `search`                 | Standard e-commerce event                     |
| Product Added             | `add_to_cart`            | Standard e-commerce event                     |
| Product Removed           | `remove_from_cart`       | Standard e-commerce event                     |
| Product Added to Wishlist | `wishlist`               | Standard e-commerce event                     |
| Order Completed           | `purchase`               | Standard e-commerce event                     |
| `optin`                   | `optin`                  | Direct subscription event                     |
| `unsubscribe`             | `unsubscribe`            | Direct subscription event                     |
| `subscription_event`      | `optin` or `unsubscribe` | Mapped based on `channelConsents.email` value |


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

## API Details

### Endpoints

- **API Type**: Events/Tracking API
- **Base URL**: `https://api.bluecore.app`
- **Endpoint**: `/api/track/mobile/v1`
- **Method**: POST
- **Authentication**: Namespace token passed in request payload as `token` field

## Data Mapping and Processing

The integration uses configuration-driven field mapping for transforming RudderStack events to Bluecore's format. Events are processed in real-time with custom event name mapping and automatic product array normalization.

For detailed field mappings, transformation flows, and business logic, see the [Business Logic Documentation](./docs/businesslogic.md).

## Error Handling

The integration implements comprehensive error handling for configuration, instrumentation, and network errors. Errors are propagated to RudderStack's error handling system without custom retry logic.

### Common Error Types

- **Configuration Errors**: Missing or invalid Bluecore namespace
- **Instrumentation Errors**: Missing identifiers or event names, unsupported message types
- **Network Errors**: API connectivity issues, authentication failures, rate limiting

For detailed error handling logic, see the [Business Logic Documentation](./docs/businesslogic.md).

## Testing

### Unit Tests

- **Location**: `./src/cdk/v2/destinations/bluecore`
- **Running Tests**: `npm run test:ts -- unit --destination=bluecore`

### Integration Tests

- **Location**: `./test/integrations/destinations/bluecore`
- **Running Tests**: `npm run test:ts -- component --destination=bluecore`

## Performance

### Throughput and Limitations

- **No Batching**: Events are sent individually for real-time processing
- **API Used**: Events/Tracking API (endpoint: `https://api.bluecore.app/api/track/mobile/v1`)
- **Payload Limits**: Standard HTTP payload limits apply
- **Network Considerations**: Each event requires a separate API call
- **Rate Limiting**: Specific rate limits are not publicly documented for the Events/Tracking API

## Version Information

### Current Implementation

- **Version**: CDK v2 (Component Development Kit v2)
- **Implementation Language**: JavaScript
- **Framework**: RudderStack CDK v2 with YAML workflow processing
- **Status**: Beta

### API Version Details

- **Bluecore API**: Events/Tracking API
- **RudderStack Integration**: Uses Events/Tracking API (endpoint: `https://api.bluecore.app/api/track/mobile/v1`)
- **Authentication**: Namespace token passed in request payload
- **Versioning Strategy**: Bluecore's API versioning strategy is not publicly documented

### Deprecation Information

- **Current Status**: No known deprecation notices
- **End-of-Life**: API version end-of-life information is not publicly available
- **Migration Path**: Migration information is not publicly documented

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
    zip: '94105',
  },
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
  quantity: 1,
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
    email: true,
  },
  source: 'newsletter_signup',
  campaign: 'welcome_series',
});

// Unsubscribe example
rudderanalytics.track('subscription_event', {
  channelConsents: {
    email: false,
  },
  reason: 'user_request',
  source: 'email_footer',
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
      category: 'Electronics',
    },
    {
      product_id: 'prod456',
      sku: 'sku456',
      name: 'Phone Case',
      price: 99.99,
      quantity: 1,
      category: 'Accessories',
    },
  ],
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

| Error Message                                              | Cause                            | Solution                                             |
| ---------------------------------------------------------- | -------------------------------- | ---------------------------------------------------- |
| `[BLUECORE] account namespace required for Authentication` | Missing namespace                | Configure Bluecore namespace in destination settings |
| `property:: distinct_id could not be set`                  | No valid identifier found        | Include email, userId, or external ID in event       |
| `event_name could not be mapped`                           | Missing event name in track call | Include event name in track() call                   |
| `Message type X not supported`                             | Unsupported event type           | Use only identify or track events                    |

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

## General Queries

### Event Ordering Required?

#### Identify Events

- **Required**: Yes, event ordering is recommended for identify events
- **Reason**: Identify events update customer profiles, and out-of-order events could result in older data overwriting newer customer information
- **Impact**: Without proper ordering, customer profiles may contain stale or incorrect data

#### Track Events

- **Required**: Recommended but not strictly necessary for discrete user actions
- **Reason**: Track events are typically timestamped and represent individual user actions
- **Consideration**: For events that update user attributes alongside tracking, ordering becomes more important

#### Subscription Events

- **Required**: Yes, event ordering is recommended for subscription events
- **Reason**: Subscription status changes need to be processed in the correct order to maintain accurate opt-in/opt-out status
- **Impact**: Out-of-order subscription events could result in incorrect email subscription status

### Data Replay Feasibility

#### Missing Data Replay

- **Feasible**: Yes, for track events that don't update user profiles
- **Considerations**:
  - Identify events should be replayed carefully to avoid overwriting newer profile data
  - Consider temporal order when replaying events
  - Monitor for unexpected campaign triggers during replay

#### Already Delivered Data Replay

- **Duplicate Handling**: Bluecore's duplicate event handling capabilities are not publicly documented
- **Recommendation**: Test with small data sets first and coordinate with Bluecore team for large-scale replays
- **Considerations**: May result in duplicate events and campaign triggers

### Multiplexing

#### Multiplexing Support

- **Supported**: No
- **Description**: The Bluecore destination does not generate multiple API calls from a single input event
- **Processing**: Each RudderStack event results in exactly one Bluecore API call

#### Event Processing

- **One-to-One Mapping**: Each RudderStack event maps to one Bluecore event
- **No Event Splitting**: Events are not split into multiple Bluecore events
- **No Event Combining**: Multiple RudderStack events are not combined into single Bluecore events

## References

### Official Documentation

- **Bluecore Platform**: [https://www.bluecore.com/](https://www.bluecore.com/)
- **Bluecore Events API Documentation**: [https://help.bluecore.com/en/articles/6786828-events-api](https://help.bluecore.com/en/articles/6786828-events-api)

**Note**: This integration uses Bluecore's Events API with endpoint `https://api.bluecore.app/api/track/mobile/v1`. The complete API documentation including parameters, event types, and examples is available in the Events API documentation link above.

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

## Performance Considerations

### Batch Processing

- **Not Supported**: Bluecore integration does not support batch processing
- **Individual Events**: Each event is sent individually to the Bluecore API
- **Real-time Processing**: Events are processed immediately upon receipt

### Payload Size

- **API Restrictions**: Standard HTTP payload size limits apply
- **Recommendation**: Keep payloads reasonable to ensure reliable processing

### Rate Limiting

- **API Type**: Events/Tracking API (endpoint: `https://api.bluecore.app/api/track/mobile/v1`)
- **Rate Limits**: Specific rate limits are not publicly documented
- **Best Practices**:
  - Implement reasonable delays between requests to avoid overwhelming the API
  - Monitor response times and error rates to detect potential rate limiting
  - Use event filtering to reduce unnecessary volume

### Caching

- **No Caching**: The integration does not implement caching strategies
- **Stateless Processing**: Each event is processed independently
- **Memory Usage**: Minimal memory footprint due to stateless design

## FAQ

### General Questions

**Q: Why are my events not appearing in Bluecore?**
A: Check that your Bluecore namespace is correctly configured and that events include proper user identification (email, userId, or external ID).

**Q: Can I send custom events to Bluecore?**
A: Yes, you can send custom events. They will be passed through to Bluecore as-is unless you configure custom event mappings.

**Q: How do I handle subscription preferences?**
A: Use the `subscription_event` event type with `channelConsents.email` set to `true` for opt-in or `false` for unsubscribe.

**Q: What happens if I send duplicate events?**
A: Bluecore's duplicate event handling behavior is not publicly documented. Test with small data sets first to understand the behavior.

### Technical Questions

**Q: Why doesn't Bluecore support batching?**
A: The integration prioritizes real-time processing over batch efficiency. Each event is sent individually for immediate processing.

**Q: Can I use device mode with Bluecore?**
A: No, Bluecore only supports cloud mode. All events must be processed through RudderStack's servers.

**Q: How are product arrays handled?**
A: Product arrays are normalized to ensure consistent structure. Product IDs are derived from `product_id`, `sku`, or `id` fields.

### Configuration Questions

**Q: Where do I find my Bluecore namespace?**
A: Log into your Bluecore dashboard and go to Account > Integration Guide. The namespace is shown in the JavaScript code snippet.

**Q: Can I map multiple RudderStack events to the same Bluecore event?**
A: Yes, you can configure multiple source events to map to the same destination event in the event mapping configuration.

**Q: What's the difference between identify and customer_patch events?**
A: `customer_patch` is the Bluecore event type that identify events are mapped to. It's used for creating and updating customer profiles.

---

**Note**: This documentation covers the current implementation of the Bluecore destination integration. For the most up-to-date information about Bluecore's API capabilities and limitations, please refer to the official Bluecore documentation or contact their support team.
