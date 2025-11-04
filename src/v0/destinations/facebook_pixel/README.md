# Facebook Pixel Destination

Implementation in **Javascript**

## Configuration

### Required Settings

- **Pixel ID**: Required for identifying your Facebook Pixel

  - Must be a valid Facebook Pixel ID
  - Used to construct the API endpoint for sending events

- **Access Token**: Required for authentication with Facebook Conversions API (cloud mode only)
  - Must have appropriate permissions for sending events to the specified pixel
  - Not required when using device mode (web only)

### Optional Settings

- **Advanced Mapping**: Enable to support Identify events

  - When enabled, allows processing of Identify events for user data collection
  - When disabled, Identify events will be rejected with a configuration error

- **Standard Page Call**: Enable to send Page events as standard PageView events

  - When enabled, Page events are sent as Facebook's standard PageView event
  - When disabled, Page events are sent as custom events

- **Value Field Identifier**: Specifies which property to use for the value field

  - Options: `properties.value` or `properties.price`
  - Default: `properties.price`

- **Events to Events Mapping**: Map RudderStack event names to Facebook standard events

  - Allows mapping custom event names to Facebook's predefined standard events
  - Supports mapping to: ViewContent, Search, AddToCart, AddToWishlist, InitiateCheckout, AddPaymentInfo, Purchase, PageView, Lead, CompleteRegistration, Contact, CustomizeProduct, Donate, FindLocation, Schedule, StartTrial, SubmitApplication, Subscribe

- **PII Properties Configuration**:

  - **Blacklist PII Properties**: Properties to exclude or hash before sending
  - **Whitelist PII Properties**: Properties to include even if they contain PII data

- **Limited Data Usage**: Enable for California Consumer Privacy Act (CCPA) compliance

  - When enabled, includes data processing options in the payload

- **Test Destination**: Enable for testing purposes

  - When enabled, events are sent to Facebook's test environment
  - Requires a test event code

- **Remove External ID**: Remove external_id from the payload

  - When enabled, external_id is excluded from user data

- **Event Filtering**: Filter events based on whitelist or blacklist

  - Options: disable, whitelistedEvents, blacklistedEvents

- **Category to Content Mapping**: Map product categories to content types

  - Allows mapping product categories to Facebook content types for better event categorization

- **Use Updated Mapping**: Enable updated field mapping configurations

  - When enabled, uses newer mapping configurations for better compatibility

- **Legacy Conversion Pixel ID**: Legacy pixel ID for backward compatibility (web mode only)

  - Used for maintaining compatibility with older Facebook Pixel implementations

- **Use Native SDK**: Enable native SDK usage (web mode only)

  - When enabled, uses Facebook's native SDK for web implementations

- **Consent Management**: Configure consent management settings

  - Supports OneTrust and Ketch consent management platforms
  - Includes cookie categories and consent purposes configuration

- **Auto Config**: Enable automatic configuration (web mode only)
  - When enabled, automatically configures certain settings based on detected environment

## Integration Functionalities

> Facebook Pixel supports **Device mode** (web only) and **Cloud mode** (all platforms)

### Supported Message Types

- **Cloud Mode**: Identify, Track, Page, Screen
- **Device Mode** (web only): Track, Page

### Batching Support

- **Supported**: No
- **Implementation**: Uses `simpleProcessRouterDest` which provides individual event processing with concurrency, not actual batching
- **Note**: Each event is processed individually and sent as a separate API request

### Rate Limits

**No Specific Rate Limits**: According to Facebook's official documentation, there is no specific rate limit for the Conversions API.

The Facebook Pixel destination uses the Facebook Conversions API endpoint:

- **Endpoint**: `https://graph.facebook.com/v22.0/{PIXEL_ID}/events`
- **Method**: POST
- **Rate Limiting**: Conversions API calls are not calculated into the Graph API throttling
- **Reference**: [Facebook Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/)

**Note**: While there are no specific rate limits for Conversions API, the underlying Marketing API has rate limiting based on your app's access tier. Standard access enables lower rate limiting compared to development access.

### Intermediate Calls

- **Supported**: No
- **Description**: The Facebook Pixel destination does not make any intermediate API calls. All events are sent directly to the Facebook Conversions API events endpoint.

### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/facebook_pixel/networkHandler.js`
- **Implementation**: Uses shared Facebook utilities network handler

### User Deletion

- **Supported**: No
- **Note**: The Facebook Pixel destination does not implement user deletion functionality. No `deleteUsers.js` file is present in the destination directory.

### OAuth Support

- **Supported**: No
- **Authentication**: Uses access token-based authentication
- **Note**: The destination configuration does not include OAuth authentication type in the database configuration

### Additional Functionalities

#### PII Data Handling

- **Automatic Hashing**: The destination automatically hashes PII data using SHA-256
- **Supported PII Fields**: email, phone, gender, first name, last name, city, country, state, zip, birthday
- **Configuration Options**:
  - Blacklist specific properties (with optional hashing)
  - Whitelist specific properties to include
  - Custom hashing behavior through integrations object

#### Event Duration Validation

- **Standard Events**: Events must be sent within 7 days of their occurrence or up to 1 minute in the future
- **Physical Store Events**: Events with `action_source` set to `physical_store` must be sent within 62 days of their occurrence
- **Future Events**: All events can be sent up to 1 minute in the future
- **Implementation**: The `verifyEventDuration` function validates event timestamps based on action source

