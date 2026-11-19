# Google Sheets RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` includes `warehouse` in `db-config.json`.

## Supported RETL types

- **JSON Mapper**: Supported (default; `disableJsonMapper` not set).
- **VDM V1**: Not supported (`supportsVisualMapper` not set).
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`; no record handling in code).

## Connection config

None. Destination config only.

## RETL flow

- There is no `mappedToDestination` or `record` handling. Warehouse rows arrive as regular events (for example identify with traits or track with properties) and go through the same column mapping as event stream.
- `eventKeyMap.from` can point at trait or property names directly, because lookups fall back to `properties`, `traits` and `context.traits`.
- Rows are always appended; a re-sync appends duplicates.
