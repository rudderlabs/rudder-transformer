# Airship Destination

Implementation in **JavaScript**

## Configuration

### Required Settings

- **API Key**: Required for authentication with Airship REST API
  - Must be a Bearer token with appropriate permissions for the operations you want to perform
  - Used for all API calls to Airship endpoints
  - Generated from Airship dashboard: Settings > Tokens > Create Token

### Optional Settings

- **App Key**: Required for Track events
  - Used specifically for custom events API calls
  - Generated from Airship dashboard: Settings > Project Details > App Key
  - Required when sending Track events, optional for Identify and Group events

- **Data Center**: Specifies the Airship data center to use
  - **Default**: `false` (US data center)
  - **Options**:
    - `false` - US data center (go.urbanairship.com)
    - `true` - EU data center (go.airship.eu)

- **Timestamp Attributes**: Array of attribute names that should be treated as timestamps
  - These attributes will be automatically converted to Airship's timestamp format
  - Format: `YYYY-MM-DD[T]HH:mm:ss[Z]`

## Integration Functionalities

> Airship supports **Cloud mode** only

### Supported Message Types

- Identify
- Track
- Group

### Batching Support

- **Supported**: No
- **Message Types**: N/A
- **Implementation**: Each event is processed individually and sent as separate API calls

### Rate Limits

Airship does not enforce strict rate limits but provides best practice recommendations:

| Operation Type | Recommended Batch Size | Best Practice |
|---------------|----------------------|---------------|
| Tag Updates | Up to 1,000 users | Batch tag operations when possible |
| Custom Events | Up to 100 events | Send custom events in parallel |
| Named User Operations | No specific limit | Use parallel processing for better performance |

**General Guidelines**:
- Airship's servers have a 60-second timeout
- API requests generally return in under 1 second
- No hard rate limiting implemented
- Parallel processing is recommended for better performance
- Maximum payload size: 5 MiB per request
- API response limit: 1,000 objects maximum per response

**Error Handling**:
- 429 Too Many Requests: Implement exponential backoff retry logic
- 503 Service Unavailable: Retry with exponential backoff
- 400 Bad Request: Check payload validation and format
- 401 Unauthorized: Verify API key and permissions

