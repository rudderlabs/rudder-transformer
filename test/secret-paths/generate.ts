/* eslint-disable no-console, no-await-in-loop, no-restricted-syntax, no-continue */
// This is a build-time generator, not shipped runtime code, so the test-only packages it
// drives (supertest, axios-mock-adapter, http-terminator) are correctly devDependencies.
/* eslint-disable import/no-extraneous-dependencies */
/**
 * Derives the `secretPaths` map carried on GET /features.
 *
 * The rule: a byte in the outbound request is secret-derived iff changing a secret input
 * changes it. So for every component-test fixture we run the real transform twice (to find
 * non-deterministic fields) and then once per secret source with a format-preserving decoy
 * substituted, and record which output leaves moved.
 *
 * Nothing here is hand-authored per destination. There are two secret sources, and between them
 * they cover the two ways a destination is handed a credential:
 *
 *   CONFIGURED - `secretKeys` from the destination definition, the source of truth for which
 *   config fields are credentials. Perturbed by name, wherever that key appears in a config.
 *
 *   RUNTIME - the `metadata.secret` bag the control plane mints per OAuth account and
 *   rudder-server forwards verbatim. Nothing declares its keys, so every value under it is
 *   treated as a credential and perturbed by position. See `visitRuntimeSecrets`.
 *
 * Usage (run.js is the entry point):
 *   npm run generate:secret-paths -- --destination=klaviyo,ga4
 *   npm run generate:secret-paths                        # whole corpus
 *
 * `--integrations-config` points at a rudder-integrations-config checkout; a production
 * build would read the published destination definitions instead.
 */
import fs from 'fs';
import cloneDeep from 'lodash/cloneDeep';
import path, { join } from 'path';
import { getTestData } from '../integrations/testUtils';
import type { SecretPaths } from '../../src/secretPaths';
import { implementedDestinations, loadDeclaredSecretKeys, probeConfigFor } from './declared';
import { argOf, hasFlag } from './args';
import type { MockMatching } from './harness';
import {
  carriesSecret,
  configSecretsFor,
  DATA_DELIVERY_FIXTURE_ROUTE,
  Harness,
  fixturesByDestination,
  isDerivableCase,
  requestsIn,
  runtimeSecretsFor,
  startHarness,
  visitConfigSecrets,
  visitRuntimeSecrets,
} from './harness';
import {
  ARRAY_MARKER,
  ENDPOINT_FIELD,
  collapseArrayMarkers,
  escapeSegment,
  formatPath,
  parsePath,
} from '../../src/secretPaths/path';

type EndpointExposure = 'query' | 'url';
type UnresolvedReason =
  | 'dynamic-key-family'
  | 'endpoint-only'
  | 'harness-error'
  | 'no-declared-secrets'
  | 'no-fixtures'
  | 'no-http-request'
  | 'no-secret-located'
  | 'unstable-under-substitution';

const MASKING_FOR_REASON: Record<UnresolvedReason, string[] | null> = {
  'dynamic-key-family': null,
  'endpoint-only': [],
  'harness-error': null,
  'no-declared-secrets': [],
  'no-fixtures': null,
  'no-http-request': [],
  'no-secret-located': [],
  'unstable-under-substitution': null,
};

const OUT_FILE = join(__dirname, '../../src/secretPaths/secretPaths.json');

const debug = (message: string): void => {
  if (process.env.SECRET_PATHS_DEBUG) console.log(`\n    [debug] ${message}`);
};

// ---------------------------------------------------------------------------
// Decoys
// ---------------------------------------------------------------------------

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();
const DIGITS = '0123456789';

/**
 * Same length, same character class at each position, different value. Keeps length checks,
 * format regexes, base64-decodability and UUID shape behaving identically so the decoy run
 * takes the same branches as the real one.
 *
 * `seed` produces a second, distinct decoy - see the corroboration check in the derivation.
 */
export const decoyOf = (value: string, seed = 1): string =>
  [...value]
    .map((ch, i) => {
      const shift = ((i + seed * 3) % 7) + seed;
      if (DIGITS.includes(ch)) return DIGITS[(DIGITS.indexOf(ch) + shift) % DIGITS.length];
      if (LOWER.includes(ch)) return LOWER[(LOWER.indexOf(ch) + shift) % LOWER.length];
      if (UPPER.includes(ch)) return UPPER[(UPPER.indexOf(ch) + shift) % UPPER.length];
      return ch; // punctuation and separators are structural - leave them alone
    })
    .join('');

const decoysFor = (value: string): [string, string] | null => {
  const first = decoyOf(value, 1);
  const second = decoyOf(value, 2);
  return first !== value && second !== value && first !== second ? [first, second] : null;
};

export interface FlattenedOutput {
  /** `req[n]|headers.Authorization` -> value */
  leaves: Map<string, string>;
  /** How many request-shaped objects were found, used to detect misalignment. */
  requestCount: number;
}

export const hasSameShape = (expected: FlattenedOutput, actual: FlattenedOutput): boolean =>
  actual.requestCount === expected.requestCount && actual.leaves.size === expected.leaves.size;

/**
 * A leaf's address: which request it belongs to, and its path within that request.
 *
 * Built and parsed side by side deliberately - `|` is the one separator `escapeSegment` does not
 * escape, so a top-level request field containing one would silently truncate its path.
 */
const locationKey = (index: number, field: string): string =>
  `req[${index}]|${escapeSegment(field)}`;

/** The path half of a `req[n]|path` location key. */
const pathOf = (loc: string): string => loc.split('|')[1];

/**
 * Flattens the output into `location -> string`, keeping only request-shaped objects.
 *
 * Requests are numbered by a counter in traversal order, deliberately not by how many
 * leaves have been collected so far. Keying off the running leaf count means one extra or
 * missing header in an earlier request shifts the identity of every later one, so unrelated
 * requests get compared against each other and produce phantom differences.
 */
