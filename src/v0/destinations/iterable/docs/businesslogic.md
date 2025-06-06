# Iterable Business Logic and Mappings

## Overview

This document details the business logic, event mappings, and transformation processes implemented in the Iterable destination.

## Event Type Handling

### Identify Events

#### Purpose
Create or update user profiles in Iterable with user attributes and traits.

#### Mapping Configuration
- **Config File**: `IterableIdentifyConfig.json`
- **Endpoint**: `/api/users/update` (individual) or `/api/users/bulkUpdate` (batch)

#### Field Mappings (IterableIdentifyConfig.json)

- **User Identification** (Priority Order):
  - `userId` → `userId`
  - `traits.userId` → `userId`
  - `traits.id` → `userId`
  - `context.traits.userId` → `userId`
  - `context.traits.id` → `userId`
  - `anonymousId` → `userId` (fallback)

- **Email Address**:
  - `traits.email` → `email`
  - `context.traits.email` → `email`

- **User Attributes**:
  - `traits.*` → `dataFields.*` (all trait properties)
  - `context.traits.*` → `dataFields.*` (context traits merged)

#### Validation Requirements
- **Mandatory Fields**: Either `email` or `userId` must be present
- **Field Types**: All data fields are validated and type-converted appropriately
- **Nested Objects**: Merged when `mergeNestedObjects: true` (default)

#### Special Handling
- **Device/Browser Tokens**: Triggers additional registration calls when present
- **External IDs**: Processed for RETL catalog operations
- **Timestamp Handling**: `originalTimestamp` converted to Unix timestamp

### Track Events

#### Purpose
Track user events and behaviors in Iterable for campaign triggering and analytics.

#### Event Category Mapping
The destination automatically categorizes track events based on event names:

1. **E-commerce Events**:
   - `Order Completed` → Commerce Purchase (`/api/commerce/trackPurchase`)
   - `Product Added` → Cart Update (`/api/commerce/updateCart`)
   - `Product Removed` → Cart Update (`/api/commerce/updateCart`)

2. **Standard Events**:
   - All other events → Event Track (`/api/events/track` or `/api/events/trackBulk`)

#### Field Mappings

##### Standard Track Events (IterableTrackConfig.json)
- **Config File**: `IterableTrackConfig.json`
- **Endpoint**: `/api/events/track` or `/api/events/trackBulk`

**Core Fields**:
- `event` → `eventName`
- `properties.event_id` → `id` (converted to string)
- `properties.*` → `dataFields.*`
- `createdAt` → `createdAt` (from generic timestamp mapping)
- `properties.campaignId` → `campaignId`
- `properties.templateId` → `templateId`

**User Identification** (Priority Order):
- `userId` → `userId`
- `traits.userId` → `userId`
- `traits.id` → `userId`
- `context.traits.userId` → `userId`
- `context.traits.id` → `userId`
- `anonymousId` → `userId` (fallback)

**Email Address**:
- `properties.email` → `email`
- `context.traits.email` → `email`

##### Purchase Events (IterableTrackPurchaseConfig.json)
- **Config File**: `IterableTrackPurchaseConfig.json`
- **Endpoint**: `/api/commerce/trackPurchase`

**Core Fields**:
- `properties.*` → `dataFields.*` (all properties)
- `properties.order_id` → `id` (converted to string, priority 1)
- `properties.orderId` → `id` (converted to string, priority 2)
- `properties.event_id` → `id` (converted to string, priority 3)
- `createdAt` → `createdAt` (from generic timestamp mapping)
- `properties.campaignId` → `campaignId`
- `properties.templateId` → `templateId`
- `properties.total` → `total` (required field)

**Additional Processing**:
- `properties.products` → `items[]` (processed separately via utility functions)

**Product Item Mapping**:
- `product_id` → `id`
- `sku` → `sku`
- `name` → `name`
- `price` → `price`
- `quantity` → `quantity`
- `category` → `categories[]` (split by comma)

