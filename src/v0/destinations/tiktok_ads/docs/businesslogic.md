# TikTok Ads Business Logic and Mappings

## Overview

This document details the business logic, field mappings, and data transformation flows for the TikTok Ads destination integration.

## Event Processing Flow

### Track Event Processing

1. **Event Validation**

   - Validate event name is present and is a string
   - Check if event is allowed based on configuration

2. **Event Name Resolution**

   - Check built-in event mappings (`eventNameMapping`)
   - Check custom event mappings (`eventsToStandard`)
   - Validate against TikTok standard events if custom events are disabled

3. **Payload Construction**

   - Map RudderStack event fields to TikTok format
   - Process user data and apply hashing if enabled
   - Handle product arrays and content mapping

4. **Version-Specific Processing**
   - Route to v1 or v2 transform based on configuration
   - Apply version-specific field mappings and validations

## Field Mappings

### Common Fields (Both Versions)

| RudderStack Field          | TikTok Field             | Notes                           |
| -------------------------- | ------------------------ | ------------------------------- |
| `messageId`                | `event_id`               | Used for deduplication          |
| `properties.eventId`       | `event_id`               | Takes precedence over messageId |
| `properties.testEventCode` | `test_event_code`        | For testing purposes            |
| `properties.contents`      | `properties.contents`    | Product array                   |
| `properties.currency`      | `properties.currency`    | ISO currency code               |
| `properties.value`         | `properties.value`       | Event value                     |
| `properties.description`   | `properties.description` | Event description               |
| `properties.query`         | `properties.query`       | Search query                    |

### Events 1.0 (v1) Specific Fields

| RudderStack Field       | TikTok Field                  | Notes                |
| ----------------------- | ----------------------------- | -------------------- |
| `timestamp`             | `timestamp`                   | ISO format timestamp |
| `properties.category`   | `properties.content_category` | Content category     |
| `properties.name`       | `properties.content_name`     | Content name         |
| `properties.product_id` | `properties.content_id`       | Converted to string  |
| `properties.clickId`    | `context.ad.callback`         | Click tracking       |
| `context.ip`            | `context.ip`                  | User IP address      |
| `context.userAgent`     | `context.user_agent`          | User agent string    |

### Events 2.0 (v2) Specific Fields

| RudderStack Field             | TikTok Field       | Notes                              |
| ----------------------------- | ------------------ | ---------------------------------- |
| `timestamp`                   | `event_time`       | Unix timestamp (seconds), required |
| `properties.limited_data_use` | `limited_data_use` | Privacy compliance                 |
| `properties.url`              | `page.url`         | Page URL                           |
| `properties.referrer`         | `page.referrer`    | Page referrer                      |
| `context.locale`              | `user.locale`      | User locale                        |
| `properties.ttclid`           | `user.ttclid`      | TikTok click ID                    |
| `properties.ttp`              | `user.ttp`         | TikTok tracking parameter          |
| `traits.email`                | `user.email`       | User email (hashed)                |
| `traits.phone`                | `user.phone`       | User phone (hashed)                |
| `context.ip`                  | `user.ip`          | User IP address                    |
| `context.userAgent`           | `user.user_agent`  | User agent string                  |
| `firstName`                   | `user.first_name`  | Hashed first name                  |
| `lastName`                    | `user.last_name`   | Hashed last name                   |
| `context.traits.city`         | `user.city`        | User city                          |
| `context.traits.country`      | `user.country`     | User country                       |
| `context.traits.state`        | `user.state`       | User state                         |
| `zipcode`                     | `user.zip_code`    | Hashed zip code                    |

## Event Name Mappings

### Built-in Event Mappings

The destination includes built-in mappings for common e-commerce events:

```javascript
const eventNameMapping = {
  'product added to wishlist': 'AddToWishlist',
  'product added': 'AddToCart',
  'checkout started': 'InitiateCheckout',
  'payment info entered': 'AddPaymentInfo',
  'checkout step completed': 'CompletePayment',
  'order completed': 'PlaceAnOrder',
  viewcontent: 'ViewContent',
  clickbutton: 'ClickButton',
  search: 'Search',
  contact: 'Contact',
  download: 'Download',
  submitform: 'SubmitForm',
  completeregistration: 'CompleteRegistration',
  subscribe: 'Subscribe',
  purchase: 'Purchase',
  lead: 'Lead',
  customizeproduct: 'CustomizeProduct',
  findlocation: 'FindLocation',
  schedule: 'Schedule',
};
```

### TikTok Standard Events

