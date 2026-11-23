# Google Ads Enhanced Conversions RETL Functionality

## Is RETL supported at all?

**Yes.** `warehouse` is in `supportedSourceTypes` and `supportedConnectionModes` in `db-config.json`.

## Which type of RETL support does it have?

- **JSON Mapper**: Supported (default; `disableJsonMapper` is not set).
- **VDM V1**: Not supported (`supportsVisualMapper` is not set).
- **VDM V2**: Not supported (no `record` message type and no `record` handling in code).

## Connection config

None specific to RETL. Warehouse sources use the same OAuth account, customer ID and conversion list.

## RETL flow

There is no `mappedToDestination` or `record` logic. Rows mapped by the JSON Mapper are processed as normal `track` events. Each row needs:

- `event` set to a conversion name in `listOfConversions`
- `properties.orderId` (or `order_id`) matching the original web conversion
- For enhancements, at least one user identifier in `traits` / `context.traits`

Google only uses enhancements uploaded within 24 hours of the original conversion, so warehouse syncs must run at least daily for enhancements to count.
