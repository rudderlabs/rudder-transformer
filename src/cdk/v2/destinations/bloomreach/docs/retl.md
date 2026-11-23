# Bloomreach RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`, with connection mode `cloud`.

## Which type of RETL support does it have?

| Type        | Supported | Evidence                                                                              |
| ----------- | --------- | ------------------------------------------------------------------------------------- |
| JSON Mapper | Yes       | `disableJsonMapper: false` in `db-config.json`                                        |
| VDM V1      | No        | `supportsVisualMapper: false` in `db-config.json`                                     |
| VDM V2      | No        | `record` is not in `supportedMessageTypes`, and the workflow has no `record` handling |

## Connection Config

No RETL-specific connection config. Warehouse sources use the same destination config as event stream.

## RETL Flow

The workflow has no `mappedToDestination` or `record` logic. RETL rows arrive as `identify`, `track`, `page` or `screen` events (built by the JSON Mapper) and follow the event stream flow in [businesslogic.md](businesslogic.md).

Each row needs a `userId` or `anonymousId` and a timestamp, or it fails validation. Commands are sent in batches of up to 50.
