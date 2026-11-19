# Courier RETL Functionality

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

Warehouse rows reach the transformer as `identify` or `track` events built by the JSON Mapper. They follow the same path as event stream events (see [businesslogic.md](businesslogic.md)). There is no `mappedToDestination` handling.
