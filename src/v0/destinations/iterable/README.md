# Iterable Destination

Implementation in **Javascript** (v0) and **TypeScript** (v1)

## Configuration

### Required Settings

- **API Key**: Required for authentication with Iterable REST API

  - Must have appropriate permissions for the operations you want to perform
  - For user deletion, the API key must have the `users.delete` permission
  - Configured via `apiKey` parameter

- **Data Center**: Specifies the Iterable data center to use
  - Format: `[REGION]DC` (e.g., `USDC`, `EUDC`)
  - Available data centers:
    - **USDC**: United States Data Center (`https://api.iterable.com/api/`)
    - **EUDC**: European Union Data Center (`https://api.eu.iterable.com/api/`)
  - Configured via `dataCenter` parameter

### Optional Settings

- **Register Device or Browser API Key**: Optional API key for device/browser token registration

  - Used for mobile push notifications and web push notifications
  - Configured via `registerDeviceOrBrowserApiKey` parameter

- **Use Native SDK**: Enable native SDK for web device mode

  - Allows client-side tracking when enabled
  - Configured via `useNativeSDK.web` parameter

- **Prefer User ID**: Controls whether to prefer userId over email for user identification

  - Default: `true`
  - Configured via `preferUserId` parameter

- **Merge Nested Objects**: Controls whether to merge nested objects in user attributes
  - Default: `true`
  - Configured via `mergeNestedObjects` parameter

## Integration Functionalities

> Iterable supports **Cloud mode** and **Device mode** (web only)

### Supported Message Types

#### Cloud Mode

- **Identify**: User profile creation and updates
- **Track**: Event tracking including custom events and e-commerce
- **Page**: Page view tracking
- **Screen**: Screen view tracking (mobile)
- **Alias**: Email address updates

#### Device Mode (Web Only)

- **Identify**: User profile updates via native SDK
- **Track**: Event tracking via native SDK

### Batching Support

Iterable supports batching for the following message types to optimize performance and reduce API calls:

#### Identify Events

- **Endpoint**: `/api/users/bulkUpdate`
- **Batch Size**: Up to 4MB request size (~1000 users)
- **Rate Limit**: 5 requests/second per API key

#### Track Events

- **Endpoint**: `/api/events/trackBulk`
- **Batch Size**: Up to 4MB request size (~1000 events)
- **Rate Limit**: 10 requests/second per project

### API Endpoints and Rate Limits

| Endpoint                       | Event Types                   | Rate Limit                       | Batch Limits                    | Description                    |
| ------------------------------ | ----------------------------- | -------------------------------- | ------------------------------- | ------------------------------ |
| `/users/bulkUpdate`            | Identify                      | 5 requests/second per API key    | 4MB request size (~1000 users)  | Bulk user profile updates      |
| `/events/trackBulk`            | Track, Page, Screen           | 10 requests/second per project   | 4MB request size (~1000 events) | Bulk event tracking            |
| `/events/track`                | Track, Page, Screen           | 2000 requests/second per project | Single event                    | Individual event tracking      |
| `/users/update`                | Identify                      | 500 requests/second              | Single user                     | Individual user updates        |
| `/commerce/trackPurchase`      | Track (Order Completed)       | -                                | Single purchase                 | Purchase tracking              |
| `/commerce/updateCart`         | Track (Product Added/Removed) | -                                | Single cart update              | Shopping cart updates          |
| `/users/updateEmail`           | Alias                         | -                                | Single user                     | Email address updates          |
| `/users/registerDeviceToken`   | Device Registration           | 500 requests/second per project  | Single device                   | Mobile push token registration |
| `/users/registerBrowserToken`  | Browser Registration          | -                                | Single browser                  | Web push token registration    |
| `/users/byUserId/{userId}`     | User Deletion                 | 100 requests/second              | Single user                     | User data deletion             |
| `/catalogs/{objectType}/items` | RETL Catalog                  | 100 requests/second              | 1000 items                      | Catalog item management        |

### Intermediate Calls

Iterable destination makes intermediate API calls for the following scenarios:

1. **Device/Browser Token Registration**: When device or browser tokens are present in identify events
2. **E-commerce Event Mapping**: Automatic mapping of specific track events to commerce endpoints
3. **RETL Catalog Operations**: When handling catalog-related record events

### Proxy Delivery

The destination uses RudderStack's proxy delivery mechanism with:

