# Bluecore Destination

Implementation in **Javascript**

## Overview

Bluecore is a retail marketing platform that helps brands transform customer data into personalized marketing campaigns. The RudderStack Bluecore integration sends user identification and event data to Bluecore for analysis and campaign targeting.

This integration supports sending identify and track events to Bluecore's API, allowing you to sync user data and track user behavior for personalized marketing campaigns.

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

### Additional Functionalities

- **Event Mapping**: Custom event names can be mapped to Bluecore's standard events
- **Subscription Event Handling**: Special handling for subscription-related events (optin, unsubscribe)

### Validations

- Email is required for proper user identification
- Bluecore namespace is required in the destination configuration
- Only identify and track event types are supported

### Rate Limits

- NEEDS REVIEW: Specific rate limits for Bluecore API not found in the provided information.

## Standard E-commerce Events

Bluecore supports the following standard e-commerce events:

- `viewed_product` - When a user views a product
- `search` - When a user searches for products
- `add_to_cart` - When a user adds a product to cart
- `remove_from_cart` - When a user removes a product from cart
- `wishlist` - When a user adds a product to wishlist
- `purchase` - When a user completes a purchase

## Special Events

Bluecore has special handling for the following events:

- `optin` - When a user subscribes to marketing communications
- `unsubscribe` - When a user unsubscribes from marketing communications
- `subscription_event` - A generic subscription event that will be mapped to either `optin` or `unsubscribe` based on the `channelConsents` property

## Configuration Settings

### Required Settings

- **Bluecore Namespace**: Your Bluecore account namespace (required for authentication)
  - Get it from the URL: `https://app.bluecore.com/admin/dashboard/<namespace>`

### Optional Settings

- **Events Mapping**: Map your custom event names to Bluecore's standard events

## Event Mapping

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
  }
]
```

## API Endpoints

- **Base URL**: `https://api.bluecore.app/api/track/mobile/v1`
- **Identify Endpoint**: Uses the base URL with `customer_patch` event type
- **Track Endpoint**: Uses the base URL with the appropriate event type

## Request Format

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

### Data Mapping

The integration maps RudderStack events to Bluecore's format using the following mapping files:

- `bluecoreCommonConfig.json`: Common properties for all events
- `bluecoreIdentifyConfig.json`: Properties specific to identify events
- `bluecoreTrackConfig.json`: Properties specific to track events

### Exclusion Lists

The integration excludes certain fields from being sent to Bluecore:

- **Identify Exclusion List**: name, firstName, first_name, firstname, lastName, last_name, lastname, email, age, sex, address, action, event
- **Track Exclusion List**: All identify exclusions plus query, order_id, total, products

## General Queries

### Event Ordering Requirements

- **Identify Events**: Event ordering is recommended for identify events to ensure user profiles are updated with the most recent data.
- **Track Events**: Event ordering is not strictly required for track events, as they represent discrete user actions.
- **Subscription Events**: Event ordering is recommended for subscription events to ensure the correct subscription status is maintained.

### Data Replay Feasibility

- **Missing Data Replay**: It is feasible to replay missing data for track events. For identify events, replaying old data might overwrite newer user information, so caution is advised.
- **Already Delivered Data Replay**: NEEDS REVIEW: No information found about Bluecore's handling of duplicate events or event overwriting capabilities.

### Rate Limits and Batch Sizes

- NEEDS REVIEW: Specific rate limits for Bluecore API not found in the provided information.
- The integration does not implement batching, suggesting that Bluecore may not support batch processing or that individual event processing is preferred.

### Version Deprecation Cadence

- **Current Version**: The integration uses Bluecore's mobile tracking API v1.
- **End-of-Life**: NEEDS REVIEW: No information found about API version deprecation.
- **New Version Availability**: NEEDS REVIEW: No information found about newer API versions.

### Additional Documentation

- [Business Logic Documentation](./docs/businesslogic.md)
- [RETL Functionality Documentation](./docs/retl.md)

## Code Examples

### Identify Call

```javascript
rudderanalytics.identify('user123', {
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
});
```

This will be transformed and sent to Bluecore as:

```json
{
  "event": "customer_patch",
  "properties": {
    "token": "dummy_sandbox",
    "distinct_id": "user@example.com",
    "customer": {
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1234567890"
    }
  }
}
```

### Track Call - Product Viewed

```javascript
rudderanalytics.track('Product Viewed', {
  product_id: 'prod123',
  sku: 'sku123',
  name: 'Product Name',
  price: 99.99,
  category: 'Category',
});
```

With event mapping configured to map "Product Viewed" to "viewed_product", this will be sent to Bluecore as:

```json
{
  "event": "viewed_product",
  "properties": {
    "token": "dummy_sandbox",
    "distinct_id": "user@example.com",
    "product_id": "prod123",
    "sku": "sku123",
    "name": "Product Name",
    "price": 99.99,
    "category": "Category",
    "customer": {
      "email": "user@example.com"
    }
  }
}
```

### Optin Event

```javascript
rudderanalytics.track('optin', {
  property1: 'value1',
  property2: 'value2',
  product_id: '123',
});
```

This will be sent to Bluecore as:

```json
{
  "event": "optin",
  "properties": {
    "distinct_id": "test@rudderstack.com",
    "product_id": "123",
    "property1": "value1",
    "property2": "value2",
    "token": "dummy_sandbox",
    "customer": {
      "age": "22",
      "anonymousId": "9c6bd77ea9da3e68",
      "id": "user@1",
      "email": "test@rudderstack.com",
      "phone": "9112340375"
    }
  }
}
```

### Unsubscribe Event

```javascript
rudderanalytics.track('unsubscribe', {
  property1: 'value1',
  property2: 'value2',
  product_id: '123',
});
```

This will be sent to Bluecore as:

```json
{
  "event": "unsubscribe",
  "properties": {
    "distinct_id": "test@rudderstack.com",
    "product_id": "123",
    "property1": "value1",
    "property2": "value2",
    "token": "dummy_sandbox",
    "customer": {
      "age": "22",
      "anonymousId": "9c6bd77ea9da3e68",
      "id": "user@1",
      "email": "test@rudderstack.com",
      "phone": "9112340375"
    }
  }
}
```

### Subscription Event

```javascript
rudderanalytics.track('subscription_event', {
  property1: 'value1',
  property2: 'value2',
  product_id: '123',
  channelConsents: {
    email: true, // true for optin, false for unsubscribe
  },
});
```

This will be sent to Bluecore as:

```json
{
  "event": "optin", // or "unsubscribe" if channelConsents.email is false
  "properties": {
    "distinct_id": "test@rudderstack.com",
    "product_id": "123",
    "property1": "value1",
    "property2": "value2",
    "token": "dummy_sandbox",
    "age": "22",
    "anonymousId": "9c6bd77ea9da3e68",
    "id": "user@1",
    "email": "test@rudderstack.com",
    "phone": "9112340375"
  }
}
```

## Troubleshooting

### Common Issues

- **Events Not Appearing in Bluecore**: Check namespace and event format
- **User Properties Not Updating**: Ensure proper user identification with email
- **Mapping Not Working**: Verify event mapping configuration
- **Subscription Events Not Working**: Make sure email is included in the properties and check the format of the `channelConsents` property for subscription_event

## References

- **Official Documentation**: [Bluecore API Documentation](https://www.bluecore.app/api-docs)
- **Support Channels**: [RudderStack Support](https://rudderstack.com/join-rudderstack-slack-community)
