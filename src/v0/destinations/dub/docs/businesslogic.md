# Business Logic and Mappings

## Overview

The Dub destination transforms RudderStack track events into Dub conversion API calls. It supports two main conversion types: Lead Conversions and Sales Conversions, each with specific field mappings and validation requirements.

**Critical Requirement**: Dub requires **strict event ordering** for proper conversion attribution. The mandatory flow is **Click → Lead → Sale**. Events processed out of order will break the conversion attribution chain.

## Event Processing Flow

### Event Ordering Requirements

**MANDATORY**: Dub requires strict event ordering for conversion attribution:

1. **Click Event**: Initial user interaction with a Dub short link
2. **Lead Event**: User performs a conversion action (sign-up, download, etc.)
3. **Sale Event**: User completes a revenue-generating action

**Processing Sequence**:

- Lead events must be processed before any associated sale events
- Sale events that reference a `leadEventName` require the lead event to be processed first
- Out-of-order processing will break the conversion attribution chain

### Message Type Validation

1. **Supported Message Types**: Only `track` events are supported
2. **Unsupported Types**: All other message types (`identify`, `page`, `screen`, `group`, `alias`) throw `InstrumentationError`

### Event Name Mapping

Events are mapped based on the `eventMapping` configuration:

```javascript
// Example event mapping configuration
eventMapping: [
  { from: 'User Signed Up', to: 'LEAD_CONVERSION' },
  { from: 'Order Completed', to: 'SALES_CONVERSION' },
];
```

**Validation:**

- Event name must be present in the message
- Event name must exist in the mapping configuration
- Unmapped events throw `ConfigurationError`

## Lead Conversion Processing

### API Endpoint

- **URL**: `https://api.dub.co/track/lead`
- **Method**: POST
- **Content-Type**: application/json

### Field Mappings

| Destination Field    | Source Mapping                             | Required | Type   | Notes                                 |
| -------------------- | ------------------------------------------ | -------- | ------ | ------------------------------------- |
| `clickId`            | `context.dubClickId`                       | ✅       | string | Unique click identifier from Dub      |
| `eventName`          | `event`                                    | ✅       | string | Track event name (1-255 chars)        |
| `customerExternalId` | External ID resolution\*                   | ✅       | string | Customer identifier (1-100 chars)     |
| `customerName`       | Name resolution\*\*                        | ❌       | string | Customer display name (max 100 chars) |
| `customerEmail`      | `emailOnly` (generic map)                  | ❌       | string | Customer email (max 100 chars)        |
| `customerAvatar`     | `traits.avatar` or `context.traits.avatar` | ❌       | string | Avatar URL                            |
| `mode`               | `properties.mode` or default               | ❌       | enum   | Default: 'wait'                       |
| `eventQuantity`      | `properties.eventQuantity`                 | ❌       | number | Numeric value for event               |
| `metadata`           | `properties` (filtered)                    | ❌       | object | Additional data (max 10,000 chars)    |

\* External ID Resolution Priority:

1. `getDestinationExternalID(message, 'customerExternalId')`
2. `getFieldValueFromMessage(message, 'userIdOnly')`

\*\* Name Resolution Priority:

1. `getFieldValueFromMessage(message, 'name')`
2. `getFullName(message)` (combines firstName/lastName)

### Metadata Field Exclusions

The following fields are excluded from metadata:

- `eventQuantity`
- `mode`
- `email`
- `name`
- `phone`
- `firstName`
- `lastName`

### Validation Requirements

**Required Field Validation:**

- `clickId`: Must be present in `context.dubClickId`
- `eventName`: Must be present and non-empty
- `customerExternalId`: Must resolve from external ID or userId

**Missing Required Fields**: Throws `InstrumentationError`

## Sales Conversion Processing

### API Endpoint

- **URL**: `https://api.dub.co/track/sale`
- **Method**: POST
- **Content-Type**: application/json

### Field Mappings

| Destination Field    | Source Mapping                             | Required | Type   | Notes                                              |
| -------------------- | ------------------------------------------ | -------- | ------ | -------------------------------------------------- |
| `customerExternalId` | External ID resolution\*                   | ✅       | string | Customer identifier (1-100 chars)                  |
| `amount`             | `properties.total` or `properties.amount`  | ✅       | number | Amount in cents (≥ 0)                              |
| `eventName`          | `event`                                    | ✅       | string | Track event name (max 255 chars)                   |
| `currency`           | `properties.currency`                      | ❌       | string | ISO 4217 currency code                             |
| `paymentProcessor`   | `properties.paymentProcessor`              | ❌       | enum   | stripe, shopify, polar, paddle, revenuecat, custom |
| `invoiceId`          | Invoice ID resolution\*\*                  | ❌       | string | Idempotency key                                    |
| `leadEventName`      | `properties.leadEventName`                 | ❌       | string | Associate with prior lead event                    |
| `clickId`            | `context.dubClickId`                       | ❌       | string | For direct sale tracking                           |
| `customerName`       | Name resolution\*\*\*                      | ❌       | string | Customer display name                              |
| `customerEmail`      | `emailOnly` (generic map)                  | ❌       | string | Customer email                                     |
| `customerAvatar`     | `traits.avatar` or `context.traits.avatar` | ❌       | string | Avatar URL                                         |
| `metadata`           | `properties` (filtered)                    | ❌       | object | Additional data                                    |

