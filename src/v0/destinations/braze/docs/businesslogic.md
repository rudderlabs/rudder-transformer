# Braze Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Braze destination integration. It covers how RudderStack events are mapped to Braze's API format and the special handling for various event types.

## Event Mappings

### Identify Events

Identify events are mapped to Braze's user profile updates. The following transformations occur:

1. User traits are mapped to Braze user attributes
2. If an anonymousId is present, it's set as a user alias with the label "rudder_id"
3. The userId is mapped to Braze's external_id
4. If brazeExternalId is specified in context.externalId, it's used instead of userId

### Track Events

Track events are mapped to Braze custom events. The following transformations occur:

1. Event name is preserved as the Braze event name
2. Event properties are included as Braze event properties
3. Reserved properties are handled according to Braze specifications
4. If the event name is "Order Completed", it's treated as a purchase event

### Page/Screen Events

Page and Screen events are mapped to Braze custom events with the following naming convention:

- Page events: "Viewed {category} {name} Page"
- Screen events: "Viewed {name} Screen"

### Group Events

Group events update user attributes with group information and can optionally update subscription groups if enabled.

### Alias Events

Alias events are used for identity resolution in Braze, merging anonymous users with identified users.

## Special Handling

### Purchase Events

Purchase events (Track events with name "Order Completed") receive special handling:

1. Products array is extracted from properties
2. Each product is converted to a Braze purchase object
3. Standard purchase properties (product_id, sku, price, quantity, currency) are mapped directly
4. Additional product properties are included in the purchase object

### Deduplication Logic

When deduplication is enabled:

1. The transformer maintains a user store with previously sent attributes
2. For each user, attributes that have already been sent are removed from subsequent requests
3. If all attributes for a user have been sent before, the user is dropped from the request

### Custom Attribute Operations

The transformer supports various operations on custom attributes:

- **Remove**: Delete an attribute from a user profile
- **Update**: Update an existing attribute
- **Add**: Add a value to an array attribute
- **Create**: Create a new attribute

## Reserved Properties

Certain properties are reserved by Braze and handled specially:

- Non-billable attributes: country, language, email_subscribe, push_subscribe, subscription_groups
- Purchase standard properties: product_id, sku, price, quantity, currency

## Mapping Configuration

The mapping configuration is defined in JSON files within the destination directory:

- `mapping.json`: Defines how RudderStack events map to Braze events
- `config.js`: Contains constants and configuration for the destination

## Implementation Examples

### Example: Track Event Transformation

```javascript
// Input RudderStack event
{
  "type": "track",
  "event": "Product Added",
  "userId": "user123",
  "properties": {
    "product_id": "prod456",
    "name": "Running Shoes",
    "price": 89.99,
    "currency": "USD"
  }
}

// Transformed Braze event
{
  "events": [
    {
      "name": "Product Added",
      "time": "2023-01-01T12:00:00.000Z",
      "properties": {
        "product_id": "prod456",
        "name": "Running Shoes",
        "price": 89.99,
        "currency": "USD"
      },
      "external_id": "user123"
    }
  ],
  "partner": "RudderStack"
}
```

### Example: Purchase Event Transformation

```javascript
// Input RudderStack event
{
  "type": "track",
  "event": "Order Completed",
  "userId": "user123",
  "properties": {
    "order_id": "order789",
    "revenue": 99.99,
    "currency": "USD",
    "products": [
      {
        "product_id": "prod456",
        "name": "Running Shoes",
        "price": 89.99,
        "quantity": 1,
        "currency": "USD"
      }
    ]
  }
}

// Transformed Braze event
{
  "purchases": [
    {
      "product_id": "prod456",
      "price": 89.99,
      "currency": "USD",
      "quantity": 1,
      "time": "2023-01-01T12:00:00.000Z",
      "external_id": "user123"
    }
  ],
  "attributes": [
    {
      "external_id": "user123",
      // User attributes if any
    }
  ],
  "partner": "RudderStack"
}
```
