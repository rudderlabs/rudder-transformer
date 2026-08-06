---
name: vdm-v2-object-destination
description: Create the transformation logic for a new VDM V2 object-based destination. Implements record dispatch by object type and action, with batching and optional event-stream support.
---

# VDM V2 Object Destination (rudder-transformer)

**Objective:** Build the transformation logic for a new VDM V2 object-based destination -- process warehouse record events into HTTP API requests that create, update, or delete objects (person, event, contact, etc.), with per-object-type dispatch, batching, and optional event-stream support.

## When to use

Use `VDMV2ObjectDestination` when the destination:

- Receives **record events** (insert/update/delete) targeting specific **object types** (person, event, contact, lead, etc.)
- Object type comes from **connection config** (`connection.config.destination.object`)
- Different object types may support **different actions** (e.g., person supports delete, event does not)
- May also support **event-stream events** (identify, track, page, etc.) alongside records

For audience destinations (add/remove users from segments), use the `vdm-next-audience-integration` skill instead.

## Reference

Read these files before implementing:

- **Framework source** -- `src/services/destination/nativeBatching/vdmV2ObjectDestination.ts` -- `VDMV2ObjectDestination` abstract class, `RecordInput`/`RecordMessage` types, `isRecordInput` type guard, dispatch logic
- **CustomerIO** (`src/v0/destinations/customerio/`) -- canonical implementation with record + event-stream support
  - `routerTransform.ts` -- `VDMV2ObjectDestination` subclass with handler map, batch strategy, input schema
  - `routerTransform.test.ts` -- unit tests instantiating the Integration class directly
  - `types.ts` -- Zod schemas for connection config (with `object` field), destination config, router request type
  - `v2/recordTransform.ts` -- record payload builder (no action validation)
  - `v2/types.ts` -- Zod schemas for record and event-stream messages, input schema factory
  - `v2/delivery.ts` -- `statusOverrides` for the 207 multi-status batch response
  - `v2/delivery.test.ts` -- parity test driving both the framework and the legacy handler
- **Batching framework** -- `.claude/skills/batching-framework/SKILL.md`
- **Delivery contract** -- `.claude/skills/batching-framework-delivery/SKILL.md`

## File Structure

```
src/v0/destinations/<dest_name>/
  routerTransform.ts        # VDMV2ObjectDestination subclass (exported as Integration)
  routerTransform.test.ts   # Unit tests for the Integration class
  types.ts                  # Zod schemas, TypeScript types, connection config
  delivery.ts               # (Optional) statusOverrides — only if response handling
                            #            differs from the framework default
```

Additional files (config, payload builders, utils) depend on the destination's complexity. See the CustomerIO reference for one way to organize them.

## Architecture

```
RouterTransformationRequestData[]
    |
processBatchedDestination()              [framework orchestrator]
    |
VDMV2ObjectDestination<TBody, TRecordSchema, TEventStreamSchema>  [your integration class]
    |--- getInputSchema()                -> [framework] z.union(recordSchema, eventStreamSchema)
    |--- transformEvent()                -> [inherited] dispatches to:
    |       |--- isRecordInput()?
    |       |       |--- transformObjectRecord(input)  -> handler map
    |       |       |--- framework validates object type + action
    |       |       |--- calls handler()
    |       |--- else: transformEventStream(input)
    |--- getBatchStrategy()              -> batch strategy factory
    |
Framework groups by composite key, chunks, wraps
    |
RouterTransformationResponse[]
```

Delivery runs as a separate service call over the same class. Most destinations need no overrides;
add them when the API reports per-record failures, as CustomerIO does with its 207 multi-status body
(`v2/delivery.ts`). See `.claude/skills/batching-framework-delivery/SKILL.md`.

## Key Conventions

### Handler map is the single source of truth

The map returned by `transformObjectRecord(input)` declares which object/action combinations are supported. The framework rejects anything not present. Do not duplicate this validation in payload builders downstream.

