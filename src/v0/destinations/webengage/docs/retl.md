# WebEngage RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## RETL Support Analysis

- **JSON Mapper**: Supported (no `disableJsonMapper`). Warehouse rows arrive as regular `identify` or
  `track` events and use the event stream mappings.
- **VDM v1**: Not supported (`supportsVisualMapper` not set).
- **VDM v2**: Not supported (no `record` message type).
- **Connection config**: None.

The code has no `mappedToDestination` handling.
