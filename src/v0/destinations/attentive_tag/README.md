# Attentive Tag Destination

Implementation in **Javascript**

## Configuration

### Required Settings

- **API Key**: Required for authentication with Attentive Tag API

  - Must have appropriate permissions for the operations you want to perform
  - Used as Bearer token in Authorization header
  - Format: `Bearer <api_key>`

- **Sign Up Source ID**: Required for subscription events
  - Unique identifier for the sign-up source
  - Used to track the origin of subscriptions
  - Required for subscribe operation

### Optional Settings

- **Enable New Identify Flow**: Enable to use the new identify flow with separate API calls
  - When enabled, uses Identity Resolution API and User Attributes API
  - When disabled, uses the legacy subscription-based identify flow
  - Default: `false`

## Integration Functionalities

> Attentive Tag supports **Cloud mode** only

### Supported Message Types

- Identify
- Track

### Batching Support

- **Supported**: No
- **Message Types**: N/A
- **Reason**: Attentive Tag API processes events individually

### Rate Limits

**NEEDS REVIEW**: Specific rate limits for Attentive Tag API endpoints are not publicly documented. The integration implements standard HTTP retry logic for handling rate limiting.

### Intermediate Calls

#### Identify Flow (New Identify Flow Enabled)

- **Supported**: Yes (when `enableNewIdentifyFlow = true`)
- **Use Case**: Identity resolution and user attribute updates
- **Endpoints**:
  - `/identity-resolution/user-identifiers` - For identity resolution
  - `/attributes/custom` - For user attribute updates
- **Conditions**: Requires email/phone AND clientUserId/customIdentifiers

#### Identify Flow (Legacy Flow)

- **Supported**: Yes (default behavior)
- **Use Case**: Subscription management
- **Endpoints**:
  - `/subscriptions` - For subscribe operations
  - `/subscriptions/unsubscribe` - For unsubscribe operations
- **Conditions**: Requires signUpSourceId for subscribe operations

### Proxy Delivery

- **Supported**: No
- **Source Code Path**: N/A
- **Reason**: No `networkHandler.js` implementation found

### User Deletion

- **Supported**: No
- **Source Code Path**: N/A
- **Reason**: No `deleteUsers.js` implementation found

### OAuth Support

- **Supported**: No
- **Authentication Method**: API Key (Bearer token)

### Additional Functionalities

#### Subscription Event Handling

- **Supported**: Yes
- **Event Name**: `subscription_event`
- **Functionality**: Handles both subscribe and unsubscribe operations in a single event
- **Channel Support**: Email and SMS (TEXT)
- **Consent Management**: Supports granular consent management per channel

#### E-commerce Event Support

- **Supported**: Yes
- **Supported Events**:
  - `product_viewed` - Maps to `/events/ecommerce/product-view`
  - `product_list_viewed` - Maps to `/events/ecommerce/product-view`
  - `product_added` - Maps to `/events/ecommerce/add-to-cart`
  - `order_completed` - Maps to `/events/ecommerce/purchase`

#### Custom Event Support

- **Supported**: Yes
- **Endpoint**: `/events/custom`
- **Property Validation**: Validates property keys for restricted characters
- **Timestamp Validation**: Events must be within 12 hours of occurrence

#### External Identifiers

- **Supported**: Yes
- **Supported Types**:
  - `clientUserId`
  - `shopifyId`
  - `klaviyoId`
  - `customIdentifiers` (array of name-value pairs)

### Validations

#### Required Fields

- **Identify Events**: Either email or phone is required
- **Track Events**: Event name is required
- **E-commerce Events**:
  - `product_id` and `product_variant_id` are required for product events
  - `price` is required for product events
- **Subscription Events**: `signUpSourceId` is required for subscribe operations

#### Property Validations

- Property keys cannot contain: `'`, `"`, `{`, `}`, `[`, `]`, `,`
- Events must be sent within 12 hours of their occurrence
- Channel consents must be an array for subscription events

#### Data Type Validations

- Products array must be an array for e-commerce events
- Custom identifiers must be an array of objects with `name` and `value` properties

## General Queries

### Event Ordering

- **Required**: No
- **Reasoning**:
  - User profile updates (identify events) don't require strict ordering as they update user attributes
  - Track events are timestamped and processed individually
  - E-commerce events are independent and don't have dependencies on order
  - Subscription events are idempotent and can be processed in any order

### Data Replay Feasibility

#### Missing Data Replay

- **Feasible**: Yes
- **Reasoning**:
  - Events are processed independently
  - No strict ordering requirements
  - Timestamp validation allows events within 12 hours
  - User attributes can be updated multiple times without issues

#### Already Delivered Data Replay

- **Not Recommended**: Yes
- **Reasoning**:
  - Events will be duplicated in Attentive Tag
  - Could affect analytics and campaign triggers
  - User attributes may be overwritten with stale data

### Rate Limits and Batch Sizes

**NEEDS REVIEW**: Specific rate limits and batch sizes for Attentive Tag API are not publicly documented. The integration processes events individually without batching.

### Version Deprecation Cadence

#### Current Version

- **Version**: v1
- **Base URL**: `https://api.attentivemobile.com/v1`
- **End-of-Life**: Not specified in public documentation

#### New Version Availability

- **Available**: No information available
- **Breaking Changes**: N/A

#### Documentation Links

- [Attentive API Documentation](https://docs.attentivemobile.com/openapi/reference/)
- [Custom Events API](https://docs.attentivemobile.com/openapi/reference/tag/Custom-Events/)

## RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

## Business Logic and Mappings

For business logic and mappings information, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## FAQ

### Q: Why are events limited to 12 hours from occurrence?

A: Attentive Tag enforces this limitation to ensure data freshness and relevance for marketing campaigns. Events older than 12 hours may not be processed.

### Q: Can I use both email and phone for the same user?

A: Yes, you can provide both email and phone in the same event. Attentive Tag will use both identifiers for user matching and communication.

### Q: How does the subscription event handle multiple channels?

A: The `subscription_event` can include multiple channel consents in a single event. Each consent specifies the channel (email/sms) and whether the user consented (true/false).

### Q: What happens if I send duplicate events?

A: Attentive Tag will process duplicate events as separate events. There's no built-in deduplication, so care should be taken to avoid sending duplicates.

### Q: Can I update user attributes without creating a subscription?

A: Yes, when using the new identify flow (`enableNewIdentifyFlow = true`), you can update user attributes without affecting subscription status.

### Q: How are external identifiers used?

A: External identifiers help Attentive Tag match users across different systems. They're included in API calls to improve user identification and data consistency.
