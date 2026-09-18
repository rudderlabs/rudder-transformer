/* eslint-disable no-console, no-await-in-loop, no-restricted-syntax, no-continue */
// This is a build-time generator, not shipped runtime code, so the test-only packages it
// drives (supertest, axios-mock-adapter, http-terminator) are correctly devDependencies.
/* eslint-disable import/no-extraneous-dependencies */
/**
 * Derives the `secretPaths` map carried on GET /features.
 *
 * The rule: a byte in the outbound request is secret-derived iff changing a declared secret
 * input changes it. So for every component-test fixture we run the real transform twice
 * (to find non-deterministic fields) and then once per declared secretKey with a
 * format-preserving decoy substituted, and record which output leaves moved.
 *
 * Nothing here is hand-authored per destination: the only input is `secretKeys` from the
 * destination definition, which is the source of truth for what counts as a credential.
 *
 * Usage:
 *   npx ts-node test/secret-paths/generate.ts --destination=klaviyo,ga4
 *   npx ts-node test/secret-paths/generate.ts            # whole corpus
 *
 * `--integrations-config` points at a rudder-integrations-config checkout; a production
 * build would read the published destination definitions instead.
 */
import fs from 'fs';
import cloneDeep from 'lodash/cloneDeep';
import path, { join } from 'path';
import { getTestData } from '../integrations/testUtils';
import tags from '../../src/v0/util/tags';
import { getIntegrations } from '../../src/routes/utils';
import { loadDeclaredSecretKeys, probeConfigFor } from './declared';
import { argOf, hasFlag } from './args';
import type { MockMatching } from './harness';
import {
  configSecretsFor,
  Harness,
  fixturesByDestination,
  isObj,
  requestsIn,
  startHarness,
  visitConfigSecrets,
} from './harness';
import {
  ARRAY_MARKER,
  ENDPOINT_FIELD,
  collapseArrayMarkers,
  escapeSegment,
} from '../../src/secretPaths/path';
import {
  EndpointExposure,
  MASKING_FOR_REASON,
  SecretPathsManifest,
  UnresolvedReason,
} from '../../src/secretPaths/types';

const OUT_FILE = join(__dirname, '../../src/secretPaths/secretPaths.json');
/** Shape version of the emitted artifact, checked against the reader in src/secretPaths. */
const MANIFEST_VERSION = 2;

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
const decoyOf = (value: string, seed = 1): string =>
  [...value]
    .map((ch, i) => {
      const shift = ((i + seed * 3) % 7) + seed;
      if (DIGITS.includes(ch)) return DIGITS[(DIGITS.indexOf(ch) + shift) % DIGITS.length];
      if (LOWER.includes(ch)) return LOWER[(LOWER.indexOf(ch) + shift) % LOWER.length];
      if (UPPER.includes(ch)) return UPPER[(UPPER.indexOf(ch) + shift) % UPPER.length];
      return ch; // punctuation and separators are structural - leave them alone
    })
    .join('');

