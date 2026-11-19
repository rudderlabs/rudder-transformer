# Adobe Analytics RETL Functionality

## Is RETL supported?

**Yes**: `warehouse` is in `supportedSourceTypes` with `cloud` connection mode.

## Support Types

- **JSON Mapper**: Yes (`disableJsonMapper` not set).
- **VDM v1**: No (`supportsVisualMapper` not set).
- **VDM v2**: No (`record` not in `supportedMessageTypes`).

## Connection Config

None.

## RETL Flow

No `mappedToDestination` or `record` handling. Warehouse rows must arrive as `track` / `page` / `screen` events and follow the event-stream flow in [businesslogic.md](businesslogic.md). Historical rows are only placed at their original time if the report suite is timestamp-enabled and the destination sends `timestamp`.
