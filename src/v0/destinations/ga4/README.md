# Google Analytics 4 (GA4) Destination

Implementation in **Javascript**

## Configuration

### Required Settings

- **API Secret**: Required for authentication with GA4 Measurement Protocol API

  - Must be generated in the Google Analytics UI under **Admin** > **Data Streams** > **Choose your stream** > **Measurement Protocol** > **Create**
  - Private to your organization and should be regularly updated to avoid excessive SPAM

- **Types of Client**: Specifies the client type for GA4 integration

  - **gtag**: For web-based implementations using Google Tag (gtag.js)
  - **firebase**: For Firebase-based implementations

- **Measurement ID** (for gtag client type): Required when using gtag client type

  - Format: `G-XXXXXXXXXX` (e.g., `G-ABC123DEF4`)
  - Found under **Admin** > **Data Streams** > **Choose your stream** > **Measurement ID**

- **Firebase App ID** (for firebase client type): Required when using firebase client type

  - Required for Firebase-based implementations
  - Must be provided when `typesOfClient` is set to `firebase`

### Optional Settings

- **Debug Mode**: Enable to send events to GA4 debug validation server for testing
- **Event Filtering Option**: Control which events are sent to GA4
  - **disable**: Send all events (default)
  - **whitelistedEvents**: Only send specified events
  - **blacklistedEvents**: Block specified events
- **Whitelisted Events**: List of events to send when filtering is enabled
- **Blacklisted Events**: List of events to block when filtering is enabled
- **PII Properties to Ignore**: List of properties to exclude from user properties to comply with privacy requirements

## Integration Functionalities

> GA4 supports **Cloud mode**, **Device mode**, and **Hybrid mode**

### Supported Message Types

#### Cloud Mode
- Track
- Group  
- Page

#### Device Mode
- **Web**: Identify, Track, Page, Group
- **Android**: Identify, Track, Screen
- **iOS**: Identify, Track, Screen

### Batching Support

- **Supported**: No (at destination level)
- **Implementation**: Uses standard processor transformation without custom router implementation
- **GA4 API Batching**: The GA4 Measurement Protocol API supports up to 25 events per request, but RudderStack sends individual events
- **Note**: Each RudderStack event is transformed into a single GA4 API request with one event

### Rate Limits

The GA4 Measurement Protocol API has the following characteristics:

| Aspect | Limit | Description |
|--------|-------|-------------|
| Events per request | 25 events | Maximum events that can be sent in a single API request |
| Event parameters | 25 parameters | Maximum parameters per event |
| User properties | 25 properties | Maximum user properties per request |
| Event name length | 40 characters | Maximum length for event names |
| Parameter name length | 40 characters | Maximum length for parameter names |
| Parameter value length | 100 characters (Standard GA4)<br>500 characters (GA4 360) | Maximum length for parameter values |
| Request payload size | 130 KB | Maximum size of the POST request body |

**Note**: Google Analytics does not publish specific rate limits for the Measurement Protocol API. The API returns a `2xx` status code if the HTTP request is received, regardless of whether the payload is processed successfully.

[Docs Reference](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference)

### Intermediate Calls

- **Supported**: No
- **Use Case**: GA4 destination does not make any intermediate API calls
- **Implementation**: Each event is directly transformed and sent to the GA4 Measurement Protocol endpoint

### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: `src/v0/destinations/ga4/networkHandler.js`

### User Deletion

- **Supported**: No
- **Implementation**: GA4 destination does not implement user deletion functionality
- **Note**: User deletion for GA4 would need to be handled through the Google Analytics Admin API, which is not implemented in this destination

### OAuth Support

- **GA4 (Standard)**: No OAuth support
- **GA4_V2**: Yes, OAuth is supported
  - **Type**: OAuth
  - **Role**: google_analytics_4
  - **Scopes**: delivery

### Additional Functionalities

#### Client ID Management

- **gtag Client Type**: Uses `client_id` for user identification
  - Priority: `ga4ClientId` (from externalId) > `anonymousId` > `rudderId`
  - Required for gtag-based implementations

- **Firebase Client Type**: Uses `app_instance_id` for user identification
  - Requires `ga4AppInstanceId` to be provided under externalId
  - Mandatory for Firebase-based implementations

