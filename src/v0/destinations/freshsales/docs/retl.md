# Freshsales RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`.

## Type of RETL support

- **JSON Mapper**: Supported by default (`disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type, no `record` handling).

## Connection Config

None.

## RETL Flow

No `mappedToDestination` handling. Warehouse rows arrive as `identify`, `group` or `track` events and follow the event stream logic in [businesslogic.md](businesslogic.md). Large syncs should account for the 1,000 requests/hour account limit, which intermediate lookups also consume.
