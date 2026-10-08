/* eslint-disable no-console, no-await-in-loop, no-restricted-syntax, no-continue */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * Validates the committed paths against the fixture corpus.
 *
 * This is the assertion that makes the scheme developer-proof: it is what turns "someone added
 * an auth header" from a silent leak into a red build. It answers two questions with counts
 * rather than claims:
 *
 *   LEAKS - after masking every path listed for a destination, does any declared secret value
 *   still appear anywhere in the request? Every survivor is a credential the paths missed.
 *
 *   COVERAGE - how many fixture cases back each destination's paths. An entry derived from one
 *   case is one unexercised branch away from being incomplete.
 *
 * `endpoint` is the only excluded field. Top-level metadata remains maskable under the shared
 * contract and is searched after its derived paths are applied.
 *
 * It shares the harness and the path grammar with the generator, so it replays exactly the
 * request the paths were derived from, but re-derives the answer independently: the generator
 * perturbs inputs and diffs, the validator masks and searches. Sharing the plumbing is what
 * makes it a check; sharing the logic would make it a tautology.
 *
 * `carriesSecret` sits on the plumbing side of that line: it answers "does this string contain
 * this value, through any reversible encoding", which is a question about encodings rather than
 * about where credentials land. The two halves still select what to test independently - by
 * non-determinism there, by survivorship here - they only agree on what "appears" means.
 *
 * Known fixture-corpus survivors are pinned exactly in `validation-baseline.json`. Any added or
 * removed survivor fails validation, so collision cleanup can shrink the baseline deliberately
 * without allowing new credential exposure to pass unnoticed.
 *
 * Usage: node test/secret-paths/run.js --validate --integrations-config=<path>
 */
import { getTestData } from '../integrations/testUtils';
import {
  ARRAY_MARKER,
  ENDPOINT_FIELD,
  collapseArrayMarkers,
  escapeSegment,
  parsePath,
} from '../../src/secretPaths/path';
import validationBaseline from './validation-baseline.json';
import {
  carriesSecret,
  isDerivableCase,
  fixturesByDestination,
  isObj,
  MIN_SECRET_LEN,
  requestsIn,
  startHarness,
} from './harness';

export interface SecretValue {
  source: string;
  value: string;
}

export interface Survivor {
  source: string;
  value: string;
  path: string;
}

const collectRuntimeSecretValues = (node: unknown): SecretValue[] => {
  const found: SecretValue[] = [];
  const visitBag = (bag: unknown, source: string): void => {
    if (!isObj(bag)) return;
    for (const [key, value] of Object.entries(bag)) {
      const childSource = `${source}.${key}`;
      if (typeof value === 'string' && value.length >= MIN_SECRET_LEN) {
        found.push({ source: childSource, value });
      } else {
        visitBag(value, childSource);
      }
    }
  };
  const walk = (current: unknown): void => {
    if (!isObj(current)) return;
    if (isObj(current.metadata)) visitBag(current.metadata.secret, 'metadata.secret');
    if (Array.isArray(current.metadata)) {
      current.metadata.forEach((metadata) => {
        if (isObj(metadata)) visitBag(metadata.secret, 'metadata.#.secret');
      });
    }
    for (const [key, value] of Object.entries(current)) {
      if (key !== 'metadata') walk(value);
    }
  };
  walk(node);
  return found;
};

const collectDeclaredSecretValues = (node: unknown, declaredKeys: string[]): SecretValue[] => {
  const found: SecretValue[] = [];
  const leaves = declaredKeys.map((key) => ({ key, leaf: key.split('.').pop()!.toLowerCase() }));
  const walk = (current: unknown, insideConfig: boolean): void => {
    if (!isObj(current)) return;
    for (const [key, value] of Object.entries(current)) {
      const nowInsideConfig = insideConfig || key === 'config' || key === 'Config';
      if (insideConfig && typeof value === 'string' && value.length >= MIN_SECRET_LEN) {
        leaves
          .filter(({ leaf }) => leaf === key.toLowerCase())
          .forEach(({ key: declaredKey }) =>
            found.push({ source: `config.${declaredKey}`, value }),
          );
      }
      walk(value, nowInsideConfig);
    }
  };
  walk(node, false);
  return found;
};

