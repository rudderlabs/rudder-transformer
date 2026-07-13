---
name: live-integration-test
description: Generate a destination's live (real-destination) integration test spec `test/integrations/destinations/<dest>/live.ts` by deriving its scenarios and event seeds from the destination's existing component tests (router/processor/dataDelivery `data.ts`). Use when enrolling a destination into the live suite, or when asked to "add live tests" / "generate live test cases" for a destination.
argument-hint: <destination-folder-name>
---

# Live Integration Test — Enroll a Destination

**Objective:** Create `test/integrations/destinations/<dest>/live.ts` — a `LiveSpec` whose
`scenarios` drive events through the real `transform → deliver` pipeline against a **real
destination account**, deriving the event seeds, config, and code-path coverage from the
destination's existing (mocked) component tests. The mocked `component.test.ts` suite stays the
merge gate; this suite is additive and asserts on the genuine delivery verdict.

## Inputs

- **Destination folder name**: `$ARGUMENTS[0]` — the folder under `test/integrations/destinations/`
  and `src/.../destinations/`, e.g. `<dest>`.

## Sources of truth (read these first)

1. **Component test cases** — the raw material for scenarios:
   - `test/integrations/destinations/<dest>/router/data.ts` and, if present,
     `test/integrations/destinations/<dest>/processor/data.ts` (plus their imports: `config.ts`,
     `upsertData.ts`, `errorValidationData.ts`, …). Most destinations have both a `processor/` and a
     `router/` suite; some (e.g. router-only ones) have just `router/`. Each case is
     `{ id, description, feature, input.request.body.input[].message, ...destination.Config..., output }`.
     The **`message`** is the raw event and **`destination.Config`** is the config — these become the
     scenario's `seed(ctx)` and `resolveConfig`/`configOverride`.
   - `test/integrations/destinations/<dest>/dataDelivery/*.ts` — proxy/delivery cases (optional; not
     every destination has them). Show what a delivered vs failed verdict looks like.
2. **`test/integrations/destinations/<dest>/network.ts`** — the mocked API responses. This reveals
   **which real endpoints the transform hits** and the branch each case exercises (create vs update,
   search hit/miss, batch vs single, membership add/remove), which tells you what live
   **setup/verify/cleanup** must do.
3. **The transformer** — `src/v0|v1/destinations/<dest>/` or `src/cdk/v2/destinations/<dest>/`: the
   config fields, auth mechanism, and the destination API endpoints (for setup/verify/cleanup steps).
4. **The live harness contract** — `test/integrations/live/types.ts` (`LiveSpec`, `LiveScenario`,
   `LiveStep`, `RunContext`), the shared `pollUntil` read-back helper
   (`test/integrations/live/poll.ts`), and `test/integrations/live/README.md`.
5. **The reference implementation** — read the HubSpot spec end-to-end as the worked example of
   every pattern below. For non-trivial specs it is a **module folder**:
   `destinations/hs/live.ts` is a one-line re-export of `destinations/hs/live/spec.ts`, with helpers
   split across `live/api.ts` (real-API calls + auth), `live/setup.ts` (action bodies),
   `live/verify.ts` (verify steps), and `live/profiles.ts` (trait profiles). It is a CRM/object
   destination; adapt the shapes to your destination's category (see below).

## The mapping: component case → live scenario

| Component test | Live spec |
| --- | --- |
| mocked network via `network.ts` / `MockAxiosAdapter` | **no mock** — the runner boots the real app and hits real APIs |
| a `data.ts` case = one input `message` + `destination.Config` + expected `output` | a **scenario** with a pipeline step whose `seed(ctx)` rebuilds that `message` |
| hardcoded PII/ids in the message (email, userId, externalId, recordId, list/audience id) | `ctx.email()`, `ctx.identity(entity)`, `ctx.runId`, `ctx.now(offset?)`, `ctx.liveSecret.resourceIds`, or an id registered by a setup step — never a literal |
| config variants across cases (api version, list/object type, mapping) | a base `resolveConfig` + per-scenario `configOverride(base)` |
| a case that asserts a specific transformed request shape | a scenario asserting the event is **delivered** (verdict 2xx / 207); the shape is the transform's job, already covered by the mocked suite |

