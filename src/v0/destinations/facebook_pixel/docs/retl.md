# Facebook Pixel RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Not Supported**

The Facebook Pixel destination does not support RETL functionality. Evidence:
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
// Example: Sending conversion events
{
  "type": "track",
  "event": "Purchase",
  "properties": {
    "value": 99.99,
    "currency": "USD",
    "content_ids": ["product123"]
  },
  "context": {
    "traits": {
      "email": "user@example.com"
    }
  }
}
```

### 2. Direct API Integration

Use Facebook's Conversions API directly from your warehouse:
- **Conversions API**: For server-side event tracking
- **Offline Events API**: For offline conversion tracking
- **Custom Audiences API**: For audience management

### 3. Custom ETL Solutions

Implement custom solutions to extract data from warehouse and send to Facebook APIs.

## Standard Event Stream Processing

The Facebook Pixel destination processes all events through the standard event stream logic:

### Supported Event Types
- **Identify**: User identification via Conversions API
- **Track**: Event tracking via Conversions API
- **Page**: Page view events (converted to track events)
- **Screen**: Screen view events (converted to track events)

### Connection Configuration

Standard Facebook Pixel configuration parameters:

- **Pixel ID**: Facebook Pixel ID
- **Access Token**: Facebook access token (for cloud mode)
- **Test Event Code**: Optional, for testing events

## Data Flow

### Standard Event Stream Data Flow

1. **Event Reception**: RudderStack receives events from supported sources (SDK, cloud app, etc.)
2. **Validation**: Events are validated for required fields and proper format
3. **Transformation**: Events are transformed using the standard mapping configuration
4. **API Call**: Transformed events are sent to Facebook Conversions API `/events` endpoint
5. **Response Handling**: API responses are processed using standard error handling

### Event Processing Pipeline

```
Input Event (Event Stream)
         ↓
Event Type Validation (identify/track/page/screen)
         ↓
User Data Mapping (using FBPIXELUserDataConfig.json)
         ↓
Common Data Mapping (using FBPIXELCommonConfig.json)
         ↓
Custom Data Processing (properties flattening, PII handling)
         ↓
Payload Construction
         ↓
API Request to Facebook Conversions API
         ↓
Response Processing
```

## Summary

The Facebook Pixel destination does not support RETL functionality. The destination:

- **Does not support RETL**: No warehouse source type support
- **Does not support VDM v1**: No `supportsVisualMapper` configuration
- **Does not support VDM v2**: No `record` message type in `supportedMessageTypes`
- **Standard Event Stream Only**: All events processed through standard event stream logic

**Note**: For warehouse-based data activation, consider using Facebook's direct APIs or other ETL solutions to transform warehouse data into events that can be sent through supported sources.

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
  "cloud": ["identify", "page", "screen", "track"],
  "device": {
    "web": ["track", "page"]
  }
}
```

**Limitations**:
- No warehouse source type support
- No VDM v1 or VDM v2 capabilities
- Limited to standard event stream processing