See `src/v0/destinations/customerio/routerTransform.ts` -- `transformObjectRecord` method.

### Transform methods are typed from your schemas

Declare two schemas built with `makeRouterInputSchema` -- `recordSchema` and `eventStreamSchema` -- as `readonly` properties, both using the same `destinationConfig` constant. The framework unions them in `getInputSchema()`; you never build the union yourself. `RecordInput`/`RecordMessage`/`isRecordInput` remain framework-internal (routing/guard).

Type the transform-method parameters inline with `z.infer<typeof recordInputSchema>` (for `transformObjectRecord`) and `z.infer<typeof eventStreamInputSchema>` (for `transformEventStream`), referencing the module-level schema constants. Do **not** introduce a named alias like `type MyRecordInput = z.infer<typeof recordInputSchema>` and annotate with that — the alias reads like a hand-written type that could drift from the schema, whereas `z.infer<typeof ...>` at the use site makes it obvious the type is the schema, single-sourced. No casting is needed. See `src/v0/destinations/customerio/routerTransform.ts`.

### Connection config constraint

`TConnectionConfig` is constrained to `extends { destination: { object: string } }`. The framework reads `this.connection.config.destination.object` to look up the handler map. Define your connection config type with an `object` field (see `src/v0/destinations/customerio/types.ts` -- `CustomerIOConnectionConfigSchema`).

### `ConfigurationError` for framework-level errors

The framework uses `ConfigurationError` (not `InstrumentationError`) for dispatch validation:

| Error | Source |
|---|---|
| Missing connection config | Framework |
| Unsupported object type | Framework (not in handler map) |
| Unsupported action for object type | Framework (not in handler map) |
| Event-stream not supported | Framework (default `transformEventStream`) |
| Bad payload data | Destination code (`InstrumentationError`) |

### Event-stream support is optional

Object destinations declare both `recordSchema` and `eventStreamSchema`. Override `transformEventStream` to return event-stream handlers; if left as the default, event-stream messages are rejected with a `ConfigurationError`. See `src/v0/destinations/customerio/routerTransform.ts`.

## Enabling the Framework

Register in `src/constants/batchedDestinationsMap.ts` and update `src/features.ts` under `defaultFeaturesConfig` with the destination definition name.

Delivery is gated separately -- see `.claude/skills/batching-framework-delivery/SKILL.md`.

## Steps

1. Read the reference files listed above
2. Create `src/v0/destinations/<dest_name>/types.ts` -- Zod schemas for connection config (with `object` field), record message, and event-stream message; derive TypeScript types
3. Create `src/v0/destinations/<dest_name>/routerTransform.ts` -- extend `VDMV2ObjectDestination<TBody, typeof recordInputSchema, typeof eventStreamInputSchema>`:
   - `recordSchema` / `eventStreamSchema` -- `readonly` properties set to the two `makeRouterInputSchema` schemas (shared `destinationConfig` constant)
   - `transformObjectRecord(input)` -- return handler map with object type -> action -> handler
   - `getBatchStrategy()` -- return `ChunkBatchStrategy` with `maxPayloadSize`/`maxItems` and `wrapBody`
   - (Optional) `transformEventStream(input)` -- handle non-record events
   - Export as `Integration`
4. Register in `src/constants/batchedDestinationsMap.ts` and `src/features.ts`
5. (Optional) Create `delivery.ts` -- `statusOverrides`, only if the API reports failures the
   framework default cannot read; add a `delivery.test.ts` that compares it against the legacy handler
6. Create `src/v0/destinations/<dest_name>/routerTransform.test.ts` -- unit tests
7. Create `test/integrations/destinations/<dest_name>/router/` -- integration test cases
8. Verify:
   ```bash
   npm run lint
   npm test -- --testPathPattern="<dest_name>" --no-coverage
   npm run test:ts -- component --destination=<dest_name>
   ```
