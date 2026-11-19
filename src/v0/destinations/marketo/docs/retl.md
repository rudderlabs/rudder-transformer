# Marketo RETL Functionality

## Is RETL supported at all?

Yes. `warehouse` is in `supportedSourceTypes` of `db-config.json`.

## RETL Support Analysis

### Which type of retl support does it have?

- **JSON Mapper**: supported (`disableJsonMapper` not set).
- **VDM V1**: supported (`supportsVisualMapper: true`).
- **VDM V2**: not supported. `record` is not in `supportedMessageTypes` and the code has no `record` handling.

### VDM objects

`rudder-integrations-info` (`src/destConfigs/config/MARKETO.ts`) exposes only the `leads` object (event type `identify`). Field discovery calls `/rest/v1/leads/describe2.json` and `/rest/v1/customobjects.json` with a Bearer header. The transformer also handles custom objects (`MARKETO-{object}` external ID), but whether the VDM UI offers them is NEEDS REVIEW (`src/routes/marketo/index.ts` has a TODO for custom object support).

### Connection config

None. Only destination config is used.

## RETL Flow

Events with `context.mappedToDestination` set:

1. Lead ID comes from the RETL external ID (`MARKETO-{object}`).
2. External ID is copied into traits (`addExternalIdToTraits`).
3. Traits are sent as-is: `identifyConfig` mapping and `leadTraitMapping` are skipped.
4. `leads` object: `POST /rest/v1/leads.json` with `lookupField: "id"`. Other objects: `POST /rest/v1/customobjects/{object}.json` with `dedupeBy: "dedupeFields"`.

`track` from warehouse sources goes through the normal event-stream path.
