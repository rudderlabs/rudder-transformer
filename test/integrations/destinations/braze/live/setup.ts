import type { RunContext } from '../../../live/types';
import { pollUntil } from '../../../live/poll';
import { createUserWithAttributes, exportUserByExternalId } from './api';
import { dedupExistingInitialAttrs } from './profiles';

// Alias-merge collapses two existing external_id profiles into one. Seed both up front — the "keep"
// profile (userId) and the "merge" profile (previousId) — so the merge request has real targets. The
// scenario is delivery-only (Braze merges asynchronously), so no marker attribute / read-back is used.
export const createMergeUsers = async (ctx: RunContext): Promise<void> => {
  const keepId = ctx.identity('user');
  const mergeId = ctx.identity('merge-user');
  await createUserWithAttributes(ctx, keepId, { first_name: 'CI-Merge-Keep' });
  await createUserWithAttributes(ctx, mergeId, { first_name: 'CI-Merge-Source' });
};

// Subscription-status set attaches to an existing external_id profile; create it first so the group
// status write lands on a settled user.
export const createSubscriptionUser = async (ctx: RunContext): Promise<void> => {
  await createUserWithAttributes(ctx, ctx.identity('user'), {
    first_name: 'CI-Subscription',
    email: ctx.email(),
  });
};

// supportDedup existing-user scenario: create the user AND wait until it's returned by the export
// endpoint, so the transform's BrazeDedupUtility.doLookup (same /users/export/ids) reliably finds it
// in the store and takes the real dedup-reduce branch (rather than treating it as a fresh user).
export const createDedupUserAndWait = async (ctx: RunContext): Promise<void> => {
  const externalId = ctx.identity('user');
  await createUserWithAttributes(ctx, externalId, dedupExistingInitialAttrs(ctx));
  await pollUntil(
    async () => {
      const p = await exportUserByExternalId(ctx, externalId);
      return { done: Boolean(p?.email), value: p };
    },
    { label: 'dedup user searchable', attempts: 6, delayMs: (n) => 1000 * 2 ** n },
  );
};
