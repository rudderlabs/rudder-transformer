# Amplitude RETL Functionality

## RETL Support Status

Based on the code analysis, the Amplitude destination does not have explicit RETL-specific logic like some other destinations (e.g., Braze). There is no specific handling for events marked with `context.mappedToDestination = true` flag or for the `record` event type.

## VDM v2 Support

This destination doesn't support VDM v2, as there is no support for the `record` event type in the `supportedMessageTypes` configuration. The `supportedMessageTypes` in the `db-config.json` file only includes the standard event types (identify, track, page, screen, group, alias) and does not include the `record` event type required for VDM v2 support.

## Connection Configuration

No special connection configuration is required for RETL with Amplitude. The standard destination configuration is used for all event types, including those that might come from RETL sources.

The standard configuration includes:
- API Key
- Data Center (US or EU)
- User property operation settings (traitsToIncrement, traitsToSetOnce, etc.)
- Other optional settings as described in the main README

## Data Flow

Since there is no explicit RETL support, data would flow through the standard event stream processing logic:

1. Events from RETL sources would be processed like regular events
2. Standard mapping logic would be applied to transform the events to Amplitude's format
3. The transformed events would be sent to Amplitude via the appropriate endpoints

### Standard Event Processing Flow

For all events, including those that might come from RETL sources:

1. The event is received by the destination
2. The event type is determined (identify, track, page, screen, group, alias)
3. The appropriate mapping configuration is applied based on the event type
4. The event is transformed to Amplitude's format
5. The transformed event is sent to the appropriate Amplitude endpoint

### Identify Events

Identify events from RETL sources would be processed like regular identify events:
- The event_type is set to `$identify`
- User traits are mapped to user_properties
- If Enhanced User Operations is enabled, user properties are processed with operations like $set, $setOnce, etc.

### Track Events

Track events from RETL sources would be processed like regular track events:
- The event name is used as the event_type
- Event properties are included as event_properties
- If the event has revenue, special revenue handling is applied

## Potential RETL Integration

If RETL support were to be added to the Amplitude destination, it would likely involve:

1. Adding support for the `record` event type in the `supportedMessageTypes` configuration
2. Implementing special handling for events marked with `context.mappedToDestination = true`
3. Allowing direct passing of pre-formatted attributes to Amplitude without applying standard mapping logic

### Implementation Considerations

To implement RETL support, the following changes would be needed:

1. **Add Record Event Type Support**:
   ```json
   "supportedMessageTypes": {
     "cloud": ["alias", "group", "identify", "page", "screen", "track", "record"]
   }
   ```

2. **Add RETL-Specific Logic**:
   ```javascript
   // Example implementation
   if (get(message, MappedToDestinationKey)) {
     // Skip standard mapping logic
     return message.traits; // Pass traits directly
   }
   ```

3. **Handle External ID Mapping**:
   ```javascript
   // Example implementation
   if (get(message, MappedToDestinationKey)) {
     const externalId = getDestinationExternalIDInfoForRetl(message, 'AMPLITUDE');
     if (externalId) {
       message.userId = externalId.id;
     }
   }
   ```

## Comparison with Other Destinations

Unlike destinations like Braze that have explicit RETL support with special handling for mapped events, the Amplitude destination processes all events through the standard event stream logic. This means that RETL sources would need to format their events according to the standard Amplitude event format expected by the destination.

### Braze RETL Support (for comparison)

Braze has explicit RETL support with the following features:
- Special handling for events marked with `context.mappedToDestination = true`
- Direct passing of pre-formatted attributes without applying standard mapping logic
- Special handling for external IDs in RETL events

```javascript
// Example from Braze
function getUserAttributesObject(message, mappingJson, destination) {
  // get traits from message
  const traits = getFieldValueFromMessage(message, 'traits');

  // return the traits as-is if message is mapped to destination
  if (get(message, MappedToDestinationKey)) {
    return traits;
  }

  // ... standard event stream logic for non-RETL events
}
```

## Conclusion

The Amplitude destination currently does not have explicit RETL support. All events, regardless of their source, are processed through the standard event stream logic. If RETL support is needed, it would require modifications to the destination code to add special handling for RETL events.

### Recommendations for RETL Usage

If you need to use RETL with Amplitude, consider the following approaches:

1. **Format RETL Events to Match Standard Format**:
   - Ensure that RETL events match the standard format expected by the Amplitude destination
   - Use the standard field mappings as described in the businesslogic.md document

2. **Request RETL Support Enhancement**:
   - Request that RETL support be added to the Amplitude destination
   - Provide specific use cases and requirements for RETL support

3. **Custom Implementation**:
   - If immediate RETL support is needed, consider implementing a custom version of the Amplitude destination with RETL support
   - Use the implementation considerations outlined above as a starting point
