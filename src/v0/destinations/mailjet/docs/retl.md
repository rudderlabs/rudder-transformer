# Mailjet RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## RETL Support Analysis

- **JSON Mapper**: Supported (no `disableJsonMapper`). Rows arrive as `identify` events and use the event
  stream logic, including batching by list and action.
- **VDM v1**: Not supported (`supportsVisualMapper` not set).
- **VDM v2**: Not supported (no `record` message type).
- **Connection config**: None.

The code has no `mappedToDestination` handling.