export const flattenRequests = (output: unknown): FlattenedOutput => {
  const leaves = new Map<string, string>();

  const addLeaf = (prefix: string, value: unknown) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      // Array positions are marked so they can be collapsed to a wildcard when the manifest is
      // emitted. Without the marker an index is indistinguishable from a key that merely looks
      // like one - AWIN really does send a param literally named `bd[0]` - and the emitted path
      // would either address a non-existent array element or pin masking to the element count
      // that one fixture happened to have.
      value.forEach((item, i) => addLeaf(`${prefix}.${ARRAY_MARKER}${i}`, item));
      return;
    }
    if (typeof value === 'object') {
      for (const k of Object.keys(value as Record<string, unknown>)) {
        addLeaf(`${prefix}.${escapeSegment(k)}`, (value as Record<string, unknown>)[k]);
      }
      return;
    }
    leaves.set(prefix, String(value));
  };

  // `requestsIn` is the single definition of "this object is an outbound request", shared with
  // the validator. A second copy here would let the two tools inspect different sets of requests
  // while both reporting success.
  const requests = requestsIn(output);
  requests.forEach((node, index) => {
    // Every field, not just headers/params/body/endpoint. MOVABLE_INK puts its accessKey at
    // the top level of the request, and anything not walked here is invisible to the diff -
    // which means it is never masked, however plainly it carries a credential.
    for (const field of Object.keys(node)) {
      addLeaf(locationKey(index, field), node[field]);
    }
  });

  return { leaves, requestCount: requests.length };
};

// ---------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------

export interface CaseOutcome {
  locations: Movement[];
  sawRequest: boolean;
  /**
   * Whether any case transformed successfully at all. `no-http-request` is the only reason that
   * fails OPEN, so it has to be proved rather than inferred: "no case produced a request" is
   * equally consistent with a destination that builds none and with a harness that could not run
   * one - a missing esbuild sandbox bundle made every HTTP case 500 and published `[]` for a
   * destination that sends an Authorization header.
   */
  transformed: boolean;
  /** The secret source - declared key or the runtime bag - that destabilised the diff, if any. */
  unstableSource?: SecretSource;
  /**
   * Whether the runtime bag was ever compared cleanly - both decoy runs completed and the diff
   * was trustworthy - in at least one case. Distinct from "it found something": a clean
   * comparison that moved nothing is still evidence about where the bag does not go.
   */
  runtimeMeasured?: boolean;
  /** Set when a fixture file failed to load - a corpus defect, not a finding. */
  harnessError?: string;
}

export interface Baseline {
  runA: FlattenedOutput;
  /** Locations that differ between two identical real runs, so cannot be secret-derived. */
  nonDeterministic: Set<string>;
}

interface BaselineResult {
  /** The transform ran to its expected status. Distinguishes "builds no request" from "failed". */
  transformed: boolean;
  /** Present only when the case actually produced a request to diff. */
  baseline?: Baseline;
}

/** Establishes the baseline: the real output, plus the fields that vary on their own. */
const runBaseline = async (
  harness: Harness,
  tcData: any,
  originalBody: unknown,
  /** Runs before each transform - the fetched-credential pass re-registers its mocks here. */
  beforeRun: () => void = () => {},
): Promise<BaselineResult> => {
  // Two identical real runs. Anything that differs between them is non-deterministic - a
  // nonce, a timestamp, a generated id - and must never be attributed to a secret.
  beforeRun();
  const realA = await harness.runCase(tcData, cloneDeep(originalBody));
  if (!realA) return { transformed: false };
  beforeRun();
  const realB = await harness.runCase(tcData, cloneDeep(originalBody));
  if (!realB) return { transformed: false };

  const runA = flattenRequests(realA);
  const runB = flattenRequests(realB);
  // Ran, but built nothing to diff - an error-path fixture, say. Nothing to derive from, and
  // diffing an empty baseline against a decoy would read any difference as instability.
  if (runA.leaves.size === 0) return { transformed: true };

  const nonDeterministic = new Set<string>();
  for (const [loc, value] of runA.leaves) {
    if (runB.leaves.get(loc) !== value) nonDeterministic.add(loc);
  }
  return { transformed: true, baseline: { runA, nonDeterministic } };
};

/**
 * What one perturbation targets.
 *
 * A union rather than a list of key strings with one reserved value: the two sources are matched
 * differently - a declared key by name, the bag by position - and a reserved string would sit in
 * the same namespace as the registry's own entries while nothing enforced the separation.
 * `secretKeys` entries are not always plain keys (`webhook` and `pipedream` declare `headers.to`),
 * so "no destination could declare this" was an assumption, not a fact.
 */
export type SecretSource = { kind: 'config'; key: string } | { kind: 'runtime' };

/** How a source names itself in diagnostics: `unstable under 'clientSecret'` / `'metadata.secret'`. */
const sourceName = (source: SecretSource): string =>
  source.kind === 'config' ? source.key : 'metadata.secret';

/** The values this source contributes to one fixture body, subject to the shared length rule. */
export const valuesFor = (source: SecretSource, body: unknown): string[] =>
  source.kind === 'config' ? configSecretsFor(body, source.key) : runtimeSecretsFor(body);

/** Rewrites this source's values in place, by name for a config key and by position for the bag. */
const rewriteWith = (
  source: SecretSource,
  body: unknown,
  visit: (current: string) => string,
): void => {
  if (source.kind === 'config') visitConfigSecrets(body, source.key, visit);
  else visitRuntimeSecrets(body, visit);
};

/**
 * One field that moved when an input was perturbed, with the evidence that proved it.
 *
 * The two values travel with the location rather than being consumed on the spot, so that policy
 * questions - is this field excluded? where in the URL does the credential sit? - are answered
 * once, at the point paths are collapsed, instead of inside each producer. There are two
 * producers (config-driven and fetched-credential), and classifying in one of them is how the
 * other silently escapes the policy.
 */
