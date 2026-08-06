# Live (real-destination) integration tests

The **pilot** implementation of _"Real-Destination Integration Testing for
rudder-transformer"_. It drives transformed events through the full
`transform → deliver` pipeline against **real destination accounts** and asserts on
the genuine response (the "verdict"), closing the contract-verification gap that the
mocked `component.test.ts` suite cannot cover.

The mocked suite is untouched and remains the merge gate. This suite is additive.

## What's implemented

- **Sibling runner** — `component.live.test.ts` + `jest.config.live.js` boot the real
  Koa app **without** `MockAxiosAdapter`, so outbound HTTP reaches real APIs.
- **`routerTransformRequest.ts`** — `buildRouterTransformBody()` assembles the `/routerTransform`
  request body from a seeded event (the request half of the chaining).
- **`routerProxyRequests.ts`** — `routerOutputToProxyRequests()` ports the small piece of
  rudder-server that maps each `/routerTransform` `output[]` item to the `ProxyV1Request`(s) for
  `/v1/destinations/<dest>/proxy` (the response/delivery half); `coerce.ts` holds the runtime
  coercions both halves share.
- **Harness core** (`live/`): `SecretResolver` (env-var based), `RunContext`
  (`runId` + memoised `identity`/`email`/`now`/`register`), `registry.ts`,
  `runPipelineStep.ts` (transform → deliver → assert delivered), and `poll.ts` —
  a shared `pollUntil(check, opts)` for eventually-consistent read-backs.
- **Enrollment by discovery** — `registry.ts` scans `destinations/*/live.ts` and runs
  any spec with `enabled: true`. A destination's `live.ts` either exports the `LiveSpec`
  directly, or (for non-trivial specs) re-exports it from a `live/` module folder — see
  the reference layout below.

### Reference layout (`destinations/hs/`)

For anything beyond a couple of scenarios, split the spec into a `live/` folder and keep
`live.ts` as a one-line re-export (`export { live, default } from './live/spec';`):

- **`live/spec.ts`** — the `LiveSpec`: scenarios wiring `pipeline` / `action` / `verify` steps.
- **`live/api.ts`** — real destination-API helpers and auth headers (create / fetch / delete /
  search / association reads).
- **`live/setup.ts`** — `action` step bodies that seed prerequisite state (and poll it stable).
- **`live/verify.ts`** — `verify` steps (field-level read-backs).
- **`live/profiles.ts`** — trait profiles + shared `(ctx) => ({ ... })` factories used by both
  seeds and verifies.

### OAuth destinations (`authType: 'oauth'`)

OAuth destinations don't ship a long-lived access token in their secret - one is minted at run
time. When any enrolled destination is `authType: 'oauth'`, a suite-level `beforeAll` starts the
**rudder-auth** container via testcontainers (`RudderAuthContainer`, `live/rudderAuthContainer.ts`)
and returns its base URL. `OAuthTokenResolver` (`live/oauthTokenResolver.ts`), built from that URL,
posts `{ refreshToken }` (from `LIVE_SECRET_<DEST>.oauthRefresh`) to
`/tokens/destination/<dest>/refresh` for each OAuth destination and injects the returned token into
`metadata.secret.accessToken`. This mirrors production, where rudder-server delegates token refresh
to rudder-auth rather than the transformer holding credentials.

The image is pulled from ECR (`422074288268.dkr.ecr.us-east-1.amazonaws.com/rudderstack/rudder-auth:develop`),
so Docker must be running and logged in to that ECR registry. The image ships default OAuth app credentials for each integration, and the container also
forwards credential-shaped env vars (any `*_CLIENT_ID`/`*_CLIENT_SECRET`), which override those
defaults. So the refresh token must be issued by whichever app rudder-auth ends up using - the
image default, or the `*_CLIENT_ID`/`*_CLIENT_SECRET` you set in `.env`.

Authenticate with the AWS profile/SSO session that has ECR pull access to the account (set
`AWS_PROFILE`, or pass `--profile`), then run:

```bash
AWS_PROFILE=<profile> aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin 422074288268.dkr.ecr.us-east-1.amazonaws.com

LIVE_SECRET_CRITEO_AUDIENCE='{...}' LOG_LEVEL=silent \
  npm run test:live -- --destination=criteo_audience
```

### Deferred (not in the pilot)

Vault-backed `SecretResolver`, GitHub OIDC → Vault auth, the CI workflow, and impact-based PR
subsetting. The interfaces here (`SecretResolver.resolve()`, `LiveSpec`) are shaped so those
layer on without rewrites.

**Scope — transform path.** The harness drives only `/routerTransform → /proxy`. rudder-server
also runs the processor transform (`/v0/destinations/<dest>`) ahead of delivery, whose response
shape differs; that chaining is not exercised here (INT-NNNN). **GZIP** proxy bodies are likewise
unmapped (INT-NNNN) — see `routerProxyRequests.ts`.

## Running it locally

```bash
LIVE_SECRET_<DEST>='{...}' npm run test:live -- --destination=<dest>
# add --coverage, or use: npm run test:live:coverage
```

Only the destinations named by `--destination` (comma-separated) run. `verify` steps,
if a scenario defines them, run automatically.

Credentials are **required**: `resolve()` throws if `LIVE_SECRET_<DEST>` is missing or
invalid, so a selected destination without its secret fails (it does not skip).

### Supplying credentials

