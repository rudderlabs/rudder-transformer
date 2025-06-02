# Customer.io Destination

## Implementation Details

- **Implementation Type**: JavaScript (v0)
- **CDK v2 Enabled**: No

## Configuration

### Required Settings

- **API Key**: Required for authentication with Customer.io Track API
  - Used for Basic Authentication along with Site ID
  - Must have appropriate permissions for the operations you want to perform

- **Site ID**: Required identifier for your Customer.io workspace
  - Used as the username in Basic Authentication
  - Found in Customer.io Settings > API Credentials > Track API Keys

- **Data Center**: Specifies the Customer.io data center to use
  - Format: `US` or `EU`
  - Default: `US`
  - Available data centers:
    - US: Uses `track.customer.io` endpoints
    - EU: Uses `track-eu.customer.io` endpoints

### Optional Settings

- **Device Token Event Name**: Event name that triggers device token registration
  - When this event is fired, device tokens are sent to Customer.io immediately
  - Used for mobile push notification setup
  - Configuration key: `deviceTokenEventName`

- **Send Page Name in SDK**: Controls whether page names are sent in SDK mode
  - Configuration key: `sendPageNameInSDK`
  - Platform-specific setting for web SDK behavior

## Integration Functionalities

> Customer.io supports **Device mode** and **Cloud mode**

### Supported Message Types

- Identify
- Track
- Page
- Screen
- Group
- Alias

### Batching Support

- **Supported**: Yes (Limited)
- **Message Types**: Group events only
- **Batch Limits**:
  - Group events: 1000 events per batch
  - Maximum payload size: 500KB per batch
  - Individual event size: 32KB maximum

### Rate Limits

Customer.io's Track API has a **global rate limit** that applies to all endpoints:

- **Rate Limit**: 3,000 requests per 3 seconds (applies to the entire Track API)
- **Enforcement**: Not strictly enforced, but consistently exceeding this limit may lead to throttling or dropped data during high system load periods
- **Scope**: This limit applies to all Track API endpoints collectively, not per individual endpoint

#### API Endpoints Used

This destination uses the following Customer.io Track API endpoints:

| Endpoint | Event Types | Batch Support | Description |
|----------|-------------|---------------|-------------|
| `/api/v1/customers/:id` | Identify | No | Identify/update user profiles |
| `/api/v1/customers/:id/events` | Track, Page, Screen | No | Send events for identified users |
| `/api/v1/events` | Track, Page, Screen (Anonymous) | No | Send anonymous events |
| `/api/v1/merge_customers` | Alias | No | Merge user profiles |
| `/api/v2/batch` | Group | Yes (1000 events, 500KB max) | Batch operations with objects |
| `/api/v1/customers/:id/devices` | Device Registration | No | Device token management |
| `/api/v1/customers/:id/devices/:device_id` | Device Deletion | No | Device token removal |

#### Additional API Limits

- **v2 Single Request**: 32KB maximum payload size
- **v2 Batch Request**: 500KB maximum payload size (each individual request within batch must be ≤32KB)
- **Event Name**: 100 bytes maximum length
- **Customer ID**: 150 bytes maximum length
- **Attribute Names**: 150 bytes maximum length
- **Attribute Values**: 1000 bytes maximum length

