# The Trade Desk Audience RETL Functionality

## Is RETL supported at all?

**Yes.** RETL is the only supported source: `supportedSourceTypes: ["warehouse"]`.

## RETL Support Analysis

### Which type of RETL support does it have?

- **JSON Mapper**: Not supported (`disableJsonMapper: true`).
- **VDM V1**: Supported (`supportsVisualMapper: true`, `isAudienceSupported: true`).
- **VDM V2 (record events)**: The destination only accepts `record` messages (`supportedMessageTypes.cloud: ["record"]`) and the workflow handles them. `supportsVisualMapperV2` is not set in `db-config.json`. NEEDS REVIEW on how the platform labels this (VDM v1 audience with record events).
- **Sync behaviour**: `mirror` only.

### VDM objects and fields

From rudder-integrations-info (`src/routes/the_trade_desk/`):

- **Object**: one object, the configured `audienceId` (segment name).
- **Fields**: `tdid`, `daid`, `uid2`, `uid2Token`, `euid`, `euidToken`, `idl`, `id5`, `netID`, `firstID` (all string, unique).
- **Create audience**: returns `{ name, id: name }`; no TTD call.

### Connection config

Not used by the transformer; all settings come from `destination.Config`.

## RETL Flow

- `record` with `action: insert` → items added to the segment with `TTLInMinutes = ttlInDays * 1440`.
- `record` with `action: delete` → items sent with `TTLInMinutes = 0` (removal).
- Any other `action` (for example `update`) fails per event. Mirror syncs send rows that left the audience as `delete`.

See [businesslogic.md](businesslogic.md) for payloads.