**One scenario per distinct behavior, not per component case.** Collapse the many mocked cases into
the *code paths* that matter live — these differ by destination category:

- **CRM / object destinations**: create vs update; event-stream vs RETL (`mappedToDestination`);
  lookup-by-id vs search-by-field; associations; per object type; API-version variants.
- **Audience destinations**: add vs remove membership; list/segment creation; raw vs hashed identifiers.
- **Conversion / event destinations**: the distinct event types and property mappings; enhanced /
  offline conversion variants.
- **Cross-cutting** (any category): batched vs `dontBatch`; config-driven variants.

Give each a stable `id` and a one-line `description`.

**Skip cases that can't be meaningfully delivered live** — pure validation/error cases (bad config,
missing required field → 400, "more than one match" aborts, unsupported event type). Those are
contract checks the mocked suite already owns; the live suite verifies real *delivery*, so don't
port them.

## Stateful cases: setup + verify as steps, teardown declared on the scenario

If a case's code path depends on pre-existing destination state, express **setup** and **read-back**
as ordered steps, and **declare teardown on the scenario** rather than adding a trailing cleanup step:

- **update / lookup-by-id / search-by-field / remove-from-audience** → an `action` step
  (`{ stepType: 'action', name: 'setup', run }`) creates the prerequisite state via the real
  destination API and `ctx.register({ type, id })`s any ids; the
  pipeline step then references `ctx.resources` for that id, or seeds the same `ctx.email()`/identity
  the setup used.
- **verify** → a `verify` step that reads the object/membership/association back from the
  destination API and asserts its **fields** with jest `expect(...)` (it resolves on success and a
  failed matcher fails the step — it returns `void`, no boolean), not just its existence: a create
  scenario checks the object carries every property it was created with; an update scenario checks
  the properties it changed; an association scenario checks the link actually exists between the
  two records. Share one property/trait profile between the pipeline `seed` and the verify — a
  `(ctx) => ({ ... })` factory referenced by both, so the seeded values and the assertion can't
  drift (see `esContactCreateTraits` + `verifyContactProperties`, and `verifyAssociationExists`, in
  `hs/live/verify.ts`). Poll eventually-consistent read-backs with the shared `pollUntil` helper
  (`live/poll.ts`; `soft: true` returns the last value so the closing `expect(...)` prints a real
  diff). Read-back is also the
  real check for **batch** writes: a batch endpoint can return `207` (which counts as delivered)
  even when an item fails, so the delivery verdict alone doesn't prove the write landed.
- **cleanup** → **declare it on the scenario.** Set `cleanup: (ctx) => delete…(ctx)` on the
  `LiveScenario`; the runner arms it at scenario start and drains it after the scenario's steps
  finish — LIFO and best-effort (a failing cleanup is logged, not thrown), running **even if a
  step failed**. For resources a setup action discovers dynamically, `ctx.addCleanup(fn)` from its
  `run` is the imperative escape hatch. Declare `cleanup` explicitly on each scenario (don't
  club it onto many at once). Don't put teardown on a `verify` step, and no trailing cleanup
  action step.

Use a dedicated `https.Agent({ keepAlive: false })` for these helper calls so read-back/cleanup
sockets don't linger as open handles when the suite finishes.

Identities from `ctx.identity` / `ctx.email` are always unique per scenario run
(`ci-<runId>-…`), so destination 409s on duplicates are avoided without a per-spec strategy.