[Docs Reference](https://docs.customer.io/integrations/api/track/#section/Track-API-limits)

### Intermediate Calls

Customer.io destination does not make intermediate calls for any event types. All events are processed directly to their respective endpoints.

### Anonymous User Profiles

- **Anonymous Event Tracking**:
  - When only an anonymous Track, Page, or Screen call is made (with anonymousId but no userId), events are sent to the anonymous events endpoint
  - Anonymous events can later be associated with identified users when the user is identified with the same anonymousId
  - Anonymous event names are truncated to 100 bytes for API compliance

### User Identity Resolution Behavior

- **Alias Handling**:
  - For Alias events, Customer.io uses the merge customers functionality
  - Merges user profiles from `previousId` (secondary) to `userId` (primary)
  - The secondary profile is deleted after merge, and its data is merged into the primary profile
  - Both email and ID identifiers are supported for merge operations

### Proxy Delivery

- **Supported**: No
- Customer.io destination does not implement proxy delivery functionality

### User Deletion

- **Supported**: No
- Customer.io destination does not implement user deletion functionality via the suppression API

### OAuth Support

- **Supported**: No
- Customer.io destination uses API Key authentication (Basic Auth) only

### Additional Functionalities

#### Device Management

- **Device Registration**: Automatic device token registration for mobile push notifications
- **Device Deletion**: Automatic device token removal when "Application Uninstalled" event is received
- **Supported Platforms**: iOS and Android
- **Device Events**:
  - Application Installed
  - Application Opened
  - Application Uninstalled
  - Custom device token events (configurable)

#### Anonymous User Handling

- **Anonymous ID Support**: Events can be sent with anonymousId before user identification
- **Event Merging**: Anonymous events are automatically associated with users when identified
- **Truncation**: Anonymous event names are truncated to 100 bytes to comply with API limits

#### Historical Data Import

- **Timestamp Support**: Events can be backdated using `historicalTimestamp` field
- **Created At Support**: User creation time can be set using `createdAt` field in traits
- **Format**: Unix timestamp (seconds since epoch)

#### Reserved Properties Handling

- Handles reserved properties according to Customer.io specifications:
  - `recipient`: Overrides email To field
  - `from_address`: Overrides email From field
  - `reply_to`: Overrides email Reply To field

#### Path Parameter Encoding

- **URL Encoding**: User IDs containing forward slashes are automatically URL encoded
- **Safety**: Prevents API endpoint path issues with special characters in user identifiers

## General Queries

### Event Ordering

#### All Event Types (Identify, Track, Page, Screen, Group, Alias)

Customer.io requires strict event ordering for all event types due to the following reasons:

**Identify Events**: These events update user profiles and attributes. Out-of-order processing could result in older attributes overwriting newer ones, leading to incorrect user profiles.

**Track, Page, Screen Events**: While these events include timestamps, they can also update user attributes alongside event tracking. The user attribute updates are subject to the same ordering requirements as Identify events.

**Group Events**: These events manage object relationships and attributes, requiring proper ordering to maintain data consistency.

**Alias Events**: These events merge user profiles and must be processed in order to prevent data corruption during merge operations.

> Effectively, Customer.io requires strict event ordering for all event types to maintain data integrity.

### Data Replay Feasibility

#### Missing Data Replay

- **Not Recommended**: Based on the **Event Ordering** requirements above, replaying missing data of any event type could result in data inconsistencies.

#### Already Delivered Data Replay

- **Not Feasible**: Customer.io treats each event as unique based on timestamp and content
- **Track/Page/Screen Events**: According to Customer.io documentation, each event is treated as a unique occurrence. Replaying these events will create duplicates in Customer.io, potentially affecting analytics and triggering campaigns multiple times.
- **Identify Events**: Replaying identify events could overwrite current user attributes with older data, leading to data regression.
- **Group Events**: Replaying group events could create duplicate object relationships or overwrite current object states.

### Multiplexing

- **Supported**: No
- **Description**: The Customer.io destination does not generate multiple output events from a single input event.

#### Multiplexing Scenarios

All Customer.io event types result in single API calls to their respective endpoints:

1. **Identify Events**: Single API call to `/api/v1/customers/:id`
2. **Track/Page/Screen Events**: Single API call to `/api/v1/customers/:id/events` or `/api/v1/events` (for anonymous)
3. **Group Events**: Single API call to `/api/v2/batch`
4. **Alias Events**: Single API call to `/api/v1/merge_customers`
5. **Device Events**: Single API call to `/api/v1/customers/:id/devices` or device deletion endpoint

**Note**: While Group events use batching, this is not considered multiplexing as multiple input events are combined into fewer output requests, not the reverse.

## Version Information

### Current API Versions

Customer.io uses versioned APIs but does not have versioned releases with deprecation schedules:

- **Track API v1**: Used for most operations (identify, track, alias, device management)
  - Endpoints: `/api/v1/customers/:id`, `/api/v1/customers/:id/events`, `/api/v1/events`, `/api/v1/merge_customers`, `/api/v1/customers/:id/devices`
- **Track API v2**: Used for batch operations (group events)
  - Endpoints: `/api/v2/entity`, `/api/v2/batch`

### Deprecation Information

- **No Deprecation Timeline**: Customer.io maintains backward compatibility without announced deprecation dates
- **Version Stability**: Both v1 and v2 APIs are stable and actively maintained
- **Migration Path**: No migration required as both versions are supported indefinitely

### New Versions Available

- **Current Status**: No newer API versions are available
- **v2 API**: Represents the latest batch processing capabilities
- **Feature Parity**: v1 and v2 APIs serve different purposes (individual vs batch operations)

## Documentation Links

### REST API Documentation

- [Customer.io Track API Overview](https://docs.customer.io/integrations/api/track/)
- [Track API Rate Limits](https://docs.customer.io/integrations/api/track/#section/Track-API-limits)
- [Identify API](https://docs.customer.io/integrations/api/track/#operation/identify)
- [Track Events API](https://docs.customer.io/integrations/api/track/#operation/track)
- [Merge Customers API](https://docs.customer.io/integrations/api/track/#operation/merge)
- [Batch API v2](https://docs.customer.io/integrations/api/track/#operation/batch)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## Validations

### Configuration Validations

- **API Key**: Required, must be a valid Customer.io API key
- **Site ID**: Required, must be a valid Customer.io site identifier
- **Data Center**: Must be either "US" or "EU"

### Event Validations

#### Identify Events
- **User Identifier**: Either `userId` or `email` must be present
- **Traits**: All traits are validated and reserved traits are excluded from mapping
- **Created At**: If present, must be a valid timestamp

#### Track Events
- **Event Name**: Must be a string, automatically trimmed of leading/trailing spaces
- **User Identification**: For identified events, requires `userId` or `email`
- **Anonymous Events**: Requires `anonymousId` when no user identifier is present

#### Page Events
- **Page Name**: Uses `name` or falls back to `properties.url`
- **Event Type**: Automatically set to "page" for Customer.io compliance

#### Screen Events
- **Screen Name**: Uses `event` or `properties.name`
- **Event Format**: Automatically formatted as "Viewed {screen_name} Screen"

#### Group Events
- **Object ID**: Required (`groupId`)
- **Object Type ID**: Defaults to "1" if not provided
- **Action**: Must be one of: identify, delete, add_relationships, delete_relationships

#### Alias Events
- **User ID**: Required (primary profile to keep)
- **Previous ID**: Required (secondary profile to merge and delete)
- **Identifier Format**: Automatically detects email vs ID format

#### Device Events
- **User Identifier**: Required (`userId` or `email`)
- **Device Token**: Required (`context.device.token`)
- **Platform**: Automatically detected from `context.device.type`

### Data Format Validations

- **Timestamps**: Converted to Unix timestamps (seconds since epoch)
- **Path Parameters**: User IDs with special characters are URL encoded
- **Event Names**: Anonymous event names truncated to 100 bytes
- **Batch Size**: Group events limited to 1000 events and 500KB per batch

## FAQ

### General Questions

**Q: Does Customer.io support both US and EU data centers?**
A: Yes, Customer.io supports both US (`track.customer.io`) and EU (`track-eu.customer.io`) data centers. Configure the `datacenter` setting to "US" or "EU" accordingly.

**Q: Can I send events before identifying a user?**
A: Yes, Customer.io supports anonymous events. Use the `anonymousId` field to track anonymous users. When you later identify the user with the same `anonymousId`, the anonymous events will be associated with their profile.

**Q: What happens if I send duplicate events?**
A: Customer.io treats each event as unique based on timestamp and content. Duplicate events will create separate entries in Customer.io, which may affect analytics and trigger campaigns multiple times.

**Q: Are there any limitations on event names?**
A: Event names should be strings without leading/trailing spaces (automatically trimmed). For anonymous events, names are truncated to 100 bytes to comply with Customer.io API limits.

### Device Management

**Q: How does device token registration work?**
A: Device tokens are automatically registered when specific events are fired (Application Installed, Application Opened, or a custom configured event). The device platform is automatically detected from the device type.

**Q: How are device tokens removed?**
A: Device tokens are automatically removed when an "Application Uninstalled" event is received for a user.

### Batching and Performance

**Q: Which events support batching?**
A: Only Group events support batching. They are batched up to 1000 events or 500KB per batch and sent to Customer.io's v2 batch API.

**Q: What are the rate limits?**
A: Customer.io enforces a rate limit of 3000 requests per 3 seconds. While not strictly enforced, consistently exceeding this may lead to throttling.

### Data Replay and Ordering

**Q: Can I replay historical data?**
A: Data replay is not recommended due to Customer.io's event uniqueness model and strict event ordering requirements. Replaying events may create duplicates or cause data inconsistencies.

**Q: Does event ordering matter?**
A: Yes, Customer.io requires strict event ordering for all event types to maintain data integrity. Out-of-order events can result in older data overwriting newer data.

### RETL and Warehouse Integration

**Q: Does Customer.io support warehouse sources?**
A: Yes, Customer.io supports RETL functionality for warehouse sources. Events marked with `mappedToDestination: true` undergo special processing for warehouse data synchronization.

**Q: What is the difference between regular events and RETL events?**
A: RETL events have additional processing for external ID mapping and are typically used for warehouse-to-destination data synchronization, while regular events are for real-time user activity tracking.

**Q: Does Customer.io support VDM v2 and record events?**
A: The main Customer.io destination does not support VDM v2 or record events. However, there is a separate "Customer.io Audience" destination that specifically supports VDM v2 with record events for audience management and list synchronization from warehouse sources.

### Troubleshooting

**Q: Why are my events not appearing in Customer.io?**
A: Check the following:
- Verify API credentials (Site ID and API Key)
- Ensure correct data center configuration (US vs EU)
- Validate required fields for each event type
- Check for rate limiting or API errors in logs

**Q: Why are my Group events not batching?**
A: Group events are automatically batched when multiple events are processed together. Single Group events are sent individually. Ensure you're sending multiple Group events in the same batch for batching to occur.

**Q: How do I handle users with special characters in their IDs?**
A: User IDs containing special characters (like forward slashes) are automatically URL encoded to prevent API endpoint issues. No additional handling is required.