interface FlattenedOutput {
  /** `req[n]|headers.Authorization` -> value */
  leaves: Map<string, string>;
  /** How many request-shaped objects were found, used to detect misalignment. */
  requestCount: number;
}

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
const flattenRequests = (output: unknown): FlattenedOutput => {
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

interface CaseOutcome {
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
  /** The declared key whose substitution destabilised the diff, if any. */
  unstableKey?: string;
  /** Set when the harness itself failed - a corpus or generator defect, not a finding. */
  harnessError?: string;
}

interface Baseline {
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
 * One field that moved when an input was perturbed, with the evidence that proved it.
 *
 * The two values travel with the location rather than being consumed on the spot, so that policy
 * questions - is this field excluded? where in the URL does the credential sit? - are answered
 * once, at the point paths are collapsed, instead of inside each producer. There are two
 * producers (config-driven and fetched-credential), and classifying in one of them is how the
 * other silently escapes the policy.
 */
interface Movement {
  /** `req[n]|headers.Authorization` - the request index is dropped when paths are collapsed. */
  loc: string;
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

/** Compares the baseline against two decoy runs and reports what moved because of one key. */
const locationsForKey = (
  declaredKey: string,
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

    if (process.env.SECRET_PATHS_DEBUG) {
      console.log(
        `\n    [debug] ${loc} from=${declaredKey}` +
          `\n            real =${JSON.stringify(realValue).slice(0, 90)}` +
          `\n            decoy=${JSON.stringify(decoyValue).slice(0, 90)}`,
      );
    }
    found.push({ loc, evidence: { real: realValue, decoy: decoyValue } });
  }
  return found;
};

const deriveForCase = async (
  harness: Harness,
  destination: string,
  tcData: any,
  declaredKeys: string[],
  matching: MockMatching,
): Promise<CaseOutcome> => {
  const outcome: CaseOutcome = { locations: [], sawRequest: false, transformed: false };
  const originalBody = tcData.input.request.body;

  harness.useMocksFor(destination, undefined, matching);
  const { transformed, baseline } = await runBaseline(harness, tcData, originalBody);
  outcome.transformed = transformed;
  if (!baseline) return outcome;
  outcome.sawRequest = true;

  // One key at a time so the key responsible for an unstable diff can be named. The whole
  // destination fails closed either way - a partial path set is indistinguishable from a
  // complete one to a consumer - but which key destabilised it is the first thing anyone
  // investigating needs, and the run has it in hand right here.
  for (const declaredKey of declaredKeys) {
    if (configSecretsFor(originalBody, declaredKey).length === 0) continue;

    // Build the decoy body and the matching mock rewrite together. The corpus matches mocks on
    // request headers, which carry the credential, so a decoy config without a decoy mock makes
    // the destination's own lookups miss - and that shape change reads as instability.
    const decoyBody = (seed: number) => {
      const body = cloneDeep(originalBody);
      const substitutions = new Map<string, string>();
      visitConfigSecrets(body, declaredKey, (v) => {
        const decoy = decoyOf(v, seed);
        substitutions.set(v, decoy);
        return decoy;
      });
      harness.useMocksFor(destination, substitutions, matching);
      return body;
    };

    const out1 = await harness.runCase(tcData, decoyBody(1));
    if (!out1) {
      // The decoy changed the outcome (validation rejected it, a different branch was taken),
      // so any diff would be meaningless. Fail closed for this destination.
      if (process.env.SECRET_PATHS_DEBUG) {
        console.log(`\n    [debug] unstable: '${declaredKey}' decoy run produced no output`);
      }
      outcome.unstableKey = declaredKey;
      return outcome;
    }

    const decoy = flattenRequests(out1);
    // A different number of requests, or of fields within them, means the decoy took a
    // different branch. Positions no longer line up, so any diff would be noise. Checked before
    // the corroboration run so an unstable key does not cost a second full transform.
    if (
      decoy.requestCount !== baseline.runA.requestCount ||
      decoy.leaves.size !== baseline.runA.leaves.size
    ) {
      if (process.env.SECRET_PATHS_DEBUG) {
        console.log(
          `\n    [debug] unstable: '${declaredKey}' changed the shape - ` +
            `requests ${baseline.runA.requestCount}->${decoy.requestCount}, ` +
            `leaves ${baseline.runA.leaves.size}->${decoy.leaves.size}`,
        );
      }
      outcome.unstableKey = declaredKey;
      return outcome;
    }

    const out2 = await harness.runCase(tcData, decoyBody(2));
    if (!out2) {
      outcome.unstableKey = declaredKey;
      return outcome;
    }

    outcome.locations.push(...locationsForKey(declaredKey, baseline, decoy, flattenRequests(out2)));
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
 * Run only for destinations the main pass left empty, so it costs nothing for the rest.
 */
const deriveFromFetchedCredentials = async (
  harness: Harness,
  destination: string,
  filePaths: string[],
): Promise<Movement[]> => {
  const candidates = harness.mockResponseSecrets(destination);
  if (candidates.length === 0) return [];
  const locations: Movement[] = [];

  await harness.withoutCache(async () => {
    for (const filePath of filePaths) {
      let cases: any[];
      try {
        cases = getTestData(filePath);
      } catch {
        continue;
      }
      for (const tcData of cases) {
        if (tcData.module !== tags.MODULES.DESTINATION) continue;
        if (!harness.routeFor(tcData) || !tcData.input.request.body) continue;
        const body = tcData.input.request.body;

        // The same two-run non-determinism rule as the config pass, not a second copy of it:
        // that rule is the soundness core of the whole derivation, and a fix applied to one copy
        // would silently miss this branch.
        const { baseline } = await runBaseline(harness, tcData, body, () =>
          harness.useMocksFor(destination),
        );
        if (!baseline) continue;
        const { runA, nonDeterministic } = baseline;

        for (const candidate of candidates) {
          const decoyRuns: FlattenedOutput[] = [];
          for (const seed of [1, 2]) {
            harness.useMocksFor(
              destination,
              new Map([[candidate, decoyOf(candidate, seed)]]),
              'strict',
              'response',
            );
            const out = await harness.runCase(tcData, cloneDeep(body));
            if (!out) break;
            decoyRuns.push(flattenRequests(out));
          }
          if (decoyRuns.length !== 2) continue;
          if (decoyRuns[0].requestCount !== runA.requestCount) continue;
          if (decoyRuns[0].leaves.size !== runA.leaves.size) continue;

          for (const [loc, realValue] of runA.leaves) {
            if (nonDeterministic.has(loc)) continue;
            const moved = decoyRuns[0].leaves.get(loc);
            if (moved === undefined || moved === realValue) continue;
            // same corroboration rule: a field carrying the credential differs for each decoy
            if (decoyRuns[1].leaves.get(loc) === moved) continue;
            locations.push({ loc, evidence: { real: realValue, decoy: moved } });
          }
        }
      }
    }
  });
  harness.useMocksFor(destination);
  return locations;
};

const deriveForDestination = async (
  harness: Harness,
  destination: string,
  declaredKeys: string[],
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
      if (tcData.module !== tags.MODULES.DESTINATION) continue;
      if (!harness.routeFor(tcData) || !tcData.input.request.body) continue;

      const outcome = await harness.withCaseEnv(tcData, () =>
        deriveForCase(harness, destination, tcData, declaredKeys, matching),
      );
      total.locations.push(...outcome.locations.map(withoutUnreadEvidence));
      total.sawRequest = total.sawRequest || outcome.sawRequest;
      total.transformed = total.transformed || outcome.transformed;
      // Nothing this destination produces will be published once it is doomed, so stop paying
      // for transforms: the remaining cases and files cannot change the outcome.
      if (outcome.unstableKey || outcome.harnessError) {
        total.unstableKey = outcome.unstableKey;
        total.harnessError = outcome.harnessError;
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
const collapseKeyFamily = (path: string): string | null => {
  const segments = path.split(/(?<!\\)\./);
  const family = segments.findIndex((segment) => /\[\d+\]$/.test(segment));
  if (family === -1) return path;
  return family === 0 ? null : segments.slice(0, family).join('.');
};

/**
 * Applies the endpoint exclusion; see ENDPOINT_FIELD in src/secretPaths/path.ts for why.
 *
 * Both producers funnel through here, so the policy cannot be escaped by adding a third.
 */
const toSecretPaths = (locations: Movement[]): string[] =>
  [
    ...new Set(
      locations
        .map(({ loc }) => pathOf(loc))
        .filter((path) => path !== ENDPOINT_FIELD)
        // Collapse marked array positions to a wildcard. Fixtures only ever exercise as many
        // elements as they declare, so emitting the observed indices would leave every element
        // beyond that count unmasked in production.
        .map(collapseArrayMarkers)
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
  pathOf(m.loc) === ENDPOINT_FIELD ? m : { loc: m.loc };

const sortedByKey = <T>(record: Record<string, T>): Record<string, T> =>
  Object.fromEntries(Object.entries(record).sort(([a], [b]) => (a < b ? -1 : 1)));

/**
 * The artifact's bytes. One definition, used both to write the file and to check it, so the two
 * cannot disagree about what "unchanged" means.
 */
const serialise = (manifest: SecretPathsManifest): string =>
  `${JSON.stringify(manifest, null, 2)}\n`;

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
const reportDrift = (fresh: SecretPathsManifest): void => {
  // Read from disk rather than importing, so a run started before an edit still compares against
  // what is actually committed.
  let committedText: string;
  let committed: SecretPathsManifest;
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
  for (const destType of Object.keys(fresh.destinations).sort()) {
    if (!(destType in committed.destinations)) {
      added.push(`  ${destType}: derives ${show(fresh.destinations[destType])}, not in the file`);
    } else if (
      // Exact: paths are sorted by `toSecretPaths` before they get here, and `null` renders as
      // `null`. Deliberately not `show`, whose job is to read well - equality must not move
      // when someone reworks a message.
      JSON.stringify(committed.destinations[destType]) !==
      JSON.stringify(fresh.destinations[destType])
    ) {
      changed.push(
        `  ${destType}: committed ${show(committed.destinations[destType])}` +
          ` -> derives ${show(fresh.destinations[destType])}`,
      );
    }
  }
  for (const destType of Object.keys(committed.destinations).sort()) {
    if (!(destType in fresh.destinations)) {
      removed.push(`  ${destType}: in the file, but this build derives nothing for it`);
    }
  }

  const say = (title: string, lines: string[]) => {
    if (lines.length > 0) console.error(`\n${title}\n${lines.join('\n')}`);
  };
  console.error('\nERROR: src/secretPaths/secretPaths.json is out of date.');
  if (added.length + removed.length + changed.length === 0) {
    // Nothing a consumer would act on moved, so name the part that did rather than printing an
    // empty report and leaving the reader to guess.
    const differing = (['version', 'unresolved', 'endpointExposures'] as const).filter(
      (field) => JSON.stringify(committed[field]) !== JSON.stringify(fresh[field]),
    );
    console.error(
      differing.length > 0
        ? `  No destination's masking changed; what differs is ${differing.join(', ')}.`
        : // Same content, different bytes - the file was hand-edited or reformatted. Worth
          // naming, because the fix is "regenerate" rather than "go and find the moved secret".
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

const main = async () => {
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
  const implemented = new Set<string>([
    ...getIntegrations(join(__dirname, '../../src/v0/destinations')),
    ...getIntegrations(join(__dirname, '../../src/cdk/v2/destinations')),
  ]);
  const allDestinations = [...implemented]
    .filter((d: string) => !only || only.includes(d.toLowerCase()))
    .sort();

  const destinations: Record<string, string[] | null> = {};
  /** Destinations with neither a fixture nor a usable probe - a build failure, not a finding. */
  const inconclusive: string[] = [];
  const unresolved: Record<string, UnresolvedReason> = {};
  /** Destinations whose endpoint carried a declared secret - recorded, never masked. */
  const endpointExposures: Record<string, EndpointExposure> = {};

  /**
   * Records both halves at once: why, for diagnostics, and what the consumer must do. Deciding
   * here rather than in the consumer means the policy lives with the evidence.
   */
  const recordUnresolved = (destType: string, reason: UnresolvedReason) => {
    unresolved[destType] = reason;
    destinations[destType] = MASKING_FOR_REASON[reason];
  };

  for (const destination of allDestinations) {
    const destType = destination.toUpperCase();
    const lower = destination.toLowerCase();
    // `undefined` means no definition could be read; `[]` means one was read and declared none.
    // Only the second is a statement about credentials - the first is an absence of evidence and
    // fails closed, or a destination whose definition went missing upstream would quietly
    // publish "nothing to mask".
    if (!(lower in declaredSecretKeys)) {
      recordUnresolved(destType, 'no-definition');
      continue;
    }
    const declaredKeys = declaredSecretKeys[lower];
    if (declaredKeys === undefined) {
      recordUnresolved(destType, 'no-definition');
      continue;
    }
    if (declaredKeys.length === 0) {
      recordUnresolved(destType, 'no-declared-secrets');
      continue;
    }

    const filePaths = corpus.get(destination) ?? [];
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
    try {
      result = await deriveForDestination(harness, destination, declaredKeys, filePaths);
      if (result.unstableKey) {
        // Strict matching could not settle this destination. Its credential probably reaches the
        // matched headers in a form the substitution cannot rewrite - `Basic base64(user:secret)`
        // has no raw secret to replace. Retry with headers ignored: both runs are relaxed the
        // same way, so they still differ only by the credential.
        const retry = await deriveForDestination(
          harness,
          destination,
          declaredKeys,
          filePaths,
          'ignore-headers',
        );
        if (!retry.unstableKey && !retry.harnessError && retry.locations.length > 0) {
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
    if (result.unstableKey) {
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
      const exchanged = await deriveFromFetchedCredentials(harness, destination, filePaths);
      if (exchanged.length === 0) {
        console.log(`unstable under '${result.unstableKey}' - failing closed`);
        recordUnresolved(destType, 'unstable-under-substitution');
        continue;
      }
      result.locations = exchanged;
      process.stdout.write(
        `unstable under '${result.unstableKey}', credential fetched during transform -> `,
      );
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
    if (toSecretPaths(result.locations).length === 0) {
      // No *maskable* path yet - which includes the case where the only field that moved was the
      // excluded endpoint. The declared secret may have been exchanged for a token first, in
      // which case the credential on the wire comes from a mocked response, so try perturbing
      // that before concluding there is nothing left to find.
      const fetched = await deriveFromFetchedCredentials(harness, destination, filePaths);
      if (fetched.length > 0) {
        result.locations.push(...fetched.map(withoutUnreadEvidence));
        process.stdout.write('credential fetched during transform -> ');
      }
    }

    // Both policies are applied once, over the locations from both producers, so that neither
    // producer can escape either of them.
    const paths = toSecretPaths(result.locations);
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
  const manifest: SecretPathsManifest = {
    version: MANIFEST_VERSION,
    destinations: sortedByKey(destinations),
    unresolved: sortedByKey(unresolved),
    endpointExposures: sortedByKey(endpointExposures),
  };

  let action: string;
  if (hasFlag('check')) {
    reportDrift(manifest);
    action = 'derived';
  } else {
    fs.writeFileSync(OUT_FILE, serialise(manifest));
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
