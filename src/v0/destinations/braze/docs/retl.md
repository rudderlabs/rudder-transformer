# Braze RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Yes**

The Braze destination supports RETL functionality. Evidence:
- `supportedSourceTypes` includes `warehouse` which indicates RETL support
- JSON mapper is supported by default (no `disableJsonMapper: true` in config)
- `supportsVisualMapper: true` indicates VDM v1 support
- Transformer code implements `mappedToDestination` logic handling
- Supports data flow from warehouses/databases to Braze

## RETL Support Analysis

### Which type of retl support does it have?
- **JSON Mapper**: Supported (default, no `disableJsonMapper: true`)
- **VDM V1**: Supported (`supportsVisualMapper: true` in `db-config.json`)
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`)

### Does it have vdm support?
**Yes** - `supportsVisualMapper: true` is present in `db-config.json`, confirming VDM V1 support.

### Does it have vdm v2 support?
**No** - Missing both:
- `supportedMessageTypes > record` in `db-config.json`
- Record event type handling in transformer code

### Connection config
Standard Braze configuration applies:
- **App Identifier**: Braze app identifier
- **REST API Key**: Braze REST API key
- **Data Center**: Braze instance data center
- **Enable Subscription Group**: Optional subscription group settings

## RETL Flow Implementation

### Warehouse Integration

Braze supports RETL through warehouse sources with both JSON mapper and VDM v1 functionality:

- **Supported**: Yes, warehouse sources can send data to Braze via RETL
- **Connection Mode**: Cloud mode only
- **Message Types**: Group, identify, page, screen, track, and alias events
- **Data Flow**: Warehouse/Database → RudderStack → Braze (via REST API)
- **Mapping**: JSON mapper and VDM v1 transform warehouse data to Braze format

### Supported Message Types for RETL
```json
"supportedMessageTypes": {
  "cloud": ["group", "identify", "page", "screen", "track", "alias"]
}
```

### RETL Event Processing

The Braze destination implements special handling for events that come from RETL sources. These events are identified by the presence of the `context.mappedToDestination` flag.

#### Key RETL-Specific Behaviors

1. **User Attributes Handling**:
   - When an event is marked with `context.mappedToDestination = true`, the transformer passes user traits directly to Braze without applying the standard mapping logic
   - This allows RETL sources to provide pre-formatted attributes that match Braze's expected format

2. **External ID Handling in Identify Events**:
   - For Identify events from RETL sources, the code includes special logic to override the userId with an externalId from the context if present
   - This is implemented in the `adduserIdFromExternalId` function which is only called when `mappedToDestination` is true

```javascript
// RETL-specific logic for Identify events
case EventType.IDENTIFY: {
  category = ConfigCategory.IDENTIFY;
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    adduserIdFromExternalId(message);
  }
}
```

3. **User Attributes Object Creation**:
   - When processing user attributes, the code checks for the `MappedToDestinationKey` flag
   - If present, it returns the traits as-is without applying the standard mapping logic

```javascript
// RETL-specific logic for user attributes
function getUserAttributesObject(message, mappingJson, destination) {
  const traits = getFieldValueFromMessage(message, 'traits');

  // return the traits as-is if message is mapped to destination
  if (get(message, MappedToDestinationKey)) {
    return traits;
  }

  // ... standard event stream logic for non-RETL events
}
```

## Data Flow

### RETL Data Processing

1. **Data Extraction**: Warehouse/database data extracted by RudderStack
2. **Mapping**: Data transformed using JSON mapper or VDM v1 configuration
3. **Event Construction**: Warehouse records converted to Braze events
4. **RETL Processing**: Events marked with `mappedToDestination` flag receive special handling
5. **API Delivery**: Events sent to Braze via REST API endpoints

### Example RETL Event

```javascript
// Warehouse record transformed to Braze identify event
{
  "type": "identify",
  "userId": "user123",
  "traits": {
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "custom_attribute": "value"
  },
  "context": {
    "mappedToDestination": true,
    "externalId": [
      {
        "id": "external_user_123",
        "type": "brazeExternalId"
      }
    ]
  }
}
```

## Rate Limits and Constraints

### Braze API Limits
- **REST API**: Standard Braze API rate limits apply
- **Batch Size**: Varies by endpoint (e.g., 75 users per identify request)
- **Request Rate**: Varies by plan and endpoint

### RETL Processing Constraints
- **Message Types**: Supports all standard event types (group, identify, page, screen, track, alias)
- **JSON Mapper and VDM v1**: Both supported for data transformation
- **Cloud Mode Only**: Device mode not supported for RETL
- **Pre-formatted Data**: RETL events can bypass standard mapping when `mappedToDestination` is true

## Summary

The Braze destination supports RETL functionality through:

- **RETL Support**: Yes, via warehouse source type support
- **JSON Mapper**: Supported by default for data transformation
- **VDM v1**: Supported (`supportsVisualMapper: true`)
- **VDM v2**: Not supported (no `record` message type)
- **Supported Events**: All standard event types (group, identify, page, screen, track, alias)
- **API Integration**: Braze REST API for data delivery
- **Special RETL Logic**: `mappedToDestination` flag enables pre-formatted data handling

**Key Features**:
- Pre-formatted attribute handling for RETL events
- External ID override for identify events
- Bypass standard mapping logic when `mappedToDestination` is true
- Support for both JSON mapper and VDM v1 transformations

**Limitations**:
- No VDM v2 support (no record message type)
- Cloud mode only for RETL functionality
