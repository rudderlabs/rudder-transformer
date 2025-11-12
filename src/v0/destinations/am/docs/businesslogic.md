# Amplitude Business Logic and Mappings

## Overview

This document outlines the business logic and mappings used in the Amplitude destination integration. It covers how RudderStack events are mapped to Amplitude's API format, the specific API endpoints used for each event type, and the special handling for various event types.

## Field Mappings

### Common Field Mappings

| RudderStack Field | Amplitude Field | Notes                                      |
| ----------------- | --------------- | ------------------------------------------ |
| `userId`          | `user_id`       | Required if device_id is not present       |
| `anonymousId`     | `device_id`     | Required if user_id is not present         |
| `messageId`       | `insert_id`     | Used for deduplication on Amplitude's side |
| `timestamp`       | `time`          | Converted to milliseconds if needed        |
| `context.ip`      | `ip`            | Used for geolocation                       |
| `context.library` | `library`       | Set to "rudderstack"                       |

### Device and OS Information

| RudderStack Field             | Amplitude Field       | Notes                                      |
| ----------------------------- | --------------------- | ------------------------------------------ |
| `context.os.name`             | `os_name`             | For web, extracted from user agent         |
| `context.os.version`          | `os_version`          | For web, extracted from user agent         |
| `context.device.model`        | `device_model`        | For web, extracted from user agent         |
| `context.device.manufacturer` | `device_manufacturer` | For web, extracted from user agent         |
| `context.device.type`         | `platform`            | For web, set to "Web"                      |
| `context.device.brand`        | `device_brand`        | Only included if mapDeviceBrand is enabled |

### Location Information

| RudderStack Field            | Amplitude Field | Notes                |
| ---------------------------- | --------------- | -------------------- |
| `context.location.latitude`  | `location_lat`  | Used for geolocation |
| `context.location.longitude` | `location_lng`  | Used for geolocation |
| `context.location.city`      | `city`          | Used for geolocation |
| `context.location.country`   | `country`       | Used for geolocation |
| `context.location.region`    | `region`        | Used for geolocation |

## API Endpoints and Request Flow

### Identify Events

**Primary Endpoint**: `/2/httpapi`
**Documentation**: [Amplitude HTTP API V2](https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/)

**Request Flow**:

1. Identify events are sent to the `/2/httpapi` endpoint
2. The event_type is set to `$identify` (special Amplitude identifier)
3. User traits are mapped to user_properties in the Amplitude payload
4. If Enhanced User Operations is enabled, user properties are processed with operations like $set, $setOnce, etc.

**Transformations**:

1. User traits are mapped to Amplitude user properties
2. The userId is mapped to Amplitude's user_id
3. The anonymousId is mapped to Amplitude's device_id
4. Device and OS information is extracted from context and mapped to Amplitude fields

**Example Payload**:

```json
{
  "api_key": "YOUR_API_KEY",
  "events": [
    {
      "event_type": "$identify",
      "user_id": "user123",
      "device_id": "device456",
      "user_properties": {
        "name": "John Doe",
        "email": "john@example.com",
        "plan": "premium"
      },
      "time": 1609459200000,
      "insert_id": "message123"
    }
  ]
}
```

### Track Events

**Primary Endpoint**: `/2/httpapi`
**Documentation**: [Amplitude HTTP API V2](https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/)

**Request Flow**:

1. Track events are sent to the `/2/httpapi` endpoint
2. The event name is used as the event_type in Amplitude
3. Event properties are included as event_properties in Amplitude
4. If the event has revenue, special revenue handling is applied

**Transformations**:

1. Event name is preserved as the Amplitude event_type
2. Event properties are included as Amplitude event_properties
3. User traits (if present) are included as user_properties
4. Device and OS information is extracted from context

**Example Payload**:

```json
{
  "api_key": "YOUR_API_KEY",
  "events": [
    {
      "event_type": "Product Viewed",
      "user_id": "user123",
      "device_id": "device456",
      "event_properties": {
        "product_id": "prod123",
        "product_name": "Example Product",
        "price": 99.99,
        "currency": "USD"
      },
      "time": 1609459200000,
      "insert_id": "message123"
    }
  ]
}
```

