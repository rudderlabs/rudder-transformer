# AppsFlyer Destination

Implementation in **Javascript**

## Configuration

### Required Settings

- **Authorization Type**: Choose between v1 (Dev Key) or v2 (Server-to-Server Key) authentication
  - **v1**: Uses AppsFlyer Dev Key for authentication
  - **v2**: Uses AppsFlyer Server-to-Server API Key for authentication (recommended for server-side integrations)

- **AppsFlyer Dev Key** (Required for v1 authorization): Your AppsFlyer application's dev key
  - Used for authentication with AppsFlyer's v1 API

- **AppsFlyer Server-to-Server API Key** (Required for v2 authorization): Your AppsFlyer S2S API key
  - Used for authentication with AppsFlyer's v3 API (recommended)

- **Android App ID**: Required if sending events from Android devices
  - Format: Package name (e.g., `com.mypackage.example`)
  - Required when `context.os.name` is set to "android"
  - Included in destination configuration for all connection modes

- **Apple App ID**: Required if sending events from iOS devices
  - Format: App Store ID (e.g., `123456789`)
  - Required when `context.os.name` is set to "ios" or other Apple family OS
  - Included in destination configuration for all connection modes

### Optional Settings

- **Use Rich Event Name**: Enable to create descriptive event names for Page and Screen events
  - When enabled: `Viewed [Page/Screen Name] Page/Screen`
  - When disabled: Uses generic "page" or "screen" event names

- **Add Properties at Root**: Enable to add all event properties at the root level of the payload
  - When disabled: Properties are nested under a "properties" object

- **AF Currency at Root**: Enable to add currency field at the root level of the payload

- **List of Properties**: Specify which properties to add at the root level (when "Add Properties at Root" is disabled)

- **Sharing Filter**: Optional parameter for data sharing control

- **Event Filtering**: Configure event filtering options
  - **Disable**: No event filtering
  - **Whitelist Events**: Only send specified events
  - **Blacklist Events**: Send all events except specified ones

- **API Token**: Required for user deletion functionality (GDPR compliance)

- **Status Callback URLs**: Comma-separated URLs for GDPR request status callbacks (max 3 URLs)

## Integration Functionalities

> AppsFlyer supports both **Cloud mode** and **Device mode** connections

### Supported Message Types

#### Cloud Mode
- Track
- Page
- Screen

#### Device Mode
- Track
- Screen
- Identify

**Supported Platforms for Device Mode**: Android, iOS, React Native, Flutter, Cordova

**Note**: Device mode uses the AppsFlyer native SDK and is only available for mobile platforms. Web, Unity, AMP, and server-side sources only support cloud mode.

### Batching Support

- **Supported**: Yes (cloud mode only)
- **Message Types**: Track, Page, Screen events in cloud mode
- **Implementation**: Uses `simpleProcessRouterDest` for concurrent processing
- **Note**: This provides individual event processing with concurrency, not actual request batching. Device mode events are processed individually by the native SDK.

### Rate Limits

The AppsFlyer Server-to-Server Events API enforces the following rate limits:

| API Version | Endpoint | Rate Limit | Payload Limit | Description |
|-------------|----------|------------|---------------|-------------|
| v2 (Legacy) | `https://api2.appsflyer.com/inappevent/{app_id}` | Not specified | Up to 1KB JSON payload | Legacy endpoint using Dev Key authentication |
| v3 (Current) | `https://api3.appsflyer.com/inappevent/{app_id}` | Not specified | Up to 1KB JSON payload | Current endpoint using S2S Key authentication |

**General Rate Limits:**
- **OneLink API**: 500 requests per second (30,000 per minute)
- **OpenDSR API**: 350 requests per minute (for user deletion)

**Important Notes:**
- JSON payload size is limited to 1KB per event
- AppsFlyer supports gradual scaling for high-volume implementations
- Recommended to start with 10K TPS and scale gradually with 1-minute intervals
- Implement retry mechanisms for error handling

