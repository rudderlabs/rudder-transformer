# Iterable RETL Functionality

## Is RETL supported at all?

**RETL (Real-time Extract, Transform, Load) Support**: **Partially Supported**

The legacy `iterable` destination supports event-stream and catalog-oriented RETL-v1 flows, but does not support VDM-v2 `record` audience list syncs.

For Audiences Next and VDM-v2 `record` list sync use cases, use the separate **`iterable_audience`** destination.

## Iterable Audience Destination

`iterable_audience` is a net-new audience destination dedicated to warehouse `record` events. It supports:

- `INSERT` / `UPDATE` mapped to `POST /api/lists/subscribe`
- `DELETE` mapped to `POST /api/lists/unsubscribe`
- project-type-aware identifier validation (`email_based`, `hybrid`, `userid_based`)
- batched list membership operations for static list sync

This split keeps existing `iterable` behavior unchanged while enabling VDM-next audience syncs.
