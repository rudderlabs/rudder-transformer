# GA4 Business Logic and Mappings

## Overview

The GA4 destination transforms RudderStack events into Google Analytics 4 Measurement Protocol format. This document details the business logic, mappings, and validation rules applied during the transformation process.

## Event Type Handling

### Track Events

**Flow Logic:**

1. **Event Name Validation**: Validates and sanitizes the event name
2. **Reserved Event Check**: Ensures the event name is not in GA4's reserved list
3. **Event Mapping**: Maps RudderStack track events to GA4 events based on predefined configurations
4. **Parameter Mapping**: Transforms event properties to GA4 event parameters
5. **User Properties**: Extracts and maps user properties from context.traits
6. **Items Array**: Handles e-commerce product data when applicable

**Supported E-commerce Events:**

- `Product Clicked` → `select_item`
- `Product Viewed` → `view_item`
- `Product Added` → `add_to_cart`
- `Product Removed` → `remove_from_cart`
- `Cart Viewed` → `view_cart`
- `Checkout Started` → `begin_checkout`
- `Payment Info Entered` → `add_payment_info`
- `Order Completed` → `purchase`
- `Order Refunded` → `refund`
- `Product List Viewed` → `view_item_list`
- `Product Searched` → `search`
- `Product Added to Wishlist` → `add_to_wishlist`
- `Product Shared` → `share`
- `Promotion Viewed` → `view_promotion`
- `Promotion Clicked` → `select_promotion`

**Custom Events:**

- Events not matching predefined mappings are sent as custom events
- Event names are sanitized (trimmed, spaces replaced with underscores)
- Custom parameters are extracted from event properties

### Page Events

**Flow Logic:**

1. **Hybrid Mode Check**: Verifies if hybrid mode is enabled
2. **Event Conversion**: Converts page events to GA4 `page_view` events
3. **Parameter Mapping**: Maps page properties to GA4 page parameters
4. **URL Handling**: Processes page URL, title, and referrer information

**Mappings:**

- `properties.url` → `page_location`
- `properties.title` → `page_title`
- `properties.referrer` → `page_referrer`
- `properties.path` → Custom parameter
- `properties.search` → Custom parameter

### Group Events

**Flow Logic:**

1. **Event Conversion**: Converts group events to GA4 `join_group` events
2. **Group ID Mapping**: Maps groupId to GA4 group_id parameter
3. **Group Properties**: Handles additional group-related properties

**Mappings:**

- `groupId` → `group_id`
- Group traits and properties → Custom parameters

## Data Mappings

### Common Payload Mappings

**User Identification:**

```javascript
// For gtag client type
client_id: ga4ClientId || anonymousId || rudderId

// For firebase client type
app_instance_id: ga4AppInstanceId (from externalId)
```

**Timestamp Handling:**

```javascript
timestamp_micros: timestamp (converted to microseconds)
```

**User ID:**

```javascript
user_id: userId (if present)
```

**Non-Personalized Ads:**

```javascript
non_personalized_ads: !context.device.adTrackingEnabled;
```

### User Properties Mapping

**Source Fields:**

- `context.traits.*`
- `properties.user_properties.*`

**Exclusions:**

- PII properties (configurable via `piiPropertiesToIgnore`)
- GA4 reserved user property names
- Properties starting with `_`, `firebase_`, `ga_`, `google_`

**Processing:**

1. Extract custom fields from source locations
2. Apply PII filtering
3. Remove reserved property names
4. Sanitize property values

### Event Parameters Mapping

**Common Parameters:**

- `engagement_time_msec`: For user engagement tracking
- `session_id`: Session identifier (hybrid mode)
- `session_number`: Session number (if available)

**E-commerce Parameters:**

- `currency`: Transaction currency
- `value`: Transaction value
- `transaction_id`: Order/transaction identifier
- `items[]`: Array of product items

**Custom Parameters:**

- Extracted from `properties.*` (excluding reserved names)
- Filtered to remove GA4 reserved parameter names
- Limited to GA4 parameter constraints (40 char names, 100 char values)

## Validation Rules

### Event Name Validation

**Requirements:**

- Must be a string
- Cannot be empty
- Maximum 40 characters
- Must start with a letter
- Can contain only alphanumeric characters and underscores
- Cannot be a reserved GA4 event name

**Reserved Event Names (Complete List):**

