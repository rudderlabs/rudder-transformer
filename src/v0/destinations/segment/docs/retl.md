# Segment RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`.

## Type of RETL support

- **JSON Mapper**: Supported by default (`disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type, no `record` handling).

## Connection Config

None.

## RETL Flow

No `mappedToDestination` handling. Warehouse rows arrive as regular events and follow the same logic as event stream (see [businesslogic.md](businesslogic.md)), including the same field loss for `group` and `alias`.