[Reference: Airship API Best Practices](https://support.airship.com/hc/en-us/articles/360051990652-What-are-the-best-practices-for-the-use-of-the-Airship-Messaging-API)

### Intermediate Calls

- **Supported**: No
- **Use Case**: N/A
- All API calls are direct delivery calls to Airship endpoints

### Proxy Delivery

- **Supported**: Yes (Default Implementation)
- **Source Code Path**: Uses RudderStack's default proxy delivery mechanism
- **Implementation**: Standard HTTP proxy without custom response handling

### User Deletion

- **Supported**: No
- **Source Code Path**: N/A
- Airship destination does not implement user deletion functionality

### Additional Functionalities

#### Named User Management
- **Supported**: Yes
- **Implementation**: All events are associated with Named Users in Airship
- **User ID Requirement**: `userId` is required for all event types
- Named Users are automatically created/updated when events are processed

#### Tag Management
- **Supported**: Yes
- **Implementation**: Tags are managed through traits in Identify and Group events
- **Tag Groups**:
  - Identify events use `rudderstack_integration` tag group
  - Group events use `rudderstack_integration_group` tag group
- **Operations**: Add and remove tags based on trait values

#### Attribute Management
- **Supported**: Yes
- **Implementation**: User attributes are set through traits in Identify and Group events
- **Timestamp Handling**: Configurable timestamp attributes are automatically converted to Airship format
- **JSON Attributes**: Support for complex JSON attributes through integrations object
- **Remove Attributes**: Support for removing attributes through integrations object

#### Custom Events
- **Supported**: Yes
- **Implementation**: Track events are sent as custom events to Airship
- **Event Properties**: Custom properties are extracted and sent with events
- **Session ID**: Automatic UUID conversion for session IDs
- **Event Name Processing**: Event names are converted to lowercase and spaces replaced with underscores

### Validations

#### General Validations
- **User ID**: Required for all event types, maps to Airship Named User ID
- **API Key**: Required for all event types for authentication
- **App Key**: Required specifically for Track events
- **Message Type**: Must be one of: identify, track, group

#### Identify/Group Event Validations
- **Traits**: Must be present and non-empty object
- **Attributes**: Boolean traits are processed as tags, non-boolean as attributes
- **JSON Attributes**: Arrays are not supported in JSON attributes (will throw error)
- **Timestamp Attributes**: Must be convertible to Airship timestamp format

#### Track Event Validations
- **Event Name**: Required field, cannot be empty
- **Session ID**: If provided, must be convertible to UUID format
- **Properties**: Custom properties are extracted, reserved properties are excluded
- **Value Field**: If string type, processed same as event name (lowercase, underscore replacement)

#### Data Type Restrictions
- **JSON Attributes**: Arrays not supported, only objects and primitive values
- **Timestamp Format**: Must be convertible to `YYYY-MM-DD[T]HH:mm:ss[Z]` format
- **Tag Values**: Boolean traits determine add (true) or remove (false) operations
- **Attribute Keys**: Dots in keys are replaced with underscores for compatibility

## General Queries

### Event Ordering

#### Identify Events
Event ordering is **not strictly required** for Identify events. Airship handles attribute updates idempotently, meaning:
- Later attributes will overwrite earlier ones
- Tag operations (add/remove) are processed independently
- No timestamp-based ordering is enforced by Airship

#### Track Events
Event ordering is **not strictly required** for Track events. Each custom event in Airship:
- Is treated as a unique occurrence with its own event ID
- Includes a timestamp field that Airship uses for chronological ordering
- Does not depend on delivery order for proper processing

#### Group Events
Event ordering is **not strictly required** for Group events. Similar to Identify events:
- Group attributes and tags are processed idempotently
- Later updates overwrite earlier ones
- No strict ordering dependency

> **Overall**: Airship destination does not require strict event ordering for any event type.

### Data Replay Feasibility

#### Missing Data Replay
- **Feasible**: Yes
- **Reason**: Since event ordering is not strictly required, missing data can be replayed without issues
- **Considerations**:
  - Identify/Group events will update user profiles with the replayed data
  - Track events will create new custom event entries (duplicates possible)

#### Already Delivered Data Replay

- **Identify/Group Events**:
  - **Feasible**: Yes, but with considerations
  - **Behavior**: Replaying will overwrite existing attributes and update tags
  - **Risk**: May overwrite newer data with older data if timestamps are not considered

- **Track Events**:
  - **Not Recommended**: Each Track event creates a unique custom event in Airship
  - **Behavior**: Replaying will create duplicate custom events
  - **Impact**: May skew analytics and trigger campaigns multiple times

### Multiplexing

- **Supported**: Yes
- **Description**: The Airship destination generates multiple API calls from single input events in specific scenarios.

#### Multiplexing Scenarios

1. **Identify Events with Both Tags and Attributes**:
   - **Multiplexing**: YES
   - **Conditions**: When traits contain both tag-eligible and attribute-eligible data
   - **API Calls**:
     - First Call: `POST /api/named_users/tags` - For tag operations
     - Second Call: `POST /api/named_users/{userId}/attributes` - For attribute updates
   - **Note**: This is true multiplexing as both calls deliver different aspects of the same event

2. **Group Events with Both Tags and Attributes**:
   - **Multiplexing**: YES
   - **Conditions**: When group traits contain both tag-eligible and attribute-eligible data
   - **API Calls**:
     - First Call: `POST /api/named_users/tags` - For group tag operations
     - Second Call: `POST /api/named_users/{userId}/attributes` - For group attribute updates
   - **Note**: This is true multiplexing as both calls deliver different aspects of the same group event

3. **Track Events**:
   - **Multiplexing**: NO
   - **API Calls**: Single call to `POST /api/custom-events`
   - **Note**: Track events always result in a single API call

## Version Information

### Current Version

- **API Version**: Airship API v3
- **Accept Header**: `application/vnd.urbanairship+json; version=3`
- **Implementation**: Uses the current and only supported version of Airship API

### Version Deprecation

- **Current Status**: Airship API v3 is the current and only supported version
- **Deprecation**: No deprecation timeline announced
- **Stability**: Version 3 has been stable and is actively maintained by Airship

## Documentation Links

### REST API Documentation

- [Airship API Overview](https://docs.airship.com/api/ua/)
- [Named Users Tags API](https://docs.airship.com/api/ua/#operation/api/named_users/tags/post)
- [Named Users Attributes API](https://docs.airship.com/api/ua/#operation/api/named_users/named_user_id/attributes/post)
- [Custom Events API](https://docs.airship.com/api/ua/#operation/api/custom-events/post)
- [API Best Practices](https://support.airship.com/hc/en-us/articles/360051990652-What-are-the-best-practices-for-the-use-of-the-Airship-Messaging-API)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
