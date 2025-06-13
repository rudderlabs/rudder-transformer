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

### Supported Message Types

- Identify
- Track
- Alias

### Batching Support

- **Supported**: Yes
- **Message Types**: All message types (Identify, Track, Alias)
- **Implementation**: Uses standard RudderStack batching via `simpleProcessRouterDest`
- **Batch Limits**: No specific limits implemented in the destination code

### Rate Limits

The MoEngage API enforces rate limits to ensure system stability. Here are the rate limits for the endpoints used by this destination:

| Endpoint | Event Types | Rate Limit | Description |
|----------|-------------|------------|-------------|
| `/v1/customer/<workspace_id>` | Identify | **NEEDS REVIEW** | Used for tracking user attributes and creating/updating user profiles |
| `/v1/event/<workspace_id>` | Track | **NEEDS REVIEW** | Used for tracking custom events |
| `/v1/device/<workspace_id>` | Identify (with device info) | **NEEDS REVIEW** | Used for tracking device information |
| `/v1/customer/merge` | Alias | **NEEDS REVIEW** | Used for merging user profiles |

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
- **Batch Processing**: Use batching to reduce the number of API calls

**Note**: Specific rate limit values need to be confirmed from MoEngage's official API documentation. The FAQ section mentions reducing "5xx errors because of too many requests per second/minute" suggesting there are per-second and per-minute limits.

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
- **Endpoints**: All MoEngage API endpoints used are v1
- **Deprecation**: **NEEDS REVIEW** - Information about API versioning and deprecation timeline needs to be confirmed from MoEngage documentation

## Documentation Links

### MoEngage API Documentation
- [Track User API](https://developers.moengage.com/hc/en-us/articles/4413167462804-Track-User)
- [Create Event API](https://developers.moengage.com/hc/en-us/articles/4413174104852-Create-Event)
- [Data Centers in MoEngage](https://help.moengage.com/hc/en-us/articles/360057030512-Data-Centers-in-MoEngage)
- [Object Data Type Support](https://help.moengage.com/hc/en-us/articles/29787626775828-Support-for-Object-Data-Type)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