##### Cart Update Events
- **Config File**: `IterableProductConfig.json`
- **Endpoint**: `/api/commerce/updateCart`

**Cart Fields**:
- `properties.products` → `items[]`
- User identification fields (userId/email)

#### Validation Requirements
- **Mandatory Fields**: Either `email` or `userId` must be present
- **Event Name**: Required for all track events
- **Product Arrays**: Validated for e-commerce events
- **Numeric Fields**: Price, quantity, total validated as numbers

### Page Events

#### Purpose
Track page views for web analytics and user journey mapping.

#### Mapping Configuration
- **Config File**: `IterablePageConfig.json`
- **Endpoint**: `/api/events/track` or `/api/events/trackBulk`

#### Field Mappings
- `name` → `eventName` (page name)
- `properties.url` → `dataFields.url`
- `properties.title` → `dataFields.title`
- `properties.*` → `dataFields.*` (all page properties)

#### Special Handling
- **Event Name Generation**: Uses page name or defaults to "Page View"
- **URL Tracking**: Automatically captures page URL and title
- **Category Mapping**: Page events are treated as standard track events

### Screen Events

#### Purpose
Track screen views for mobile applications.

#### Mapping Configuration
- **Config File**: `IterablePageConfig.json` (shared with page events)
- **Endpoint**: `/api/events/track` or `/api/events/trackBulk`

#### Field Mappings
- `name` → `eventName` (screen name)
- `properties.*` → `dataFields.*` (all screen properties)

#### Special Handling
- **Event Name Generation**: Uses screen name or defaults to "Screen View"
- **Mobile Context**: Captures mobile-specific context information

### Alias Events

#### Purpose
Update user email addresses while maintaining user identity.

#### Mapping Configuration
- **Config File**: `IterableAliasConfig.json`
- **Endpoint**: `/api/users/updateEmail`

#### Field Mappings
- `userId` → `currentUserId`
- `traits.email` → `currentEmail` (current email)
- `previousId` → `newEmail` (new email address)

#### Validation Requirements
- **Current Email**: Must be provided
- **New Email**: Must be valid email format
- **User ID**: Required for email update operations

## Catalog Events (RETL)

### Purpose
Manage catalog items for product recommendations and content personalization.

### Mapping Configuration
- **Config File**: `IterableCatalogConfig.json`
- **Endpoint**: `/api/catalogs/{objectType}/items`

### Field Mappings (IterableCatalogConfig.json)
- `traits.*` → `update.*` (all catalog item properties)

### External ID Handling
Catalog operations require external ID information to determine:
- **Object Type**: The type of catalog (e.g., "products", "content")
- **Item Identifier**: The unique identifier for the catalog item

### Endpoint Construction
The catalog endpoint is dynamically constructed based on external ID:
```
/api/catalogs/{externalId.objectType}/items
```

### Validation Requirements
- **External ID**: Must contain valid object type and identifier
- **Update Data**: Catalog item properties must be provided in traits

## Device and Browser Token Registration

### Device Token Registration

#### Purpose
Register mobile device tokens for push notifications.

#### Mapping Configuration
- **Config File**: `IterableRegisterDeviceTokenConfig.json`
- **Endpoint**: `/api/users/registerDeviceToken`

#### Field Mappings (IterableRegisterDeviceTokenConfig.json)

**User Identification** (Priority Order):
- `userId` → `userId`
- `traits.userId` → `userId`
- `traits.id` → `userId`
- `context.traits.userId` → `userId`
- `context.traits.id` → `userId`
- `anonymousId` → `userId` (fallback)

**Email Address**:
- `traits.email` → `email`
- `context.traits.email` → `email`

**Device Information** (processed via utility functions):
- `context.device.token` → `device.token`
- `context.device.type` → `device.platform`
- `context.device.id` → `device.deviceId`

#### Platform Mapping
- iOS devices: `platform: "APNS"`
- Android devices: `platform: "GCM"` or `platform: "FCM"`

### Browser Token Registration

