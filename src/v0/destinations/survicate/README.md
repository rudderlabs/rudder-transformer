# Survicate RudderStack Integration Guide

## Overview

This is a RudderStack Cloud Mode destination integration for Survicate. It allows you to send user data and events from RudderStack to Survicate for use in surveys and analytics.

## Supported Events

The integration supports three types of RudderStack events:

1. **Identify** - Send user identification data and attributes to Survicate
2. **Group** - Associate users with groups/companies in Survicate
3. **Track** - Track user events in Survicate

## Authentication

The integration requires a **Destination Key** from Survicate, which is used to authenticate API requests via the `X-API-Key` header.

## File Structure

```
src/v0/destinations/survicate/
├── transform.ts          # Main transformation logic for all event types
├── types.ts              # TypeScript type definitions and Zod schemas
├── config.ts             # Configuration constants and API endpoints
├── utils.ts              # Utility functions for payload processing
└── utils.test.ts         # Unit tests for utility functions

test/integrations/destinations/survicate/
├── processor/
│   ├── data.ts          # Main test data combining all processor tests
│   ├── identify.ts      # Identify event test cases
│   ├── group.ts         # Group event test cases
│   └── track.ts         # Track event test cases
└── router/
    └── data.ts          # Batch processing router tests
```

## Event Transformation Details

### Identify Events

**Endpoint:** `POST /endpoint/rudder_stack/identify`

**Requirements:**
- `userId` is required (anonymous calls are skipped)

**Transformed Payload:**
```json
{
  "userId": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "company_id": "company-A",
  "timestamp": "2020-04-22T08:06:20.337Z",
  "messageId": "msg-123",
  "context": {
    "locale": "en-US",
    "userAgent": "Mozilla/5.0...",
    "campaign": { "name": "summer", "source": "google" }
  }
}
```

### Group Events

**Endpoint:** `POST /endpoint/rudder_stack/group`

**Requirements:**
- `userId` is required (anonymous calls are skipped)
- `groupId` is required

**Transformed Payload:**
```json
{
  "userId": "user-123",
  "groupId": "company-A",
  "name": "Acme Inc.",
  "plan": "Enterprise",
  "employees": 1200,
  "timestamp": "2025-11-07T10:15:00.000Z",
  "messageId": "msg-123",
  "context": {
    "locale": "en-US"
  }
}
```

### Track Events

**Endpoint:** `POST /endpoint/rudder_stack/track`

**Requirements:**
- `userId` is required (anonymous calls are skipped)
- `event` is required (event name)

**Transformed Payload:**
```json
{
  "userId": "user-123",
  "event": "Product Purchased",
  "properties": {
    "order_ID": "1",
    "category": "boots",
    "product_name": "new_boots",
    "price": 60
  },
  "timestamp": "2020-04-22T08:06:20.338Z",
  "messageId": "msg-123"
}
```

## Nested Attributes Flattening

The integration automatically flattens nested objects in all payloads by joining keys with underscores.

**Example:**
```javascript
{
  "company": { "id": "company-A" }
}
```

Gets transformed to:
```javascript
{
  "company_id": "company-A"
}
```

**Deep Nesting Example:**
```javascript
{
  "plan": {
    "tier": "pro",
    "renewal": { "date": "2025-12-01" }
  }
}
```

Gets transformed to:
```javascript
{
  "plan_tier": "pro",
  "plan_renewal_date": "2025-12-01"
}
```

## Context Properties Extraction

From the incoming RudderStack event context, only these properties are extracted and included:
- `locale` - Language/locale information
- `campaign` - Campaign attribution data
- `userAgent` - Browser/device user agent string

All other context properties are excluded from the payload sent to Survicate.

## Installation & Setup

### 1. Deploy the Integration Code

The integration files are located in:
- Transformation code: `src/v0/destinations/survicate/`
- Tests: `test/integrations/destinations/survicate/`