- **v1 Network Handler**: Advanced response handling with strategy pattern for bulk operations
- **Bulk Response Processing**: Specialized handling for bulk API responses with individual event status tracking
- **Error Handling**: Detailed error mapping for failed operations including user-specific failures
- **Response Strategies**: Different handling strategies for bulk vs. individual API calls

### User Deletion

Iterable supports user deletion through the Suppression API:

- **Endpoint**: `DELETE /api/users/byUserId/{userId}`
- **Requirements**: Valid API key with deletion permissions
- **Behavior**: Permanently removes user data from Iterable
- **Error Handling**: Graceful handling of user not found scenarios (404 responses)
- **Batch Processing**: Supports deletion of multiple users with individual error tracking

### Additional Functionalities

#### Multiplexing

Iterable destination supports multiplexing in the following scenarios:

1. **Device/Browser Token Registration**: **YES**
   - When an identify event contains device or browser token information
   - Creates additional API calls to register tokens alongside the main user update
   - Example: Identify event → User update call + Device token registration call

#### E-commerce Event Handling

Iterable automatically maps specific track events to specialized commerce endpoints:

- **Order Completed** → `/api/commerce/trackPurchase`
  - Includes purchase items, total amount, and transaction details
- **Product Added** → `/api/commerce/updateCart`
  - Updates shopping cart with added products
- **Product Removed** → `/api/commerce/updateCart`
  - Updates shopping cart with removed products

#### Data Center Support

The destination supports multiple data centers with automatic endpoint routing:

- **USDC**: `https://api.iterable.com/api/` (Default)
- **EUDC**: `https://api.eu.iterable.com/api/`

#### RETL Support

**Supported**: Yes, through VDM v1 and catalog management

- **VDM v1**: Supported (`supportsVisualMapper: true`)
- **VDM v2**: Not supported (no record message type)
- **Catalog Operations**: Dynamic catalog endpoints based on object type
- **Batch Processing**: Up to 1000 catalog items per batch
- **Mixed Routing**: User events to identify endpoints, catalog events to catalog endpoints

### Event Ordering

Event ordering requirements vary by event type based on their impact on user profiles and data consistency:

#### Identify Events

- **Ordering Required**: **YES** - Strict event ordering required
- **Reason**: Identify events update user profiles and attributes. Out-of-order processing can result in newer user data being overwritten by older data, leading to incorrect user profiles
- **Risk**: Profile attributes may become stale or incorrect if events are processed out of sequence
- **Batching Impact**: Events within the same batch maintain relative order, but cross-batch ordering is not guaranteed

#### Alias Events

- **Ordering Required**: **YES** - Strict event ordering required
- **Reason**: Alias events change user email addresses and affect identity resolution. Processing out of order can result in incorrect email mappings
- **Risk**: User identity confusion and incorrect email associations

#### Track Events

- **Ordering Required**: **FLEXIBLE** - Timestamp-based ordering sufficient
- **Reason**: Track events include `createdAt` timestamps that Iterable uses for chronological ordering. Events can be processed out of order as long as timestamps are preserved
- **Timestamp Handling**: All track events include timestamps for proper chronological context within Iterable
- **Batching Impact**: Parallel batch processing is acceptable due to timestamp preservation

#### Page/Screen Events

- **Ordering Required**: **FLEXIBLE** - Timestamp-based ordering sufficient
- **Reason**: Similar to track events, page/screen events rely on timestamps for chronological ordering
- **Analytics Impact**: Timestamps ensure proper user journey reconstruction regardless of processing order

#### Commerce Events (Purchase, Cart Updates)

- **Ordering Required**: **FLEXIBLE** - Timestamp-based ordering sufficient
- **Reason**: Commerce events include timestamps and are processed individually, maintaining chronological context
- **Processing**: Sent individually rather than batched, reducing ordering concerns

#### Device/Browser Token Registration

- **Ordering Required**: **NO** - Order not critical
- **Reason**: Token registration is idempotent - the latest token registration overwrites previous ones
- **Impact**: Out-of-order processing has no negative impact on functionality

### Data Replay Feasibility

#### Missing Data Replay

**What if data is missing and needs to be replayed?**

- **Identify Events**: **NOT FEASIBLE** - Cannot be replayed safely since ordering is critical
- **Alias Events**: **FEASIBLE** - Can be replayed safely for missing email updates
- **Track Events**: **FEASIBLE** - Can be replayed since timestamp-based ordering allows for historical data insertion
- **Page/Screen Events**: **FEASIBLE** - Can be replayed with proper timestamps for historical analytics
- **Commerce Events**: **FEASIBLE** - Can be replayed for missing purchase/cart data with proper timestamps
- **Device/Browser Registration**: **FEASIBLE** - Can be replayed without issues due to idempotent nature

