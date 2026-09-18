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
 * It shares the harness and the path grammar with the generator, so it replays exactly the
 * request the paths were derived from, but re-derives the answer independently: the generator
 * perturbs inputs and diffs, the validator masks and searches. Sharing the plumbing is what
 * makes it a check; sharing the logic would make it a tautology.
 *
 * Known limitation, and the reason this reports rather than throws today: a short or dual-use
 * fixture secret collides with ordinary data and reads as a leak. LEMNISK's fixture key is
 * `1234`, which appears inside `product_id: "ab1234"`. Before this can gate CI, those fixture
 * values need to be distinctive enough not to occur by accident.
 *
 * Usage: node test/secret-paths/run.js --validate --integrations-config=<path>
 */
import { base64Convertor } from '@rudderstack/integrations-lib';
import { getTestData } from '../integrations/testUtils';
import tags from '../../src/v0/util/tags';
import { ARRAY_MARKER, ENDPOINT_FIELD, parsePath } from '../../src/secretPaths/path';
import {
  configSecretsFor,
  fixturesByDestination,
  isObj,
  requestsIn,
  startHarness,
} from './harness';

/** Does this string carry the secret directly, or through a reversible encoding? */
const carriesSecret = (value: string, secret: string): boolean => {
  const forms = [
    secret,
    base64Convertor(secret),
    base64Convertor(`${secret}:`),
    base64Convertor(`:${secret}`),
    encodeURIComponent(secret),
  ];
  if (forms.some((form) => value.includes(form))) return true;
  return (value.match(/[\d+/A-Za-z]{8,}={0,2}/g) || []).some((token) =>
    Buffer.from(token, 'base64').toString('utf8').includes(secret),
  );
};

/** Applies one path, expanding `#`, the way the consumer's sjson.Set would. */
const maskAt = (root: unknown, path: string): void => {
  const segments = parsePath(path);
  const descend = (node: unknown, depth: number): void => {
    if (!isObj(node)) return;
    const segment = segments[depth];
    const last = depth === segments.length - 1;
    if (segment === ARRAY_MARKER) {
      if (!Array.isArray(node)) return;
      node.forEach((child, index) => {
        if (last) node[index] = '***';
        else descend(child, depth + 1);
      });
      return;
    }
    if (last) {
      if (node[segment] !== undefined) node[segment] = '***';
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
    const survivors = new Set<string>();

    for (const file of corpus.get(destType.toLowerCase()) ?? []) {
      let fixtures: any[];
      try {
        fixtures = getTestData(file);
      } catch {
        continue;
      }
      for (const tc of fixtures) {
        if (tc.module !== tags.MODULES.DESTINATION) continue;
        if (!tc.input?.request?.body) continue;

        // The generator's own definition of "this destination's secrets", so the validator
        // cannot report a clean bill of health about a value it never looked for.
        //
        // Read from the fixture, before the transform, precisely so the transform can be skipped:
        // a case whose config carries no declared value has nothing for this loop to search for,
        // and running it anyway costs a full transform to reach a guaranteed `continue`.
        const secrets = declaredKeys.flatMap((key) => configSecretsFor(tc.input.request.body, key));
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
          if (typeof endpoint === 'string' && secrets.some((s) => carriesSecret(endpoint, s))) {
            endpointCarriers.add(destType);
          }
          if (failClosed) continue;
          const serialised = JSON.stringify(maskable);
          secrets.filter((s) => carriesSecret(serialised, s)).forEach((s) => survivors.add(s));
        }
      }
    }
    // Fail-closed destinations have no derived paths to be covered by anything.
    if (!failClosed) coverage.push(cases);
    if (survivors.size > 0) leaks.push(`${destType}: ${[...survivors].join(', ')}`);
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
  console.log(`survivors: ${leaks.length}`);
  leaks.forEach((leak) => console.log(`  ${leak}`));
  if (endpointCarriers.size > 0) {
    console.log(
      `\nendpoint carries a declared secret (excluded by decision, not counted above): ` +
        `${endpointCarriers.size}\n  ${[...endpointCarriers].sort().join(', ')}`,
    );
  }
  console.log(
    '\nNOTE: survivors include collisions where a short or dual-use fixture value appears in' +
      '\nordinary data. Each needs checking by hand before this can gate CI - see the header.',
  );
};
