# LinkedIn Ads RETL Functionality

## Is RETL supported?

**Yes, as event stream from warehouse.** `supportedSourceTypes` includes `warehouse`.

## Supported RETL Types

| Type        | Supported | Evidence                                                    |
| ----------- | --------- | ----------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper` is not set                              |
| VDM V1      | No        | `supportsVisualMapper` is not set                           |
| VDM V2      | No        | `record` not in `supportedMessageTypes`; no record handling |

## Connection Config

None.

## RETL Flow

Warehouse rows must be delivered as `track` events and follow the event stream logic in [businesslogic.md](businesslogic.md). There is no `mappedToDestination` handling. Rows with a `timestamp` older than 90 days are rejected.
