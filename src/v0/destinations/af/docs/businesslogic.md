# AppsFlyer Business Logic and Mappings

## Overview

This document details the business logic, event mappings, validation requirements, and data flow for the AppsFlyer destination integration.

## Event Type Processing

### Track Events

Track events are the primary event type processed by the AppsFlyer destination. The processing logic varies based on the event name and follows predefined mapping configurations.

#### Event Classification

The destination categorizes track events into specific types based on the event name:

| Event Name                       | AppsFlyer Category | Configuration File               |
| -------------------------------- | ------------------ | -------------------------------- |
| `order completed`                | Purchase           | AFPurchaseConfig.json            |
| `product added to wishlist`      | Cart/Wishlist      | AFAddToCartOrWishlistConfig.json |
| `wishlist product added to cart` | Cart/Wishlist      | AFAddToCartOrWishlistConfig.json |
| `checkout started`               | Cart/Wishlist      | AFAddToCartOrWishlistConfig.json |
| `product removed`                | Default            | AFDefaultConfig.json             |
| `product searched`               | Search             | AFSearchConfig.json              |
| `product viewed`                 | Content View       | AFContentViewConfig.json         |
| All other events                 | Default            | AFDefaultConfig.json             |

#### Multi-Product Support

For e-commerce events with a `products` array, the destination provides enhanced multi-product support:

**Supported Events**: `order completed`, `product added to wishlist`, `wishlist product added to cart`, `checkout started`, `product removed`, `product searched`, `product viewed`

**Processing Logic**:

1. Extracts `product_id`, `quantity`, and `price` from each product in the array
2. Creates arrays for AppsFlyer's multi-product format:
   - `af_content_id`: Array of product IDs
   - `af_quantity`: Array of quantities
   - `af_price`: Array of prices

### Page Events

Page events are converted to AppsFlyer events with configurable naming:

**Rich Event Names Enabled**:

- Event Name: `Viewed [Page Name] Page`
- Page Name Source: `message.name` → `message.properties.name` → empty string

**Rich Event Names Disabled**:

- Event Name: `page`

**Event Value**: JSON stringified object containing page properties

### Screen Events

Screen events follow the same pattern as page events:

**Rich Event Names Enabled**:

- Event Name: `Viewed [Screen Name] Screen`
- Screen Name Source: `message.name` → `message.event` → `message.properties.name` → empty string

**Rich Event Names Disabled**:

- Event Name: `screen`

**Event Value**: JSON stringified object containing screen properties

## Property Mappings

### Purchase Events (Order Completed)

```json
{
  "properties.revenue": "af_revenue",
  "properties.price": "af_price",
  "properties.product_id": "af_content_id",
  "properties.category": "af_content_type",
  "properties.quantity": "af_quantity",
  "properties.order_id": "af_order_id"
}
```

### Cart/Wishlist Events

```json
{
  "properties.price": "af_price",
  "properties.category": "af_content_type",
  "properties.product_id": "af_content_id",
  "properties.quantity": "af_quantity"
}
```

### Content View Events (Product Viewed)

```json
{
  "properties.price": "af_price",
  "properties.category": "af_content_type",
  "properties.product_id": "af_content_id"
}
```

### Search Events (Product Searched)

```json
{
  "properties.query": "af_search_string"
}
```

### Default Events

```json
{
  "properties.revenue": "af_revenue",
  "properties.quantity": "af_quantity",
  "properties.price": "af_price"
}
```

## Property Handling Logic

### Root Level Properties

When `addPropertiesAtRoot` is enabled:

- All event properties are added at the root level of the payload
- No nested "properties" object is created

When `addPropertiesAtRoot` is disabled:

- Properties are nested under a "properties" object
- Specific properties can be promoted to root level via `listOfProps` configuration

### Currency Handling

When `afCurrencyAtRoot` is enabled:

- `properties.currency` is mapped to `af_currency` at the root level
- Provides AppsFlyer with currency information for revenue events

### List of Properties

The `listOfProps` configuration allows selective promotion of properties to root level:

- Only applies when `addPropertiesAtRoot` is disabled
- Specified properties are moved from nested properties to root level
- Remaining properties stay in the nested "properties" object