export interface Movement {
  /** `req[n]|headers.Authorization` - the request index is dropped when paths are collapsed. */
  loc: string;
  /** The declared config key or runtime bag that moved this field. */
  source?: string;
  /**
   * What the field held before and after the perturbation.
   *
   * Retained only for the excluded field, whose classifier is the sole reader - see
   * `withoutUnreadEvidence`. Keeping it for every movement would pin two copies of every moved
   * leaf for a whole destination's corpus, and a destination that emits its payload as one
   * stringified leaf moves a 50-500 KB value per fixture case per declared key.
   */
  evidence?: Evidence;
}

/** The before-and-after that proved a field moved. */
interface Evidence {
  real: string;
  decoy: string;
}

/**
 * Classifies a secret-carrying endpoint by where the credential sits in it.
 *
 * Decoys are length- and structure-preserving, so the real and decoy URLs differ only where the
 * credential itself appears. Any differing byte after the `?` means a query parameter, which is
 * fixable at the source; differences confined to the host and path mean a URL that *is* the
 * secret. Every offset is checked, not just the first: a destination whose subdomain is also
 * declared differs early, and stopping there would report the whole thing as an unfixable `url`
 * and hide the actionable half.
 */
const classifyEndpoint = ({ real, decoy }: Evidence): EndpointExposure => {
  const queryStart = real.indexOf('?');
  if (queryStart < 0) return 'url';
  for (let i = queryStart + 1; i < real.length; i += 1) {
    if (real[i] !== decoy[i]) return 'query';
  }
  return 'url';
};

/**
 * Non-deterministic leaves that carry a runtime-bag value verbatim.
 *
 * The diff rule cannot see these. A field that differs between two identical real runs is
 * excluded from attribution - rightly, since a nonce that changes on its own would otherwise be
 * blamed on whichever input was perturbed - but exclusion is not the same as "carries no
 * credential". TWITTER_ADS and X_AUDIENCE sign with OAuth1, so `headers.Authorization` holds a
 * fresh `oauth_nonce` on every run *and* `oauth_token="<the bag's access token>"`. Excluded from
 * the diff, the whole header read as nothing to mask.
 *
 * Containment is sound where the diff is not, and only here: the runtime bag is the one source
 * whose plaintext we are holding, so `value.includes(secret)` is direct evidence rather than the
 * guess that value-matching would be against a config secret that may have been hashed, signed or
 * base64'd on its way into the request. It stays narrowly scoped for that reason - non-
 * deterministic leaves only, runtime bag only. Everything deterministic is already the diff's job,
 * and a containment test there would mask any field that merely happened to equal a bag value.
 */
const secretCarriersIn = (
  locations: Iterable<string>,
  baseline: Baseline,
  secrets: string[],
): Movement[] => {
  const found: Movement[] = [];
  for (const loc of locations) {
    const realValue = baseline.runA.leaves.get(loc);
    if (realValue === undefined) continue;
    // `carriesSecret`, not a bare `includes`: OAuth1 percent-encodes every parameter value, so a
    // realistic base64-shaped token reaches the header as `oauth_token="ab%2Bcd%2Fef%3D"`. The
    // validator has always searched for the encoded forms; the generator has to look for the same
    // ones, or it under-finds exactly what the validator then reports as a survivor.
    if (!secrets.some((secret) => carriesSecret(realValue, secret))) continue;
    debug(
      `${loc} from=metadata.secret (contains a bag value)` +
        `\n            real =${JSON.stringify(realValue).slice(0, 90)}`,
    );
    // No decoy ran for this leaf, so there is no before-and-after to attach. `exposureOf` reads
    // evidence only to tell a `query` exposure from a `url` one, and falls back to `url` - the
    // unfixable classification - which is the safe way round for a field nothing measured.
    found.push({ loc, source: 'metadata.secret' });
  }
  return found;
};

/** Compares the baseline against two decoy runs and reports what moved because of one source. */
export const locationsForKey = (
  source: string | undefined,
  baseline: Baseline,
  decoy: FlattenedOutput,
  decoy2: FlattenedOutput,
): Movement[] => {
  const found: Movement[] = [];
  for (const [loc, realValue] of baseline.runA.leaves) {
    if (baseline.nonDeterministic.has(loc)) continue;
    // An empty decoy value carries no secret, so treating it like a miss is correct.
    const decoyValue = decoy.leaves.get(loc) ?? '';
    if (decoyValue === '' || decoyValue === realValue) continue;

    // Corroboration: a field that genuinely carries the secret takes a *different* value for
    // every distinct decoy. A field that merely broke as a side effect of the substitution -
    // a lookup whose mocked response stopped matching, say, so the id it contributed became
    // `undefined` - collapses to the same value both times. Without this check that collapse
    // reads as "secret-derived" and gets masked.
    if (decoy2.leaves.get(loc) === decoyValue) continue;

    debug(
      `${loc} from=${source}` +
        `\n            real =${JSON.stringify(realValue).slice(0, 90)}` +
        `\n            decoy=${JSON.stringify(decoyValue).slice(0, 90)}`,
    );
    found.push({ loc, source, evidence: { real: realValue, decoy: decoyValue } });
  }
  return found;
};

