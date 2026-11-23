# Attribution RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes`.

## RETL Support Analysis

### Which type of retl support does it have?

- **JSON Mapper**: supported (`disableJsonMapper` not set).
- **VDM V1**: not supported (`supportsVisualMapper` not set).
- **VDM V2**: not supported (no `record`).

### Connection config

None.

## RETL Flow

No RETL-specific logic. Warehouse events are forwarded like any other event.
