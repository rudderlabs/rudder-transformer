# Woopra RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Which type of RETL support does it have?

- **JSON Mapper**: supported (no `disableJsonMapper` in `db-config.json`).
- **VDM v1**: not supported (`supportsVisualMapper` is not set).
- **VDM v2**: not supported (`record` is not in `supportedMessageTypes`, and the code has no `record` handling).

## Connection config

None. The destination has no connection-level config.

## RETL flow

Warehouse rows arrive as `identify`, `track` or `page` events (JSON Mapper) and follow the same logic as event stream. There is no `mappedToDestination` handling in the code, so traits are mapped exactly as for event stream (see [businesslogic.md](businesslogic.md)).