export const secretValuesFor = (node: unknown, declaredKeys: string[]): SecretValue[] => [
  ...collectDeclaredSecretValues(node, declaredKeys),
  ...collectRuntimeSecretValues(node),
];

const survivorId = ({ source, path, value }: Survivor): string => `${source} at ${path}: ${value}`;

const countsFor = (values: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return counts;
};

const leafSurvivorsIn = (request: Record<string, unknown>, secret: SecretValue): Survivor[] => {
  const survivors: Survivor[] = [];
  const walk = (value: unknown, prefix: string): void => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${prefix}.${ARRAY_MARKER}${index}`));
      return;
    }
    if (isObj(value)) {
      for (const [key, child] of Object.entries(value))
        walk(child, `${prefix}.${escapeSegment(key)}`);
      return;
    }
    if (carriesSecret(String(value), secret.value)) {
      survivors.push({
        source: secret.source,
        value: secret.value,
        path: collapseArrayMarkers(prefix),
      });
    }
  };

  for (const [field, value] of Object.entries(request)) {
    if (field !== ENDPOINT_FIELD) walk(value, escapeSegment(field));
  }
  return survivors;
};

/** Applies one path, expanding `#`, the way the consumer's sjson.Set would. */
export const survivorLocationsIn = (request: Record<string, unknown>, secret: string): string[] =>
  Object.entries(request)
    .filter(([field]) => field !== ENDPOINT_FIELD)
    .filter(([, value]) => carriesSecret(JSON.stringify(value), secret))
    .map(([field]) => field);

export const findSurvivors = (
  request: Record<string, unknown>,
  paths: string[],
  secrets: string[],
): string[] => {
  const masked = JSON.parse(JSON.stringify(request));
  paths.forEach((path) => maskAt(masked, path));
  return secrets.filter((secret) => survivorLocationsIn(masked, secret).length > 0);
};

export const findSurvivorIds = (
  request: Record<string, unknown>,
  paths: string[],
  secrets: SecretValue[],
): string[] => {
  const masked = JSON.parse(JSON.stringify(request));
  paths.forEach((path) => maskAt(masked, path));
  return secrets.flatMap((secret) => leafSurvivorsIn(masked, secret).map(survivorId));
};

export const maskAt = (root: unknown, path: string): void => {
  const segments = parsePath(path);
  const descend = (node: unknown, depth: number): void => {
    if (!isObj(node)) return;
    const segment = segments[depth];
    const last = depth === segments.length - 1;
    if (segment === ARRAY_MARKER) {
      if (!Array.isArray(node)) return;
      node.forEach((child, index) => {
        if (last) node[index] = '******';
        else descend(child, depth + 1);
      });
      return;
    }
    if (last) {
      if (node[segment] !== undefined) node[segment] = '******';
      return;
    }
    descend(node[segment], depth + 1);
  };
  descend(root, 0);
};

export const validate = async (
  secretPaths: Record<string, string[] | null>,
  declaredByDestination: Record<string, string[]>,
): Promise<void> => {
  const harness = startHarness();
  const corpus = fixturesByDestination();

  // Every destination, including the fail-closed ones.
  //
  // Empty-path destinations are replayed because `[]` is a claim - "no declared secret reaches a
  // request" - worth the same scrutiny as a list of paths, and because it is where a destination
  // lands when its only secret-carrying field was the excluded endpoint.
  //
  // Fail-closed destinations (`null`) are replayed for the endpoint check alone. Masking
  // everything maskable still leaves the endpoint, so "masks wholesale, cannot leak" is true of
  // their headers, params and body but not of their URL - and SFMC is fail-closed precisely
  // because its declared subdomain sits there. Their maskable half is not searched: there are no
  // paths to apply, so every secret would trivially read as surviving.
  const checked = Object.entries(secretPaths);
  const leaks: string[] = [];
  const coverage: number[] = [];
  /** Destinations whose endpoint still carries a declared secret after masking, by decision. */
  const endpointCarriers = new Set<string>();

  for (const [destType, paths] of checked) {
    const failClosed = paths === null;
    const declaredKeys = declaredByDestination[destType.toLowerCase()] || [];
    // Register this destination's network mocks. The harness registers none by default, because
    // the generator swaps them per decoy run - so a driver that forgets this replays every case
    // with no mocks, every lookup throws, and the run reports a clean sweep of nothing.
    harness.useMocksFor(destType.toLowerCase());
    let cases = 0;
    const survivors: string[] = [];

    for (const file of corpus.get(destType.toLowerCase()) ?? []) {
      let fixtures: any[];
      try {
        fixtures = getTestData(file);
      } catch {
        continue;
      }
      for (const tc of fixtures) {
        // The shared predicate, so the validator replays exactly the cases the generator derived
        // from - it was hand-rolling a copy that omitted the `routeFor` check and so replayed
        // `dataDelivery` cases the generator declines.
        if (!isDerivableCase(harness, tc)) continue;

        // Contract-focused extraction, independent from the generator's perturbation walkers:
        // configured values come from declared config keys, and runtime values come only from real
        // metadata.secret bags. Read before the transform, precisely so a case with no candidate
        // credential can skip an expensive replay.
        const secrets = secretValuesFor(tc.input.request.body, declaredKeys);
        if (secrets.length === 0) continue;

        const output = await harness.withCaseEnv(tc, () =>
          harness.runCase(tc, tc.input.request.body),
        );
        if (!output) continue;
        const requests = requestsIn(output);
        if (requests.length === 0) continue;
        cases += 1;

        for (const req of requests) {
          const masked = JSON.parse(JSON.stringify(req));
          paths?.forEach((p) => maskAt(masked, p));
          // The endpoint is excluded from masking by decision, so a secret sitting there is not
          // a path the derivation missed. It is counted separately rather than ignored, so that
          // exclusion can never quietly absorb a credential nobody decided to accept.
          const { [ENDPOINT_FIELD]: endpoint, ...maskable } = masked;
          if (
            typeof endpoint === 'string' &&
            secrets.some((s) => carriesSecret(endpoint, s.value))
          ) {
            endpointCarriers.add(destType);
          }
          if (failClosed) continue;
          secrets
            .flatMap((secret) => leafSurvivorsIn(maskable, secret))
            .forEach((survivor) => survivors.push(survivorId(survivor)));
        }
      }
    }
    // Fail-closed destinations have no derived paths to be covered by anything.
    if (!failClosed) coverage.push(cases);
    const observed = countsFor(survivors);
    const accepted = countsFor((validationBaseline as Record<string, string[]>)[destType] ?? []);
    const unexpected = [...observed.keys()].filter((survivor) => !accepted.has(survivor));
    const missing = [...accepted.keys()].filter((survivor) => !observed.has(survivor));
    const countChanged = [...observed.entries()]
      .filter(
        ([survivor, count]) =>
          accepted.get(survivor) !== undefined && accepted.get(survivor) !== count,
      )
      .map(([survivor, count]) => `${survivor} (${accepted.get(survivor)} -> ${count})`);
    if (unexpected.length > 0 || missing.length > 0 || countChanged.length > 0) {
      leaks.push(
        `${destType}: unexpected [${unexpected.join(', ')}], missing baseline ` +
          `[${missing.join(', ')}], count changed [${countChanged.join(', ')}]`,
      );
    }
    process.stdout.write('.');
  }

  harness.stop();
  const sorted = [...coverage].sort((a, b) => a - b);
  const withPaths = checked.filter(([, paths]) => paths !== null && paths.length > 0).length;
  const failClosedCount = checked.filter(([, paths]) => paths === null).length;
  console.log(
    `\n\nvalidated ${checked.length} destinations - ${withPaths} with derived paths, ` +
      `${checked.length - withPaths - failClosedCount} claiming nothing to mask, ` +
      `${failClosedCount} fail-closed (endpoint check only)`,
  );
  console.log(
    `coverage: min ${sorted[0]}, median ${sorted[Math.floor(sorted.length / 2)]}, ` +
      `max ${sorted[sorted.length - 1]} fixture cases`,
  );
  console.log(`survivor drift: ${leaks.length}`);
  leaks.forEach((leak) => console.log(`  ${leak}`));
  if (endpointCarriers.size > 0) {
    console.log(
      `\nendpoint carries a declared secret (excluded by decision, not counted above): ` +
        `${endpointCarriers.size}\n  ${[...endpointCarriers].sort().join(', ')}`,
    );
  }
  if (leaks.length > 0) {
    throw new Error(
      `Secret-path validation failed: ${leaks.length} destination(s) changed survivor baseline`,
    );
  }
};
