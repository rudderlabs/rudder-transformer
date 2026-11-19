# Userpilot RETL Functionality

## Is RETL supported at all?

No. `supportedSourceTypes` in `db-config.json` is `["web", "cloud"]`, with no `warehouse`.

## RETL Support Analysis

- **JSON Mapper**: Not applicable
- **VDM v1** (`supportsVisualMapper`): Not set
- **VDM v2** (`record` message type): Not supported
- **Connection config**: None

The workflow has no `mappedToDestination` or `record` handling.
