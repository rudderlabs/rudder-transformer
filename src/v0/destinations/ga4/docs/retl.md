# GA4 RETL Functionality

## RETL Support Status

**RETL (Real-time Extract, Transform, Load) Support**: **Not Supported**

**VDM v2 Support**: **No**

## Summary

The GA4 destination does not support RETL or VDM v2 functionality. Key evidence:

1. **Missing Record Message Type**: No `record` event type in `supportedMessageTypes` configuration
2. **No Record Event Handling**: Transformer only processes `track`, `page`, and `group` events
3. **No mappedToDestination Logic**: No RETL-specific processing logic implemented

## Current Supported Message Types
```json
"supportedMessageTypes": {
  "cloud": ["track", "group", "page"],
  "device": {
    "web": ["identify", "track", "page", "group"],
    "android": ["identify", "track", "screen"],
    "ios": ["identify", "track", "screen"]
  }
}
```

## Implementation Details

The transformer implementation (`transform.js`) only handles standard event types:

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
  default:
    throw new InstrumentationError(`Message type ${messageType} not supported`);
}
```

## Enabling RETL Support

To enable RETL functionality, the following would need to be implemented:

1. Add `record` to `supportedMessageTypes` in `db-config.json`
2. Implement record event handling in the transformer
3. Add `mappedToDestination` flag processing logic
4. Implement RETL-specific event transformation flows
