# Google Ads Offline Conversions RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes**

The Google Ads Offline Conversions destination supports RETL functionality. Evidence:
- `supportedSourceTypes` includes `warehouse` which indicates RETL support
- JSON mapper is supported by default (no `disableJsonMapper: true` in config)
- Supports data flow from warehouses/databases to Google Ads

## RETL Support Analysis

### Which type of retl support does it have?
- **JSON Mapper**: Supported (default, no `disableJsonMapper: true`)
- **VDM V1**: Not supported (`supportsVisualMapper` not present in `db-config.json`)
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`)

### Does it have vdm support?
**No** - `supportsVisualMapper` is not present in `db-config.json`

### Does it have vdm v2 support?
**No** - Missing both:
- `supportedMessageTypes > record` in `db-config.json`
- Record event type handling in transformer code

### Connection config
Standard Google Ads Offline Conversions configuration applies:
- **Developer Token**: Google Ads API developer token
- **Customer ID**: Google Ads customer account ID
- **Conversion Action ID**: Specific conversion action identifier

## RETL Flow Implementation

### Warehouse Integration

Google Ads Offline Conversions supports RETL through warehouse sources with JSON mapper functionality:

- **Supported**: Yes, warehouse sources can send data to Google Ads via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Track events only
- **Data Flow**: Warehouse/Database → RudderStack → Google Ads (via Offline Conversions API)
- **Mapping**: JSON mapper transforms warehouse data to Google Ads conversion format

### Supported Message Types for RETL
```json
"supportedMessageTypes": {
  "cloud": ["track"]
}
```

### RETL Event Processing

The Google Ads Offline Conversions destination processes RETL events through the same logic as event stream, supporting only track events for conversion uploads.

## Data Flow

### RETL Data Processing

1. **Data Extraction**: Warehouse/database data extracted by RudderStack
2. **JSON Mapping**: Data transformed using JSON mapper configuration
3. **Event Construction**: Warehouse records converted to Google Ads conversion events
4. **API Delivery**: Conversions sent to Google Ads via Offline Conversions API

### Example RETL Event

```javascript
// Warehouse record transformed to Google Ads conversion event
{
  "type": "track",
  "event": "Order Completed",
  "properties": {
    "order_id": "12345",
    "revenue": 99.99,
    "currency": "USD",
    "gclid": "abc123def456"
  },
  "context": {
    "traits": {
      "email": "user@example.com",
      "phone": "+1234567890"
    }
  }
}
```

## Rate Limits and Constraints

### Google Ads API Limits
- **Offline Conversions API**: Standard Google Ads API rate limits apply
- **Conversion Batch Size**: Up to 2000 conversions per request
- **Daily Upload Limits**: Varies by account type and history

### RETL Processing Constraints
- **Message Types**: Limited to track events only
- **JSON Mapper Only**: No visual mapper or VDM v2 support
- **Cloud Mode Only**: Device mode not supported for RETL
- **Conversion Requirements**: Must include valid conversion identifiers (GCLID, GBRAID, WBRAID, or user identifiers)

## Summary

The Google Ads Offline Conversions destination supports RETL functionality through:

- **RETL Support**: Yes, via warehouse source type support
- **JSON Mapper**: Supported by default for data transformation
- **VDM v1**: Not supported (no `supportsVisualMapper`)
- **VDM v2**: Not supported (no `record` message type)
- **Supported Events**: Track events only (for conversion uploads)
- **API Integration**: Google Ads Offline Conversions API for conversion delivery

**Limitations**:
- No VDM v1 or VDM v2 support (JSON mapper only)
- Limited to track events only
- Requires valid conversion identifiers for successful uploads
- Cloud mode only for RETL functionality