const deriveForCase = async (
  harness: Harness,
  destination: string,
  tcData: any,
  secretSources: SecretSource[],
  matching: MockMatching,
): Promise<CaseOutcome> => {
  const outcome: CaseOutcome = { locations: [], sawRequest: false, transformed: false };
  const originalBody = tcData.input.request.body;

  harness.useMocksFor(destination, undefined, matching);
  const { transformed, baseline } = await runBaseline(harness, tcData, originalBody);
  outcome.transformed = transformed;
  if (!baseline) return outcome;
  outcome.sawRequest = true;

  // One source at a time so the one responsible for an unstable diff can be named. The whole
  // destination fails closed either way - a partial path set is indistinguishable from a
  // complete one to a consumer - but which source destabilised it is the first thing anyone
  // investigating needs, and the run has it in hand right here.
  for (const source of secretSources) {
    // `valuesFor`/`rewriteWith` are the only place the two kinds differ; past them the sources
    // are the same measurement, so neither can drift away from the other's rules.
    const present = valuesFor(source, originalBody);
    if (present.length === 0) continue;
    if (present.some((value) => decoysFor(value) === null)) {
      debug(`unstable: '${sourceName(source)}' has no distinct decoys`);
      outcome.unstableSource = source;
      return outcome;
    }

    // Reads the baseline only - no decoy run is involved - so it is settled here, once, before
    // the substitution work for this source begins. Static data-delivery fixtures cannot be
    // recomputed from perturbed metadata, so containment is their complete request-surface rule;
    // transform fixtures keep the narrower non-deterministic-leaf recovery. (Data-delivery
    // fixtures are already-built proxy requests: perturbing `metadata.secret` cannot recompute a
    // header copied from it earlier, so containment over every leaf is the only evidence there.)
    if (source.kind === 'runtime') {
      const candidates =
        harness.routeFor(tcData) === DATA_DELIVERY_FIXTURE_ROUTE
          ? baseline.runA.leaves.keys()
          : baseline.nonDeterministic;
      outcome.locations.push(...secretCarriersIn(candidates, baseline, present));
    }

    // Build the decoy body and the matching mock rewrite together. The corpus matches mocks on
    // request headers, which carry the credential, so a decoy config without a decoy mock makes
    // the destination's own lookups miss - and that shape change reads as instability.
    const decoyBody = (seed: number) => {
      const body = cloneDeep(originalBody);
      const substitutions = new Map<string, string>();
      rewriteWith(source, body, (v) => {
        const decoy = decoyOf(v, seed);
        substitutions.set(v, decoy);
        return decoy;
      });
      harness.useMocksFor(destination, substitutions, matching);
      return body;
    };

    // The second run corroborates the first - see `locationsForKey`. Each is checked before the
    // next runs, so an unstable source does not cost a second full transform.
    const decoyRuns: FlattenedOutput[] = [];
    for (const seed of [1, 2]) {
      const out = await harness.runCase(tcData, decoyBody(seed));
      // No output: the decoy changed the outcome (validation rejected it, a different branch was
      // taken). A different number of requests, or of fields within them, means the same - the
      // positions no longer line up. Either way any diff would be noise, so fail closed.
      const run = out ? flattenRequests(out) : undefined;
      if (!run || !hasSameShape(baseline.runA, run)) {
        debug(
          run
            ? `unstable: '${sourceName(source)}' changed the shape (decoy ${seed}) - ` +
                `requests ${baseline.runA.requestCount}->${run.requestCount}, ` +
                `leaves ${baseline.runA.leaves.size}->${run.leaves.size}`
            : `unstable: '${sourceName(source)}' decoy ${seed} run produced no output`,
        );
        outcome.unstableSource = source;
        return outcome;
      }
      decoyRuns.push(run);
    }

    outcome.locations.push(
      ...locationsForKey(sourceName(source), baseline, decoyRuns[0], decoyRuns[1]),
    );
    // Reached only when both decoys ran and the shape held, so the diff for this source in this
    // case was trustworthy.
    if (source.kind === 'runtime') outcome.runtimeMeasured = true;
  }

  return outcome;
};

/**
 * Derives paths for a credential the destination *fetches* rather than reads from config.
 *
 * Same rule as the main pass - change one input, see what moves - with the mocked response as the
 * input instead of the config. Two things make it work that the main pass does not need: the
 * destination cache is bypassed, or the token from the first run is reused and nothing appears to
 * move; and only the response half of each mock is rewritten, because fixtures often use one
 * string for both the config password and the returned token, and rewriting the request half
 * would stop the auth call matching at all.
 *
 * Runs once for every destination that transformed, so a direct finding cannot hide a fetched
 * token; cases whose mocked responses carry no credential are skipped without a transform.
 */
interface FetchedCredentialOutcome {
  stable: boolean;
  locations: Movement[];
}

const deriveFromFetchedCredentials = async (
  harness: Harness,
  destination: string,
  declaredKeys: string[],
  filePaths: string[],
): Promise<FetchedCredentialOutcome> => {
  const locations: Movement[] = [];
  let stable = true;

  await harness.withoutCache(async () => {
    for (const filePath of filePaths) {
      let cases: any[];
      try {
        cases = getTestData(filePath);
      } catch {
        continue;
      }
      for (const tcData of cases) {
        if (!isDerivableCase(harness, tcData)) continue;
        const body = tcData.input.request.body;
        const candidates = harness.mockResponseSecrets(destination, body, declaredKeys);
        if (candidates.length === 0) continue;

        // The same two-run non-determinism rule as the config pass, not a second copy of it:
        // that rule is the soundness core of the whole derivation, and a fix applied to one copy
        // would silently miss this branch.
        const { baseline } = await runBaseline(harness, tcData, body, () =>
          harness.useMocksFor(destination),
        );
        if (!baseline) continue;

        for (const candidate of candidates) {
          const decoys = decoysFor(candidate);
          if (!decoys) {
            stable = false;
            return;
          }
          const decoyRuns: FlattenedOutput[] = [];
          for (const decoy of decoys) {
            harness.useMocksFor(destination, new Map([[candidate, decoy]]), 'strict', 'response');
            const out = await harness.runCase(tcData, cloneDeep(body));
            if (!out) break;
            decoyRuns.push(flattenRequests(out));
          }
          if (
            decoyRuns.length !== 2 ||
            decoyRuns.some((run) => !hasSameShape(baseline.runA, run))
          ) {
            stable = false;
            return;
          }
          // The same corroborated diff as the config pass, not a second copy of it.
          locations.push(...locationsForKey(undefined, baseline, decoyRuns[0], decoyRuns[1]));
        }
      }
    }
  });
  harness.useMocksFor(destination);
  return { stable, locations };
};

