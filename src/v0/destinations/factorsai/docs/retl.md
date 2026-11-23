# Factors AI RETL Functionality

## Is RETL supported?

**Yes.** `warehouse` is in `supportedSourceTypes` in `db-config.json`.

## Type of RETL support

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type, and the code does not handle `record`).

## Connection config

None. RETL uses the destination config (`factorsAIApiKey`).

## RETL flow

There is no RETL-specific logic (no `mappedToDestination` handling). Warehouse rows reach the transformer as identify, track, page or group events and follow the same flow as event stream. See [businesslogic.md](businesslogic.md).
