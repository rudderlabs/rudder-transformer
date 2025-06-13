# Split.io Destination

Implementation in **JavaScript**

## Configuration

### Required Settings

- **API Key**: Required for authentication with Split.io Events API
  - Must be a valid SDK API key with events tracking permissions
  - Used for Bearer token authentication in API requests

- **Traffic Type**: Specifies the default traffic type for events
  - Must match the names of Traffic Types defined in your Split.io instance
  - Used as fallback when traffic type is not provided in event payload
  - Example: `user`, `account`, `session`

### Optional Settings

- **Environment**: Specifies the Split.io environment for events
  - Must match the names of Environments defined in your Split.io instance
  - If not provided, events will be sent without environment specification
  - Example: `production`, `staging`, `development`

## Integration Functionalities

> Split.io supports **Cloud mode** only

### Supported Message Types

- Identify
- Track
- Page
- Screen
- Group

### Batching Support

- **Supported**: No
- **Reason**: Split.io destination uses individual API calls for each event
- **Implementation**: Uses `simpleProcessRouterDest` for processing events individually

### Rate Limits

The Split.io Events API enforces rate limits to ensure system stability:

| Endpoint | Event Types | Rate Limit | Description |
|----------|-------------|------------|-------------|
| `/api/events` | All supported event types | **NEEDS REVIEW** - Rate limit details not publicly documented | Used for sending all event types to Split.io |

#### Monitoring Rate Limits

Split.io API responses include rate limiting headers:
- `X-RateLimit-Remaining-Org`: Number of requests remaining for the organization
- `X-RateLimit-Remaining-IP`: Number of requests remaining for the IP address
- `X-RateLimit-Reset-Seconds-Org`: Seconds until organization rate limit resets
- `X-RateLimit-Reset-Seconds-IP`: Seconds until IP rate limit resets

#### Handling Rate Limit Errors

If you exceed rate limits, Split.io will return a `429 Too Many Requests` status code. The destination does not implement custom retry logic for rate limiting.

### Intermediate Calls

- **Supported**: No
- **Description**: Split.io destination makes direct API calls to the events endpoint without any intermediate processing calls

### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: Uses standard RudderStack proxy delivery mechanism

### User Deletion

- **Supported**: No
- **Reason**: Split.io Events API does not provide user deletion capabilities through the events endpoint

### Additional Functionalities

#### Event Type ID Validation

- **Validation Rule**: Event Type ID must match the regex pattern `/^[\dA-Za-z][\w.-]{0,79}$/`
- **Requirements**:
  - 80 characters or less
  - Starts with a letter or number
  - Contains only letters, numbers, hyphen, underscore, or period
- **Automatic Processing**: Spaces in event names are automatically replaced with underscores

#### Property Flattening

- **Supported**: Yes
- **Description**: Nested properties in events are automatically flattened using dot notation
- **Example**: `property1.property4.subProp1.a` for nested objects

#### Event Type Prefixing

- **Page Events**: Automatically prefixed with `Viewed_` and suffixed with `_page`
- **Screen Events**: Automatically prefixed with `Viewed_` and suffixed with `_screen`
- **Track Events**: No automatic prefixing applied

## General Queries

### Event Ordering

#### All Event Types
- **Required**: No
- **Reason**: Split.io Events API accepts events with timestamps and processes them based on the provided timestamp
- **Implementation**: Events include timestamp field for proper chronological ordering in Split.io

### Data Replay Feasibility

#### Missing Data Replay
- **Feasible**: Yes
- **Reason**: Events can be replayed with historical timestamps as Split.io accepts timestamp field in event payload

#### Already Delivered Data Replay
- **Feasible**: Yes with considerations
- **Considerations**:
  - Split.io may treat replayed events as new events
  - **NEEDS REVIEW** - Split.io's duplicate event handling behavior needs verification

### Multiplexing

- **Supported**: No
- **Description**: Split.io destination generates exactly one API call per input event
- **Implementation**: Each RudderStack event maps to a single Split.io events API call

## Version Information

### Current Version

- **API Version**: Split.io Events API does not use versioned endpoints
- **Endpoint**: `https://events.split.io/api/events`
- **Deprecation**: **NEEDS REVIEW** - No public information available about API deprecation schedule

### Version Compatibility

- **Current Implementation**: Uses the standard Split.io Events API
- **Future Versions**: **NEEDS REVIEW** - No information available about upcoming API versions

## Documentation Links