/**
 * Whether any fixture in this destination's corpus carries a runtime credential bag.
 *
 * Reads the fixtures only - no transforms - so asking the question costs a module load per file
 * rather than a derivation. That matters because it is asked of every destination, including the
 * ~50 that declare no `secretKeys` and would otherwise have stopped at the first check.
 *
 * Counts a bag only in a case the derivation can actually use, by the harness's own definition of
 * that rather than a second copy of it. The two have to agree: SALESFORCE_OAUTH ships a
 * networkHandler and no transform, so its only fixtures are `dataDelivery` ones, which build no
 * request from config and which `routeFor` therefore declines. Counting the bag there gated a
 * derivation that then had no case to run, and the destination failed closed as `harness-error` -
 * a defect reported about a destination that simply has no transform to derive from.
 *
 * The corpus rather than the registry, deliberately. `config.auth.type === 'OAuth'` reads like the
 * authoritative answer to "is this destination handed a bag", and it would be cheaper and would
 * not over-report the way the corpus does - `generateMetadata` attaches a `secret` object to every
 * case it builds. But it is not sound in the direction that matters: FACEBOOK_OFFLINE_CONVERSIONS,
 * SALESFORCE, WOOTRIC and YAHOO_DSP all read `metadata.secret` without declaring OAuth, so gating
 * on the registry would drop the source for destinations that genuinely use it. Over-reporting
 * costs a derivation that finds nothing; under-reporting publishes a token.
 *
 * A fixture that will not load is passed over rather than reported here: the same file is loaded
 * again by `deriveForDestination`, which records it as `harness-error` with the parse message
 * attached. Failing twice for one defect would just double the noise.
 */
const corpusCarriesRuntimeSecrets = (harness: Harness, filePaths: string[]): boolean =>
  filePaths.some((filePath) => {
    let cases: any[];
    try {
      cases = getTestData(filePath);
    } catch {
      return false;
    }
    return cases.some(
      (tcData) =>
        isDerivableCase(harness, tcData) && runtimeSecretsFor(tcData.input.request.body).length > 0,
    );
  });

const deriveForDestination = async (
  harness: Harness,
  destination: string,
  secretSources: SecretSource[],
  filePaths: string[],
  matching: MockMatching = 'strict',
): Promise<CaseOutcome> => {
  const total: CaseOutcome = { locations: [], sawRequest: false, transformed: false };

  for (const filePath of filePaths) {
    let cases: any[];
    try {
      cases = getTestData(filePath);
    } catch (err) {
      // A fixture that will not load is a corpus defect, not evidence about where a credential
      // lands. Labelling it `unstable-under-substitution` would hide a build problem behind a
      // security finding, so it gets its own reason.
      total.harnessError = `${filePath}: ${String(err).slice(0, 80)}`;
      return total;
    }

    for (const tcData of cases) {
      if (!isDerivableCase(harness, tcData)) continue;

      const outcome = await harness.withCaseEnv(tcData, () =>
        deriveForCase(harness, destination, tcData, secretSources, matching),
      );
      total.locations.push(...outcome.locations.map(withoutUnreadEvidence));
      total.sawRequest = total.sawRequest || outcome.sawRequest;
      total.transformed = total.transformed || outcome.transformed;
      total.runtimeMeasured = total.runtimeMeasured || outcome.runtimeMeasured;
      // Nothing this destination produces will be published once it is doomed, so stop paying
      // for transforms: the remaining cases and files cannot change the outcome.
      if (outcome.unstableSource) {
        total.unstableSource = outcome.unstableSource;
        return total;
      }
    }
  }

  return total;
};

/**
 * Collapses per-request locations into the sorted set of paths to mask. The per-request index
 * is dropped: a batched request repeats the same shape.
 *
 * See swagger/components/schemas/features.yaml for the notation - it is the one place the
 * consumer contract is stated.
 */
/**
 * Collapses a dynamically-numbered key family to the object that contains it.
 *
 * `bd[0]`-style keys come from a loop - AWIN emits one `bd[N]` param per product, each carrying
 * the declared `advertiserId` inside a pipe-delimited string - so the indices a fixture happens
 * to contain say nothing about a real request, and gjson/sjson cannot address the family
 * (`params.bd*` masks only the first match). Masking the containing object does cover it.
 *
 * This is coarser than a leaf path: AWIN's `params` also carries amount, currency and voucher
 * code, which are not secret and stop being visible. It is still strictly better than what it
 * replaces - failing the destination closed masked the headers and body as well.
 *
 * Returns null when the family sits at the top level, where there is no containing object.
 */
export const collapseKeyFamily = (path: string): string | null => {
  const segments = parsePath(path);
  const family = segments.findIndex((segment) => /\[\d+\]$/.test(segment));
  if (family === -1) return path;
  return family === 0 ? null : formatPath(segments.slice(0, family));
};

const CONFIG_DYNAMIC_HEADER_SOURCES: Record<string, string[]> = {
  CUSTOM_AUDIENCE: ['apiKeyValue'],
  HTTP: ['apiKeyValue'],
  PIPEDREAM: ['headers.to'],
  WEBHOOK: ['headers.to'],
};

/**
 * Some destinations use a declared secret as a header value while another config field supplies the
 * header name. A fixture can only prove one concrete child key, but production can emit any tenant
 * configured key; mask the containing headers object when that dynamic source moves a header leaf.
 */
export const collapseDynamicConfigHeader = (
  destination: string,
  path: string,
  source?: string,
): string => {
  if (
    source &&
    parsePath(path)[0] === 'headers' &&
    CONFIG_DYNAMIC_HEADER_SOURCES[destination.toUpperCase()]?.includes(source)
  ) {
    return 'headers';
  }
  return path;
};

/**
 * Applies the endpoint exclusion; see ENDPOINT_FIELD in src/secretPaths/path.ts for why.
 *
 * Both producers funnel through here, so the policy cannot be escaped by adding a third.
 */
