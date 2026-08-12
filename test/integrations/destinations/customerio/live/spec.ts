import type { LiveSpec, RunContext } from '../../../live/types';
import { deleteObject, deletePerson, deletePersonById } from './api';
import { createDeviceOwner, createMergeProfiles } from './setup';
import {
  baseEvent,
  customerIoLibraryContext,
  deviceContext,
  emailOnlyEmail,
  emailOnlyTraits,
  emailUserId,
  emailUserIdEventName,
  emailUserIdTraits,
  emailUserIdUpdatedTraits,
  groupId,
  groupTraits,
  identifyTraits,
  objectTypeId,
  pageName,
  retlTraits,
  screenActivityName,
  screenName,
  trackEventName,
} from './profiles';
import {
  verifyActivityNamed,
  verifyDeviceRegistered,
  verifyDeviceRemoved,
  verifyEmailUserIdStaysOneProfile,
  verifyObjectCreatedAndLinked,
  verifyPersonAttributes,
  verifyPersonAttributesByEmail,
  verifyPersonLinkedToObject,
  verifyProfilesMerged,
} from './verify';

// ─── API-version agnostic by construction ───
// CustomerIO has two transform paths in this repo: the legacy per-event Track API v1 routes
// (src/v0/destinations/customerio/transform.ts) and the batching-framework path that sends
// everything to Track API v2 /batch (src/v0/destinations/customerio/routerTransform.ts). Which one
// runs is decided per request by CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS
// (src/constants/batchedDestinationsMap.ts). Check before drawing conclusions from a run: a local
// `.env` sets it, and dotenv is loaded, so a developer machine may well be exercising v2 while CI
// (where the var is unset) exercises v1.
//
// Nothing below is written against either path. Every scenario asserts (a) the real delivery verdict
// and (b) the state CustomerIO's App API reports afterwards, which is identical whichever path did
// the writing. Concretely that means:
//   - no scenario references a v1 endpoint or the v2 batch envelope;
//   - each pipeline step seeds exactly ONE event, so expectedOutputs/expectedProxyRequests of 1/1
//     hold on both paths (multi-event steps are where their batching semantics diverge);
//   - activity read-backs match on the activity NAME, never its `type` — v1 records a screen as an
//     `event` activity while v2 records it as a `screen`.
// So the same suite is the acceptance gate for the v2 rollout — pin the path explicitly rather than
// inheriting whatever the environment happens to set:
//   CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS=  npm run test:live -- --destination=customerio
//   CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS=ALL npm run test:live -- --destination=customerio
// A failure under the second command is a v2 implementation gap, not a test that needs updating.
//
// rETL `record` events are deliberately absent: they exist only on the v2 path (v1 rejects
// `type: record`), so they cannot hold across both. Enroll them once v2 is the live path.
//
// Credentials — LIVE_SECRET_CUSTOMERIO (single-line JSON):
// {"authType":"basic","config":{"siteID":"<site-id>","apiKey":"<track-api-key>"},
//  "readback":{"appApiKey":"<app-api-key>"},"resourceIds":{"objectTypeId":"1"}}
// `config` holds the Track API credentials the transform delivers with; `readback.appApiKey` is a
// separate App API key (bearer) that only the verifies use, and needs read scope for customers,
// activities and objects.

// Retry budget for the scenario-level read-backs. The runner wraps `verify.check` in
// retryUntilPasses(check, { attempts, delayMs }); the checks are single-shot, so this is the ONLY
// backoff layer. 5 attempts (waits 1,2,4,8s → reads at ~0,1,3,7,15s) covers CustomerIO's ingestion
// lag while staying well inside the runner's per-step timeout.
const READBACK = { attempts: 5, delayMs: (n: number) => 1000 * 2 ** n };

// A multi-write sequence settles later than a single write: the final state only appears once every
// event in the chain has been applied in order. One extra attempt (reads at ~0,1,3,7,15,31s) — an
// observed run needed ~19s, past the standard budget's 15s.
const SEQUENCE_READBACK = { attempts: 6, delayMs: (n: number) => 1000 * 2 ** n };

// A group scenario writes both a person and an object; both are torn down.
const deleteGroupPersonAndObject = async (ctx: RunContext): Promise<void> => {
  await deletePersonById(ctx);
  await deleteObject(ctx, objectTypeId(ctx), groupId(ctx));
};

// An alias merge touches two profiles. The secondary is normally absorbed by the merge, but it is
// deleted anyway so a failed run doesn't strand it.
const deleteMergeProfiles = async (ctx: RunContext): Promise<void> => {
  await deletePerson(ctx, ctx.identity('merge-primary'));
  await deletePerson(ctx, ctx.identity('merge-secondary'));
};