`SecretResolver` reads a single env var per destination, `LIVE_SECRET_<DEST>` — a JSON
blob matching the `LiveSecret` shape:

```json
{ "authType": "apiKey", "config": { "accessToken": "..." }, "readback": { "accessToken": "..." } }
```

- `config` — merged into `destination.Config` (auth for header-based destinations lives here).
- `secret` — merged into `metadata.secret` (for destinations that read the token there).
- `resourceIds`, `oauthRefresh`, `readback` — optional; account ids, OAuth refresh token,
  and read-back credentials for `verify` steps.

In production these come from Vault (one path per destination); the resolver interface
stays the same.

`LIVE_TEST_EMAIL_DOMAIN` overrides the sink domain used for generated test emails.

## Enrolling a new destination

Add `test/integrations/destinations/<dest>/live.ts` exporting a `LiveSpec`:

```ts
export const live: LiveSpec = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (s) => ({ ...s.config }), // -> destination.Config
  scenarios: [
    /* ... */
  ],
};
```

The registry discovers it automatically. Set `enabled: false` to keep it in the tree
without running it.

### Scenarios and steps

A scenario is an ordered list of `steps` sharing one `RunContext`, plus an optional
scenario-level `cleanup`. There are no lifecycle hooks. Each step declares a required
`stepType` discriminant:

- **pipeline**: `{ stepType: 'pipeline', name, seed, metadataOverride?, retries? }` —
  `seed(ctx)` builds the raw event; the runner transforms, delivers, and asserts it was
  delivered. `retries` re-runs seed → transform → deliver with backoff when delivery fails — for
  routes that decide create-vs-update via an eventually-consistent search (a just-created record
  can be missed and 409 on the first try). Only use it where a failed attempt persists nothing, so
  repeating is safe.
- **action**: `{ stepType: 'action', name, run }` — a direct destination-API side effect
  (create/mutate state), e.g. setup.
- **verify**: `{ stepType: 'verify', name, check }` — a read-back assertion. `check(ctx)`
  reads the object/membership/association back from the destination API and asserts with jest
  `expect(...)`: it resolves on success and a failed matcher fails the step (it returns `void`, not
  a boolean). Assert the _fields_, not just existence: a create scenario checks the object carries
  every property it was created with, an update scenario checks the properties it changed, an
  association scenario checks the link actually exists between the two records. Share one
  property/trait profile between the pipeline `seed` and the verify (a `(ctx) => ({ ... })` factory
  used by both) so seed and assertion can't drift — see `verifyContactProperties` and
  `verifyAssociationExists` in `destinations/hs/live/verify.ts`. For eventually-consistent
  destinations, poll the read-back with the shared `pollUntil(check, opts)` helper (`live/poll.ts`)
  — use `soft: true` so an exhausted poll returns the last-observed value and the closing
  `expect(...)` prints a real diff instead of a bare timeout. This read-back is also what actually
  confirms a batch write: a batch endpoint can return `207` (which counts as delivered) even when an
  item fails, so the delivery verdict alone is not proof the write landed.

The **common trailing read-back** is better declared as a scenario-level `verify` the way
`cleanup` is: `verify: { check: (ctx) => …, attempts?, delayMs? }`. The framework runs `check`
after the steps and retries it on a thrown matcher error with backoff (default 4 attempts,
`1000 * 2 ** attempt`), rethrowing the last error on exhaustion — so destination code is just the
assertion and the poll boilerplate lives in the runner. Use a `verify` **step** in `steps` only for
ordering cases (verify-after-setup, mid-scenario). See `destinations/hs/live/verify.ts`.

Teardown is the scenario's `cleanup: (ctx) => …`, armed at scenario start and drained
after the steps finish (LIFO, best-effort) — no trailing cleanup step.

Typical order: `[setup?, ...pipeline]`, with `verify` and `cleanup` on the scenario.

- `metadataOverride` merges into the `/routerTransform` input metadata (e.g.
  `{ dontBatch: true }`).
- `configOverride` on a scenario runs it with a different `destination.Config`.

### Run context and identity

Steps build data from `ctx`, not from string templates:

- `ctx.runId` — unique per run.
- `ctx.identity(entity)` — memoised id for an entity kind (e.g. `'user'`).
- `ctx.email(entity?)` — unique, sink-safe address for the run.
- `ctx.now(offset?)` — ISO timestamp relative to run start (e.g. `now('-3h')`).
- `ctx.register(resource)` / `ctx.resources` — record created resources for later steps
  (e.g. cleanup, or a step that references an id created by setup).

Identities (`ctx.identity` / `ctx.email`) are always unique per scenario run (`ci-<runId>-…`),
so destination 409s on duplicates are avoided without a per-spec strategy knob.

## Type-checking

The base `tsconfig.json` excludes `test/`, so `tsc -p tsconfig.json` does **not**
type-check these files (ts-jest checks them at run time). Use the dedicated config that
includes `test/**`:

```bash
npx tsc --noEmit -p tsconfig.test.json
```

## Security note — before this runs in CI

`network.js` logs request/response bodies. **Secret masking in those logs is a mandatory
build gate** and must land and be verified before any live run is enabled in CI; until
then, run locally with `LOG_LEVEL=silent`. The runner already redacts `metadata.secret`
from its own failure diagnostics. No long-lived secret should ever be stored in GitHub;
CI credentials must come from Vault via a short-lived GitHub-OIDC token (see the design
doc).