export const toSecretPaths = (locations: Movement[], destination = ''): string[] =>
  [
    ...new Set(
      locations
        .map(({ loc, source }) => ({ path: pathOf(loc), source }))
        .filter(({ path: candidate }) => parsePath(candidate)[0] !== ENDPOINT_FIELD)
        // Collapse marked array positions to a wildcard. Fixtures only ever exercise as many
        // elements as they declare, so emitting the observed indices would leave every element
        // beyond that count unmasked in production.
        .map(({ path: candidate, source }) => ({
          path: collapseArrayMarkers(candidate),
          source,
        }))
        .map(({ path: candidate, source }) =>
          collapseDynamicConfigHeader(destination, candidate, source),
        )
        // A dynamically-numbered key family cannot be addressed directly, so it becomes the
        // object containing it. `null` means nothing contains it; the caller fails closed.
        .map(collapseKeyFamily)
        .filter((path): path is string => path !== null),
    ),
  ]
    .sort()
    // Masking an object covers its leaves, so restating them adds nothing.
    .filter(
      (path, _i, all) => !all.some((other) => other !== path && path.startsWith(`${other}.`)),
    );

/**
 * How the excluded endpoint carries a credential for this destination, if it does at all.
 *
 * `query` wins over `url` when both appear: it is the fixable half, and reporting the whole
 * destination as an unfixable `url` would hide the actionable finding.
 */
const exposureOf = (locations: Movement[]): EndpointExposure | undefined => {
  const endpoints = locations.filter((m) => pathOf(m.loc) === ENDPOINT_FIELD);
  if (endpoints.length === 0) return undefined;
  return endpoints.some((m) => m.evidence && classifyEndpoint(m.evidence) === 'query')
    ? 'query'
    : 'url';
};

/**
 * Drops the evidence nothing will read, at the one point per-destination accumulation happens.
 *
 * Kept out of the producers on purpose: deciding what to retain is the same policy question as
 * deciding what to publish, and putting it in a producer is how the other one escapes it.
 */
const withoutUnreadEvidence = (m: Movement): Movement =>
  pathOf(m.loc) === ENDPOINT_FIELD ? m : { loc: m.loc, source: m.source };

const sortedByKey = <T>(record: Record<string, T>): Record<string, T> =>
  Object.fromEntries(Object.entries(record).sort(([a], [b]) => (a < b ? -1 : 1)));

/**
 * The artifact's bytes. One definition, used both to write the file and to check it, so the two
 * cannot disagree about what "unchanged" means.
 */
export const validateSecretPaths = (secretPaths: SecretPaths): void => {
  const destinationKeys = Object.keys(secretPaths);
  const sortedDestinationKeys = [...destinationKeys].sort();
  if (JSON.stringify(destinationKeys) !== JSON.stringify(sortedDestinationKeys)) {
    throw new Error('Secret-path destination keys must be sorted');
  }

  for (const [destType, paths] of Object.entries(secretPaths)) {
    if (paths === null) continue;
    const sortedPaths = [...paths].sort();
    if (
      new Set(paths).size !== paths.length ||
      JSON.stringify(paths) !== JSON.stringify(sortedPaths)
    ) {
      throw new Error(`Secret paths for ${destType} must be unique and sorted`);
    }
    for (const secretPath of paths) {
      const segments = parsePath(secretPath);
      if (
        secretPath !== formatPath(segments) ||
        segments.some((segment) => segment.length === 0) ||
        segments[0] === ARRAY_MARKER ||
        segments[0] === ENDPOINT_FIELD
      ) {
        throw new Error(`Invalid secret path for ${destType}: ${secretPath}`);
      }
    }
  }
};

export const serialise = (secretPaths: SecretPaths): string => {
  validateSecretPaths(secretPaths);
  return `${JSON.stringify(secretPaths, null, 2)}\n`;
};

/**
 * `--check`: fails unless the committed file is byte-for-byte what this run would write.
 *
 * This is what makes the scheme hold across changes nobody remembers to think about. A new
 * destination, a transform that moves a credential from a header into the body, a `secretKeys`
 * entry added upstream - each changes what this run derives, and each fails here until the
 * artifact is regenerated and committed.
 *
 * Byte comparison is only honest because the artifact holds nothing that varies by environment:
 * there is no build stamp and no checksum, keys are sorted on emit, and the file is in
 * .prettierignore so nothing reformats it afterwards. Same code plus same `secretKeys` produces
 * the same bytes on a laptop and on a runner. The per-destination report below exists to explain
 * a failure, never to decide it.
 */
const reportDrift = (fresh: SecretPaths): void => {
  // Read from disk rather than importing, so a run started before an edit still compares against
  // what is actually committed.
  let committedText: string;
  let committed: SecretPaths;
  try {
    committedText = fs.readFileSync(OUT_FILE, 'utf8');
    committed = JSON.parse(committedText);
  } catch (err) {
    console.error(`\nERROR: cannot read ${path.relative(process.cwd(), OUT_FILE)}: ${err}`);
    process.exitCode = 1;
    return;
  }

  const show = (paths: string[] | null | undefined): string =>
    paths === null ? 'null (mask everything)' : JSON.stringify(paths);

  if (committedText === serialise(fresh)) {
    console.log('\n--check: committed manifest matches what this build derives.');
    return;
  }

  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];
  for (const destType of Object.keys(fresh).sort()) {
    if (!(destType in committed)) {
      added.push(`  ${destType}: derives ${show(fresh[destType])}, not in the file`);
    } else if (JSON.stringify(committed[destType]) !== JSON.stringify(fresh[destType])) {
      changed.push(
        `  ${destType}: committed ${show(committed[destType])}` +
          ` -> derives ${show(fresh[destType])}`,
      );
    }
  }
  for (const destType of Object.keys(committed).sort()) {
    if (!(destType in fresh)) {
      removed.push(`  ${destType}: in the file, but this build derives nothing for it`);
    }
  }

  const say = (title: string, lines: string[]) => {
    if (lines.length > 0) console.error(`\n${title}\n${lines.join('\n')}`);
  };
  console.error('\nERROR: src/secretPaths/secretPaths.json is out of date.');
  if (added.length + removed.length + changed.length === 0) {
    console.error(
      `  Content is identical; only the formatting differs, so the file has been edited or` +
        ` reformatted by hand.`,
    );
  }
  say('Destinations with no entry (new destination?):', added);
  say('Destinations whose paths moved (transform or secretKeys change?):', changed);
  say('Entries for destinations this build no longer knows about:', removed);
  console.error(
    '\nRegenerate and commit the result:\n' +
      '  node test/secret-paths/run.js --integrations-config=<path>\n\n' +
      'If a path moved, that is a credential landing somewhere new - check the change is\n' +
      'intended before committing the regenerated file.',
  );
  process.exitCode = 1;
};

