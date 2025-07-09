# AppsFlyer RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Not Supported**

The AppsFlyer destination does not support RETL functionality. Evidence:
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
// Example: Sending app events
{
  "type": "track",
  "event": "purchase",
  "properties": {
    "af_revenue": 99.99,
    "af_currency": "USD",
    "af_order_id": "12345"
  },
  "context": {
    "device": {
      "advertisingId": "abc-123-def"
    }
  }
}
```

### 2. Direct API Integration

Use AppsFlyer's APIs directly from your warehouse:
- **S2S Events API**: For server-to-server event tracking
- **Audiences API**: For audience management
- **Raw Data Export**: For data extraction

### 3. Custom ETL Solutions

Implement custom solutions to extract data from warehouse and send to AppsFlyer APIs.

## Standard Event Stream Processing

The AppsFlyer destination processes all events through the standard event stream logic:

### Supported Event Types
- **Track**: Event tracking via S2S Events API
- **Screen**: Screen view events (mobile apps)
- **Page**: Page view events (web)
- **Identify**: User identification (device mode only)

### Connection Configuration

Standard AppsFlyer configuration parameters:

- **Dev Key**: AppsFlyer application dev key
- **Apple App ID**: Required for iOS apps
- **HTTP API**: Enable for server-to-server events
- **Share Event Names**: Configure event name sharing

## Data Flow

### Standard Event Stream Data Flow

1. RudderStack receives events from supported sources (SDK, cloud app, etc.)
2. Events are processed through standard transformation logic
3. Transformed events are sent to AppsFlyer endpoints:
   - S2S Events API for server-side tracking
   - SDK integration for device-side tracking

## Summary

The AppsFlyer destination does not support RETL functionality. The destination:

- **Does not support RETL**: No warehouse source type support
- **Does not support VDM v1**: No `supportsVisualMapper` configuration
- **Does not support VDM v2**: No `record` message type in `supportedMessageTypes`
- **Standard Event Stream Only**: All events processed through standard event stream logic

**Note**: For warehouse-based data activation, consider using AppsFlyer's direct APIs or other ETL solutions to transform warehouse data into events that can be sent through supported sources.

### Supported Source Types
```json
"supportedSourceTypes": [
  "android", "ios", "web", "unity", "amp", "cloud", 
  "reactnative", "flutter", "cordova", "shopify"
]
```

**Note**: `warehouse` is not included in supported source types, confirming no RETL support.

### Supported Message Types
```json
"supportedMessageTypes": {
  "cloud": ["track", "screen", "page"],
  "device": {
    "android": ["track", "screen", "identify"],
    "ios": ["track", "screen", "identify"],
    "web": ["track", "page"]
  }
}
```

**Limitations**:
- No warehouse source type support
- No VDM v1 or VDM v2 capabilities
- Limited to mobile and web event tracking use cases
