import type { LiveSpec, RunContext } from '../../../live/types';
import {
  deleteAnonymousUser,
  deleteUserByExternalId,
  deleteUsers,
  subscriptionGroupId,
} from './api';
import { createDedupUserAndWait, createMergeUsers, createSubscriptionUser } from './setup';
import {
  baseEvent,
  brazeExternalIdTraits,
  brazeLibraryContext,
  CUSTOM_ALIAS_LABEL,
  customAliasTraits,
  dedupExistingUpdateTraits,
  dedupTraits,
  dontBatchTraits,
  ecomCartRemoveTraits,
  ecomCartUpdatedTraits,
  ecomCheckoutStartedTraits,
  ecomOrderCancelledTraits,
  ecomOrderPlacedTraits,
  ecomOrderRefundedTraits,
  ecomProductViewedTraits,
  groupId,
  identifyAnonymousTraits,
  identifyCreateTraits,
  identityResolutionTraits,
  multiProductTraits,
  nestedArrayTraits,
  orderCompletedTraits,
  pageTraits,
  perJobTraits,
  purchaseExtraTraits,
  retlSeedTraits,
  retlTraits,
  screenTraits,
  subscriptionTraits,
  trackEventTraits,
} from './profiles';
import {
  verifyGroupAttribute,
  verifyNestedArrayAttribute,
  verifyProfileByAlias,
  verifyProfileByExternalId,
  verifySubscriptionStatus,
} from './verify';

// Teardown that removes both profiles an alias-merge scenario touches (kept + source).
const deleteMergeUsers = (ctx: RunContext): Promise<void> =>
  deleteUsers(ctx, { externalIds: [ctx.identity('user'), ctx.identity('merge-user')] });

// Retry budget for the scenario-level read-backs. The runner wraps `verify.check` in
// retryUntilPasses(check, { attempts, delayMs }); the checks are single-shot, so this is the ONLY
// backoff layer. 7 attempts (waits 1,2,4,8,16,32s → reads at ~0,1,3,7,15,31,63s)
// covers slower Braze export lag while staying under the runner's 120s per-test timeout.
const READBACK = { attempts: 7, delayMs: (n: number) => 1000 * 2 ** n };

// Must match BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS set in test/setup.ts. A scenario setting
// this as its step's destinationOverride.WorkspaceID routes through processBatchWithDeliveryMapping
// (the ON path); every other scenario stays on the default processBatch path.
const BRAZE_PER_JOB_DELIVERY_TEST_WORKSPACE_ID = 'braze-pjdm-ws';

