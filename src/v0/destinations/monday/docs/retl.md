# monday.com RETL Functionality

## Is RETL supported?

**Yes.** `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Type of RETL support

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type).

## Connection config

None.

## RETL flow

No RETL-specific logic (no `mappedToDestination` handling). Warehouse rows must arrive as track events with an allowlisted `event` name, and their `properties` are mapped to columns as in event stream. Every row triggers a board lookup plus a `create_item` call, so large syncs use two API calls per row against monday's per-minute and daily limits. Re-syncing rows creates duplicate items.