### Page/Screen Events

**Endpoint**: `/2/httpapi`
**Documentation**: [Amplitude HTTP API V2](https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/)

**Request Flow**:

1. Page/Screen events are sent to the `/2/httpapi` endpoint
2. The event name is determined based on configuration:
   - For Page events: "Viewed [Category] [Name] Page" or custom name
   - For Screen events: "Viewed [Name] Screen" or custom name
3. Page/Screen properties are included as event_properties

**Transformations**:

- Page events: Properties like title, path, url, referrer are mapped to event_properties
- Screen events: The screen name is mapped to event_properties.screen_name

**Example Page Event Payload**:

```json
{
  "api_key": "YOUR_API_KEY",
  "events": [
    {
      "event_type": "Viewed Home Page",
      "user_id": "user123",
      "device_id": "device456",
      "event_properties": {
        "title": "Home",
        "path": "/home",
        "url": "https://example.com/home",
        "referrer": "https://google.com"
      },
      "time": 1609459200000,
      "insert_id": "message123"
    }
  ]
}
```

**Example Screen Event Payload**:

```json
{
  "api_key": "YOUR_API_KEY",
  "events": [
    {
      "event_type": "Viewed Profile Screen",
      "user_id": "user123",
      "device_id": "device456",
      "event_properties": {
        "screen_name": "Profile"
      },
      "time": 1609459200000,
      "insert_id": "message123"
    }
  ]
}
```

### Group Events

**Primary Endpoint**: `/2/httpapi`
**Secondary Endpoint**: `/groupidentify`
**Documentation**:

