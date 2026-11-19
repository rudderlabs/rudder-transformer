# Branch RETL Functionality

## Is RETL supported?

**Yes** in configuration: `warehouse` is in `supportedSourceTypes` (cloud mode).

## Type of RETL support

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` in `supportedMessageTypes`; no `record` handling in code).

## Connection config

None specific to RETL.

## RETL flow

Warehouse rows arrive as track/identify events and follow [businesslogic.md](businesslogic.md). There is no `mappedToDestination` handling.

Branch says events must be sent in real time and historical events are not backfilled into reports, so warehouse syncs of past conversions have limited value. **NEEDS REVIEW**.