- `ad_activeview`
- `ad_click`
- `ad_exposure`
- `ad_impression`
- `ad_query`
- `adunit_exposure`
- `app_clear_data`
- `app_install`
- `app_update`
- `app_remove`
- `error`
- `first_open`
- `first_visit`
- `in_app_purchase`
- `notification_dismiss`
- `notification_foreground`
- `notification_open`
- `notification_receive`
- `os_update`
- `screen_view`
- `session_start`
- `user_engagement`

**Reserved Custom Event Names (Web):**

- Events starting with `_` (underscore)
- Events starting with `firebase_`
- Events starting with `ga_`
- Events starting with `google_`
- Events starting with `gtag.`

### Parameter Validation

**Parameter Names:**

- Maximum 40 characters
- Must start with a letter
- Alphanumeric characters and underscores only
- Cannot start with `_`, `firebase_`, `ga_`, `google_`, `gtag.`

**Parameter Values:**

- Maximum 100 characters (Standard GA4)
- Maximum 500 characters (GA4 360)
- Special exceptions:
  - `page_title`: 300 characters max
  - `page_referrer`: 420 characters max
  - `page_location`: 1,000 characters max

### User Properties Validation

**Property Names:**

- Maximum 24 characters
- Must start with a letter
- Can contain only alphanumeric characters and underscores
- Cannot start with `_`, `firebase_`, `ga_`, `google_`
- Cannot be reserved user property names

**Reserved User Property Names:**

- `first_open_time`
- `first_visit_time`
- `last_deep_link_referrer`
- `user_id`
- `first_open_after_install`

**Property Values:**

- Maximum 36 characters
- UTF-8 encoded strings

**Special Parameter Value Limits:**

- `page_title`: Maximum 300 characters
- `page_referrer`: Maximum 420 characters
- `page_location`: Maximum 1,000 characters

### Request Validation

**Payload Limits:**

- Maximum 25 events per request
- Maximum 25 parameters per event
- Maximum 25 user properties per request
- Maximum 10 custom parameters per item
- Maximum 130 KB total payload size

## Configuration-Based Logic

### Client Type Handling

**gtag Client Type:**

- Requires `measurementId` (G-XXXXXXXXXX format)
- Uses `client_id` for user identification
- Supports web-based tracking

**firebase Client Type:**

- Requires `firebaseAppId`
- Uses `app_instance_id` for user identification
- Supports mobile app tracking

### Debug Mode

**When Enabled:**

- Events sent to debug validation endpoint
- Validation responses processed for error reporting
- Helps identify payload issues during development

### Event Filtering

**Whitelist Mode:**

- Only events in `whitelistedEvents` are processed
- All other events are dropped

**Blacklist Mode:**

- Events in `blacklistedEvents` are dropped
- All other events are processed

**Disable Mode:**

- All events are processed (default behavior)

## Use Cases

### E-commerce Tracking

**Product Catalog Events:**

- Track product views, clicks, and list views
- Support for product categories and brands
- Custom product attributes via item-scoped parameters

**Shopping Cart Events:**

- Add/remove products from cart
- Cart abandonment tracking
- Checkout process monitoring

**Purchase Events:**

- Order completion tracking
- Revenue and transaction data
- Refund processing

### Content Engagement

**Page Tracking:**

- Page views and navigation
- Content engagement metrics
- Site search tracking

**Custom Events:**

- User interactions (clicks, downloads, etc.)
- Feature usage tracking
- Goal completions

### User Journey Analysis

**Session Tracking:**

- Session start and engagement
- User identification across sessions
- Cross-device tracking (with User-ID)

**Conversion Tracking:**

- Goal completions
- Funnel analysis
- Attribution modeling

## Error Handling

### Validation Errors

**Event Name Errors:**

- Reserved event names → InstrumentationError
- Invalid event name format → InstrumentationError
- Missing event name → InstrumentationError

**Configuration Errors:**

- Missing required configuration → ConfigurationError
- Invalid client type → ConfigurationError
- Missing client ID/app instance ID → ConfigurationError

### Data Processing

**Invalid Parameters:**

- Parameters exceeding length limits are truncated or removed
- Reserved parameter names are filtered out
- Invalid parameter formats are sanitized

**Payload Size:**

- Large payloads are processed but may be rejected by GA4
- No automatic splitting of oversized requests
- Relies on GA4 API limits for enforcement
