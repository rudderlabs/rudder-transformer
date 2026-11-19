# Gainsight RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`, and `supportedConnectionModes.warehouse` is `["cloud"]`.

## Type of RETL support

- **JSON Mapper**: Supported by default (`disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (`record` is not in `supportedMessageTypes`; no `record` handling in code).

No VDM config for Gainsight exists in `rudder-integrations-info`.

## Connection Config

None. Gainsight has no connection-level config.

## RETL Flow

There is no `mappedToDestination` handling. Warehouse rows reach the transformer as ordinary `identify`, `group` or `track` events (from the JSON mapper) and follow the event stream logic in [businesslogic.md](businesslogic.md). The same validations apply (email for identify, `traits.name` and `context.traits.email` for group, mapped event names for track).
