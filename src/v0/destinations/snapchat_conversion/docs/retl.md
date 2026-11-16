# Snapchat Conversion RETL Functionality

## Is RETL supported?

**Yes**: `warehouse` is in `supportedSourceTypes` with `cloud` connection mode.

## Support Types

- **JSON Mapper**: Yes (`disableJsonMapper` not set).
- **VDM v1**: No (`supportsVisualMapper` not set).
- **VDM v2**: No (`record` not in `supportedMessageTypes`).

## Connection Config

None.

## RETL Flow

No `mappedToDestination` or `record` handling. Warehouse rows must arrive as `track` / `page` events and follow the event-stream flow in [businesslogic.md](businesslogic.md). Warehouse events usually have a non-web channel, so they are sent as `OFFLINE` unless `properties.eventConversionType` is set, and v3 rejects events older than 7 days, which limits backfills.
