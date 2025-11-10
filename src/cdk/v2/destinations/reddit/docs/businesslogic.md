# Business Logic Documentation - Reddit Destination

## Overview

This document provides detailed information about the business logic implementation for the Reddit destination, including data mappings, transformation flows, validations, and use cases.

## Table of Contents

- [Data Mappings](#data-mappings)
- [Transformation Flow](#transformation-flow)
- [Event Type Handling](#event-type-handling)
- [Validations](#validations)
- [Use Cases](#use-cases)
- [Error Scenarios](#error-scenarios)

## Data Mappings

### User Data Mapping

User data is mapped from RudderStack events to Reddit's user data structure. The mapping is defined in `data/userDataMapping.json` and processed differently based on API version.

#### Standard User Fields

| RudderStack Source Field               | Reddit Destination Field | Required | Data Type | Hashing Applied        | Notes                         |
| -------------------------------------- | ------------------------ | -------- | --------- | ---------------------- | ----------------------------- |
| `context.traits.email`, `traits.email` | `email`                  | No       | string    | Yes (if hashData=true) | Normalized and SHA-256 hashed |
| `userId`                               | `external_id`            | No       | string    | Yes (if hashData=true) | User's unique identifier      |
| `context.ip`, `request_ip`             | `ip_address`             | No       | string    | Yes (if hashData=true) | User's IP address, trimmed    |
| `context.traits.phone`, `traits.phone` | `phone_number`           | No       | string    | Yes (if hashData=true) | User's phone number           |
| `context.userAgent`                    | `user_agent`             | No       | string    | No                     | Browser user agent string     |
| `properties.uuid`                      | `uuid`                   | No       | string    | No                     | Reddit UUID if available      |

**Source:** `data/userDataMapping.json`

#### Device Identifiers

| RudderStack Source Field       | Reddit Destination Field | Required | Condition       | Hashing Applied        |
| ------------------------------ | ------------------------ | -------- | --------------- | ---------------------- |
| `context.device.advertisingId` | `idfa`                   | No       | OS is iOS/macOS | Yes (if hashData=true) |
| `context.device.advertisingId` | `aaid`                   | No       | OS is Android   | Yes (if hashData=true) |

**Logic:**

```javascript
// V3 Implementation (transformV3.ts lines 34-43)
const os = message.context?.os?.name?.toLowerCase();
if (isAppleFamily(os)) {
  userData.idfa = message.context?.device?.advertisingId?.trim();
}
if (os === 'android') {
  userData.aaid = message.context?.device?.advertisingId?.trim();
}
```

#### Data Processing Options

| RudderStack Source Field                   | Reddit Destination Field          | Required | Data Type | Notes                            |
| ------------------------------------------ | --------------------------------- | -------- | --------- | -------------------------------- |
| `context.traits.country`, `traits.country` | `data_processing_options.country` | No       | string    | Country code for data processing |
| `context.traits.region`, `traits.region`   | `data_processing_options.region`  | No       | string    | Region code for data processing  |
| `properties.modes`                         | `data_processing_options.modes`   | No       | array     | Limited Data Use modes           |

#### Screen Dimensions

| RudderStack Source Field | Reddit Destination Field   | Required | Data Type |
| ------------------------ | -------------------------- | -------- | --------- |
| `context.screen.width`   | `screen_dimensions.width`  | No       | number    |
| `context.screen.height`  | `screen_dimensions.height` | No       | number    |

### Event Type Mapping

Event names are mapped from RudderStack to Reddit's standard conversion event types.

#### Mapping Priority

1. **Custom Mappings:** User-configured mappings in `destination.Config.eventsMapping`
2. **Built-in E-commerce Mappings:** Automatic mappings for standard e-commerce events
3. **Custom Event:** If no mapping found, event is sent as CUSTOM with original name

#### Built-in E-commerce Mappings

| RudderStack Event Name (case-insensitive) | Reddit Event Type (v2) | Reddit Event Type (v3) |
| ----------------------------------------- | ---------------------- | ---------------------- |
| "product viewed", "product list viewed"   | ViewContent            | VIEW_CONTENT           |
| "product added"                           | AddToCart              | ADD_TO_CART            |
| "product added to wishlist"               | AddToWishlist          | ADD_TO_WISHLIST        |
| "order completed"                         | Purchase               | PURCHASE               |
| "products searched"                       | Search                 | SEARCH                 |

**Source:** `config.js` (lines 5-26)

#### Custom Event Mapping Example

```javascript
// Configuration
{
  "eventsMapping": [
    { "from": "User Signed Up", "to": "SignUp" },
    { "from": "Form Submitted", "to": "Lead" }
  ]
}

// V2 Output
{
  "tracking_type": "SignUp"
}

// V3 Output
{
  "tracking_type": "SIGN_UP"
}
```

#### Supported Reddit Event Types

| Event Type (v2) | Event Type (v3) | Description                 |
| --------------- | --------------- | --------------------------- |
| PageVisit       | PAGE_VISIT      | User visited a page         |
| ViewContent     | VIEW_CONTENT    | User viewed content/product |
| Search          | SEARCH          | User performed a search     |
| AddToCart       | ADD_TO_CART     | User added item to cart     |
| AddToWishlist   | ADD_TO_WISHLIST | User added item to wishlist |
| Lead            | LEAD            | User became a lead          |
| Purchase        | PURCHASE        | User completed purchase     |
| SignUp          | SIGN_UP         | User signed up/registered   |
| Custom          | CUSTOM          | Custom event type           |

**Source:**

- V2: `procWorkflow.yaml` (lines 51-57)
- V3: `types.ts` (lines 76-93)
- Conversion: `utils.js` `convertToUpperSnakeCase()` (lines 117-129)

### Event Metadata Mapping

Event metadata varies based on event type and includes revenue, product information, and conversion tracking fields.

#### Common Metadata Fields

| RudderStack Source Field                          | Reddit Destination Field | Required | Data Type      | Notes                                   |
| ------------------------------------------------- | ------------------------ | -------- | -------------- | --------------------------------------- |
| `properties.conversionId`, `messageId` (fallback) | `conversion_id`          | No       | string         | Unique conversion identifier            |
| `timestamp`, `originalTimestamp`                  | `event_at`               | Yes      | timestamp (ms) | Event occurrence time                   |
| `properties.clickId`                              | `click_id`               | No       | string         | Reddit click identifier for attribution |

#### Revenue Metadata (Purchase, AddToCart, ViewContent)

| RudderStack Source Field      | Reddit Destination Field | Required | Event Types                      | Calculation               |
| ----------------------------- | ------------------------ | -------- | -------------------------------- | ------------------------- |
| `properties.currency`         | `currency`               | No       | Purchase, AddToCart, ViewContent | Currency code (e.g., USD) |
| `properties.itemCount`        | `item_count`             | No       | Purchase, AddToCart, ViewContent | Number of items           |
| Calculated from revenue/price | `value`                  | No       | Purchase, AddToCart, ViewContent | Value in cents            |

**Revenue Calculation Logic:**

```javascript
// Purchase events (utils.js lines 64-70)
// Uses properties.revenue
revenueInCents = Math.round(Number(properties.revenue) * 100);

// AddToCart events (utils.js lines 73-76)
// Uses properties.price * properties.quantity
revenueInCents = Math.round(Number(properties.price) * Number(properties.quantity || 1) * 100);

// ViewContent and other events (utils.js lines 79-82)
// Calculates from products array or single product
revenue = calculateDefaultRevenue(properties);
revenueInCents = revenue ? revenue * 100 : null;

// calculateDefaultRevenue logic:
// - For products array: sum(product.price * product.quantity)
// - For single product: price * (quantity || 1)
// - Returns null if all prices are undefined
```

**Source:** `utils.js` `populateRevenueField()` (lines 61-91)

#### Product Metadata

**Single Product:**

| RudderStack Source Field | Reddit Destination Field | Required | Data Type |
| ------------------------ | ------------------------ | -------- | --------- |
| `properties.product_id`  | `products[0].id`         | No       | string    |
| `properties.name`        | `products[0].name`       | No       | string    |
| `properties.category`    | `products[0].category`   | No       | string    |

**Multiple Products (from products array):**

| RudderStack Source Field           | Reddit Destination Field | Required | Data Type | Notes              |
| ---------------------------------- | ------------------------ | -------- | --------- | ------------------ |
| `properties.products[].product_id` | `products[].id`          | No       | string    | Product identifier |
| `properties.products[].name`       | `products[].name`        | No       | string    | Product name       |
| `properties.products[].category`   | `products[].category`    | No       | string    | Product category   |
| Sum of products[].quantity         | `item_count`             | No       | number    | Total item count   |

**Logic:**

```javascript
// V3 Implementation (transformV3.ts lines 91-119)
if (properties.products && properties.products.length > 0) {
  itemCount = products.length; // Count of products, not quantities
  products = properties.products.map((product) => ({
    id: product.product_id,
    name: product.name,
    category: product.category,
  }));
} else {
  // Single product
  itemCount = 1;
  products = [
    {
      id: properties.product_id,
      name: properties.name,
      category: properties.category,
    },
  ];
}
```

#### Event Metadata Field Restrictions

Not all metadata fields are supported for all event types. Unsupported fields are automatically removed.

**Item Count Support:**

| Event Type    | item_count Supported |
| ------------- | -------------------- |
| Purchase      | ✅ Yes               |
| AddToCart     | ✅ Yes               |
| AddToWishlist | ✅ Yes               |
| Custom        | ✅ Yes               |
| All Others    | ❌ No                |

**Value & Currency Support:**

| Event Type    | value, currency Supported |
| ------------- | ------------------------- |
| Purchase      | ✅ Yes                    |
| AddToCart     | ✅ Yes                    |
| AddToWishlist | ✅ Yes                    |
| Lead          | ✅ Yes                    |
| SignUp        | ✅ Yes                    |
| Custom        | ✅ Yes                    |
| All Others    | ❌ No                     |

**Source:** `utils.js` `removeUnsupportedFields()` (lines 93-115)

**Reference:** https://business.reddithelp.com/s/article/about-event-metadata

### V3-Specific Fields

| Field           | Value                | Required | Description                              |
| --------------- | -------------------- | -------- | ---------------------------------------- |
| `action_source` | "WEBSITE"            | Yes      | Source of the conversion action          |
| `test_id`       | `properties.test_id` | No       | Test mode identifier (prevents batching) |

**Source:** `transformV3.ts` (lines 163-164, 176)

## Transformation Flow

### High-Level Flow

```
┌─────────────────────────┐
│  RudderStack Event      │
│  (Track)                │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Router Workflow        │
│  (rtWorkflow.yaml)      │
│                         │
│  1. Validate input      │
│  2. Decide version      │
│     (v2 or v3)          │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│   V2   │ │   V3   │
│Process │ │Process │
└───┬────┘ └───┬────┘
    │          │
    └────┬─────┘
         │
         ▼
┌─────────────────────────┐
│  Event Batching         │
│                         │
│  - Group by version     │
│  - Chunk by batch size  │
│  - Respect dontBatch    │
│  - Separate test events │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Final Response         │
│                         │
│  - Batched requests     │
│  - Failed events        │
└─────────────────────────┘
```

### Version Decision Logic

The version is determined at the router level before processing:

```javascript
// utils.js (lines 4-11)
const decideVersion = ({ Config }) => {
  const configVersion = Config.version;
  let version = 'v2'; // Default
  if (isDefinedAndNotNull(configVersion) && configVersion === 'v3') {
    version = 'v3';
  }
  return version;
};
```

**Flow in rtWorkflow.yaml:**

```yaml
- name: decideVersion
  template: |
    $.decideVersion(^.[0].destination)

- name: transformWithV2
  condition: $.outputs.decideVersion === "v2"
  externalWorkflow:
    path: ./procWorkflow.yaml

- name: transformWithV3
  condition: $.outputs.decideVersion === "v3"
  externalWorkflow:
    path: ./procWorkflowV3.yaml
```

### V2 Transformation Flow (procWorkflow.yaml)

```
┌─────────────────────────┐
│  1. Validate Input      │
│  - accountId present    │
│  - message type = track │
│  - event name present   │
│  - timestamp present    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  2. Prepare User Object │
│  - Extract user data    │
│  - Detect OS/device     │
│  - Apply hashing        │
│  - Remove null values   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  3. Determine Event Type│
│  - Check custom mapping │
│  - Check ecom mapping   │
│  - Default to Custom    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  4. Build Custom Fields │
│  - Revenue fields       │
│    (if Purchase/Cart/   │
│     ViewContent)        │
│  - Conversion ID        │
│  - Remove unsupported   │
│    fields               │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  5. Build Product Fields│
│  - Products array or    │
│    single product       │
│  - Item count           │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  6. Combine All Fields  │
│  - Merge product &      │
│    custom fields        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  7. Prepare Final       │
│     Payload             │
│  - event_type           │
│  - user                 │
│  - event_metadata       │
│  - click_id             │
│  - event_at             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  8. Build Response      │
│  - Validate accessToken │
│  - Set endpoint         │
│  - Set headers          │
│  - Set JSON body        │
└─────────────────────────┘
```

**Source:** `procWorkflow.yaml` (lines 1-139)

### V3 Transformation Flow (transformV3.ts)

```
┌─────────────────────────┐
│  1. Validate Input      │
│  - message.type present │
│  - message.type='track' │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  2. Process Track Event │
│  (processTrackEvent)    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  3. Prepare User Object │
│  (prepareUserObject)    │
│  - Construct payload    │
│  - Extract device IDs   │
│  - Apply hashing        │
│  - Remove null values   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  4. Prepare Event Type  │
│  (prepareEventType)     │
│  - Check custom mapping │
│  - Check ecom mapping   │
│  - Convert to UPPER_    │
│    SNAKE_CASE           │
│  - Returns array if     │
│    multiple mappings    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  5. Generate Timestamp  │
│  (generateAndValidate   │
│   Timestamp)            │
│  - Parse timestamp      │
│  - Validate age (<7days)│
│  - Validate not future  │
│    (>5 min)             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  6. Build Event Metadata│
│  - Products array       │
│  - Revenue fields       │
│  - Remove unsupported   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  7. Construct Payload(s)│
│  - For each event type  │
│    (if multiplexing):   │
│    * event_at           │
│    * action_source      │
│    * type               │
│    * user               │
│    * metadata           │
│    * click_id           │
│    * test_id (optional) │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  8. Build Response(s)   │
│  - For each payload:    │
│    * Set endpoint       │
│    * Set headers with   │
│      accessToken        │
│    * Wrap in data.events│
│  - Return array of      │
│    responses            │
└─────────────────────────┘
```

**Source:** `transformV3.ts` `process()` function (lines 201-225)

## Event Type Handling

### Track Event Processing

Track events are the only supported event type. Processing varies by API version but follows the same general pattern.

#### Common Processing Steps

1. **Validation:** Verify required fields (accountId, event name, timestamp, access token)
2. **User Data Extraction:** Map user identifiers and PII from event to Reddit user structure
3. **Event Type Determination:** Map event name to Reddit event type
4. **Metadata Construction:** Build event-specific metadata (revenue, products, etc.)
5. **Payload Assembly:** Construct final Reddit API payload
6. **Response Building:** Create transformation response with endpoint and headers

#### V2-Specific Processing

**Payload Structure:**

```json
{
  "events": [
    {
      "click_id": "...",
      "event_at": 1234567890123,
      "event_type": {
        "tracking_type": "Purchase"
      },
      "user": { ... },
      "event_metadata": { ... }
    }
  ]
}
```

**Endpoint:** `https://ads-api.reddit.com/api/v2.0/conversions/events/{accountId}`

**Source:** `procWorkflow.yaml` (lines 109-138)

#### V3-Specific Processing

**Payload Structure:**

```json
{
  "data": {
    "test_id": "...",  // Optional
    "events": [
      {
        "click_id": "...",
        "event_at": 1234567890123,
        "action_source": "WEBSITE",
        "user": { ... },
        "type": {
          "tracking_type": "PURCHASE"
        },
        "metadata": { ... }
      }
    ]
  }
}
```

**Endpoint:** `https://ads-api.reddit.com/api/v3/pixels/{accountId}/conversion_events`

**Key Differences:**

1. Payload wrapped in `data` object
2. `action_source` field is required (always "WEBSITE")
3. Event type is `type` instead of `event_type`
4. Event type values are UPPER_SNAKE_CASE
5. Supports `test_id` for test mode

**Source:** `transformV3.ts` (lines 154-222)

### Multiplexing Logic

When a single event is mapped to multiple Reddit event types, the integration generates multiple conversion events.

**Implementation (V3):**

```javascript
// transformV3.ts (lines 154-199)
const processTrackEvent = (event) => {
  // ... setup
  const type = prepareEventType(message, eventsMapping);
  const finalPayload = [];

  if (Array.isArray(type)) {
    // Multiple event types - multiplex
    for (const t of type) {
      const metadata = prepareMetadata(message, t.tracking_type);
      const payload = {
        // ... construct payload with specific type
        type: t,
        metadata,
      };
      finalPayload.push({ data: { events: [payload] } });
    }
  } else {
    // Single event type
    const metadata = prepareMetadata(message, type.tracking_type);
    const payload = {
      // ... construct payload
      type,
      metadata,
    };
    finalPayload.push({ data: { events: [payload] } });
  }

  return finalPayload;
};
```

**Result:** One input event → Multiple output events, each sent separately to Reddit API

## Validations

### Input Validations

#### Required Field Validations

| Field                              | Validation Rule                       | Error Message                                                                                                                               | Error Type           |
| ---------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `destination.Config.accountId`     | Must be present and non-empty         | "Account is not present. Aborting message."                                                                                                 | InstrumentationError |
| `message.type`                     | Must be present                       | "message Type is not present. Aborting message." (v2)<br>"Message type is required" (v3)                                                    | InstrumentationError |
| `message.type`                     | Must equal "track" (case-insensitive) | "Event type {type} is not supported. Aborting message." (v2)<br>"Message type {type} is not supported" (v3)                                 | InstrumentationError |
| `message.event`                    | Must be present (v3)                  | "Event name is required in the message"                                                                                                     | InstrumentationError |
| `timestamp` or `originalTimestamp` | Must be present                       | "Timestamp is not present. Aborting message." (v2)<br>"Required field 'timestamp' or 'originalTimestamp' is missing from the message." (v3) | InstrumentationError |
| `metadata.secret.accessToken`      | Must be present                       | "Secret or accessToken is not present in the metadata"                                                                                      | OAuthSecretError     |

**Sources:**

- V2: `procWorkflow.yaml` (lines 18-29, 129)
- V3: `transformV3.ts` (lines 204-207, 68), `procWorkflow.yaml` (line 129)

#### Timestamp Validations (V3 Only)

| Validation   | Rule                                          | Error Message                                                       | Error Type           |
| ------------ | --------------------------------------------- | ------------------------------------------------------------------- | -------------------- |
| Format       | Must be parseable as Date                     | "Invalid timestamp format."                                         | InstrumentationError |
| Age - Past   | Must be less than 168 hours (7 days) old      | "event_at timestamp must be less than 168 hours (7 days) old."      | InstrumentationError |
| Age - Future | Must not be more than 5 minutes in the future | "event_at timestamp must not be more than 5 minutes in the future." | InstrumentationError |

**Implementation:**

```javascript
// utils.js (lines 131-157)
const generateAndValidateTimestamp = (timestamp) => {
  if (!timestamp) {
    throw new InstrumentationError('Required field "timestamp" or "originalTimestamp" is missing');
  }

  const eventAt = new Date(timestamp).getTime();
  if (Number.isNaN(eventAt)) {
    throw new InstrumentationError('Invalid timestamp format.');
  }

  const now = Date.now();
  const maxPastMs = 168 * 60 * 60 * 1000; // 7 days
  const maxFutureMs = 5 * 60 * 1000; // 5 minutes

  if (now - eventAt > maxPastMs) {
    throw new InstrumentationError('event_at timestamp must be less than 168 hours (7 days) old.');
  }
  if (eventAt - now > maxFutureMs) {
    throw new InstrumentationError(
      'event_at timestamp must not be more than 5 minutes in the future.',
    );
  }

  return eventAt;
};
```

### Data Quality Validations

#### Revenue Calculation

Revenue values are validated and calculated with safety checks:

```javascript
// utils.js (lines 61-91)
const populateRevenueField = (eventType, properties) => {
  let revenueInCents;

  switch (eventType) {
    case 'Purchase':
      // Must be a valid number
      revenueInCents =
        properties.revenue && !Number.isNaN(properties.revenue)
          ? Math.round(Number(properties.revenue) * 100)
          : null;
      break;

    case 'AddToCart':
      // Must have valid price
      revenueInCents =
        properties.price && !Number.isNaN(properties.price)
          ? Math.round(Number(properties.price) * Number(properties.quantity || 1) * 100)
          : null;
      break;

    default:
      // Calculate from products or single product
      const revenue = calculateDefaultRevenue(properties);
      revenueInCents = revenue ? revenue * 100 : null;
  }

  // Safety check for NaN
  if (lodash.isNaN(revenueInCents)) {
    return null;
  }

  return revenueInCents;
};
```

**Validation Rules:**

- Returns `null` if price/revenue is undefined or NaN
- Safely converts string numbers to Number type
- Returns `null` if final calculation results in NaN
- For products array: returns `null` if ALL products have undefined price

#### Null/Undefined Value Handling

All user data and event metadata go through null/undefined removal:

```javascript
// V3 implementation (transformV3.ts)
userData = removeUndefinedAndNullValues(userData);
metadata = removeUndefinedAndNullValues(metadata);
```

**Purpose:** Ensures clean payloads without undefined or null fields that could cause API errors

## Use Cases

### Use Case 1: E-commerce Purchase Tracking

**Scenario:** Track completed purchases with product details and revenue.

**Input Event:**

```json
{
  "type": "track",
  "event": "Order Completed",
  "userId": "user_12345",
  "timestamp": "2025-01-22T10:30:00Z",
  "context": {
    "traits": {
      "email": "john.doe@example.com"
    },
    "ip": "192.168.1.1"
  },
  "properties": {
    "orderId": "order_98765",
    "revenue": 159.99,
    "currency": "USD",
    "products": [
      {
        "product_id": "prod_001",
        "name": "Wireless Headphones",
        "category": "Electronics",
        "price": 79.99,
        "quantity": 1
      },
      {
        "product_id": "prod_002",
        "name": "Phone Case",
        "category": "Accessories",
        "price": 19.99,
        "quantity": 4
      }
    ]
  }
}
```

**Processing:**

1. Event mapped to "Purchase" (built-in mapping)
2. User data extracted: email (hashed), external_id (hashed), ip_address (hashed)
3. Revenue: $159.99 → 15999 cents
4. Item count: 2 products
5. Conversion ID: "order_98765"

**Output (V3):**

```json
{
  "data": {
    "events": [
      {
        "event_at": 1705919400000,
        "action_source": "WEBSITE",
        "click_id": null,
        "user": {
          "email": "a64f1...", // SHA-256 hash
          "external_id": "3d8b...", // SHA-256 hash
          "ip_address": "8cf4..." // SHA-256 hash
        },
        "type": {
          "tracking_type": "PURCHASE"
        },
        "metadata": {
          "conversion_id": "order_98765",
          "currency": "USD",
          "item_count": 2,
          "value": 15999,
          "products": [
            {
              "id": "prod_001",
              "name": "Wireless Headphones",
              "category": "Electronics"
            },
            {
              "id": "prod_002",
              "name": "Phone Case",
              "category": "Accessories"
            }
          ]
        }
      }
    ]
  }
}
```

### Use Case 2: Multi-Goal Event Tracking (Multiplexing)

**Scenario:** Track user registration as both SignUp and Lead for different campaign goals.

**Configuration:**

```json
{
  "eventsMapping": [
    { "from": "User Registered", "to": "SignUp" },
    { "from": "User Registered", "to": "Lead" }
  ]
}
```

**Input Event:**

```json
{
  "type": "track",
  "event": "User Registered",
  "userId": "user_56789",
  "timestamp": "2025-01-22T11:00:00Z",
  "context": {
    "traits": {
      "email": "jane.smith@example.com",
      "phone": "+14155552671"
    }
  },
  "properties": {
    "registrationSource": "organic"
  }
}
```

**Processing:**

1. Event mapped to TWO types: SignUp and Lead
2. TWO separate conversion events generated
3. Each has identical user data but different event type

**Output (V3):** Two separate responses

```json
// Response 1
{
  "data": {
    "events": [
      {
        "event_at": 1705921200000,
        "action_source": "WEBSITE",
        "user": {
          "email": "hashed...",
          "external_id": "hashed...",
          "phone_number": "hashed..."
        },
        "type": {
          "tracking_type": "SIGN_UP"
        },
        "metadata": {
          "conversion_id": "message_id_123"
        }
      }
    ]
  }
}

// Response 2
{
  "data": {
    "events": [
      {
        "event_at": 1705921200000,
        "action_source": "WEBSITE",
        "user": {
          "email": "hashed...",
          "external_id": "hashed...",
          "phone_number": "hashed..."
        },
        "type": {
          "tracking_type": "LEAD"
        },
        "metadata": {
          "conversion_id": "message_id_123"
        }
      }
    ]
  }
}
```

### Use Case 3: Add to Cart Tracking with Mobile Device

**Scenario:** Track add-to-cart action from a mobile app with device advertising ID.

**Input Event:**

```json
{
  "type": "track",
  "event": "Product Added",
  "userId": "user_11111",
  "timestamp": "2025-01-22T12:00:00Z",
  "context": {
    "os": {
      "name": "iOS"
    },
    "device": {
      "advertisingId": "00000000-0000-0000-0000-000000000000"
    },
    "traits": {
      "email": "mobile.user@example.com"
    }
  },
  "properties": {
    "product_id": "mobile_prod_123",
    "name": "Smartphone Stand",
    "category": "Mobile Accessories",
    "price": 24.99,
    "quantity": 2
  }
}
```

**Processing:**

1. Event mapped to "AddToCart" (built-in mapping)
2. OS detected as iOS → extract IDFA
3. Revenue: $24.99 \* 2 = $49.98 → 4998 cents
4. IDFA hashed (if hashData=true)

**Output (V3):**

```json
{
  "data": {
    "events": [
      {
        "event_at": 1705924800000,
        "action_source": "WEBSITE",
        "user": {
          "email": "hashed...",
          "external_id": "hashed...",
          "idfa": "hashed_00000000..." // Hashed IDFA
        },
        "type": {
          "tracking_type": "ADD_TO_CART"
        },
        "metadata": {
          "conversion_id": "message_id_456",
          "currency": null,
          "item_count": 1,
          "value": 4998,
          "products": [
            {
              "id": "mobile_prod_123",
              "name": "Smartphone Stand",
              "category": "Mobile Accessories"
            }
          ]
        }
      }
    ]
  }
}
```

### Use Case 4: Test Mode Conversion (V3 Only)

**Scenario:** Test conversion tracking without affecting production data.

**Input Event:**

```json
{
  "type": "track",
  "event": "Order Completed",
  "userId": "test_user",
  "timestamp": "2025-01-22T13:00:00Z",
  "properties": {
    "test_id": "test_campaign_001",
    "revenue": 99.99,
    "currency": "USD"
  }
}
```

**Processing:**

1. `test_id` detected → event will NOT be batched with production events
2. Separate request sent for test event
3. Reddit processes as test conversion

**Batching Behavior:**

```yaml
# rtWorkflow.yaml (line 67)
const nonBatchableEvents = $.outputs.successfulEvents{
.metadata.dontBatch || .message.[0].body.JSON.data.test_id
}[]
```

### Use Case 5: Custom Event Tracking

**Scenario:** Track a custom business event not covered by standard e-commerce events.

**Input Event:**

```json
{
  "type": "track",
  "event": "Video Watched",
  "userId": "user_99999",
  "timestamp": "2025-01-22T14:00:00Z",
  "properties": {
    "videoId": "vid_12345",
    "duration": 300,
    "completionRate": 0.85
  }
}
```

**Processing:**

1. No mapping found → sent as CUSTOM event
2. Original event name preserved in `custom_event_name`

**Output (V3):**

```json
{
  "data": {
    "events": [
      {
        "event_at": 1705928400000,
        "action_source": "WEBSITE",
        "user": {
          "external_id": "hashed..."
        },
        "type": {
          "tracking_type": "CUSTOM",
          "custom_event_name": "Video Watched"
        },
        "metadata": {
          "conversion_id": "message_id_789"
        }
      }
    ]
  }
}
```

## Error Scenarios

### Error Scenario 1: Missing Access Token

**Input:** Event without `metadata.secret.accessToken`

**Validation:** `procWorkflow.yaml` (line 129)

**Error:**

```json
{
  "statusCode": 400,
  "error": "Secret or accessToken is not present in the metadata",
  "statTags": {
    "errorCategory": "dataValidation",
    "errorType": "instrumentation",
    "destType": "REDDIT"
  }
}
```

**Error Type:** OAuthSecretError

### Error Scenario 2: Timestamp Too Old

**Input:** Event with timestamp older than 7 days

**Validation:** `utils.js` (lines 147-149)

**Example:**

```json
{
  "timestamp": "2025-01-01T00:00:00Z" // 21 days ago
}
```

**Error:**

```json
{
  "statusCode": 400,
  "error": "event_at timestamp must be less than 168 hours (7 days) old.",
  "statTags": {
    "errorCategory": "dataValidation",
    "errorType": "instrumentation",
    "destType": "REDDIT"
  }
}
```

**Error Type:** InstrumentationError

### Error Scenario 3: Invalid Message Type

**Input:** Event with type other than "track"

**Validation:** V2: `procWorkflow.yaml` (line 23), V3: `transformV3.ts` (line 208)

**Example:**

```json
{
  "type": "identify",
  "userId": "user_123"
}
```

**Error:**

```json
{
  "statusCode": 400,
  "error": "Message type identify is not supported",
  "statTags": {
    "errorCategory": "dataValidation",
    "errorType": "instrumentation",
    "destType": "REDDIT"
  }
}
```

**Error Type:** InstrumentationError

### Error Scenario 4: Missing Account ID

**Input:** Destination configuration without accountId

**Validation:** `procWorkflow.yaml` (line 21)

**Error:**

```json
{
  "statusCode": 400,
  "error": "Account is not present. Aborting message.",
  "statTags": {
    "errorCategory": "dataValidation",
    "errorType": "configuration",
    "destType": "REDDIT"
  }
}
```

**Error Type:** InstrumentationError (configuration)

### Error Scenario 5: Timestamp in Future

**Input:** Event with timestamp more than 5 minutes in the future

**Validation:** `utils.js` (lines 150-153)

**Example:**

```json
{
  "timestamp": "2025-01-22T23:00:00Z" // 10 minutes in future
}
```

**Error:**

```json
{
  "statusCode": 400,
  "error": "event_at timestamp must not be more than 5 minutes in the future.",
  "statTags": {
    "errorCategory": "dataValidation",
    "errorType": "instrumentation",
    "destType": "REDDIT"
  }
}
```

**Error Type:** InstrumentationError

### Error Scenario 6: Partial Batch Failure (Proxy Mode)

**Scenario:** Batch of 10 events, 3 fail due to invalid data

**Response from Reddit API:**

```json
{
  "status": 400,
  "response": {
    "invalid_events": [
      {
        "error_message": "Invalid email format",
        "event_index": 2
      },
      {
        "error_message": "Missing required field",
        "event_index": 5
      },
      {
        "error_message": "Invalid timestamp",
        "event_index": 8
      }
    ]
  }
}
```

**networkHandler Processing:**

If the batch has multiple events (`rudderJobMetadata.length > 1`):

1. Batch is marked for individual retry with `dontBatch` flag
2. Each event in the batch gets individual error response
3. Events are retried individually (not batched)

**Source:** `src/v1/destinations/reddit/networkHandler.js` (lines 50-62)

**Individual Retry Responses:**

```json
[
  {
    "statusCode": 500,
    "metadata": { "jobId": 1, "dontBatch": true },
    "error": "{\"invalid_events\": [...]}"
  },
  {
    "statusCode": 500,
    "metadata": { "jobId": 2, "dontBatch": true },
    "error": "{\"invalid_events\": [...]}"
  }
  // ... for all 10 events
]
```

## Additional Resources

- **Main Documentation:** [../README.md](../README.md)
- **RETL Guide:** [retl.md](retl.md)
- **Reddit Ads API v2 Documentation:** https://ads-api.reddit.com/docs/v2/
- **Reddit Ads API v3 Documentation:** https://ads-api.reddit.com/docs/v3/
- **Event Metadata Reference:** https://business.reddithelp.com/s/article/about-event-metadata

---

**Last Updated:** 2025-01-22
**Maintainer:** RudderStack Integration Team
