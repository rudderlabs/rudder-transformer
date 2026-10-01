import type { LiveSpec, RunContext } from '../../live/types';

const eventBase = (ctx: RunContext, suffix: string) => ({
  channel: 'web',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  integrations: { All: true },
});

const goodTrack = (ctx: RunContext, suffix: string) => ({
  ...eventBase(ctx, suffix),
  type: 'track',
  event: 'purchase',
  userId: ctx.identity(suffix),
  context: { traits: { email: ctx.email(suffix) } },
  properties: { amount: '25.00', currency: 'USD' },
});

// Passes transformation, but Rokt rejects currency values that are not strings.
const badTrack = (ctx: RunContext, suffix: string) => ({
  ...goodTrack(ctx, suffix),
  properties: { amount: '25.00', currency: { code: 'USD' } },
});

export const live: LiveSpec = {
  enabled: true,
  authType: 'basic',
  resolveConfig: (secret) => ({ ...secret.config }),
  scenarios: [
    {
      id: 'rokt-supported-message-types',
      description: 'the Rokt Custom Feed accepts track, page, screen, and identify batches',
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver supported event types',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => [
            goodTrack(ctx, 'track'),
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
    {
      id: 'rokt-rejected-event',
      description: 'Rokt rejects a single invalid batch with 400 and the job is aborted',
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver one invalid event',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          expectedFailure: {},
          seed: (ctx) => [badTrack(ctx, 'bad')],
        },
      ],
    },
    {
      id: 'rokt-mixed-batch',
      description:
        'a batch mixing valid and invalid events is retried individually, and only the invalid event fails',
      steps: [
        {
          // Rokt returns one error for the two batches, so delivery must retry rather than mark
          // both jobs delivered.
          stepType: 'pipeline',
          name: 'batched: partial rejection retries the whole batch',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          expectedFailure: {},
          seed: (ctx) => [goodTrack(ctx, 'mixed-good'), badTrack(ctx, 'mixed-bad')],
        },
        {
          // Model rudder-server's dontBatch redelivery explicitly; the live harness does not replay it.
          stepType: 'pipeline',
          name: 'dontBatch retry: only the invalid event is aborted',
          metadataOverride: { dontBatch: true },
          expectedProxyRequests: 2,
          expectedFailure: { items: [1] },
          seed: (ctx) => [goodTrack(ctx, 'retry-good'), badTrack(ctx, 'retry-bad')],
        },
      ],
    },
  ],
};

export default live;
