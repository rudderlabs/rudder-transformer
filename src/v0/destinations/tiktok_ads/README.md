# TikTok Ads Destination

Implementation in **JavaScript** (ES6+)

## Overview

TikTok Ads destination enables you to send event data from RudderStack to TikTok's Business API for advertising optimization, conversion tracking, and audience targeting. This integration supports both Events 1.0 and Events 2.0 APIs, with real-time event tracking, batch processing, and comprehensive user data hashing for privacy compliance.

## Version Information

- **Current Version**: v1.3 (TikTok Business API)
- **Implementation Type**: v0
- **Events API Support**: Events 1.0 (v1) and Events 2.0 (v2)
- **Default Version**: Events 2.0 (v2)
- **Last Updated**: July 2025
- **Maintainer**: RudderStack Integration Team

## Configuration

### Required Settings

- **Pixel Code**: Required for tracking events with TikTok Pixel
  - Must be a valid TikTok Pixel ID from your TikTok Ads Manager
  - Format: Alphanumeric string (1-100 characters)
  - Example: `A1T8T4XXXXVIQA8ORZMX9`
  - Used to associate events with your TikTok advertising account

### Optional Settings

- **Access Token**: Required for cloud mode operations
  - TikTok Long Term Access Token for server-side event tracking
  - Example format: `1234ac663758946dfeXXXX20b394bbac611b371f7`
  - Must have appropriate permissions for the operations you want to perform
  - **Configuration**: Optional in schema but required for cloud mode functionality
  - **Validation**: The destination will throw a `ConfigurationError` if missing when processing cloud mode events

- **Event Version**: Choose between Events 1.0 and Events 2.0
  - **Events 2.0** (v2): Recommended, default option with enhanced features
  - **Events 1.0** (v1): Legacy version, will be deprecated by H2'2024
  - Default: v2

- **Hash User Properties**: Enable automatic hashing of user data
  - Automatically hashes email, phone, and external_id using SHA-256
  - Only applicable for cloud mode
  - Default: true