export const live = {
  enabled: true,
  authType: 'basic',
  // siteID + apiKey are account-scoped and come from LIVE_SECRET_CUSTOMERIO.config. `datacenter` is
  // left unset: both transform paths default to the US region without it, and the suite targets a US
  // sandbox (api.ts pins the US hosts to match).
  resolveConfig: (s) => ({ ...s.config }),
  scenarios: [
    {
      // identify with a userId → the person is created/updated with the traits as attributes.
      id: 'customerio-identify-userid',
      description: 'Event-stream identify creates a person keyed by userId with its traits',
      cleanup: deletePersonById,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify by userId',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-userid'),
            type: 'identify',
            userId: ctx.identity('user'),
            anonymousId: ctx.identity('anon'),
            context: { ...customerIoLibraryContext, traits: identifyTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyPersonAttributes(identifyTraits), ...READBACK },
    },
    {
      // identify with NO userId: both paths fall back to the email as the person's identifier.
      id: 'customerio-identify-email-only',
      description: 'identify without a userId creates a person keyed by their email',
      cleanup: (ctx) => deletePerson(ctx, emailOnlyEmail(ctx)),
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify by email',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-email-only'),
            type: 'identify',
            context: { ...customerIoLibraryContext, traits: emailOnlyTraits(ctx) },
          }),
        },
      ],
      verify: {
        check: verifyPersonAttributesByEmail(emailOnlyEmail, emailOnlyTraits),
        ...READBACK,
      },
    },
    {
      // A userId that is itself an email address — the person is created from that address alone.
      // Read back by email lookup rather than by id: the two paths file the address under different
      // identifiers (see verifyEmailUserIdStaysOneProfile), so an id lookup would be path-specific.
      id: 'customerio-identify-email-userid',
      description:
        'identify with an email-shaped userId creates the person addressed by that email',
      cleanup: (ctx) => deletePerson(ctx, emailUserId(ctx)),
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify with an email as userId',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-email-userid'),
            type: 'identify',
            userId: emailUserId(ctx),
            context: { ...customerIoLibraryContext, traits: emailUserIdTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyPersonAttributesByEmail(emailUserId, emailUserIdTraits), ...READBACK },
    },
    {
      // track → a named event on the person's activity feed.
      id: 'customerio-track-event',
      description: "A custom track event is delivered and appears on the person's activity feed",
      cleanup: deletePersonById,
      steps: [
        {
          stepType: 'pipeline',
          name: 'track custom event',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'track'),
            type: 'track',
            event: trackEventName(ctx),
            userId: ctx.identity('user'),
            context: { ...customerIoLibraryContext, traits: { email: ctx.email() } },
            properties: { plan: 'enterprise', source: 'live-integration-test' },
          }),
        },
      ],
      verify: { check: verifyActivityNamed(trackEventName), ...READBACK },
    },
    {
      // page → a page activity named after message.name.
      id: 'customerio-page',
      description: 'A page call is delivered as a named page activity',
      cleanup: deletePersonById,
      steps: [
        {
          stepType: 'pipeline',
          name: 'page',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'page'),
            type: 'page',
            name: pageName(ctx),
            userId: ctx.identity('user'),
            context: { ...customerIoLibraryContext, traits: { email: ctx.email() } },
            // No `url` property: the page activity's url must then come from message.name alone,
            // so the read-back can't accidentally match a value the event carried elsewhere.
            properties: { path: '/ci-live', title: 'CI Live Page' },
          }),
        },
      ],
      verify: { check: verifyActivityNamed(pageName), ...READBACK },
    },
    {
      // screen → an activity the transform names `Viewed <event> Screen`. This is the one place the
      // two paths produce a different activity TYPE (v1: event, v2: screen), which is why the
      // read-back matches on name alone.
      id: 'customerio-screen',
      description: 'A screen call is delivered as a "Viewed <name> Screen" activity',
      cleanup: deletePersonById,
      steps: [
        {
          stepType: 'pipeline',
          name: 'screen',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'screen'),
            type: 'screen',
            event: screenName(ctx),
            userId: ctx.identity('user'),
            context: { ...customerIoLibraryContext, traits: { email: ctx.email() } },
            properties: { screen: 'Home' },
          }),
        },
      ],
      verify: { check: verifyActivityNamed(screenActivityName), ...READBACK },
    },
    {
      // An email-shaped userId across a sequence, not just a single call. Every event keys the person
      // by `id` = that email, but a track carries no email of its own — so if any step resolved the
      // identity differently, CustomerIO would fork a second, unmailable profile for the same person.
      // identify → track → identify (updating attributes) is the shortest sequence that would expose
      // that fork, and the read-back asserts a single profile carrying both the event and the update.
      id: 'customerio-email-userid-identity-consistency',
      description:
        'identify → track → identify with an email-shaped userId stays one profile and applies the update',
      cleanup: (ctx) => deletePerson(ctx, emailUserId(ctx)),
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify (create)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'email-userid-create'),
            type: 'identify',
            userId: emailUserId(ctx),
            context: { ...customerIoLibraryContext, traits: emailUserIdTraits(ctx) },
          }),
        },
        {
          stepType: 'pipeline',
          name: 'track (no email of its own)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'email-userid-track'),
            type: 'track',
            event: emailUserIdEventName(ctx),
            userId: emailUserId(ctx),
            context: customerIoLibraryContext,
            properties: { source: 'live-integration-test' },
          }),
        },
        {
          stepType: 'pipeline',
          name: 'identify (update attributes)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'email-userid-update'),
            type: 'identify',
            userId: emailUserId(ctx),
            context: { ...customerIoLibraryContext, traits: emailUserIdUpdatedTraits(ctx) },
          }),
        },
      ],
      verify: {
        check: verifyEmailUserIdStaysOneProfile(
          emailUserId,
          emailUserIdUpdatedTraits,
          emailUserIdEventName,
        ),
        ...SEQUENCE_READBACK,
      },
    },
    {
      // alias → merge the previousId profile into the userId profile. Setup creates both through the
      // Track API (a merge rejects an unknown secondary), so the prerequisite doesn't depend on the
      // path under test. `retries` covers the ingestion race: a merge that 4xxs persists nothing.
      id: 'customerio-alias-merge',
      description: 'An alias call merges the previousId profile into the userId profile',
      cleanup: deleteMergeProfiles,
      steps: [
        {
          stepType: 'action',
          name: 'setup: create primary + secondary profiles',
          run: createMergeProfiles,
        },
        {
          stepType: 'pipeline',
          name: 'alias merge',
          retries: 2,
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'alias-merge'),
            type: 'alias',
            userId: ctx.identity('merge-primary'),
            previousId: ctx.identity('merge-secondary'),
          }),
        },
      ],
      verify: { check: verifyProfilesMerged, ...READBACK },
    },
    {
      // group with the default `identify` action → creates the object with its attributes and
      // relates the person to it.
      id: 'customerio-group-object-identify',
      description: 'A group call creates the object and relates the person to it',
      cleanup: deleteGroupPersonAndObject,
      steps: [
        {
          stepType: 'pipeline',
          name: 'group object identify',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'group-identify'),
            type: 'group',
            userId: ctx.identity('user'),
            groupId: groupId(ctx),
            traits: { ...groupTraits(ctx), action: 'identify' },
          }),
        },
      ],
      verify: { check: verifyObjectCreatedAndLinked(groupTraits), ...READBACK },
    },
    {
      // The other object action worth exercising live: add_relationships only links the person to
      // the object, so the read-back asserts the relationship rather than the object's attributes.
      id: 'customerio-group-add-relationships',
      description: 'A group call with add_relationships links the person to the object',
      cleanup: deleteGroupPersonAndObject,
      steps: [
        {
          stepType: 'pipeline',
          name: 'group add_relationships',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'group-add-rel'),
            type: 'group',
            userId: ctx.identity('user'),
            groupId: groupId(ctx),
            traits: { ...groupTraits(ctx), action: 'add_relationships' },
          }),
        },
      ],
      verify: { check: verifyPersonLinkedToObject(), ...READBACK },
    },
    {
      // The two device routes, in the order they happen in real life. The mid-scenario verify step
      // proves the token was registered before the uninstall removes it — without it, a device-add
      // that silently no-ops would still pass the closing "token is gone" assertion.
      id: 'customerio-device-add-then-delete',
      description:
        'Application Installed registers a device token and Application Uninstalled removes it',
      cleanup: deletePersonById,
      steps: [
        { stepType: 'action', name: 'setup: create the device owner', run: createDeviceOwner },
        {
          stepType: 'pipeline',
          name: 'Application Installed (register device)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'device-add'),
            type: 'track',
            event: 'Application Installed',
            userId: ctx.identity('user'),
            context: deviceContext(ctx),
            properties: { version: '1.0.0' },
          }),
        },
        verifyDeviceRegistered,
        {
          stepType: 'pipeline',
          name: 'Application Uninstalled (remove device)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'device-delete'),
            type: 'track',
            event: 'Application Uninstalled',
            userId: ctx.identity('user'),
            context: deviceContext(ctx),
          }),
        },
      ],
      verify: { check: verifyDeviceRemoved, ...READBACK },
    },
    {
      // RETL / warehouse: context.mappedToDestination makes both paths derive the person's id from
      // context.externalId instead of a top-level userId, and pass the traits through as attributes.
      id: 'customerio-retl-mapped-to-destination',
      description:
        'RETL (mappedToDestination) identify keys the person by context.externalId and writes its traits',
      cleanup: deletePersonById,
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
              ...customerIoLibraryContext,
              mappedToDestination: true,
              externalId: [{ identifierType: 'userId', id: ctx.identity('user') }],
              traits: retlTraits(ctx),
            },
          }),
        },
      ],
      verify: { check: verifyPersonAttributes(retlTraits), ...READBACK },
    },
  ],
} satisfies LiveSpec;

export default live;
