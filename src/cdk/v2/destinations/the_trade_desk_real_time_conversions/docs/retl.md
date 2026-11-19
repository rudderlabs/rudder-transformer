# The Trade Desk Real Time Conversions RETL Functionality

## Is RETL supported?

**Yes, as event stream from warehouse sources.** `supportedSourceTypes` includes `warehouse`.

## Supported RETL types

- **JSON Mapper**: Supported (default; `disableJsonMapper` not set).
- **VDM V1**: Not supported (`supportsVisualMapper` not set).
- **VDM V2**: Not supported (no `record` message type).

## Connection config

None.

## RETL flow

- No `mappedToDestination` or `record` handling. Warehouse rows must arrive as `track` events with an `event` name; they follow the same mapping as event stream.
- Rows for ecommerce events need `properties.products` or `properties.price` shaped as in [businesslogic.md](businesslogic.md).
