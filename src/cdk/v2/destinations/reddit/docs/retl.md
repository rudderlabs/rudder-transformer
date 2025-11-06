# RETL (Reverse ETL) Support for Reddit Destination

## Overview

This document provides detailed information about Reverse ETL (RETL) support for the Reddit destination. RETL allows you to send data from your data warehouse to Reddit Ads for conversion tracking.

## Table of Contents

- [RETL Support Status](#retl-support-status)
- [Supported RETL Types](#supported-retl-types)
- [Connection Configuration](#connection-configuration)
- [Data Flow](#data-flow)
- [Event Type Support](#event-type-support)
- [Field Mappings](#field-mappings)
- [Best Practices](#best-practices)
- [Limitations](#limitations)

## RETL Support Status

**RETL Support:** ✅ **Supported**

**Verification:**

- `db-config.json > config.supportedSourceTypes` includes `"warehouse"` (line 18)
- The destination is configured to accept events from warehouse sources

**Source:** `/rudder-integrations-config/src/configurations/destinations/reddit/db-config.json`

## Supported RETL Types

The Reddit destination supports the following RETL types:

### 1. JSON Mapper (Default)

**Status:** ✅ **Supported**

**Description:** JSON Mapper is supported by default for all destinations unless explicitly disabled.

**Verification:** No `disableJsonMapper: true` flag exists in `db-config.json`

**Use Case:** Send conversion events from your warehouse to Reddit Ads using JSON-based field mapping.

### 2. Visual Data Mapper (VDM) V1

**Status:** ❌ **Not Supported**

**Verification:** `db-config.json` does not contain `supportsVisualMapper: true`

**Reason:** Reddit destination does not support VDM V1 visual mapping interface.

### 3. Visual Data Mapper (VDM) V2

**Status:** ❌ **Not Supported**

**Verification:** `db-config.json > supportedMessageTypes` does not include `"record"` type

**Reason:** VDM V2 requires support for the `record` message type, which is not implemented for Reddit destination.

## Connection Configuration

### Required Configuration

When setting up RETL for Reddit, the following configuration is required:

| Field             | Type    | Required | Description                                   |
| ----------------- | ------- | -------- | --------------------------------------------- |
| `accountId`       | string  | Yes      | Reddit Ads Pixel ID                           |
| `version`         | string  | Yes      | API version (`v2` or `v3`). Default: `v2`     |
| `hashData`        | boolean | No       | Enable automatic PII hashing. Default: `true` |
| `rudderAccountId` | string  | Yes      | RudderStack account ID                        |
| `eventsMapping`   | array   | No       | Custom event mappings                         |

### Connection Mode

**Connection Mode:** Cloud

**Supported Connection Mode for Warehouse:** `cloud` mode only

**Source:** `db-config.json > config.supportedConnectionModes > warehouse: ["cloud"]` (line 38)

## Data Flow

### RETL Event Flow

```
┌─────────────────┐
│  Data Warehouse │
│   (BigQuery,    │
│   Snowflake,    │
│   Redshift, etc)│
└────────┬────────┘
         │
         │ SELECT query extracts
         │ conversion event data
         │
         ▼
┌─────────────────┐
│   RudderStack   │
│  RETL Pipeline  │
│                 │
│  - Field        │
│    mapping      │
│  - Data         │
│    transformation
└────────┬────────┘
         │
         │ Track event
         │
         ▼
┌─────────────────┐
│     Reddit      │
│  Destination    │
│  (Transformer)  │
│                 │
│  - Validation   │
│  - Hashing      │
│  - Batching     │
└────────┬────────┘
         │
         │ Batch of conversion events
         │
         ▼
┌─────────────────┐
│   Reddit Ads    │
│  Conversion API │
│                 │
│  v2 or v3       │
└─────────────────┘
```

### Processing Steps

1. **Data Extraction:** SQL query extracts conversion event data from warehouse tables
2. **Event Construction:** RudderStack constructs track events from warehouse data
3. **Transformation:** Reddit destination transformer processes events:
   - Validates required fields
   - Hashes PII data (if enabled)
   - Maps events to Reddit event types
   - Constructs conversion event payload
4. **Batching:** Events are batched (up to 1000 per batch)
5. **Delivery:** Batched events are sent to Reddit Ads API

## Event Type Support

### Supported Events from Warehouse

The Reddit destination **only supports track events** from warehouse sources. The RETL pipeline should be configured to generate track events with appropriate event names.

**Message Type Support:**

- ✅ **Track:** Supported for conversion event tracking
- ❌ **Record:** Not supported (no VDM V2 support)
- ❌ **Identify:** Not supported
- ❌ **Other types:** Not supported

**Source:** `db-config.json > config.supportedMessageTypes > cloud: ["track"]`

### Event Construction from Warehouse

When querying your warehouse, ensure your SELECT statement produces rows that can be mapped to track events with the following structure:

```sql
-- Example warehouse query structure
SELECT
  user_id,                  -- Maps to userId
  event_name,               -- Maps to event
  event_timestamp,          -- Maps to timestamp
  email,                    -- Maps to context.traits.email
  phone,                    -- Maps to context.traits.phone
  conversion_id,            -- Maps to properties.conversionId
  revenue,                  -- Maps to properties.revenue
  currency,                 -- Maps to properties.currency
  product_id,               -- Maps to properties.product_id
  -- ... other properties
FROM conversion_events_table
WHERE event_timestamp > CURRENT_TIMESTAMP - INTERVAL '7 days'
```

## Field Mappings

### User Data Fields

The following user data fields are supported from warehouse sources:

| Warehouse Field | RudderStack Field                        | Reddit Field   | Required | Hashed (if hashData=true) |
| --------------- | ---------------------------------------- | -------------- | -------- | ------------------------- |
| `user_id`       | `userId`                                 | `external_id`  | No       | Yes                       |
| `email`         | `context.traits.email` or `traits.email` | `email`        | No       | Yes                       |
| `phone`         | `context.traits.phone` or `traits.phone` | `phone_number` | No       | Yes                       |
| `ip_address`    | `context.ip` or `request_ip`             | `ip_address`   | No       | Yes                       |
| `user_agent`    | `context.userAgent`                      | `user_agent`   | No       | No                        |
| `idfa`          | `context.device.advertisingId` (iOS)     | `idfa`         | No       | Yes                       |
| `aaid`          | `context.device.advertisingId` (Android) | `aaid`         | No       | Yes                       |
| `uuid`          | `properties.uuid`                        | `uuid`         | No       | No                        |

**Mapping Source:** `data/userDataMapping.json`

### Event Properties Fields

The following event property fields should be included in your warehouse query:

| Warehouse Field    | RudderStack Field                  | Description                     | Event Types                      |
| ------------------ | ---------------------------------- | ------------------------------- | -------------------------------- |
| `event_name`       | `event`                            | Name of the conversion event    | All                              |
| `event_timestamp`  | `timestamp` or `originalTimestamp` | Event timestamp (within 7 days) | All                              |
| `conversion_id`    | `properties.conversionId`          | Unique conversion identifier    | All                              |
| `revenue`          | `properties.revenue`               | Revenue amount (in dollars)     | Purchase                         |
| `price`            | `properties.price`                 | Price per unit                  | AddToCart, ViewContent           |
| `quantity`         | `properties.quantity`              | Quantity of items               | AddToCart, ViewContent, Purchase |
| `currency`         | `properties.currency`              | Currency code (e.g., USD)       | Purchase, AddToCart, ViewContent |
| `product_id`       | `properties.product_id`            | Product identifier              | ViewContent, AddToCart           |
| `product_name`     | `properties.name`                  | Product name                    | ViewContent, AddToCart           |
| `product_category` | `properties.category`              | Product category                | ViewContent, AddToCart           |
| `click_id`         | `properties.clickId`               | Reddit click identifier         | All                              |
| `test_id`          | `properties.test_id`               | Test mode identifier (v3 only)  | All (v3)                         |

### Products Array Support

For events with multiple products, structure your warehouse data to include product arrays:

```sql
-- Example with JSON aggregation for products
SELECT
  user_id,
  'Order Completed' as event_name,
  order_timestamp as event_timestamp,
  order_revenue as revenue,
  'USD' as currency,
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'product_id', product_id,
      'name', product_name,
      'category', product_category,
      'price', product_price,
      'quantity', product_quantity
    )
  ) as products  -- Maps to properties.products
FROM orders_with_products
GROUP BY user_id, order_timestamp, order_revenue
```

## Best Practices

### 1. Timestamp Management

**Important:** Ensure event timestamps from your warehouse are within the last **7 days**.

```sql
-- Always filter for recent events
WHERE event_timestamp > CURRENT_TIMESTAMP - INTERVAL '7 days'
  AND event_timestamp <= CURRENT_TIMESTAMP
```

**Reason:** Reddit Ads API rejects events with timestamps older than 7 days or more than 5 minutes in the future.

### 2. Data Hashing

**Recommendation:** Enable `hashData: true` in destination configuration unless your warehouse data is already hashed.

**Why:** Reddit requires PII fields (email, phone, external_id, IP, advertising IDs) to be hashed with SHA-256. The destination handles this automatically when enabled.

### 3. Event Mapping Strategy

**Strategy 1 - Map to Standard Events:** Map your warehouse events to Reddit's standard event types for better campaign optimization.

```javascript
// Destination configuration
{
  "eventsMapping": [
    { "from": "checkout_completed", "to": "Purchase" },
    { "from": "add_to_bag", "to": "AddToCart" },
    { "from": "product_detail_view", "to": "ViewContent" }
  ]
}
```

**Strategy 2 - Use Built-in Mappings:** Use RudderStack's standard e-commerce event names to leverage automatic mapping:

- "Order Completed" → Purchase
- "Product Added" → AddToCart
- "Product Viewed" → ViewContent

### 4. Conversion ID Usage

**Best Practice:** Always include a unique `conversion_id` in your warehouse query:

```sql
SELECT
  order_id as conversion_id,  -- Use unique order/transaction ID
  -- ... other fields
FROM orders
```

**Why:** The conversion_id helps with deduplication tracking and debugging in Reddit Ads.

### 5. Incremental Loading

**Pattern:** Use incremental loading to avoid re-sending the same events:

```sql
-- Track last processed timestamp
SELECT *
FROM conversion_events
WHERE event_timestamp > :last_processed_timestamp
  AND event_timestamp <= CURRENT_TIMESTAMP
ORDER BY event_timestamp ASC
```

**Implementation:** Maintain a high-water mark table in your warehouse to track the last successfully processed timestamp.

### 6. Batch Size Optimization

**Recommendation:** Configure RETL sync to send events in batches that align with Reddit's limits:

- Maximum batch size: 1000 events
- Recommended: 500-1000 events per batch for optimal performance
- Smaller batches for error-prone data (allows better retry logic)

### 7. API Version Selection

**For New Implementations:** Use `v3` API version

- Better error handling
- Test mode support via `test_id`
- More structured payload format

**For Existing Implementations:** Continue using `v2` until ready to migrate, as it's still functional despite deprecation notice.

## Limitations

### 1. Message Type Limitation

**Limitation:** Only track events are supported. Record-type events (VDM V2) are not supported.

**Impact:** You must structure your warehouse queries to generate track events, not record events.

### 2. No Visual Data Mapper

**Limitation:** VDM V1 and V2 are not supported. Only JSON Mapper is available.

**Impact:** Field mapping must be configured manually in the RETL pipeline, not through the visual UI.

### 3. Timestamp Constraints

**Limitation:** Events must have timestamps within the last 7 days.

**Impact:** Cannot sync historical data older than 7 days. Not suitable for backfilling old conversion data.

**Source:** `utils.js` `generateAndValidateTimestamp()` (lines 147-149)

### 4. OAuth Token Management

**Limitation:** OAuth tokens must be configured and kept fresh in RudderStack.

**Impact:** If tokens expire, the RETL sync will fail until tokens are refreshed through RudderStack's OAuth management.

### 5. No Real-time Streaming

**Limitation:** RETL operates on scheduled sync intervals, not real-time streaming.

**Impact:** There will be a delay between data landing in your warehouse and conversion events reaching Reddit Ads.

### 6. No User Deletion Support

**Limitation:** The Reddit destination does not support user deletion requests from warehouse.

**Impact:** Cannot use RETL to send user deletion/suppression requests to Reddit.

### 7. Single Event Type Per Row

**Limitation:** Each warehouse row generates a single track event (except when multiplexing is configured).

**Impact:** Complex event patterns requiring multiple event types must be modeled as separate rows in your warehouse query.

## Troubleshooting

### Common Issues

#### Issue 1: Events Rejected Due to Old Timestamps

**Symptom:** Events fail with "event_at timestamp must be less than 168 hours (7 days) old"

**Solution:** Adjust your warehouse query to filter for recent events only:

```sql
WHERE event_timestamp > CURRENT_TIMESTAMP - INTERVAL '6 days'
```

#### Issue 2: Missing Required Fields

**Symptom:** Events fail with "Account is not present" or "Timestamp is not present"

**Solution:** Ensure your warehouse query includes all required fields and your RETL field mapping is correct:

- Event name → `event`
- Event timestamp → `timestamp` or `originalTimestamp`
- Destination accountId is configured

#### Issue 3: OAuth Token Expired

**Symptom:** 401 Unauthorized errors

**Solution:** Refresh the OAuth token in RudderStack's destination configuration. The integration will automatically retry with the new token.

#### Issue 4: Data Not Hashed Correctly

**Symptom:** Reddit reports low match rates

**Solution:**

- Verify `hashData: true` is set in destination configuration
- Ensure PII data in warehouse is in correct format (lowercase, trimmed)
- For emails: Remove dots from Gmail addresses before hashing

#### Issue 5: Events Not Batching

**Symptom:** Too many individual requests to Reddit API

**Solution:**

- Ensure RETL sync is configured to send multiple events per run
- Check that events don't have `dontBatch` metadata
- Verify events don't have `test_id` property (which prevents batching in v3)

## Example RETL Configuration

### Warehouse Query Example

```sql
-- BigQuery example
WITH conversion_events AS (
  SELECT
    user_id,
    email,
    CAST(event_timestamp AS STRING) as event_timestamp,
    event_name,
    order_id as conversion_id,
    revenue,
    'USD' as currency,
    product_id,
    product_name as name,
    product_category as category,
    quantity,
    click_id
  FROM `project.dataset.conversions`
  WHERE event_timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 6 DAY)
    AND event_timestamp <= CURRENT_TIMESTAMP()
    AND user_id IS NOT NULL
)
SELECT * FROM conversion_events
ORDER BY event_timestamp ASC
LIMIT 10000
```

### RudderStack RETL Field Mapping

```json
{
  "userId": "{{ user_id }}",
  "event": "{{ event_name }}",
  "timestamp": "{{ event_timestamp }}",
  "context": {
    "traits": {
      "email": "{{ email }}"
    }
  },
  "properties": {
    "conversionId": "{{ conversion_id }}",
    "revenue": "{{ revenue }}",
    "currency": "{{ currency }}",
    "product_id": "{{ product_id }}",
    "name": "{{ name }}",
    "category": "{{ category }}",
    "quantity": "{{ quantity }}",
    "clickId": "{{ click_id }}"
  }
}
```

### Destination Configuration

```json
{
  "accountId": "a2_xxxxx",
  "version": "v3",
  "hashData": true,
  "eventsMapping": [
    { "from": "order_completed", "to": "Purchase" },
    { "from": "add_to_cart", "to": "AddToCart" },
    { "from": "product_viewed", "to": "ViewContent" }
  ]
}
```

## Additional Resources

- **Main Documentation:** [../README.md](../README.md)
- **Business Logic:** [businesslogic.md](businesslogic.md)
- **Reddit Ads API Documentation:** https://ads-api.reddit.com/docs/
- **RudderStack RETL Guide:** https://www.rudderstack.com/docs/reverse-etl/

---

**Last Updated:** 2025-01-22
**Maintainer:** RudderStack Integration Team