For eventually-consistent destinations (search-indexed create/update routing), make the
precondition deterministic in the **setup action** (poll until the record is stably searchable).
When the transform itself re-searches that index at delivery time, setup polling alone can still
race — a just-created record is occasionally missed and 409s — so also set `retries` on the
pipeline step to re-run seed → transform → deliver with backoff. Only use `retries` where a failed
attempt persists nothing (e.g. a 409-on-create), so repeating is safe; otherwise a re-delivery
runs against the previous attempt's state.

## Credentials — `LIVE_SECRET_<DEST>` (`LiveSecret` shape)

`SecretResolver` reads one env var, `LIVE_SECRET_<DEST>`, a JSON blob:
`{ authType, config, secret?, resourceIds?, oauthRefresh?, readback? }`. `config` merges into
`destination.Config`; `secret` into `metadata.secret`; `resourceIds` supplies account-scoped ids
(listId, pixelId, measurementId, …); `readback` holds credentials for `verify` steps.
`resolveConfig(s)` maps `s.config` (plus fixed non-secret defaults taken from the component
`destination.Config`) into the real `destination.Config`.

**OAuth destinations** (`authType: 'oauth'`): supply `oauthRefresh` (the long-lived refresh token +
`accountDefinition` + any `providerFields` like Salesforce `instance_url`). Note the harness README
lists the `rudder-auth` container that services OAuth refresh as **deferred (not in the pilot)** — so
until that layer lands, an OAuth destination's spec typically goes in with `enabled: false` (parked)
and is validated for shape only. Prefer piloting `apiKey`/`basic` destinations first.

## Steps

1. **Read** the sources above for `<dest>`; enumerate the distinct behaviors its component cases
   cover (dedupe error-only ones).
2. **Choose** `authType`.
3. **Write `resolveConfig`** from the component `destination.Config` — keep the non-secret fields as
   fixed defaults, spread `s.config` last for the real credentials.
4. **For each behavior**, add a scenario: a pipeline step whose `seed(ctx)` reproduces the component
   `message` with ctx-based identities; a `configOverride` for config-dependent variants; and
   `setup`/`verify`/`cleanup` steps for stateful ones. For create/update behaviors, factor the
   asserted fields into a `(ctx) => ({ ... })` profile shared by the seed and a field-level verify
   so the two stay in lockstep.
5. **Enroll**: `enabled: true` (registry auto-discovers `destinations/*/live.ts`; no registration).
   Use `enabled: false` to park it (e.g. OAuth destinations, until rudder-auth lands).
6. **Verify**:
   `npx tsc --noEmit -p tsconfig.test.json`
   then, with real credentials:
   `LIVE_SECRET_<DEST>='{...}' LOG_LEVEL=silent npm run test:live -- --destination=<dest>`.
   (Run with `LOG_LEVEL=silent` until secret masking in `network.js` logs is verified — see the
   README security note.)

## Skeleton — `test/integrations/destinations/<dest>/live.ts`

For a couple of scenarios a single `live.ts` is fine; beyond that, split it into a `live/` module
folder (`spec.ts` + `api.ts`/`setup.ts`/`verify.ts`/`profiles.ts`) and make `live.ts` a one-line
re-export — see `destinations/hs/live/`. Steps are plain objects with a required `stepType`
discriminant (`'pipeline' | 'action' | 'verify'`); there are no `action()`/`verify()` wrapper
helpers. The `seed` below is an event-stream `identify` (CRM shape) purely to illustrate structure
— **use the event shape your destination's component `message`s actually take** (e.g. a `track`
event with `properties` for a conversion, or an audience membership event), swapping literals for
`ctx` values.