#### Standard Event Mapping

- **E-commerce Events**: Automatic mapping of RudderStack e-commerce events to Facebook standard events:
  - `Product List Viewed` → `ViewContent`
  - `Product Viewed` → `ViewContent`
  - `Product Added` → `AddToCart`
  - `Order Completed` → `Purchase`
  - `Products Searched` → `Search`
  - `Checkout Started` → `InitiateCheckout`

#### Action Source Detection

- **Automatic Detection**: The destination automatically sets the `action_source` parameter based on the event channel:
  - Web events: `website`
  - Mobile events: `app`
  - Server events: `other`

#### Custom Data Processing

- **Property Flattening**: Event properties are flattened for Facebook's API format
- **Reserved Properties**: Certain properties (`opt_out`, `event_id`, `action_source`) are excluded from custom data
- **Special Arrays**: Properties like `content_ids` and `contents` are preserved as arrays without flattening

### Validations

#### Required Fields

- **Pixel ID**: Must be provided in destination configuration
- **Access Token**: Required for cloud mode authentication
- **Event Type**: Must be one of: identify, track, page, screen
- **Event Name**: Required for track events and must be a string

#### Event-Specific Validations

- **Identify Events**: Require `advancedMapping` to be enabled in configuration
- **Track Events**: Must have a valid event name property
- **Standard Events**: Must have properties after excluding reserved fields

#### Data Validations

- **Event Duration**: Events must be within 7 days of occurrence or up to 1 minute in the future
- **PII Data**: Automatically validated and hashed according to Facebook requirements
- **User Data**: External ID is required and derived from userId, traits, or anonymousId

## General Queries

### Event Ordering

#### Track, Page, Screen Events

- **Required**: No strict ordering required for most track events
- **Reasoning**: Facebook Pixel events are primarily used for conversion tracking and audience building. The timestamp is included with each event, allowing Facebook to process events in chronological order regardless of delivery order.
- **Exception**: Events that update user attributes (when included with track events) may benefit from ordering to prevent older data from overwriting newer data.

#### Identify Events

- **Required**: Yes, ordering is recommended
- **Reasoning**: Identify events update user profiles and attributes. Out-of-order delivery could result in older user data overwriting newer information, leading to incorrect user profiles.

### Data Replay Feasibility

#### Missing Data Replay

- **Feasible**: Yes, for most event types
- **Reasoning**: Since Facebook Pixel events include timestamps and don't require strict ordering (except for user attribute updates), missing historical data can generally be replayed safely.
- **Limitation**: Events must be within 7 days of their occurrence due to Facebook's event duration validation.

#### Already Delivered Data Replay

- **Not Recommended**: Replaying already delivered data will create duplicate events
- **Reasoning**: Facebook treats each event as unique based on the event data and timestamp. There is no built-in deduplication mechanism in Facebook Pixel API.
- **Impact**: Duplicate events can skew conversion metrics, audience sizes, and campaign optimization.

### Multiplexing

- **Supported**: No
- **Description**: The Facebook Pixel destination does not generate multiple API calls from a single input event. Each RudderStack event results in exactly one API call to Facebook's Conversions API.

#### Event Processing Flow

1. **Single Event Processing**:

   ```
   Input: RudderStack event (Identify/Track/Page/Screen)
   Output: Single API call to /events endpoint
   Multiplexing: NO
   ```

2. **No Intermediate Calls**: Unlike some destinations that make preliminary API calls for identity resolution or data fetching, Facebook Pixel sends all data directly to the events endpoint.

3. **Batch Processing**: Each event in a batch is processed individually, resulting in separate API calls rather than a single batched request.

## Version Information

### Current Version

- **API Version**: v22.0 (Facebook Graph API)
- **Release Date**: January 21, 2025
- **Endpoint**: `https://graph.facebook.com/v22.0/{PIXEL_ID}/events`

### Available Versions

- **Latest Version**: v23.0 (Released May 29, 2025)
- **Current Implementation**: v22.0 (January 21, 2025)
- **Previous Versions**: v21.0, v20.0, v19.0, etc.

### Version Deprecation

- **Deprecation Schedule**: Facebook typically maintains API versions for approximately 2 years
- **v22.0 Status**: Currently active and supported
- **Upgrade Recommendation**: Consider upgrading to v23.0 for latest features and improvements
- **Breaking Changes**: Review Facebook's changelog when upgrading between versions

## Documentation Links

### Facebook API Documentation

- **[Facebook Conversions API Overview](https://developers.facebook.com/docs/marketing-api/conversions-api/)**: Main documentation for Conversions API
- **[Using the Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/)**: Implementation guide and API usage
- **[Events API Reference](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/)**: Complete parameter reference for events
- **[Rate Limits Documentation](https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/)**: Marketing API rate limiting information
- **[PII Hashing Guidelines](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters/)**: Customer information and hashing requirements
- **[Standard Events Reference](https://developers.facebook.com/docs/meta-pixel/reference/)**: Facebook standard events documentation
- **[Graph API Changelog](https://developers.facebook.com/docs/graph-api/changelog/)**: Version updates and deprecation information

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