#### Hybrid Mode Support

- **Supported**: Yes (for web platform)
- **Functionality**: Allows events to be sent through both device mode and cloud mode
- **Cloud Events Filter**: Track and Group events are sent through cloud mode in hybrid mode
- **Session Handling**: Supports session ID and session number parameters from device mode

#### Event Name Validation

- **Reserved Event Names**: Blocks events with reserved GA4 event names
- **Custom Event Validation**: Ensures event names follow GA4 naming conventions
- **Event Name Transformation**: Automatically trims and replaces spaces with underscores

#### User Properties Management

- **PII Filtering**: Excludes specified PII properties from user properties
- **Reserved Property Exclusion**: Automatically excludes GA4 reserved user property names
- **Custom User Properties**: Supports custom user properties from `context.traits` and `properties.user_properties`

#### Consent Management

- **Supported**: Yes
- **Implementation**: Supports GA4 consent settings for advertising and personalization
- **Providers**: OneTrust, Ketch, Custom, Iubenda

#### Geographic and Device Information

- **User Location**: Supports structured geographic information (city, region, country, continent)
- **Device Information**: Supports device category, language, screen resolution, OS, browser details
- **IP Override**: Alternative to user location for geographic derivation

## General Queries

### Event Ordering

#### Track, Page, Group Events
**Event ordering is recommended** for GA4 events due to the following considerations:

- **Timestamp Handling**: GA4 Measurement Protocol uses timestamps to determine event order
- **User Properties**: User properties sent with events can overwrite previous values if events arrive out of order
- **Session Data**: Session-related parameters should maintain chronological order for accurate session tracking
- **Custom Parameters**: Event parameters may contain state information that should be processed in order

> While GA4 uses timestamps for event ordering, maintaining event order at the source helps ensure data consistency and accurate user journey tracking.

### Data Replay Feasibility

#### Missing Data Replay

- **Feasible**: Yes, with considerations
- **Timestamp Support**: GA4 Measurement Protocol supports backdating events up to 3 calendar days based on the property's timezone
- **Implementation**: Events can be replayed by setting the `timestamp_micros` parameter
- **Limitation**: Only recent historical data (within 3 days) can be replayed

#### Already Delivered Data Replay

- **Not Feasible**: GA4 does not support event deduplication
- **Duplicate Handling**: Each event sent to GA4 is treated as a unique occurrence
- **Impact**: Replaying already delivered data will create duplicate events in GA4
- **Recommendation**: Implement deduplication logic at the source before sending to GA4

**Reference**: According to Google's documentation, each event is treated as a unique occurrence with its own event ID, so duplicate events are treated as separate, unique events.

### Multiplexing

- **Supported**: No
- **Description**: The GA4 destination does not generate multiple API calls from a single input event

#### Multiplexing Scenarios

1. **Track Events**:
   - **Multiplexing**: NO
   - Single API Call to `/mp/collect` with event data and user properties in one payload

2. **Page Events**:
   - **Multiplexing**: NO  
   - Converted to `page_view` event and sent as single API call to `/mp/collect`

3. **Group Events**:
   - **Multiplexing**: NO
   - Converted to `join_group` event and sent as single API call to `/mp/collect`

4. **Hybrid Mode Events**:
   - **Multiplexing**: NO
   - Events are either sent through device mode or cloud mode, not both simultaneously

## Version Information

### Current Version

GA4 uses the Google Analytics Measurement Protocol, which does not have versioned releases. The API is continuously updated by Google without version-specific endpoints.

### API Endpoints

- **Production**: `https://www.google-analytics.com/mp/collect`
- **Debug/Validation**: `https://www.google-analytics.com/debug/mp/collect`
- **EU Data Processing**: `https://region1.google-analytics.com/mp/collect`

## Documentation Links

### GA4 Measurement Protocol Documentation

- [GA4 Measurement Protocol Overview](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [Send Events to Google Analytics](https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events)
- [Measurement Protocol Reference](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference)
- [Event Collection Limits](https://support.google.com/analytics/answer/9267744)
- [Validating Events](https://developers.google.com/analytics/devguides/collection/protocol/ga4/validating-events)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
