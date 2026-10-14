# Integration Documentation Guide

You are documenting one integration with access to RudderStack's repositories and the web. For
every section, decide whether you have enough evidence to be accurate; if not, leave it blank with
a `NEEDS REVIEW` note. Combine with the
[previous guide](https://github.com/rudderlabs/rs-ai/blob/main/memory-banks/rudder-transformer/15_integration_specific_docs.md).
Examples: `braze` and `am` in `src/v0/destinations/`.

Files go in the integration's folder: `README.md` (primary, links the rest), `docs/retl.md`,
`docs/businesslogic.md`.

## README.md (event-stream focus)

### Integration Functionalities

- **Destination config** — fields from integrations-config `schema.json`, only those the code reads
  via `destination.Config`, with what each does.
- **Implementation** — CDK v2 (`src/cdk/`, or `config.cdkV2Enabled == true` in `db-config.json`) vs
  JS/TS (`src/v0|v1/destinations/`).
- **Supported message types** — `supportedMessageTypes` in `db-config.json`, cross-checked against code.
- **Batching** — which message types, batch sizes (code).
- **Intermediate calls** — per event-type flow: endpoint and why it's needed (feeds business logic).
- **Proxy delivery** — `transformerProxy` capability in `src/features.ts` (batching destinations
  have it by default). Response handling lives in a `networkHandler.{js,ts}` (under
  `src/v0|v1/destinations/<dest>/`) or, for batching destinations, a `delivery.ts`. If
  `rudder-devops` is in context, `global.serverConfigOverride.Router.<DESTINATION>.transformerProxy`
  may override it. Give the source path.
  - **Partial-batch response handling** — whether the handler/`delivery.ts` returns per-job
    verdicts (available only on v1 proxy).
- **User deletion** — `deleteUsers.{js,ts}` in the destination folder; give the path.
- **OAuth** — `config.auth.type == OAuth` in `db-config.json`.
- **Processor vs router** — `config.transformAtV1` in `db-config.json`.
- **Additional functionality** — e.g. dedupe in braze; from code plus `schema.json`/`ui-config.json`.
- **Validations** — restrictions and required fields per event type (code).
- **Rate limits** — partner docs (web).

### General Queries

- **Event ordering** — decide per event type and flow. Profile-updating events (identify, alias,
  subscriptions) need ordering or stale data overwrites newer; timestamped track events are more
  flexible. Consider batching, dedup and missing timestamps. Support with partner docs (web).
- **Data replay** — *missing data*: feasible for event types that don't need ordering, with
  exceptions. *Already-delivered data*: only if the partner upserts track events on a unique id
  (rare) — verify on the web.
- **Rate limits and batch sizes** — per endpoint used in code (web), plus partner batch limits vs
  those implemented in code.
- **Multiplexing** — one input producing multiple outputs (e.g. track + identify); which event
  types/flows, and the reason for any intermediate call.

### Version Deprecation

- Current API version (from `config.js`, endpoint patterns, other clues), its EOL or deprecation
  timeline (or that none is planned).
- Newer versions available and breaking changes per changelog.
- Keep every reference link.

### Links and FAQ

- **RETL** → `docs/retl.md`; **Business logic** → `docs/businesslogic.md`.
- **FAQ** — empty initially; later filled with answers that required research beyond the docs.

## docs/retl.md

- **Supported?** Not if `db-config.json > supportedSourceTypes` lacks `warehouse`.
- If supported, which types (can be several):
  - **JSON Mapper** — default unless `disableJsonMapper: true`.
  - **VDM V1** — `supportsVisualMapper: true`.
  - **VDM V2** — VDM supported *and* `supportedMessageTypes` includes `record` *and* the code
    handles `record`.
- **Connection config.**
- **RETL flow** — logic under `mappedToDestination === true` or `record` handling.

## docs/businesslogic.md

- Field mappings (source → destination tables).
- Flow per event type: endpoints, request sequence, transformations and special handling.
- Validations: required fields, types, formats.
- Example payloads (input → output) and error handling.
- General use cases for the ingested data.