\* External ID Resolution: Same as Lead Conversion

\*\* Invoice ID Resolution Priority:

1. `properties.invoiceId`
2. `properties.orderId`
3. `properties.order_id`

\*\*\* Name Resolution: Same as Lead Conversion

### Amount Conversion Logic

When `convertAmountToCents` is enabled (default):

```javascript
if (convertAmountToCents && typeof rawPayload.amount === 'number') {
  rawPayload.amount = Math.round(rawPayload.amount * 100);
}
```

**Examples:**

- $99.99 → 9999 cents
- $14.784 → 1478 cents (rounded)
- $7.555 → 756 cents (rounded)

### Metadata Field Exclusions

The following fields are excluded from metadata:

- `total`
- `amount`
- `paymentProcessor`
- `invoiceId`
- `orderId`
- `order_id`
- `currency`
- `leadEventName`
- `email`
- `name`
- `phone`
- `firstName`
- `lastName`

### Validation Requirements

**Required Field Validation:**

- `amount`: Must be present and numeric
- `eventName`: Must be present and non-empty
- `customerExternalId`: Must resolve from external ID or userId

**Missing Required Fields**: Throws `InstrumentationError`

## Error Handling

### Configuration Errors

- **Missing API Key**: Throws `ConfigurationError`
- **Unmapped Event**: Throws `ConfigurationError` with event name
- **Invalid Event Mapping**: Validation occurs at config level

### Instrumentation Errors

- **Missing Message Type**: Throws `InstrumentationError`
- **Unsupported Message Type**: Throws `InstrumentationError`
- **Missing Event Name**: Throws `InstrumentationError`
- **Missing Customer External ID**: Throws `InstrumentationError`
- **Empty Payload**: Throws `InstrumentationError`

### Data Sanitization

- **Null/Undefined Values**: Removed via `removeUndefinedNullValuesAndEmptyObjectArray`
- **Empty Objects**: Removed from final payload
- **Empty Arrays**: Removed from final payload

## Use Cases

### Lead Conversion Scenarios

1. **User Registration**: Track sign-ups with email and profile information
2. **Content Downloads**: Track lead generation from gated content
3. **Trial Sign-ups**: Track free trial registrations with quantity tracking
4. **Newsletter Subscriptions**: Track email opt-ins with metadata
5. **Demo Requests**: Track sales-qualified leads with contact information

### Sales Conversion Scenarios

1. **E-commerce Purchases**: Track completed orders with payment details
2. **Subscription Payments**: Track recurring revenue events
3. **Plan Upgrades**: Track upsell/upgrade transactions
4. **One-time Purchases**: Track single transaction events
5. **Refunds/Credits**: Track negative amounts (if supported by Dub)

### Integration Patterns

**Lead-to-Sale Attribution:**

```javascript
// Lead event
{
  event: 'Trial Started',
  properties: { plan: 'pro' }
}

// Later sale event with attribution
{
  event: 'Subscription Created',
  properties: {
    amount: 99.00,
    leadEventName: 'Trial Started'  // Links to prior lead
  }
}
```

**Multi-product Orders:**

```javascript
{
  event: 'Order Completed',
  properties: {
    total: 299.97,
    products: [
      { id: 'prod1', price: 99.99, quantity: 2 },
      { id: 'prod2', price: 99.99, quantity: 1 }
    ]
  }
}
```

## Field Length and Format Limits

### Dub API Constraints

- **Event Name**: 1-255 characters
- **Customer External ID**: 1-100 characters
- **Customer Name**: Max 100 characters
- **Customer Email**: Max 100 characters
- **Metadata**: Max 10,000 characters when stringified
- **Amount**: Must be ≥ 0
- **Currency**: ISO 4217 currency codes

### RudderStack Validation

- **Event Name Pattern**: `^[^{}]{1,100}$` (from schema.json)
- **API Key Pattern**: `^dub_[a-zA-Z0-9_]{8,100}$`

## Performance Considerations

- **Payload Size**: Keep metadata under 10,000 characters
- **Field Exclusion**: Automatic exclusion reduces payload size
- **Batch Processing**: Supported via router destination pattern
- **Synchronous Mode**: Uses 'wait' mode for immediate response confirmation
