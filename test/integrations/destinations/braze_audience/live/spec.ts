import { LiveSpec, RunContext } from '../../../live/types';
import { pollUntil } from '../../../live/poll';
import {
  clearMembership,
  customAttributeNameFromSecret,
  externalId,
  fetchMembership,
  setMembership,
} from './api';

const recordSeed =
  (action: 'insert' | 'update' | 'delete') =>
  (ctx: RunContext): Record<string, unknown> => ({
    type: 'record',
    action,
    fields: {},
    channel: 'sources',
    context: {
      sources: {
        job_id: `live-${ctx.runId}`,
        version: 'live',
        job_run_id: ctx.runId,
        task_run_id: ctx.runId,
      },
    },
    recordId: ctx.identity('record'),
    identifiers: { external_id: externalId(ctx) },
  });

/** Seed membership=true and wait until export/ids can see it (leave scenario precondition). */
const seedMembershipTrue = async (ctx: RunContext): Promise<void> => {
  await setMembership(ctx, true);
  await pollUntil(
    async () => {
      const value = await fetchMembership(ctx);
      return { done: value === true, value };
    },
    {
      label: 'Braze membership seeded true',
      attempts: 8,
      delayMs: (attempt) => 1000 * 2 ** Math.min(attempt, 3),
    },
  );
};

/** Assert export/ids shows the expected boolean membership custom attribute. */
const verifyMembership =
  (expected: boolean) =>
  async (ctx: RunContext): Promise<void> => {
    const value = await fetchMembership(ctx);
    expect(value).toBe(expected);
  };

export const live: LiveSpec = {
  enabled: true,
  authType: 'apiKey',
  // braze_audience is GA for the batching-framework transform, so only delivery needs naming.
  // Without this the live run would deliver through v1/destinations/braze_audience/networkHandler
  // and prove nothing about the path this destination is moving to.
  envOverrides: {
    BRAZE_AUDIENCE_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS: 'ALL',
  },
  resolveConfig: (s) => ({
    // Account: REST key + data center (US-01…08 / EU-01…03 / AU-01).
    ...s.config,
  }),
  resolveConnection: (s) => ({
    destination: {
      customAttributeName: customAttributeNameFromSecret(s),
      syncMode: 'mirror',
      identifierMappings: [{ from: 'user_id', to: 'external_id' }],
    },
  }),
  scenarios: [
    {
      id: 'braze-audience-membership-join',
      description: 'Mirror INSERT sets custom attribute true via /users/track/bulk',
      cleanup: clearMembership,
      steps: [
        {
          name: 'record insert → membership true',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('insert'),
        },
      ],
      verify: {
        // Braze export/ids is eventually consistent (~2–4s observed).
        check: verifyMembership(true),
        attempts: 8,
        delayMs: (attempt) => 1000 * 2 ** Math.min(attempt, 3),
      },
    },
    {
      id: 'braze-audience-membership-leave',
      description: 'Mirror DELETE sets custom attribute false via /users/track/bulk',
      cleanup: clearMembership,
      steps: [
        { stepType: 'action', name: 'setup membership true', run: seedMembershipTrue },
        {
          name: 'record delete → membership false',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('delete'),
        },
      ],
      verify: {
        check: verifyMembership(false),
        attempts: 8,
        delayMs: (attempt) => 1000 * 2 ** Math.min(attempt, 3),
      },
    },
    {
      id: 'braze-audience-membership-update',
      description: 'Mirror UPDATE also sets custom attribute true (same as INSERT)',
      cleanup: clearMembership,
      steps: [
        {
          name: 'record update → membership true',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('update'),
        },
      ],
      verify: {
        check: verifyMembership(true),
        attempts: 8,
        delayMs: (attempt) => 1000 * 2 ** Math.min(attempt, 3),
      },
    },
  ],
};

export default live;
