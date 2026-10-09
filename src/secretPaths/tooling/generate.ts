/* eslint-disable no-console, no-await-in-loop */
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
 * Usage (`generate.jest-entry.ts` is the Jest entry point):
 *   SECRET_PATHS_DESTINATION=klaviyo,ga4 npm run generate:secret-paths
 *   npm run generate:secret-paths                        # whole corpus
 *
 * `SECRET_PATHS_INTEGRATIONS_CONFIG` points at a rudder-integrations-config checkout; a
 * production build would read the published destination definitions instead.
 */
import fs from 'fs';
import { execFileSync } from 'child_process';
import cloneDeep from 'lodash/cloneDeep';
import { createRequire } from 'module';
import nodePath, { join } from 'path';
import { getTestData } from '../../../test/integrations/testUtils';
import type { SecretPaths } from '..';
import { implementedDestinations, loadDeclaredSecretKeys, probeConfigFor } from './declared';
import type { MockMatching } from './harness';
import {
  carriesSecret,
  configSecretsFor,
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
  DELIVERED_NON_HTTP_FIELDS,
  DELIVERED_REQUEST_FIELDS,
  ENDPOINT_FIELD,
  MASKABLE_DELIVERY_FIELDS,
  collapseArrayMarkers,
  escapeSegment,
  formatPath,
  parsePath,
} from './path';

type EndpointExposure = 'query' | 'url';
type FailureReason =
  | 'dynamic-key-family'
  | 'harness-error'
  | 'no-fixtures'
  | 'unaddressable-non-http-secret'
  | 'unstable-under-substitution';
type DerivationFailure = { destType: string; reason: FailureReason };

const HARNESS_ERROR: FailureReason = 'harness-error';
/** How the fetched-credential pass names itself in diagnostics. */
const FETCHED_CREDENTIAL = 'fetched credential';

const OUT_FILE = join(__dirname, '../secretPaths.json');
const PRETTIER_BIN = createRequire(__filename).resolve('prettier/bin/prettier.cjs');

/** Takes a thunk so the message - often a stringified leaf - is only built when debugging. */
const debug = (message: () => string): void => {
  if (process.env.SECRET_PATHS_DEBUG) console.log(`\n    [debug] ${message()}`);
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

  // `requestsIn` is the single definition of "this object is an outbound request" used by the
  // fixture harness and the flattener.
  const requests = requestsIn(output);
  requests.forEach((node, index) => {
    for (const field of DELIVERED_REQUEST_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(node, field)) {
        addLeaf(locationKey(index, field), node[field]);
      }
    }
  });

  return { leaves, requestCount: requests.length };
};

// ---------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------

