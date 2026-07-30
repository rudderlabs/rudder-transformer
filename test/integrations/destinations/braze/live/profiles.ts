import { RunContext } from '../../../live/types';

// Braze's user-alias label used by the transform for the anonymousId alias.
export const RUDDER_ALIAS_LABEL = 'rudder_id';

// The JS-SDK-style context every seeded Braze event carries (mirrors the component fixtures).
export const brazeLibraryContext = {
  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
  locale: 'en-GB',
};

// Common envelope fields shared by every seed, built from ctx so each run is isolated.
export const baseEvent = (ctx: RunContext, suffix: string) => ({
  channel: 'web',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  originalTimestamp: ctx.now(),
  sentAt: ctx.now(),
  integrations: { All: true },
});

// ─── Trait profiles ───
// Each is a (ctx) => ({ ... }) factory shared by a scenario's seed and its read-back verify, so the
// seeded values and the assertion can't drift. `tier` is a non-reserved trait, so Braze stores it
// under custom_attributes[tier] — a stable, uniquely-valued field the verify can match exactly.

export const identifyCreateTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-Create',
  lastName: ctx.runId,
  tier: `ci-${ctx.runId}-create`,
});

export const identifyAnonymousTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email('anon'),
  firstName: 'CI-Anon',
  tier: `ci-${ctx.runId}-anon`,
});

export const identityResolutionTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-IDRes',
  tier: `ci-${ctx.runId}-idres`,
});

export const dontBatchTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-DontBatch',
  tier: `ci-${ctx.runId}-dontbatch`,
});

// Track / order-completed carry a marker trait so the read-back can prove the /users/track write
// landed (the delivery verdict alone can be a 2xx/207 without the profile being written).
export const trackEventTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  tier: `ci-${ctx.runId}-track`,
});

export const orderCompletedTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  tier: `ci-${ctx.runId}-order`,
});

// The custom attribute key Braze writes for a group call (ab_rudder_group_<groupId>).
export const groupId = (ctx: RunContext): string => ctx.identity('group');
export const groupAttributeKey = (ctx: RunContext): string => `ab_rudder_group_${groupId(ctx)}`;

// ─── Recommended-ecommerce marker traits ───
// The recommended-events path (useEcommerceRecommendedEvents) delivers an ecommerce.* event; the
// event body itself isn't returned by /users/export/ids. Seeding a marker trait means the same
// /users/track call also writes an attributes[] block the read-back can assert, proving the request
// landed (a batch endpoint can 2xx/207 without the write actually succeeding).
export const ecomProductViewedTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  tier: `ci-${ctx.runId}-ecom-product-viewed`,
});
export const ecomOrderPlacedTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  tier: `ci-${ctx.runId}-ecom-order-placed`,
});
export const ecomCartUpdatedTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  tier: `ci-${ctx.runId}-ecom-cart-updated`,
});

// ─── alias / merge ───
// A custom attribute set ONLY on the merge-source profile; after /users/merge it must appear on the
// kept profile. `merged_from` carries the source external_id so the read-back is uniquely asserted.
export const mergeSourceMarker = (ctx: RunContext): Record<string, string> => ({
  merged_from: ctx.identity('merge-user'),
});

// ─── subscription group ───
export const subscriptionTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  subscriptionState: 'subscribed',
});

// ─── per-job delivery mapping / supportDedup / page / screen ───
// All deliver via /users/track attributes; each seeds a unique marker trait the read-back asserts.
export const perJobTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-PerJob',
  tier: `ci-${ctx.runId}-perjob`,
});
export const dedupTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-Dedup',
  tier: `ci-${ctx.runId}-dedup`,
});
export const pageTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-Page',
  tier: `ci-${ctx.runId}-page`,
});
export const screenTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-Screen',
  tier: `ci-${ctx.runId}-screen`,
});
export const purchaseExtraTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-PurchaseExtra',
  tier: `ci-${ctx.runId}-purchase-extra`,
});

// ─── RETL / warehouse (mappedToDestination) ───
// In the RETL path the transform returns traits VERBATIM (no reserved-key mapping) and derives
// external_id from context.externalId. `retlTraits` is the verify shape (camelCase, mapped like the
// other profiles); `retlSeedTraits` is the SAME values under raw Braze attribute names for the seed,
// so the two can't drift.
export const retlTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-RETL',
  tier: `ci-${ctx.runId}-retl`,
});
export const retlSeedTraits = (ctx: RunContext): Record<string, string> => {
  const t = retlTraits(ctx);
  return { email: t.email, first_name: t.firstName, tier: t.tier };
};

// ─── remaining recommended-ecommerce event types (marker traits) ───
export const ecomCheckoutStartedTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  tier: `ci-${ctx.runId}-ecom-checkout`,
});
export const ecomOrderRefundedTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  tier: `ci-${ctx.runId}-ecom-refund`,
});
export const ecomOrderCancelledTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  tier: `ci-${ctx.runId}-ecom-cancel`,
});
export const ecomCartRemoveTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  tier: `ci-${ctx.runId}-ecom-cart-remove`,
});

// ─── legacy purchase: multi-product + product-level currency + sku fallback ───
export const multiProductTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  tier: `ci-${ctx.runId}-multiproduct`,
});

// ─── external_id resolved from context.externalId brazeExternalId ───
export const brazeExternalIdTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-BrazeExtId',
  tier: `ci-${ctx.runId}-brazeextid`,
});

// ─── supportDedup for an EXISTING user (the real dedup-reduce branch) ───
// Initial state written by setup (raw Braze attribute names for createUserWithAttributes); the
// update changes `tier` while leaving name/email unchanged, so dedup strips the unchanged keys and
// delivers only the change. The read-back asserts the changed tier landed.
export const dedupExistingInitialAttrs = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  first_name: 'CI-DedupX',
  tier: `ci-${ctx.runId}-dedupx-initial`,
});
export const dedupExistingUpdateTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-DedupX',
  tier: `ci-${ctx.runId}-dedupx-updated`,
});

// ─── integrations.Braze.alias custom alias-label override ───
export const CUSTOM_ALIAS_LABEL = 'ci_custom_alias';
export const customAliasTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email('custom-alias'),
  firstName: 'CI-CustomAlias',
  tier: `ci-${ctx.runId}-custom-alias`,
});

// ─── nested-array custom-attribute operations (enableNestedArrayOperations) ───
// The custom attribute the ops target, and a run-unique marker on the $add object so the read-back
// can find exactly the item this run appended.
export const NESTED_ARRAY_ATTR = 'ci_objects';
export const nestedArrayMarker = (ctx: RunContext): string => `ci-${ctx.runId}`;

// Trait shape the transform expects: per-key { update, remove, add } arrays keyed by an `identifier`
// field (see processor/data.ts Tests 12–14). On a fresh profile the update/remove target nothing and
// the add appends one object carrying the run marker.
export const nestedArrayTraits = (ctx: RunContext): Record<string, unknown> => ({
  email: ctx.email(),
  [NESTED_ARRAY_ATTR]: {
    update: [{ identifier: 'id', id: 2, name: `${nestedArrayMarker(ctx)}-upd` }],
    remove: [{ identifier: 'id', id: 3 }],
    add: [{ id: 1, name: nestedArrayMarker(ctx), age: 27 }],
  },
});
