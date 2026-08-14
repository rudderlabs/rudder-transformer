import axios from 'axios';
import { Agent } from 'https';
import { LiveSpec, LiveStep, RunContext } from '../../live/types';

// The two scenarios below cover the rollout states of the CustomerIO batching framework:
//
//   1. framework on, CUSTOMERIO_EVENT_STREAM_V2_API_ENABLED off (the default) — record events go
//      through the V2 batching path while event-stream events keep their V1 request shape.
//   2. framework on, the flag on — every event type moves to the V2 /v2/batch shape.
//
// Both are selected by env, not by destination.Config, hence `envOverride` on each scenario. The
// seeds are identical in both: what each scenario asserts is that the real API accepts whatever
// shape that state produces. Which endpoint a given event type lands on is an implementation detail
// the component suite pins (router/dataEventStreamV1.ts and router/dataV2.ts) — not this suite.
//
// NOTE: the harness delivers through /v1/destinations/customerio/proxy, whose axios client supplies
// Content-Type itself. Header-level regressions on the outgoing request are therefore NOT observable
// here — the component suite owns those assertions too.

const TRACK_BASE_URL = 'https://track.customer.io/api';
const cioAgent = new Agent({ keepAlive: false });

// Same Basic credentials the transform derives from destination.Config.
const authHeader = (ctx: RunContext): string => {
  const config = (ctx.liveSecret.config ?? {}) as Record<string, unknown>;
  const siteID = config.siteID as string | undefined;
  const apiKey = config.apiKey as string | undefined;
  if (!siteID || !apiKey) {
    throw new Error('siteID/apiKey missing from LIVE_SECRET_CUSTOMERIO.config');
  }
  return `Basic ${Buffer.from(`${siteID}:${apiKey}`).toString('base64')}`;
};

// Best-effort teardown: logs and swallows so one failure can't strand sibling cleanups.
const swallow = (what: string, err: unknown): void => {
  const status = (err as { response?: { status?: number } })?.response?.status;
  // eslint-disable-next-line no-console
  console.error(
    `[live:customerio] teardown (${what}) failed${status ? ` (status ${status})` : ''}:`,
    err instanceof Error ? err.message : String(err),
  );
};

const deletePerson = async (ctx: RunContext, id: string): Promise<void> => {
  try {
    await axios.delete(`${TRACK_BASE_URL}/v1/customers/${encodeURIComponent(id)}`, {
      headers: { Authorization: authHeader(ctx) },
      httpsAgent: cioAgent,
      timeout: 15000,
    });
  } catch (err) {
    swallow(`delete customer ${id}`, err);
  }
};

// Objects (groups) are removed through the same batch endpoint the transform writes them with.
const deleteObject = async (ctx: RunContext, objectId: string): Promise<void> => {
  try {
    await axios.post(
      `${TRACK_BASE_URL}/v2/batch`,
      {
        batch: [
          {
            type: 'object',
            action: 'delete',
            identifiers: { object_id: objectId, object_type_id: '1' },
          },
        ],
      },
      {
        headers: { Authorization: authHeader(ctx), 'Content-Type': 'application/json' },
        httpsAgent: cioAgent,
        timeout: 15000,
      },
    );
  } catch (err) {
    swallow(`delete object ${objectId}`, err);
  }
};

// Every identity a scenario touches: the alias step merges 'user' into 'alias', so both ids can
// outlive the run, as can the record profile and the group object.
const cleanupScenario = async (ctx: RunContext): Promise<void> => {
  await Promise.all([
    deletePerson(ctx, ctx.identity('user')),
    deletePerson(ctx, ctx.identity('alias')),
    deletePerson(ctx, ctx.identity('record')),
    deleteObject(ctx, ctx.identity('group')),
  ]);
};

const baseEvent = (ctx: RunContext, suffix: string) => ({
  channel: 'web',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  originalTimestamp: ctx.now(),
  sentAt: ctx.now(),
  integrations: { All: true },
});

const identifyTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-Identify',
  ciRun: ctx.runId,
});

const trackProperties = (ctx: RunContext): Record<string, unknown> => ({
  plan: 'enterprise',
  revenue: 42,
  ciRun: ctx.runId,
});

const pageProperties = (ctx: RunContext): Record<string, unknown> => ({
  url: 'https://www.rudderstack.com/live',
  title: 'Home',
  ciRun: ctx.runId,
});

// The transform only registers a device when the event name is device-related AND
// context.device.token is present (see isdeviceRelatedEventName / deviceActionFor).
const deviceContext = (ctx: RunContext) => ({
  device: { token: `tok-${ctx.runId}`, type: 'ios' },
  os: { name: 'iOS', version: '17.0' },
});

// One step per event type, shared by both scenarios — the env override is what differs.
const eventStreamSteps: LiveStep[] = [
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
      event: 'CI Live Order Completed',
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
      name: 'Home',
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
      traits: { name: 'CI Live Account', plan: 'enterprise', ciRun: ctx.runId },
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
      event: 'Application Installed',
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
      identifiers: { id: ctx.identity('record'), email: ctx.email('record'), ciRun: ctx.runId },
    }),
  },
  {
    // Last: the merge collapses the 'user' profile into 'alias', so it must not precede the steps
    // that write to 'user'.
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
  // Parked until the credential exists in Vault. The CI matrix is built from every
  // destinations/*/live.ts, and the workflow's vault-action step imports LIVE_SECRET_CUSTOMERIO
  // from engineering_shared/data/integrations_team/e2e_test/rudder-transformer — with the field
  // absent that step fails, so flipping this to true before the secret lands reds the
  // `live (customerio)` job on every PR to develop/main. Add the field (single-line LiveSecret
  // JSON: {"authType":"basic","config":{"siteID":"<site-id>","apiKey":"<track-api-key>"}}), then
  // set this to true. Verified green locally against a real account — see the PR description.
  enabled: false,
  authType: 'basic',
  resolveConfig: (s) => ({ datacenter: 'US', ...s.config }),
  // Record events dispatch on connection.config.destination.object.
  resolveConnection: () => ({ destination: { object: 'person', syncMode: 'upsert' } }),
  scenarios: [
    {
      id: 'customerio-batching-framework-event-stream-v1',
      description:
        'batching framework on, event-stream V2 API off — event-stream events deliver in their V1 request shape while record events batch on /v2/batch',
      envOverride: {
        CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL',
        CUSTOMERIO_EVENT_STREAM_V2_API_ENABLED: 'false',
      },
      cleanup: cleanupScenario,
      steps: eventStreamSteps,
    },
    {
      id: 'customerio-batching-framework-event-stream-v2',
      description:
        'batching framework on, event-stream V2 API on — every event type delivers through the V2 /v2/batch shape',
      envOverride: {
        CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL',
        CUSTOMERIO_EVENT_STREAM_V2_API_ENABLED: 'true',
      },
      cleanup: cleanupScenario,
      steps: eventStreamSteps,
    },
  ],
};

export default live;
