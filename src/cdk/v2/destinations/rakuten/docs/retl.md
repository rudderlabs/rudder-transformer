# Rakuten RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`.

## Type of RETL support

- **JSON Mapper**: Supported by default (`disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type, no `record` handling in the workflow).

## Connection Config

None.

## RETL Flow

No `mappedToDestination` handling. Warehouse rows must be shaped as `track` events with a `properties.products` array and go through the same workflow as event stream (see [businesslogic.md](businesslogic.md)).
