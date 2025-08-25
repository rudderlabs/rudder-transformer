# MoEngage Destination

Implementation in **Javascript**

## Configuration

### Required Settings

- **API ID**: Required for authentication and identifying your MoEngage workspace

  - This is your MoEngage account's Workspace ID
  - Available on the MoEngage Dashboard at **Settings** → **Account** → **APIs** → **Workspace ID**
  - Format: Alphanumeric string (e.g., `W0ZHNMPI2XXXXJ84ZILZACRB`)

- **API Key**: Required for authentication with MoEngage Data API

  - Available on the MoEngage Dashboard at **Settings** → **Account** → **APIs** → **Data** tile
  - Used for Basic Authentication along with API ID

- **Region**: Specifies the MoEngage data center to use
  - Available regions:
    - `US`: United States data center (api-01.moengage.com)
    - `EU`: European data center (api-02.moengage.com)
    - `IND`: India data center (api-03.moengage.com)
  - Default: `US`

### Optional Settings

- **Use Object Data**: Enable to support object data types in user attributes
  - When enabled, custom attributes are merged instead of flattened
  - Supports MoEngage's object data type feature
  - Default: `false`

## Integration Functionalities

> MoEngage supports **Device mode** and **Cloud mode**

## API Details

### Endpoints

- **Track User**: `/v1/customer/<workspace_id>` - Update user attributes and profiles - HTTP Method: POST
- **Create Event**: `/v1/event/<workspace_id>` - Track custom events - HTTP Method: POST
- **Track Device**: `/v1/device/<workspace_id>` - Update device information - HTTP Method: POST
- **Merge User**: `/v1/customer/merge` - Merge user profiles - HTTP Method: POST

### Authentication

- **Method**: Basic Authentication
- **Credentials**: API ID (username) and API Key (password)
- **Header Format**: `Authorization: Basic Base64(API_ID:API_KEY)`
- **Additional Headers**:
  - `Content-Type: application/json`
  - `MOE-APPKEY: <workspace_id>`

### Supported Message Types

- Identify
- Track
- Alias

### Batching Support

- **Supported**: No
- **Message Types**: N/A
- **Implementation**: Uses `simpleProcessRouterDest` which processes events individually with concurrent processing, not actual batching
- **Batch Limits**: N/A - Each event is processed as a separate API call

### Rate Limits

The MoEngage API enforces rate limits to ensure system stability and responsible use. Here are the rate limits for the endpoints used by this destination:

| Endpoint                      | Event Types                 | Rate Limit             | Description                                                           |
| ----------------------------- | --------------------------- | ---------------------- | --------------------------------------------------------------------- |
| `/v1/customer/<workspace_id>` | Identify                    | **10,000 users/min**   | Used for tracking user attributes and creating/updating user profiles |
| `/v1/event/<workspace_id>`    | Track                       | **30,000 events/min**  | Used for tracking custom events                                       |
| `/v1/device/<workspace_id>`   | Identify (with device info) | **10,000 devices/min** | Used for tracking device information                                  |
| `/v1/customer/merge`          | Alias                       | **Not specified**      | Used for merging user profiles (inherits from user API limits)        |

**Default Limits**: These are the default limits provided by MoEngage. Higher limits can be requested from MoEngage support team if needed.

#### Rate Limit Handling

When rate limits are exceeded, MoEngage returns a `429 Too Many Requests` status code with the following response:

```json
{
  "status": "fail",
  "error": {
    "message": "Rate limits for customers exceeded. Please Try After Some Time",
    "type": "Rate Limits Exceeded",
    "request_id": "onqucLYL"
  }
}
```

#### Best Practices for Rate Limits

- **Exponential Backoff**: Implement exponential backoff when receiving 429 errors to reduce data loss
- **Request Spacing**: Space out requests to avoid hitting rate limits
- **Individual Processing**: Each event is processed as a separate API call
- **Monitor Usage**: Keep track of API usage to stay within limits
- **Contact Support**: If you need higher limits, contact MoEngage support team

