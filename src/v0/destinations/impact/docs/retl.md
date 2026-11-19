# impact.com RETL Functionality

## Is RETL supported at all?

**Yes.** `warehouse` is in `supportedSourceTypes` and `supportedConnectionModes` in `db-config.json`.

## Which type of RETL support does it have?

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type and no `record` handling in code).

## Connection config

None specific to RETL. Warehouse sources use the same destination settings.

## RETL flow

There is no `mappedToDestination` or `record` logic. Rows mapped by the JSON Mapper are processed as normal events:

- Track rows whose `event` is in `installEventNames` / `actionEventNames` (or is `Order Completed`) become conversions and need an order ID and timestamp.
- Other rows go to PageLoad. Identify, page and screen rows need their enable flag turned on.

Warehouse syncs are a common way to send offline or back-office conversions; impact.com attribution windows still apply to late conversions.
