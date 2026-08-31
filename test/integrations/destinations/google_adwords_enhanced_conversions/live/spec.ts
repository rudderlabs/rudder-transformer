import { requiredSecretField } from '../../../live/secretResolver';
import type { LiveScenario, LiveSpec } from '../../../live/types';
import {
  PRIMARY_CONVERSION,
  SECONDARY_CONVERSION,
  addressTraits,
  emailPhoneTraits,
  enhancementEvent,
  preHashedTraits,
  rejectedEnhancementEvent,
} from './profiles';

const DEST = 'google_adwords_enhanced_conversions';

// What a run actually exercises, end to end, against a real Google Ads account:
//
//   1. rudder-auth mints an access token from the stored refresh token (authType 'oauth'),
//   2. the batching-framework transform builds the conversion adjustments,
//   3. the SDK resolves the conversion action by NAME via `googleAds:searchStream`, and
//   4. uploads to `customers/<id>:uploadConversionAdjustments` on Google Ads v23.
//
// There is deliberately no read-back `verify`. Google Ads exposes no API for reading an uploaded
// conversion adjustment, and matching against the underlying conversion is asynchronous (hours), so
// a read-back would either assert nothing or be permanently flaky. The assertion is the delivery
// verdict instead — which is meaningful here because delivery.ts maps a `partialFailureError` on a
// 200 into a per-job abort, so any payload Google rejects fails the step rather than passing as a
// 2xx. That covers the whole contract this suite exists to check: token, developer token, customer
// id, conversion-action resolution, identifier hashing format and adjustment shape.
//
// Not ported from the component suite: every validation/error case (unconfigured conversion name,
// missing orderId, non-track message type, missing OAuth secret, hashing-consistency aborts,
// non-string loginCustomerId). Those never reach Google, so a live run adds nothing to what
// component.test.ts already pins.

const scenarios = [
  {
    id: 'gaec-enhancement-email-phone',
    description:
      'ENHANCEMENT with raw email + phone traits — normalized, SHA-256 hashed and uploaded as two userIdentifiers entries',
    steps: [
      {
        stepType: 'pipeline',
        name: 'enhancement with email and phone identifiers',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) =>
          enhancementEvent(ctx, 'email-phone', PRIMARY_CONVERSION, emailPhoneTraits(ctx)),
      },
    ],
  },
  {
    id: 'gaec-enhancement-address',
    description:
      'ENHANCEMENT with address traits — hashed first/last name and street address alongside the plaintext city/state/countryCode/postalCode Google requires with them',
    steps: [
      {
        stepType: 'pipeline',
        name: 'enhancement with addressInfo identifiers',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) => enhancementEvent(ctx, 'address', PRIMARY_CONVERSION, addressTraits(ctx)),
      },
    ],
  },
  {
    id: 'gaec-enhancement-prehashed',
    description:
      'requireHash=false — pre-hashed traits skip normalization and validation and reach Google exactly as sent, proving the hex format is one Google accepts',
    configOverride: (base) => ({ ...base, requireHash: false }),
    steps: [
      {
        stepType: 'pipeline',
        name: 'enhancement with pre-hashed identifiers',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) => enhancementEvent(ctx, 'prehashed', PRIMARY_CONVERSION, preHashedTraits(ctx)),
      },
    ],
  },
  {
    id: 'gaec-batched-same-conversion',
    description:
      'Two events on the same conversion action collapse into ONE upload carrying two conversionAdjustments, and both jobs are attributed the delivery verdict',
    steps: [
      {
        stepType: 'pipeline',
        name: 'two same-conversion events batch into one upload',
        // The whole point of the scenario: one router output, one proxy request, two adjustments.
        // Pinned exactly, because a grouping regression that fanned these out would still deliver
        // 2xx twice and otherwise pass unnoticed.
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) => [
          enhancementEvent(ctx, 'batch-a', PRIMARY_CONVERSION, emailPhoneTraits(ctx)),
          enhancementEvent(ctx, 'batch-b', PRIMARY_CONVERSION, addressTraits(ctx)),
        ],
      },
    ],
  },
  {
    id: 'gaec-partial-failure',
    description:
      'A batch where one adjustment is rejected — Google 200s with partialFailureError and an empty results slot, and delivery.ts blames exactly that job while its batch-mate is delivered',
    steps: [
      {
        stepType: 'pipeline',
        name: 'one rejected adjustment alongside a valid one',
        // Both events share a conversion action, so they must land in ONE upload — the partial
        // failure only exists inside a multi-item request.
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        // The whole point: the SECOND event is the invalid one, so this pins the positional
        // attribution in delivery.ts. Blaming index 0, or blaming both, still yields "one success
        // and one failure" and would pass a weaker check.
        expectedFailure: { items: [1] },
        seed: (ctx) => [
          enhancementEvent(ctx, 'partial-ok', PRIMARY_CONVERSION, emailPhoneTraits(ctx)),
          rejectedEnhancementEvent(ctx, 'partial-bad', PRIMARY_CONVERSION, emailPhoneTraits(ctx)),
        ],
      },
    ],
  },
  {
    id: 'gaec-grouping-fan-out',
    description:
      'Two events on DIFFERENT conversion actions fan out to two uploads — the conversion name is part of the batching key, and each resolves its own conversionActionId',
    steps: [
      {
        stepType: 'pipeline',
        name: 'two different-conversion events fan out to two uploads',
        expectedOutputs: 2,
        expectedProxyRequests: 2,
        seed: (ctx) => [
          enhancementEvent(ctx, 'fanout-primary', PRIMARY_CONVERSION, emailPhoneTraits(ctx)),
          enhancementEvent(ctx, 'fanout-secondary', SECONDARY_CONVERSION, emailPhoneTraits(ctx)),
        ],
      },
    ],
  },
  {
    id: 'gaec-auth-expired',
    description:
      "A credential Google rejects — delivery.ts's 4xx override reads the body and reports REFRESH_TOKEN, so rudder-server refreshes the grant instead of just aborting the job",
    steps: [
      // Deliberately two steps, and the order is load-bearing.
      //
      // networkHandler resolves the conversion action by NAME before uploading, and that lookup
      // uses the same access token. With a bad token the LOOKUP fails first, and it fails by
      // THROWING from inside networkHandler.proxy() — which the framework's try/catch turns into a
      // legacy-path error, never reaching the delivery spec's 4xx override. The test would go red
      // for the right-looking reason while proving nothing about delivery.ts.
      //
      // The lookup is memoised per (conversion name, customerId), so a valid delivery first warms
      // that cache; the bad-token step then skips the lookup and fails on the upload, which IS a
      // response the framework hands to the override. Warming it inside the scenario rather than
      // relying on an earlier one keeps this independent of scenario order and of running this
      // scenario alone.
      {
        stepType: 'pipeline',
        name: 'warm the conversion-action cache with a valid delivery',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) =>
          enhancementEvent(ctx, 'auth-warm', PRIMARY_CONVERSION, emailPhoneTraits(ctx)),
      },
      {
        stepType: 'pipeline',
        name: 'delivery with a credential Google rejects',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        // A syntactically valid token that is not a real grant. It has to reach the transform —
        // getAccessToken throws on an absent one — so this replaces the value rather than removing
        // it. Google answers 401 UNAUTHENTICATED with no `authenticationError` code, which
        // getAuthErrCategory maps to REFRESH_TOKEN.
        metadataOverride: { secret: { access_token: 'live-test-deliberately-invalid-token' } },
        expectedFailure: { category: 'REFRESH_TOKEN' },
        seed: (ctx) => enhancementEvent(ctx, 'auth-bad', PRIMARY_CONVERSION, emailPhoneTraits(ctx)),
      },
    ],
  },
] satisfies LiveScenario[];