[Docs Reference](https://dev.appsflyer.com/hc/reference/s2s-events-api3-post)

### Intermediate Calls

- **Supported**: No
- **Description**: AppsFlyer destination does not make any intermediate API calls. All events are sent directly to the AppsFlyer Server-to-Server Events API.

### Proxy Delivery

- **Supported**: No
- **Reason**: No `networkHandler.js` file is implemented for this destination

### User Deletion

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/af/deleteUsers.js`
- **API Used**: AppsFlyer OpenDSR API for GDPR compliance
- **Endpoint**: `https://hq1.appsflyer.com/api/gdpr/v1/opendsr_requests`
- **Authentication**: Requires API Token (Bearer token)
- **Supported Identity Types**:
  - `appsflyer_id` (highest priority)
  - `ios_advertising_id` (requires Apple App ID)
  - `android_advertising_id` (requires Android App ID)
- **Request Type**: Erasure requests following OpenDSR protocol
- **Rate Limit**: 350 requests per minute
- Checking the status of a request from more than 60 days ago returns "request not found".

### Additional Functionalities

#### Event Mapping and Configuration

- **Predefined Event Mappings**: Special handling for e-commerce events
  - `Order Completed` → Purchase configuration
  - `Product Added to Wishlist` → Cart/Wishlist configuration  
  - `Wishlist Product Added to Cart` → Cart/Wishlist configuration
  - `Checkout Started` → Cart/Wishlist configuration
  - `Product Removed` → Default configuration
  - `Product Searched` → Search configuration
  - `Product Viewed` → Content View configuration

- **Multi-Product Support**: Automatic handling of products array for e-commerce events
  - Extracts `product_id`, `quantity`, and `price` from products array
  - Maps to AppsFlyer's `af_content_id`, `af_quantity`, and `af_price` arrays

#### Device-Specific Data Collection

- **iOS Devices**: Collects IDFA (`context.device.advertisingId`) and IDFV (`context.device.id`)
- **Android Devices**: Collects Google Advertising ID (`context.device.advertisingId`)
- **App Tracking Transparency**: Supports ATT status (`context.device.attTrackingStatus`)
- **App Version**: Maps `context.app.version` to `app_version_name`
- **Bundle Identifier**: Maps `context.app.namespace` to `bundleIdentifier`

#### Event Validation

- **AppsFlyer ID Requirement**: All events must include `appsflyerExternalId` in the message
- **OS and App ID Validation**: Ensures proper OS detection and corresponding App ID configuration
- **Authentication Validation**: Validates presence of required authentication keys based on version

## General Queries

### Event Ordering

#### Track, Page, Screen Events
**Event ordering is NOT strictly required** for AppsFlyer events. Here's why:

- **Timestamp-based Processing**: AppsFlyer processes events based on the `eventTime` parameter sent in the payload
- **Server-side Timestamping**: Events are timestamped according to their `eventTime` property values and arrival time
- **Flexible Event Processing**: Events arriving out of order can still be processed correctly if they include proper timestamps

**Timestamping Logic:**
- Events with valid `eventTime` are stamped with that value (if arriving before 02:00 UTC the next day)
- Events arriving after 02:00 UTC are stamped with arrival time
- Events with future `eventTime` values are handled based on calendar day logic

> While AppsFlyer can handle out-of-order events, maintaining event order is still recommended for optimal data consistency and attribution accuracy.

### Data Replay Feasibility

#### Missing Data Replay
- **Feasible**: Yes, with considerations
- **Reason**: Since event ordering is not strictly required, missing historical data can be replayed
- **Important Notes**:
  - Events must include proper `eventTime` values
  - Events arriving after 02:00 UTC will be timestamped with arrival time, not `eventTime`
  - AppsFlyer ID must correspond to actual app installs

#### Already Delivered Data Replay
- **Not Recommended**: AppsFlyer treats each event as unique
- **Risk of Duplicates**: Replaying already delivered events will create duplicate events in AppsFlyer
- **Impact**:
  - Duplicate events will skew analytics and reporting
  - May trigger campaigns multiple times
  - Could affect attribution and revenue calculations

**Best Practice**: Implement proper event deduplication logic in your system before sending to AppsFlyer.

### Multiplexing

- **Supported**: No
- **Description**: The AppsFlyer destination does not generate multiple API calls from a single input event.

#### Multiplexing Scenarios

1. **Track Events**:
   - **Multiplexing**: NO
   - Single API call to AppsFlyer Server-to-Server Events API
   - All event data (properties, revenue, etc.) sent in one request

2. **Page Events**:
   - **Multiplexing**: NO
   - Single API call with page-specific event name and properties

3. **Screen Events**:
   - **Multiplexing**: NO
   - Single API call with screen-specific event name and properties

4. **User Deletion**:
   - **Multiplexing**: NO (but multiple sequential calls for different identity types)
   - Each user deletion request is sent as a separate API call to OpenDSR API
   - Priority order: `appsflyer_id` → `ios_advertising_id` → `android_advertising_id`

## Version Information

### Current API Versions

AppsFlyer maintains two API endpoints for Server-to-Server events:

- **API v2 (Legacy)**: `https://api2.appsflyer.com/inappevent/{app_id}`
  - Uses Dev Key authentication
  - Still supported but legacy

- **API v3 (Current)**: `https://api3.appsflyer.com/inappevent/{app_id}`
  - Uses Server-to-Server Key authentication
  - Recommended for new implementations
  - Enhanced security and features

### Version Selection

The destination automatically selects the appropriate API version based on configuration:
- **v1 Authorization** → Uses API v2 endpoint with Dev Key
- **v2 Authorization** → Uses API v3 endpoint with S2S Key

### Deprecation Information

**NEEDS REVIEW**: No official deprecation timeline found for API v2. AppsFlyer continues to support both versions without announced end-of-life dates.

## Documentation Links

### AppsFlyer API Documentation

- [Server-to-Server Events API v3](https://dev.appsflyer.com/hc/reference/s2s-events-api3-post)
- [Server-to-Server Events Overview](https://support.appsflyer.com/hc/en-us/articles/207034486-Server-to-server-events-API-for-mobile-S2S-mobile)
- [OpenDSR API for User Deletion](https://support.appsflyer.com/hc/en-us/articles/11332840660625-Send-OpenDSR-API-requests)
- [API Rate Limits and Traits](https://dev.appsflyer.com/hc/reference/overview-3)

### RETL Functionality

The AppsFlyer destination does not currently support RETL functionality.

### Business Logic and Mappings

For detailed business logic and event mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## FAQ Section

### Common Questions

**Q: Why am I getting "Appsflyer id is not set" error?**
A: All events must include `appsflyerExternalId` in the message context. Ensure your events have the AppsFlyer ID properly set in the external ID array.

**Q: Which API version should I use - v1 or v2?**
A: v2 (Server-to-Server Key) is recommended for new implementations as it uses the current API v3 endpoint and provides enhanced security. v1 (Dev Key) uses the legacy API v2 endpoint.

**Q: Can I send events without specifying an App ID?**
A: No, you must configure either Android App ID or Apple App ID (or both) depending on the platforms you're targeting. The destination validates OS name against the corresponding App ID.

**Q: How does event ordering work with AppsFlyer?**
A: AppsFlyer processes events based on the `eventTime` parameter. Events can arrive out of order and still be processed correctly if they include proper timestamps.

**Q: Can I replay historical data to AppsFlyer?**
A: Yes, for missing data replay. However, replaying already delivered events will create duplicates as AppsFlyer treats each event as unique.

**Q: What's the maximum payload size for events?**
A: AppsFlyer limits JSON payload size to 1KB per event. Ensure your event data stays within this limit.

**Q: Does AppsFlyer support batching?**
A: The destination uses router-level concurrency for cloud mode events but sends individual HTTP requests to AppsFlyer. There's no API-level batching support. Device mode events are processed individually by the native SDK.

**Q: How do I handle multi-product events?**
A: For e-commerce events with a `products` array, the destination automatically extracts product information and creates AppsFlyer-compatible arrays for `af_content_id`, `af_quantity`, and `af_price`.

---

## Documentation Completeness Review

### ✅ Fully Documented Sections

1. **Configuration** - All required and optional settings documented with validation rules
2. **Supported Message Types** - Track, Page, Screen events fully covered
3. **Batching Support** - Router-level concurrency documented
4. **Rate Limits** - API rate limits and payload restrictions documented
5. **User Deletion** - OpenDSR API integration fully documented
6. **Event Mappings** - All predefined event mappings documented
7. **Validation Requirements** - All mandatory and optional validations covered
8. **Business Logic** - Complete flow documentation in separate file
9. **Multiplexing** - Confirmed no multiplexing scenarios
10. **Version Information** - API v2 vs v3 differences documented

### ⚠️ Sections Requiring Review

1. **API Deprecation Timeline** - No official deprecation dates found for API v2. AppsFlyer continues to support both v2 and v3 endpoints without announced end-of-life dates.