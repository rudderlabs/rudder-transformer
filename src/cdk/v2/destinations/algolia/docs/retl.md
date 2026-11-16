# Algolia RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`, with connection mode `cloud`.

## Which type of RETL support does it have?

| Type        | Supported | Evidence                                                                              |
| ----------- | --------- | ------------------------------------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper` is not set, so JSON Mapper is enabled by default                  |
| VDM V1      | No        | `supportsVisualMapper` is not set in `db-config.json`                                 |
| VDM V2      | No        | `record` is not in `supportedMessageTypes`, and the workflow has no `record` handling |

## Connection Config

No RETL-specific connection config. Warehouse sources use the same destination config as event stream (`apiKey`, `applicationId`, `eventTypeSettings`).

## RETL Flow

The workflow has no `mappedToDestination` or `record` logic. RETL rows must be mapped to `track` events (with `properties.index` and an event type) and follow the event stream flow in [businesslogic.md](businesslogic.md).

Rows with a `properties.timestamp` older than 4 days lose the timestamp and are recorded at receipt time.
