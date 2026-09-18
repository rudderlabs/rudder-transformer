/* eslint-disable import/no-extraneous-dependencies */
/**
 * Shared plumbing for the generator and the validator.
 *
 * Both drive the real transforms through the component-test corpus, and both need to drive them
 * *identically* - the validator checks paths the generator derived, so if it replays a subtly
 * different request (a missing pathSuffix, a dropped query param) it is not checking the same
 * thing at all. Keeping the request construction in one place is what makes the validator a
 * check rather than a second opinion.
 *
 * Deliberately NOT shared: how the generator decides a field is secret-derived, and how the
 * validator decides a secret survived. The validator being an independent re-derivation is the
 * whole point - share the plumbing, never the logic.
 */
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import axios from 'axios';
import MockAxiosAdapter from 'axios-mock-adapter';
import { Server } from 'http';
import { join } from 'path';
import isObjectLike from 'lodash/isObjectLike';
import { configureBatchProcessingDefaults, axiosFromLib } from '@rudderstack/integrations-lib';
import { applicationRoutes } from '../../src/routes/index';
import {
  getTestDataFilePaths,
  registerAxiosMocks,
  getTestMockData,
} from '../integrations/testUtils';
import tags from '../../src/v0/util/tags';
import { MockHttpCallsData } from '../integrations/testTypes';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DestinationCache = require('../../src/v0/util/cache');
import { EnvManager } from '../integrations/envUtils';

const DEFAULT_VERSION = 'v0';
/** Shorter than this is not a credential worth substituting or hunting for. */
export const MIN_SECRET_LEN = 3;

export const TEST_ROOT = join(__dirname, '../integrations');

// isObjectLike, not lodash's isObject or the repo's util isObject: both exclude arrays, and
// these traversals have to descend into them.
export const isObj = (v: unknown): v is Record<string, any> => isObjectLike(v);

/**
 * Response fields whose name suggests a credential.
 *
 * A heuristic, unlike the config side which is driven by the `secretKeys` registry - there is no
 * registry for what a destination's own API hands back. It only picks *candidates*; whether one
 * reaches the request is still settled by diffing, so a wrong candidate costs two runs and
 * yields nothing.
 */
const CREDENTIAL_KEY = /token|secret|password|credential|session|signature|api[-_]?key|^key$/i;

/**
 * How strictly a recorded mock has to match the outgoing request.
 *
 * `strict` is the corpus's own behaviour, including the request headers - which is what we want,
 * because it keeps a destination's lookups discriminating exactly as they do in the suite.
 *
 * `ignore-headers` exists for destinations whose credential reaches the matched headers in a form
 * the substitution cannot rewrite - `Basic base64(user:secret)` contains no raw secret to replace.
 * Relaxing is sound for the derivation specifically: both the real and the decoy run are relaxed
 * identically, so they still differ only by the credential. It is not free, though - where several
 * mocks share a method, URL and body and differ only by headers (marketo has 44 such groups), the
 * first registered wins, and the transform may take a branch production would not. So it is used
 * only as a fallback, after strict matching has already failed for that destination, and never for
 * one that derived cleanly.
 */
export type MockMatching = 'strict' | 'ignore-headers';

/**
 * Which half of a recorded mock a substitution rewrites.
 *
 * `all` keeps a destination's own lookups matching when its *config* secret changes - the
 * request headers carry that secret, so they have to move with it.
 *
 * `response` is for the opposite case: perturbing a credential the destination *receives*. The
 * fixture often uses one string for both the config password and the returned token, so
 * rewriting everywhere would also change what the auth call must send, and that call would stop
 * matching. Rewriting only the response leaves the exchange intact and changes just its result.
 */
export type SubstitutionScope = 'all' | 'response';

/** `no-request`: ran clean, built nothing. `builds-request`: built one. `inconclusive`: neither. */
export type ProbeResult = 'no-request' | 'builds-request' | 'inconclusive';

