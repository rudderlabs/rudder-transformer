# MoEngage RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Not Supported**

The MoEngage destination does not support RETL functionality. Evidence:
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
    "name": "John Doe",
    "plan": "premium"
  }
}
```

### 2. Direct API Integration

Use MoEngage's APIs directly from your warehouse:
- **Bulk Import API**: For large-scale data imports
- **Track User API**: For user attribute updates
- **Create Event API**: For event data ingestion
- **S3 Data Import**: For batch processing

### 3. Custom ETL Solutions

Implement custom solutions to extract data from warehouse and send to MoEngage APIs.

## Standard Event Stream Processing

The MoEngage destination processes all events through the standard event stream logic:

### Supported Event Types
- **Identify**: User profile updates via Track User API
- **Track**: Event tracking via Create Event API
- **Alias**: User identity merging

### Connection Configuration

Standard MoEngage configuration parameters:

- **API ID**: MoEngage application API ID
- **API Key**: MoEngage API key
- **Data Center**: MoEngage data center (US, EU, etc.)

## Summary

The MoEngage destination does not support RETL functionality. The destination:

- **Does not support RETL**: No warehouse source type support
- **Does not support VDM v1**: No `supportsVisualMapper` configuration
- **Does not support VDM v2**: No `record` message type in `supportedMessageTypes`
- **Standard Event Stream Only**: All events processed through standard event stream logic

**Note**: For warehouse-based data activation, consider using MoEngage's direct APIs or other ETL solutions to transform warehouse data into events that can be sent through supported sources.

### Supported Source Types
```json
"supportedSourceTypes": [
  "android", "ios", "web", "unity", "amp", "cloud",
  "reactnative", "flutter", "cordova", "shopify"
]
```

**Note**: `warehouse` is not included in supported source types, confirming no RETL support.

## Documentation References

- [MoEngage Bulk Import API](https://developers.moengage.com/hc/en-us/articles/4413174113044-Bulk-Import)
- [MoEngage S3 Data Import](https://developers.moengage.com/hc/en-us/articles/4577796892308-S3-Data-Import)
- [MoEngage Data APIs Overview](https://developers.moengage.com/hc/en-us/articles/4404674776724-Overview)
- [RudderStack Event Stream Documentation](https://rudderstack.com/docs/destinations/streaming-destinations/)
