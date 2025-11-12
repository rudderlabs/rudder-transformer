# Split.io RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes**

The Split.io destination supports RETL functionality. Evidence:

- `supportedSourceTypes` includes `warehouse` which indicates RETL support
- JSON mapper is supported by default (no `disableJsonMapper: true` in config)
- Supports data flow from warehouses/databases to Split.io

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

Standard Split.io configuration applies:

- **API Key**: Same API key used for event stream functionality
- **Environment**: Split.io environment identifier

## RETL Flow Implementation

### Warehouse Integration

Split.io supports RETL through warehouse sources with JSON mapper functionality:

- **Supported**: Yes, warehouse sources can send data to Split.io via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Group, identify, page, screen, and track events
- **Data Flow**: Warehouse/Database → RudderStack → Split.io (via Events API)
- **Mapping**: JSON mapper transforms warehouse data to Split.io event format

### Supported Message Types for RETL

```json
"supportedMessageTypes": {
  "cloud": ["group", "identify", "page", "screen", "track"]
}
```

### RETL Event Processing

The Split.io destination processes RETL events through the same logic as event stream, supporting all standard event types.

## Data Flow

### RETL Data Processing

1. **Data Extraction**: Warehouse/database data extracted by RudderStack
2. **JSON Mapping**: Data transformed using JSON mapper configuration
3. **Event Construction**: Warehouse records converted to Split.io events
4. **API Delivery**: Events sent to Split.io via Events API

### Example RETL Event

```javascript
// Warehouse record transformed to Split.io track event
{
  "type": "track",
  "event": "feature_used",
  "properties": {
    "feature_name": "advanced_analytics",
    "user_plan": "premium"
  },
  "context": {
    "traits": {
      "email": "user@example.com"
    }
  }
}
```

## Rate Limits and Constraints

### Split.io API Limits

- **Events API**: Rate limits vary by plan (check Split.io documentation)
- **Event Batch Size**: Standard batching applies
- **Event Properties**: Standard Split.io event parameters

### RETL Processing Constraints

- **Message Types**: Supports all standard event types (group, identify, page, screen, track)
- **JSON Mapper Only**: No visual mapper or VDM v2 support
- **Cloud Mode Only**: Device mode not supported for RETL

## Summary

The Split.io destination supports RETL functionality through:

- **RETL Support**: Yes, via warehouse source type support
- **JSON Mapper**: Supported by default for data transformation
- **VDM v1**: Not supported (no `supportsVisualMapper`)
- **VDM v2**: Not supported (no `record` message type)
- **Supported Events**: All standard event types (group, identify, page, screen, track)
- **API Integration**: Split.io Events API for event delivery

**Limitations**:

- No VDM v1 or VDM v2 support (JSON mapper only)
- Cloud mode only for RETL functionality

## Documentation References

- [Split.io Events API](https://docs.split.io/reference/events-overview)
- [Split.io Bulk Events API](https://docs.split.io/reference/create-events)
- [RudderStack RETL Documentation](https://rudderstack.com/docs/reverse-etl/)
