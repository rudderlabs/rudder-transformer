# Dub Destination

Implementation in **TypeScript**

> **Beta Integration**: This destination is currently in beta status

## Configuration

### Required Settings

- **API Key**: Required for authentication with Dub API

  - Format: Must match pattern `^dub_[a-zA-Z0-9_]{8,100}$`
  - Must have appropriate permissions for conversion tracking
  - **Note**: Conversion endpoints require a [Business plan](https://dub.co/pricing) subscription or higher
  - **UI Placeholder**: `e.g: dub_123456789abcdef`

- **Event Mapping**: Configuration to map RudderStack events to Dub conversion types
  - Maps incoming track event names to specific Dub conversion types
  - **Important**: Only events with a `clickId` and configured in this mapping will be successfully delivered to Dub
  - Events without a `clickId` or not mapped here will fail
  - Supported mapping targets:
    - `LEAD_CONVERSION`: For lead tracking events
    - `SALES_CONVERSION`: For sale/revenue tracking events
  - **Event Name Format**: Must match pattern `^[^{}]{1,100}$`

### Optional Settings

- **Convert Amount to Cents**: Controls amount conversion for sales events
  - Default: `true`
  - When enabled: Converts dollar amounts to cents (e.g., $99.99 → 9999 cents)
  - When disabled: Uses the raw amount value as provided
  - **UI Note**: "We will multiply the amount by 100 before sending it to Dub if this is set to true"

### Consent Management Settings

- **Consent Management Provider**: Configure consent settings for compliance
  - Supported providers: Custom, iubenda, Ketch, OneTrust
  - Default: OneTrust
- **Resolution Strategy**: Required consent logic (AND/OR) for custom providers
- **Consent Category IDs**: Configure consent category IDs for compliance

## Integration Functionalities

### Supported Message Types

- **Track**: Only supported message type for conversion tracking

### Supported Conversion Types

- **Lead Conversion**: Track lead generation events (sign-ups, downloads, form submissions)
- **Sales Conversion**: Track revenue-generating events (purchases, subscriptions, upgrades)

### Batching Support

- **Supported**: No - Dub does not support traditional batching
- **Router Processing**: Yes - Can process multiple events in a single router request
- **Message Types**: Track events only

### Authentication

- Uses Bearer token authentication via Authorization header
- API Key format: `Bearer dub_xxxxxx`

### Router Destination

- **Type**: Router destination (`config.transformAtV1: "router"`)
- **Batching**: No traditional batching support - each event generates individual API calls
- **Router Processing**: Uses `simpleProcessRouterDest` to process multiple events in a single router request
- **Event Processing**: Each track event results in one API call to either `/track/lead` or `/track/sale`

### Proxy Delivery

- **Supported**: No
- **Details**: No `networkHandler.js` implementation found

### User Deletion

- **Supported**: No
- **Details**: No `deleteUsers.js` implementation found

### OAuth Support

- **Supported**: No
- **Details**: Uses API key authentication only

### Additional Functionalities

#### Event Mapping Configuration

- **Purpose**: Maps RudderStack track event names to Dub conversion types
- **Configuration**: Array of mapping objects with `from` (event name) and `to` (conversion type)
- **Validation**: Event names must match pattern `^[^{}]{1,100}$`

#### Amount Conversion

- **Feature**: Automatic conversion of dollar amounts to cents for sales events
- **Configuration**: Controlled via `convertAmountToCents` setting
- **Behavior**: When enabled, multiplies amounts by 100 and rounds to nearest integer

#### Customer Identification

- **External ID Resolution**: Uses multiple fallback methods for customer identification
  - Primary: `getDestinationExternalID(message, 'customerExternalId')`
  - Fallback: `getFieldValueFromMessage(message, 'userIdOnly')`
  - Required for both lead and sales events

#### Field Mapping

**Lead Conversion Fields:**

- **Required**: `clickId`, `eventName`, `customerExternalId`
- **Optional**: `customerEmail`, `customerAvatar`, `mode`, `eventQuantity`, `metadata`
- **Special Handling**:
  - `clickId` must be provided in `context.dubClickId` - this is the unique click ID from Dub cookie
  - `customerName` derived from message name fields or `getFullName()`
  - `mode` defaults to 'wait' for synchronous processing
  - `metadata` excludes specific reserved fields

**Sales Conversion Fields:**

- **Required**: `amount`, `eventName`, `customerExternalId`
- **Optional**: `currency`, `paymentProcessor`, `invoiceId`, `leadEventName`, `clickId`, customer fields, `metadata`
- **Special Handling**:
  - `amount` converted to cents when `convertAmountToCents` is enabled
  - `invoiceId` has fallback mapping from `orderId` or `order_id`
  - `metadata` excludes amount-related and customer fields

## General Queries

### Event Ordering

#### Track Events (Lead and Sales Conversions)

**Event ordering is MANDATORY** for Dub conversion tracking. The required flow is:

**Click → Lead → Sale**

1. **Lead Events**: Must be processed before any associated sale events
2. **Sales Events**: Can only be processed after the corresponding lead event has been successfully tracked
3. **Strict Ordering Required**: Dub requires events to be processed in the correct chronological order
4. **Attribution Chain**: Each conversion event builds upon the previous event in the attribution chain

**Critical Requirement**: RudderStack must ensure that lead events are delivered and processed by Dub before any related sale events are sent. Out-of-order delivery will break the conversion attribution chain.

### Data Replay Feasibility

#### Missing Data Replay

- **Complex**: Requires careful orchestration due to strict event ordering requirements
- **Requirements**:
  - **Chronological Order**: Events must be replayed in strict chronological order (Click → Lead → Sale)
  - **Lead Events First**: All missing lead events must be replayed before any associated sale events
  - **Attribution Windows**: Verify that click attribution windows haven't expired
  - **Dependency Management**: Ensure proper sequencing to maintain conversion attribution chain

#### Already Delivered Data Replay

- **Not Recommended**: Due to strict event ordering requirements and potential attribution conflicts
- **Sales Events**:
  - **With `invoiceId`**: Dub uses invoice ID as idempotency key - only one sale per invoice ID
  - **Without `invoiceId`**: Will create duplicate sales events and break attribution
- **Lead Events**: Will create duplicate lead events and potentially corrupt attribution chains
- **Recommendation**: Avoid replaying already delivered data as it may disrupt the conversion flow

### Rate Limits and Batch Sizes

The Dub API enforces rate limits to ensure fair usage and system stability. Conversion endpoints (`/track/lead` and `/track/sale`) are subject to the same rate limits as other API endpoints.

**API Rate Limits by Plan:**

- **Free**: 60 requests per minute (conversion endpoints not available)
- **Pro**: 600 requests per minute (conversion endpoints not available)
- **Business**: 1,200 requests per minute ✅ (required for conversion endpoints)
- **Advanced**: 3,000 requests per minute ✅
- **Enterprise**: Custom rate limits ✅ (contact sales for details)

**Rate Limit Headers:**
Dub follows the [IETF standard](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers) for rate limit headers:

- `X-RateLimit-Limit`: Maximum requests permitted per hour
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: UTC epoch seconds when window resets
- `Retry-After`: Seconds to wait before retrying

**Error Handling:**

- **Status Code**: `429 Too Many Requests` when rate limit exceeded
- **Error Code**: `rate_limit_exceeded` in response body
- **Retry Logic**: Implement exponential backoff using `Retry-After` header

**Batch Sizes:**

- **No Batching Support**: Dub destination does not support traditional batching
- **Router Processing**: Handles multiple events in router requests but sends individual API calls
- **Rate Limit Consideration**: Each event generates one API call, so monitor rate limits accordingly

### Multiplexing

- **Supported**: No
- **Description**: Each track event generates a single API call to either `/track/lead` or `/track/sale` endpoint
- **Event Processing**: Single input event → Single output request

## Version Information

### Current Version

- **API Version**: Dub doesn't use versioned API endpoints
- **Base URL**: `https://api.dub.co`
- **Endpoints Used**:
  - `/track/lead` - For lead conversion tracking
  - `/track/sale` - For sales conversion tracking

### Deprecation Information

No data available

## Documentation Links

### API Documentation

- [Dub API Overview](https://dub.co/docs/api-reference)
- [Track Lead API](https://dub.co/docs/api-reference/endpoint/track-lead)
- [Track Sale API](https://dub.co/docs/api-reference/endpoint/track-sale)
- [API Authentication](https://dub.co/docs/api-reference/tokens)
- [Error Handling](https://dub.co/docs/api-reference/errors)

### Pricing and Plans

- [Dub Pricing](https://dub.co/pricing)
- [Business Plan Features](https://dub.co/pricing) - Required for conversion tracking

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## FAQ

### What plan is required to use the Dub destination?

Conversion tracking endpoints (`/track/lead` and `/track/sale`) require a Business plan subscription or higher. The Free and Pro plans do not support conversion tracking functionality.

### How does the amount conversion work for sales events?

When `convertAmountToCents` is enabled (default), dollar amounts are multiplied by 100 and rounded to the nearest integer. For example, $99.99 becomes 9999 cents. This follows Dub's requirement for amounts in cents for two-decimal currencies.

### What happens if a track event is not mapped to a conversion type?

The destination will throw a `ConfigurationError` indicating that the event is not mapped to any Dub event type, and the message will be aborted.

### How does customer identification work?

The destination uses a fallback hierarchy for customer identification:

1. `context.externalId` with type `customerExternalId`
2. `userId` field from the message
   If no customer identifier is found, an `InstrumentationError` is thrown.

### Can I track the same sale multiple times?

If you provide an `invoiceId`, Dub will use it as an idempotency key, meaning only one sale event can be recorded for a given invoice ID. Without an `invoiceId`, duplicate sales events will be created.

### What are the rate limits for conversion tracking?

Rate limits depend on your Dub plan:

- **Business plan**: 1,200 requests per minute
- **Advanced plan**: 3,000 requests per minute
- **Enterprise plan**: Custom limits (contact Dub sales)

If you exceed the rate limit, you'll receive a `429 Too Many Requests` response. Implement exponential backoff retry logic using the `Retry-After` header value.

### Why is event ordering so important for Dub?

Dub requires **strict event ordering** for proper conversion attribution. The mandatory flow is **Click → Lead → Sale**. If events are processed out of order (e.g., sale before lead), the conversion attribution chain will be broken and events may not be properly tracked. RudderStack automatically handles this ordering requirement, but be aware that data replay scenarios require careful chronological sequencing.