## Validation Requirements

### Mandatory Fields

#### AppsFlyer ID

- **Field**: `appsflyerExternalId` in message context
- **Requirement**: Must be present for all events
- **Error**: "Appsflyer id is not set. Rejecting the event"

#### Operating System and App ID

- **Android Events**: Require `androidAppId` configuration
- **iOS Events**: Require `appleAppId` configuration
- **Validation**: OS name from `context.os.name` must match configured App ID
- **Error**: "os name is required along with the respective appId"

#### Authentication

- **v1 Authorization**: Requires `devKey` configuration
- **v2 Authorization**: Requires `s2sKey` configuration
- **Validation**: Appropriate key must be present based on `authVersion`
- **Errors**:
  - "No authentication key is present. Aborting."
  - "s2s key is mandatory for v2 authorization. Aborting."
  - "dev key is mandatory for v1 authorization. Aborting."

### Optional Field Validation

#### Device Information

- **IDFA** (iOS): Extracted from `context.device.advertisingId`
- **IDFV** (iOS): Extracted from `context.device.id`
- **Google Advertising ID** (Android): Extracted from `context.device.advertisingId`
- **ATT Status**: Extracted from `context.device.attTrackingStatus`

#### App Information

- **App Version**: Extracted from `context.app.version` → `app_version_name`
- **Bundle Identifier**: Extracted from `context.app.namespace` → `bundleIdentifier`

## Data Flow Logic

### 1. Event Reception

- Receive RudderStack event (Track, Page, or Screen)
- Extract message type and validate supported type

### 2. Authentication Validation

- Check `authVersion` configuration
- Validate presence of required authentication key
- Determine API endpoint (v2 or v3)

### 3. AppsFlyer ID Validation

- Extract `appsflyerExternalId` from message context
- Reject event if AppsFlyer ID is missing

### 4. OS and App ID Validation

- Extract OS name from `context.os.name`
- Validate corresponding App ID configuration
- Construct appropriate API endpoint

### 5. Event Processing

- **Track Events**: Apply event-specific mapping configuration
- **Page/Screen Events**: Generate event name based on rich naming setting
- Extract and map properties according to configuration

### 6. Payload Construction

- Build base payload with mandatory fields
- Add device-specific information (IDFA, IDFV, etc.)
- Apply property mappings and transformations
- Handle multi-product arrays for e-commerce events

### 7. Request Building

- Set appropriate API endpoint (v2 or v3)
- Configure authentication headers
- Serialize payload as JSON
- Apply 1KB payload size limit

## Use Cases

### E-commerce Tracking

- **Order Completion**: Track purchases with revenue, product details, and order information
- **Product Interactions**: Monitor product views, wishlist additions, and cart activities
- **Search Behavior**: Capture product search queries and results

### App Analytics

- **Screen Navigation**: Track user movement through app screens
- **Page Views**: Monitor web page interactions and user journeys
- **Custom Events**: Capture business-specific events and user actions

### Attribution and Marketing

- **Campaign Attribution**: Link events to marketing campaigns and media sources
- **User Journey Mapping**: Track user progression from install to conversion
- **Revenue Attribution**: Associate revenue events with acquisition channels

### Privacy and Compliance

- **User Deletion**: Support GDPR compliance through OpenDSR API integration
- **Data Sharing Control**: Implement sharing filters for data privacy
- **ATT Compliance**: Handle iOS App Tracking Transparency requirements

## Error Handling

### Configuration Errors

- Missing authentication keys
- Invalid App ID configurations
- Unsupported message types

### Data Validation Errors

- Missing AppsFlyer ID
- Invalid OS/App ID combinations
- Malformed event data

### API Errors

- Payload size exceeding 1KB limit
- Authentication failures
- Rate limit violations

## Performance Considerations

### Payload Optimization

- JSON payload limited to 1KB per event
- Remove undefined and null values
- Efficient property mapping and transformation

### Concurrency

- Router implementation supports concurrent processing
- Individual events processed independently
- No batching at API level (individual HTTP requests)

### Rate Limiting

- Implement gradual scaling for high-volume scenarios
- Start with 10K TPS and scale incrementally
- Include retry mechanisms for error handling
