import type { RunContext } from '../../../live/types';
import {
  ASSOC_FROM_TYPE,
  ASSOC_TO_TYPE,
  fetchContactByEmail,
  fetchContactPropsById,
  fetchCrmObjectPropsById,
  findContactIdByEmail,
  getAssociatedIds,
  registeredId,
  registeredIds,
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

// Verify the registered object (by record id, the `index`-th registered of `objectType`) carries
// every expected property.
export const verifyRegisteredObjectProperties =
  (objectType: string, expected: (ctx: RunContext) => Record<string, string>, index = 0) =>
  async (ctx: RunContext): Promise<void> => {
    const id = registeredIds(ctx, objectType)[index];
    expect(id).toBeDefined();
    const want = expected(ctx);
    const props = await fetchCrmObjectPropsById(ctx, objectType, id, Object.keys(want));
    expect(props).not.toBeNull();
    expect(props).toMatchObject(want);
  };

// Record-id batch: both contacts updated by the one batch, the first with both merged events.
export const verifyRecordIdBatch =
  (
    first: (ctx: RunContext) => Record<string, string>,
    second: (ctx: RunContext) => Record<string, string>,
  ) =>
  async (ctx: RunContext): Promise<void> => {
    await verifyRegisteredObjectProperties('contacts', first, 0)(ctx);
    await verifyRegisteredObjectProperties('contacts', second, 1)(ctx);
  };

// Verify the pipeline step's association actually links the two set-up records.
export const verifyAssociationExists = async (ctx: RunContext): Promise<void> => {
  const fromId = registeredId(ctx, ASSOC_FROM_TYPE);
  const toId = registeredId(ctx, ASSOC_TO_TYPE);
  const associatedIds = await getAssociatedIds(ctx, ASSOC_FROM_TYPE, fromId, ASSOC_TO_TYPE);
  expect(associatedIds).toContain(toId);
};

// Additional-email upsert: the single set-up contact (by its registered id) must carry BOTH upserts'
// disjoint traits, and its primary email must still resolve to that same id - together proving the
// additional-email upsert updated the same contact rather than forking a new one.
export const verifyUpsertResolvesToSameContact =
  (expected: (ctx: RunContext) => Record<string, string>) =>
  async (ctx: RunContext): Promise<void> => {
    const registered = registeredId(ctx, 'contacts');
    const byPrimary = await findContactIdByEmail(ctx, ctx.email());
    expect(byPrimary).toBe(registered);
    const want = expected(ctx);
    const props = await fetchContactPropsById(ctx, registered, Object.keys(want));
    expect(props).not.toBeNull();
    expect(props).toMatchObject(want);
  };
