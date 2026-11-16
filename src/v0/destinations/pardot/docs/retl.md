# Pardot RETL Functionality

## Is RETL supported?

**Yes.** `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Type of RETL support

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type).

## Connection config

None.

## RETL flow

No RETL-specific logic (no `mappedToDestination` handling). Warehouse rows must arrive as identify events with `email` or a `context.externalId` entry of type `pardotId` or `crmfid`, and follow the event stream flow in [businesslogic.md](businesslogic.md). Each row is one API call, so large syncs count heavily against the daily limit (25,000 to 100,000 calls) and the 5-concurrent-request limit.
