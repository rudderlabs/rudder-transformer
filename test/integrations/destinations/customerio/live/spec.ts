import type { LiveSpec, LiveStep, RunContext } from '../../../live/types';
import { cleanupScenario } from './api';
import {
  DEVICE_EVENT_NAME,
  PAGE_EVENT_NAME,
  TRACK_EVENT_NAME,
  aliasTraits,
  deviceContext,
  groupTraits,
  identifyTraits,
  pageProperties,
  recordIdentifiers,
  trackProperties,
} from './profiles';
import { verifyFlagParity, verifyMerge, verifyPersonState, verifyRecordProfile } from './verify';

// The two scenarios below cover the rollout states of the CustomerIO batching framework:
//
//   1. framework on, CUSTOMERIO_EVENT_STREAM_V2_API_ENABLED off (the default) — record events go
//      through the V2 batching path while event-stream events keep their V1 request shape.
//   2. framework on, the flag on — every event type moves to the V2 /v2/batch shape.
//
// Both are selected by env, not by destination.Config, hence `envOverride` on each scenario. The
// seeds are identical in both. Which endpoint a given event type lands on is an implementation
// detail the component suite pins (router/dataEventStreamV1.ts and router/dataV2.ts) — what THIS
// suite asserts is that the resulting state inside CustomerIO is the same either way (see
// verifyFlagParity), which no mocked suite can check.
//
// NOTE: the harness delivers through /v1/destinations/customerio/proxy, whose axios client supplies
// Content-Type itself. Header-level regressions on the outgoing request are therefore NOT observable
// here — the component suite owns those assertions too.

const SCENARIO_V1 = 'customerio-batching-framework-event-stream-v1';
const SCENARIO_V2 = 'customerio-batching-framework-event-stream-v2';

const baseEvent = (ctx: RunContext, suffix: string) => ({
  channel: 'web',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  originalTimestamp: ctx.now(),
  sentAt: ctx.now(),
  integrations: { All: true },
});

// One step list per scenario — the env override is what differs. Parameterised by scenarioId so
// each scenario records its own parity snapshot.
const eventStreamSteps = (scenarioId: string): LiveStep[] => [
  {
    stepType: 'pipeline',
    name: 'identify',
    expectedOutputs: 1,
    expectedProxyRequests: 1,
    seed: (ctx) => ({
      ...baseEvent(ctx, 'identify'),
      type: 'identify',
      userId: ctx.identity('user'),
      traits: identifyTraits(ctx),
    }),
  },
  {
    stepType: 'pipeline',
    name: 'track',
    expectedOutputs: 1,
    expectedProxyRequests: 1,
    seed: (ctx) => ({
      ...baseEvent(ctx, 'track'),
      type: 'track',
      event: TRACK_EVENT_NAME,
      userId: ctx.identity('user'),
      properties: trackProperties(ctx),
    }),
  },
  {
    stepType: 'pipeline',
    name: 'page',
    expectedOutputs: 1,
    expectedProxyRequests: 1,
    seed: (ctx) => ({
      ...baseEvent(ctx, 'page'),
      type: 'page',
      name: PAGE_EVENT_NAME,
      userId: ctx.identity('user'),
      properties: pageProperties(ctx),
    }),
  },
  {
    // `event` (not `name`) is what both paths read for a screen's event name.
    stepType: 'pipeline',
    name: 'screen',
    expectedOutputs: 1,
    expectedProxyRequests: 1,
    seed: (ctx) => ({
      ...baseEvent(ctx, 'screen'),
      type: 'screen',
      event: 'Home',
      userId: ctx.identity('user'),
      properties: pageProperties(ctx),
    }),
  },
  {
    // Group is the one event-stream type that stays on the V2 batch endpoint in both states — it
    // has always written CustomerIO objects through it.
    stepType: 'pipeline',
    name: 'group',
    expectedOutputs: 1,
    expectedProxyRequests: 1,
    seed: (ctx) => ({
      ...baseEvent(ctx, 'group'),
      type: 'group',
      userId: ctx.identity('user'),
      groupId: ctx.identity('group'),
      traits: groupTraits(ctx),
    }),
  },
  {
    stepType: 'pipeline',
    name: 'track with device token',
    expectedOutputs: 1,
    expectedProxyRequests: 1,
    seed: (ctx) => ({
      ...baseEvent(ctx, 'device'),
      type: 'track',
      event: DEVICE_EVENT_NAME,
      userId: ctx.identity('user'),
      context: deviceContext(ctx),
    }),
  },
  {
    // Record events reach CustomerIO only through the batching framework, so this step doubles as
    // the guard that the framework is actually enabled for the scenario: with it off the transform
    // rejects the event and the expectedOutputs assertion fails.
    stepType: 'pipeline',
    name: 'record insert (person)',
    expectedOutputs: 1,
    expectedProxyRequests: 1,
    seed: (ctx) => ({
      type: 'record',
      action: 'insert',
      identifiers: recordIdentifiers(ctx),
    }),
  },
  {
    // Read-backs run here, as steps rather than on the scenario, because the alias step below
    // merges 'user' into 'alias' — after that the profile these assert against no longer exists.
    stepType: 'verify',
    name: 'read back person state (attributes, activities, device, object link)',
    check: verifyPersonState(scenarioId),
  },
  {
    stepType: 'verify',
    name: 'read back record profile',
    check: verifyRecordProfile,
  },
  {
    // CustomerIO's merge keeps the PRIMARY and folds the secondary into it, so the primary has to
    // exist first. Without this step 'alias' is never created, the merge does nothing, and the
    // alias step below asserts nothing beyond a 2xx — which is exactly what the merge read-back
    // caught when it found no 'alias' profile at all.
    stepType: 'pipeline',
    name: 'identify alias target (merge primary)',
    expectedOutputs: 1,
    expectedProxyRequests: 1,
    seed: (ctx) => ({
      ...baseEvent(ctx, 'identify-alias'),
      type: 'identify',
      userId: ctx.identity('alias'),
      traits: aliasTraits(ctx),
    }),
  },
  {
    // Last: the merge collapses the 'user' profile into 'alias', so it must not precede the steps
    // that write to 'user' or the read-backs above.
    stepType: 'pipeline',
    name: 'alias',
    expectedOutputs: 1,
    expectedProxyRequests: 1,
    seed: (ctx) => ({
      ...baseEvent(ctx, 'alias'),
      type: 'alias',
      userId: ctx.identity('alias'),
      previousId: ctx.identity('user'),
    }),
  },
];

