# Pipedream RETL Functionality

## Is RETL supported?

**Yes.** `supportedSourceTypes` in `db-config.json` includes `warehouse`.

## Type of RETL support

- **JSON Mapper**: Supported by default (`disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` handling).

## Connection Config

None.

## RETL Flow

No `mappedToDestination` handling. Warehouse rows are forwarded as-is to the Pipedream URL, the same as event stream (see [businesslogic.md](businesslogic.md)). High-volume syncs can hit Pipedream's ~10 requests/second HTTP trigger limit.