export const live = {
  enabled: true,
  authType: 'apiKey',
  // restApiKey + dataCenter are account-scoped and come from LIVE_SECRET_BRAZE.config; the rest are
  // fixed non-secret defaults taken from the component destination.Config.
  resolveConfig: (s) => ({
    prefixProperties: true,
    useNativeSDK: false,
    ...s.config,
  }),
  scenarios: [
    {
      // identify with only a userId → /users/track attributes keyed by external_id (create/update).
      id: 'braze-identify-create',
      description: 'Event-stream identify creates/updates a user profile by external_id',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify by external_id',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-create'),
            type: 'identify',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: identifyCreateTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(identifyCreateTraits), ...READBACK },
    },
    {
      // identify with only an anonymousId → /users/track attributes keyed by a rudder_id user_alias.
      id: 'braze-identify-anonymous-alias',
      description: 'Anonymous-only identify creates a profile addressed by a rudder_id user_alias',
      cleanup: deleteAnonymousUser,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify by user_alias',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-anon'),
            type: 'identify',
            anonymousId: ctx.identity('anon'),
            context: { ...brazeLibraryContext, traits: identifyAnonymousTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyProfileByAlias('anon', identifyAnonymousTraits), ...READBACK },
    },
    {
      // identify carrying BOTH userId and anonymousId → the transform fires /users/identify to merge
      // the rudder_id alias into the external_id user (identity resolution) alongside /users/track.
      id: 'braze-identity-resolution',
      description:
        'identify with userId + anonymousId merges the rudder_id alias into the external_id profile',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify + alias merge',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identity-resolution'),
            type: 'identify',
            userId: ctx.identity('user'),
            anonymousId: ctx.identity('user-anon'),
            context: { ...brazeLibraryContext, traits: identityResolutionTraits(ctx) },
          }),
        },
      ],
      // Read back the external_id profile's traits (reliably returned by /users/export/ids) rather
      // than asserting the rudder_id alias in user_aliases — Braze's export doesn't reliably surface
      // that alias. The /users/identify branch still fires during this run (that's the path under
      // test); this confirms the combined identify + track landed on the external_id profile.
      verify: { check: verifyProfileByExternalId(identityResolutionTraits), ...READBACK },
    },
    {
      // track with a custom event → /users/track events[]; the seeded traits also produce an
      // attributes[] write, which the read-back uses to prove the request actually landed.
      id: 'braze-track-custom-event',
      description: 'A custom track event is delivered and updates the user profile',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'track custom event',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'track-custom'),
            type: 'track',
            event: 'CI Live Event',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: trackEventTraits(ctx) },
            properties: { plan: 'enterprise', source: 'live-integration-test' },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(trackEventTraits), ...READBACK },
    },
    {
      // "order completed" → /users/track purchases[]; seeded traits again give an attributes[] write
      // for the read-back (purchase records themselves aren't returned by the export endpoint).
      id: 'braze-order-completed',
      description: 'An "order completed" track event is delivered as a Braze purchase',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'order completed purchase',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'order-completed'),
            type: 'track',
            event: 'order completed',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: orderCompletedTraits(ctx) },
            properties: {
              order_id: `ord-${ctx.runId}`,
              currency: 'USD',
              revenue: 19.99,
              products: [
                { product_id: `sku-${ctx.runId}`, sku: 'CI-SKU', price: 19.99, quantity: 1 },
              ],
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(orderCompletedTraits), ...READBACK },
    },
    {
      // group → /users/track attributes with ab_rudder_group_<groupId> = true on the external_id user.
      id: 'braze-group',
      description:
        'A group call sets the ab_rudder_group_<groupId> custom attribute on the profile',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'group membership attribute',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'group'),
            type: 'group',
            userId: ctx.identity('user'),
            groupId: groupId(ctx),
            traits: { email: ctx.email() },
          }),
        },
      ],
      verify: { check: verifyGroupAttribute, ...READBACK },
    },
    {
      // Same create path as the first scenario, but with dontBatch=true — the proxy-request count is
      // pinned so a batching regression that collapses/fans out delivery is caught even though it 2xxs.
      id: 'braze-identify-create-dontbatch',
      description: 'identify with dontBatch=true delivers un-batched (single proxy request)',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify (dontBatch)',
          metadataOverride: { dontBatch: true },
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-dontbatch'),
            type: 'identify',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: dontBatchTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(dontBatchTraits), ...READBACK },
    },

    // ─── Recommended-ecommerce events (useEcommerceRecommendedEvents) ───
    // A config-gated branch that maps RS ecommerce events to Braze `ecommerce.*` events and runs
    // ahead of the legacy custom-event / purchase paths. configOverride flips the flag on; the seeded
    // marker traits give an attributes[] write the read-back asserts (the ecommerce.* event body
    // itself isn't returned by /users/export/ids).
    {
      // Flat event, no products[] (product_viewed is the only mapping with a null product mapping).
      id: 'braze-ecom-product-viewed',
      description:
        'Recommended-events: "product viewed" is delivered as an ecommerce.product_viewed event',
      configOverride: (base) => ({ ...base, useEcommerceRecommendedEvents: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'product viewed (ecommerce.product_viewed)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'ecom-product-viewed'),
            type: 'track',
            event: 'product viewed',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: ecomProductViewedTraits(ctx) },
            properties: {
              product_id: `sku-${ctx.runId}`,
              name: 'CI Live Product',
              price: 24.99,
              currency: 'USD',
              image_url: 'https://example.com/p.png',
              url: 'https://example.com/p',
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(ecomProductViewedTraits), ...READBACK },
    },
    {
      // products[] array + order semantics. With the flag ON, "order completed" routes HERE
      // (ecommerce.order_placed), not to the legacy purchases path.
      id: 'braze-ecom-order-placed',
      description:
        'Recommended-events: "order completed" is delivered as an ecommerce.order_placed event',
      configOverride: (base) => ({ ...base, useEcommerceRecommendedEvents: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'order completed (ecommerce.order_placed)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'ecom-order-placed'),
            type: 'track',
            event: 'order completed',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: ecomOrderPlacedTraits(ctx) },
            properties: {
              order_id: `ord-${ctx.runId}`,
              total: 44.98,
              currency: 'USD',
              products: [
                {
                  product_id: `sku-${ctx.runId}`,
                  name: 'CI Live Product',
                  quantity: 2,
                  price: 22.49,
                },
              ],
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(ecomOrderPlacedTraits), ...READBACK },
    },
    {
      // cart_updated single-product wrap (top-level product fields, no explicit products[]) + the
      // add/remove action variant.
      id: 'braze-ecom-cart-updated',
      description:
        'Recommended-events: "product added" is delivered as an ecommerce.cart_updated (add) event',
      configOverride: (base) => ({ ...base, useEcommerceRecommendedEvents: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'product added (ecommerce.cart_updated, add)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'ecom-cart-updated'),
            type: 'track',
            event: 'product added',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: ecomCartUpdatedTraits(ctx) },
            properties: {
              cart_id: `cart-${ctx.runId}`,
              currency: 'USD',
              product_id: `sku-${ctx.runId}`,
              name: 'CI Live Product',
              price: 22.49,
              quantity: 1,
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(ecomCartUpdatedTraits), ...READBACK },
    },

    // ─── alias → /users/merge ───
    // Distinct endpoint. Setup creates the kept (userId) and source (previousId) profiles; the alias
    // merges the source into the kept. Delivery-only — Braze processes merges asynchronously with no
    // read-back SLA (see the note on the scenario below).
    {
      id: 'braze-alias-merge',
      description: 'An alias call merges the previousId profile into the userId profile',
      cleanup: deleteMergeUsers,
      steps: [
        { stepType: 'action', name: 'setup: create keep + source users', run: createMergeUsers },
        {
          stepType: 'pipeline',
          name: 'alias merge',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'alias-merge'),
            type: 'alias',
            userId: ctx.identity('user'),
            previousId: ctx.identity('merge-user'),
          }),
        },
      ],
      // No read-back verify: Braze processes /users/merge ASYNCHRONOUSLY with no tight SLA, so the
      // merge effect (source attributes copied to the kept profile) isn't observable within the
      // runner's 60s window. The pipeline step already asserts the real API accepted the merge
      // request (2xx) — that's the contract this scenario verifies.
    },

    // ─── group subscription → /v2/subscription/status/set ───
    // The other endpoint the base scenarios don't touch. Gated by enableSubscriptionGroupInGroupCall
    // and needs a real subscription_group_id (resourceIds.subscriptionGroupId). If your sandbox has
    // no subscription group, set enabled:false on this scenario.
    {
      id: 'braze-group-subscription',
      // Parked by default: needs a real subscription_group_id from the account. Set
      // resourceIds.subscriptionGroupId in LIVE_SECRET_BRAZE and flip this to true (or delete the
      // line) to run it.
      enabled: false,
      description:
        'A group call with enableSubscriptionGroupInGroupCall sets a subscription-group status',
      configOverride: (base) => ({ ...base, enableSubscriptionGroupInGroupCall: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        { stepType: 'action', name: 'setup: create user', run: createSubscriptionUser },
        {
          stepType: 'pipeline',
          name: 'set subscription status',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'group-subscription'),
            type: 'group',
            userId: ctx.identity('user'),
            groupId: subscriptionGroupId(ctx),
            traits: subscriptionTraits(ctx),
          }),
        },
      ],
      verify: { check: verifySubscriptionStatus, ...READBACK },
    },

    // ─── nested-array custom-attribute operations (enableNestedArrayOperations) ───
    // A distinct transform branch: traits carry per-key { update, remove, add } arrays that become
    // Braze $update/$remove/$add object-array ops. The read-back asserts the $add object landed.
    // NOTE: requires object-array custom attributes to be enabled in the Braze workspace.
    {
      id: 'braze-nested-array-attribute-ops',
      description:
        'identify with enableNestedArrayOperations applies $add/$update/$remove to an array attribute',
      configOverride: (base) => ({ ...base, enableNestedArrayOperations: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'nested-array attribute ops',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'nested-array-ops'),
            type: 'identify',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: nestedArrayTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyNestedArrayAttribute, ...READBACK },
    },

    // ─── per-job delivery mapping (BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS) ───
    // Same create path as braze-identify-create, but tagged with the allow-listed workspaceId so
    // processRouterDest routes it through processBatchWithDeliveryMapping (one BatchRequestOutput per
    // HTTP request + per-metadata destInfo). For a single event the delivery must be IDENTICAL to the
    // default path — same 1 output / 1 proxy request, same profile written.
    {
      id: 'braze-per-job-delivery-mapping',
      description:
        'identify delivered under the per-job delivery-mapping flag (ON path) lands identically',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify (per-job delivery mapping)',
          destinationOverride: { WorkspaceID: BRAZE_PER_JOB_DELIVERY_TEST_WORKSPACE_ID },
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'per-job-delivery'),
            type: 'identify',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: perJobTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(perJobTraits), ...READBACK },
    },

    // ─── supportDedup ───
    // With supportDedup, processRouterDest first calls BrazeDedupUtility.doLookup (a real
    // /users/export/ids) to seed the dedup store. A fresh run user isn't in the store, so it's not a
    // duplicate and delivers normally — exercising the lookup path end-to-end against the real API.
    {
      id: 'braze-identify-dedup',
      description:
        'identify with supportDedup does a real export lookup then delivers a fresh user',
      configOverride: (base) => ({ ...base, supportDedup: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify (supportDedup)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'dedup'),
            type: 'identify',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: dedupTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(dedupTraits), ...READBACK },
    },

    // ─── page → /users/track event ───
    // A page call routes through processTrackEvent with the event name defaulted (name/properties.name
    // → 'Page Viewed'); seeded traits also write attributes[], which the read-back asserts.
    {
      id: 'braze-page',
      description: 'A page call is delivered as a Braze track event',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'page',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'page'),
            type: 'page',
            name: 'Home Page',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: pageTraits(ctx) },
            properties: { path: '/home', title: 'Home' },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(pageTraits), ...READBACK },
    },

    // ─── screen → /users/track event ───
    {
      id: 'braze-screen',
      description: 'A screen call is delivered as a Braze track event',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'screen',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'screen'),
            type: 'screen',
            name: 'Home Screen',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: screenTraits(ctx) },
            properties: { screen: 'Home' },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(screenTraits), ...READBACK },
    },

    // ─── sendPurchaseEventWithExtraProperties ───
    // Legacy purchase path with the flag on: non-standard product fields (beyond
    // product_id/sku/price/quantity/currency) are attached as `properties` on each purchase object.
    // Braze doesn't return purchase details via /users/export/ids, so the read-back asserts the
    // seeded marker trait (proving the /users/track call landed); delivery confirms the real API
    // accepts the extra-properties purchase shape.
    {
      id: 'braze-order-purchase-extra-properties',
      description:
        'order completed with sendPurchaseEventWithExtraProperties attaches extra product properties to the purchase',
      configOverride: (base) => ({ ...base, sendPurchaseEventWithExtraProperties: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'order completed (extra purchase properties)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'purchase-extra'),
            type: 'track',
            event: 'order completed',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: purchaseExtraTraits(ctx) },
            properties: {
              order_id: `ord-${ctx.runId}`,
              currency: 'USD',
              products: [
                {
                  product_id: `sku-${ctx.runId}`,
                  price: 19.99,
                  quantity: 1,
                  // Non-standard fields → attached under purchase.properties by the flag.
                  brand: 'CI-Brand',
                  category: 'CI-Category',
                },
              ],
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(purchaseExtraTraits), ...READBACK },
    },

    // ─── RETL / warehouse (mappedToDestination) ───
    // A warehouse-sourced identify: context.mappedToDestination flips the transform to pass traits
    // VERBATIM (raw Braze attribute names, no reserved-key mapping) and derive external_id from
    // context.externalId (adduserIdFromExternalId) rather than a top-level userId. Delivers /users/track
    // attributes; the read-back confirms the verbatim traits landed on the external_id profile.
    {
      id: 'braze-retl-identify',
      description:
        'RETL (mappedToDestination) identify passes traits verbatim and keys the profile by context.externalId',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'retl identify (mappedToDestination)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'retl-identify'),
            type: 'identify',
            context: {
              ...brazeLibraryContext,
              mappedToDestination: true,
              externalId: [{ identifierType: 'external_id', id: ctx.identity('user') }],
              traits: retlSeedTraits(ctx),
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(retlTraits), ...READBACK },
    },

    // ─── remaining recommended-ecommerce event types ───
    // Same ON-flag path as the other ecom scenarios; these cover the event types/mappings not yet
    // exercised (recommended events are send-anyway, so delivery confirms Braze accepts the shape;
    // the marker trait's attributes[] write is the read-back).
    {
      id: 'braze-ecom-checkout-started',
      description: 'Recommended-events: "checkout started" → ecommerce.checkout_started',
      configOverride: (base) => ({ ...base, useEcommerceRecommendedEvents: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'checkout started (ecommerce.checkout_started)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'ecom-checkout'),
            type: 'track',
            event: 'checkout started',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: ecomCheckoutStartedTraits(ctx) },
            properties: {
              checkout_id: `chk-${ctx.runId}`,
              order_id: `ord-${ctx.runId}`,
              total: 42.5,
              currency: 'USD',
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(ecomCheckoutStartedTraits), ...READBACK },
    },
    {
      id: 'braze-ecom-order-refunded',
      description: 'Recommended-events: "order refunded" → ecommerce.order_refunded',
      configOverride: (base) => ({ ...base, useEcommerceRecommendedEvents: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'order refunded (ecommerce.order_refunded)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'ecom-refund'),
            type: 'track',
            event: 'order refunded',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: ecomOrderRefundedTraits(ctx) },
            properties: { order_id: `ord-${ctx.runId}`, total: 42.5, currency: 'USD' },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(ecomOrderRefundedTraits), ...READBACK },
    },
    {
      id: 'braze-ecom-order-cancelled',
      description: 'Recommended-events: "order cancelled" → ecommerce.order_cancelled',
      configOverride: (base) => ({ ...base, useEcommerceRecommendedEvents: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'order cancelled (ecommerce.order_cancelled)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'ecom-cancel'),
            type: 'track',
            event: 'order cancelled',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: ecomOrderCancelledTraits(ctx) },
            properties: {
              order_id: `ord-${ctx.runId}`,
              total: 42.5,
              currency: 'USD',
              cancel_reason: 'ci-test',
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(ecomOrderCancelledTraits), ...READBACK },
    },
    {
      // cart_updated with the REMOVE action (only 'add' was covered).
      id: 'braze-ecom-cart-updated-remove',
      description: 'Recommended-events: "product removed" → ecommerce.cart_updated (remove)',
      configOverride: (base) => ({ ...base, useEcommerceRecommendedEvents: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'product removed (ecommerce.cart_updated, remove)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'ecom-cart-remove'),
            type: 'track',
            event: 'product removed',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: ecomCartRemoveTraits(ctx) },
            properties: {
              cart_id: `cart-${ctx.runId}`,
              currency: 'USD',
              product_id: `sku-${ctx.runId}`,
              name: 'CI Live Product',
              price: 22.49,
              quantity: 1,
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(ecomCartRemoveTraits), ...READBACK },
    },

    // ─── legacy purchase: multiple products + product-level currency + sku fallback ───
    // No top-level currency, 2 products (one keyed by sku, each with its own currency) → exercises
    // getPurchaseObjs' multi-product loop, product-level currency fallback, and product_id||sku.
    {
      id: 'braze-order-completed-multi-product',
      description:
        'order completed with multiple products, product-level currency, and sku fallback',
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'pipeline',
          name: 'order completed (multi-product)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'multi-product'),
            type: 'track',
            event: 'order completed',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: multiProductTraits(ctx) },
            properties: {
              order_id: `ord-${ctx.runId}`,
              products: [
                { product_id: `p1-${ctx.runId}`, price: 10, quantity: 1, currency: 'USD' },
                { sku: `sku2-${ctx.runId}`, price: 5.5, quantity: 2, currency: 'EUR' },
              ],
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(multiProductTraits), ...READBACK },
    },

    // ─── external_id from context.externalId brazeExternalId (no top-level userId) ───
    {
      id: 'braze-identify-braze-external-id',
      description: 'identify resolves external_id from context.externalId brazeExternalId',
      cleanup: (ctx) => deleteUsers(ctx, { externalIds: [ctx.identity('braze-ext')] }),
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify by brazeExternalId',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'braze-ext-id'),
            type: 'identify',
            context: {
              ...brazeLibraryContext,
              externalId: [{ type: 'brazeExternalId', id: ctx.identity('braze-ext') }],
              traits: brazeExternalIdTraits(ctx),
            },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(brazeExternalIdTraits, 'braze-ext'), ...READBACK },
    },

    // ─── supportDedup: EXISTING user (real dedup-reduce branch) ───
    // Setup creates + settles the user; the identify then changes only `tier`, so dedup strips the
    // unchanged name/email and delivers just the change. retries covers the export-lag race in setup.
    {
      id: 'braze-identify-dedup-existing',
      description:
        'identify with supportDedup for an existing user delivers only the changed attribute',
      configOverride: (base) => ({ ...base, supportDedup: true }),
      cleanup: deleteUserByExternalId,
      steps: [
        {
          stepType: 'action',
          name: 'setup: create + settle dedup user',
          run: createDedupUserAndWait,
        },
        {
          stepType: 'pipeline',
          name: 'identify existing (supportDedup reduce)',
          retries: 2,
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'dedup-existing'),
            type: 'identify',
            userId: ctx.identity('user'),
            context: { ...brazeLibraryContext, traits: dedupExistingUpdateTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyProfileByExternalId(dedupExistingUpdateTraits), ...READBACK },
    },

    // ─── per-job delivery mapping: MERGE branch ───
    // The per-job-delivery scenario covers the track branch; this routes an alias merge through the ON
    // path (buildMergeRequest / scopedMetadataForChunk). Delivery-only (merge is async, like
    // braze-alias-merge).
    {
      id: 'braze-per-job-delivery-merge',
      description: 'alias merge under the per-job delivery-mapping flag (ON-path merge branch)',
      cleanup: deleteMergeUsers,
      steps: [
        { stepType: 'action', name: 'setup: create keep + source users', run: createMergeUsers },
        {
          stepType: 'pipeline',
          name: 'alias merge (per-job delivery mapping)',
          destinationOverride: { WorkspaceID: BRAZE_PER_JOB_DELIVERY_TEST_WORKSPACE_ID },
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'pjdm-merge'),
            type: 'alias',
            userId: ctx.identity('user'),
            previousId: ctx.identity('merge-user'),
          }),
        },
      ],
    },

    // ─── integrations.Braze.alias custom alias-label override ───
    // No userId/anonymousId, but a custom alias in integrations → setAliasObject keys the profile by a
    // custom-labelled user_alias. Read back via that custom label.
    {
      id: 'braze-custom-alias-label',
      description:
        'identify with integrations.Braze.alias delivers via a custom-labelled user_alias',
      cleanup: (ctx) =>
        deleteUsers(ctx, {
          userAliases: [
            { alias_name: ctx.identity('custom-alias'), alias_label: CUSTOM_ALIAS_LABEL },
          ],
        }),
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify (custom alias label)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'custom-alias'),
            type: 'identify',
            integrations: {
              All: true,
              Braze: {
                alias: {
                  alias_name: ctx.identity('custom-alias'),
                  alias_label: CUSTOM_ALIAS_LABEL,
                },
              },
            },
            context: { ...brazeLibraryContext, traits: customAliasTraits(ctx) },
          }),
        },
      ],
      verify: {
        check: verifyProfileByAlias('custom-alias', customAliasTraits, CUSTOM_ALIAS_LABEL),
        ...READBACK,
      },
    },
  ],
} satisfies LiveSpec;

export default live;
