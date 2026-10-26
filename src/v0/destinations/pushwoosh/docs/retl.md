# Pushwoosh RETL Functionality

## Is RETL supported at all?

**RETL (Reverse ETL) Support**: **Supported (JSON Mapper / event-shaped warehouse rows only)**

- `supportedSourceTypes` in `db-config.json` includes `warehouse`, with `connectionMode` `cloud`.
- Warehouse rows reach the transformer as ordinary `identify` / `track` events and follow exactly the same logic as event-stream events (see [businesslogic.md](businesslogic.md)).

## RETL Support Analysis

### Which type of retl support does it have?

- **JSON Mapper**: Supported by default — `disableJsonMapper` is not set in `db-config.json`.
- **VDM V1**: Not supported — `supportsVisualMapper` is not set in `db-config.json`.
- **VDM V2**: Not supported — `record` is not in `supportedMessageTypes`, and the transformer rejects any message type other than `track` and `identify`.

### Does it have vdm support?

**No** — `supportsVisualMapper` is absent.

### Does it have vdm v2 support?

**No** — there is no `record` message type in the configuration and no record handling in `routerTransform.ts`.

### Connection config

None. The destination reads only `destination.Config.appCode` and `destination.Config.apiToken`; it does not use `connection.config`.

## RETL Flow

There is no `mappedToDestination` or `record` branch. A warehouse source must produce rows shaped as:

- `identify` with `userId` and `traits` → user-specific tags via setTags.
- `track` with `userId`, `event` and `properties` → Pushwoosh events via post-events.

The same validations apply: `userId` is required, `track` needs `event`, and an `identify` needs at least one non-excluded trait. **NEEDS REVIEW**: end-to-end RETL sync has not been exercised against a live warehouse source.
