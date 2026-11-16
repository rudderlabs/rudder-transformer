# Koddi RETL Functionality

## Is RETL supported?

**Yes** in configuration: `warehouse` is in `supportedSourceTypes` (cloud mode).

## Type of RETL support

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (only `track` in `supportedMessageTypes`; no `record` handling).

## Connection config

None specific to RETL.

## RETL flow

Warehouse rows must arrive as track events with `integrations.koddi.eventType` set; otherwise they fail. They then follow [businesslogic.md](businesslogic.md). There is no `mappedToDestination` handling. **NEEDS REVIEW**: whether JSON Mapper can set `integrations.koddi.eventType`; if not, RETL is not usable in practice.
