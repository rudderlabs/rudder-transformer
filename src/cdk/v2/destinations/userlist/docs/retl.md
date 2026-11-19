# Userlist RETL Functionality

## Is RETL supported?

**Yes.** `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Type of RETL support

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type).

## Connection config

None.

## RETL flow

No RETL-specific logic. Warehouse rows must arrive as identify, track or group events with a `userId`, and are forwarded as described in [businesslogic.md](businesslogic.md).