interface CaseOutcome {
  locations: Movement[];
  sawRequest: boolean;
  /**
   * Whether any case transformed successfully at all. `no-http-request` publishes `[]`, so it has
   * to be proved rather than inferred: "no case produced a request" is equally consistent with a
   * destination that builds none and with a harness that could not run one.
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
  /** A secret appeared in a non-HTTP result, but not in a known delivered top-level field. */
  unaddressableNonHttpSecret?: boolean;
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
  /** The unchanged transform output, retained only when there is no HTTP request to inspect. */
  output?: unknown;
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
  if (runA.leaves.size === 0) return { transformed: true, output: realA };

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
type SecretSource = { kind: 'config'; key: string } | { kind: 'runtime' };

/** How a source names itself in diagnostics: `unstable under 'clientSecret'` / `'metadata.secret'`. */
const sourceName = (source: SecretSource): string =>
  source.kind === 'config' ? source.key : 'metadata.secret';

/** The values this source contributes to one fixture body, subject to the shared length rule. */
export const valuesFor = (source: SecretSource, body: unknown): string[] =>
  source.kind === 'config' ? configSecretsFor(body, source.key) : runtimeSecretsFor(body);

/** String values observed under each fixture case's `destination.Config`. */
const destinationConfigValues = (body: unknown): Set<string> => {
  const values = new Set<string>();
  const collectStrings = (node: unknown): void => {
    if (typeof node === 'string') {
      values.add(node);
      return;
    }
    if (!node || typeof node !== 'object') return;
    Object.values(node).forEach(collectStrings);
  };
  const findDestinations = (node: unknown): void => {
    if (!node || typeof node !== 'object') return;
    const record = node as Record<string, unknown>;
    if (record.destination && typeof record.destination === 'object') {
      collectStrings((record.destination as Record<string, unknown>).Config);
    }
    Object.values(record).forEach(findDestinations);
  };
  findDestinations(body);
  return values;
};

/** Rewrites this source's values in place, by name for a config key and by position for the bag. */
const rewriteWith = (
  source: SecretSource,
  body: unknown,
  visit: (current: string) => string,
): void => {
  if (source.kind === 'config') visitConfigSecrets(body, source.key, visit);
  else visitRuntimeSecrets(body, visit);
};

/** One field that moved when an input was perturbed. */
export interface Movement {
  /** `req[n]|headers.Authorization` - the request index is dropped when paths are collapsed. */
  loc: string;
  /** The header key was observed as a value in this fixture's destination config. */
  headerNameFromConfig?: boolean;
  /**
   * What the endpoint held before and after the perturbation, read by `exposureOf`. Attached to
   * the endpoint only: other leaves can be 50-500 KB stringified payloads, and nothing reads them.
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
 * Baseline leaves that carry a runtime-bag value.
 *
 * Needs no decoy, so it covers what the diff cannot: non-deterministic fields (OAuth1 headers
 * hold a fresh `oauth_nonce` *and* `oauth_token="<the bag's access token>"`) and already-built
 * data-delivery requests, which cannot recompute a header from a perturbed bag. Scoped to the
 * runtime bag because it is the one source whose plaintext we hold: every value in it is a
 * credential by contract, so containment is direct evidence rather than a guess.
 */
const secretCarriersIn = (baseline: Baseline, secrets: string[]): Movement[] => {
  const found: Movement[] = [];
  for (const [loc, realValue] of baseline.runA.leaves) {
    if (secrets.some((secret) => carriesSecret(realValue, secret))) {
      // `carriesSecret`, not a bare `includes`: OAuth1 percent-encodes every parameter value, so a
      // realistic base64-shaped token reaches the header as `oauth_token="ab%2Bcd%2Fef%3D"`.
      debug(
        () =>
          `${loc} from=metadata.secret (contains a bag value)` +
          `\n            real =${JSON.stringify(realValue).slice(0, 90)}`,
      );
      // No decoy ran for this leaf, so there is no before-and-after to attach.
      found.push({ loc });
    }
  }
  return found;
};

export interface NonHttpSecretCarriers {
  fields: string[];
  /** The secret was present in a delivery result whose top-level field is not addressable. */
  unaddressable: boolean;
}

/**
 * Finds credentials in successful non-HTTP transform results.
 *
 * Processor and router responses wrap the object handed to delivery as `output` and
 * `batchedRequest` respectively. A value can itself be structured or stringified JSON; either
 * way the consumer can only address the containing top-level field, so that is what we publish.
 */
export const nonHttpSecretCarriersIn = (
  output: unknown,
  secrets: string[],
): NonHttpSecretCarriers => {
  const fields = new Set<string>();
  let unaddressable = false;
  const wrapperFields = new Set(['output', 'batchedRequest']);
  const carriesAnySecret = (value: unknown): boolean => {
    const serialised = typeof value === 'string' ? value : JSON.stringify(value);
    return Boolean(serialised && secrets.some((secret) => carriesSecret(serialised, secret)));
  };
  let walk: (value: unknown) => void;
  const inspectDeliveredOutput = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!value || typeof value !== 'object') {
      if (carriesAnySecret(value)) {
        debug(() => `non-http secret in unaddressable delivery value: ${JSON.stringify(value)}`);
        unaddressable = true;
      }
      return;
    }
    const record = value as Record<string, unknown>;
    for (const field of DELIVERED_NON_HTTP_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(record, field) && carriesAnySecret(record[field])) {
        debug(() => `non-http secret in delivery field: ${field}`);
        fields.add(field);
      }
    }
  };
  walk = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!value || typeof value !== 'object') return;
    const record = value as Record<string, unknown>;
    for (const [field, child] of Object.entries(record)) {
      if (wrapperFields.has(field)) inspectDeliveredOutput(child);
      else walk(child);
    }
  };
  walk(output);
  return { fields: [...fields].sort(), unaddressable };
};

