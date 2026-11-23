# Facebook App Events RETL Functionality

## Is RETL supported at all?

**Yes.** `warehouse` is in `supportedSourceTypes` and `supportedConnectionModes` in `db-config.json`.

## Which type of RETL support does it have?

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type and no `record` handling in code).

## Connection config

None specific to RETL. Warehouse sources use the same `appID`.

## RETL flow

There is no `mappedToDestination` or `record` logic. Rows mapped by the JSON Mapper are processed as normal `track`, `screen` or `page` events. Each row still needs `context.device.type` set to `android` or an Apple device type, plus an advertising ID, anonymous ID or user traits, which makes this destination a poor fit for most warehouse data.
