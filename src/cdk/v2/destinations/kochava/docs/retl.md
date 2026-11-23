# Kochava RETL Functionality

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

No RETL-specific logic. Warehouse rows must look like mobile `track`/`screen` events, including `context.os.name` and device IDs, for Kochava to attribute them.
