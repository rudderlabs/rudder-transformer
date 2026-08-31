import sha256 from 'sha256';
import type { RunContext } from '../../../live/types';

// The two conversion actions the scenarios drive, named exactly as they exist in the sandbox
// account. The SDK resolves them by name via `googleAds:searchStream`, so these are match-exact —
// note the lower-case 'v' in 'Page view'; the mocked component fixtures say 'Page View', which is a
// different action name and does not resolve.
//
// Declared here rather than in LIVE_SECRET_<DEST> because they are not credentials. The account
// itself is already pinned by `config.customerId` in the secret, and a conversion action's name is
// public metadata of that account — the same reasoning that moved `accountDefinition` out of the
// secret and onto the spec. Keeping them here means the secret holds only things that must not be
// read, and one fewer key has to be provisioned before this suite can run at all.
//
// Both are WEBPAGE actions, chosen because each accepts an ENHANCEMENT for a previously unseen
// `orderId` — verified against the live account with `validateOnly: true`, so nothing was written.
// If the sandbox's actions are ever renamed, the lookup fails with Google's "Conversion Action not
// found" and these two literals are the only thing to update.
export const PRIMARY_CONVERSION = 'Purchase';
export const SECONDARY_CONVERSION = 'Page view';

// ── Seed values ──
//
// These are the raw values a producer would put on the wire, nothing more. Deliberately no
// normalization, formatting or hashing rules live in this file: reproducing the transform's own
// rules here would make the suite grade the transform against a copy of itself, and any rule it
// got wrong would be a rule the test agreed with. Everything below is either already in the shape
// the destination accepts, or is raw input the transform is responsible for converting.

// Google Ads takes date-times as `yyyy-MM-dd HH:mm:ss+|-HH:mm`. The transform does NOT convert this
// field — trackConfig.json maps `properties.adjustmentDateTime` straight through — so an event has
// to arrive already in that shape, and these seeds mirror what a producer must send. (If GAEC ever
// takes over the conversion, this becomes a plain ISO timestamp and the transform is what proves
// it; see the note in the PR description.)
const googleDateTime = (isoTimestamp: string): string =>
  `${isoTimestamp.slice(0, 10)} ${isoTimestamp.slice(11, 19)}+00:00`;

// Raw, unnormalized identifiers — mixed case and messy phone formatting on purpose, so the
// transform's normalize → validate → hash pipeline is what has to get them right.
const RAW = {
  // NANP reserves 555-0100..555-0199 for fictional use, and this number's hash is uploaded to
  // Google as a match identifier, so it must be one that cannot belong to a real person.
  phone: '+1 (415) 555-0171',
  firstName: 'Alex',
  lastName: 'Doe',
  streetAddress: '71 Cherry Court',
};

// Plaintext address fields the transform passes through untouched. Google requires country and
// postal code alongside a hashed name, so these travel with every address profile.
const GEO = {
  city: 'Southampton',
  state: 'CA',
  countryCode: 'US',
  postalCode: '94105',
};

// The envelope every seeded track event shares. `orderId` is the one required mapping field
// (trackConfig.json), so it is set here rather than per profile; it is namespaced by runId so a
// re-run never re-uploads an adjustment Google has already accepted for the same order.
const trackEvent = (
  ctx: RunContext,
  suffix: string,
  event: string,
  extra: { traits?: Record<string, unknown>; properties?: Record<string, unknown> },
): Record<string, unknown> => {
  const at = ctx.now();
  return {
    type: 'track',
    event,
    channel: 'web',
    messageId: `${ctx.runId}-${suffix}`,
    anonymousId: ctx.identity(`anon-${suffix}`),
    userId: ctx.identity(`user-${suffix}`),
    timestamp: at,
    originalTimestamp: at,
    sentAt: at,
    integrations: { All: true },
    context: {
      library: { name: 'rudder-live-integration-test' },
      // Maps to conversionAdjustments[0].userAgent.
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...(extra.traits ? { traits: extra.traits } : {}),
    },
    properties: {
      orderId: `${ctx.runId}-${suffix}`,
      // Google rejects an adjustment stamped in the future and one older than the conversion it
      // adjusts; an hour back sits safely inside the window for a recently uploaded conversion.
      adjustmentDateTime: googleDateTime(ctx.now('-1h')),
      ...(extra.properties ?? {}),
    },
  };
};

// ── Identifier profiles ──

// Email + phone: the two standalone `userIdentifiers` entries. Both are raw — the transform
// normalizes and SHA-256s them, and a regression there surfaces as a Google FieldError on the
// identifier, which no mocked response can reproduce.
export const emailPhoneTraits = (ctx: RunContext): Record<string, unknown> => ({
  email: ctx.email(),
  phone: RAW.phone,
});

// The addressInfo entry: raw name/street sub-fields the transform hashes, plus the plaintext geo
// fields it passes through. `lastName` is run-scoped so concurrent runs never upload identical
// address identifiers.
export const addressTraits = (ctx: RunContext): Record<string, unknown> => ({
  firstName: RAW.firstName,
  lastName: `${RAW.lastName}-${ctx.runId.slice(-8)}`,
  streetAddress: RAW.streetAddress,
  ...GEO,
});

// Already-hashed identifiers, for the requireHash:false branch — which skips normalization and
// validation and ships these to Google verbatim. The inputs are written already-normalized (lower
// case, E.164, and `ctx.email()` is lower-case on a non-Gmail domain) so this hashes them directly
// rather than restating the transform's normalization rules. What the scenario asserts is that
// Google accepts the SHA-256 hex the pass-through branch forwards.
const HASHED_INPUT = {
  phone: '+14155550171',
  firstName: 'alex',
  lastName: 'doe',
  streetAddress: '71 cherry court',
};

export const preHashedTraits = (ctx: RunContext): Record<string, unknown> => ({
  email: sha256(ctx.email()),
  phone: sha256(HASHED_INPUT.phone),
  firstName: sha256(HASHED_INPUT.firstName),
  lastName: sha256(HASHED_INPUT.lastName),
  streetAddress: sha256(HASHED_INPUT.streetAddress),
  ...GEO,
});

// ── Event seeds ──

export const enhancementEvent = (
  ctx: RunContext,
  suffix: string,
  event: string,
  traits: Record<string, unknown>,
): Record<string, unknown> => trackEvent(ctx, suffix, event, { traits });

// An adjustment Google rejects on its own while its batch-mates are accepted — the ingredient a
// live partial-failure scenario needs.
//
// It has to fail at GOOGLE, not in our transform: anything the transform rejects never reaches
// delivery, so it would exercise the router's error path instead of delivery.ts's. This value is
// chosen for exactly that property — trackConfig.json maps `properties.adjustmentDateTime` with no
// type coercion and no validation, so a malformed date passes straight through and comes back as
// `INVALID_STRING_DATE_TIME_SECONDS_WITH_OFFSET` on that one positional item, with the batch still
// HTTP 200 and `results` carrying an empty slot where the item failed.
const REJECTED_ADJUSTMENT_DATE_TIME = 'not-a-date';

export const rejectedEnhancementEvent = (
  ctx: RunContext,
  suffix: string,
  event: string,
  traits: Record<string, unknown>,
): Record<string, unknown> =>
  trackEvent(ctx, suffix, event, {
    traits,
    properties: { adjustmentDateTime: REJECTED_ADJUSTMENT_DATE_TIME },
  });
