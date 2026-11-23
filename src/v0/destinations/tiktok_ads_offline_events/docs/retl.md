# TikTok Ads Offline Events RETL Functionality

## Is RETL supported?

**Yes, as event stream from warehouse sources.** `supportedSourceTypes` includes `warehouse`.

## Supported RETL types

- **JSON Mapper**: Supported (default; `disableJsonMapper` not set).
- **VDM V1**: Not supported (`supportsVisualMapper` not set).
- **VDM V2**: Not supported (no `record` message type).

## Connection config

None.

## RETL flow

- No `mappedToDestination` or `record` handling. Warehouse rows must be sent as `track` events with an `event` name, `properties.eventSetId` and a `timestamp`, and follow the same mapping as event stream.
- Typical use: nightly upload of offline orders from a warehouse table.
