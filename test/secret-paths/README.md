# Secret-path manifest (POC)

Destination live events currently show the outbound request verbatim — including the
credentials the transformer put in it. This is the transformer half of a fix: work out
**where** each destination's declared credentials land in the request it builds, and publish
that so the data plane can mask those fields before the payload leaves.

Nothing here is hand-authored per destination. There are two secret sources, and between them
they cover the two ways a destination is handed a credential:

- **Configured** — `secretKeys` from the destination definition, the source of truth for which
  config fields are credentials. Perturbed **by name**, wherever that key appears in a config.
- **Runtime** — the `metadata.secret` bag the control plane mints per OAuth account and
  rudder-server forwards verbatim as an opaque blob. Nothing declares its keys, so every value
  under it is treated as a credential and perturbed **by position**.

The second source exists because `secretKeys` cannot describe it. An OAuth destination's bearer
token is never a config field — `GOOGLE_ADWORDS_ENHANCED_CONVERSIONS` declares `secretKeys: []`
and still sends `Authorization: Bearer <token>` — so following the registry alone published
"nothing to mask" for all 24 OAuth destinations in the catalogue. Treating the whole bag as
secret over-masks, deliberately; the decision and what it costs are recorded under **What is
still missing**.

## How the derivation works

A byte in the outbound request is secret-derived **iff** changing a secret input changes it. For
every component-test fixture the generator:

1. Resolves the destination's declared `secretKeys` to their values in the fixture config, and
   collects every value the fixture's `metadata.secret` bag carries.
2. Runs the real transform **twice**. Anything that differs between two identical runs is
   non-deterministic — a nonce, a timestamp, a generated id — and is excluded so it can never
   be mistaken for a secret.
3. Runs it again per secret source with a **format-preserving decoy** substituted: same
   length, same character class per position, punctuation preserved, so length checks,
   format regexes, base64-decodability and UUID shape all behave identically and the decoy
   run takes the same branches.
4. Diffs the outputs. Fields that moved are secret-derived. One source is substituted at a time
   so that a source which destabilises the output can be named, rather than the failure being
   attributed to the destination as a whole.
5. Emits the sorted set of paths that moved, in gjson/sjson dot notation.

