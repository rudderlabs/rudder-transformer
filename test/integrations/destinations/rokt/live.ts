import type { LiveSpec, RunContext } from '../../live/types';

const eventBase = (ctx: RunContext, suffix: string) => ({
  channel: 'web',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  integrations: { All: true },
});

export const live: LiveSpec = {
  enabled: true,
  authType: 'basic',
  resolveConfig: (secret) => ({ ...secret.config }),
  scenarios: [
    {
      id: 'rokt-supported-message-types',
      description: 'the mParticle Custom Feed accepts track, page, screen, and identify batches',
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver supported event types',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => [
            {
              ...eventBase(ctx, 'track'),
              type: 'track',
              event: 'purchase',
              userId: ctx.identity('track'),
              context: { traits: { email: ctx.email('track') } },
              properties: { amount: '25.00', currency: 'USD' },
            },
            {
              ...eventBase(ctx, 'page'),
              type: 'page',
              userId: ctx.identity('page'),
              context: { page: { path: '/live-page' } },
              properties: {},
            },
            {
              ...eventBase(ctx, 'screen'),
              type: 'screen',
              name: 'Live Screen',
              userId: ctx.identity('screen'),
              properties: {},
            },
            {
              ...eventBase(ctx, 'identify'),
              type: 'identify',
              userId: ctx.identity('identify'),
              traits: { firstName: 'Live' },
            },
          ],
        },
      ],
    },
  ],
};

export default live;
