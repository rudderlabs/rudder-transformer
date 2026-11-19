# Discord RETL Functionality

## Is RETL supported?

**Yes.** `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Type of RETL support

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type).

## Connection config

None.

## RETL flow

No RETL-specific logic. Warehouse rows arrive as identify or track events and are rendered into Discord messages like event stream data. Large syncs post one message per row, which can hit Discord's per-webhook rate limits.
