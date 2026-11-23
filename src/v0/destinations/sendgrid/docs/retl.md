# SendGrid RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`.

## Type of RETL support

- **JSON Mapper**: Supported by default (`disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type, no `record` handling).

## Connection Config

None.

## RETL Flow

No `mappedToDestination` handling. Warehouse rows arrive as `identify` or `track` events and follow the event stream logic in [businesslogic.md](businesslogic.md). RETL `identify` syncs benefit from contact batching (up to 30,000 contacts per request).