The published contract is deliberately just a list of paths per destType. The consumer
replaces the value at each path; it is not asked to resolve config values, to know why a field
is sensitive, or to reason about how a credential was encoded on its way in. An earlier draft
returned `{from, encoding, prefix}` per field so a consumer could mask only the credential
substring and keep `Bearer ` visible — that bought very little and pushed a failure mode onto
the consumer (forget to fall through when the value can't be located, and you leak).

The one cost: `endpoint` is never masked, so the ~14 destinations with a credential in the URL
keep it visible. That is a deliberate trade — a URL is already exposed to proxies, to TLS SNI
and in the provider's own access logs, and it is the most useful field for diagnosing a delivery
failure — but it is not free, so the generator classifies and records each one in
`endpointExposures` rather than dropping it silently. `url` means the URL _is_ the shared secret
(a webhook with no separable parameter); `query` means a credential that belongs in `params`,
where it would be masked, was concatenated into the endpoint string instead, and is fixable in
that destination's transform without changing anything on the wire.

Two checks stop plausible-looking noise from getting in:

- **Corroboration.** Each key is substituted with _two different_ decoys. A field that truly
  carries the secret takes a different value each time. A field that merely broke as a side
  effect — a lookup whose mocked response stopped matching, so the id it contributed became
  `undefined` — collapses to the same value both times and is rejected. Without this,
  gladly's endpoint was being recorded as secret-bearing when it is not.
- **Shape stability.** If substituting a decoy changes the number of requests or fields, the
  transform took a different branch, positions no longer line up, and the destination is
  marked unresolved rather than guessed at.

One thing the diff rule cannot see, and the single exception to it: a field that differs between
two identical real runs is excluded from attribution — rightly, or a nonce would be blamed on
whichever input was perturbed — but exclusion is not the same as carrying no credential.
`TWITTER_ADS` and `X_AUDIENCE` sign with OAuth1, so `headers.Authorization` holds a fresh
`oauth_nonce` on every run as well as `oauth_token="<the bag's access token>"`; excluded from the
diff, the whole header read as nothing to mask. So a non-deterministic leaf is also checked for
**containment** of a runtime-bag value, through `carriesSecret` — the same encoding-aware test the
validator searches with, because OAuth1 percent-encodes its parameter values and a bare `includes`
would miss exactly what the validator then reports as a survivor. Containment is sound only for
the bag and stays scoped to it: that is the one source whose plaintext the generator is holding,
where finding the value is direct evidence rather than the guess it would be against a config
secret that may have been hashed, signed or base64'd on the way in.

Anything the derivation cannot cover gets `null` in `destinations` — mask everything — with the
reason recorded in `unresolved` for counting. The consumer never classifies reason strings: the
decision is already data in the value it reads. `null` rather than a sentinel path like `["*"]`
because the fail-closed case is the _absence_ of an answer, not a path; a path-shaped spelling
invites being passed to `sjson.Set`, where `*` is a gjson wildcard that replaces the first
top-level key and returns no error — masking nothing while destroying the body, on exactly the
destinations we are least confident about. `null` also makes "absent from the map" and
"uncomputable" the same case, which is what they always were.

Two reasons mean there is nothing to mask and get an empty list: `no-declared-secrets` and
`no-http-request`. The first now means both sources came up empty — no config field is declared a
credential _and_ no fixture hands the destination a `metadata.secret` bag — so there is no secret
for it to put anywhere. The way to widen the configured half is to populate `secretKeys` in
`rudder-integrations-config`; the derivation follows the registry rather than second-guessing it.
The runtime half needs no declaration, but it does need a fixture that carries a bag, which is
the gap this reason still covers for an OAuth destination whose corpus has none.

`no-secret-located` is also empty: the destination declares credentials, and perturbing every
one of them moved nothing in the request. That normally means the declared key serves a
different flow — AM declares `apiSecret` and MP `gdprApiToken`, both belonging to the deletion
API, and deletion never records a destination live event at all (rudder-server records them
from the processor, the router and the batch router; regulation-worker does not). So the
declared credential cannot reach the surface this list protects.

`endpoint-only` is the fourth empty list, and the one that is a policy outcome rather than a
finding: the credential _was_ located, in the one field excluded from masking. It is kept
distinct from `no-secret-located` because the two make opposite claims about whether a secret is
there at all, and an empty list on its own cannot tell them apart.

`no-definition` is the fifth: no destination definition could be read at all. It is kept
distinct from `no-declared-secrets` so the two stay countable, but masks the same — a destination
with no definition cannot be configured in the control plane, so it holds no customer credentials.
Both cases today are internal: a test-only destination, and a proxy-only variant that ships no
transform. The risk this accepts is a real destination whose definition disappears upstream
quietly becoming unmasked; `--check` is what catches that, failing CI with
`["headers.Authorization"] -> []` in the diff rather than letting it land silently.

Completeness of the _configured_ half is bounded by `secretKeys`, deliberately. A destination that
builds request _field names_ from its own config — HTTP uses `{ [config.apiKeyName]:
config.apiKeyValue }`, WEBHOOK copies user-configured header names through — gets the names its
fixtures happened to use. A header a workspace names itself is not masked unless `secretKeys`
names the config field it comes from. That follows from the registry being the source of truth,
and the fix is upstream.

The _runtime_ half is bounded instead by the corpus: a destination is known to be handed a bag
only because one of its fixtures carries one. 18 of the 24 OAuth destinations derive their
credential; the other six were each checked, and none is a gap. `BINGADS_AUDIENCE` and
`YANDEX_METRICA_OFFLINE_EVENTS` emit no headers and read no token, so there is no credential in
what they build. `BINGADS_OFFLINE_CONVERSIONS` and `SALESFORCE_BULK_UPLOAD` ship no transform here
and are absent from the manifest, which by the contract already means mask-everything.
`SALESFORCE_OAUTH` is a networkHandler with no transform. `GA` reads a token only in its
`deleteUsers` flow, which never records a destination live event.

The reasons that fail **closed** — `no-fixtures`, `unstable-under-substitution`,
`dynamic-key-family`, `harness-error` — are the ones where the derivation could neither place a
declared credential nor rule it out. No destination is in any of them today.

The consumer-facing contract — path notation, the `#` array rule, the `null` case — lives in
`swagger/components/schemas/features.yaml`, next to the endpoint rather than next to the
generator.

## Running it

```bash
# whole corpus
node test/secret-paths/run.js --integrations-config=<path-to-rudder-integrations-config>/src/configurations/destinations

# a few destinations
node test/secret-paths/run.js --destination=klaviyo,ga4 --integrations-config=<path>

# show every finding as it is made
SECRET_PATHS_DEBUG=1 node test/secret-paths/run.js --destination=gladly --integrations-config=<path>

# replay the corpus against the committed paths and report leaks + coverage
node test/secret-paths/run.js --validate --integrations-config=<path>

# CI mode: derive, compare against the committed file, exit 1 on any difference
node test/secret-paths/run.js --check --integrations-config=<path>

# typecheck the tooling - test/ is excluded from the repo tsconfig and eslintignore, so this
# is the only thing that checks it
npx tsc --noEmit -p tsconfig.secret-paths.json
```

Output is written to `src/secretPaths/secretPaths.json` and committed, so the manifest ships
in the same image as the transform code it describes.

`run.js` transpiles TypeScript in-process with esbuild (already a dependency) rather than
adding ts-node, and provides the small `jest` surface the fixtures' `mockFns` use — mostly
`jest.spyOn(Date, 'now')` to pin the clock, which is exactly the determinism the derivation
wants. Anything outside that surface throws and the destination is recorded as unresolved.

## How it is served

`GET /features` carries a `secretPaths` field: destType -> paths to mask.

It rides `/features` rather than a dedicated endpoint because it is the same shape as the
`routerTransform` and `transformerProxy` maps already there, and because the data plane already
polls and caches that endpoint — so the consumer needs no new client code. The cost is ~9 KB
added to a ~3 KB payload polled every 10s (`Transformer.pollInterval`), under a kilobyte per
second per pod on a cluster-internal link.

Shipping it with the capability flags also removes any window in which a consumer holds
capabilities from one build and paths from another — which a separate endpoint made possible
and needed a version guard to detect.

Serving it from the transformer — rather than publishing it to integrations-config — keeps the
paths and the code that produces them in lockstep. The transformer deploys independently of the
data plane, so paths published anywhere else could describe a build that is no longer running.

## Staying in sync

`--check` derives the manifest and compares it to the committed file, exiting non-zero on any
difference. `.github/workflows/secret-paths.yml` runs it on every PR. Three things it catches,
none of which needs anyone to remember this file exists:

- a **new destination** with no entry — it derives one and finds nothing committed;
- a **transform change that moves a credential** — a header renamed, a key moved into the body,
  a token that starts being fetched rather than read from config;
- a **`secretKeys` change upstream** that has masking consequences.

The comparison is a plain byte comparison: the committed file must be exactly what the run
would write. That is only honest because the artifact holds nothing that varies by environment —
no build stamp, no content hash — so the same code and the same `secretKeys` produce the same
bytes on a laptop and on a runner. Two things keep it that way: keys are sorted on the way out,
because directory enumeration order is not guaranteed to agree between machines, and the file is
in `.prettierignore`, so `npm run lint` cannot reformat what the generator just wrote.

The one thing it deliberately does _not_ compare is upstream `secretKeys` directly. A
`secretKeys` change with no effect on where credentials land changes nothing in `destinations`
and passes — the check fails on masking consequences, not on upstream churn. The cost is that a
consequential upstream change turns a transformer PR red that did not cause it; the pinned
`INTEGRATIONS_CONFIG_REF` in the workflow bounds when that can happen.

## What is still missing

This is a POC. Known gaps:

- **`--validate` reports rather than gates.** It finds real leaks — it found
  two while being written — but a handful of fixture
  secrets are short enough to collide with ordinary data (LEMNISK's is `1234`). Gating needs
  either distinctive fixture values or a committed baseline of accepted collisions.
- **`secretKeys` is read from a local checkout** via `--integrations-config`. A real build
  would consume the published destination definitions.
- **Fixture quality bounds what can be concluded**, tracked in INT-7221 — fixture-only work,
  independent of this tooling. Five destinations hold credential values that are too short,
  identical to ordinary data in the same fixture, or spelled differently between cases
  (`LEMNISK`, `FB_CUSTOM_AUDIENCE`, `EMARSYS`, `GA4`, `CLICKSEND`); four destinations' paths rest
  on a single fixture case; `ELOQUA` declares a credential no fixture populates. That accounts for
  five of the six `--validate` survivors. The sixth, `KLAVIYO`, is **not** a fixture problem — it
  routes `privateApiKey` through `maskedSecrets.ts` correctly and its value is distinctive, so its
  survivor is a candidate real finding and needs triaging here rather than upstream.
  Note the registry cannot replace the corpus for discovery: `config.auth.type === 'OAuth'` looks like the
  authoritative statement of "this destination is handed a bag", but four destinations read
  `metadata.secret` without declaring it — `FACEBOOK_OFFLINE_CONVERSIONS`, `SALESFORCE`,
  `WOOTRIC` and `YAHOO_DSP` — so gating discovery on it would lose coverage rather than gain
  precision. What the registry could add is the _other_ direction: a destination that declares
  OAuth and has no case to derive from could fail closed rather than claim nothing to mask. That
  is a real behaviour change for those destinations, so it is recorded here rather than folded
  into this change.
- **The corpus scan over-includes, harmlessly.** `generateMetadata` in `test/integrations/testUtils.ts`
  attaches `secret: { accessToken: … }` to every case it builds, so 59 destinations look like they
  are handed a bag whether or not they are. A destination that never reads it derives nothing and
  still publishes `[]`, so no path is wrong; the cost is that those destinations now run a
  derivation they used to skip, and land on `no-secret-located` rather than `no-declared-secrets`.
  Distinguishing a real bag from the harness default is what the registry direction above would buy.
- **Over-masking is accepted, by decision.** Everything under `metadata.secret` is treated as a
  credential because nothing declares which of its keys are, so non-credentials in the bag are
  masked too: `TIKTOK_AUDIENCE`'s bag carries `advertiserIds`, which its transform emits as the
  request field `advertiser_ids`, so the derived path is now `body.JSON.advertiser_ids.#` and the
  advertiser IDs stop being visible. The cost is a less useful live event; the alternative is
  guessing at credential-looking key names, which fails in the direction that publishes a token.
- **Tokens fetched during transform** are covered by perturbing the mocked auth response
  instead of the config, but only for destinations whose fixtures mock that exchange. One
  whose auth call is not mocked still cannot be derived, and fails closed.
- **Coverage is bounded by the fixture corpus.** A branch no fixture exercises yields no
  entry. A destination with no fixtures at all is probed with one synthetic event instead: if
  the transform succeeds and returns nothing request-shaped — warehouse and object-storage
  destinations return rows or the message itself — there is nothing in a request to mask. A
  probe the transform _rejects_ proves nothing and leaves the destination fail-closed.
- **The consumer side does not exist yet** — rudder-server still has to fetch this and apply
  it when building the live event.
