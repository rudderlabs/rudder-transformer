import axios from 'axios';
import { Agent } from 'https';
import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';
import type { LiveSpec, RunContext } from '../../live/types';

const JSON_API = 'https://api.pushwoosh.com/json/1.3';
// Android, so the disposable device needs no real APNs/web-push credentials.
const ANDROID_DEVICE_TYPE = 3;
// keepAlive:false so setup/read-back/cleanup sockets don't linger as open handles.
const agent = new Agent({ keepAlive: false });

type PushwooshCredentials = { appCode: string; apiToken: string };
type TagsResponse = { response?: { result?: Record<string, unknown> } };

const credentials = (ctx: RunContext): PushwooshCredentials =>
  ctx.liveSecret.config as PushwooshCredentials;

const callJsonApi = async (
  ctx: RunContext,
  method: string,
  request: Record<string, unknown>,
): Promise<TagsResponse> => {
  const { appCode, apiToken } = credentials(ctx);
  const { data } = await axios.post(
    `${JSON_API}/${method}`,
    { request: { application: appCode, ...request } },
    { headers: { Authorization: `Token ${apiToken}` }, httpsAgent: agent },
  );
  return data;
};

const deviceHwid = (ctx: RunContext): string => ctx.identity('device-identify');

const fetchTags = async (ctx: RunContext, by: Record<string, string>) =>
  (await callJsonApi(ctx, 'getTags', by)).response?.result ?? {};

// setTags by userId lands only on a user that already has a device.
const registerDevice = async (ctx: RunContext): Promise<void> => {
  const hwid = deviceHwid(ctx);
  await callJsonApi(ctx, 'registerDevice', {
    hwid,
    push_token: `ci-fake-push-token-${hwid}`,
    device_type: ANDROID_DEVICE_TYPE,
    userId: ctx.identity('user'),
  });
  await pollUntil(
    async () => {
      const tags = await fetchTags(ctx, { hwid });
      return { done: 'Platform' in tags, value: tags };
    },
    {
      label: 'Pushwoosh device registered',
      attempts: 8,
      delayMs: (n) => 1000 * 2 ** Math.min(n, 3),
    },
  );
};

// unregisterDevice only drops the push token; deleteDevice removes the device and its tags.
const deleteDevice = async (ctx: RunContext): Promise<void> => {
  await callJsonApi(ctx, 'deleteDevice', {
    hwid: deviceHwid(ctx),
    auth: credentials(ctx).apiToken,
  });
};

const identifyTags = (ctx: RunContext) => ({ ci_run: ctx.runId, ci_plan: 'pro' });

const verifyUserTags = async (ctx: RunContext): Promise<void> => {
  const expected = identifyTags(ctx);
  const tags = await pollUntil(
    async () => {
      const value = await fetchTags(ctx, { userId: ctx.identity('user') });
      return {
        done: Object.entries(expected).every(([key, tag]) => value[key] === tag),
        value,
      };
    },
    {
      label: 'Pushwoosh user tags',
      attempts: 6,
      delayMs: (n) => 1000 * 2 ** Math.min(n, 3),
      soft: true,
    },
  );
  expect(tags).toMatchObject(expected);
};

// Valid format, but no such application: Pushwoosh answers 400 "application not found".
const UNKNOWN_APP_CODE = 'AAAAA-BBBBB';

const trackEvent = (ctx: RunContext, suffix: string) => ({
  type: 'track',
  messageId: `${ctx.runId}-${suffix}`,
  userId: ctx.identity('user'),
  event: 'CI Live Purchase',
  timestamp: ctx.now(),
  context: { device: { id: ctx.identity(`device-${suffix}`), type: 'Android' } },
  properties: { revenue: 9.99, currency: 'EUR', items: [{ sku: 'ci' }], runId: ctx.runId },
  integrations: { All: true },
});

export const live = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (secret) => ({ ...secret.config }),
  scenarios: [
    {
      id: 'pushwoosh-track-batch',
      description: 'Two track events are delivered in one post-events request',
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver track batch',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => [trackEvent(ctx, 'first'), trackEvent(ctx, 'second')],
        },
      ],
    },
    {
      id: 'pushwoosh-identify-set-tags',
      description: 'An identify event sets user tags through setTags and they read back',
      cleanup: deleteDevice,
      steps: [
        { stepType: 'action', name: 'register disposable device', run: registerDevice },
        {
          stepType: 'pipeline',
          name: 'deliver identify',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            type: 'identify',
            messageId: `${ctx.runId}-identify`,
            userId: ctx.identity('user'),
            timestamp: ctx.now(),
            traits: { email: ctx.email(), ...identifyTags(ctx) },
            integrations: { All: true },
          }),
        },
        { stepType: 'verify', name: 'read user tags back', check: verifyUserTags },
      ],
    },
    {
      id: 'pushwoosh-unknown-application-rejected',
      description: 'An unknown application code is rejected by post-events',
      configOverride: (base) => ({ ...base, appCode: UNKNOWN_APP_CODE }),
      steps: [
        {
          stepType: 'pipeline',
          name: 'reject unknown application',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          expectedFailure: {},
          seed: (ctx) => trackEvent(ctx, 'unknown-app'),
        },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;
