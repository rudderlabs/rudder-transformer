# New Relic RETL Functionality

## Is RETL supported?

**Yes**. `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Types of RETL support

- **JSON Mapper**: Supported (`disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (`record` is not in `supportedMessageTypes`).

## Connection config

None.

## RETL flow

There is no `mappedToDestination` or `record` handling. Warehouse rows must arrive as track events and go through the same workflow as event stream.
