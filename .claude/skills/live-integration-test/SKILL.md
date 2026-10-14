---
name: live-integration-test
description: Generate a destination's live (real-destination) integration test spec `test/integrations/destinations/<dest>/live.ts` by deriving its scenarios and event seeds from the destination's existing component tests (router/processor/dataDelivery `data.ts`). Use when enrolling a destination into the live suite, or when asked to "add live tests" / "generate live test cases" for a destination.
argument-hint: <destination-folder-name>
---

# Live Integration Test — Enroll a Destination

Create `test/integrations/destinations/<dest>/live.ts` — a `LiveSpec` whose `scenarios` drive
events through real `transform → deliver` against a **real account**, derived from the
destination's mocked component tests. The mocked suite stays the merge gate; this one is additive
and asserts the genuine delivery verdict.

Input: `$ARGUMENTS[0]` — the folder name under `test/integrations/destinations/` and `src/.../destinations/`.

## Sources of truth (read these first)

1. **Component cases** — `router/data.ts`, `processor/data.ts` if present, and their imports.
   Each case's `input.request.body.input[].message` becomes `seed(ctx)`; its `destination.Config`
   becomes `resolveConfig`/`configOverride`. `dataDelivery/*.ts` (optional) shows delivered vs
   failed verdicts.
2. **`network.ts`** — which real endpoints are hit and which branch each case exercises (create vs
   update, search hit/miss, batch vs single, add/remove) → what setup/verify/cleanup must do.
3. **The transformer** (`src/v0|v1/destinations/<dest>/` or `src/cdk/v2/destinations/<dest>/`) —
   config fields, auth, endpoints.
4. **Harness contract** — `test/integrations/live/types.ts` (`LiveSpec`, `LiveScenario`,
   `LiveStep`, `RunContext`), `pollUntil` from `@rudderstack/integrations-lib/build/live-test`,
   `test/integrations/live/README.md`.
5. **Reference** — HubSpot, read end to end: `destinations/hs/live.ts` re-exports
   `hs/live/spec.ts`, with `api.ts` (real API + auth), `setup.ts`, `verify.ts`, `profiles.ts`.
   CRM-shaped; adapt to your category.

## The mapping: component case → live scenario

| Component test | Live spec |
| --- | --- |
| mocked network | **no mock** — real app, real APIs |
| one case = `message` + `destination.Config` + `output` | a scenario whose pipeline step's `seed(ctx)` rebuilds the `message` |
| literal PII/ids (email, userId, externalId, recordId, list id) | `ctx.email()`, `ctx.identity(entity)`, `ctx.runId`, `ctx.now(offset?)`, `ctx.liveSecret.resourceIds`, or an id registered by setup |
| config variants | base `resolveConfig` + per-scenario `configOverride(base)` |
| asserting a transformed request shape | asserting the event is **delivered** (2xx/207); shape is the mocked suite's job |

The no-literal rule covers values that must be **unique per run or are sensitive**. Fixed
sandbox-account configuration (a conversion action name, a list name) may be a named constant —
it must match the account exactly and a reader can check it. Use `resourceIds` for opaque ids or
values that vary by environment. Either way, failures should name the thing.

**One scenario per distinct behavior, not per case:**

- **CRM/object**: create vs update; event-stream vs RETL (`mappedToDestination`); lookup-by-id vs
  search; associations; per object type; API-version variants.
- **Audience**: add vs remove; list creation; raw vs hashed identifiers.
- **Conversion/event**: distinct event types and property mappings; enhanced/offline variants.
- **Cross-cutting**: batched vs `dontBatch`; config-driven variants.

**Batching is a scenario.** Return an ARRAY from `seed` (one `/routerTransform` call) and pin with
`expectedOutputs`/`expectedProxyRequests` — a fan-out regression still delivers 2xx per event.
One scenario per batching-key dimension: same key groups, different key fans out, and
`metadataOverride: { dontBatch: true }`.

**Partial failure.** If the destination reports per-item results in a 2xx/207, seed one valid item
beside one the **partner** rejects (not your transform) and declare
`expectedFailure: { items: [<seed index>] }` — this checks positional blame, which breaks
silently. Use a field the transform passes through unvalidated (gaec: malformed `adjustmentDateTime`).

**A `dontBatch` retry takes a second step.** The harness doesn't replay rudder-server's
one-at-a-time redelivery. Add a step with `metadataOverride: { dontBatch: true }` seeding only the
events returned for retry (just the rejected ones when the spec answers per item) and assert their
final verdict; add a single-bad-event scenario with `expectedFailure: {}` for the whole-batch
case. `destinations/rokt/live.ts` has both.

**Credential branches need a bad credential, not a broken account.** For `authExpired`/
`authRevoked`, pass `metadataOverride: { secret: { ... } }` and assert
`expectedFailure: { category: '...' }` (a generic abort looks identical otherwise). If the
transform calls the partner *before* delivery (gaec resolves its conversion action by name), that
call throws inside `networkHandler.proxy()` and bypasses the delivery spec — so deliver once
validly first (caching the lookup) inside the same scenario, then fail the next step.