export interface Harness {
  /**
   * Re-registers the corpus's network mocks for one destination, optionally rewriting recorded
   * secret values to their decoys.
   *
   * The corpus matches mocks on request headers, and those headers carry the credential - 56 of
   * zendesk's 57 mocks, 45 of 45 for intercom. So substituting a secret makes a destination's own
   * lookups stop matching, the transform throws, and the changed output shape reads as
   * "the secret destabilises this destination" when the real cause is that we moved the goalposts
   * mid-run. Rewriting the mocks alongside the config keeps the lookup succeeding identically, so
   * the only thing that differs between the two runs is the credential itself.
   */
  useMocksFor(
    destination: string,
    substitutions?: Map<string, string>,
    matching?: MockMatching,
    scope?: SubstitutionScope,
  ): void;
  /** Replays one fixture case, returning the response body, or null if it did not transform. */
  runCase(tcData: any, body: unknown): Promise<unknown | null>;
  /** The route a fixture case posts to, or null if it is not a transform case. */
  routeFor(tcData: any): string | null;
  /** Runs `fn` with the case's env overrides applied, restoring them afterwards. */
  withCaseEnv<T>(tcData: any, fn: () => Promise<T>): Promise<T>;
  /**
   * Credential-looking values a destination's mocked responses hand back.
   *
   * Some destinations never put a declared secret in the request: they exchange it for a session
   * token first - salesforce trades a password for one - so the request carries the token, which
   * comes from the mocked response rather than the config. Perturbing the config cannot move it,
   * which is why these read as `no-secret-located`. Perturbing the response can.
   */
  mockResponseSecrets(destination: string): string[];
  /**
   * Runs `fn` with the shared destination cache bypassed.
   *
   * Destinations that fetch a token cache it in-process (salesforce's ACCESS_TOKEN_CACHE has a
   * TTL), so a rewritten mock response is never read on a second run - the first run's token is
   * reused and nothing appears to move. Note the TTL itself is no lever: node-cache treats
   * `stdTTL: 0` as *unlimited*, so zeroing it makes the cache permanent rather than absent.
   * Bypassing the lookup is what actually works, and one patch covers every destination that
   * uses the shared util.
   */
  withoutCache<T>(fn: () => Promise<T>): Promise<T>;
  /**
   * Transforms one synthetic event, for destinations the corpus has no fixture for.
   *
   * Returns `'no-request'` only when the transform *succeeded* and produced nothing
   * request-shaped - the same evidence rule fixture-backed destinations are judged by. An error
   * response is also not request-shaped, so the success check is what stops a destination that
   * merely rejected the synthetic config from being read as "sends no credential".
   */
  probe(destType: string, config: Record<string, string>): Promise<ProbeResult>;
  stop(): void;
}

/**
 * Starts the transformer in-process with the corpus's network mocks attached.
 *
 * throwException, never passthrough: an unmocked call must fail loudly rather than reach a real
 * destination API from a build step.
 */
