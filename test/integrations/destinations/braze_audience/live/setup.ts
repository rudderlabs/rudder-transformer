import { RunContext } from '../../../live/types';
import { fetchMembership, setMembership } from './api';
import { pollUntil } from '../../../live/poll';

/** Seed membership=true and wait until export/ids can see it (leave scenario precondition). */
export const seedMembershipTrue = async (ctx: RunContext): Promise<void> => {
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