### Split.io API Documentation

- [Events Overview](https://docs.split.io/reference/events-overview)
- [Create Event](https://docs.split.io/reference/create-event)
- [Create Events (Bulk)](https://docs.split.io/reference/create-events)
- [Rate Limiting](https://docs.split.io/reference/rate-limiting)
- [Authentication](https://docs.split.io/reference/authentication)

### Split.io Help Center

- [Events Guide](https://help.split.io/hc/en-us/articles/360020585772-Events)
- [Traffic Types](https://help.split.io/hc/en-us/articles/360019916311-Traffic-type)
- [Environments](https://help.split.io/hc/en-us/articles/360019915771-Environments)
- [Creating Metrics](https://help.split.io/hc/en-us/articles/22005565241101-Metrics)

### RETL Functionality

Split.io destination does not support RETL functionality as it does not handle `record` event types.

### Business Logic and Mappings

For detailed business logic and field mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## Validations

### Event Type Requirements

- **Event Type**: Required for all events
- **User ID**: Required for all events (mapped to Split.io `key` field)
- **Event Type ID Validation**: Must match regex `/^[\dA-Za-z][\w.-]{0,79}$/`

### Field Validations

#### Event Type ID
- **Format**: Must start with letter or number
- **Length**: Maximum 80 characters
- **Characters**: Letters, numbers, hyphens, underscores, periods only
- **Processing**: Spaces automatically replaced with underscores

#### Traffic Type Name
- **Source**: Can be provided in traits, context.traits, or properties
- **Fallback**: Uses destination configuration `trafficType` if not provided
- **Requirement**: Must match Traffic Types defined in Split.io instance

#### Environment Name
- **Source**: Uses destination configuration `environment` if provided
- **Requirement**: Must match Environments defined in Split.io instance
- **Optional**: Events can be sent without environment specification

#### Value Field
- **Sources**: Extracted from `properties.revenue`, `properties.value`, or `properties.total`
- **Type**: Converted to float for metrics calculation
- **Optional**: Can be null or 0 for count-based metrics

### Property Restrictions

- **Reserved Fields**: Excluded from event properties
  - `eventTypeId`, `environmentName`, `trafficTypeName`
  - `key`, `timestamp`, `value`, `revenue`, `total`
- **Nested Objects**: Automatically flattened using dot notation
- **Null Values**: Removed from final payload
- **Empty Objects/Arrays**: Removed from final payload

## Error Scenarios

### Common Errors

1. **Missing Event Type**
   - **Error**: `InstrumentationError: Event type is required`
   - **Solution**: Ensure all events include a valid `type` field

2. **Invalid Event Type ID**
   - **Error**: `InstrumentationError: eventTypeId does not match with ideal format`
   - **Solution**: Verify event names match the required regex pattern

3. **Unsupported Event Type**
   - **Error**: `InstrumentationError: Event type [type] is not supported`
   - **Solution**: Use only supported event types (identify, track, page, screen, group)

4. **Missing User ID**
   - **Error**: Field mapping validation failure
   - **Solution**: Ensure all events include a `userId` field

### API Errors

1. **Authentication Errors**
   - **Status Code**: 401 Unauthorized
   - **Solution**: Verify API key is valid and has events tracking permissions

2. **Rate Limiting**
   - **Status Code**: 429 Too Many Requests
   - **Solution**: Implement request throttling or retry logic

3. **Invalid Payload**
   - **Status Code**: 400 Bad Request
   - **Solution**: Verify event payload matches Split.io Events API schema

## FAQ

### Q: Can I send events without a userId?
**A**: No, Split.io requires a `key` field (mapped from userId) for all events to associate them with a user or entity.

### Q: How are nested properties handled?
**A**: Nested properties are automatically flattened using dot notation. For example, `user.profile.name` becomes `"user.profile.name"` in the properties object.

### Q: What happens if I don't provide a traffic type?
**A**: The destination will use the `trafficType` configured in the destination settings as a fallback.

### Q: Can I send historical events?
**A**: Yes, you can include a `timestamp` field in your events to send historical data. Split.io will process events based on their timestamp.

### Q: Are there any limits on property names or values?
**A**: **NEEDS REVIEW** - Split.io's specific limits on property names and values are not documented in their public API documentation.

### Q: How do I track revenue or conversion values?
**A**: Include `revenue`, `value`, or `total` in your event properties. These will be mapped to Split.io's `value` field for metrics calculation.