**Partner-decided rejections are live scenarios; transform-decided ones are not.** Where the
`delivery` spec reads a rejection off the response (a non-accepting success status, an error body
on 200 — `batching-framework-delivery#when-you-need-this`), only live proves the real API produces
it. Pair the happy path with an adjacent scenario seeding an id the account lacks (random
transaction id, deleted record) with everything else valid.

**Partner-side ids that must match a real record come from `resourceIds`** — a literal goes stale
when the account is re-seeded, and `ctx.runId` never matches. Random/`runId` values only for the
negative scenario.

Give each scenario a stable `id` and one-line `description`. **Skip pure validation/error cases**
(bad config, missing field → 400, multiple-match aborts, unsupported type) — the mocked suite owns them.

## Stateful cases: setup + verify as steps, teardown declared on the scenario

- **Setup** (update, lookup-by-id, search-by-field, remove-from-audience) — an
  `{ stepType: 'action', name: 'setup', run }` step creating state via the real API and
  `ctx.register({ type, id })`-ing ids; the pipeline step reads `ctx.resources` or reuses the same
  `ctx.email()`/identity.
- **Verify** — a `verify` step reading back and asserting **fields** with jest `expect` (returns
  `void`; a failed matcher fails the step): create checks every created property, update the
  changed ones, associations that the link exists. Share one `(ctx) => ({ ... })` profile between
  `seed` and verify so they can't drift (`esContactCreateTraits` + `verifyContactProperties`,
  `verifyAssociationExists` in `hs/live/verify.ts`). Poll eventually-consistent reads with
  `pollUntil` (`soft: true` returns the last value so `expect` prints a real diff). Read-back is
  the real check for batch writes — a 207 counts as delivered even when an item failed.
- **Cleanup** — `cleanup: (ctx) => …` on the `LiveScenario`, declared per scenario. Armed at
  start, drained after the steps — LIFO, best-effort (logged, not thrown), **even if a step
  failed**. For dynamically discovered resources, `ctx.addCleanup(fn)` from a setup `run`. No
  teardown on `verify` steps, no trailing cleanup step.

Use `https.Agent({ keepAlive: false })` for helper calls so sockets don't linger as open handles.
`ctx.identity`/`ctx.email` are unique per run (`ci-<runId>-…`), so duplicate-409s need no strategy.

**Eventually-consistent destinations:** poll in the setup action until the record is stably
searchable. If the transform re-searches at delivery time it can still race (occasional 409), so
set `retries` on the pipeline step — only where a failed attempt persists nothing.

## Credentials — `LIVE_SECRET_<DEST>` (`LiveSecret` shape)

`resolveLiveSecret` reads JSON `{ authType, config, secret?, resourceIds?, oauthRefresh?, readback? }`:
`config` → `destination.Config`, `secret` → `metadata.secret`, `resourceIds` = account-scoped ids
(listId, pixelId, …), `readback` = creds for verify steps. `resolveConfig(s)` maps `s.config` plus
fixed non-secret defaults from the component config.

**Env-read credentials** (e.g. Google Ads' `GOOGLE_ADS_DEVELOPER_TOKEN`): put the value in the
secret and map with `resolveEnv: (s) => ({ VAR: s.secret?.field })` — `envOverrides` is a static
literal and can't carry secrets; `resolveEnv` is applied/restored with it and wins on collision.
Check `test/setup.ts` — it seeds placeholders that otherwise ship to the real destination.

**OAuth** (`authType: 'oauth'`): supply `oauthRefresh` (`refreshToken` + any `providerFields`, e.g.
Salesforce `instance_url`) and `oauthVersion`: `'v0'` (`/tokens/destination/<dest>/refresh`,
default) or `'v1'` (`/auth/v1/refresh`). `'v1'` also needs `accountDefinition: { type, name }` on
the spec (public, mirrors control plane `accounts/<dest>_oauth/db-config.json`; `name` is what
rudder-auth lowercases to pick an implementation; `category` is always `'destination'`, supplied
by the resolver). Nothing is derived from the destination name — `DESTINATION_<DEST>_OAUTH` does not hold everywhere
(`google_adwords_remarketing_lists` has a separate `_DM_OAUTH` definition), and a wrong guess
surfaces as an opaque refresh failure. At run time the suite starts **rudder-auth**
(testcontainers, ECR image); `LiveOAuthTokenResolver` calls exactly that route, no fallback, and
merges the returned secret into `metadata.secret` (token under `accessToken` | `access_token`).
App creds come from Vault: CI wildcard-imports `control-plane/data/external-services` and the
container forwards only enrolled destinations' `<DEST>_…` base/`_DESTINATION` creds (never
`_SOURCE`); locally set `*_CLIENT_ID`/`*_CLIENT_SECRET` in `.env`. Reference: `criteo_audience`.

## Steps

