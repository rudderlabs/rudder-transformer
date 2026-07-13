import { LiveStep, RunContext } from '../../../live/types';
import { pollUntil } from '../../../live/poll';
import {
  ASSOC_FROM_TYPE,
  ASSOC_TO_TYPE,
  fetchContactByEmail,
  getAssociatedIds,
  registeredId,
} from './api';

// Verify the contact carries every expected property, polling for eventual consistency.
export const verifyContactProperties = (
  expected: (ctx: RunContext) => Record<string, string>,
): LiveStep => ({
  stepType: 'verify',
  name: 'verify contact properties',
  check: async (ctx) => {
    const want = expected(ctx);
    const keys = Object.keys(want);
    const props = await pollUntil(
      async () => {
        const last = await fetchContactByEmail(ctx, keys);
        const done = Boolean(last && keys.every((k) => last[k] === want[k]));
        return { done, value: last };
      },
      {
        label: 'contact properties match',
        attempts: 4,
        delayMs: (attempt) => 1000 * 2 ** attempt,
        soft: true,
      },
    );
    expect(props).not.toBeNull();
    expect(props).toMatchObject(want);
  },
});

// Verify the pipeline step's association actually links the two set-up records, polling for
// eventual consistency.
export const verifyAssociationExists: LiveStep = {
  stepType: 'verify',
  name: 'verify association exists',
  check: async (ctx) => {
    const fromId = registeredId(ctx, ASSOC_FROM_TYPE);
    const toId = registeredId(ctx, ASSOC_TO_TYPE);
    const associatedIds = await pollUntil(
      async () => {
        const ids = await getAssociatedIds(ctx, ASSOC_FROM_TYPE, fromId, ASSOC_TO_TYPE);
        return { done: ids.includes(toId), value: ids };
      },
      {
        label: `association ${ASSOC_FROM_TYPE}/${fromId} -> ${ASSOC_TO_TYPE}/${toId}`,
        attempts: 4,
        delayMs: (attempt) => 1000 * 2 ** attempt,
        soft: true,
      },
    );
    expect(associatedIds).toContain(toId);
  },
};
