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

- **Supported**: No (current implementation)
- **Reason**: Current implementation uses individual API calls for each event
- **Implementation**: Uses `simpleProcessRouterDest` for processing events individually
- **Available Alternative**: Split.io provides a bulk events API endpoint (`/api/events/bulk`) that supports batching, but the current RudderStack implementation does not utilize it

### Rate Limits

The Split.io Events API does not enforce rate limits:

| Endpoint           | Event Types               | Rate Limit        | Description                                    |
| ------------------ | ------------------------- | ----------------- | ---------------------------------------------- |
| `/api/events`      | All supported event types | **No rate limit** | Used for sending individual events to Split.io |
| `/api/events/bulk` | All supported event types | **No rate limit** | Used for sending bulk events to Split.io       |

According to Split.io's official documentation: "There is no rate limit on the events API. It can handle any volume of load of events."

#### Payload Size Recommendations

While there are no rate limits, Split.io recommends:

- Keep individual payload sizes under **1 megabyte** for optimal performance
- Use bulk events endpoint for high-volume event ingestion

#### Rate Limiting for Other APIs

Note that rate limiting applies to Split.io's Admin API (used for feature flag management) but does not affect the Events API used by this destination.

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

- **Validation Rule**: Event Type ID must match the regex pattern `/^[a-zA-Z0-9][-_\.a-zA-Z0-9]{0,62}$/`
- **Requirements**:
  - **63 characters or fewer** (as per Split.io official documentation)
  - Starts with a letter or number
  - Contains only letters, numbers, hyphen, underscore, or period
- **Automatic Processing**: Spaces in event names are automatically replaced with underscores

> **Note**: The current implementation uses a slightly different regex pattern (`/^[\dA-Za-z][\w.-]{0,79}$/`) which allows up to 80 characters. This discrepancy exists between the code implementation and Split.io's official documentation.

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
- **Implementation**: Split.io processes events based on the provided timestamp, allowing for historical data ingestion

#### Already Delivered Data Replay

- **Feasible**: Yes, but creates duplicates
- **Behavior**: Split.io treats all events as unique and does not deduplicate based on event content or IDs
- **Considerations**:
  - Replayed events will be processed as new events, potentially affecting metrics calculations
  - No built-in deduplication mechanism in Split.io Events API
  - Consider the impact on experiment results and metrics when replaying data

### Multiplexing

- **Supported**: No
- **Description**: Split.io destination generates exactly one API call per input event
- **Implementation**: Each RudderStack event maps to a single Split.io events API call

## Version Information

### Current Version

- **API Version**: Split.io Events API does not use versioned endpoints
- **Endpoints Used**:
  - `https://events.split.io/api/events` - Single event endpoint (currently implemented)
  - `https://events.split.io/api/events/bulk` - Bulk events endpoint (available but not implemented)
- **Deprecation**: No deprecation schedule announced for Events API

### Version Compatibility

- **Current Implementation**: Uses the standard Split.io Events API (single event endpoint)
- **Available Enhancements**: Bulk events endpoint available for potential batching implementation
- **Future Versions**: Split.io Events API is stable with no announced breaking changes

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
- **Length**: Maximum 63 characters (as per Split.io official documentation)
- **Characters**: Letters, numbers, hyphens, underscores, periods only
- **Processing**: Spaces automatically replaced with underscores
- **Implementation Note**: Current code allows up to 80 characters, creating a discrepancy with official Split.io requirements

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

- **Property Limits**:
  - Maximum **300 properties** per event type
  - Each property has a **256 character limit**
  - Supported property types: strings, numbers, and booleans
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
   - **Cause**: Invalid or missing API key
   - **Solution**: Verify API key is valid and has events tracking permissions

2. **Invalid Payload**

   - **Status Code**: 400 Bad Request
   - **Cause**: Malformed JSON, missing required fields, or invalid field values
   - **Solution**: Verify event payload matches Split.io Events API schema

3. **Payload Too Large**

   - **Status Code**: 413 Payload Too Large
   - **Cause**: Event payload exceeds 1MB recommended limit
   - **Solution**: Reduce payload size or split into multiple requests

4. **Server Errors**

   - **Status Code**: 500 Internal Server Error
   - **Cause**: Split.io service issues
   - **Solution**: Retry with exponential backoff

5. **Service Unavailable**
   - **Status Code**: 503 Service Unavailable
   - **Cause**: Split.io service temporarily unavailable
   - **Solution**: Retry with exponential backoff

**Note**: Split.io Events API does not return 429 (Rate Limiting) errors as there are no rate limits enforced.

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

**A**: Yes, Split.io enforces the following limits:

- Maximum 300 properties per event type
- Each property has a 256 character limit
- Supported property types: strings, numbers, and booleans

### Q: How do I track revenue or conversion values?

**A**: Include `revenue`, `value`, or `total` in your event properties. These will be mapped to Split.io's `value` field for metrics calculation.
