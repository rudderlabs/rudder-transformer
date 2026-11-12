import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';
import type { LiveSpec, RunContext } from '../../../live/types';
import {
  addLiveTag,
  existingNamedUserId,
  fetchGroupTags,
  fetchNamedUserStatus,
  LIVE_TAG,
  MISSING_TAG_GROUP,
  removeLiveTag,
  unknownNamedUserId,
} from './api';

// LIVE_SECRET_AIRSHIP_AUDIENCE='{"authType":"apiKey","config":{"apiKey":"<bearer token, Audience
//   Modification role>","dataCenter":"US","tagGroup":"rudderstack_audiences"},
//   "resourceIds":{"namedUserId":"<an existing named user>"}}'
// The tag group must exist and be active (Audience › Tags › Tag Groups); the named user is
// created once in the sandbox. rs_air_live_missing_group must NOT exist.

const recordSeed =
  (action: 'insert' | 'update' | 'delete', namedUserId: (ctx: RunContext) => string) =>
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
    identifiers: { named_user_id: namedUserId(ctx) },
  });

const POLL = { attempts: 8, delayMs: (attempt: number) => 2000 * Math.min(attempt + 1, 4) };

const expectTagged = (expected: boolean) => async (ctx: RunContext) => {
  const tags = await fetchGroupTags(ctx);
  if (expected) expect(tags).toContain(LIVE_TAG);
  else expect(tags).not.toContain(LIVE_TAG);
};

const seedTagged = async (ctx: RunContext) => {
  await addLiveTag(ctx);
  await pollUntil(
    async () => ({ done: (await fetchGroupTags(ctx)).includes(LIVE_TAG), value: null }),
    {
      label: 'seeded tag',
      ...POLL,
    },
  );
};

export const live = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (s) => ({ ...s.config }),
  resolveConnection: () => ({
    destination: {
      tagName: LIVE_TAG,
      syncMode: 'mirror',
      schemaVersion: '1.1',
      identifierMappings: [{ from: 'user_id', to: 'named_user_id' }],
    },
  }),
  scenarios: [
    {
      id: 'airship-audience-join',
      description: 'insert adds the tag to an existing named user',
      cleanup: removeLiveTag,
      steps: [
        { stepType: 'action', name: 'precondition untagged', run: removeLiveTag },
        {
          name: 'insert → add',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('insert', existingNamedUserId),
        },
      ],
      verify: { check: expectTagged(true), ...POLL },
    },
    {
      id: 'airship-audience-leave',
      description: 'delete removes the tag; the named user is kept',
      cleanup: removeLiveTag,
      steps: [
        { stepType: 'action', name: 'precondition tagged', run: seedTagged },
        {
          name: 'delete → remove',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('delete', existingNamedUserId),
        },
      ],
      verify: { check: expectTagged(false), ...POLL },
    },
    {
      id: 'airship-audience-unknown-named-user',
      description:
        'insert for a named user Airship does not know is delivered (200) and stores nothing (D8)',
      steps: [
        {
          name: 'insert unknown → delivered',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('insert', (ctx) => unknownNamedUserId(ctx)),
        },
      ],
      verify: {
        check: async (ctx: RunContext) => {
          expect(await fetchNamedUserStatus(ctx, unknownNamedUserId(ctx))).toBe(404);
        },
        ...POLL,
      },
    },
    {
      id: 'airship-audience-batching',
      description:
        'three inserts share one call; an insert and a delete in one router call fan out to two',
      cleanup: removeLiveTag,
      steps: [
        { stepType: 'action', name: 'precondition untagged', run: removeLiveTag },
        {
          name: 'three inserts → one add request',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx: RunContext) => [
            recordSeed('insert', existingNamedUserId)(ctx),
            recordSeed('insert', (c) => unknownNamedUserId(c, 1))(ctx),
            recordSeed('insert', (c) => unknownNamedUserId(c, 2))(ctx),
          ],
        },
        {
          name: 'insert + delete → one add and one remove request',
          stepType: 'pipeline',
          expectedOutputs: 2,
          expectedProxyRequests: 2,
          seed: (ctx: RunContext) => [
            recordSeed('insert', (c) => unknownNamedUserId(c, 3))(ctx),
            recordSeed('delete', (c) => unknownNamedUserId(c, 4))(ctx),
          ],
        },
      ],
      verify: { check: expectTagged(true), ...POLL },
    },
    {
      id: 'airship-audience-missing-group',
      description: 'a tag group the project does not have → 400 40090, every job aborted',
      configOverride: (base) => ({ ...base, tagGroup: MISSING_TAG_GROUP }),
      steps: [
        {
          name: 'insert into a missing group → abort',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx: RunContext) => [
            recordSeed('insert', existingNamedUserId)(ctx),
            recordSeed('insert', (c) => unknownNamedUserId(c, 1))(ctx),
          ],
          expectedFailure: {},
        },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;
