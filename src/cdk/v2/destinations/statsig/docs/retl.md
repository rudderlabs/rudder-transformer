# Statsig RETL Functionality

## Is RETL supported?

**Yes**. `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Types of RETL support

- **JSON Mapper**: Supported (`disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (`record` is not in `supportedMessageTypes`).

## Connection config

None. The destination has no connection-level config.

## RETL flow

There is no `mappedToDestination` or `record` handling. Warehouse events arrive as standard identify/track/etc. events and are forwarded unchanged to the Statsig RudderStack webhook, the same as event stream.
