# Wunderkind RETL Functionality

## Is RETL supported at all?

**Yes, in configuration.** `warehouse` is listed in `supportedSourceTypes` in `db-config.json`, with `cloud` connection mode.

## RETL Support Analysis

### Which type of RETL support does it have?

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (`record` is not in `supportedMessageTypes`; no `record` handling in code).

### Connection config

None.

## RETL Flow

There is no `mappedToDestination` or `record` handling. Warehouse rows must be mapped into `track` events; the payload is useful only if the mapping also populates `integrations.Wunderkind.lambdaRootLevelProperties` and `extraEventProperties`, which the JSON Mapper would need to set. NEEDS REVIEW on whether any RETL use of this destination is practical.