// ---------------------------------------------------------------------------

export const main = async () => {
  const only = argOf('destination')
    ?.split(',')
    .map((d) => d.trim().toLowerCase());
  const declaredSecretKeys = loadDeclaredSecretKeys(only);

  // throwException, never passthrough: an unmocked call must fail loudly rather than reach
  // a real destination API from a build step.
  const harness = startHarness();
  const corpus = fixturesByDestination();

  // Enumerate from what the transformer actually implements, not from what happens to have
  // fixtures - otherwise a fixture-less destination is absent from the manifest entirely
  // rather than recorded as a countable gap. Both implementation roots count: a destination
  // lives under v0 or cdk/v2, never both.
  const allDestinations = implementedDestinations().filter(
    (d) => !only || only.includes(d.toLowerCase()),
  );

  const destinations: Record<string, string[] | null> = {};
  /** Destinations with neither a fixture nor a usable probe - a build failure, not a finding. */
  const inconclusive: string[] = [];
  /** Destinations whose endpoint carried a declared secret - recorded, never masked. */
  const endpointExposures: Record<string, EndpointExposure> = {};

  /** Decides what the consumer must do here, so the policy lives with the evidence. */
  const recordUnresolved = (destType: string, reason: UnresolvedReason) => {
    destinations[destType] = MASKING_FOR_REASON[reason];
  };

  for (const destination of allDestinations) {
    const destType = destination.toUpperCase();
    const lower = destination.toLowerCase();
    const declaredKeys = declaredSecretKeys[lower];

    const filePaths = corpus.get(destination) ?? [];

    // The second secret source, discovered rather than declared. Nothing upstream says a
    // destination is handed a runtime credential bag - `secretKeys` describes configuration, and
    // the bag is not configuration - so the corpus is the only place to learn that this
    // destination is given one. Scanned before the derivation because it decides whether there is
    // anything to derive at all: an OAuth destination declares no `secretKeys` and would
    // otherwise stop at `no-declared-secrets` while sending a bearer token.
    // Bag first, deliberately. `deriveForCase` returns at the first source that destabilises the
    // diff, so a declared key that breaks its destination's own token exchange would otherwise
    // abort the case before the bag was ever measured - and the fetched-credential rescue below
    // can still publish a non-null list for such a destination, which would then be missing the
    // bearer token. Measuring the bag first means its locations exist before anything can abort.
    const configSources: SecretSource[] = declaredKeys.map((key) => ({ kind: 'config', key }));
    const secretSources: SecretSource[] = corpusCarriesRuntimeSecrets(harness, filePaths)
      ? [{ kind: 'runtime' }, ...configSources]
      : configSources;

    if (secretSources.length === 0) {
      recordUnresolved(destType, 'no-declared-secrets');
      continue;
    }

    if (filePaths.length === 0) {
      // No fixture to diff, but the question "does this destination even build a request?" can
      // still be answered by transforming one synthetic event and looking at the shape that
      // comes back. Warehouse and object-storage destinations return rows or the message itself,
      // never an endpoint - so there is nothing in a request for a consumer to mask.
      process.stdout.write(`  ${destination} ... `);
      const probed = await harness.probe(destination, probeConfigFor(destination));
      if (probed === 'no-request') {
        console.log('no http request (probed)');
        recordUnresolved(destType, 'no-http-request');
        continue;
      }
      // Neither a fixture nor a conclusive probe. Failing closed would bury that in the manifest
      // as one more `null`, and the count could grow without anyone noticing. A destination we
      // cannot reason about at all is a build problem, so say so and stop.
      console.log(`no fixtures, and probe was ${probed}`);
      inconclusive.push(destType);
      recordUnresolved(destType, 'no-fixtures');
      continue;
    }

    process.stdout.write(`  ${destination} ... `);
    let result: CaseOutcome;
    let relaxed = false;
    /** The fetched-credential pass, computed once - by the rescue below when it runs. */
    let fetched: FetchedCredentialOutcome | undefined;
    try {
      result = await deriveForDestination(harness, destination, secretSources, filePaths);
      if (result.unstableSource) {
        // Strict matching could not settle this destination. Its credential probably reaches the
        // matched headers in a form the substitution cannot rewrite - `Basic base64(user:secret)`
        // has no raw secret to replace. Retry with headers ignored: both runs are relaxed the
        // same way, so they still differ only by the credential.
        const retry = await deriveForDestination(
          harness,
          destination,
          secretSources,
          filePaths,
          'ignore-headers',
        );
        if (!retry.unstableSource && !retry.harnessError && retry.locations.length > 0) {
          result = retry;
          relaxed = true;
        }
      }
    } catch (err: any) {
      console.log(`harness error (${String(err?.message).slice(0, 60)})`);
      recordUnresolved(destType, 'harness-error');
      continue;
    }

    if (result.harnessError) {
      console.log(`harness error (${result.harnessError.slice(0, 60)})`);
      recordUnresolved(destType, 'harness-error');
      continue;
    }
    if (result.unstableSource) {
      // Substituting this key changed the output's shape, so the paths derived from the other
      // declared keys are a subset of the truth - CANNY sends its key at body.FORM.apiKey on
      // exactly such a branch.
      //
      // These destabilise for a specific, recoverable reason: they trade a declared secret for a
      // session token, so a decoy breaks the exchange rather than changing one value. Perturbing
      // the token in the mocked response instead leaves the exchange intact, and that pass never
      // touches the config, so config instability does not disqualify it.
      //
      // This was rejected once, when the endpoint was still masked: SFMC bailed on `clientId`
      // before reaching `subDomain`, so publishing only the token dropped `endpoint` and left the
      // subdomain visible. The endpoint is no longer masked for any destination, so a declared
      // identifier sitting in a URL is now the accepted `url` exposure rather than a regression.
      // `--validate` is what confirms it: it replays the corpus looking for any declared secret
      // that survives masking, and reports none for either destination.
      //
      // The rescue perturbs the credential the destination *fetches*, which is a different value
      // from the one the runtime bag carries. So when the bag destabilised and was never compared
      // cleanly in any case, a non-empty rescue says nothing about where the bag's token went, and
      // publishing it would be a positive claim built on unrelated evidence - fail closed instead,
      // which masks everything maskable and therefore covers the token.
      //
      // When the bag *was* compared cleanly somewhere, its locations are already in
      // `result.locations`, measured by the same corroborated diff every other path comes from.
      // SALESFORCE is the case: its bag moves `endpoint` and `headers.Authorization` on the cases
      // that hold, and a later case collapses under the decoy. Discarding a measured location to
      // punish an unrelated case would mask that destination wholesale on evidence we do have.
      const bagUnmeasured = result.unstableSource.kind === 'runtime' && !result.runtimeMeasured;
      if (!bagUnmeasured) {
        fetched = await deriveFromFetchedCredentials(harness, destination, declaredKeys, filePaths);
      }
      if (!fetched?.stable || fetched.locations.length === 0) {
        console.log(`unstable under '${sourceName(result.unstableSource)}' - failing closed`);
        recordUnresolved(destType, 'unstable-under-substitution');
        continue;
      }
      // The fetched locations are merged below, not assigned. Everything already collected came
      // from a source that cleared both the shape check and the two-decoy corroboration before the
      // abort, so merging can only under-report; replacing would drop those findings entirely.
      process.stdout.write(`unstable under '${sourceName(result.unstableSource)}', `);
    }

    if (!result.transformed) {
      // Nothing ran, so we know nothing. Fail closed rather than claim there is no request.
      console.log('no case transformed - failing closed');
      recordUnresolved(destType, 'harness-error');
      continue;
    }
    if (!result.sawRequest) {
      console.log('no http request');
      recordUnresolved(destType, 'no-http-request');
      continue;
    }
    // A destination can both place one declared/runtime value directly and exchange another
    // declared config secret for a token. Run the grounded auth-response pass even when ordinary
    // derivation already found paths, otherwise those direct findings can hide the fetched token.
    fetched ??= await deriveFromFetchedCredentials(harness, destination, declaredKeys, filePaths);
    if (!fetched.stable) {
      console.log('fetched credential unstable under substitution - failing closed');
      recordUnresolved(destType, 'unstable-under-substitution');
      continue;
    }
    if (fetched.locations.length > 0) {
      result.locations.push(...fetched.locations.map(withoutUnreadEvidence));
      process.stdout.write('credential fetched during transform -> ');
    }

    // Both policies are applied once, over the locations from both producers, so that neither
    // producer can escape either of them.
    const paths = toSecretPaths(result.locations, destType);
    const exposure = exposureOf(result.locations);
    if (exposure) endpointExposures[destType] = exposure;

    if (paths.length === 0) {
      // `endpoint-only` and `no-secret-located` both publish `[]`, but they are different claims:
      // one located the credential in the excluded field, the other found none at all.
      const reason: UnresolvedReason = exposure ? 'endpoint-only' : 'no-secret-located';
      console.log(reason);
      recordUnresolved(destType, reason);
      continue;
    }

    // Only reachable when a family sat at the top level, where no object contains it.
    if (result.locations.some((m) => collapseKeyFamily(pathOf(m.loc)) === null)) {
      console.log('dynamic key family at the top level - failing closed');
      recordUnresolved(destType, 'dynamic-key-family');
      continue;
    }
    destinations[destType] = paths;
    console.log(
      `${paths.length} path(s): ${paths.join(', ')}${relaxed ? ' [relaxed mock matching]' : ''}`,
    );
  }

  // Sorted on the way out. Destination order otherwise follows directory enumeration, which is
  // not guaranteed to agree between a contributor's machine and CI - and an artifact whose key
  // order can change is one that fails `--check` for no reason. Sorting also makes the committed
  // file diffable, which is what makes a path change visible in review.
  const secretPaths = sortedByKey(destinations);

  let action: string;
  if (hasFlag('check')) {
    reportDrift(secretPaths);
    action = 'derived';
  } else {
    fs.writeFileSync(OUT_FILE, serialise(secretPaths));
    action = `wrote ${path.relative(process.cwd(), OUT_FILE)}:`;
  }
  const all = Object.values(destinations);
  const maskAll = all.filter((p) => p === null).length;
  const nothing = all.filter((p) => p !== null && p.length === 0).length;
  console.log(
    `\n${action} ${all.length} destinations - ` +
      `${all.length - maskAll - nothing} with derived paths, ${maskAll} fail-closed, ` +
      `${nothing} with nothing to mask`,
  );

  const exposed = (kind: EndpointExposure) =>
    Object.keys(endpointExposures)
      .filter((d) => endpointExposures[d] === kind)
      .sort();
  const inQuery = exposed('query');
  const inUrl = exposed('url');
  if (inUrl.length > 0) {
    console.log(
      `\nendpoint excluded, credential is the URL itself (accepted): ${inUrl.join(', ')}`,
    );
  }
  if (inQuery.length > 0) {
    console.log(
      `\nTODO - endpoint excluded, but a query-parameter credential is concatenated into it ` +
        `instead of emitted in \`params\`, so it is no longer masked anywhere:\n  ` +
        `${inQuery.join(', ')}\n` +
        '  Each is fixed by emitting the parameter in `params`, which both delivery paths already\n' +
        '  merge into the URL - no change on the wire, and the existing `params.*` masking applies.',
    );
  }

  harness.stop();

  if (inconclusive.length > 0) {
    console.error(
      `\nERROR: no fixtures and an inconclusive probe for: ${inconclusive.join(', ')}.\n` +
        'Each is masked wholesale as a fallback, but nothing here can say what it actually sends.\n' +
        'Add a component-test fixture, or make the probe conclusive for it.',
    );
    process.exitCode = 1;
  }
};
