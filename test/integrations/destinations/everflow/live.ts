import type { LiveSpec, RunContext } from '../../live/types';

const transactionId = (ctx: RunContext): string => {
  const id = ctx.liveSecret.resourceIds?.transactionId;
  if (!id) {
    throw new Error(
      'transactionId missing - set resourceIds.transactionId in LIVE_SECRET_EVERFLOW',
    );
  }
  return id;
};

const trackEvent = (ctx: RunContext, id: string, suffix: string) => ({
  type: 'track',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  integrations: { All: true },
  properties: { transactionId: id },
});

export const live = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (secret) => ({ ...secret.config }),
  scenarios: [
    {
      id: 'everflow-track-conversion',
      description: 'A track event delivers one Everflow Advertiser S2S conversion',
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver conversion',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => trackEvent(ctx, transactionId(ctx), 'conversion'),
        },
      ],
    },
    {
      id: 'everflow-random-transaction-rejected',
      description: 'A random transaction ID exercises Everflow HTTP 204 rejection handling',
      steps: [
        {
          stepType: 'pipeline',
          name: 'reject random transaction ID',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          expectedFailure: { items: [0] },
          seed: (ctx) => trackEvent(ctx, ctx.identity('random-transaction'), 'random-transaction'),
        },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;
