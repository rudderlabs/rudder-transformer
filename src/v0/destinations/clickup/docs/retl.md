# ClickUp RETL Functionality

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

Warehouse rows must be mapped to `track` events. They follow the event stream path (task create per row). Re-syncing rows creates duplicate tasks, since there is no update path. There is no `mappedToDestination` handling.
