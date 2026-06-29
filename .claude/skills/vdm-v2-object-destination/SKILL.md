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
- **Batching framework** -- `.claude/skills/batching-framework/SKILL.md`

## File Structure

```
src/v0/destinations/<dest_name>/
  routerTransform.ts        # VDMV2ObjectDestination subclass (exported as Integration)
  routerTransform.test.ts   # Unit tests for the Integration class
  types.ts                  # Zod schemas, TypeScript types, connection config
```

Additional files (config, payload builders, utils) depend on the destination's complexity. See the CustomerIO reference for one way to organize them.

## Architecture

```
RouterTransformationRequestData[]
    |
processBatchedDestination()              [framework orchestrator]
    |
VDMV2ObjectDestination<TBody>           [your integration class]
    |--- getInputSchema()                -> Zod schema for upfront validation
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

## Key Conventions

### Handler map is the single source of truth

The map returned by `transformObjectRecord(input)` declares which object/action combinations are supported. The framework rejects anything not present. Do not duplicate this validation in payload builders downstream.

See `src/v0/destinations/customerio/routerTransform.ts` -- `transformObjectRecord` method.

### Use `RecordInput` -- no typecasting

The framework provides `RecordInput` (defined in `vdmV2ObjectDestination.ts`) with a properly typed `message` containing `action: 'insert' | 'update' | 'delete'` and `identifiers: Record<string, unknown>`. Use it in handler methods instead of casting from `RouterTransformationRequestData`.

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

Override `transformEventStream` if the destination handles both record AND event-stream events. If not overridden, the default throws `ConfigurationError`. See `src/v0/destinations/customerio/routerTransform.ts` -- `transformEventStream` method.

## Enabling the Framework

Register in `src/constants/batchedDestinationsMap.ts` and update `src/features.ts` under `defaultFeaturesConfig` with the destination definition name.

## Steps

1. Read the reference files listed above
2. Create `src/v0/destinations/<dest_name>/types.ts` -- Zod schemas for connection config (with `object` field), record message, event-stream message (if applicable); derive TypeScript types
3. Create `src/v0/destinations/<dest_name>/routerTransform.ts` -- extend `VDMV2ObjectDestination`:
   - `transformObjectRecord(input)` -- return handler map with object type -> action -> handler
   - `getBatchStrategy()` -- return `ChunkBatchStrategy` with `maxPayloadSize`/`maxItems` and `wrapBody`
   - `getInputSchema()` -- return the composed Zod schema
   - (Optional) `transformEventStream(input)` -- handle non-record events
   - Export as `Integration`
4. Register in `src/constants/batchedDestinationsMap.ts` and `src/features.ts`
5. Create `src/v0/destinations/<dest_name>/routerTransform.test.ts` -- unit tests
6. Create `test/integrations/destinations/<dest_name>/router/` -- integration test cases
7. Verify:
   ```bash
   npm run lint
   npm test -- --testPathPattern="<dest_name>" --no-coverage
   npm run test:ts -- component --destination=<dest_name>
   ```
