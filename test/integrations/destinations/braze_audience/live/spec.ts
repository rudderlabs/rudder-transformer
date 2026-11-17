import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';
import type { LiveSpec, RunContext } from '../../../live/types';
import {
  clearMembership,
  customAttributeNameFromSecret,
  externalId,
  fetchMembership,
  setMembership,
} from './api';

const recordSeed =
  (
    action: 'insert' | 'update' | 'delete',
    id: (ctx: RunContext) => string = externalId,
    entity = 'record',
  ) =>
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
    recordId: ctx.identity(entity),
    identifiers: { external_id: id(ctx) },
  });

// Braze rejects an external_id of 988 bytes or more per record, which is what makes it a reliable,
// side-effect-free way to provoke an indexed partial failure: nothing is written for that record.
const oversizedExternalId = (ctx: RunContext): string => `${externalId(ctx)}-${'x'.repeat(1000)}`;

const standardEndpoint = (base: Record<string, unknown>) => ({
  ...base,
  trackEndpoint: 'standard',
});
const accepts2xx = (status: number) => status >= 200 && status < 300;

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

export const live = {
  enabled: true,
  authType: 'apiKey',
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
      description:
        'Mirror INSERT sets custom attribute true via /users/track/bulk (no trackEndpoint)',
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
    {
      id: 'braze-audience-standard-membership-join',
      description: 'Account trackEndpoint=standard: INSERT sets the attribute via /users/track',
      configOverride: standardEndpoint,
      cleanup: clearMembership,
      steps: [
        {
          name: 'record insert → POST /users/track → membership true',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          expectedRequests: [{ endpoint: '/users/track', accepts: accepts2xx }],
          seed: recordSeed('insert'),
        },
      ],
      verify: {
        check: verifyMembership(true),
        attempts: 8,
        delayMs: (attempt) => 1000 * 2 ** Math.min(attempt, 3),
      },
    },
    {
      id: 'braze-audience-standard-partial-failure',
      description:
        'Account trackEndpoint=standard: /users/track 2xx with an indexed error fails only that record',
      configOverride: standardEndpoint,
      cleanup: clearMembership,
      steps: [
        {
          name: 'valid + oversized external_id in one /users/track request → only index 1 fails',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          expectedRequests: [{ endpoint: '/users/track', accepts: accepts2xx }],
          expectedFailure: { items: [1] },
          seed: (ctx) => [
            recordSeed('insert')(ctx),
            recordSeed('insert', oversizedExternalId, 'oversized-record')(ctx),
          ],
        },
      ],
      verify: {
        check: verifyMembership(true),
        attempts: 8,
        delayMs: (attempt) => 1000 * 2 ** Math.min(attempt, 3),
      },
    },
  ],
} satisfies LiveSpec;

export default live;
