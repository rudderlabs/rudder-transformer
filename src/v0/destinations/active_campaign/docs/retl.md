# ActiveCampaign RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`, with connection mode `cloud`.

## Which type of RETL support does it have?

| Type        | Supported | Evidence                                                                          |
| ----------- | --------- | --------------------------------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper` is not set, so JSON Mapper is enabled by default              |
| VDM V1      | No        | `supportsVisualMapper` is not set in `db-config.json`                             |
| VDM V2      | No        | `record` is not in `supportedMessageTypes`, and the code has no `record` handling |

## Connection Config

No RETL-specific connection config. Warehouse sources use the same destination config as event stream (`apiUrl`, `apiKey`, `eventKey`, `actid`).

## RETL Flow

The transformer has no `mappedToDestination` or `record` logic. RETL events arrive as `identify`, `page`, `screen` or `track` events (built by the JSON Mapper) and follow the event stream flow in [businesslogic.md](businesslogic.md).

For warehouse syncs, identify is the most common use. Each identify event makes several API calls (contact sync, tags, lists, fields), so large syncs can reach ActiveCampaign's limit of 5 requests per second per account.
