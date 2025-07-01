# GA4 RETL Functionality

## RETL Support Status

**RETL (Real-time Extract, Transform, Load) Support**: **Not Supported**

## VDM v2 Support

**VDM v2 Support**: **No**

The GA4 destination does not support VDM v2 (Warehouse Destinations v2) functionality. This is evidenced by:

1. **Missing Record Message Type**: The `supportedMessageTypes` configuration does not include the `record` message type, which is required for VDM v2 support.

2. **Current Supported Message Types**:
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

3. **No Record Event Handling**: The transformer implementation (`transform.js`) only handles:
   - `track` events
   - `page` events (converted to `page_view`)
   - `group` events (converted to `join_group`)

   There is no logic to process `record` event types that are essential for VDM v2 support.

4. **No mappedToDestination Logic**: The codebase does not contain any logic to handle events marked with `context.mappedToDestination = true` flag, which is a key indicator of RETL-specific processing.

## Analysis

Based on the code analysis of the GA4 destination:

### Configuration Analysis
- The `db-config.json` file shows that GA4 only supports standard RudderStack event types
- No `record` event type is listed in the supported message types
- The destination is configured for standard event stream processing only

### Implementation Analysis
- The `transform.js` file contains a switch statement that only handles `track`, `page`, and `group` events
- No conditional logic exists to differentiate between RETL and standard event stream processing
- The `processEvents` function does not check for `mappedToDestination` flags

### Code Reference
```javascript
// From transform.js - only handles standard event types
switch (messageType) {
  case EventType.TRACK:
    response = responseBuilder(message, destination, destType);
    break;
  case EventType.PAGE:
    // GA4 custom event 'page_view' is fired for page
    if (!isHybridModeEnabled(Config)) {
      message.event = 'page_view';
      response = responseBuilder(message, destination, destType);
    } else {
      throw new UnsupportedEventError(
        'GA4 Hybrid mode is enabled, page calls will be sent through device mode',
      );
    }
    break;
  case EventType.GROUP:
    // GA4 standard event 'join_group' is fired for group
    message.event = 'join_group';
    response = responseBuilder(message, destination, destType);
    break;
  default:
    throw new InstrumentationError(`Message type ${messageType} not supported`);
}
```

## Conclusion

The GA4 destination is designed exclusively for standard event stream processing and does not support RETL functionality. To enable RETL support, the following would need to be implemented:

1. Add `record` to the `supportedMessageTypes` in `db-config.json`
2. Implement record event handling in the transformer
3. Add logic to differentiate between RETL and event stream flows
4. Handle `mappedToDestination` flag appropriately

Currently, all events sent to GA4 are processed through the standard event stream pipeline regardless of their source or intended processing flow.
