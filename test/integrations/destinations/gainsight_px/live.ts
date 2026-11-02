import axios from 'axios';
import { Agent } from 'https';
import { getBaseEndpoint } from '../../../../src/v0/destinations/gainsight_px/config';
import type { LiveSecret, LiveSpec, RunContext } from '../../live/types';

// LIVE_SECRET_GAINSIGHT_PX='{"config":{"apiKey":"…","dataCenter":"US","productTagKey":"…"},
//   "resourceIds":{"identifyId":"<sandbox user id>"}}'
// identifyId is a user created once in the sandbox (shared with gainsight_px_audience, which only
// writes custom attributes — this spec writes the standard `title` field, so the two never collide).
// productTagKey is the sandbox product key; PX rejects any other value in propertyKeys.

const agent = new Agent({ keepAlive: false });

const readString = (value: unknown, label: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Gainsight PX live secret missing ${label}`);
  }
  return value;
};

const existingIdentifyId = (ctx: RunContext): string =>
  readString(ctx.liveSecret.resourceIds?.identifyId, 'resourceIds.identifyId');

const baseUrl = (secret: LiveSecret): string =>
  getBaseEndpoint({ dataCenter: readString(secret.config.dataCenter, 'config.dataCenter') });

const fetchUserTitle = async (ctx: RunContext): Promise<unknown> => {
  const res = await axios.get(
    `${baseUrl(ctx.liveSecret)}/users/${encodeURIComponent(existingIdentifyId(ctx))}`,
    {
      headers: { 'X-APTRINSIC-API-KEY': readString(ctx.liveSecret.config.apiKey, 'config.apiKey') },
      httpsAgent: agent,
      timeout: 15000,
      validateStatus: () => true,
    },
  );
  if (res.status !== 200) throw new Error(`Gainsight PX GET user failed: status=${res.status}`);
  return res.data?.title;
};

const runTitle = (ctx: RunContext): string => `live-${ctx.runId}`;

const identifySeed = (ctx: RunContext): Record<string, unknown> => ({
  type: 'identify',
  userId: existingIdentifyId(ctx),
  timestamp: ctx.now(),
  traits: { title: runTitle(ctx) },
});

// Makes every transform-time call to the PX API time out with no response, the way a degraded PX
// does. REQUEST_TIMEOUT_IN_MS is read once at module load, so an env override cannot do this.
// Relies on the live runner hosting the app in-process (component.live.test.ts) — move it into the
// harness if live runs ever go out-of-process or a second spec needs fault injection.
const forcePxRequestTimeout = async (ctx: RunContext): Promise<void> => {
  const pxBaseUrl = baseUrl(ctx.liveSecret);
  const id = axios.interceptors.request.use((config) =>
    config.url?.startsWith(pxBaseUrl) ? { ...config, timeout: 1 } : config,
  );
  ctx.addCleanup(() => axios.interceptors.request.eject(id));
};

export const live = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (s) => ({ ...s.config }),
  scenarios: [
    {
      id: 'gainsight-px-identify-existing-user',
      description: 'identify for an existing user looks it up, then updates its title',
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify → PUT /users/{id}',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: identifySeed,
        },
      ],
      verify: {
        check: async (ctx: RunContext) => {
          expect(await fetchUserTitle(ctx)).toBe(runTitle(ctx));
        },
        // GET /users/{id} lags writes by ~6–25 s.
        attempts: 6,
        delayMs: () => 5000,
      },
    },
    {
      id: 'gainsight-px-identify-lookup-timeout',
      description: 'a user lookup that times out fails the transform as retryable (500), not 400',
      steps: [
        { stepType: 'action', name: 'force PX request timeout', run: forcePxRequestTimeout },
        {
          stepType: 'pipeline',
          name: 'identify → lookup times out',
          seed: identifySeed,
          expectedFailure: { transform: { statusCode: 500, errorType: 'retryable' } },
        },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;
