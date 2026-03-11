# Singular RETL Functionality

## Is RETL Supported?

**RETL (Reverse ETL) Support**: **Yes**

The Singular destination supports RETL functionality. Evidence:

- `supportedSourceTypes` includes `warehouse` in `db-config.json`
- JSON mapper is supported by default (no `disableJsonMapper: true` in config)
- Does NOT have `supportsVisualMapper: true`, so VDM V1 is not supported
- Standard event processing applies to warehouse-sourced events

## RETL Support Analysis

### Which type of RETL support does it have?

- **JSON Mapper**: Supported (default, no `disableJsonMapper: true`)
- **VDM V1**: Not Supported (no `supportsVisualMapper: true` in `db-config.json`)
- **VDM V2**: Not Supported (no `record` in `supportedMessageTypes`)

### Does it have VDM support?

**No** - `supportsVisualMapper` is not present in `db-config.json`.

### Does it have VDM V2 support?

**No** - Missing both:

- `supportedMessageTypes > record` in `db-config.json`
- Record event type handling in transformer code

### Connection Configuration

Standard Singular configuration applies:

- **API Key**: Singular SDK Key (required)
- **API Secret**: Optional secret key
- **Session Event List**: Custom session events to track
- **Match ID**: Unity platform identifier mapping

## RETL Flow Implementation

### Warehouse Integration

Singular supports RETL through warehouse sources with JSON mapper functionality:

- **Supported**: Yes, warehouse sources can send data to Singular via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Track events only
- **Data Flow**: Warehouse/Database → RudderStack → Singular (via S2S REST API)
- **Mapping**: JSON mapper transforms warehouse data to Singular format

### Supported Message Types for RETL

```json
"supportedMessageTypes": {
  "cloud": ["track"],
  "warehouse": ["track"]
}
```

### RETL Event Processing

The Singular destination processes RETL events the same as standard cloud events. There is no special `mappedToDestination` handling in the Singular implementation.

#### Key RETL Behaviors

1. **Standard Processing**:

   - RETL events are processed through the same transformation pipeline as regular events
   - No special flags or overrides are implemented

2. **Event Type Support**:

   - Only `track` events are supported for RETL
   - Events must include all required fields for the target platform

3. **Session vs Event Determination**:
   - The `sessionEventList` configuration determines which events are treated as session events
   - Session events are sent to `/api/v1/launch`
   - Non-session events are sent to `/api/v1/evt` or `/api/v2/evt`

## Data Flow

### RETL Data Processing

1. **Data Extraction**: Warehouse/database data extracted by RudderStack
2. **Mapping**: Data transformed using JSON mapper configuration
3. **Event Construction**: Warehouse records converted to track events
4. **Standard Processing**: Events processed through Singular transformer
5. **API Delivery**: Events sent to Singular via S2S REST API

### Example RETL Event

```json
{
  "type": "track",
  "event": "Purchase Completed",
  "userId": "user123",
  "properties": {
    "revenue": 99.99,
    "currency": "USD",
    "product_id": "prod456"
  },
  "context": {
    "os": {
      "name": "Android",
      "version": "12"
    },
    "app": {
      "namespace": "com.example.app",
      "version": "1.0.0",
      "build": "100"
    },
    "device": {
      "advertisingId": "8ecd7512-2864-440c-93f3-a3cabe62525b",
      "id": "fc8d449516de0dfb"
    },
    "ip": "192.168.1.1",
    "locale": "en-US"
  }
}
```

## Summary

The Singular destination supports RETL functionality through:

- **RETL Support**: Yes, via warehouse source type support
- **JSON Mapper**: Supported by default for data transformation
- **VDM V1**: Not Supported
- **VDM V2**: Not Supported
- **Supported Events**: Track events only
- **API Integration**: Singular S2S REST API for data delivery
- **Special RETL Logic**: None - standard event processing

**Key Features**:

- Standard track event processing for warehouse data
- Platform-specific payload generation (Android, iOS, Unity)
- Session vs Event endpoint routing based on configuration
- Revenue tracking support with products array multiplexing

**Limitations**:

- No VDM V1/V2 support
- Track events only (no identify, group, etc.)
- Cloud mode only for RETL functionality
- No special `mappedToDestination` handling
- Requires all platform-specific required fields
