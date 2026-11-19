# CleverTap RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`, with connection mode `cloud`.

## Which type of RETL support does it have?

| Type        | Supported | Evidence                                                                          |
| ----------- | --------- | --------------------------------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper` is not set, so JSON Mapper is enabled by default              |
| VDM V1      | No        | `supportsVisualMapper` is not set in `db-config.json`                             |
| VDM V2      | No        | `record` is not in `supportedMessageTypes`, and the code has no `record` handling |

## Connection Config

No RETL-specific connection config. Warehouse sources use the same destination config as event stream.

## RETL Flow

The transformer has no `mappedToDestination` or `record` logic. RETL events arrive as `identify`, `track`, `page`, `screen` or `alias` events (built by the JSON Mapper) and follow the event stream flow in [businesslogic.md](businesslogic.md). Events are batched up to 1000 records per `/1/upload` request.