#### Purpose
Register web browser tokens for web push notifications.

#### Mapping Configuration
- **Config File**: `IterableRegisterBrowserTokenConfig.json`
- **Endpoint**: `/api/users/registerBrowserToken`

#### Field Mappings
- **Browser Information**:
  - `context.device.token` → `browserToken`
  - User identification fields (userId/email)

## Batching Logic

### Batch Grouping Strategy

Events are grouped for batching based on:

1. **Destination Configuration**: Same API key and data center
2. **Event Type**: Identify events and track events are batched separately
3. **Endpoint**: Events targeting the same API endpoint are grouped together

### Batch Size Management

- **Size Limit**: 4MB maximum request size
- **Item Limit**: 1000 events/users per batch (configurable)
- **Dynamic Sizing**: Automatically adjusts batch size based on payload size

### Batch Processing Flow

1. **Event Collection**: Collect events by type and destination
2. **Size Validation**: Check payload size against 4MB limit
3. **Batch Creation**: Create batches with appropriate headers and endpoints
4. **Non-Batched Handling**: Handle events that cannot be batched individually

## Error Handling and Validation

### Input Validation

- **Required Fields**: Validate presence of mandatory fields (email/userId)
- **Data Types**: Ensure proper data types for numeric and date fields
- **Email Format**: Validate email address format
- **Event Names**: Ensure event names are present for track events

### API Response Handling

- **Success Responses**: Process successful API responses and extract relevant data
- **Error Responses**: Handle various error scenarios with appropriate error messages
- **Bulk Response Processing**: Handle individual event failures within bulk operations

### Bulk Operation Error Handling

The destination provides sophisticated error handling for bulk operations:

#### Error Detection Paths
- **Invalid Emails**: `invalidEmails`, `failedUpdates.invalidEmails`
- **Invalid User IDs**: `invalidUserIds`, `failedUpdates.invalidUserIds`
- **Not Found Emails**: `failedUpdates.notFoundEmails`
- **Not Found User IDs**: `failedUpdates.notFoundUserIds`
- **Conflict Emails**: `failedUpdates.conflictEmails`
- **Conflict User IDs**: `failedUpdates.conflictUserIds`
- **Forgotten Emails**: `failedUpdates.forgottenEmails`
- **Forgotten User IDs**: `failedUpdates.forgottenUserIds`
- **Invalid Data Emails**: `failedUpdates.invalidDataEmails`
- **Invalid Data User IDs**: `failedUpdates.invalidDataUserIds`
- **Disallowed Event Names**: `disallowedEventNames`

#### Error Message Generation
The destination automatically generates detailed error messages for failed events:
- Identifies specific failure reasons (invalid email, user not found, etc.)
- Maps failures to individual events within bulk operations
- Provides actionable error information for debugging

### Error Categories

1. **Configuration Errors**: Missing API keys, invalid data center
2. **Validation Errors**: Missing required fields, invalid data formats
3. **API Errors**: Rate limiting, authentication failures, server errors
4. **Network Errors**: Connection timeouts, network connectivity issues
5. **Bulk Operation Errors**: Individual event failures within bulk requests

## Data Transformation Rules

### User Identification Priority

1. **Prefer User ID**: When `preferUserId: true` (default)
   - Use `userId` if available
   - Fall back to `email` if userId not present
   - Use `anonymousId` as last resort

2. **Prefer Email**: When `preferUserId: false`
   - Use `email` if available
   - Fall back to `userId` if email not present

### Timestamp Handling

- **Input Formats**: Accept ISO 8601 strings and Unix timestamps
- **Output Format**: Convert to Unix timestamp in milliseconds
- **Default Values**: Use current timestamp when not provided

### Data Type Conversions

- **Strings**: Preserve as-is
- **Numbers**: Convert to appropriate numeric types
- **Booleans**: Convert to boolean values
- **Objects**: Merge nested objects when enabled
- **Arrays**: Preserve array structure

## Use Cases and Applications

