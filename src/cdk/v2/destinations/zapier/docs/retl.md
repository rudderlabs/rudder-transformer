# Zapier RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes`.

## RETL Support Analysis

### Which type of retl support does it have?

- **JSON Mapper**: supported (`disableJsonMapper` not set).
- **VDM V1**: not supported.
- **VDM V2**: not supported (no `record`).

### Connection config

None.

## RETL Flow

No RETL-specific logic. Warehouse rows sent as `track`/`page`/`screen` are posted to the Zap URLs like any other event.
