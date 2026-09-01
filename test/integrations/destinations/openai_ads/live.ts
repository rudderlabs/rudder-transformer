import type { LiveSpec, RunContext } from '../../live/types';

const eventBase = (ctx: RunContext, suffix: string) => ({
  channel: 'web',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  originalTimestamp: ctx.now(),
  sentAt: ctx.now(),
  integrations: { All: true },
});

export const live: LiveSpec = {
  enabled: true,
  authType: 'apiKey',
  envOverrides: {
    OPENAI_ADS_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS: 'ALL',
  },
  resolveConfig: (s) => ({
    eventMapping: [
      { from: 'Live Order Created', to: 'order_created' },
      { from: 'Live Lead Created', to: 'lead_created' },
      { from: 'Live Custom Checkout', to: 'custom', customEventName: 'live_custom_checkout' },
    ],
    defaultCurrency: 'USD',
    defaultActionSource: 'offline',
    ...s.config,
  }),
  scenarios: [
    {
      id: 'openai-ads-standard-events-batch',
      description: 'mapped standard conversion events batch into one OpenAI Ads /v1/events request',
      steps: [
        {
          stepType: 'pipeline',
          name: 'order + lead batch',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => [
            {
              ...eventBase(ctx, 'order-created'),
              type: 'track',
              event: 'Live Order Created',
              userId: ctx.identity('buyer'),
              context: {
                traits: {
                  email: ctx.email('buyer'),
                  firstName: 'OpenAI',
                  lastName: 'Ads',
                  externalId: ctx.identity('buyer'),
                },
              },
              properties: {
                amount: '25.99',
                currency: 'USD',
                contents: [
                  {
                    id: `sku-${ctx.runId}`,
                    name: 'Live starter bundle',
                    content_type: 'product',
                    quantity: 1,
                  },
                ],
              },
            },
            {
              ...eventBase(ctx, 'lead-created'),
              type: 'track',
              event: 'Live Lead Created',
              userId: ctx.identity('lead'),
              context: { traits: { email: ctx.email('lead') } },
              properties: {},
            },
          ],
        },
      ],
    },
    {
      id: 'openai-ads-custom-event',
      description: 'mapped custom conversion event delivers with a custom_event_name',
      steps: [
        {
          stepType: 'pipeline',
          name: 'custom checkout',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...eventBase(ctx, 'custom-checkout'),
            type: 'track',
            event: 'Live Custom Checkout',
            userId: ctx.identity('custom'),
            context: { traits: { email: ctx.email('custom') } },
            properties: {
              amount: '10.00',
              currency: 'USD',
              plan: `ci-${ctx.runId}`,
            },
          }),
        },
      ],
    },
  ],
};

export default live;
