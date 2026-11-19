# Appcues RETL Functionality

## Is RETL supported?

**Yes**. `warehouse` is in `supportedSourceTypes` (cloud mode).

## Type of RETL support

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (`record` is not in `supportedMessageTypes`; the code has no `record` handling).

## Connection config

None specific to RETL. The same `accountId` is used.

## RETL flow

Warehouse rows reach the transformer as ordinary identify/track/page/screen events and follow the event stream logic in [businesslogic.md](businesslogic.md). There is no `mappedToDestination` handling. Every row needs a `userId`.