## Performance Considerations

### Batch Processing

- **Supported**: No
- **Batch Size Limits**: N/A - Each event is processed individually
- **Implementation**: Uses `simpleProcessRouterDest` with concurrent processing
- **Recommendation**: Events are processed with concurrent API calls rather than batching

### Payload Size

- **Maximum Size**: 128KB per request (as per [MoEngage API documentation](https://developers.moengage.com/hc/en-us/articles/4404674776724-Overview#01H815VFPC1PYBRN1DEW0T8DN6))
- **Handling Strategy**: Events exceeding this limit will be rejected by MoEngage with a 413 "Payload too large" error
- **Recommendation**: Keep event properties and user attributes within reasonable size limits

### Caching

- **No Caching**: Each event results in immediate API calls to MoEngage

### Intermediate Calls

#### Device Tracking (Identify Flow)

- **Supported**: Yes
- **Use Case**: Device information tracking alongside user attributes
- **Endpoint**: `/v1/device/<workspace_id>`
- **Condition**: When an Identify event contains both `context.device.type` and `context.device.token`
- **Behavior**: Creates two API calls - one for user attributes and one for device information

```javascript
// The condition that leads to device tracking call:
if (message?.context?.device?.type && message?.context?.device?.token) {
  // Creates both user and device API calls
  response = [
    responseBuilderSimple(message, CONFIG_CATEGORIES.IDENTIFY, destination),
    responseBuilderSimple(message, CONFIG_CATEGORIES.DEVICE, destination),
  ];
}
```

> No intermediate calls are made for Track and Alias events

### Proxy Delivery

- **Supported**: No
- **Reason**: No `networkHandler.js` file implemented

### User Deletion

- **Supported**: No
- **Reason**: No `deleteUsers.js` file implemented

### OAuth Support

- **Supported**: No
- **Authentication**: Basic Authentication using API ID and API Key

### Field Mappings

#### Identify Events

**Standard Fields**:

- `name` ← `traits.name`, `context.traits.name` (converted to string)
- `first_name` ← `traits.firstname`, `traits.first_name`, `traits.firstName`, `context.traits.*` (converted to string)
- `last_name` ← `traits.lastname`, `traits.last_name`, `traits.lastName`, `context.traits.*` (converted to string)
- `email` ← `traits.email`, `context.traits.email` (converted to string)
- `age` ← `traits.age`, `context.traits.age` (converted to number)
- `gender` ← `traits.gender`, `context.traits.gender` (converted to string)
- `mobile` ← `traits.mobile`, `context.traits.mobile` (converted to string)
- `source` ← `traits.source`, `context.traits.source` (converted to string)
- `created_time` ← `traits.createdAt`, `context.traits.createdAt`
- `last_seen` ← `traits.last_seen`, `context.traits.last_seen`, `traits.lastSeen`, `context.traits.lastSeen`
- `transactions` ← `traits.transactions`, `context.traits.transactions` (converted to number)
- `revenue` ← `traits.revenue`, `context.traits.revenue` (converted to number)
- `moe_unsubscribe` ← `traits.moe_unsubscribe`, `context.traits.moe_unsubscribe`, `traits.moeUnsubscribe`, `context.traits.moeUnSubscribe`

**Custom Attributes**: All other fields from `traits` and `context.traits` are included, excluding the standard fields listed above.

#### Track Events

**Standard Fields**:

- `action` ← `event` (required)
- `attributes` ← `properties` (flattened or merged based on `useObjectData`)
- `platform` ← `context.device.type`, `channel`
- `app_version` ← `context.app.version`
- `current_time` ← `timestamp`, `originalTimestamp`
- `user_timezone_offset` ← `context.timezone` (converted using `getOffsetInSec`)

#### Device Information (Identify Sub-flow)

**Standard Fields**:

- `platform` ← `context.device.type`, `channel`
- `push_id` ← `context.device.token`
- `model` ← `context.device.model`
- `push_preference` ← `properties.push_preference`, `properties.pushPreference`
- `app_version` ← `context.app.version`
- `os_version` ← `context.os.version`
- `active` ← `properties.active`

#### Alias Events

**Standard Fields**:

- `merge_data[0].retained_user` ← `userId` (required)
- `merge_data[0].merged_user` ← `previousId` (required)

### Additional Functionalities

#### Object Data Type Support

- **Supported**: Yes
- **Configuration**: Enable via `useObjectData` setting in destination config
- **How It Works**:
  - When enabled, custom attributes with nested objects are merged instead of flattened
  - Supports MoEngage's object data type feature for complex attribute structures
  - When disabled, attributes are flattened using dot notation

```javascript
// With useObjectData enabled:
{
  "name": "John",
  "address": {
    "city": "New York",
    "country": "USA"
  }
}

// With useObjectData disabled (flattened):
{
  "name": "John",
  "address.city": "New York",
  "address.country": "USA"
}
```

#### Device Information Tracking

- **Supported**: Yes
- **Automatic Detection**: When device information is present in Identify events
- **Platform Normalization**: Apple family devices (iPadOS, tvOS, etc.) are normalized to "iOS"

#### Regional Data Centers

- **Supported**: Yes
- **Configuration**: Via `region` setting
- **Automatic Endpoint Selection**: Based on configured region

### Error Handling

The destination implements comprehensive error handling for various scenarios:

#### Error Types

1. **ConfigurationError**: Thrown when required configuration is missing or invalid

   - Invalid region values (must be 'US', 'EU', or 'IND')
   - Missing API ID or API Key

2. **TransformationError**: Thrown when payload construction fails

   - Base payload could not be constructed
   - Payload could not be constructed due to missing required fields

3. **InstrumentationError**: Thrown for unsupported operations
   - Unsupported event types (only 'identify', 'track', 'alias' are supported)
   - Missing event type in message

#### Validation Rules

**General Validations**:

- Event type must be present and supported
- At least one user identifier must be available

**Identify Event Validations**:

- Customer ID must be derivable from `userId`, `traits.userId`, `traits.id`, `context.traits.userId`, `context.traits.id`, or `anonymousId`
- For device tracking: Both `context.device.type` and `context.device.token` are required

**Track Event Validations**:

- Event name (`event` field) is required
- Customer ID must be available from the same sources as Identify events

**Alias Event Validations**:

- Both `userId` and `previousId` are required
- `userId` and `previousId` must be different values

### Data Type Conversions

The destination performs automatic data type conversions:

- **toString**: Applied to name, first_name, last_name, email, gender, mobile, source fields
- **toNumber**: Applied to age, transactions, revenue fields
- **getOffsetInSec**: Applied to timezone offset conversion for Track events

## Testing

### Unit Tests

- **Location**: `./src/v0/destinations/moengage`
- **Running Tests**: `npm run test src/v0/destinations/moengage`
- **Test Coverage**: Includes tests for all event types, data transformations, and error handling

### Integration Tests

- **Location**: `./test/integrations/destinations/moengage/`
- **Running Tests**: `npm run test:ts -- component --destination=moengage`
- **Test Environment**: Uses mock data and validates request structure
- **Test Data**: Located in `./test/integrations/destinations/moengage/`

## Troubleshooting

### Common Issues

- **Authentication Failed**: Check API ID and API Key configuration
  - **Solution**: Verify credentials from MoEngage Dashboard > Settings > Account > APIs
- **Invalid Region**: Ensure region is set to 'US', 'EU', or 'IND'
  - **Solution**: Update destination configuration with correct region
- **Rate Limit Exceeded**: 429 error due to too many requests
  - **Solution**: Implement retry logic with exponential backoff
- **Payload Too Large**: 413 error when request exceeds 100KB
  - **Solution**: Reduce event properties or split large payloads

### Event-Specific Issues

- **Device Tracking Not Working**: Device info not being sent
  - **Solution**: Ensure both `context.device.type` and `context.device.token` are present
- **User Merge Failed**: Alias event not working
  - **Solution**: Verify both `userId` and `previousId` are present and different
- **Events Not Appearing**: Events sent but not visible in MoEngage
  - **Solution**: Check customer_id format and ensure it's not in blacklisted values

## General Queries

### Event Ordering

#### Identify Events

**Required**: Yes - Strict event ordering is required for Identify events as they update user profiles. Out-of-order events could result in newer user attributes being overwritten by older data, leading to incorrect user profiles.

#### Track Events

**Required**: Yes - While Track events include timestamps, the user attributes that can be sent along with Track events require ordering to prevent profile corruption. MoEngage processes events based on their timestamp, but attribute updates still need to maintain order.

#### Alias Events

**Required**: Yes - Alias events merge user profiles and require strict ordering to ensure proper identity resolution and prevent data conflicts.

> Effectively, MoEngage requires strict event ordering for all event types due to the potential for user attribute updates in any event.

### Data Replay Feasibility

#### Missing Data Replay

- **Not Feasible**: Based on the event ordering requirements above, it is not feasible to replay missing data for any event type without risking data integrity issues.

#### Already Delivered Data Replay

- **Not Feasible**: MoEngage treats each event as unique based on timestamp and does not provide deduplication mechanisms. Replaying already delivered data will create duplicate events and potentially corrupt user profiles.

### Multiplexing

- **Supported**: Yes
- **Description**: The MoEngage destination can generate multiple API calls from a single input event in specific scenarios.

#### Multiplexing Scenarios

1. **Identify Events with Device Information**:

   - **Multiplexing**: YES
   - **Conditions**: When Identify event contains both `context.device.type` and `context.device.token`
   - First API Call: `/v1/customer/<workspace_id>` - To update user attributes
   - Second API Call: `/v1/device/<workspace_id>` - To update device information
   - **Note**: This is true multiplexing as both calls deliver different aspects of the same event to MoEngage.

2. **Standard Identify Events**:

   - **Multiplexing**: NO
   - Single API Call: `/v1/customer/<workspace_id>` - To update user attributes only

3. **Track Events**:

   - **Multiplexing**: NO
   - Single API Call: `/v1/event/<workspace_id>` - To track the event

4. **Alias Events**:
   - **Multiplexing**: NO
   - Single API Call: `/v1/customer/merge` - To merge user profiles

## Version Information

### Current Version

- **API Version**: v1
- **Implementation Type**: v0
- **Endpoints**: All MoEngage API endpoints used are v1
- **Last Updated**: July 2025
- **Maintainer**: RudderStack Integrations Team

### API Deprecation

- **Status**: No known deprecation timeline for v1 APIs
- **Migration Path**: No migration required at this time
- **Monitoring**: API version compatibility should be monitored for future changes

**Note**: Information about API versioning and deprecation timeline should be confirmed from MoEngage's official documentation or support channels.

## Documentation Links

### MoEngage API Documentation

- [API Overview](https://developers.moengage.com/hc/en-us/articles/4404674776724-Overview) - General Data API overview and rate limits
- [Track User API](https://developers.moengage.com/hc/en-us/articles/4413167462804-Track-User) - User identification and attribute tracking
- [Create Event API](https://developers.moengage.com/hc/en-us/articles/4413174104852-Create-Event) - Event tracking and analytics
- [Track Device API](https://developers.moengage.com/hc/en-us/articles/31285296671252) - Device information tracking
- [User Merge API](https://developers.moengage.com/hc/en-us/articles/10990676421908-User-Merge-API) - User profile merging
- [Data Centers in MoEngage](https://help.moengage.com/hc/en-us/articles/360057030512-Data-Centers-in-MoEngage) - Regional data center information
- [Object Data Type Support](https://help.moengage.com/hc/en-us/articles/29787626775828-Support-for-Object-Data-Type) - Object data type feature

### RudderStack Documentation

- [MoEngage Destination Setup](https://rudderstack.com/docs/destinations/streaming-destinations/moengage/) - RudderStack-specific setup guide

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
