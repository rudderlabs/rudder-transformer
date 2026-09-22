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
          seed: (ctx) => ({
            type: 'track',
            messageId: `${ctx.runId}-conversion`,
            timestamp: ctx.now(),
            integrations: { All: true },
            properties: {
              transactionId: transactionId(ctx),
            },
          }),
        },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;
