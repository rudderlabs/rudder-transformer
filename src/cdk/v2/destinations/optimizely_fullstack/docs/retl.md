# Optimizely Fullstack RETL Functionality

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

There is no `mappedToDestination` or `record` handling. Warehouse rows are sent as `identify`, `track`, `page` or `screen` events (JSON Mapper) and follow the event stream logic in [businesslogic.md](businesslogic.md). Identify rows need `integrations.optimizely_fullstack.variationId`, which is unlikely to be set from a warehouse row, so Track is the practical RETL use.
