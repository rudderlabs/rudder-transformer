import type { LiveSpec, RunContext } from '../../live/types';

const track = (ctx: RunContext, event: string) => ({
  type: 'track',
  userId: ctx.identity('user'),
  event,
  timestamp: ctx.now(),
  messageId: `${ctx.runId}-${event}`,
});

const ingested = (endpoint: string, count: number) => ({
  endpoint,
  accepts: (status: number, body: unknown) =>
    status === 200 &&
    typeof body === 'object' &&
    body !== null &&
    'events_ingested' in body &&
    body.events_ingested === count,
});

const httpApi = ingested('/2/httpapi', 1);
const batch = ingested('/batch', 2);

const groupTraits = (ctx: RunContext) => ({
  group_type: 'company',
  group_value: ctx.identity('company'),
  live_gzip_ref: ctx.runId,
});

// Amplitude's FORM endpoints answer with plain "success", not an events_ingested count.
// HTTP 200 here does not prove persistence if the project lacks the Accounts/Portfolio add-ons.
const form = (endpoint: string) => ({
  endpoint,
  contentType: 'application/x-www-form-urlencoded',
  accepts: (status: number, body: unknown) => status === 200 && body === 'success',
});

export const live: LiveSpec = {
  enabled: true,
  authType: 'apiKey',
  envOverrides: {
    AM_GZIP_HTTPAPI_ENABLED_WORKSPACE_IDS: 'ALL',
    AM_GZIP_BATCH_ENABLED_WORKSPACE_IDS: 'ALL',
    AM_GZIP_GROUPIDENTIFY_ENABLED_WORKSPACE_IDS: 'ALL',
    AM_GZIP_USERMAP_ENABLED_WORKSPACE_IDS: 'ALL',
  },
  resolveConfig: (s) => ({ ...s.config }),
  scenarios: [
    {
      id: 'am-gzip-batch',
      description: 'two tracks for one user are accepted by the batch API as gzip',
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver same-user batch',
          expectedOutputs: 1,
          expectedRequests: [batch],
          seed: (ctx) => [track(ctx, 'Live Batch A'), track(ctx, 'Live Batch B')],
        },
      ],
    },
    {
      id: 'am-gzip-httpapi',
      description: 'one track is accepted by HTTP V2 as gzip',
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver single track',
          expectedOutputs: 1,
          expectedRequests: [httpApi],
          seed: (ctx) => track(ctx, 'Live Single Track'),
        },
      ],
    },
    {
      id: 'am-gzip-group',
      description: 'group routes to gzipped HTTP V2 and groupidentify FORM',
      configOverride: (base) => ({
        ...base,
        groupTypeTrait: 'group_type',
        groupValueTrait: 'group_value',
      }),
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver group',
          expectedOutputs: 1,
          expectedRequests: [
            httpApi,
            {
              ...form('/groupidentify'),
              // Test the group's actual update payload, not just the endpoint's "success" reply.
              payload: (ctx, body) => {
                const identification = new URLSearchParams(body).get('identification');
                const [group] = JSON.parse(identification ?? '[]');
                const traits = groupTraits(ctx);
                return (
                  group?.group_type === traits.group_type &&
                  group?.group_value === traits.group_value &&
                  Object.entries(traits).every(
                    ([key, value]) => group?.group_properties?.[key] === value,
                  )
                );
              },
            },
          ],
          seed: (ctx) => {
            const traits = groupTraits(ctx);
            return {
              type: 'group',
              userId: ctx.identity('user'),
              timestamp: ctx.now(),
              traits,
              integrations: {
                Amplitude: {
                  groups: { group_type: traits.group_type, group_value: traits.group_value },
                },
              },
            };
          },
        },
      ],
    },
    {
      id: 'am-gzip-alias',
      description: 'alias reaches the gzipped usermap FORM endpoint',
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver alias',
          expectedOutputs: 1,
          expectedRequests: [form('/usermap')],
          seed: (ctx) => ({
            type: 'alias',
            userId: ctx.identity('user'),
            previousId: ctx.identity('previous-user'),
            timestamp: ctx.now(),
          }),
        },
      ],
    },
  ],
};

export default live;