Supported standard events include:

- **E-commerce**: AddToCart, AddToWishlist, InitiateCheckout, AddPaymentInfo, CompletePayment, PlaceAnOrder, Purchase
- **Engagement**: ViewContent, ClickButton, Search, Contact, Download, SubmitForm
- **Registration**: CompleteRegistration, Subscribe
- **Custom**: CustomizeProduct, FindLocation, Schedule
- **Beta**: Lead, Purchase (marked as beta in UI)

## Product Content Processing

### Products Array Transformation

RudderStack's `properties.products` array is transformed into TikTok's `contents` format:

```javascript
// Input: RudderStack format
{
  "properties": {
    "products": [
      {
        "product_id": "1077218",
        "name": "Socks",
        "category": "Apparel",
        "price": 8,
        "quantity": 2
      }
    ]
  }
}

// Output: TikTok format
{
  "properties": {
    "contents": [
      {
        "content_id": "1077218",
        "content_name": "Socks",
        "content_category": "Apparel",
        "content_type": "product",
        "price": 8,
        "quantity": 2
      }
    ]
  }
}
```

### Content Type Handling

- **Default Content Type**:
  - v1: `product_group`
  - v2: `product`
- **Priority**: `product.contentType` > `properties.contentType` > `properties.content_type` > default
- **Automatic Assignment**: Applied when `content_type` is missing from individual products

## User Data Processing

### Hashing Logic

When `hashUserProperties` is enabled (default: true):

1. **Email Processing**:

   - Trim whitespace
   - Convert to lowercase
   - Apply SHA-256 hashing

2. **Phone Processing**:

   - Trim whitespace
   - Apply SHA-256 hashing
   - Supports both single values and arrays

3. **External ID Processing**:

   - Trim whitespace
   - Apply SHA-256 hashing
   - Supports both single values and arrays

4. **Additional Fields**:
   - **Note**: Additional fields like first name, last name, and zip code are handled by the mapping configuration
   - All fields use the same hashing logic: trim whitespace, then apply SHA-256 hashing
   - Field availability depends on the version-specific mapping configuration

## Validation Requirements

### Required Fields

1. **Configuration Level**:

   - `pixelCode`: Always required
   - `accessToken`: Required for cloud mode

2. **Event Level**:
   - `event`: Must be non-empty string
   - `type`: Must be "track"

### Event Name Validation

1. **Basic Validation**: Event name must be a string
2. **Custom Events Disabled**: Event must be either:
   - In built-in `eventNameMapping`
   - Mapped via `eventsToStandard` configuration
   - A valid TikTok standard event

### Data Type Conversions

- **String Conversion**: `content_id`, `shop_id`, `order_id` automatically converted to strings
- **Timestamp Conversion**: v2 converts ISO timestamps to Unix seconds
- **Array Handling**: Single values converted to arrays where TikTok expects arrays

## Error Handling

### Common Error Scenarios

1. **Configuration Errors**:

   - Missing Access Token: `ConfigurationError`
   - Missing Pixel Code: `ConfigurationError`

2. **Validation Errors**:

   - Invalid event name: `InstrumentationError`
   - Missing event type: `InstrumentationError`
   - Unsupported message type: `InstrumentationError`

3. **Network Errors**:
   - Rate limit (40100): `ThrottledError`
   - Auth errors (40001, 40002): `AbortedError`

## Use Cases

### E-commerce Tracking

Track the complete customer journey from product discovery to purchase:

1. **Product Discovery**: `ViewContent` events
2. **Interest**: `AddToWishlist` events
3. **Intent**: `AddToCart`, `InitiateCheckout` events
4. **Conversion**: `CompletePayment`, `PlaceAnOrder` events

### Lead Generation

Track user engagement and lead capture:

1. **Engagement**: `ClickButton`, `ViewContent` events
2. **Interest**: `Contact`, `Download` events
3. **Conversion**: `SubmitForm`, `CompleteRegistration`, `Lead` events

### Content Engagement

Track user interaction with content:

1. **Discovery**: `Search` events
2. **Engagement**: `ViewContent`, `ClickButton` events
3. **Subscription**: `Subscribe` events

## Best Practices

1. **Event Naming**: Use consistent event names that map to TikTok standard events
2. **Product Data**: Always include `product_id` for e-commerce events
3. **User Data**: Provide as much user context as possible for better ad targeting
4. **Event IDs**: Include unique `event_id` for deduplication and replay scenarios
5. **Testing**: Use `test_event_code` for testing before production deployment