### 2. Build and Test

```bash
# Install dependencies
npm ci

# Build the project
npm run build

# Run tests for the integration
npm run test:ts -- component --destination=survicate
```

### 3. Configuration

Create/Update Survicate destination configuration in `rudder-integrations-config` repository:
```json
{
  "id": "survicate_destination_id",
  "name": "Survicate (Cloud Mode)",
  "slug": "survicate",
  "categories": ["Customer Data Platform"],
  "displayName": "Survicate",
  "description": "Send user identification, group, and event data to Survicate",
  "website": "https://www.survicate.com",
  "logoUrl": "https://...",
  "config": {
    "destinationKey": {
      "type": "string",
      "displayName": "Destination Key",
      "description": "Your Survicate Destination Key for authentication",
      "required": true
    }
  }
}
```

## Testing

The integration includes comprehensive tests covering:

### Processor Tests
- Identify events with traits and nested attributes
- Group events with deep nesting
- Track events with event properties
- Anonymous calls validation (should fail)
- Missing required fields validation

### Router Tests
- Batch processing of multiple events
- Mixed event types in a single batch
- Multiple identify events

### Running Tests

```bash
# Run specific destination tests
npm run test:ts -- component --destination=survicate

# Run tests in verbose mode
npm run test:ts -- component --destination=survicate --verbose=true
```

## Implementation Details

### Utility Functions

The `utils.ts` file provides the following helper functions:

#### `flattenNestedAttributes(obj, prefix)`
Recursively flattens nested objects using underscore-separated keys.

#### `extractContextProperties(context)`
Extracts only `locale`, `campaign`, and `userAgent` from the context object.

#### `buildIdentifyPayload(message)`
Constructs the complete identify event payload with flattened traits.

#### `buildGroupPayload(message)`
Constructs the complete group event payload with flattened traits.

#### `buildTrackPayload(message)`
Constructs the complete track event payload with flattened properties.

### Type Definitions

The integration uses Zod schemas for runtime validation:

```typescript
export const SurvicateDestinationConfigSchema = z
  .object({
    destinationKey: z.string().min(1, 'Destination Key is required'),
  })
  .passthrough();

export const SurvicateMessageSchema = z
  .object({
    type: z.enum(['identify', 'group', 'track']),
    userId: z.string().optional(),
    groupId: z.string().optional(),
    event: z.string().optional(),
    // ... other fields
  })
  .passthrough();
```

## Error Handling

The integration validates and handles the following error cases:

1. **Missing Destination Key** - ConfigurationError
2. **Anonymous Identify Calls** - InstrumentationError (skipped as per requirements)
3. **Missing userId (group/track)** - InstrumentationError
4. **Missing groupId (group events)** - InstrumentationError
5. **Missing event name (track events)** - InstrumentationError
6. **Unsupported message type** - InstrumentationError

All errors return HTTP 400 status with appropriate error messages.

## Future Enhancements

1. **Batch Optimization** - Group multiple events into batch requests when possible
2. **Custom Attribute Mapping** - Allow custom field mappings via configuration
3. **Event Filtering** - Allow filtering which events to send based on configuration
4. **Data Enrichment** - Support for custom properties and enrichment rules
5. **Retry Logic** - Implement exponential backoff for failed requests

## Troubleshooting

### Test Failures
If tests fail, check:
1. TypeScript compilation errors: `npm run build`
2. Missing dependencies: `npm ci`
3. Destination configuration in test data

### Runtime Issues
1. Verify Destination Key is correctly configured
2. Check API endpoint URLs are accessible
3. Ensure user has proper RudderStack event format
4. Verify event types are one of: identify, group, track

## References

- [RudderStack Event Specification](https://www.rudderstack.com/docs/event-spec/standard-events/)
- [RudderStack Destination Development Guide](https://www.rudderstack.com/docs/destinations/)
- [Survicate API Documentation](https://www.survicate.com)
