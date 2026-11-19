# Movable Ink RETL Functionality

## Is RETL supported?

**Yes.** `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Supported RETL types

| Type        | Supported | Evidence                                                       |
| ----------- | --------- | -------------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper` is not set                                 |
| VDM V1      | No        | `supportsVisualMapper` is not set                              |
| VDM V2      | No        | `record` is not in `supportedMessageTypes`; no record handling |

## Connection config

None. No connection-level config exists for this destination.

## RETL flow

There is no `mappedToDestination` or `record` handling. Warehouse rows reach the destination as regular `identify` or `track` events (via JSON Mapper) and follow the same flow, validations and batching as event stream. See [businesslogic.md](businesslogic.md).
