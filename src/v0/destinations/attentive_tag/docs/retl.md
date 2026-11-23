# Attentive Tag RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`, with connection mode `cloud`.

## Which type of RETL support does it have?

| Type        | Supported | Evidence                                                                          |
| ----------- | --------- | --------------------------------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper` is not set, so JSON Mapper is enabled by default              |
| VDM V1      | No        | `supportsVisualMapper` is not set in `db-config.json`                             |
| VDM V2      | No        | `record` is not in `supportedMessageTypes`, and the code has no `record` handling |

## Connection Config

No RETL-specific connection config. Warehouse sources use the same destination config as event stream (`apiKey`, `signUpSourceId`, `enableNewIdentifyFlow`).

## RETL Flow

The transformer has no `mappedToDestination` or `record` logic. RETL events arrive as `identify` or `track` events (built by the JSON Mapper) and follow the event stream flow in [businesslogic.md](businesslogic.md).

Points to watch for warehouse syncs:

- Track events (other than `subscription_event`) must have a timestamp within the last 12 hours, so historical rows sent as track events are rejected.
- Identify with the legacy flow subscribes every synced user. Use the new identify flow (`enableNewIdentifyFlow`) to update attributes without subscribing.
