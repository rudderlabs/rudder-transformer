# GA4 RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes**

The GA4 destination supports RETL functionality. Evidence:
- `supportedSourceTypes` includes `warehouse` which indicates RETL support
- JSON mapper is supported by default (no `disableJsonMapper: true` in config)
- Supports data flow from warehouses/databases to GA4

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
Standard GA4 configuration applies:
- **Measurement ID**: Same measurement ID used for event stream functionality
- **API Secret**: Required for Measurement Protocol v4
- **Firebase App ID**: Optional, for enhanced measurement

## RETL Flow Implementation

### Warehouse Integration

GA4 supports RETL through warehouse sources with JSON mapper functionality:

- **Supported**: Yes, warehouse sources can send data to GA4 via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Track, page, and group events
- **Data Flow**: Warehouse/Database → RudderStack → GA4 (via Measurement Protocol v4)
- **Mapping**: JSON mapper transforms warehouse data to GA4 event format

### Supported Message Types for RETL
```json
"supportedMessageTypes": {
  "cloud": ["track", "group", "page"]
}
```

### RETL Event Processing

The GA4 destination processes RETL events through the same logic as event stream:

```javascript
switch (messageType) {
  case EventType.TRACK:
    response = responseBuilder(message, destination, destType);
    break;
  case EventType.PAGE:
    message.event = 'page_view';
    response = responseBuilder(message, destination, destType);
    break;
  case EventType.GROUP:
    message.event = 'join_group';
    response = responseBuilder(message, destination, destType);
    break;
}
```

## Data Flow

### RETL Data Processing

1. **Data Extraction**: Warehouse/database data extracted by RudderStack
2. **JSON Mapping**: Data transformed using JSON mapper configuration
3. **Event Construction**: Warehouse records converted to GA4 events (track/page/group)
4. **API Delivery**: Events sent to GA4 via Measurement Protocol v4

### Example RETL Event

```javascript
// Warehouse record transformed to GA4 track event
{
  "type": "track",
  "event": "purchase",
  "properties": {
    "transaction_id": "12345",
    "value": 99.99,
    "currency": "USD",
    "items": [...]
  },
  "context": {
    "traits": {
      "email": "user@example.com"
    }
  }
}
```

## Rate Limits and Constraints

### GA4 API Limits
- **Measurement Protocol v4**: 20 requests per second per measurement ID
- **Event Batch Size**: Up to 25 events per request
- **Event Properties**: Maximum 25 custom parameters per event
- **Event Name Length**: Maximum 40 characters

### RETL Processing Constraints
- **Message Types**: Limited to track, page, and group events
- **JSON Mapper Only**: No visual mapper or VDM v2 support
- **Cloud Mode Only**: Device mode not supported for RETL

## Summary

The GA4 destination supports RETL functionality through:

- **RETL Support**: Yes, via warehouse source type support
- **JSON Mapper**: Supported by default for data transformation
- **VDM v1**: Not supported (no `supportsVisualMapper`)
- **VDM v2**: Not supported (no `record` message type)
- **Supported Events**: Track, page, and group events only
- **API Integration**: Measurement Protocol v4 for event delivery

**Limitations**:
- No VDM v1 or VDM v2 support (JSON mapper only)
- Limited to track, page, and group events
- No identify, screen, or alias event support for RETL