export const startHarness = (): Harness => {
  configureBatchProcessingDefaults({ batchSize: 1, yieldThreshold: 1, sequentialProcessing: true });

  const adapters = [axios, axiosFromLib].map(
    (instance) => new MockAxiosAdapter(instance as any, { onNoMatch: 'throwException' }),
  );
  const mocksByDestination = new Map<string, MockHttpCallsData[]>();

  const app = new Koa();
  app.use(bodyParser({ jsonLimit: '200mb' }));
  applicationRoutes(app);
  const server: Server = app.listen();

  /**
   * Per-case setup the component suite performs. Without it, destinations whose fixtures install
   * their own mocks (90 of ga4's 93 cases, for instance) fail the transform and look
   * indistinguishable from "emits no request" - a silent, and dangerous, false negative.
   */
  const applyCaseSetup = (tcData: any) => adapters.forEach((a) => tcData?.mockFns?.(a));

  return {
    useMocksFor(
      destination: string,
      substitutions?: Map<string, string>,
      matching: MockMatching = 'strict',
      scope: SubstitutionScope = 'all',
    ): void {
      if (!mocksByDestination.has(destination)) {
        mocksByDestination.set(destination, getTestMockData(destination));
      }
      let mocks = mocksByDestination.get(destination) as MockHttpCallsData[];
      if (substitutions?.size) {
        const rewrite = (value: unknown) => {
          let serialised = JSON.stringify(value);
          for (const [real, decoy] of substitutions) {
            serialised = serialised.split(real).join(decoy);
          }
          return JSON.parse(serialised);
        };
        mocks =
          scope === 'response'
            ? mocks.map((mock) => ({ ...mock, httpRes: rewrite(mock.httpRes) }))
            : (rewrite(mocks) as MockHttpCallsData[]);
      }
      adapters.forEach((adapter) => {
        adapter.reset();
        if (matching === 'ignore-headers') {
          // Deliberately not registerAxiosMocks: that helper always installs a header matcher.
          mocks.forEach((mock) => {
            const { url, method, data, params } = mock.httpReq as any;
            const { data: resData, headers: resHeaders, status } = mock.httpRes as any;
            const verb = `on${(method || 'get').charAt(0).toUpperCase()}${(method || 'get').slice(1).toLowerCase()}`;
            const handler = (adapter as any)[verb];
            if (typeof handler !== 'function') return;
            const args =
              (method || 'get').toLowerCase() === 'get' ? [url, { params }] : [url, data];
            handler.apply(adapter, args).reply(status, resData, resHeaders);
          });
          return;
        }
        registerAxiosMocks(adapter, mocks);
      });
    },

    routeFor(tcData: any): string | null {
      switch (tcData.feature) {
        case tags.FEATURES.ROUTER:
          return join('/routerTransform', tcData.input.pathSuffix || '');
        case tags.FEATURES.PROCESSOR:
          return join(
            '/',
            tcData.version || DEFAULT_VERSION,
            'destinations',
            tcData.name,
            tcData.input.pathSuffix || '',
          );
        default:
          // Only the two transform paths build an outbound request from destination config.
          return null;
      }
    },

    async runCase(tcData: any, body: unknown): Promise<unknown | null> {
      const route = this.routeFor(tcData);
      if (!route) return null;
      applyCaseSetup(tcData);
      let res;
      try {
        const { headers, params } = tcData.input.request;
        res = await request(server)
          .post(route)
          .set(headers || {})
          .query(params || {})
          .send(body as any);
      } finally {
        // Undo the fixture's spies here, not in the callers. A fixture that pins the clock
        // (`jest.useFakeTimers().setSystemTime(...)`) overwrites Date.now globally in the shim,
        // so one un-restored case silently changes the transform result for every later
        // destination - and a driver that then skips those cases still reports a clean run.
        (global as any).jest?.restoreAllMocks?.();
      }
      if (res.status !== (tcData.output?.response?.status ?? 200)) return null;
      return res.body;
    },

    async withCaseEnv<T>(tcData: any, fn: () => Promise<T>): Promise<T> {
      const envKeys = Object.keys(tcData.envOverrides ?? {});
      if (envKeys.length === 0) return fn();
      const manager = new EnvManager();
      const snapshotId = `${tcData.id || tcData.name}-secret-paths`;
      manager.takeSnapshot(snapshotId, envKeys);
      manager.applyOverrides(tcData.envOverrides);
      try {
        return await fn();
      } finally {
        manager.restoreSnapshot(snapshotId);
        manager.cleanup();
      }
    },

    mockResponseSecrets(destination: string): string[] {
      if (!mocksByDestination.has(destination)) {
        mocksByDestination.set(destination, getTestMockData(destination));
      }
      const found = new Set<string>();
      const walk = (node: unknown, key: string): void => {
        if (typeof node === 'string') {
          if (CREDENTIAL_KEY.test(key) && node.length >= MIN_SECRET_LEN) found.add(node);
          return;
        }
        if (!isObj(node)) return;
        for (const k of Object.keys(node)) walk((node as any)[k], k);
      };
      (mocksByDestination.get(destination) as MockHttpCallsData[]).forEach((mock) =>
        walk((mock.httpRes as any)?.data, ''),
      );
      return [...found];
    },

    async withoutCache<T>(fn: () => Promise<T>): Promise<T> {
      const original = DestinationCache.prototype.get;
      DestinationCache.prototype.get = async function bypass(_key: string, storeFunction?: any) {
        if (!storeFunction) return undefined;
        const result = await storeFunction();
        // Mirror the real Cache.get contract: a store function may return `{value, age}` to set
        // its own TTL, and callers are handed `value`, not the wrapper. marketo's getAuthToken
        // does exactly that, so a bypass that skipped the unwrap returned an object where the
        // destination expected a token - and the credential never reached the request.
        if (result !== null && typeof result === 'object' && 'value' in result && 'age' in result) {
          return (result as any).value;
        }
        return result;
      };
      try {
        return await fn();
      } finally {
        DestinationCache.prototype.get = original;
      }
    },

    async probe(destType: string, config: Record<string, string>): Promise<ProbeResult> {
      const event = {
        message: {
          type: 'track',
          event: 'probe',
          userId: 'probe-user',
          properties: { probe: true },
          context: { traits: { email: 'probe@example.com' } },
          originalTimestamp: '2024-01-01T00:00:00.000Z',
          timestamp: '2024-01-01T00:00:00.000Z',
          messageId: 'probe-message-id',
        },
        metadata: { jobId: 1, destinationId: 'probe-dest', sourceId: 'probe-source' },
        destination: { ID: 'probe-dest', Name: destType, Enabled: true, Config: config },
        request: { query: { whSchemaVersion: 'v1' } },
      };
      let res;
      try {
        res = await request(server)
          .post(`/v0/destinations/${destType}`)
          .send([event] as any);
      } catch {
        return 'inconclusive';
      }
      if (res.status !== 200) return 'inconclusive';
      // A per-event 4xx/5xx means the transform rejected the synthetic input, which tells us
      // nothing about where its credentials go.
      if (/"statusCode":\s*[45]\d\d/.test(JSON.stringify(res.body))) return 'inconclusive';
      return requestsIn(res.body).length > 0 ? 'builds-request' : 'no-request';
    },

    stop() {
      server.close();
    },
  };
};

