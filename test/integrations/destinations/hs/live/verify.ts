import { RunContext } from '../../../live/types';
import {
  ASSOC_FROM_TYPE,
  ASSOC_TO_TYPE,
  fetchContactByEmail,
  getAssociatedIds,
  registeredId,
} from './api';

// Verify the contact carries every expected property.
export const verifyContactProperties =
  (expected: (ctx: RunContext) => Record<string, string>) =>
  async (ctx: RunContext): Promise<void> => {
    const want = expected(ctx);
    const keys = Object.keys(want);
    const props = await fetchContactByEmail(ctx, keys);
    expect(props).not.toBeNull();
    expect(props).toMatchObject(want);
  };

// Verify the pipeline step's association actually links the two set-up records.
export const verifyAssociationExists = async (ctx: RunContext): Promise<void> => {
  const fromId = registeredId(ctx, ASSOC_FROM_TYPE);
  const toId = registeredId(ctx, ASSOC_TO_TYPE);
  const associatedIds = await getAssociatedIds(ctx, ASSOC_FROM_TYPE, fromId, ASSOC_TO_TYPE);
  expect(associatedIds).toContain(toId);
};
