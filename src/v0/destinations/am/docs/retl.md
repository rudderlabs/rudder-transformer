# Amplitude RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Not Supported**

The Amplitude destination does not support RETL functionality. Evidence:

- `supportedSourceTypes` does not include `warehouse`
- No warehouse source type support in configuration
- RETL requires warehouse source type support

## RETL Support Analysis

Since RETL is not supported (no warehouse source type), the following analysis applies:

### Which type of retl support does it have?

- **JSON Mapper**: Not applicable (no RETL support)
- **VDM V1**: Supported (`supportsVisualMapper: true` in `db-config.json`) - but only for event stream
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`)

### Does it have vdm support?

**Yes** - `supportsVisualMapper: true` is present in `db-config.json`, confirming VDM V1 support for event stream functionality.

### Does it have vdm v2 support?

**No** - Missing both:

- `supportedMessageTypes > record` in `db-config.json`
- Record event type handling in transformer code

### Connection config

Not applicable as RETL is not supported.

## Alternative Approaches for Warehouse Data

Since RETL is not supported, consider these alternatives for warehouse-based data activation:

### 1. Event Stream from Warehouse Sources

Use RudderStack's warehouse sources to send standard events:

```javascript
// Example: Sending user profile updates from warehouse
{
  "type": "identify",
  "userId": "user123",
  "traits": {
    "email": "user@example.com",
    "plan": "premium"
  }
}
```

### 2. VDM v1 (Visual Data Mapper)

Since Amplitude supports VDM v1 (`supportsVisualMapper: true`), you can:

- Use the visual mapper interface for data transformation
- Map warehouse data fields to Amplitude properties
- Configure user property operations ($set, $setOnce, etc.)

### 3. Batch Processing

Implement batch processing of warehouse data to generate standard events:

- Transform warehouse records into identify/track events
- Send through standard event stream processing
- Leverage Amplitude's batching capabilities (up to 1000 events per batch)

## Technical Limitations

### Why RETL is Not Supported

1. **No Warehouse Source Support**: `supportedSourceTypes` does not include `warehouse`
2. **No Record Event Handling**: Missing `record` message type in `supportedMessageTypes`
3. **No mappedToDestination Logic**: Transformer code does not handle RETL-specific processing
4. **Event-Centric Model**: Amplitude focuses on event-based analytics rather than profile-based data updates

### Current Capabilities

- **VDM v1 Support**: Visual data mapper for field transformations
- **Standard Event Processing**: All standard message types (identify, track, page, screen, group, alias)
- **Batching**: Up to 1000 events per batch for efficient processing
- **Enhanced User Operations**: Support for $set, $setOnce, $add, $unset operations

## Summary

The Amplitude destination does not support RETL functionality. The destination:

- **Does not support RETL**: No warehouse source type support
- **Supports VDM v1**: `supportsVisualMapper: true` for visual data mapping (event stream only)
- **Does not support VDM v2**: No `record` message type in `supportedMessageTypes`
- **Standard Event Stream Only**: All events processed through standard event stream logic

**Note**: VDM v1 support is available for event stream functionality but not for RETL since warehouse source type is not supported.

For warehouse-based data activation, consider using other destinations that support RETL or implement custom solutions to transform warehouse data into standard events.
