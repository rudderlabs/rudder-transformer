import type { LiveSpec, RunContext } from '../../live/types';

const track = (ctx: RunContext, suffix: string) => ({
  type: 'track',
  event: 'Live Gzip Track',
  userId: ctx.identity('user'),
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  properties: { source: 'live-gzip' },
});

// The verbose /engage and /groups APIs report status: 1 on success. /import in strict mode
// supplies a count; do not assume the same status envelope as the profile endpoints.
const profileResponse = (endpoint: string) => ({
  endpoint,
  accepts: (status: number, body: unknown) =>
    status === 200 &&
    typeof body === 'object' &&
    body !== null &&
    'status' in body &&
    body.status === 1 &&
    !('error' in body && body.error),
});

export const live: LiveSpec = {
  enabled: true,
  authType: 'apiKey',
  envOverrides: {
    MP_GZIP_ENGAGE_ENABLED_WORKSPACE_IDS: 'ALL',
    MP_GZIP_GROUPS_ENABLED_WORKSPACE_IDS: 'ALL',
  },
  // Import authenticates with Basic base64(token + ':'); profile writes carry the same token in
  // $token. The sandbox must provision a token accepted by both routes.
  resolveConfig: (s) => ({ useNativeSDK: false, ...s.config }),
  scenarios: [
    {
      id: 'mp-gzip-import',
      description: 'a gzipped multi-track import is accepted with both records counted',
      configOverride: (base) => ({ ...base, strictMode: true }),
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver two tracks to import',
          expectedOutputs: 1,
          expectedRequests: [
            {
              endpoint: '/import/',
              accepts: (status, body) =>
                status === 200 &&
                typeof body === 'object' &&
                body !== null &&
                'num_records_imported' in body &&
                body.num_records_imported === 2 &&
                !(
                  'failed_records' in body &&
                  Array.isArray(body.failed_records) &&
                  body.failed_records.length > 0
                ),
            },
          ],
          seed: (ctx) => [track(ctx, 'first'), track(ctx, 'second')],
        },
      ],
    },
    {
      id: 'mp-gzip-engage',
      description: 'identify updates a profile through gzipped engage without merging identities',
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver identify to engage',
          expectedOutputs: 1,
          expectedRequests: [profileResponse('/engage/')],
          seed: (ctx) => ({
            type: 'identify',
            userId: ctx.identity('user'),
            timestamp: ctx.now(),
            traits: { email: ctx.email() },
          }),
        },
      ],
    },
    {
      id: 'mp-gzip-groups',
      description: 'group updates both a user profile and a group through gzip',
      configOverride: (base) => ({ ...base, groupKeySettings: [{ groupKey: 'company' }] }),
      steps: [
        {
          stepType: 'pipeline',
          name: 'deliver group to engage and groups',
          expectedOutputs: 1,
          expectedRequests: [profileResponse('/engage/'), profileResponse('/groups/')],
          seed: (ctx) => ({
            type: 'group',
            userId: ctx.identity('user'),
            timestamp: ctx.now(),
            traits: { company: ctx.identity('company') },
          }),
        },
      ],
    },
  ],
};

export default live;
