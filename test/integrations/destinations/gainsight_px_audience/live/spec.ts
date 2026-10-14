import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';
import type { LiveSpec, RunContext } from '../../../live/types';
import {
  customAttributeNameFromSecret,
  existingIdentifyId,
  fetchMembership,
  setMembership,
  unknownIdentifyId,
} from './api';

// LIVE_SECRET_GAINSIGHT_PX_AUDIENCE='{"config":{"apiKey":"…","dataCenter":"US"},
//   "resourceIds":{"identifyId":"rs-gpx-live-1","customAttributeName":"rs_gpx_e2e"}}'
// rs-gpx-live-1 is created once in the sandbox; rs_gpx_e2e is a Boolean custom attribute.

const recordSeed =
  (action: 'insert' | 'update' | 'delete', identifyId: (ctx: RunContext) => string) =>
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
    identifiers: { identifyId: identifyId(ctx) },
  });

const expectMembership = (expected: boolean) => async (ctx: RunContext) => {
  expect(await fetchMembership(ctx)).toBe(expected);
};

const POLL = { attempts: 8, delayMs: (attempt: number) => 2000 * Math.min(attempt + 1, 4) };

export const live = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (s) => ({ ...s.config }),
  resolveConnection: (s) => ({
    destination: {
      customAttributeName: customAttributeNameFromSecret(s),
      syncMode: 'mirror',
      schemaVersion: '1.1',
      identifierMappings: [{ from: 'user_id', to: 'identifyId' }],
    },
  }),
  scenarios: [
    {
      id: 'gainsight-px-audience-join',
      description: 'insert sets the attribute true on an existing user',
      cleanup: (ctx: RunContext) => setMembership(ctx, false),
      steps: [
        {
          stepType: 'action',
          name: 'precondition false',
          run: (ctx: RunContext) => setMembership(ctx, false),
        },
        {
          name: 'insert → true',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('insert', existingIdentifyId),
        },
      ],
      verify: { check: expectMembership(true), ...POLL },
    },
    {
      id: 'gainsight-px-audience-leave',
      description: 'delete sets the attribute false; the user is kept',
      cleanup: (ctx: RunContext) => setMembership(ctx, false),
      steps: [
        {
          stepType: 'action',
          name: 'precondition true',
          run: async (ctx: RunContext) => {
            await setMembership(ctx, true);
            await pollUntil(
              async () => ({ done: (await fetchMembership(ctx)) === true, value: null }),
              {
                label: 'seeded true',
                ...POLL,
              },
            );
          },
        },
        {
          name: 'delete → false',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('delete', existingIdentifyId),
        },
      ],
      verify: { check: expectMembership(false), ...POLL },
    },
    {
      id: 'gainsight-px-audience-unknown-user',
      description:
        'insert for a user PX does not know is NOT delivered (404 → abort); no user is created',
      steps: [
        {
          name: 'insert unknown → abort',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('insert', unknownIdentifyId),
          expectedFailure: { items: [0] },
        },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;
