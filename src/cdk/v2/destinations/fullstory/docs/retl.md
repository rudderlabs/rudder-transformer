# Fullstory RETL Functionality

## Is RETL supported at all?

**Yes.** `warehouse` is in `supportedSourceTypes` and `supportedConnectionModes` in `db-config.json`.

## Which type of RETL support does it have?

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type and no `record` handling in the workflow).

## Connection config

None specific to RETL. Warehouse sources use the same `apiKey`.

## RETL flow

There is no `mappedToDestination` or `record` logic. Rows mapped by the JSON Mapper are sent as normal `identify` (`POST /v2/users`) or `track` (`POST /v2/events`) events. For identify, set `userId` so the user is upserted by `uid`; `email` and `display_name` are read only from `context.traits`.
