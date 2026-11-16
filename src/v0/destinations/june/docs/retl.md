# June RETL Functionality

## Is RETL supported?

**Yes, as event stream from warehouse.** `supportedSourceTypes` includes `warehouse` (cloud mode).

## Supported RETL Types

| Type        | Supported | Evidence                                                               |
| ----------- | --------- | ---------------------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper` is not set in `db-config.json`                     |
| VDM V1      | No        | `supportsVisualMapper` is not set                                      |
| VDM V2      | No        | `record` is not in `supportedMessageTypes`; no record handling in code |

## Connection Config

None. The destination has no connection-level config.

## RETL Flow

Warehouse rows are delivered as regular `identify` / `track` / `page` / `group` events (JSON Mapper) and follow the same logic as event stream events (see [businesslogic.md](businesslogic.md)). There is no `mappedToDestination` handling in the transformer.
