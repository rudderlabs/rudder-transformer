# Slack RETL Functionality

## Is RETL supported at all?

**Yes.** `warehouse` is listed in `supportedSourceTypes` in `db-config.json`, with `cloud` connection mode.

## RETL Support Analysis

### Which type of RETL support does it have?

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (`record` is not in `supportedMessageTypes`; no `record` handling in code).

### Connection config

None.

## RETL Flow

There is no `mappedToDestination` or `record` handling. Warehouse rows arrive as `identify` or `track` events built by the JSON Mapper and are rendered and posted exactly like event stream data (see [businesslogic.md](businesslogic.md)). Each synced row posts one Slack message, so large syncs are throttled by Slack's 1 message/second webhook limit.
