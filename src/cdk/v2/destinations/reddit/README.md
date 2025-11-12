# Reddit Destination

## Overview

This document provides comprehensive documentation for the Reddit destination integration in RudderStack's transformer. The integration enables sending conversion events to Reddit Ads via their Conversion Events API, supporting both API v2 and v3.

## Table of Contents

- [Integration Functionalities](#integration-functionalities)
- [General Queries](#general-queries)
- [Version Information](#version-information)
- [RETL Support](#retl-support)
- [Business Logic](#business-logic)
- [FAQ](#faq)

## Integration Functionalities

### Destination Configuration

The following destination configurations are supported and accessible via `destination.Config`:

| Configuration Key | Type    | Required | Description                                                                                             | Source        |
| ----------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------- | ------------- |
| `accountId`       | string  | Yes      | Reddit Ads Pixel ID associated with the conversion events                                               | `schema.json` |
| `version`         | string  | Yes      | API version to use (`v2` or `v3`). Default: `v2`                                                        | `schema.json` |
| `eventsMapping`   | array   | No       | Array of event mappings to map RudderStack events to Reddit event types                                 | `schema.json` |
| `hashData`        | boolean | No       | Flag to enable/disable automatic hashing of PII data (email, userId, IP, advertiserId). Default: `true` | `schema.json` |
| `rudderAccountId` | string  | Yes      | RudderStack account identifier for event delivery                                                       | `schema.json` |

**Note:** The `eventsMapping` configuration allows mapping custom event names to standard Reddit event types: `ViewContent`, `Search`, `AddToCart`, `AddToWishlist`, `Purchase`, `SignUp`, `Lead`, `PageVisit`.

### Implementation Details

- **Framework:** Implemented using CDK v2 (Common Destination Kit v2)
- **Location:** `src/cdk/v2/destinations/reddit/`
- **CDK v2 Status:** Enabled (`config.cdkV2Enabled == true` in `db-config.json`)
- **Language:** Hybrid implementation
  - TypeScript for v3 transformation logic (`transformV3.ts`)
  - JSONTemplate for v2 transformation logic (`procWorkflow.yaml`)
  - JavaScript for shared utilities (`utils.js`)

### Supported Message Types

| Message Type | Supported | Description                           |
| ------------ | --------- | ------------------------------------- |
| Track        | ✅ Yes    | Sends conversion events to Reddit Ads |
| Identify     | ❌ No     | Not supported                         |
| Page         | ❌ No     | Not supported                         |
| Screen       | ❌ No     | Not supported                         |
| Group        | ❌ No     | Not supported                         |
| Alias        | ❌ No     | Not supported                         |

**Source:** `db-config.json > supportedMessageTypes > cloud: ["track"]`

### Batching Support

- **Batching Enabled:** Yes
- **Supported Message Types:** Track events
- **Maximum Batch Size:** 1000 events per batch
- **Implementation Location:**
  - Batch size limit: `config.js` (`maxBatchSize = 1000`)
  - Batching logic: `rtWorkflow.yaml` (router workflow)
- **Batching Strategy:**
  - Events are grouped and batched based on destination configuration
  - Events with `dontBatch` metadata flag are not batched
  - Events with `test_id` property are not batched
  - V2 and V3 events are batched separately with version-specific payload structures

**Code Reference:**

```yaml
# rtWorkflow.yaml (lines 64-92)
batchSuccessfulEvents:
  description: Batches the successfulEvents based on dontBatch and test_id
  condition: $.outputs.successfulEvents.length
```

### Intermediate API Calls

The Reddit destination **does not** make any intermediate API calls. All conversion events are sent directly to the Reddit Ads API endpoint without pre-processing or lookup calls.

### Proxy Delivery Support

- **Supported:** Yes (v1 proxy delivery)
- **Implementation Location:** `src/v1/destinations/reddit/networkHandler.js`
- **Partial Batching Response Handling:** Yes (available for v1 proxy destinations)
- **Response Handler Features:**
  - Handles 401 (Authorization Required) errors with `REFRESH_TOKEN` category for automatic token refresh
  - Implements partial batch failure handling with `dontBatch` flag
  - Returns individual event responses for successful batches
  - Supports error response with individual event statuses

**Code Reference:** `src/v1/destinations/reddit/networkHandler.js` (lines 1-108)

### User Deletion Support

- **Supported:** ❌ No
- **Verification:** No `deleteUsers.js` file exists in the destination folder

### OAuth Support

- **Supported:** ✅ Yes
- **OAuth Type:** OAuth 2.0
- **Source:** `db-config.json > config.auth.type == "OAuth"`
- **Implementation:** `rudder-auth/src/routes/auth/reddit.ts`
- **Scopes Required:** `['adsread', 'adsconversions', 'history']`
- **OAuth Endpoints:**
  - Authorization URL: `https://www.reddit.com/api/v1/authorize`
  - Token URL: `https://www.reddit.com/api/v1/access_token`
  - Access token passed via `Bearer` token in `Authorization` header

### Destination Type

- **Type:** Router Destination
- **Source:** `db-config.json > config.transformAtV1 == "router"`
- **Implication:** Events are processed in batch mode at the router transformation stage

### Additional Functionalities

#### 1. Data Hashing

- **Purpose:** Automatically hash PII (Personally Identifiable Information) data before sending to Reddit
- **Fields Hashed:** email, external_id (userId), ip_address, phone_number, idfa, aaid
- **Hashing Algorithm:** SHA-256
- **Configuration:** Controlled via `destination.Config.hashData` (default: `true`)
- **Implementation:**
  - V2: `procWorkflow.yaml` (lines 36-50)
  - V3: `transformV3.ts` `prepareUserObject()` function (lines 25-54)

#### 2. Event Type Mapping

- **Feature:** Automatic mapping of RudderStack events to Reddit standard events
- **Mapping Priority:**
  1. Custom mappings from `eventsMapping` configuration
  2. Built-in e-commerce event mappings
  3. Custom events (when no mapping found)
- **Built-in E-commerce Mappings:**

| RudderStack Event                   | Reddit Event Type |
| ----------------------------------- | ----------------- |
| product viewed, product list viewed | ViewContent       |
| product added                       | AddToCart         |
| product added to wishlist           | AddToWishlist     |
| order completed                     | Purchase          |
| products searched                   | Search            |

**Source:** `config.js` (lines 5-26)

#### 3. Event Multiplexing

- **Supported:** Yes
- **Description:** When multiple event mappings are configured for a single RudderStack event, the integration generates multiple Reddit conversion events
- **Implementation:** `transformV3.ts` (lines 165-181)
- **Use Case:** Allows tracking the same action across multiple conversion types (e.g., both "Lead" and "SignUp" for a registration event)

#### 4. Version-based Transformation

- **Versions Supported:** v2 (legacy) and v3 (current)
- **Version Selection:** Determined via `destination.Config.version`
- **Implementation:**
  - Version detection: `utils.js` `decideVersion()` function
  - V2 workflow: `procWorkflow.yaml`
  - V3 workflow: `procWorkflowV3.yaml` → `transformV3.ts`
- **Key Differences:**
  - API endpoints differ (v2: `/api/v2.0/conversions/events/`, v3: `/api/v3/pixels/{accountId}/conversion_events`)
  - Payload structure differs (v3 uses `data.events` wrapper)
  - Event type format: v2 uses PascalCase (e.g., `AddToCart`), v3 uses UPPER_SNAKE_CASE (e.g., `ADD_TO_CART`)

### Validations

The following validations are enforced on incoming events:

#### Required Fields (All Events)

| Field                              | Validation                            | Error Message                                                                                                                               |
| ---------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `destination.Config.accountId`     | Must be present                       | "Account is not present. Aborting message."                                                                                                 |
| `message.type`                     | Must be present                       | "message Type is not present. Aborting message."                                                                                            |
| `message.type`                     | Must equal 'track' (case-insensitive) | "Event type {type} is not supported. Aborting message."                                                                                     |
| `message.event`                    | Must be present                       | "Event is not present. Aborting message."                                                                                                   |
| `timestamp` or `originalTimestamp` | Must be present                       | "Timestamp is not present. Aborting message." (v2)<br>"Required field 'timestamp' or 'originalTimestamp' is missing from the message." (v3) |

**Source:**

- V2: `procWorkflow.yaml` (lines 18-25)
- V3: `transformV3.ts` (lines 204-224)

#### Timestamp Validations (V3)

| Validation | Constraint                                    | Error Message                                                       |
| ---------- | --------------------------------------------- | ------------------------------------------------------------------- |
| Format     | Must be valid date format                     | "Invalid timestamp format."                                         |
| Age        | Must be less than 168 hours (7 days) old      | "event_at timestamp must be less than 168 hours (7 days) old."      |
| Future     | Must not be more than 5 minutes in the future | "event_at timestamp must not be more than 5 minutes in the future." |

**Source:** `utils.js` `generateAndValidateTimestamp()` function (lines 131-157)

#### OAuth Token Validation

| Field                         | Validation      | Error Message                                          |
| ----------------------------- | --------------- | ------------------------------------------------------ |
| `metadata.secret.accessToken` | Must be present | "Secret or accessToken is not present in the metadata" |

**Source:** `procWorkflow.yaml` (line 129)

### Rate Limits

Reddit Ads Conversion API (CAPI) has the following rate limits:

**Rate Limit Specifications:**

- **Request Rate:** Maximum of **5,000 requests per minute** per pixel
- **Event Rate:** Maximum of **250,000 events per minute** per pixel
- **Batch Size:** Up to **1,000 events per request** (as implemented in this integration)

**Best Practices:**

- **Batch Events:** Always batch events to stay within rate limits. This integration automatically batches up to 1000 events per request
- **Exponential Backoff:** Implement exponential backoff retry logic for 429 (Too Many Requests) responses
- **Event Distribution:** Distribute events evenly over time rather than sending bursts to avoid hitting rate limits
- **Monitor Response Codes:** Watch for 429 status codes and implement appropriate backoff strategies

**Current Implementation:** The networkHandler includes retry logic for 401 (Unauthorized) errors with token refresh. For production use, consider adding specific 429 handling with exponential backoff.

**References:**

- Reddit Ads API Best Practices: https://ads-api.reddit.com/docs/v3/capi-best-practices
- Reddit Ads API Documentation: https://ads-api.reddit.com/docs/v3/, https://ads-api.reddit.com/docs/v3/operations/Post%20Conversion%20Events

## General Queries

### Event Ordering Required?

**Track Events:** Event ordering is **recommended but not strictly required** for Reddit conversion events.

**Reasoning:**

- **Timestamp-based Processing:** Reddit's Conversion Events API accepts events with `event_at` timestamp field, allowing Reddit to process events in chronological order regardless of delivery order
- **7-Day Window:** Events must have timestamps within the last 7 days, indicating that Reddit can handle out-of-order events within this window
- **No Profile Updates:** Unlike destinations that update user profiles (Identify calls), track events in Reddit are conversion tracking events that are logged with timestamps
- **Side Effects:** Batching is enabled, which inherently allows events to arrive out of order

**Recommendation:** While not strictly required, maintaining event order is a best practice to ensure accurate reporting and attribution in Reddit Ads.

**Source:**

- Timestamp validation: `utils.js` (lines 131-157)
- Reddit Ads API documentation supports timestamp-based event processing

### Data Replay Feasibility

#### Missing Data Replay

**Feasibility:** ✅ **Yes, feasible with constraints**

**Conditions:**

- Events must have timestamps within the last **7 days** (168 hours)
- Events older than 7 days will be rejected by Reddit's API
- Replayed events will be processed based on their `timestamp`/`originalTimestamp` values

**Use Case:** If events were lost or failed to deliver, they can be replayed as long as their timestamps fall within the 7-day window.

**Source:** `utils.js` timestamp validation (lines 147-149)

#### Already Delivered Data Replay

**Feasibility:** ❌ **No, not feasible**

**Reasoning:**

- Reddit's Conversion Events API does not use a unique event ID for deduplication
- The `conversion_id` field (populated from `properties.conversionId` or `messageId`) is used for tracking but not for deduplication
- Replaying already delivered events will result in duplicate conversion events in Reddit Ads
- No evidence in Reddit's API documentation of automatic deduplication based on event identifiers

**Recommendation:** Avoid replaying events that have already been successfully delivered to prevent duplicate conversion tracking.

**Source:**

- Event payload construction: `transformV3.ts` (line 124)
- Reddit Ads API behavior (no deduplication mechanism documented)

### Rate Limits and Batch Sizes

#### Batch Sizes

| Configuration          | Value             | Source                                         |
| ---------------------- | ----------------- | ---------------------------------------------- |
| Maximum Batch Size     | 1000 events       | `config.js` (line 3)                           |
| Recommended Batch Size | Up to 1000 events | Implementation follows Reddit's batch endpoint |

**Implementation:** The router workflow chunks events into batches of up to 1000 events before sending to Reddit's API.

**Source:** `rtWorkflow.yaml` (line 70)

#### API Rate Limits

Reddit Ads Conversion API enforces the following rate limits per pixel:

| Limit Type       | Value                 | Description                                    |
| ---------------- | --------------------- | ---------------------------------------------- |
| **Request Rate** | 5,000 requests/minute | Maximum API requests per minute per pixel      |
| **Event Rate**   | 250,000 events/minute | Maximum conversion events per minute per pixel |
| **Batch Size**   | 1,000 events/request  | Maximum events per single API request          |

**Rate Limit Strategy:**

- **Batching:** This integration batches up to 1000 events per request to maximize throughput and stay within limits
- **Calculation Example:** With 1000 events per request, you can send up to 5M events per minute (5,000 requests × 1,000 events)
- **OAuth Authentication:** Required for all requests; provides consistent rate limits as documented above
- **Error Handling:** The networkHandler implements retry logic for 401 (Unauthorized) errors with automatic token refresh
- **429 Responses:** Implement exponential backoff when receiving 429 (Too Many Requests) responses

**Endpoints Used:**

1. **V2 Endpoint:** `https://ads-api.reddit.com/api/v2.0/conversions/events/{accountId}`

   - Method: POST
   - Batch Support: Yes (up to 1000 events)
   - Rate Limits: Same as above

2. **V3 Endpoint:** `https://ads-api.reddit.com/api/v3/pixels/{accountId}/conversion_events`
   - Method: POST
   - Batch Support: Yes (up to 1000 events)
   - Rate Limits: Same as above

**References:**

- Reddit Ads API Rate Limits: https://ads-api.reddit.com/docs/v3/capi-best-practices
- Reddit Ads API v3 Documentation: https://ads-api.reddit.com/docs/v3/, https://ads-api.reddit.com/docs/v3/operations/Post%20Conversion%20Events

### Multiplexing

**Multiplexing Support:** ✅ **Yes**

**Description:** The Reddit integration supports multiplexing by generating multiple conversion events from a single input event when multiple event mappings are configured.

**Implementation Details:**

#### When Multiplexing Occurs

Multiplexing happens when:

1. A RudderStack event name is mapped to multiple Reddit event types in the `eventsMapping` configuration
2. Each mapped event type generates a separate Reddit conversion event
3. All generated events share the same user data, timestamp, and properties but differ in event type

**Example:**

```javascript
// Configuration
eventsMapping: [
  { from: "User Registered", to: "SignUp" },
  { from: "User Registered", to: "Lead" }
]

// Input: Single RudderStack event
{
  event: "User Registered",
  userId: "user123",
  properties: { ... }
}

// Output: Two Reddit conversion events
[
  { type: { tracking_type: "SIGN_UP" }, user: { ... }, ... },
  { type: { tracking_type: "LEAD" }, user: { ... }, ... }
]
```

**Code Reference:**

- V3 Implementation: `transformV3.ts` (lines 154-199)
  - Lines 165-181: Loop through event types array and generate multiple payloads
  - Line 209: Multiple responses returned for a single input event

**Use Cases:**

1. **Multi-Goal Tracking:** Track the same user action across different conversion goals
2. **Attribution:** Count a single action towards multiple campaign objectives
3. **Funnel Analysis:** Track a user action at different funnel stages simultaneously

**No Intermediate Calls:** Multiplexing does not involve intermediate API calls; all events are generated from the input event and sent directly to Reddit.

### Processor vs Router Destination

**Type:** Router Destination

**Configuration:** `db-config.json > config.transformAtV1 == "router"`

**Implications:**

- Events are processed in batch mode at the router transformation stage
- Transformation happens at the `/v1/batch` endpoint
- Batching and event grouping logic is applied in the router workflow

## Version Information

### Current Version in Use

**API Versions Supported:**

- **v2 (Legacy):** `https://ads-api.reddit.com/api/v2.0/conversions/events/`
- **v3 (Current):** `https://ads-api.reddit.com/api/v3/pixels/`

**Default Version:** v2 (for backward compatibility)

**Source:**

- Endpoint configuration: `config.js` (lines 1-2)
- Version schema: `schema.json` (lines 10-14)
- UI configuration: `ui-config.json` shows v2 labeled as "API v2 (Deprecated)"

### Version Deprecation Status

**Current Status:**

- **v2:** Deprecated - Reddit has not sunset the v2 Conversion Events API
- **v3:** Current and recommended version for all integrations
- **Migration Required:** All v2 implementations should migrate to v3

**Deprecation Timeline:**

- Reddit officially deprecated the v2 Conversion Events API
- v3 is the current production API with improved features and stability
- New integrations must use v3
- Existing v2 integrations should migrate to v3 as soon as possible

**Migration Benefits:**

- Improved payload structure with better error handling
- Test mode support via `test_id` field
- Enhanced event tracking with `action_source` field
- Better alignment with Reddit's current API standards

**Recommendation:** Use v3 for all Reddit destination setups. Migrate existing v2 integrations to v3 immediately.

**Sources:**

- `ui-config.json` (lines 29-32) - v2 labeled as "API v2 (Deprecated)"
- Reddit Ads API Migration Guide: https://ads-api.reddit.com/docs/v3/capi-migration

### Version Differences

| Feature               | v2                                          | v3                                                 |
| --------------------- | ------------------------------------------- | -------------------------------------------------- |
| **Endpoint**          | `/api/v2.0/conversions/events/{accountId}`  | `/api/v3/pixels/{accountId}/conversion_events`     |
| **Payload Structure** | `{ events: [...] }`                         | `{ data: { events: [...] } }`                      |
| **Event Type Format** | PascalCase (e.g., `Purchase`, `AddToCart`)  | UPPER_SNAKE_CASE (e.g., `PURCHASE`, `ADD_TO_CART`) |
| **Event Type Field**  | `event_type: { tracking_type: "Purchase" }` | `type: { tracking_type: "PURCHASE" }`              |
| **Action Source**     | Not present                                 | Required: `action_source: "WEBSITE"`               |
| **Test Mode**         | Not supported                               | Supported via `test_id` field in payload           |

**Code References:**

- Version decision: `utils.js` `decideVersion()` (lines 4-11)
- V2 transformation: `procWorkflow.yaml`
- V3 transformation: `transformV3.ts`
- Type conversion: `utils.js` `convertToUpperSnakeCase()` (lines 117-129)

### Breaking Changes from v2 to v3

Reddit has published a comprehensive migration guide for transitioning from v2 to v3. The following breaking changes exist:

#### API Endpoint Changes

1. **Endpoint URL Change:**
   - **v2:** `https://ads-api.reddit.com/api/v2.0/conversions/events/{accountId}`
   - **v3:** `https://ads-api.reddit.com/api/v3/pixels/{accountId}/conversion_events`

#### Payload Structure Changes

2. **Payload Wrapper:**

   - **v2:** `{ events: [...] }`
   - **v3:** `{ data: { events: [...] } }` (events wrapped in `data` object)

3. **Event Type Field Name:**

   - **v2:** `event_type: { tracking_type: "..." }`
   - **v3:** `type: { tracking_type: "..." }`

4. **Event Type Format:**
   - **v2:** PascalCase (e.g., `Purchase`, `AddToCart`, `ViewContent`)
   - **v3:** UPPER_SNAKE_CASE (e.g., `PURCHASE`, `ADD_TO_CART`, `VIEW_CONTENT`)

#### New Required Fields

5. **Action Source (v3 only):**
   - **Required:** `action_source: "WEBSITE"` field is now mandatory in v3
   - Purpose: Indicates the source of the conversion action

#### New Features in v3

6. **Test Mode Support:**

   - v3 introduces `test_id` field for testing conversions without affecting production data
   - Events with `test_id` are processed separately and not batched with production events

7. **Enhanced Error Handling:**
   - v3 provides improved error responses with better debugging information

#### Migration Path

**For RudderStack Users:** The integration handles all version differences automatically:

- Simply update `destination.Config.version` from `"v2"` to `"v3"` in your configuration
- No code changes needed - the integration handles all payload transformations
- Both versions are supported for smooth migration

**References:**

- Reddit Ads API v2 to v3 Migration Guide: https://ads-api.reddit.com/docs/v3/capi-migration
- Reddit Ads API v3 Documentation: https://ads-api.reddit.com/docs/v3/

## RETL Support

**RETL (Reverse ETL) Support:** ✅ **Yes**

For detailed information on RETL functionality, see [docs/retl.md](docs/retl.md).

**Quick Summary:**

- RETL is supported via warehouse source type
- Supports event stream data forwarding from warehouses
- Configuration: Same as cloud mode (accountId, eventsMapping, hashData, version)

**Source:** `db-config.json > config.supportedSourceTypes` includes `"warehouse"` (line 18)

## Business Logic

For detailed information on business logic, event mappings, and data flow, see [docs/businesslogic.md](docs/businesslogic.md).

**Quick Summary:**

- Track events are mapped to Reddit conversion events
- User data is extracted, optionally hashed, and sent as part of conversion payload
- Event metadata (revenue, products, etc.) is mapped based on event type
- Validation ensures required fields are present

## FAQ

### 1. What happens if I don't configure event mappings?

If no custom event mappings are configured, the integration falls back to built-in e-commerce event mappings. If the event name doesn't match any built-in mapping, it is sent as a CUSTOM event with the original event name.

### 2. Can I send the same event to multiple Reddit conversion types?

Yes, through event multiplexing. Configure multiple mappings for the same RudderStack event name in the `eventsMapping` configuration.

### 3. Should I enable data hashing?

Yes, unless you are already sending pre-hashed data. Reddit requires PII data (email, phone, user IDs) to be hashed using SHA-256. The integration handles this automatically when `hashData` is enabled.

### 4. What is the difference between v2 and v3?

v3 is the current API version with improved structure, test mode support, and better error handling. v2 is deprecated but still functional. New integrations should use v3.

### 5. How are batched events handled if some events fail?

With proxy delivery enabled, the integration supports partial batch failure handling. Failed events are marked with `dontBatch` flag and retried individually, while successful events in the batch are acknowledged.

### 6. Can I test conversion events without affecting production data?

Yes, in v3 you can include a `test_id` property in your event. Events with `test_id` will be processed separately and not batched with production events.

**Example:**

```json
{
  "event": "Order Completed",
  "properties": {
    "test_id": "test_conversion_123",
    "revenue": 99.99
  }
}
```

### 7. What happens if my access token expires?

The integration's network handler detects 401 (Unauthorized) errors and automatically triggers a token refresh flow through RudderStack's OAuth management system.

### 8. Are there any event type restrictions?

Yes, only `track` events are supported. Other event types (identify, page, group, alias) are not supported and will be rejected.

### 9. What is the maximum age for events?

Events must have timestamps within the last 7 days (168 hours). Older events will be rejected by Reddit's API.

### 10. How is revenue calculated for different event types?

- **Purchase events:** Uses `properties.revenue` multiplied by 100 (converted to cents)
- **AddToCart events:** Uses `properties.price * properties.quantity` multiplied by 100
- **Other events:** Calculates based on product array or single product price \* quantity

**Source:** `utils.js` `populateRevenueField()` (lines 61-91)

---

## Related Documentation

- **Reddit Ads API v2 Documentation:** https://ads-api.reddit.com/docs/v2/
- **Reddit Ads API v3 Documentation:** https://ads-api.reddit.com/docs/v3/
- **Reddit Ads API v3 Conversion Documentation:** https://ads-api.reddit.com/docs/v3/operations/Post%20Conversion%20Events
- **Reddit OAuth Documentation:** https://github.com/reddit-archive/reddit/wiki/oauth2
- **Event Metadata Reference:** https://business.reddithelp.com/s/article/about-event-metadata

## Support

For issues or questions regarding this integration:

1. Check the FAQ section above
2. Review the business logic documentation: [docs/businesslogic.md](docs/businesslogic.md)
3. Refer to Reddit's official API documentation
4. Contact RudderStack support

---

**Last Updated:** 2025-01-22
**Maintainer:** RudderStack Integration Team
