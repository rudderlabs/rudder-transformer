# Customer.io RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Not Supported**

The Customer.io destination does not support RETL functionality. Evidence:

- `supportedSourceTypes` does not include `warehouse`
- No warehouse source type support in configuration
- RETL requires warehouse source type support

**Note**: Customer.io has a separate `customerio_audience` destination that supports RETL with VDM v2 for audience management.

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

### 1. Customer.io Audience Destination

Use the separate `customerio_audience` destination which supports RETL:

- **VDM v2 Support**: Supports record message types
- **Audience Management**: Designed for audience/segment management
- **Warehouse Integration**: Supports warehouse source types

### 2. Event Stream from Other Sources

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

### 3. Direct API Integration

Use Customer.io's APIs directly from your warehouse:

- **Track API**: For event tracking
- **App API**: For user profile management
- **Beta API**: For object and relationship management

## Standard Event Stream Processing

The Customer.io destination processes all events through the standard event stream logic:

### Supported Event Types

- **Identify**: User profile updates via Track API
- **Track**: Event tracking via Track API
- **Page**: Page view events (converted to track events)
- **Screen**: Screen view events (converted to track events)
- **Group**: Object management via Beta API
- **Alias**: User identity merging

### Group Events (Objects)

Group events in Customer.io are used for object management in event stream:

```javascript
const groupResponseBuilder = (message) => {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.OBJECT_EVENTS.name]);
  const rawPayload = {
    identifiers: {
      object_id: payload.object_id,
      object_type_id: payload.object_type_id,
    },
    type: 'object',
    action: payload.action && OBJECT_ACTIONS.includes(payload.action)
      ? payload.action
      : DEFAULT_OBJECT_ACTION,
    attributes: payload.attributes || {},
    cio_relationships: [],
  };
```

**Group Event Features**:

- **Object Management**: Creates and manages objects in Customer.io
- **Relationship Handling**: Establishes relationships between users and objects
- **Batch Processing**: Uses Customer.io's v2 batch API for efficient processing
- **Action Support**: Supports identify, delete, add_relationships, delete_relationships actions

### Connection Configuration

Standard Customer.io configuration parameters:

- **API Key**: Customer.io Track API key
- **Site ID**: Workspace identifier
- **Data Center**: US or EU region selection

## Summary

The Customer.io destination does not support RETL functionality. The destination:

- **Does not support RETL**: No warehouse source type support
- **Supports VDM v1**: `supportsVisualMapper: true` for visual data mapping (event stream only)
- **Does not support VDM v2**: No `record` message type in `supportedMessageTypes`
- **Standard Event Stream Only**: All events processed through standard event stream logic

**Note**: For RETL functionality, use the separate `customerio_audience` destination which supports VDM v2 and warehouse sources.

### Supported Source Types

```json
"supportedSourceTypes": [
  "android", "ios", "web", "unity", "amp", "cloud",
  "reactnative", "flutter", "cordova", "shopify"
]
```

**Note**: `warehouse` is not included in supported source types, confirming no RETL support.
