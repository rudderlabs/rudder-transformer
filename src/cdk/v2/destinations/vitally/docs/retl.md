# Vitally RETL Functionality

## Is RETL supported?

**Yes**. `warehouse` is in `supportedSourceTypes` (cloud mode).

## Type of RETL support

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`; no `record` handling).

## Connection config

None specific to RETL.

## RETL flow

Warehouse rows arrive as identify/track/group messages and are forwarded unchanged, like event stream messages ([businesslogic.md](businesslogic.md)).
