# ProfitWell RETL Functionality

## Is RETL supported?

Yes. `db-config.json` lists `warehouse` in `supportedSourceTypes` (cloud mode).

## RETL Support Types

| Type        | Supported | Evidence                                                      |
| ----------- | --------- | ------------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper` is not set.                               |
| VDM V1      | No        | `supportsVisualMapper` is not set.                            |
| VDM V2      | No        | No `record` in `supportedMessageTypes`; no `record` handling. |

## Connection Config

None specific to this destination.

## RETL Flow

Warehouse rows must be mapped to `identify` events with the traits listed in [businesslogic.md](businesslogic.md) (`subscriptionAlias`, `planId`, `planInterval`, `value`, and so on). They follow the event stream path, including the subscription-history lookup. There is no `mappedToDestination` handling.
