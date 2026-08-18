import type { RunContext } from '../../../live/types';
import { NESTED_ARRAY_ATTR, groupAttributeKey, nestedArrayMarker } from './profiles';
import {
  BrazeUserProfile,
  exportUserByAlias,
  exportUserByExternalId,
  getSubscriptionGroups,
  subscriptionGroupId,
} from './api';

// Each check here is a SINGLE-SHOT assertion. The scenario-level `verify` block owns the
// retry/backoff for Braze's eventually-consistent export (see READBACK in spec.ts),
// so a check must NOT also poll internally — nesting the two compounds the waits and can blow past
// the runner's per-test timeout (that's what wedged braze-identity-resolution).

// Map the traits we seed to the profile fields Braze returns. `firstName`/`lastName`/`email` are
// reserved (stored as first_name/last_name/email); every other trait lands in custom_attributes.
const expectedProfileFields = (traits: Record<string, string>) => {
  const { email, firstName, lastName, tier } = traits;
  const fields: Record<string, unknown> = {};
  if (email) fields.email = email.toLowerCase();
  if (firstName) fields.first_name = firstName;
  if (lastName) fields.last_name = lastName;
  return { fields, tier };
};

const assertProfileMatches = (
  profile: BrazeUserProfile | null,
  traits: Record<string, string>,
): void => {
  expect(profile).not.toBeNull();
  const { fields, tier } = expectedProfileFields(traits);
  expect(profile).toMatchObject(fields);
  if (tier) {
    expect(profile?.custom_attributes ?? {}).toMatchObject({ tier });
  }
};

// Read the profile back by external_id and assert it carries the seeded traits. `entity` selects
// which ctx identity holds the external_id (default 'user'; e.g. 'braze-ext' for the brazeExternalId
// path).
export const verifyProfileByExternalId =
  (traits: (ctx: RunContext) => Record<string, string>, entity = 'user') =>
  async (ctx: RunContext): Promise<void> => {
    const profile = await exportUserByExternalId(ctx, ctx.identity(entity));
    assertProfileMatches(profile, traits(ctx));
  };

// Read the profile back by a user-alias and assert its traits. `aliasLabel` defaults to rudder_id;
// pass a custom label for the integrations.Braze.alias override path.
export const verifyProfileByAlias =
  (aliasEntity: string, traits: (ctx: RunContext) => Record<string, string>, aliasLabel?: string) =>
  async (ctx: RunContext): Promise<void> => {
    const profile = await exportUserByAlias(ctx, ctx.identity(aliasEntity), aliasLabel);
    assertProfileMatches(profile, traits(ctx));
  };

// Group call: the profile must carry the ab_rudder_group_<groupId> custom attribute set to true.
export const verifyGroupAttribute = async (ctx: RunContext): Promise<void> => {
  const key = groupAttributeKey(ctx);
  const profile = await exportUserByExternalId(ctx, ctx.identity('user'));
  expect(profile).not.toBeNull();
  expect(profile?.custom_attributes ?? {}).toMatchObject({ [key]: true });
};

// Subscription group: the user's status for the target group must read back as subscribed.
export const verifySubscriptionStatus = async (ctx: RunContext): Promise<void> => {
  const targetId = subscriptionGroupId(ctx);
  const groups = await getSubscriptionGroups(ctx, ctx.identity('user'));
  const group = groups.find((g) => g.id === targetId);
  expect(group).toBeDefined();
  expect((group?.status ?? '').toLowerCase()).toBe('subscribed');
};

// Nested-array custom-attribute op: the $add must land an object carrying the run marker in the
// target array attribute. (Requires object-array custom attributes to be enabled in the workspace.)
export const verifyNestedArrayAttribute = async (ctx: RunContext): Promise<void> => {
  const marker = nestedArrayMarker(ctx);
  const profile = await exportUserByExternalId(ctx, ctx.identity('user'));
  const arr = profile?.custom_attributes?.[NESTED_ARRAY_ATTR];
  expect(Array.isArray(arr)).toBe(true);
  expect(arr as unknown[]).toEqual(
    expect.arrayContaining([expect.objectContaining({ name: marker })]),
  );
};