#### Already Delivered Data Replay

**What if data is already delivered and needs to be replayed?**

- **Identify Events**: **NOT FEASIBLE** - No unique ID-based deduplication. Replaying will overwrite user profiles with potentially stale data - unless replay is done maintaining event order up until the latest event.
- **Alias Events**: **PARTIALLY FEASIBLE** - Replaying the same email change is idempotent, but different email changes will create conflicts
- **Track Events**: **NOT FEASIBLE** - No unique ID-based deduplication. Each replay creates duplicate events and inflates metrics
- **Page/Screen Events**: **NOT FEASIBLE** - No deduplication mechanism. Replaying creates duplicate page views and affects analytics
- **Commerce Events**: **NOT FEASIBLE** - No deduplication for purchases/cart updates. Replaying inflates revenue and transaction metrics
- **Device/Browser Registration**: **FEASIBLE** - Idempotent operations. Re-registering the same token updates existing registration
- **User Deletion**: **FEASIBLE** - Idempotent operations. Re-deleting returns 404 but is handled gracefully

#### Deduplication Mechanisms

Iterable destination does not implement automatic deduplication based on unique event IDs. The platform relies on:

- **Timestamp-based Processing**: Events are processed chronologically based on `createdAt` timestamps
- **Profile Merging**: User attributes are merged/updated rather than creating duplicates
- **Idempotent Operations**: Some operations (token registration, user deletion) are naturally idempotent

#### Recommendations for Data Replay

1. **Missing Data**: Safe to replay all event types with proper timestamp filtering
2. **Already Delivered Data**: Avoid replaying except for idempotent operations (token registration, user deletion)
3. **Profile Updates**: Use identify events cautiously - only replay if you want to overwrite current profile data
4. **Event Analytics**: Avoid replaying track/commerce events to prevent metric inflation
5. **Time-based Filtering**: Use timestamp ranges to limit replay scope and avoid processing current data

## Version Information

### Current Version

Iterable uses a single API version without versioned releases. The destination uses the latest available API endpoints.

**NEEDS REVIEW** - No specific API version information found in the implementation or documentation.

### API Endpoints Used

- **Users API**: For user profile management and updates
- **Events API**: For event tracking and bulk operations
- **Commerce API**: For purchase and cart tracking
- **Catalogs API**: For RETL catalog management

## Documentation Links

### REST API Documentation

