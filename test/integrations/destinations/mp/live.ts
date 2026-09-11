import axios from 'axios';
import { Agent } from 'https';
import type { LiveSpec, LiveStep, RunContext } from '../../live/types';

// Mixpanel's create deletion task API allows one request per second per project, so every call in
// this spec, through the transformer or direct, waits past that window first.
const RATE_LIMIT_DELAY_MS = 1100;

// Keyed by the destination's dataResidency, as in src/v0/destinations/mp/config.js.
const CREATE_DELETION_TASK_ENDPOINTS: Record<string, string> = {
  us: 'https://mixpanel.com/api/app/data-deletions/v3.0/',
  eu: 'https://eu.mixpanel.com/api/app/data-deletions/v3.0/',
  in: 'https://in.mixpanel.com/api/app/data-deletions/v3.0/',
};

// keepAlive:false so read-back sockets don't linger as open handles.
const mixpanelAgent = new Agent({ keepAlive: false });

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const deleteUsers = (name: string, userIds: (ctx: RunContext) => string[]): LiveStep => ({
  stepType: 'deleteUsers',
  name,
  userAttributes: (ctx) => userIds(ctx).map((userId) => ({ userId })),
  delayBeforeMs: RATE_LIMIT_DELAY_MS,
});

// The transformer does not return Mixpanel's task id, so the read-back asks again: a request for a
// user who already has a deletion task running is rejected with a 409 that names them. A 2xx would
// mean no task was running, and that request schedules one, which is harmless for a synthetic id.
const verifyDeletionTaskRunning = (entity: string): LiveStep => ({
  stepType: 'verify',
  name: `verify a deletion task is running for ${entity}`,
  check: async (ctx) => {
    await sleep(RATE_LIMIT_DELAY_MS);
    const {
      token,
      gdprApiToken,
      dataResidency = 'us',
    } = ctx.liveSecret.config as Record<string, string>;
    const response = await axios.post(
      `${CREATE_DELETION_TASK_ENDPOINTS[dataResidency]}?token=${token}`,
      {
        distinct_ids: [ctx.identity(entity)],
        compliance_type: dataResidency === 'eu' ? 'GDPR' : 'CCPA',
      },
      {
        headers: { Authorization: `Bearer ${gdprApiToken}` },
        httpsAgent: mixpanelAgent,
        timeout: 15000,
        validateStatus: () => true,
      },
    );
    expect({
      status: response.status,
      conflictingIds: response.data?.error?.conflicting_distinct_ids,
    }).toEqual({ status: 409, conflictingIds: [ctx.identity(entity)] });
  },
});

const newUser = (ctx: RunContext): string[] => [ctx.identity('user')];
const conflictingUser = (ctx: RunContext): string[] => [ctx.identity('conflicting')];
const conflictingAndNewUser = (ctx: RunContext): string[] => [
  ctx.identity('conflicting'),
  ctx.identity('user'),
];

export const live = {
  enabled: true,
  authType: 'apiKey',
  // LIVE_SECRET_MP config: { token, gdprApiToken, dataResidency }.
  resolveConfig: (s) => ({ userDeletionApi: 'task', ...s.config }),
  scenarios: [
    {
      id: 'mp-delete-users-task',
      description: 'A deletion task is created for a new user',
      steps: [deleteUsers('delete a new user', newUser)],
    },
    {
      id: 'mp-delete-users-task-already-running',
      description: 'Deleting a user whose deletion task is still running succeeds',
      steps: [
        deleteUsers('delete a new user', newUser),
        deleteUsers('delete the same user again', newUser),
      ],
    },
    {
      id: 'mp-delete-users-task-partial-conflict',
      description: 'A batch where one user conflicts still schedules the other user',
      steps: [
        deleteUsers('delete the conflicting user', conflictingUser),
        deleteUsers('delete the conflicting user and a new user', conflictingAndNewUser),
        verifyDeletionTaskRunning('user'),
      ],
    },
    {
      id: 'mp-delete-users-profile',
      description: 'The engage profile delete path deletes a user profile',
      configOverride: ({ userDeletionApi, ...base }) => base,
      steps: [deleteUsers('delete a user profile', newUser)],
    },
  ],
} satisfies LiveSpec;

export default live;
