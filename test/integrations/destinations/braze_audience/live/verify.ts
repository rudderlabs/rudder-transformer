import { RunContext } from '../../../live/types';
import { fetchMembership } from './api';

/** Assert export/ids shows the expected boolean membership custom attribute. */
export const verifyMembership =
  (expected: boolean) =>
  async (ctx: RunContext): Promise<void> => {
    const value = await fetchMembership(ctx);
    expect(value).toBe(expected);
  };
