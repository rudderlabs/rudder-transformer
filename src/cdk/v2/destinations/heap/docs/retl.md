# Heap RETL Functionality

## Is RETL supported?

**Yes**. `warehouse` is in `supportedSourceTypes` (cloud mode).

## Type of RETL support

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`; no `record` handling).

## Connection config

None specific to RETL.

## RETL flow

Warehouse rows arrive as identify/track events and follow [businesslogic.md](businesslogic.md). Track rows keep their `timestamp`, so historical rows land at the original time.