### Marketing Automation
- **User Segmentation**: Use identify events to build user segments
- **Event Triggering**: Use track events to trigger automated campaigns
- **Behavioral Tracking**: Track user interactions for personalization

### E-commerce Integration
- **Purchase Tracking**: Monitor completed orders and revenue
- **Cart Abandonment**: Track cart updates for abandonment campaigns
- **Product Recommendations**: Use product interaction data for recommendations

### User Journey Mapping
- **Page/Screen Tracking**: Map user navigation patterns
- **Event Sequences**: Track user behavior sequences
- **Conversion Funnels**: Analyze conversion paths and drop-off points

### Push Notifications
- **Device Registration**: Register mobile devices for push notifications
- **Web Push**: Register browsers for web push notifications
- **Targeted Messaging**: Use user data for targeted push campaigns

## Special Features and Edge Cases

### Dynamic Payload Size Management

The destination implements intelligent payload size management:

- **4MB Size Limit**: Automatically monitors request payload size
- **Dynamic Batching**: Splits large batches to stay under size limits
- **Chunk Processing**: Uses configurable initial chunk size (1000 events)
- **Size-Based Splitting**: Dynamically adjusts batch sizes based on actual payload size

### Event Categorization and Routing

The destination automatically categorizes events for optimal processing:

1. **Update User Events**: Routed to `/api/users/update` or bulk endpoint
2. **Catalog Events**: Routed to catalog-specific endpoints with object type
3. **Track Events**: Routed to events API with commerce event detection
4. **Device/Browser Registration**: Routed to token registration endpoints
5. **Error Events**: Handled separately with detailed error reporting

### Timestamp Handling

- **Input Formats**: Accepts ISO 8601 strings, Unix timestamps, and Date objects
- **Output Format**: Converts all timestamps to Unix milliseconds
- **Timezone Handling**: Preserves timezone information during conversion
- **Default Values**: Uses current timestamp when not provided

### E-commerce Event Detection

The destination uses intelligent event name matching:

- **Case Insensitive**: Event names are matched case-insensitively
- **Flexible Matching**: Supports variations like "Order Completed", "order completed"
- **Product Events**: Detects "Product Added", "Product Removed" variations
- **Commerce Routing**: Automatically routes to appropriate commerce endpoints

### Configuration Preferences

#### User ID vs Email Preference
- **preferUserId: true** (default): Prioritizes userId over email for identification
- **preferUserId: false**: Prioritizes email over userId for identification

#### Nested Object Handling
- **mergeNestedObjects: true** (default): Merges nested objects in user attributes
- **mergeNestedObjects: false**: Keeps nested objects as separate fields

### RETL Integration

#### External ID Processing
- **Object Type Extraction**: Automatically extracts object type from external IDs
- **Catalog Endpoint Construction**: Builds dynamic catalog endpoints
- **Mapped to Destination**: Processes events with `mappedToDestination: true` flag

#### Catalog Item Management
- **Batch Processing**: Supports up to 1000 catalog items per request
- **Dynamic Endpoints**: Constructs endpoints based on catalog object type
- **Update Operations**: Handles catalog item creation and updates

### Device and Platform Detection

#### Mobile Platform Mapping
- **iOS Detection**: Maps iOS devices to APNS platform
- **Android Detection**: Maps Android devices to GCM/FCM platform
- **Token Validation**: Validates device tokens before registration

#### Browser Token Handling
- **Web Push Support**: Handles browser-specific push token registration
- **Cross-Platform**: Supports multiple browser types and platforms

### Error Recovery and Resilience

#### Partial Failure Handling
- **Individual Event Tracking**: Tracks success/failure for each event in bulk operations
- **Graceful Degradation**: Continues processing successful events when some fail
- **Detailed Error Reporting**: Provides specific error information for failed events

#### Retry Logic
- **Network Errors**: Handles temporary network failures
- **Rate Limiting**: Respects API rate limits and retry after headers
- **Authentication**: Handles token refresh and re-authentication scenarios
