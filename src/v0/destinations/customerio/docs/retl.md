# Customer.io RETL Functionality

## Overview

Customer.io destination supports RETL (Real-time Extract, Transform, Load) functionality through specific handling of events that are mapped to the destination. RETL functionality is primarily used for warehouse-to-destination data synchronization.

## VDM v2 Support

- **Supported**: No
- **Evidence**: The `supportedMessageTypes` in `db-config.json` does not include "record" type
- **Record Type**: Not supported in the current implementation
- **Note**: Customer.io has a separate `customerio_audience` destination that supports VDM v2 with "record" type for audience management

## RETL Flow Handling

### Mapped to Destination Logic

The Customer.io destination implements RETL functionality through the `mappedToDestination` flag processing:

```javascript
// override userId with externalId in context(if present) and event is mapped to destination
const mappedToDestination = get(message, MappedToDestinationKey);
if (mappedToDestination) {
  addExternalIdToTraits(message);
  adduserIdFromExternalId(message);
}
```

When `mappedToDestination` is true, the destination:

1. **External ID Processing**: Adds external ID to traits for proper user identification
2. **User ID Override**: Uses external ID as the primary user identifier
3. **Enhanced Data Mapping**: Ensures warehouse data is properly mapped to Customer.io user profiles

### RETL-Specific Event Types

#### Group Events (Objects)

Group events are the primary RETL functionality in Customer.io, used for managing objects and relationships:

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

### RETL Configuration

#### Connection Configuration

RETL connections for Customer.io require:

- **API Key**: Same as regular Customer.io configuration
- **Site ID**: Workspace identifier
- **Data Center**: US or EU region selection

#### Supported Source Types

```json
"supportedSourceTypes": [
  "warehouse",
  "cloud"
]
```