1. Read the sources; list distinct behaviors (drop error-only ones).
2. Choose `authType` (`apiKey`/`basic` need no refresh; `oauth` per above).
3. Write `resolveConfig`: non-secret component config as defaults, `s.config` spread last.
4. **Print a `LIVE_SECRET_<DEST>` template** with real keys and placeholder values, e.g.
   `LIVE_SECRET_HS={"authType":"apiKey","config":{"accessToken":"<private-app-token>","serviceKeyAccessToken":"<service-key>"}}`
   (HubSpot: `accessToken` drives setup/read-back and the private-app pass,
   `serviceKeyAccessToken` the service-key pass). Add `readback` only with verify steps;
   `resourceIds`/`oauthRefresh` when needed.
5. Per behavior: pipeline step with ctx-based `seed`; `configOverride` for variants; setup +
   verify + `cleanup` for stateful ones, with a shared profile for create/update.
6. **Enroll**: `enabled: true` (auto-discovered; `false` parks it). Name destination-specific
   rollout flags in `envOverrides`. Batching delivery has no flag: a pre-GA destination needs only
   `{DEST}_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL'`; batching-GA destinations need nothing
   (`batching-framework#one-gate-both-halves`).
7. **CI is automatic** — the `discover` job builds the matrix from `destinations/*/live.ts`
   (`.github/scripts/live-test-matrix.js`). OAuth specs additionally import the external-services
   cred set and start rudder-auth; apiKey specs do neither.
8. **Verify**: `npx tsc --noEmit -p tsconfig.test.json`, then
   `LIVE_SECRET_<DEST>='{...}' LOG_LEVEL=silent npm run test:live -- --destination=<dest>`
   (keep `LOG_LEVEL=silent` until secret masking in `network.js` logs is verified — README note).

## After the spec — onboarding checklist

Print this at the end:

- **Vault**: `LIVE_SECRET_<DEST>` as **single-line** JSON (multi-line breaks CI import) under
  `engineering_shared/data/integrations_team/e2e_test/rudder-transformer`. OAuth: app creds under
  `control-plane/data/external-services` with rudder-auth's expected names (e.g.
  `<DEST>_CLIENT_ID_DESTINATION`).
- **GitHub**: `VAULT_ADDR`, `VAULT_JWT_AUTH_PATH`, `VAULT_JWT_ROLE` (+ `AWS_ECR_IAM_ROLE_ARN` for
  OAuth's image pull), plus any destination-specific ones.
- **Sandbox account**: owner, what a run creates, what cleanup removes.

## Skeleton — `test/integrations/destinations/<dest>/live.ts`

One file for a couple of scenarios; beyond that a `live/` folder (`spec.ts` +
`api.ts`/`setup.ts`/`verify.ts`/`profiles.ts`) with `live.ts` as a one-line re-export. Steps are
plain objects with a required `stepType` (`'pipeline' | 'action' | 'verify'`) — no wrapper
helpers. The `identify` seed is illustrative only; use your component `message`s' actual shape.

```ts
import axios from 'axios';
import { Agent } from 'https';
import type { LiveSpec, LiveStep, RunContext } from '../../live/types';
import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';

const agent = new Agent({ keepAlive: false });

// Real-API helpers (endpoints + auth from src/.../<dest> and network.ts):
// const createEntity = async (ctx: RunContext) => { ... ctx.register(...) };
// const fetchEntity = async (ctx: RunContext, keys: string[]) => { ... };
// const cleanupEntity = async (ctx: RunContext) => { ... };

// Shared by seed and verify so they can't drift.
// const createProps = (ctx: RunContext) => ({ name: 'CI', ref: ctx.runId });

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

export const live = {
  enabled: true,
  authType: 'apiKey', // apiKey | oauth | basic | serviceAccount | custom
  // envOverrides: { <DEST>_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL' }, // pre-GA only
  resolveConfig: (s) => ({ ...s.config }),
  scenarios: [
    {
      id: '<dest>-create',
      description: 'A new <entity> is created and delivered',
      cleanup: (ctx) => cleanupEntity(ctx),
      steps: [
        {
          stepType: 'pipeline',
          name: 'create <entity>',
          seed: (ctx) => ({
            type: 'identify',
            userId: ctx.identity('user'),
            timestamp: ctx.now(),
            traits: { email: ctx.email(), ...createProps(ctx) },
            integrations: { All: true },
          }),
        },
        // verifyEntityProps(createProps),
      ],
    },
    // { id: '<dest>-update', description: '...', cleanup: (ctx) => cleanupEntity(ctx), steps: [
    //   { stepType: 'action', name: 'setup', run: createEntity },
    //   { stepType: 'pipeline', name: 'update', seed: (ctx) => ({ ...updateProps(ctx) }) },
    //   verifyEntityProps(updateProps),
    // ] },
    // { id: '<dest>-variant', description: '...', configOverride: (base) => ({ ...base }), steps: [ ... ] },
  ],
} satisfies LiveSpec;

export default live;
```

## Notes

- Build every value from `ctx`, never string templates.
- Associations: seed a **real** destination-defined association type (HubSpot companies→contacts
  is `company_to_contact`), not a placeholder from `network.ts` — a fake one 207s without creating
  the link, so delivery passes and read-back fails.
- Base `tsconfig.json` excludes `test/`; type-check with `tsconfig.test.json`.
- Never commit long-lived secrets; creds come from `LIVE_SECRET_<DEST>` locally and Vault
  (GitHub OIDC) in CI.
