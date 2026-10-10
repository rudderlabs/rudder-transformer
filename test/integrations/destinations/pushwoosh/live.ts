import type { LiveSpec, RunContext } from '../../live/types';

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
      description: 'An identify event sets user tags through setTags',
      steps: [
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
            traits: { email: ctx.email(), ci_run: ctx.runId, ci_plan: 'pro' },
            integrations: { All: true },
          }),
        },
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