- [Iterable API Overview](https://support.iterable.com/hc/en-us/articles/204780579-API-Overview-and-Sample-Payloads)
- [Iterable API Documentation (USDC)](https://api.iterable.com/api/docs)
- [Iterable API Documentation (EUDC)](https://api.eu.iterable.com/api/docs)
- [User Deletion Documentation](https://support.iterable.com/hc/en-us/articles/360032290032-Deleting-Users)
- [API Keys Documentation](https://support.iterable.com/hc/en-us/articles/360043464871-API-Keys)

### RETL Functionality

For RETL (Real-time Extract, Transform, Load) functionality, please refer to [docs/retl.md](docs/retl.md)

### Business Logic and Mappings

For detailed business logic, event mappings, and transformation details, please refer to [docs/businesslogic.md](docs/businesslogic.md)

## FAQ

### General Questions

**Q: What is the difference between USDC and EUDC data centers?**
A: USDC (United States Data Center) and EUDC (European Union Data Center) are geographically separated Iterable instances. Choose the data center that matches your Iterable account region. Data cannot be shared between data centers.

**Q: Can I use both cloud mode and device mode simultaneously?**
A: Yes, but device mode is only available for web platforms. You can use cloud mode for server-side tracking and device mode for client-side web tracking simultaneously.

**Q: What happens if I don't provide either email or userId in an event?**
A: The destination will throw an error as either email or userId is mandatory for all Iterable API calls. Ensure at least one identifier is present in your events.

### Batching and Performance

**Q: How does batching work in Iterable destination?**
A: The destination automatically batches identify events via `/api/users/bulkUpdate` and track events via `/api/events/trackBulk`. Batches are limited to 4MB request size (~1000 events) and respect rate limits of 50 requests/second.

**Q: Why are some events not being batched?**
A: Events may not be batched if they:

- Target different API endpoints (e.g., commerce events)
- Exceed the 4MB size limit
- Require device/browser token registration
- Are processed individually due to configuration

**Q: What are the rate limits for Iterable API?**
A: Rate limits vary by endpoint:

- Bulk endpoints: 5-10 requests/second (per API key or project)
- Individual endpoints: 5-2000 requests/second (varies by endpoint)
- Device token registration: 500 requests/second per project
- Limits are per API key or per project depending on the endpoint

### E-commerce and Special Events

**Q: How are e-commerce events handled differently?**
A: Specific track events are automatically mapped to commerce endpoints:

- "Order Completed" → `/api/commerce/trackPurchase`
- "Product Added/Removed" → `/api/commerce/updateCart`
  These events are not batched and are sent individually.

**Q: What is multiplexing and when does it occur?**
A: Multiplexing occurs when a single input event generates multiple API calls. This happens when:

- Identify events contain device/browser tokens (triggers additional registration calls)
- Events require both user updates and token registration

### Device and Browser Tokens

**Q: How do I register device tokens for push notifications?**
A: Include device token information in the event context:

```json
{
  "context": {
    "device": {
      "token": "device_token_here",
      "type": "ios",
      "id": "device_id"
    }
  }
}
```

**Q: What's the difference between registerDeviceOrBrowserApiKey and the main apiKey?**
A: The `registerDeviceOrBrowserApiKey` is an optional separate API key specifically for device/browser token registration. If not provided, the main `apiKey` is used for all operations.

### Error Handling

**Q: What should I do if I receive user deletion errors?**
A: User deletion errors can occur if:

- The user doesn't exist (404 - this is handled gracefully)
- Invalid API key or insufficient permissions (400/401)
- Rate limiting (429)
  Check your API key permissions and ensure it has user deletion rights.

**Q: How are bulk operation failures handled?**
A: Bulk operations can have partial failures. The destination processes individual event failures within bulk responses and provides detailed error information for each failed event while allowing successful events to proceed.

### Configuration and Setup

**Q: How do I know which data center to use?**
A: Check your Iterable account URL:

- If it's `app.iterable.com`, use `USDC`
- If it's `app.eu.iterable.com`, use `EUDC`

**Q: Can I change the data center after initial setup?**
A: Yes, but ensure your API key is valid for the target data center. Data centers are completely separate environments.

### RETL and Advanced Features

**Q: Does Iterable destination support RETL?**
A: Yes, the destination supports RETL through VDM v1 with catalog management capabilities. It supports dynamic catalog endpoints based on object type and can batch up to 1000 catalog items per request. However, VDM v2 (record event types) is not supported.

**Q: How do I handle catalog operations?**
A: Catalog operations are handled automatically when `mappedToDestination: true` and the external ID contains an object type other than 'users'. The destination routes these to `/api/catalogs/{objectType}/items` endpoints and supports bulk operations up to 1000 items per batch.

**Q: What's the difference between user events and catalog events in RETL?**
A: User events (object type 'users') are routed to standard identify endpoints, while catalog events (any other object type) are routed to catalog-specific endpoints for product/content management.

### Event Ordering and Replay

**Q: Which events require strict ordering?**
A: Event ordering requirements vary by type:

- **Strict Ordering Required**: Identify and Alias events (risk of profile corruption)
- **Flexible Ordering**: Track, Page/Screen, Commerce events (timestamp-based ordering)
- **No Ordering Required**: Device/Browser token registration (idempotent operations)

**Q: Can I replay missing data safely?**
A: Yes, missing data can be replayed for all event types:

- Use proper timestamp filtering to target missing data periods
- Ensure timestamps are preserved for chronological context
- All event types support historical data insertion

**Q: What happens if I replay already delivered data?**
A: Replaying already delivered data has different impacts:

- **Safe to Replay**: Device/Browser registration, User deletion (idempotent)
- **Risky to Replay**: Identify events (overwrites profiles), Track/Commerce events (creates duplicates)
- **Conditional**: Alias events (same email change is safe, different changes create conflicts)

**Q: Does Iterable support event deduplication?**
A: No, Iterable destination does not implement automatic deduplication:

- No unique ID-based deduplication for events
- Relies on timestamp-based chronological processing
- Profile updates are merged rather than deduplicated
- Replaying events will create duplicates or overwrite data

**Q: How should I handle data replay scenarios?**
A: Follow these guidelines for data replay:

- **Missing Data**: Safe to replay all events with timestamp filtering
- **Delivered Data**: Only replay idempotent operations (tokens, deletions)
- **Profile Corrections**: Use identify events cautiously - only if overwriting is intended
- **Analytics Data**: Avoid replaying track/commerce events to prevent metric inflation
