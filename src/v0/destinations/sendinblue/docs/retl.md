# Sendinblue (Brevo) RETL Functionality

## Is RETL supported at all?

**Yes.** `warehouse` is listed in `supportedSourceTypes` in `db-config.json`, with `cloud` connection mode.

## RETL Support Analysis

### Which type of RETL support does it have?

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (`record` is not in `supportedMessageTypes`; no `record` handling in code).

### Connection config

None. Only the destination config described in the README is used.

## RETL Flow

The transformer has no `mappedToDestination` or `record` handling. Warehouse rows arrive as regular `identify`, `track` or `page` events built by the JSON Mapper and follow exactly the same flow as event stream data (see [businesslogic.md](businesslogic.md)). Typical use: syncing warehouse user tables to Brevo contacts via identify, with list IDs set through `sendinblueIncludeListIds` / `sendinblueUnlinkListIds` external IDs.
