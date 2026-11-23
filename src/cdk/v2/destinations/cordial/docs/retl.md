# Cordial RETL Functionality

## Is RETL supported at all?

**Yes.** `warehouse` is listed in `supportedSourceTypes` and `supportedConnectionModes` in `db-config.json`.

## Which type of RETL support does it have?

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (`record` is not in `supportedMessageTypes`, and the workflow has no `record` handling).

## Connection config

No RETL-specific connection config. Warehouse sources use the same destination settings (`apiKey`, `apiBaseUrl`).

## RETL flow

There is no `mappedToDestination` or `record` logic. RETL rows reach the destination as regular `identify` or `track` events (built by the JSON Mapper) and follow the same flow as event stream events:

- **Identify**: contact lookup, then create (`POST /v2/contacts`) or update (`PUT /v2/contacts/...`).
- **Track**: `POST /v2/contactactivities`.

Each row needs a `cordialContactId` external ID or an email in traits.
