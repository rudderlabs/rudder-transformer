# Secret-path derivation

This tooling derives the destination credential paths published by `GET /features` so a consumer can mask transformed delivery requests before exposing them in Live Events. Derivation is build-time only; the committed artifact is loaded once at runtime.

## Contract

`src/secretPaths/secretPaths.json` is directly:

```ts
type SecretPaths = Record<string, string[] | null>;
```

For each destination type:

- a path list is the complete set of known maskable secret-derived request paths;
- `[]` means the corpus positively found nothing maskable;
- `null` means derivation was inconclusive and the consumer must fail closed;
- a missing destination in a present map is treated like `null` by the consumer.

There is no envelope, version, timestamp, source reference, diagnostic reason, or wildcard fail-closed sentinel in the artifact. Destination keys and path lists are sorted. Paths use gjson/sjson notation: literal `.`, `*`, `?`, and `\` are escaped, arrays use `#`, and bracketed or numeric object keys remain literal. The top-level `endpoint` field is the only excluded surface and is never emitted.

## Inputs

Configured credentials come only from each destination definition's `config.secretKeys` in `rudder-integrations-config/src/configurations/destinations`. Every value under fixture `metadata.secret` is also a credential source because the runtime bag has no per-key declaration. Names that merely look sensitive are not inferred.

A transformer destination without a matching definition fails generation. The only identity aliases are:

- `rudder_test` -> `test_destination`
- `salesforce_oauth_sandbox` -> `salesforce_oauth`

The fixture corpus includes transform cases from `processor/`, `router/`, and `dataDelivery/`. Request-shaped data-delivery fixtures are inspected directly; processor and router fixtures invoke their real transform routes. Optional fixture directories may be absent.

CI and the committed artifact use the integrations-config `develop` branch, which is the contract's definition source.

## Derivation

For each fixture case and secret source, the generator:

1. Runs the unchanged transform twice and excludes leaves that vary between the two runs.
2. Replaces one source with format-preserving decoy A, preserving length, character classes, and punctuation.
3. Rewrites matching mocks as needed, runs the transform, and verifies request and leaf counts match the baseline.
4. Repeats with distinct decoy B.
5. Accepts a leaf only when baseline differs from decoy A and decoy B differs from decoy A.
6. Unions accepted locations across cases, drops request indices, collapses arrays to `#`, removes child paths covered by a parent, and sorts the result.

If either decoy cannot differ from the original, a decoy run fails, or request/leaf counts change, the destination is `null` with the diagnostic `unstable-under-substitution`. A dynamically numbered object-key family such as AWIN `params.bd[N]` collapses to its containing object (`params`); a top-level family fails closed.

Destinations that exchange a declared config credential for a token get a second, grounded pass. It is eligible only for mocked auth exchanges initiated with values from declared `secretKeys`; only response values are perturbed and shared token caches are bypassed. The same baseline, two-decoy, and shape rules apply. This derives `headers.Authorization` for SFMC and MARKETO without guessing credential-looking response fields.

Generator diagnostics such as `no-declared-secrets`, `no-secret-located`, `endpoint-only`, and `unstable-under-substitution` are console-only. They do not alter the direct-map wire shape.

## Independent validation

The validator replays the corpus independently, applies committed paths using the shared path parser, then searches every maskable request field for declared/runtime secret values and reversible encodings. It excludes only top-level `endpoint` and replaces matched fields with exactly `******`.

Known fixture-value collisions are committed in `validation-baseline.json` with their source and leaf path. Validation fails on either additions or removals, so the baseline cannot silently grow and a resolved collision must be removed. The validator shares request plumbing and path grammar with generation, but not causality or secret-source selection logic.

## Commands

```bash
CONFIG=/path/to/rudder-integrations-config/src/configurations/destinations

# Regenerate and write the committed map
npm run generate:secret-paths -- --integrations-config="$CONFIG"

# Derive and byte-compare without writing
npm run check:secret-paths -- --integrations-config="$CONFIG"

# Mask then search; fail on survivor-baseline drift
npm run validate:secret-paths -- --integrations-config="$CONFIG"

# Restrict derivation to selected destinations
npm run generate:secret-paths -- --destination=klaviyo,ga4 --integrations-config="$CONFIG"

# Typecheck build-time tooling
npm run typecheck:secret-paths
```

`test/secret-paths/run.js` parses command options and starts a dedicated in-band Jest entry under `jest.config.js`, so fixtures use the repository's real TypeScript transform, setup files, and mock APIs. Each npm command builds the sandbox bundles first. `--check` compares exact generated bytes and prints destination/path drift. `.prettierignore` keeps the generated JSON outside formatter scope.

## Runtime publication

`src/secretPaths/index.ts` imports the committed JSON directly, and `src/features.ts` always publishes it. `src/services/misc.ts` serializes the complete feature payload once at module load so repeated `GET /features` calls return stable cached bytes. Runtime code intentionally does not derive or validate the artifact; generation, structural checks, drift checks, and independent corpus validation are PR-time responsibilities.

## Coverage boundary

The map describes behavior exercised by component fixtures. A stable run that does not locate a declared credential produces `[]`; this may mean the credential belongs only to a flow absent from Live Events, or that fixture coverage is incomplete. Fix missing `secretKeys` in integrations-config and missing transform branches in the fixture corpus rather than adding hand-authored destination paths. Endpoint credentials remain visible by policy; query credentials should be moved to structured `params` by their destination transform.
