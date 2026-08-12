import type { RunContext } from '../../../live/types';
import { pollUntil } from '../../../live/poll';
import { getPersonAttributes, upsertPerson } from './api';
import { mergePrimaryAttributes, mergeSecondaryAttributes } from './profiles';

// A Track API write is queued, so a just-created person isn't immediately readable. Merge rejects an
// unknown secondary profile, so the precondition is made deterministic here rather than left to the
// pipeline step's retries.
const waitUntilReadable = (ctx: RunContext, identifier: string): Promise<unknown> =>
  pollUntil(
    async () => {
      const attributes = await getPersonAttributes(ctx, identifier);
      return { done: Boolean(attributes), value: attributes };
    },
    { label: `person ${identifier} readable`, attempts: 5, delayMs: (n) => 1000 * 2 ** n },
  );

const createPerson = async (
  ctx: RunContext,
  identifier: string,
  attributes: Record<string, string>,
): Promise<void> => {
  await upsertPerson(ctx, identifier, attributes);
  ctx.register({ type: 'person', id: identifier });
};

// The device scenario's pipeline steps only register and remove a device token, so the owning
// profile is created here — the steps then exercise nothing but the device paths.
export const createDeviceOwner = async (ctx: RunContext): Promise<void> => {
  const identifier = ctx.identity('user');
  await createPerson(ctx, identifier, { email: ctx.email() });
  await waitUntilReadable(ctx, identifier);
};

// Both profiles an alias call collapses: the primary survives the merge, the secondary is absorbed.
// Created through the Track API directly so the prerequisite state never depends on the transform
// path under test.
export const createMergeProfiles = async (ctx: RunContext): Promise<void> => {
  const primary = ctx.identity('merge-primary');
  const secondary = ctx.identity('merge-secondary');

  await createPerson(ctx, primary, mergePrimaryAttributes(ctx));
  await createPerson(ctx, secondary, mergeSecondaryAttributes(ctx));

  await waitUntilReadable(ctx, primary);
  await waitUntilReadable(ctx, secondary);
};
