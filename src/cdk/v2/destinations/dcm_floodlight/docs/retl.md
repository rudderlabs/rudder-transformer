# DCM Floodlight RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Which type of RETL support does it have?

- **JSON Mapper**: supported (no `disableJsonMapper` in `db-config.json`).
- **VDM v1**: not supported (`supportsVisualMapper` is not set).
- **VDM v2**: not supported (`record` is not in `supportedMessageTypes`, and the workflow has no `record` handling).

## Connection config

None.

## RETL flow

Warehouse rows must arrive as `track` or `page` events with `context.device.advertisingId` and `context.userAgent` set, otherwise they are rejected. They follow the event stream logic in [businesslogic.md](businesslogic.md). There is no `mappedToDestination` handling.
