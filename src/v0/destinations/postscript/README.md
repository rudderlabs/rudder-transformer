# PostScript Destination

Implementation in **TypeScript**

## Configuration

### Required Settings

- **API Key**: Required for authentication with PostScript API
  - Must have appropriate permissions for subscriber management and custom events
  - Format: `ps_api_key_[alphanumeric_string]`

### Optional Settings

- **Consent Management**: Standard RudderStack consent management settings
- **OneTrust Cookie Categories**: For OneTrust consent management integration
- **Ketch Consent Purposes**: For Ketch consent management integration

## Integration Functionalities

> PostScript supports **Cloud mode** only

### Supported Message Types

- Identify
- Track

### Batching Support

- **Supported**: Yes
- **Message Types**: All message types (Identify and Track)
- **Batch Limits**:
  - Individual responses for each event (no true batching at API level)
  - Efficient processing through lookup-based operations for identify events

### Rate Limits

The PostScript API enforces rate limits to ensure system stability:

| Endpoint                | Event Types              | Rate Limit             | Description                                        |
| ----------------------- | ------------------------ | ---------------------- | -------------------------------------------------- |
| `/api/v2/subscribers`   | Identify (create/update) | 15 requests per second | Used for creating and updating subscriber profiles |
| `/api/v2/custom-events` | Track                    | 15 requests per second | Used for sending custom events                     |

#### Rate Limit Scope

- Rate limits apply per token:
  - Partner token: 15 requests per second for that partner
  - Shop token: 15 requests per second for that shop
  - Partner + Shop token combination: 15 requests per second for that specific combination

#### Handling Rate Limit Errors

If you exceed rate limits, PostScript will return a `429 Too Many Requests` status code with the following error structure:

```json
{
  "error_code": 3002,
  "error_message": "Rate limit exceeded",
  "success": false
}
```

The destination implements exponential backoff retry logic to handle these errors.

[Docs Reference](https://developers.postscript.io/docs/rate-limits)

### Intermediate Calls

#### Identify Flow (Subscriber Lookup)

- **Supported**: Yes
- **Use Case**: Determining whether to create new subscribers or update existing ones
- **Endpoint**: `/api/v2/subscribers` (GET with phone_in filter)
- This functionality performs batch lookup of subscribers by phone number to optimize create vs update operations

```typescript
// The lookup process for identify events:
const lookupResults = await performSubscriberLookup(identifyEvents, apiKey);
// Based on lookup results, events are routed to either:
// - POST /api/v2/subscribers (for new subscribers)
// - PATCH /api/v2/subscribers/{subscriber_id} (for existing subscribers)
```

> No intermediate calls are made for Track events

### Proxy Delivery

- **Supported**: Yes
- **Source Code Path**: `src/v1/destinations/postscript/networkHandler.ts`

### User Deletion

- **Supported**: No
- PostScript does not currently implement user deletion functionality

### OAuth Support

- **Supported**: No
- PostScript uses API key authentication only

### Processor vs Router Destination

- **Type**: Router destination
- **Configuration**: `config.transformAtV1 = "router"` in db-config.json

### Partial Batching Response Handling

- **Supported**: Yes
- **Implementation**: V1 network handler with individual event status tracking
- **Source Code Path**: `src/v1/destinations/postscript/networkHandler.ts`

### Additional Functionalities

#### Subscriber Management

- **Lookup-based Operations**: Automatically determines create vs update operations for identify events
- **Phone Number Validation**: Requires valid phone numbers for subscriber identification
- **Keyword Support**: Supports both keyword and keyword_id for subscriber opt-in flows

#### Custom Event Tracking

- **Event Properties**: Supports custom properties for event enrichment
- **Timestamp Handling**: Proper conversion of RudderStack timestamps to PostScript format
- **Subscriber Identification**: Multiple identification methods (subscriber_id, external_id, phone, email)

#### Field Mapping

- **Subscriber Fields**: Maps RudderStack traits to PostScript subscriber fields
- **Custom Properties**: Unmapped traits are converted to custom properties with snake_case naming
- **External ID Support**: Handles multiple external ID types (subscriber_id, external_id, shopify_customer_id)

### Validations

#### Identify Events

- **Required Fields**: Phone number (phone) is mandatory
- **Optional Fields**: Email, first name, last name, keyword/keyword_id
- **Custom Properties**: All unmapped traits are included as custom properties

#### Track Events

- **Required Fields**: Event name is mandatory
- **Subscriber Identification**: At least one of subscriber_id, external_id, phone, or email
- **Properties**: All event properties are included in the custom event payload

## General Queries

### Event Ordering

#### Identify Events

**Ordering Required**: Yes, for subscriber profile consistency

PostScript subscriber profiles can be updated with new attributes, and out-of-order events could result in newer data being overwritten by older data. This is particularly important for:

- Profile attributes (name, email, tags, properties)
- Subscription status changes
- Keyword associations

#### Track Events

**Ordering Recommended**: Yes, for accurate event sequencing

While PostScript custom events include timestamps (`occurred_at` field), maintaining event order is recommended to ensure:

- Proper event sequence in customer journey tracking
- Accurate trigger timing for automated flows
- Consistent analytics and reporting

> PostScript requires event ordering for both event types to maintain data integrity and proper customer journey tracking.

### Data Replay Feasibility

#### Missing Data Replay

- **Not Recommended**: Due to event ordering requirements mentioned above
- **Risk**: Out-of-order events could overwrite newer subscriber data with older data
- **Alternative**: Consider using PostScript's webhook system to capture missed events in real-time

#### Already Delivered Data Replay

- **Not Feasible**: PostScript treats each event as unique
- **Track Events**: Each custom event is treated as a separate occurrence, even if properties are identical
- **Identify Events**: Subscriber updates will overwrite existing data rather than merge intelligently
- **Impact**: Replaying data will create duplicate events and potentially inconsistent subscriber profiles

### Multiplexing

- **Supported**: No
- **Description**: PostScript destination does not generate multiple output events from a single input event
- **Implementation**: Each RudderStack event maps to exactly one PostScript API call:
  - Identify events → Single subscriber create/update call
  - Track events → Single custom event creation call

## Version Information

### Current Version

- **API Version**: v2
- **Base URL**: `https://api.postscript.io/api/v2`
- **Endpoints Used**:
  - `/subscribers` - For subscriber management
  - `/custom-events` - For event tracking

### Version Deprecation

PostScript maintains backward compatibility with v1 API but recommends using v2 for new integrations. The v2 API includes:

- Improved object identifiers with prefixes (e.g., `s_` for subscriber IDs)
- Enhanced error handling and response formats
- Better support for partner integrations

**NEEDS REVIEW**: Specific deprecation timeline for v1 API not found in public documentation.

## Documentation Links

### API Documentation

- [PostScript API Overview](https://developers.postscript.io/)
- [Create Subscriber API](https://developers.postscript.io/reference/create-subscriber)
- [Update Subscriber API](https://developers.postscript.io/reference/update-subscriber-by-id)
- [Create Custom Event API](https://developers.postscript.io/reference/create-custom-event)
- [Rate Limits](https://developers.postscript.io/docs/rate-limits)
- [Authentication](https://developers.postscript.io/docs/api-authentication)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)