export const live = {
  // Credentials come from the LIVE_SECRET_GOOGLE_ADWORDS_ENHANCED_CONVERSIONS field on
  // engineering_shared/data/integrations_team/e2e_test/rudder-transformer (single-line LiveSecret
  // JSON):
  //
  //   {"authType":"oauth",
  //    "config":{"customerId":"<10-digit customer id>"},
  //    "secret":{"developerToken":"<google ads developer token>"},
  //    "oauthRefresh":{"refreshToken":"<google refresh token>"}}
  //
  // Credentials only — nothing static lives in there. Two things that are *about* the account but
  // are not secret live in code instead: the rudder-auth account definition, derived from the
  // destination name by the resolver (DESTINATION_GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_OAUTH), and
  // the two conversion action names (PRIMARY_CONVERSION / SECONDARY_CONVERSION in ./profiles).
  // Every key that has to be provisioned before this suite can run at all is a key that can be
  // forgotten, and a missing one fails the whole file at collection.
  //
  // Every run uploads real conversion adjustments to that account. Nothing is created that can be
  // deleted — Google exposes no delete for an uploaded adjustment — so there is no `cleanup`; the
  // adjustments simply fail to match any conversion and are discarded on Google's side.
  enabled: true,
  authType: 'oauth',
  // rudder-auth's v1 route. It answers with `{ access_token }`, which is the key transform.ts reads
  // via getAccessToken.
  oauthVersion: 'v1',
  // Mirrors rudder-integrations-config
  // `destinations/google_adwords_enhanced_conversions/accounts/google_adwords_enhanced_conversions_oauth/db-config.json`.
  // `name` is what rudder-auth lowercases to pick its implementation, so it has to match that file
  // exactly. `category` is not declared here — it is 'destination' for every live spec and the
  // resolver supplies it.
  accountDefinition: {
    type: 'google_adwords_enhanced_conversions',
    name: 'DESTINATION_GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_OAUTH',
  },
  envOverrides: {
    // Batching-framework delivery is still behind a temporary per-destination flag; without it the
    // run would exercise the legacy networkHandler instead of delivery.ts. The transform-side flag
    // is deliberately absent — GAEC is already batching-GA in features.ts.
    GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS: 'ALL',
  },
  // The Google Ads SDK reads the developer token from process.env (googleUtils.getDeveloperToken),
  // not from destination.Config or metadata.secret — it is a deployment-wide credential rather than
  // a per-workspace one — so it can't travel through resolveConfig.
  resolveEnv: (s) => ({
    GOOGLE_ADS_DEVELOPER_TOKEN: requiredSecretField(
      s,
      DEST,
      'developerToken',
      'the Google Ads API developer token the sandbox account is approved under',
    ),
  }),
  // Only the fields the transform actually reads. customerId arrives from the secret;
  // listOfConversions is built from the same two constants the scenarios seed, so the config and
  // the events can't drift — the transform rejects an event whose conversion name is not listed
  // here before it ever reaches Google.
  resolveConfig: (s) => ({
    subAccount: false,
    requireHash: true,
    listOfConversions: [{ conversions: PRIMARY_CONVERSION }, { conversions: SECONDARY_CONVERSION }],
    ...s.config,
  }),
  scenarios,
} satisfies LiveSpec;

export default live;