/** Every request-shaped object in a transform response, in traversal order. */
export const requestsIn = (output: unknown): Record<string, any>[] => {
  const found: Record<string, any>[] = [];
  const seen = new Set<unknown>();
  const walk = (node: unknown): void => {
    if (!isObj(node) || seen.has(node)) return;
    seen.add(node);
    if (!Array.isArray(node) && typeof node.endpoint === 'string') found.push(node);
    for (const key of Object.keys(node)) walk(node[key]);
  };
  walk(output);
  return found;
};

/**
 * Visits every value of one declared key wherever a destination config appears in the request
 * body, and replaces it with whatever the visitor returns.
 *
 * `secretKeys` entries are normally plain keys; `webhook`/`pipedream` use a path (`headers.to`)
 * whose parent is an array, so match on the final segment and rewrite every occurrence. Both
 * callers depend on these rules agreeing: if the generator substitutes a value the validator
 * never collects, the validator reports "no survivors" about a secret it never looked for.
 */
export const visitConfigSecrets = (
  node: unknown,
  declaredKey: string,
  visit: (current: string) => string,
): void => {
  const leaf = declaredKey.split('.').pop()!.toLowerCase();
  const walk = (current: unknown, insideConfig: boolean): void => {
    if (!isObj(current)) return;
    for (const key of Object.keys(current)) {
      const value = current[key];
      const nowInsideConfig =
        insideConfig || key === 'config' || key === 'Config' || key === 'secret';
      if (insideConfig && key.toLowerCase() === leaf && typeof value === 'string') {
        // eslint-disable-next-line no-param-reassign -- rewriting the caller's copy is the point
        current[key] = visit(value);
      } else {
        walk(value, nowInsideConfig);
      }
    }
  };
  walk(node, false);
};

/** The declared-key values present in a request body - the generator's definition, reused. */
export const configSecretsFor = (node: unknown, declaredKey: string): string[] => {
  const found: string[] = [];
  visitConfigSecrets(node, declaredKey, (current) => {
    if (current.length >= MIN_SECRET_LEN) found.push(current);
    return current;
  });
  return found;
};

/**
 * The corpus bucketed by destination directory, globbed once.
 *
 * getTestDataFilePaths re-globs the whole tree on every call, so calling it per destination
 * costs one full-tree scan per destination for no benefit.
 */
export const fixturesByDestination = (): Map<string, string[]> => {
  const buckets = new Map<string, string[]>();
  for (const filePath of getTestDataFilePaths(TEST_ROOT, {})) {
    const dir = filePath.split('/destinations/')[1]?.split('/')[0];
    if (!dir) continue;
    const bucket = buckets.get(dir) ?? [];
    bucket.push(filePath);
    buckets.set(dir, bucket);
  }
  return buckets;
};
