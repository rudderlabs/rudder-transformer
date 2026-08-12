import type { RunContext } from '../../../live/types';

// The JS-SDK-style context every seeded CustomerIO event carries (mirrors the component fixtures).
export const customerIoLibraryContext = {
  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
  locale: 'en-US',
};

// Common envelope fields shared by every seed, built from ctx so each run is isolated. `timestamp`
// is what the transform reads as its historical timestamp on both paths (GenericFieldMapping
// historicalTimestamp -> timestamp | originalTimestamp).
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
// seeded values and the assertion can't drift. CustomerIO maps traits 1:1 onto profile attributes
// (only `address` is expanded) and stores every attribute as a STRING, so every value here is a
// string — a number would read back as its string form and diff against the seed.

export const identifyTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-Identify',
  tier: `ci-${ctx.runId}-identify`,
});

// The email-only identify carries no userId, so the person is addressed purely by this email.
export const emailOnlyEmail = (ctx: RunContext): string => ctx.email('email-only');
export const emailOnlyTraits = (ctx: RunContext): Record<string, string> => ({
  email: emailOnlyEmail(ctx),
  firstName: 'CI-EmailOnly',
  tier: `ci-${ctx.runId}-email-only`,
});

// A userId that is itself an email address. Both paths key the person by `id` = that email (v1 puts
// it in the URL path, v2 in identifiers.id) rather than by the `email` identifier, so the read-back
// looks the person up by id.
export const emailUserId = (ctx: RunContext): string => ctx.email('user-as-email');
export const emailUserIdTraits = (ctx: RunContext): Record<string, string> => ({
  email: emailUserId(ctx),
  firstName: 'CI-EmailUserId',
  tier: `ci-${ctx.runId}-email-userid`,
});

// The second identify in the identity-consistency sequence. `tier` changes and `stage` is new, so
// the read-back can tell an applied update apart from the original create.
export const emailUserIdUpdatedTraits = (ctx: RunContext): Record<string, string> => ({
  ...emailUserIdTraits(ctx),
  tier: `ci-${ctx.runId}-email-userid-updated`,
  stage: 'post-track-update',
});

// The track between the two identifies. It carries no email of its own, so it is the step that
// would fork a duplicate profile if the identity were resolved differently.
export const emailUserIdEventName = (ctx: RunContext): string =>
  `CI Email UserId Event ${ctx.runId}`;

// RETL / warehouse: context.mappedToDestination makes the transform derive userId from
// context.externalId, so these traits land on the profile keyed by that external id.
export const retlTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-RETL',
  tier: `ci-${ctx.runId}-retl`,
});

// ─── Event names ───
// Run-unique so the activity read-back matches exactly one activity. The screen name is the one the
// transform derives (`Viewed <name> Screen`) on both paths.

export const trackEventName = (ctx: RunContext): string => `CI Live Event ${ctx.runId}`;
// A page activity's identity comes back in the App API's `url` field rather than `name`, so the page
// name is URL-shaped — which is also what a real page event carries.
export const pageName = (ctx: RunContext): string => `https://example.com/ci-live/${ctx.runId}`;
export const screenName = (ctx: RunContext): string => `CI Live Screen ${ctx.runId}`;
export const screenActivityName = (ctx: RunContext): string => `Viewed ${screenName(ctx)} Screen`;

// ─── Group / object ───
// object_type_id comes from traits.objectTypeId (defaulted to '1' by the group mapping,
// src/v0/destinations/customerio/data/customerIoGroup.json); a sandbox whose company object is a
// different type can override it via resourceIds.objectTypeId.

export const groupId = (ctx: RunContext): string => ctx.identity('group');
export const objectTypeId = (ctx: RunContext): string =>
  ctx.liveSecret.resourceIds?.objectTypeId ?? '1';

// The traits become the object's attributes (the mapping excludes only `action`), so the same
// factory drives the seed and the object read-back.
export const groupTraits = (ctx: RunContext): Record<string, string> => ({
  name: `CI Live Account ${ctx.runId}`,
  objectTypeId: objectTypeId(ctx),
  tier: `ci-${ctx.runId}-group`,
});

// ─── Device ───
// context.device.token is what both paths register/remove; `type` becomes the platform.

export const deviceToken = (ctx: RunContext): string => `ci-${ctx.runId}-device-token`;
export const deviceContext = (ctx: RunContext) => ({
  ...customerIoLibraryContext,
  device: { token: deviceToken(ctx), type: 'android' },
});

// ─── Alias / merge ───
// Written directly through the Track API by the setup action, so these are already the destination's
// attribute shape (no trait mapping in between).

export const mergePrimaryAttributes = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email('merge-primary'),
  tier: `ci-${ctx.runId}-merge-primary`,
});

export const mergeSecondaryAttributes = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email('merge-secondary'),
  tier: `ci-${ctx.runId}-merge-secondary`,
});
