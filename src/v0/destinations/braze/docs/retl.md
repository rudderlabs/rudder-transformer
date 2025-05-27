# Braze RETL Functionality

## RETL-Specific Logic

The Braze destination implements special handling for events that come from RETL sources. These events are identified by the presence of the `context.mappedToDestination` flag (defined as `MappedToDestinationKey` in the codebase).

### Key RETL-Specific Behaviors

1. **User Attributes Handling**:

   - When an event is marked with `context.mappedToDestination = true`, the transformer passes user traits directly to Braze without applying the standard mapping logic
   - This allows RETL sources to provide pre-formatted attributes that match Braze's expected format

2. **External ID Handling in Identify Events**:
   - For Identify events from RETL sources, the code includes special logic to override the userId with an externalId from the context if present
   - This is implemented in the `adduserIdFromExternalId` function which is only called when `mappedToDestination` is true

```javascript
// From transform.js - RETL-specific logic for Identify events
case EventType.IDENTIFY: {
  category = ConfigCategory.IDENTIFY;
  // override userId with externalId in context(if present) and event is mapped to destination
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    adduserIdFromExternalId(message);
  }
  // ... rest of the identify processing
}
```

3. **User Attributes Object Creation**:
   - When processing user attributes, the code checks for the `MappedToDestinationKey` flag
   - If present, it returns the traits as-is without applying the standard mapping logic

```javascript
// From transform.js - RETL-specific logic for user attributes
function getUserAttributesObject(message, mappingJson, destination) {
  // blank output object
  const data = {};
  // get traits from message
  const traits = getFieldValueFromMessage(message, 'traits');

  // return the traits as-is if message is mapped to destination
  if (get(message, MappedToDestinationKey)) {
    return traits;
  }

  // ... standard event stream logic for non-RETL events
}
```

## VDM v2 Support

This destination doesn't support VDM v2. (No support for `record` event type)

## Connection Configuration

## Data Flow

### RETL Data Flow

1. RudderStack receives events from RETL sources with `context.mappedToDestination = true`
2. User traits are passed directly to Braze without standard mapping
3. For Identify events, userId may be overridden with externalId from context
4. The transformer sends the processed events to Braze via the appropriate endpoints
