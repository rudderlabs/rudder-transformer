---
name: vdm-v2-object-destination
description: Create the transformation logic for a new VDM V2 object-based destination. Implements record dispatch by object type and action, with batching and optional event-stream support.
---

# VDM V2 Object Destination (rudder-transformer)

Turn warehouse record events into create/update/delete requests on object types (person, event,
contact, …), dispatched per object type and action, with batching and optional event-stream
support. Built on the batching framework (`.claude/skills/batching-framework/SKILL.md`); delivery
per `.claude/skills/batching-framework-delivery/SKILL.md`.

## When to use

Extend `VDMV2ObjectDestination` when the destination receives record events (insert/update/delete)
for **object types** from `connection.config.destination.object`, object types support
**different actions**, and it may also take event-stream events (identify, track, …). Audience
add/remove destinations use `vdm-next-audience-integration` instead.

## Reference

- `src/services/destination/destinationIntegration/vdmV2ObjectDestination.ts` — abstract class,
  `RecordInput`/`RecordMessage`, `isRecordInput`, dispatch.
- `src/v0/destinations/customerio/` — canonical (record + event-stream):
  `routerTransform.ts` (handler map, strategy, schemas), `routerTransform.test.ts`, `types.ts`
  (`CustomerIOConnectionConfigSchema` with `object`), `v2/recordTransform.ts` (payload builder, no
  action validation), `v2/types.ts` (message schemas), `v2/delivery.ts` (207 multi-status),
  `v2/delivery.test.ts` (parity vs legacy handler).

## File Structure

```
src/v0/destinations/<dest>/
  routerTransform.ts       # VDMV2ObjectDestination subclass, exported as Integration
  routerTransform.test.ts
  types.ts                 # Zod schemas, connection config with `object`
  delivery.ts              # (optional) only if response handling differs from default
```

Further files (config, payload builders, utils) as complexity requires — see CustomerIO.

## Architecture

```
processDestinationIntegration()
  → VDMV2ObjectDestination<TBody, TRecordSchema, TEventStreamSchema>
      getInputSchema()  [framework] z.union(recordSchema, eventStreamSchema)
      transformEvent()  [inherited]
        isRecordInput? → transformObjectRecord(input) handler map → framework validates object+action → handler()
        else           → transformEventStream(input)
      getBatchStrategy()
  → group, chunk, wrap → RouterTransformationResponse[]
```

## Key Conventions

- **The handler map is the single source of truth.** `transformObjectRecord(input)` returns
  object type → action → handler; the framework rejects anything absent. Don't re-validate in
  payload builders.
- **Schemas, not aliases.** Declare `recordSchema` and `eventStreamSchema` as `readonly`
  properties built with `makeRouterInputSchema`, sharing one `destinationConfig` constant; the
  framework unions them. Type method params inline as `z.infer<typeof recordInputSchema>` /
  `z.infer<typeof eventStreamInputSchema>` — no named alias (it reads like a hand-written type
  that could drift), no cast. `RecordInput`/`RecordMessage`/`isRecordInput` stay framework-internal.
- **Connection config**: `TConnectionConfig extends { destination: { object: string } }` — the framework
  reads `this.connection.config.destination.object`.
- **Event-stream is optional.** Leave `transformEventStream` as the default to reject event-stream
  messages, or override it to return handlers.
- **Framework dispatch errors are `ConfigurationError`**: missing connection config, unsupported
  object type, unsupported action for the type, event-stream not supported. Bad payload data from
  your code is `InstrumentationError`.

Register `<DEST_NAME_UPPER>: { routerTransform: true, batching: true }` in `src/features.ts` — that
one entry enables transform and delivery (`batching-framework#enabling-the-framework`). Add a
`delivery.ts` only when the API reports failures the default can't read (CustomerIO's 207).

## Steps

1. Read the references.
2. `types.ts` — connection config (with `object`), record and event-stream message schemas.
3. `routerTransform.ts` — extend
   `VDMV2ObjectDestination<TBody, typeof recordInputSchema, typeof eventStreamInputSchema>`:
   `recordSchema`/`eventStreamSchema`, `transformObjectRecord` (handler map),
   `getBatchStrategy` (`ChunkBatchStrategy` with `maxItems`/`maxPayloadSize`/`wrapBody`),
   optional `transformEventStream`; export `Integration`.
4. Register in `src/features.ts`.
5. Optional `delivery.ts` + `delivery.test.ts` parity test.
6. `routerTransform.test.ts`, `test/integrations/destinations/<dest>/router/` cases, `live.ts`.
7. Verify:
   ```bash
   npm run lint
   npm test -- --testPathPattern="<dest_name>" --no-coverage
   npm run test:ts -- component --destination=<dest_name>
   ```