- **Send Custom Events**: Enable to send custom event names
  - When disabled, only standard TikTok events or mapped events are allowed
  - When enabled, allows sending any custom event name to TikTok
  - Default: false
  - Reference: [TikTok Standard Events Documentation](https://ads.tiktok.com/help/article/standard-events-parameters?lang=en)

### Event Configuration

- **Events to Standard**: Map custom event names to TikTok standard events
  - Allows mapping your custom event names to TikTok's predefined standard events
  - Supported standard events:
    - AddPaymentInfo, AddToCart, AddToWishlist, ClickButton, CompletePayment, CompleteRegistration, Contact, Download, InitiateCheckout, PlaceAnOrder, Search, SubmitForm, Subscribe, ViewContent, CustomizeProduct, FindLocation, Schedule, Purchase, Lead, ApplicationApproval, SubmitApplication, StartTrial
  - **Format**: Each event name should be mapped exactly as listed above
  - **Reference**: [TikTok Standard Events Documentation](https://ads.tiktok.com/help/article/standard-events-parameters?lang=en)

### Event Filtering (Device Mode Only)

- **Event Filtering Option**: Configure which events to send
  - **Disable**: Send all events (default)
  - **Allowlist**: Only send specified events
  - **Denylist**: Send all events except specified ones

- **Allowlisted Events**: List of events to include when allowlist is enabled
- **Denylisted Events**: List of events to exclude when denylist is enabled

### Device Mode Settings

- **Use Native SDK**: Enable device-mode event sending
  - When enabled, events are sent directly from the client-side
  - Default: false

### Consent Management

- **Consent Management Provider**: Choose consent management solution
  - **OneTrust** (default), **Ketch**, **iubenda**, or **Custom**
  - For custom provider, specify resolution strategy (AND/OR logic)

- **Consent Categories**: Configure consent category IDs
  - Used to control event sending based on user consent preferences

## Integration Functionalities

> TikTok Ads supports **Device mode** and **Cloud mode**

### Supported Message Types

- **Cloud Mode**: Track
- **Device Mode (Web)**: Identify, Track, Page

### Batching Support

- **Supported**: Yes
- **Message Types**: Track events
- **Batch Limits**:
  - **Events 1.0 (v1)**: 50 events per batch
    - Endpoint: `https://business-api.tiktok.com/open_api/v1.3/pixel/batch/`
  - **Events 2.0 (v2)**: 1000 events per batch
    - Endpoint: `https://business-api.tiktok.com/open_api/v1.3/event/track/`
- **Implementation**:
  - **Events 1.0**: Uses `batchMultiplexedEvents` utility with separate batch endpoint
  - **Events 2.0**: Uses custom batching logic with the same endpoint for single and batch requests
- **Test Events**: Events with `test_event_code` are not batched and are sent individually

### API Endpoints

| Version | Single Event Endpoint | Batch Endpoint | Max Batch Size |
|---------|----------------------|----------------|----------------|
| Events 1.0 (v1) | `/open_api/v1.3/pixel/track/` | `/open_api/v1.3/pixel/batch/` | 50 |
| Events 2.0 (v2) | `/open_api/v1.3/event/track/` | `/open_api/v1.3/event/track/` | 1000 |

**Note**: Events 2.0 uses the same endpoint for both single events and batch requests. The API automatically handles batching based on the request payload structure.


### Rate Limits

The TikTok Business API enforces rate limits on all endpoints. The following table shows the official rate limits for both Events 1.0 and Events 2.0 endpoints across all subscription plans:

| Endpoint        | Plan     | QPS    | QPM      | QPD         |
|----------------|----------|--------|----------|-------------|
| `/event/track/` | Basic    | 1,000  | 600,000  | 86,400,000  |
| (Events 2.0)    | Advanced | 1,000  | 600,000  | 86,400,000  |
|                | Premium  | 1,000  | 600,000  | 86,400,000  |
|                | Ultimate | 1,000  | 600,000  | 86,400,000  |
| `/pixel/track/` | Basic    | 1,000  | 600,000  | 86,400,000  |
| (Events 1.0)    | Advanced | 1,000  | 600,000  | 86,400,000  |
|                | Premium  | 1,000  | 600,000  | 86,400,000  |
|                | Ultimate | 1,000  | 600,000  | 86,400,000  |
| `/pixel/batch/` | Basic    | 1,000  | 600,000  | 86,400,000  |
| (Events 1.0)    | Advanced | 1,000  | 600,000  | 86,400,000  |
|                | Premium  | 1,000  | 600,000  | 86,400,000  |
|                | Ultimate | 1,000  | 600,000  | 86,400,000  |

**Legend**: 
- **QPS**: Queries Per Second
- **QPM**: Queries Per Minute  
- **QPD**: Queries Per Day

#### Rate Limit Implementation

TikTok's rate limiting is applied at multiple levels:
- **Per App ID**: Rate limits are enforced per TikTok app ID
- **Per Access Token**: Limits may vary based on access token permissions
- **Dynamic Limits**: Actual limits may vary based on system load and usage patterns

#### Rate Limit Error Handling

The destination implements rate limit handling through specific error codes:

| Error Code | Description | Handling |
|------------|-------------|----------|
| 40100 | Rate limit exceeded | Throws `ThrottledError` for retry logic |
| 40001 | Authentication/Authorization error | Throws `AbortedError` (non-retryable) |
| 40002 | Request validation error | Throws `AbortedError` (non-retryable) |
| 0, 20001 | Success codes | Request processed successfully |

When the API returns error code `40100`, the destination automatically triggers retry logic with exponential backoff to handle temporary rate limit violations.

#### Rate Limit Best Practices

- **Use Batching**: Reduce API calls by leveraging batch endpoints:
  - Events 1.0: Batch up to 50 events per request
  - Events 2.0: Batch up to 1000 events per request
- **Automatic Retry**: The destination handles rate limit errors with exponential backoff
- **Monitor Error Logs**: Watch for `40100` error codes in logs to identify rate limit issues
- **Spread Traffic**: Distribute event sending across time to avoid hitting rate limits
- **Implement Client-Side Throttling**: Consider implementing client-side rate limiting to stay within bounds

**Reference**: [TikTok Business API Documentation](https://business-api.tiktok.com/portal/docs?id=1771100779668482)

### Intermediate Calls

- **Supported**: No
- TikTok Ads destination does not make intermediate API calls
- All track events are sent directly to TikTok's tracking endpoints

### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/tiktok_ads/networkHandler.js`
- Handles TikTok-specific response codes and error handling

### User Deletion

- **Supported**: No
- No user deletion functionality is implemented

### OAuth Support

- **Supported**: No
- Uses Access Token authentication

### Additional Functionalities

#### Event Name Mapping

- **Built-in Mappings**: Supports automatic mapping of common e-commerce events
  - `product added to wishlist` → `AddToWishlist`
  - `product added` → `AddToCart`
  - `checkout started` → `InitiateCheckout`
  - `payment info entered` → `AddPaymentInfo`
  - `checkout step completed` → `CompletePayment`
  - `order completed` → `PlaceAnOrder`
  - And more standard mappings

- **Custom Mappings**: Configure custom event name mappings via `eventsToStandard`
- **Standard Events**: All TikTok standard events supported in the destination:
  - AddPaymentInfo, AddToCart, AddToWishlist, ClickButton, CompletePayment, CompleteRegistration, Contact, Download, InitiateCheckout, PlaceAnOrder, Search, SubmitForm, Subscribe, ViewContent, CustomizeProduct, FindLocation, Schedule, Purchase, Lead, ApplicationApproval, SubmitApplication, StartTrial

#### User Data Hashing

- **Automatic Hashing**: SHA-256 hashing of sensitive user data
  - Email addresses (trimmed and lowercased before hashing)
  - Phone numbers (trimmed before hashing)
  - External IDs (trimmed before hashing)
  - **Note**: Additional fields like first name, last name, and zip codes are handled by the mapping configuration but use the same hashing logic
- **Configurable**: Can be disabled via `hashUserProperties` setting (default: enabled)
- **Implementation**: Uses the same hashing function for both v1 and v2, with field availability determined by the mapping configuration

#### Event Filtering

- **Device Mode Only**: Event filtering only applies to device-mode integrations
- **Options**: Disable, Allowlist, or Denylist specific events
- **Use Case**: Control which events are sent to TikTok from client-side

#### Content Handling

- **Product Arrays**: Supports product content arrays for e-commerce events
- **Auto Content Type**: Automatically sets `content_type` for product arrays
- **Version-Specific Defaults**:
  - **Events 1.0 (v1)**: Uses `product_group` as default content type
  - **Events 2.0 (v2)**: Uses `product` as default content type
- **Priority Order**: `product.contentType` > `properties.contentType` > `properties.content_type` > version-specific default

#### Version-Specific Features

**Events 1.0 (v1)**:
- Legacy pixel-based tracking
- Limited user data fields
- 50 events per batch limit

**Events 2.0 (v2)**:
- Enhanced event tracking with more user data fields
- Support for additional user properties (first_name, last_name, city, country, state, zip_code)
- Higher batch limits (1000 events)
- Better timestamp handling with required `event_time` field
- Support for `limited_data_use` parameter

### Validations

#### Required Fields

**Configuration Level**:
- **Pixel Code**: Required for all operations
- **Access Token**: Required for cloud mode operations

**Message Level**:
- **Event Type**: Must be `track` (only supported message type for cloud mode)
- **Event Name**: Required and must be a non-empty string

#### Event Name Validation

- **Basic Validation**: Event name must be a non-empty string
- **Custom Events**: When `sendCustomEvents` is disabled, event names must either:
  - Match a built-in event mapping (e.g., `product added` → `AddToCart`)
  - Be mapped via `eventsToStandard` configuration
  - Be a valid TikTok standard event name
- **Error Handling**: Invalid event names throw `InstrumentationError` with message: "Event name (eventName) is not valid, must be mapped to one of standard events"

#### Data Type Conversions

- **Content ID**: Automatically converted to string using `String(product.product_id)`
- **Shop ID**: Automatically converted to string using `String(properties.shop_id)`
- **Order ID**: Automatically converted to string using `String(properties.order_id)`
- **Timestamps**:
  - v1: Uses ISO format timestamp
  - v2: Converts to Unix timestamp (seconds) for `event_time` field

#### User Data Validation

- **Email**: Trimmed and converted to lowercase before hashing
- **Phone**: Trimmed before hashing
- **External ID**: Trimmed before hashing
- **Hashing**: All user data is SHA-256 hashed when `hashUserProperties` is enabled

#### Content Validation

- **Content Type**: Automatically sets default `content_type` to `'product'` for standard events (v2) or `'product_group'` for v1
- **Products Array**: Validates and processes products array into TikTok's expected `contents` format
- **Required Content Fields**: `content_id` is required and automatically populated from `product_id`

## General Queries

### Event Ordering

#### Track Events
- **Ordering Required**: Recommended but not strictly enforced by TikTok
- **Timestamp Handling**:
  - **Events 1.0 (v1)**: Uses `timestamp` field in ISO format
  - **Events 2.0 (v2)**: Uses `event_time` field as Unix timestamp (seconds), marked as required
- **Implementation**: RudderStack ensures event ordering through `sortBatchesByMinJobId` function
- **Note**: Events may get out of order due to `test_event_code` properties (since test events bypass batching), but the destination ensures proper ordering for regular events before sending to TikTok

#### Deduplication Support
- **Event ID**: TikTok supports event deduplication using `event_id` parameter
- **Mechanism**: When the same `event_id` is sent multiple times, TikTok will deduplicate and count only one event
- **Use Case**: Enables safe replay of events and prevents duplicate counting when using both Pixel and Events API

### Data Replay Feasibility

#### Missing Data Replay
- **Feasible**: Yes, for track events
- **Reason**: TikTok's timestamp-based processing allows sending historical events
- **Best Practice**: Include proper `event_time` (v2) or `timestamp` (v1) to maintain chronological order

#### Already Delivered Data Replay
- **Feasible**: Yes, with proper event deduplication
- **Requirements**:
  - Use consistent `event_id` for the same logical event
  - TikTok will automatically deduplicate events with identical `event_id`
- **Limitation**: Without `event_id`, replaying will create duplicate events in TikTok
- **Recommendation**: Always include `event_id` for events that might be replayed

### Multiplexing

- **Supported**: Yes, in specific scenarios
- **Description**: The TikTok Ads destination can generate multiple API calls from a single input event.

#### Multiplexing Scenarios

1. **Events to Standard Mapping**:
   - **Multiplexing**: YES
   - **Condition**: When a single event is mapped to multiple TikTok standard events via `eventsToStandard` configuration
   - **Example**: One `addToCart` event mapped to both `CompletePayment` and `Download` events
   - **Implementation**: Each mapped event generates a separate API call to TikTok
   - **Code Reference**: `standardEventsMap[event].forEach((eventName) => { responseList.push(...); })`

2. **Test Events**:
   - **Multiplexing**: NO
   - **Condition**: Events with `test_event_code` are handled separately but don't create multiple API calls
   - **Note**: Test events are processed individually and bypass batching to ensure immediate delivery for testing purposes

## Version Information

### Current Version

- **API Version**: v1.3 (TikTok Business API)
- **Events Version**: Supports both Events 1.0 and Events 2.0
- **Default**: Events 2.0 (v2)

### Version Comparison

| Feature | Events 1.0 (v1) | Events 2.0 (v2) |
|---------|------------------|------------------|
| **API Endpoint** | `/open_api/v1.3/pixel/track/` | `/open_api/v1.3/event/track/` |
| **Batch Endpoint** | `/open_api/v1.3/pixel/batch/` | `/open_api/v1.3/event/track/` |
| **Max Batch Size** | 50 events | 1000 events |
| **Timestamp Field** | `timestamp` (ISO format) | `event_time` (Unix seconds, required) |
| **User Data Fields** | Basic (email, phone, external_id) | Extended (includes first_name, last_name, city, country, state, zip_code) |
| **Data Structure** | Pixel-based format | Enhanced event format |
| **Content Type Default** | `product_group` | `product` |
| **Limited Data Use** | Not supported | Supported via `limited_data_use` parameter |

### Deprecation Timeline

- **Events 1.0**: Will be deprecated by H2'2024 (as indicated in UI configuration)
- **Current Status**: Both versions supported, v2 is default
- **Recommendation**:
  - Use Events 2.0 (v2) for all new implementations
  - Migrate existing Events 1.0 integrations to Events 2.0
  - Events 2.0 offers better performance, higher batch limits, and more user data fields

**NEEDS REVIEW** - The H2'2024 deprecation timeline should be verified against current TikTok official announcements for accuracy.

### Breaking Changes Between Versions

**When migrating from Events 1.0 to Events 2.0:**

1. **Timestamp Format**:
   - v1: ISO string format (`2020-09-17T19:49:27Z`)
   - v2: Unix timestamp in seconds (`1600372167`)

2. **API Endpoints**:
   - v1: Separate endpoints for single and batch requests
   - v2: Single endpoint handles both individual and batch requests

3. **Required Fields**:
   - v2 requires `event_time` field (automatically populated by RudderStack)

4. **User Data Structure**:
   - v2 supports additional user fields for better matching

5. **Batch Size Limits**:
   - v1: Maximum 50 events per batch
   - v2: Maximum 1000 events per batch

**NEEDS REVIEW** - Official TikTok documentation should be consulted for the most current deprecation timeline and migration guidelines.

## Documentation Links

### TikTok Business API Documentation

- **Official Documentation**: [TikTok Business API Overview](https://business-api.tiktok.com/portal/docs)
- **Events API Overview**: [TikTok Events API Overview](https://ads.tiktok.com/help/article/events-api)
- **Events 2.0 API usage**  [TikTok Events API usage](https://business-api.tiktok.com/portal/docs?id=1771100779668482)
- **Standard Events**: [TikTok Standard Events Parameters](https://ads.tiktok.com/help/article/standard-events-parameters?lang=en)
- **Pixel Setup**: [TikTok Pixel Setup Guide](https://ads.tiktok.com/help/article/get-started-pixel)
- **Rate Limits**: [TikTok API Limits Documentation](https://business-api.tiktok.com/portal/docs?id=1771100779668482#item-link-API%20limits)
- **Support Channels**: [TikTok Business Help Center](https://ads.tiktok.com/help/)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## FAQ

### Common Questions

**Q: Why am I getting "Event name is not valid" errors?**
A: This occurs when `sendCustomEvents` is disabled and your event name doesn't match a built-in mapping or custom mapping in `eventsToStandard`. Either enable custom events or map your event to a TikTok standard event.

**Q: What's the difference between Events 1.0 and Events 2.0?**
A: Events 2.0 offers higher batch limits (1000 vs 50), more user data fields, better timestamp handling, and enhanced features. Events 1.0 will be deprecated by H2'2024.

**Q: How does event deduplication work?**
A: TikTok uses the `event_id` parameter to deduplicate events. Include a unique `event_id` in your events to prevent duplicates when replaying data or using both Pixel and Events API.

**Q: Can I send historical data to TikTok?**
A: Yes, include proper timestamps in your events. TikTok will process events based on their timestamp values.

**Q: What user data is automatically hashed?**
A: When `hashUserProperties` is enabled (default), email, phone, external_id, first_name, last_name, and zip_code are automatically SHA-256 hashed before sending to TikTok.
