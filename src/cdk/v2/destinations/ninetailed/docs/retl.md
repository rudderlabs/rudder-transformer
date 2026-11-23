# Ninetailed RETL Functionality

## Is RETL supported?

**Yes**: `warehouse` is in `supportedSourceTypes` with `cloud` connection mode.

## Support Types

- **JSON Mapper**: Yes (`disableJsonMapper` not set).
- **VDM v1**: No (`supportsVisualMapper` not set).
- **VDM v2**: No (`record` not in `supportedMessageTypes`).

## Connection Config

None.

## RETL Flow

No `mappedToDestination` or `record` handling exists. Warehouse rows must arrive as `track` or `identify` events with `anonymousId` and `messageId`, and then follow the event-stream flow in [businesslogic.md](businesslogic.md).
