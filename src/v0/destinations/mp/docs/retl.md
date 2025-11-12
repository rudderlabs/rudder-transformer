# Mixpanel RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Not Supported**

The Mixpanel destination does not support RETL functionality. Evidence:

- `supportedSourceTypes` does not include `warehouse`
- No warehouse source type support in configuration
- RETL requires warehouse source type support

## RETL Support Analysis

Since RETL is not supported (no warehouse source type), the following analysis applies:

### Which type of retl support does it have?

- **JSON Mapper**: Not applicable (no RETL support)
- **VDM V1**: Not supported (`supportsVisualMapper` not present in `db-config.json`)
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`)

### Does it have vdm support?

**No** - `supportsVisualMapper` is not present in `db-config.json`

### Does it have vdm v2 support?

**No** - Missing both:

- `supportedMessageTypes > record` in `db-config.json`
- Record event type handling in transformer code

### Connection config

Not applicable as RETL is not supported.

## Alternative Approaches for Warehouse Data

Since RETL is not supported, consider these alternatives for warehouse-based data activation:

### 1. Event Stream from Other Sources

Transform warehouse data into events using other tools and send through supported sources:

```javascript
// Example: Sending user profile updates
{
  "type": "identify",
  "userId": "user123",
  "traits": {
    "email": "user@example.com",
    "plan": "premium"
  }
}
```

### 2. Direct API Integration

Use Mixpanel's APIs directly from your warehouse:

- **Import API**: For historical event data
- **Engage API**: For user profile updates
- **Groups API**: For group profile updates

### 3. Custom ETL Solutions

Implement custom solutions to extract data from warehouse and send to Mixpanel APIs.

## Standard Event Stream Processing

The Mixpanel destination processes all events through the standard event stream logic:

### Supported Event Types

- **Identify**: User profile updates via `/engage` endpoint
- **Track**: Event tracking via `/track` or `/import` endpoints
- **Page**: Page view events (converted to track events)
- **Screen**: Screen view events (converted to track events)
- **Group**: Group profile updates via `/groups` endpoint
- **Alias**: User identity merging via `/import` endpoint with `$merge` event

### Connection Configuration

Standard Mixpanel configuration parameters:

- **Token**: Required for authentication with Mixpanel API
- **Data Residency**: Specifies the Mixpanel data center to use (US, EU, IN)
- **API Secret**: Required for using the Import API (server-side implementations)
- **Identity Merge API**: Choose between Original ID Merge and Simplified ID Merge

## Data Flow

### Standard Event Stream Data Flow

1. RudderStack receives events from supported sources (SDK, cloud app, etc.)
2. Events are processed through standard transformation logic
3. Transformed events are sent to appropriate Mixpanel endpoints:
   - `/import` for server-side event tracking
   - `/track` for client-side event tracking
   - `/engage` for user profile updates
   - `/groups` for group profile updates

## Summary

The Mixpanel destination does not support RETL functionality. The destination:

- **Does not support RETL**: No warehouse source type support
- **Does not support VDM v1**: No `supportsVisualMapper` configuration
- **Does not support VDM v2**: No `record` message type in `supportedMessageTypes`
- **Standard Event Stream Only**: All events processed through standard event stream logic

**Note**: For warehouse-based data activation, consider using Mixpanel's direct APIs or other ETL solutions to transform warehouse data into events that can be sent through supported sources.

### Supported Source Types

```json
"supportedSourceTypes": [
  "android", "ios", "web", "unity", "amp", "cloud",
  "reactnative", "flutter", "cordova", "shopify"
]
```

**Note**: `warehouse` is not included in supported source types, confirming no RETL support.