/** Marks a `headers.<name>` movement whose header name is a value from the destination config. */
const markConfigHeader = (movement: Movement, configuredValues: ReadonlySet<string>): Movement => {
  const segments = parsePath(pathOf(movement.loc));
  return segments.length === 2 && segments[0] === 'headers' && configuredValues.has(segments[1])
    ? { ...movement, headerNameFromConfig: true }
    : movement;
};

/** Compares the baseline against two decoy runs and reports what moved because of one source. */
export const locationsForKey = (
  baseline: Baseline,
  decoy: FlattenedOutput,
  decoy2: FlattenedOutput,
  /** Names the perturbed input in debug output only. */
  source?: string,
  configuredValues: ReadonlySet<string> = new Set(),
): Movement[] => {
  const found: Movement[] = [];
  for (const [loc, realValue] of baseline.runA.leaves) {
    // An empty decoy value carries no secret, so treating it like a miss is correct.
    const decoyValue = decoy.leaves.get(loc) ?? '';
    const corroborated =
      !baseline.nonDeterministic.has(loc) &&
      decoyValue !== '' &&
      decoyValue !== realValue &&
      decoy2.leaves.get(loc) !== decoyValue;
    if (corroborated) {
      debug(
        () =>
          `${loc} from=${source}` +
          `\n            real =${JSON.stringify(realValue).slice(0, 90)}` +
          `\n            decoy=${JSON.stringify(decoyValue).slice(0, 90)}`,
      );
      found.push(
        markConfigHeader(
          pathOf(loc) === ENDPOINT_FIELD
            ? { loc, evidence: { real: realValue, decoy: decoyValue } }
            : { loc },
          configuredValues,
        ),
      );
    }
  }
  return found;
};

/**
 * Runs the two decoy transforms that corroborate each other - see `locationsForKey`. Each run is
 * checked before the next, so an unstable input does not cost a second full transform.
 *
 * Returns undefined when either run produced no output (the decoy changed the outcome: validation
 * rejected it, a different branch was taken) or a different number of requests or fields. The
 * positions no longer line up, so any diff would be noise and the source is unstable.
 */
const runCorroboratedDecoys = async (
  baseline: Baseline,
  label: string,
  runDecoy: (seed: 1 | 2) => Promise<unknown | null>,
): Promise<[FlattenedOutput, FlattenedOutput] | undefined> => {
  const runs: FlattenedOutput[] = [];
  for (const seed of [1, 2] as const) {
    const out = await runDecoy(seed);
    const run = out ? flattenRequests(out) : undefined;
    if (!run || !hasSameShape(baseline.runA, run)) {
      debug(() =>
        run
          ? `unstable: '${label}' changed the shape (decoy ${seed}) - ` +
            `requests ${baseline.runA.requestCount}->${run.requestCount}, ` +
            `leaves ${baseline.runA.leaves.size}->${run.leaves.size}`
          : `unstable: '${label}' decoy ${seed} run produced no output`,
      );
      return undefined;
    }
    runs.push(run);
  }
  return [runs[0], runs[1]];
};