```ts
import axios from 'axios';
import { Agent } from 'https';
import { LiveSpec, RunContext } from '../../live/types';
import { pollUntil } from '../../live/poll';

// keepAlive:false so read-back/cleanup sockets don't linger as open handles.
const agent = new Agent({ keepAlive: false });

// Real-API helpers for stateful scenarios (create/read-back/delete). Derive endpoints + auth
// from src/.../destinations/<dest> and network.ts. Example shapes only:
// const createEntity = async (ctx: RunContext): Promise<void> => { ... ctx.register(...) };
// const fetchEntity = async (ctx: RunContext, keys: string[]) => { ... };   // real GET/search
// const cleanupEntity = async (ctx: RunContext): Promise<void> => { ... };

// One field profile shared by a scenario's seed and its verify, so they can't drift.
// const createProps = (ctx: RunContext): Record<string, string> => ({ name: 'CI', ref: ctx.runId });

// A verify step is a plain { stepType: 'verify', name, check } object; `check` asserts with jest
// expect(...) (returns void). Poll eventually-consistent read-backs with pollUntil (soft: true).
// const verifyEntityProps = (want: (ctx: RunContext) => Record<string, string>): LiveStep => ({
//   stepType: 'verify',
//   name: 'verify entity properties',
//   check: async (ctx) => {
//     const expected = want(ctx);
//     const props = await pollUntil(
//       async () => {
//         const p = await fetchEntity(ctx, Object.keys(expected));
//         return { done: Boolean(p) && Object.keys(expected).every((k) => p[k] === expected[k]), value: p };
//       },
//       { label: 'entity properties', attempts: 4, delayMs: (n) => 1000 * 2 ** n, soft: true },
//     );
//     expect(props).toMatchObject(expected);
//   },
// });

export const live: LiveSpec = {
  enabled: true, // OAuth destinations: false until rudder-auth lands (see Credentials)
  authType: 'apiKey', // apiKey | oauth | basic | serviceAccount | custom
  // Non-secret Config defaults from the component test's destination.Config; real creds via s.config.
  resolveConfig: (s) => ({ ...s.config }),
  scenarios: [
    {
      id: '<dest>-create',
      description: 'A new <entity> is created and delivered',
      // Teardown for this scenario; armed at start, drained after its steps (LIFO, best-effort).
      cleanup: (ctx) => cleanupEntity(ctx),
      steps: [
        {
          stepType: 'pipeline',
          name: 'create <entity>',
          // Rebuild the component case's message, but with ctx identities instead of literals.
          // Shape (type/traits/properties/event) is destination-specific — copy it from the case.
          // Seed the shared field profile so verify can read the same values back.
          seed: (ctx) => ({
            type: 'identify',
            userId: ctx.identity('user'),
            timestamp: ctx.now(),
            traits: { email: ctx.email(), ...createProps(ctx) },
            integrations: { All: true },
          }),
        },
        // verifyEntityProps(createProps), // field-level read-back sharing the seed's profile
      ],
    },
    // {
    //   id: '<dest>-update',
    //   description: 'An existing <entity> is updated',
    //   cleanup: (ctx) => cleanupEntity(ctx),
    //   steps: [
    //     { stepType: 'action', name: 'setup', run: createEntity },
    //     { stepType: 'pipeline', name: 'update', seed: (ctx) => ({ ...updateProps(ctx) }) },
    //     verifyEntityProps(updateProps),
    //   ],
    // },
    // { id: '<dest>-variant', description: 'config-driven variant', configOverride: (base) => ({ ...base }), steps: [ ... ] },
  ],
};

export default live;
```

## Notes

- Build every value from `ctx`, never from string templates — identities are unique per run, which
  keeps runs isolated and avoids destination 409s on duplicates.
- For association scenarios, seed a **real** destination-defined association type, not a placeholder
  copied from the mocked `network.ts` (a fake type makes a batch endpoint return `207` without
  creating the link, so delivery passes but the read-back verify fails). E.g. HubSpot's
  companies→contacts default type is `company_to_contact`.
- The base `tsconfig.json` excludes `test/`; type-check the spec via `tsconfig.test.json`
  (`npx tsc --noEmit -p tsconfig.test.json`), which includes `test/**`. ts-jest also checks at run time.
- Never store a long-lived secret in the repo; live credentials come from `LIVE_SECRET_<DEST>`
  locally and Vault (via GitHub-OIDC) in CI.