export const live: LiveSpec = {
  // Credentials come from the LIVE_SECRET_CUSTOMERIO field on
  // engineering_shared/data/integrations_team/e2e_test/rudder-transformer (single-line LiveSecret
  // JSON). `config` holds the Track API credentials the transform delivers with; `readback` holds
  // the App API key the verify steps read state back with — the Track credentials are write-only:
  //   {"authType":"basic",
  //    "config":{"siteID":"<site-id>","apiKey":"<track-api-key>"},
  //    "readback":{"appApiKey":"<app-api-key>"}}
  // Every run writes to that real workspace — each scenario creates a person, a group object and a
  // record profile, removed best-effort by `cleanup`.
  enabled: true,
  authType: 'basic',
  resolveConfig: (s) => ({ datacenter: 'US', ...s.config }),
  // Record events dispatch on connection.config.destination.object.
  resolveConnection: () => ({ destination: { object: 'person', syncMode: 'upsert' } }),
  scenarios: [
    {
      id: SCENARIO_V1,
      description:
        'batching framework on, event-stream V2 API off — event-stream events deliver in their V1 request shape while record events batch on /v2/batch',
      envOverride: {
        CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL',
        CUSTOMERIO_EVENT_STREAM_V2_API_ENABLED: 'false',
      },
      cleanup: cleanupScenario,
      steps: eventStreamSteps(SCENARIO_V1),
      // Runs after the alias step: the merge is only assertable once it has happened.
      verify: { check: verifyMerge },
    },
    {
      id: SCENARIO_V2,
      description:
        'batching framework on, event-stream V2 API on — every event type delivers through the V2 /v2/batch shape, producing the same CustomerIO state as the V1 shape',
      envOverride: {
        CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL',
        CUSTOMERIO_EVENT_STREAM_V2_API_ENABLED: 'true',
      },
      cleanup: cleanupScenario,
      steps: eventStreamSteps(SCENARIO_V2),
      verify: {
        check: async (ctx) => {
          await verifyMerge(ctx);
          await verifyFlagParity(SCENARIO_V2, SCENARIO_V1)();
        },
      },
    },
  ],
};

export default live;