const deriveForCase = async (
  harness: Harness,
  destination: string,
  tcData: any,
  secretSources: SecretSource[],
  matching: MockMatching,
  baseline: Baseline,
  originalBody: unknown,
  configuredValues: ReadonlySet<string>,
): Promise<CaseOutcome> => {
  const outcome: CaseOutcome = { locations: [], sawRequest: true, transformed: true };

  // One source at a time so the one responsible for an unstable diff can be named - the first
  // thing anyone investigating a failed generation needs.
  const presentSources = secretSources
    .map((source) => ({ source, present: valuesFor(source, originalBody) }))
    .filter(({ present }) => present.length > 0);
  for (const { source, present } of presentSources) {
    // `valuesFor`/`rewriteWith` are the only place the two kinds differ; past them the sources
    // are the same measurement, so neither can drift away from the other's rules.
    if (present.some((value) => decoysFor(value) === null)) {
      debug(() => `unstable: '${sourceName(source)}' has no distinct decoys`);
      outcome.unstableSource = source;
      return outcome;
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

    const decoyRuns = await runCorroboratedDecoys(baseline, sourceName(source), (seed) =>
      harness.runCase(tcData, decoyBody(seed)),
    );
    if (!decoyRuns) {
      outcome.unstableSource = source;
      return outcome;
    }
    outcome.locations.push(
      ...locationsForKey(baseline, ...decoyRuns, sourceName(source), configuredValues),
    );
    // Reached only when both decoys ran and the shape held, so the diff for this source in this
    // case was trustworthy.
    if (source.kind === 'runtime') outcome.runtimeMeasured = true;
  }

  return outcome;
};

interface FetchedCredentialOutcome {
  stable: boolean;
  locations: Movement[];
}

/** Keeps only mocked-response candidates observed in baseline request authentication fields. */
export const fetchedCredentialsOnAuthSurface = (
  baseline: Baseline,
  candidates: string[],
): string[] => {
  const authValues = [...baseline.runA.leaves]
    .filter(([location]) => {
      const [topLevelField] = parsePath(pathOf(location));
      return topLevelField === 'headers' || topLevelField === 'params';
    })
    .map(([, value]) => value);
  return candidates.filter((candidate) =>
    authValues.some((value) => carriesSecret(value, candidate)),
  );
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
 * Runs at most once per destination, so a direct finding cannot hide a fetched token; cases
 * whose mocked responses carry no credential are skipped without a transform.
 */

const deriveFromFetchedCredentials = async (
  harness: Harness,
  destination: string,
  declaredKeys: string[],
  cases: any[],
): Promise<FetchedCredentialOutcome> => {
  const locations: Movement[] = [];
  let stable = true;

  await harness.withoutCache(async () => {
    for (const tcData of cases) {
      const { body } = tcData.input.request;
      const responseCandidates = harness.mockResponseSecrets(destination, body, declaredKeys);
      if (responseCandidates.length > 0) {
        // The same two-run non-determinism rule as the config pass, not a second copy of it.
        const { baseline } = await runBaseline(harness, tcData, body, () =>
          harness.useMocksFor(destination),
        );
        if (baseline) {
          const configuredValues = destinationConfigValues(tcData);
          const candidates = fetchedCredentialsOnAuthSurface(baseline, responseCandidates);
          for (const candidate of candidates) {
            const decoys = decoysFor(candidate);
            if (!decoys) {
              stable = false;
              return;
            }
            const decoyRuns = await runCorroboratedDecoys(baseline, FETCHED_CREDENTIAL, (seed) => {
              const substitutions = new Map([[candidate, decoys[seed - 1]]]);
              harness.useMocksFor(destination, substitutions, 'strict', 'response');
              return harness.runCase(tcData, cloneDeep(body));
            });
            if (!decoyRuns) {
              stable = false;
              return;
            }
            locations.push(
              ...locationsForKey(baseline, ...decoyRuns, FETCHED_CREDENTIAL, configuredValues),
            );
          }
        }
      }
    }
  });
  harness.useMocksFor(destination);
  return { stable, locations };
};

/**
 * Whether any fixture case carries a runtime credential bag.
 *
 * The corpus rather than the registry, deliberately. `config.auth.type === 'OAuth'` would be
 * cheaper, but FACEBOOK_OFFLINE_CONVERSIONS, SALESFORCE, WOOTRIC and YAHOO_DSP all read
 * `metadata.secret` without declaring OAuth. Over-reporting costs a derivation that finds nothing;
 * under-reporting publishes a token.
 */
const corpusCarriesRuntimeSecrets = (cases: any[]): boolean =>
  cases.some((tcData) => runtimeSecretsFor(tcData.input.request.body).length > 0);

/**
 * Every derivable case in a destination's fixture files, or the load error for the first file
 * that will not load. A fixture that will not load is a corpus defect, not evidence about where a
 * credential lands, so it is reported as `harness-error` rather than as instability.
 */
const loadDerivableCases = (
  harness: Harness,
  filePaths: string[],
): { cases: any[] } | { error: string } => {
  const cases: any[] = [];
  for (const filePath of filePaths) {
    try {
      cases.push(
        ...getTestData(filePath).filter((tcData: any) => isDerivableCase(harness, tcData)),
      );
    } catch (err) {
      return { error: `${filePath}: ${String(err).slice(0, 80)}` };
    }
  }
  return { cases };
};

const deriveForDestination = async (
  harness: Harness,
  destination: string,
  secretSources: SecretSource[],
  eligibleCases: any[],
  matching: MockMatching = 'strict',
): Promise<CaseOutcome> => {
  const total: CaseOutcome = { locations: [], sawRequest: false, transformed: false };

  interface BaselineCase {
    baseline: Baseline;
    configuredValues: ReadonlySet<string>;
    originalBody: unknown;
    tcData: any;
  }

  const baselineCases: BaselineCase[] = [];
  const runtimeSource = secretSources.find((source) => source.kind === 'runtime');

  // Run the baseline-only token scan over every eligible case before any decoy can make the
  // destination unstable. Direct containment is settled without substitution, so findings from
  // later cases must not depend on whether an earlier case can survive a decoy.
  for (const tcData of eligibleCases) {
    const originalBody = tcData.input.request.body;
    const configuredValues = destinationConfigValues(tcData);
    const result = await harness.withCaseEnv(tcData, async () => {
      harness.useMocksFor(destination, undefined, matching);
      return runBaseline(harness, tcData, originalBody);
    });
    total.transformed = total.transformed || result.transformed;
    if (result.baseline) {
      total.sawRequest = true;
      baselineCases.push({ baseline: result.baseline, configuredValues, originalBody, tcData });

      if (runtimeSource) {
        const runtimeSecrets = valuesFor(runtimeSource, originalBody);
        total.locations.push(
          ...secretCarriersIn(result.baseline, runtimeSecrets).map((movement) =>
            markConfigHeader(movement, configuredValues),
          ),
        );
      }
    } else if (result.output) {
      const secrets = secretSources.flatMap((source) => valuesFor(source, originalBody));
      const carriers = nonHttpSecretCarriersIn(result.output, secrets);
      total.locations.push(...carriers.fields.map((field) => ({ loc: locationKey(0, field) })));
      total.unaddressableNonHttpSecret = total.unaddressableNonHttpSecret || carriers.unaddressable;
    }
  }

  for (const { baseline, configuredValues, originalBody, tcData } of baselineCases) {
    const outcome = await harness.withCaseEnv(tcData, () =>
      deriveForCase(
        harness,
        destination,
        tcData,
        secretSources,
        matching,
        baseline,
        originalBody,
        configuredValues,
      ),
    );
    total.locations.push(...outcome.locations);
    total.runtimeMeasured = total.runtimeMeasured || outcome.runtimeMeasured;
    // The baseline pass above has already collected direct runtime-secret evidence from every
    // eligible case. Once a decoy is unstable, no later decoy can make the destination's
    // attribution complete, so stop the substitution pass without losing baseline findings.
    if (outcome.unstableSource) {
      total.unstableSource = outcome.unstableSource;
      return total;
    }
  }

  return total;
};

/**
 * Collapses a dynamically-numbered key family to the object that contains it.
 *
 * `bd[0]`-style keys come from a loop - AWIN emits one `bd[N]` param per product, each carrying
 * the declared `advertiserId` inside a pipe-delimited string - so the indices a fixture happens
 * to contain say nothing about a real request, and gjson/sjson cannot address the family
 * (`params.bd*` masks only the first match). Masking the containing object does cover it.
 *
 * This is coarser than a leaf path: AWIN's `params` also carries amount, currency and voucher
 * code, which are not secret and stop being visible.
 *
 * Returns null when the family sits at the top level, where there is no containing object.
 */
export const collapseKeyFamily = (path: string): string | null => {
  const segments = parsePath(path);
  const family = segments.findIndex((segment) => /\[\d+]$/.test(segment));
  if (family === -1) return path;
  return family === 0 ? null : formatPath(segments.slice(0, family));
};

/**
 * Collapses movements into the sorted set of paths to mask, applying the endpoint exclusion (see
 * ENDPOINT_FIELD in ./path). Both producers funnel through here, so the policy cannot be escaped.
 */
export const toSecretPaths = (locations: Movement[]): string[] =>
  [
    ...new Set(
      locations
        .filter(({ loc }) => parsePath(pathOf(loc))[0] !== ENDPOINT_FIELD)
        // A fixture proves only one concrete header name; when that name comes from tenant config,
        // production can emit any other, so the containing `headers` object is masked instead.
        .map(({ loc, headerNameFromConfig }) =>
          headerNameFromConfig ? 'headers' : collapseArrayMarkers(pathOf(loc)),
        )
        // A dynamically-numbered key family cannot be addressed directly, so it becomes the
        // object containing it. `null` means nothing contains it; the caller fails generation.
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

const sortedByKey = <T>(record: Record<string, T>): Record<string, T> =>
  Object.fromEntries(Object.entries(record).sort(([a], [b]) => (a < b ? -1 : 1)));

export const validateSecretPaths = (secretPaths: SecretPaths): void => {
  const destinationKeys = Object.keys(secretPaths);
  const sortedDestinationKeys = [...destinationKeys].sort();
  if (JSON.stringify(destinationKeys) !== JSON.stringify(sortedDestinationKeys)) {
    throw new Error('Secret-path destination keys must be sorted');
  }

  for (const [destType, paths] of Object.entries(secretPaths)) {
    if (!Array.isArray(paths)) {
      throw new Error(`Secret paths for ${destType} must be an array`);
    }
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
        !MASKABLE_DELIVERY_FIELDS.includes(segments[0] as (typeof MASKABLE_DELIVERY_FIELDS)[number])
      ) {
        throw new Error(`Invalid secret path for ${destType}: ${secretPath}`);
      }
    }
  }
};

/**
 * The artifact's bytes. One definition, used both to write the file and to check it, so the two
 * cannot disagree about what "unchanged" means.
 */
export const serialise = (secretPaths: SecretPaths): string => {
  validateSecretPaths(secretPaths);
  return execFileSync(process.execPath, [PRETTIER_BIN, '--parser=json'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    input: JSON.stringify(secretPaths),
  });
};

/**
 * Check mode (`npm run check:secret-paths`): fails unless the committed file is byte-for-byte
 * what this run would write.
 *
 * This is what makes the scheme hold across changes nobody remembers to think about. A new
 * destination, a transform that moves a credential from a header into the body, a `secretKeys`
 * entry added upstream - each changes what this run derives, and each fails here until the
 * artifact is regenerated and committed.
 *
 * Byte comparison is only honest because the artifact holds nothing that varies by environment:
 * there is no build stamp and no checksum, keys are sorted on emit, and the serializer matches
 * the repository's Prettier JSON format. Same code plus same `secretKeys` produces the same bytes
 * on a laptop and on a runner. The per-destination report below exists to explain a failure,
 * never to decide it.
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
    console.error(`\nERROR: cannot read ${nodePath.relative(process.cwd(), OUT_FILE)}: ${err}`);
    process.exitCode = 1;
    return;
  }

  const show = (paths: string[] | undefined): string => JSON.stringify(paths);

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
      '  SECRET_PATHS_INTEGRATIONS_CONFIG=<path> npm run generate:secret-paths\n\n' +
      'If a path moved, that is a credential landing somewhere new - check the change is\n' +
      'intended before committing the regenerated file.',
  );
  process.exitCode = 1;
};

// ---------------------------------------------------------------------------

interface GenerateOptions {
  check?: boolean;
  destinations?: string[];
  integrationsConfig?: string;
}

const recordNonHttpOutcome = (
  result: CaseOutcome,
  recordPaths: (paths: string[]) => void,
  recordFailure: (reason: FailureReason) => void,
): boolean => {
  if (result.sawRequest) return false;
  if (result.unaddressableNonHttpSecret) {
    console.log('secret in unaddressable non-http output - failing generation');
    recordFailure('unaddressable-non-http-secret');
    return true;
  }
  const paths = toSecretPaths(result.locations);
  recordPaths(paths);
  console.log(
    paths.length > 0 ? `${paths.length} non-http path(s): ${paths.join(', ')}` : 'no http request',
  );
  return true;
};

export const main = async (options: GenerateOptions = {}) => {
  const only = options.destinations?.map((destination) => destination.trim().toLowerCase());
  const declaredSecretKeys = loadDeclaredSecretKeys(only, options.integrationsConfig);

  const harness = startHarness();
  const corpus = fixturesByDestination();

  // Enumerate from what the transformer actually implements, not from what happens to have
  // fixtures - otherwise a fixture-less destination is absent from the manifest entirely
  // rather than recorded as a countable gap.
  const allDestinations = implementedDestinations().filter(
    (d) => !only || only.includes(d.toLowerCase()),
  );

  const destinations: SecretPaths = {};
  const failures: DerivationFailure[] = [];
  /** Destinations whose endpoint carried a declared secret - recorded, never masked. */
  const endpointExposures: Record<string, EndpointExposure> = {};

  /** A positive "nothing to mask" finding. */
  const recordEmpty = (destType: string): void => {
    destinations[destType] = [];
  };
  /** A destination the derivation could not settle; generation fails without writing the file. */
  const recordFailure = (destType: string, reason: FailureReason): void => {
    failures.push({ destType, reason });
  };

  const deriveOne = async (destination: string): Promise<void> => {
    const destType = destination.toUpperCase();
    const lower = destination.toLowerCase();
    const declaredKeys = declaredSecretKeys[lower];

    const filePaths = corpus.get(destination) ?? [];
    const loaded = loadDerivableCases(harness, filePaths);
    if ('error' in loaded) {
      console.log(`  ${destination} ... harness error (${loaded.error.slice(0, 60)})`);
      recordFailure(destType, HARNESS_ERROR);
      return;
    }
    const { cases } = loaded;

    // The second secret source, discovered rather than declared. Nothing upstream says a
    // destination is handed a runtime credential bag - `secretKeys` describes configuration, and
    // the bag is not configuration - so the corpus is the only place to learn that this
    // destination is given one. Scanned before the derivation because it decides whether there is
    // anything to derive at all: an OAuth destination declares no `secretKeys` and would
    // otherwise stop at `no-declared-secrets` while sending a bearer token.
    // Bag first, deliberately. `deriveForCase` returns at the first source that destabilises one
    // case, so a declared key that breaks its destination's own token exchange would otherwise
    // prevent the bag from being measured in that case.
    const configSources: SecretSource[] = declaredKeys.map((key) => ({ kind: 'config', key }));
    const secretSources: SecretSource[] = corpusCarriesRuntimeSecrets(cases)
      ? [{ kind: 'runtime' }, ...configSources]
      : configSources;

    if (secretSources.length === 0) {
      recordEmpty(destType);
      return;
    }

    if (filePaths.length === 0) {
      // No fixture to diff, but the question "does this destination even build a request?" can
      // still be answered by transforming one synthetic event and looking at the shape that
      // comes back. Warehouse and object-storage destinations return rows or the message itself,
      // never an endpoint - so there is nothing in a request for a consumer to mask.
      process.stdout.write(`  ${destination} ... `);
      const probed = await harness.probe(
        destination,
        probeConfigFor(destination, options.integrationsConfig),
      );
      if (probed === 'no-request') {
        console.log('no http request (probed)');
        recordEmpty(destType);
        return;
      }
      // Neither a fixture nor a conclusive probe. A destination we cannot reason about at all is
      // a build problem, so record the failure and abort before writing the artifact.
      console.log(`no fixtures, and probe was ${probed}`);
      recordFailure(destType, 'no-fixtures');
      return;
    }

    process.stdout.write(`  ${destination} ... `);
    let result: CaseOutcome;
    let relaxed = false;
    try {
      result = await deriveForDestination(harness, destination, secretSources, cases);
      if (result.unstableSource) {
        // Strict matching could not settle this destination. Its credential probably reaches the
        // matched headers in a form the substitution cannot rewrite - `Basic base64(user:secret)`
        // has no raw secret to replace. Retry with headers ignored: both runs are relaxed the
        // same way, so they still differ only by the credential.
        const retry = await deriveForDestination(
          harness,
          destination,
          secretSources,
          cases,
          'ignore-headers',
        );
        if (!retry.unstableSource && retry.locations.length > 0) {
          result = retry;
          relaxed = true;
        }
      }
    } catch (err: any) {
      console.log(`harness error (${String(err?.message).slice(0, 60)})`);
      recordFailure(destType, HARNESS_ERROR);
      return;
    }

    if (!result.transformed) {
      // Nothing ran, so we know nothing. Fail the build rather than claim there is no request.
      console.log('no case transformed - failing generation');
      recordFailure(destType, HARNESS_ERROR);
      return;
    }
    if (
      recordNonHttpOutcome(
        result,
        (paths) => {
          destinations[destType] = paths;
        },
        (reason) => recordFailure(destType, reason),
      )
    )
      return;

    // An unstable source leaves the paths from the other sources a subset of the truth. Most such
    // destinations trade a declared secret for a session token, so a decoy breaks the exchange
    // rather than changing one value; perturbing the token in the mocked response instead (the
    // fetched-credential pass) keeps the exchange intact and can still locate it. That rescue says
    // nothing about the runtime bag's token, so a bag that was never compared cleanly in any case
    // fails generation outright. A bag that was compared cleanly somewhere already has its
    // locations in `result.locations` (SALESFORCE: an early case holds, a later one collapses).
    // Run even when the direct derivation already found paths: a destination can place one secret
    // directly and exchange another for a token, and the direct findings must not hide the token.
    const unstable = result.unstableSource;
    const fetched =
      unstable?.kind === 'runtime' && !result.runtimeMeasured
        ? undefined
        : await deriveFromFetchedCredentials(harness, destination, declaredKeys, cases);
    if (!fetched?.stable || (unstable && fetched.locations.length === 0)) {
      console.log(
        `unstable under '${unstable ? sourceName(unstable) : FETCHED_CREDENTIAL}' - failing generation`,
      );
      recordFailure(destType, 'unstable-under-substitution');
      return;
    }
    if (fetched.locations.length > 0) {
      // Merged, not assigned: everything already collected cleared both the shape check and the
      // two-decoy corroboration, so replacing it would drop those findings.
      result.locations.push(...fetched.locations);
      process.stdout.write('credential fetched during transform -> ');
    }

    // Both policies are applied once, over the locations from both producers, so that neither
    // producer can escape either of them.
    const paths = toSecretPaths(result.locations);
    const exposure = exposureOf(result.locations);
    if (exposure) endpointExposures[destType] = exposure;

    if (paths.length === 0) {
      // `endpoint-only` and `no-secret-located` both publish `[]`, but they are different claims:
      // one located the credential in the excluded field, the other found none at all.
      console.log(exposure ? 'endpoint-only' : 'no-secret-located');
      recordEmpty(destType);
      return;
    }

    // Only reachable when a family sat at the top level, where no object contains it.
    if (result.locations.some((m) => collapseKeyFamily(pathOf(m.loc)) === null)) {
      console.log('dynamic key family at the top level - failing generation');
      recordFailure(destType, 'dynamic-key-family');
      return;
    }
    destinations[destType] = paths;
    console.log(
      `${paths.length} path(s): ${paths.join(', ')}${relaxed ? ' [relaxed mock matching]' : ''}`,
    );
  };

  try {
    for (const destination of allDestinations) {
      await deriveOne(destination);
    }
  } finally {
    harness.stop();
  }

  if (failures.length > 0) {
    console.error('\nERROR: secret-path derivation failed; artifact was not written:');
    for (const { destType, reason } of failures.sort((a, b) =>
      a.destType.localeCompare(b.destType),
    )) {
      console.error(`  ${destType}: ${reason}`);
    }
    process.exitCode = 1;
    return;
  }

  // Sorted on the way out. Destination order otherwise follows directory enumeration, which is
  // not guaranteed to agree between a contributor's machine and CI - and an artifact whose key
  // order can change is one that fails `--check` for no reason. Sorting also makes the committed
  // file diffable, which is what makes a path change visible in review.
  const secretPaths = sortedByKey(destinations);

  let action: string;
  if (options.check) {
    reportDrift(secretPaths);
    action = 'derived';
  } else {
    fs.writeFileSync(OUT_FILE, serialise(secretPaths));
    action = `wrote ${nodePath.relative(process.cwd(), OUT_FILE)}:`;
  }
  const all = Object.values(destinations);
  const nothing = all.filter((paths) => paths.length === 0).length;
  console.log(
    `\n${action} ${all.length} destinations - ` +
      `${all.length - nothing} with derived paths, ${nothing} with nothing to mask`,
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
};