- [Amplitude HTTP API V2](https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/)
- [Amplitude Group Identify API](https://www.docs.developers.amplitude.com/analytics/apis/group-identify-api/)

**Request Flow**:

1. Group events are sent to the `/2/httpapi` endpoint with event_type set to `$identify`
2. Group information is added to the `groups` object in the payload
3. Group information is also added to user_properties
4. A separate request is made to the `/groupidentify` endpoint to update group properties

**Transformations**:

1. Group type and value are determined from configuration or event properties
2. Group information is added to the `groups` object
3. Group information is also added to user_properties
4. Group traits are sent as group properties to the `/groupidentify` endpoint

**Example HTTP API Payload**:

```json
{
  "api_key": "YOUR_API_KEY",
  "events": [
    {
      "event_type": "$identify",
      "user_id": "user123",
      "device_id": "device456",
      "user_properties": {
        "company_id": "company123"
      },
      "groups": {
        "company_id": "company123"
      },
      "time": 1609459200000,
      "insert_id": "message123"
    }
  ]
}
```

**Example Group Identify Payload**:

```json
{
  "api_key": "YOUR_API_KEY",
  "identification": [
    {
      "group_type": "company_id",
      "group_value": "company123",
      "group_properties": {
        "name": "Example Company",
        "plan": "enterprise",
        "employees": 500
      }
    }
  ]
}
```

### Alias Events

**Endpoint**: `/2/httpapi`
**Documentation**: [Amplitude HTTP API V2](https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/)

**Request Flow**:

1. Alias events are sent to the `/2/httpapi` endpoint
2. The userId is mapped to global_user_id
3. The previousId is mapped to user_id
4. If unmap is set in integrations.Amplitude, special handling is applied

**Transformations**:

1. userId is mapped to global_user_id
2. previousId is mapped to user_id
3. If unmap is set, global_user_id is removed and user_id is set to the unmap value

**Example Payload**:

```json
{
  "api_key": "YOUR_API_KEY",
  "mapping": [
    {
      "user_id": "previous123",
      "global_user_id": "user123",
      "insert_id": "message123"
    }
  ]
}
```

## Special Handling

### Revenue Events

**Endpoint**: `/2/httpapi`
**Documentation**: [Amplitude HTTP API V2](https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/)

Track events with revenue property receive special handling:

1. Revenue amount is extracted from properties.revenue
2. Revenue properties (price, quantity, etc.) are set at the root level
3. These properties are removed from event_properties to avoid duplication
4. If trackRevenuePerProduct is enabled, each product generates a separate revenue event

**Example Transformation**:

```javascript
// Original event
{
  "type": "track",
  "event": "Order Completed",
  "properties": {
    "revenue": 50.0,
    "currency": "USD",
    "products": [...]
  }
}

// Transformed to Amplitude event
{
  "event_type": "Order Completed",
  "user_id": "...",
  "device_id": "...",
  "revenue": 50.0,
  "price": 50.0,
  "quantity": 1,
  "revenue_type": "Order Completed",
  "event_properties": {
    "currency": "USD",
    "products": [...]
  }
}
```

### E-commerce Events

**Endpoint**: `/2/httpapi`
**Documentation**: [Amplitude HTTP API V2](https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/)

E-commerce events receive special handling:

1. If trackProductsOnce is enabled, each product in an order generates a separate "Product Purchased" event
2. Product properties are mapped to event_properties
3. If trackRevenuePerProduct is enabled, revenue is tracked for each product

**Example Transformation**:

```javascript
// Original event
{
  "type": "track",
  "event": "Order Completed",
  "properties": {
    "products": [
      {
        "product_id": "123",
        "name": "Product A",
        "price": 20.0,
        "quantity": 1
      },
      {
        "product_id": "456",
        "name": "Product B",
        "price": 30.0,
        "quantity": 1
      }
    ]
  }
}

// Transformed to multiple Amplitude events
[
  {
    "event_type": "Order Completed",
    "user_id": "...",
    "device_id": "...",
    "event_properties": {
      "products": [...]
    }
  },
  {
    "event_type": "Product Purchased",
    "user_id": "...",
    "device_id": "...",
    "event_properties": {
      "product_id": "123",
      "name": "Product A",
      "price": 20.0,
      "quantity": 1
    }
  },
  {
    "event_type": "Product Purchased",
    "user_id": "...",
    "device_id": "...",
    "event_properties": {
      "product_id": "456",
      "name": "Product B",
      "price": 30.0,
      "quantity": 1
    }
  }
]
```

### User Property Operations

**Endpoint**: `/2/httpapi`
**Documentation**: [Amplitude HTTP API V2](https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/)

When Enhanced User Operations is enabled, user properties are processed with operations:

1. Properties specified in traitsToIncrement are added to $add operation
2. Properties specified in traitsToSetOnce are added to $setOnce operation
3. Properties specified in traitsToAppend are added to $append operation
4. Properties specified in traitsToPrepend are added to $prepend operation
5. Properties specified in integrations.Amplitude.fieldsToUnset are added to $unset operation
6. Other properties are added to $set operation

**Example Transformation**:

```javascript
// Configuration
{
  "traitsToIncrement": ["visits"],
  "traitsToSetOnce": ["first_name"],
  "traitsToAppend": ["tags"],
  "traitsToPrepend": ["recent_items"]
}

// Original event
{
  "type": "identify",
  "traits": {
    "visits": 1,
    "first_name": "John",
    "last_name": "Doe",
    "tags": ["tag1"],
    "recent_items": ["item1"],
    "email": "john@example.com"
  },
  "integrations": {
    "Amplitude": {
      "fieldsToUnset": ["old_field"]
    }
  }
}

// Transformed to Amplitude event
{
  "event_type": "$identify",
  "user_id": "...",
  "device_id": "...",
  "user_properties": {
    "$add": {
      "visits": 1
    },
    "$setOnce": {
      "first_name": "John"
    },
    "$append": {
      "tags": ["tag1"]
    },
    "$prepend": {
      "recent_items": ["item1"]
    },
    "$set": {
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "$unset": {
      "old_field": "-"
    }
  }
}
```

### Skip User Properties Sync

When `integrations.Amplitude.skipUserPropertiesSync` is set to true, the `$skip_user_properties_sync` flag is added to the payload. This prevents Amplitude from syncing user properties across projects.

**Example**:

```javascript
// Original event
{
  "type": "identify",
  "traits": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "integrations": {
    "Amplitude": {
      "skipUserPropertiesSync": true
    }
  }
}

// Transformed to Amplitude event
{
  "event_type": "$identify",
  "user_id": "...",
  "device_id": "...",
  "$skip_user_properties_sync": true,
  "user_properties": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## User Deletion

**Endpoint**: `/api/2/deletions/users`
**Documentation**: [Amplitude User Privacy API](https://www.docs.developers.amplitude.com/analytics/apis/user-privacy-api/)

User deletion requests are processed as follows:

1. User IDs are batched (up to 100 users per batch)
2. Each batch is sent to the `/api/2/deletions/users` endpoint
3. Authentication uses both API Key and Secret Key
4. Requests include `requester: "RudderStack"` and `ignore_invalid_id: "true"`

**Example Request**:

```json
{
  "user_ids": ["user123", "user456", "user789"],
  "requester": "RudderStack",
  "ignore_invalid_id": "true"
}
```

## Validations

### Required Fields

- **API Key**: Must be provided in the destination configuration
- **User ID or Device ID**: Either user_id or device_id must be specified for all events
- **Event Type**: Event type is required for all events

### Field Format Validations

- **User ID**: Should be a string
- **Device ID**: Should be a string
- **Event Type**: Should be a string
- **Event ID**: If provided, should be an integer

### Error Handling

- If neither user_id nor device_id is provided, an error is thrown: "Either of user ID or device ID fields must be specified"
- If event type is missing, an error is thrown: "Event type is missing. Please send it under `event.type`. For page/screen events, send it under `event.name`"
- If API key is not provided, an error is thrown: "No API Key is Found. Please Configure API key from dashbaord"

## Mapping Configuration

The mapping configuration is defined in JSON files within the destination directory:

- `AmplitudeIdentifyConfig.json`: Mapping for Identify events
- `AmplitudePageConfig.json`: Mapping for Page events
- `AmplitudeScreenConfig.json`: Mapping for Screen events
- `AmplitudeGroupConfig.json`: Mapping for Group events
- `AmplitudeAliasConfig.json`: Mapping for Alias events
- `AmplitudeDefaultConfig.json`: Default mapping for all events
- `AmplitudeCommonConfig.json`: Common mappings used across all events
- `AmplitudeRevenueConfig.json`: Mapping for revenue events
- `AmplitudeProductActionsConfig.json`: Mapping for product-related events
- `AmplitudePromotionViewedConfig.json`: Mapping for promotion viewed events
- `AmplitudePromotionClickedConfig.json`: Mapping for promotion clicked events

## General Use Cases

### User Analytics

Amplitude is primarily used for user analytics, allowing you to track user behavior and understand how users interact with your product. Common use cases include:

- **User Engagement**: Track how users engage with your product, including which features they use and how often
- **Conversion Funnel Analysis**: Track user progression through conversion funnels
- **Retention Analysis**: Understand how well your product retains users over time
- **User Segmentation**: Segment users based on behavior, demographics, or other attributes

### Product Analytics

Amplitude is also used for product analytics, allowing you to understand how your product is performing and identify areas for improvement:

- **Feature Usage**: Track which features are most popular and which are underutilized
- **Performance Monitoring**: Track performance metrics like load times and error rates
- **A/B Testing**: Compare the performance of different product versions or features
- **Revenue Analysis**: Track revenue and understand which features or user segments generate the most revenue

### E-commerce Analytics

For e-commerce businesses, Amplitude can be used to track the customer journey and optimize the shopping experience:

- **Product Views**: Track which products are viewed most frequently
- **Cart Abandonment**: Identify where in the checkout process users abandon their carts
- **Purchase Behavior**: Understand what factors influence purchase decisions
- **Customer Lifetime Value**: Track customer lifetime value and identify high-value customer segments
