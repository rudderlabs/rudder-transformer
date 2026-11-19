# Gainsight PX RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes`.

## RETL Support Analysis

### Which type of retl support does it have?

- **JSON Mapper**: supported (`disableJsonMapper` not set).
- **VDM V1**: not supported (`supportsVisualMapper` not set).
- **VDM V2**: not supported (no `record` type, no `record` handling).

### Connection config

None.

## RETL Flow

Warehouse events go through the event-stream code path (`identify`, `track`, `group`); there is no `mappedToDestination` handling. `dataCenter` is configurable for warehouse sources.
