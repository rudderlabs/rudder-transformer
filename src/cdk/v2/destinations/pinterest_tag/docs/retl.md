# Pinterest Tag RETL Functionality

## Is RETL supported?

**Yes.** `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Supported RETL types

| Type        | Supported | Evidence                                                       |
| ----------- | --------- | -------------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper` is not set                                 |
| VDM V1      | No        | `supportsVisualMapper` is not set                              |
| VDM V2      | No        | `record` is not in `supportedMessageTypes`; no record handling |

## Connection config

None.

## RETL flow

There is no `mappedToDestination` or `record` handling. Warehouse rows are sent as `track`, `page` or `screen` events (JSON Mapper) and follow the event stream logic in [businesslogic.md](businesslogic.md). Rows must provide a valid `action_source` (a warehouse source has no `web`/mobile `channel` to fall back on) and the required user data.

The procWorkflow's first step (`checkIfProcessed`) passes through messages that already carry a `statusCode` (already-built responses) unchanged.
