import axios from 'axios';
import { Agent } from 'https';
import { LiveSpec, RunContext } from '../../live/types';

// ─── Vero live spec ───
//
// Vero's Track API (api.getvero.com/api/v2) — the surface this destination writes to — is
// WRITE-ONLY: there is no GET/read-back endpoint for user profiles, tags or subscription state. So
// every scenario here is DELIVERY-ONLY: the pipeline step asserts the real Vero API accepted the
// transformed payload (2xx via /routerTransform -> /proxy), which is the contract we can verify —
// the same shape as the framework's other delivery-only scenarios (e.g. Braze's async merge). No
// scenario declares a `verify` read-back because none is possible against this API.
//
// Setup (action) steps still create real prerequisite users via /users/track so that alias,
// tags/edit and (un)subscribe operate on a real record rather than silently no-oping, and cleanup
// removes created users via /users/delete (best-effort hygiene, not asserted).

// ─── Direct Vero API helpers (setup + cleanup) ───

// Vero's public API base. Matches src/v0/destinations/vero/config.js BASE_URL so the setup/cleanup
// helpers hit the exact host the transform delivers to.
const BASE_URL = 'https://api.getvero.com/api/v2';

// keepAlive:false so setup/cleanup sockets don't linger as open handles when the suite finishes.
const veroAgent = new Agent({ keepAlive: false });
const apiHeaders = { 'Content-Type': 'application/json', Connection: 'close' as const };

// Vero authenticates every call with `auth_token` in the JSON body (see responseBuilderSimple in
// the transform). It's the same account token the transform reads from destination.Config.authToken,
// supplied here via LIVE_SECRET_VERO.config.authToken.
const authToken = (ctx: RunContext): string => {
  const config = (ctx.liveSecret.config ?? {}) as Record<string, unknown>;
  const token = config.authToken as string | undefined;
  if (!token) {
    throw new Error('Vero authToken missing from LIVE_SECRET_VERO.config');
  }
  return token;
};

// POST /users/track — create/update a user profile directly. Vero upserts by `id`, so this both
// seeds prerequisite state (the source user an alias re-identifies, the user a tags/(un)subscribe
// call acts on) and is safe to call for an id that doesn't exist yet.
const createUser = async (
  ctx: RunContext,
  id: string,
  data: Record<string, unknown> = {},
): Promise<void> => {
  await axios.post(
    `${BASE_URL}/users/track`,
    { id, data, auth_token: authToken(ctx) },
    { headers: apiHeaders, httpsAgent: veroAgent, timeout: 15000 },
  );
};

// POST /users/delete — teardown. Best-effort: logs and swallows so one failure can't strand
// sibling cleanups. Vero has no read-back API, so this is fire-and-forget hygiene, not verified.
const deleteUser = async (ctx: RunContext, id: string): Promise<void> => {
  try {
    await axios.post(
      `${BASE_URL}/users/delete`,
      { id, auth_token: authToken(ctx) },
      { headers: apiHeaders, httpsAgent: veroAgent, timeout: 15000 },
    );
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    // eslint-disable-next-line no-console
    console.error(
      `[live:vero] teardown (users/delete) failed${status ? ` (status ${status})` : ''}:`,
      err instanceof Error ? err.message : String(err),
    );
  }
};

// Cleanup for the default single-user scenarios: removes the run's primary user.
const deletePrimaryUser = (ctx: RunContext): Promise<void> => deleteUser(ctx, ctx.identity('user'));

// Cleanup for the anonymous identify scenario: the profile is keyed by the anonymousId.
const deleteAnonymousUser = (ctx: RunContext): Promise<void> =>
  deleteUser(ctx, ctx.identity('anon'));

// Cleanup for the alias scenario: the reidentify re-keys the source (previous) profile to the new
// id, so remove both ids (in parallel) regardless of which one Vero kept.
const deleteAliasUsers = async (ctx: RunContext): Promise<void> => {
  await Promise.all([
    deleteUser(ctx, ctx.identity('user')),
    deleteUser(ctx, ctx.identity('previous')),
  ]);
};

// alias → /users/reidentify re-keys an EXISTING profile from previousId to userId. Seed the source
// (previousId) profile first so the reidentify has a real record to move.
const createAliasSourceUser = (ctx: RunContext): Promise<void> =>
  createUser(ctx, ctx.identity('previous'), { firstName: 'CI-Alias-Source', ciRun: ctx.runId });

// tags/edit, unsubscribe and resubscribe all act on an existing user. Seed the primary user first so
// the operation targets a real profile (Vero would otherwise silently no-op on an unknown id).
const createPrimaryUser = (ctx: RunContext): Promise<void> =>
  createUser(ctx, ctx.identity('user'), { firstName: 'CI-Primary', ciRun: ctx.runId });

// ─── Seed builders ───
// Vero has no read-back API, so these markers aren't asserted against a read — they simply give each
// run a uniquely-valued payload so records are identifiable in the Vero UI and never collide
// (identities are already namespaced by runId).

// The lowercase integrations key the transform reads tags from (getIntegrationsObj(message, 'vero')).
const VERO_INTEGRATION_KEY = 'vero';

// The JS-SDK-style context every seeded event carries (mirrors the component fixtures).
const veroLibraryContext = {
  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
  locale: 'en-GB',
};

// Common envelope fields shared by every seed, built from ctx so each run is isolated.
const baseEvent = (ctx: RunContext, suffix: string) => ({
  channel: 'web',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  originalTimestamp: ctx.now(),
  sentAt: ctx.now(),
  integrations: { All: true },
});

// identify traits. `email` maps to the top-level `email` field (excluded from `data`); every other
// trait lands in `data`.
const identifyTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-Identify',
  ciRun: ctx.runId,
});

// Anonymous identify: keyed by anonymousId, so no top-level email is required, but we still carry one.
const anonymousTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email('anon'),
  firstName: 'CI-Anon',
  ciRun: ctx.runId,
});

// Push-channel identify: the transform builds `channels` from context.os.name (platform) +
// context.device.token (address) + context.device.name (device). Both platform and address must be
// present or the transform drops the whole channels block.
const pushChannelContext = (ctx: RunContext) => ({
  ...veroLibraryContext,
  traits: { email: ctx.email(), firstName: 'CI-Push', ciRun: ctx.runId },
  os: { name: 'android' },
  device: { token: `tok-${ctx.runId}`, name: 'Pixel-CI' },
});

// track / page / screen properties → mapped to `data` on /events/track.
const trackProperties = (ctx: RunContext): Record<string, unknown> => ({
  plan: 'enterprise',
  source: 'live-integration-test',
  ciRun: ctx.runId,
});
const pageProperties = (ctx: RunContext): Record<string, unknown> => ({
  path: '/home',
  title: 'Home',
  ciRun: ctx.runId,
});

// Tag names are run-unique so parallel/re-run tag edits don't step on each other.
const tagsToAdd = (ctx: RunContext): string[] => [`ci-add-${ctx.runId}`];
const tagsToRemove = (ctx: RunContext): string[] => [`ci-remove-${ctx.runId}`];

// integrations block that carries the tag add/remove instruction the transform reads.
const veroTagsIntegration = (
  ctx: RunContext,
  opts: { add?: boolean; remove?: boolean } = { add: true },
) => ({
  All: true,
  [VERO_INTEGRATION_KEY]: {
    tags: {
      ...(opts.add ? { add: tagsToAdd(ctx) } : {}),
      ...(opts.remove ? { remove: tagsToRemove(ctx) } : {}),
    },
  },
});

// ─── Spec ───

export const live: LiveSpec = {
  enabled: true,
  authType: 'apiKey',
  // authToken is the only account-scoped credential; it comes from LIVE_SECRET_VERO.config and is
  // merged into destination.Config, where the transform reads it (Config.authToken).
  resolveConfig: (s) => ({ ...s.config }),
  scenarios: [
    // ─── identify → /users/track ───
    {
      id: 'vero-identify',
      description: 'A basic identify creates/updates a Vero user profile via /users/track',
      cleanup: deletePrimaryUser,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify by userId',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify'),
            type: 'identify',
            userId: ctx.identity('user'),
            context: { ...veroLibraryContext, traits: identifyTraits(ctx) },
          }),
        },
      ],
    },
    {
      // No userId → the transform keys the profile by anonymousId (id = anonymousId).
      id: 'vero-identify-anonymous',
      description: 'An anonymous identify keys the /users/track profile by anonymousId',
      cleanup: deleteAnonymousUser,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify by anonymousId',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-anon'),
            type: 'identify',
            anonymousId: ctx.identity('anon'),
            context: { ...veroLibraryContext, traits: anonymousTraits(ctx) },
          }),
        },
      ],
    },
    {
      // context.os.name + context.device.token/name → the transform attaches a push `channels`
      // block (platform/address/device/type). Exercises the channels branch of the identify path.
      id: 'vero-identify-push-channels',
      description: 'identify with os + device info delivers a push channels block on /users/track',
      cleanup: deletePrimaryUser,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify with push channels',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-push'),
            type: 'identify',
            userId: ctx.identity('user'),
            context: pushChannelContext(ctx),
          }),
        },
      ],
    },
    {
      // dontBatch=true — the proxy-request count is pinned so a batching regression that
      // collapses/fans out delivery is caught even though it still 2xxs.
      id: 'vero-identify-dontbatch',
      description: 'identify with dontBatch=true delivers un-batched (single proxy request)',
      cleanup: deletePrimaryUser,
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
            context: { ...veroLibraryContext, traits: identifyTraits(ctx) },
          }),
        },
      ],
    },

    // ─── identify + tags → /users/track AND /users/tags/edit ───
    // integrations.vero.tags appends a second request (tags/edit) to the identify output. One router
    // output carries a 2-entry batchedRequest, so expect 1 output / 2 proxy requests — a regression
    // dropping the tags call is exactly what the pinned count catches.
    {
      id: 'vero-identify-with-tags',
      description: 'identify with integrations.vero.tags.add fires /users/track + /users/tags/edit',
      cleanup: deletePrimaryUser,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify + tag add',
          expectedOutputs: 1,
          expectedProxyRequests: 2,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-tags-add'),
            type: 'identify',
            userId: ctx.identity('user'),
            integrations: veroTagsIntegration(ctx, { add: true }),
            context: { ...veroLibraryContext, traits: identifyTraits(ctx) },
          }),
        },
      ],
    },
    {
      // Both add and remove present → a single tags/edit carrying both lists.
      id: 'vero-identify-tags-add-remove',
      description: 'identify with tags add + remove delivers a combined /users/tags/edit',
      cleanup: deletePrimaryUser,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify + tag add/remove',
          expectedOutputs: 1,
          expectedProxyRequests: 2,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-tags-add-remove'),
            type: 'identify',
            userId: ctx.identity('user'),
            integrations: veroTagsIntegration(ctx, { add: true, remove: true }),
            context: { ...veroLibraryContext, traits: identifyTraits(ctx) },
          }),
        },
      ],
    },

    // ─── track → /events/track ───
    {
      id: 'vero-track',
      description: 'A custom track event is delivered to Vero via /events/track',
      cleanup: deletePrimaryUser,
      steps: [
        {
          stepType: 'pipeline',
          name: 'track custom event',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'track'),
            type: 'track',
            event: 'CI Live Event',
            userId: ctx.identity('user'),
            context: veroLibraryContext,
            properties: trackProperties(ctx),
          }),
        },
      ],
    },
    {
      // track + tags → /events/track + /users/tags/edit. Seed the user first so the tags edit acts
      // on a real profile.
      id: 'vero-track-with-tags',
      description:
        'A track event with integrations.vero.tags fires /events/track + /users/tags/edit',
      cleanup: deletePrimaryUser,
      steps: [
        { stepType: 'action', name: 'setup: create user', run: createPrimaryUser },
        {
          stepType: 'pipeline',
          name: 'track + tag add',
          expectedOutputs: 1,
          expectedProxyRequests: 2,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'track-tags'),
            type: 'track',
            event: 'CI Live Event Tagged',
            userId: ctx.identity('user'),
            integrations: veroTagsIntegration(ctx, { add: true }),
            context: veroLibraryContext,
            properties: trackProperties(ctx),
          }),
        },
      ],
    },

    // ─── page / screen → /events/track (event name derived by the transform) ───
    {
      id: 'vero-page',
      description: 'A page call is delivered to Vero as a "Viewed <name> Page" event',
      cleanup: deletePrimaryUser,
      steps: [
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
            context: veroLibraryContext,
            properties: pageProperties(ctx),
          }),
        },
      ],
    },
    {
      id: 'vero-screen',
      description: 'A screen call is delivered to Vero as a "Viewed <name> Screen" event',
      cleanup: deletePrimaryUser,
      steps: [
        {
          stepType: 'pipeline',
          name: 'screen',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'screen'),
            type: 'screen',
            name: 'Home',
            userId: ctx.identity('user'),
            context: veroLibraryContext,
            properties: pageProperties(ctx),
          }),
        },
      ],
    },

    // ─── alias → /users/reidentify ───
    // Setup creates the source (previousId) profile; the alias re-keys it to the new userId.
    {
      id: 'vero-alias',
      description:
        'An alias re-identifies an existing user (previousId → userId) via /users/reidentify',
      cleanup: deleteAliasUsers,
      steps: [
        { stepType: 'action', name: 'setup: create source user', run: createAliasSourceUser },
        {
          stepType: 'pipeline',
          name: 'alias reidentify',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'alias'),
            type: 'alias',
            userId: ctx.identity('user'),
            previousId: ctx.identity('previous'),
          }),
        },
      ],
    },

    // ─── track "unsubscribe" / "resubscribe" → dedicated endpoints ───
    // The transform special-cases these event names ahead of the generic track path. Seed the user
    // first so the (un)subscribe acts on a real profile.
    {
      id: 'vero-unsubscribe',
      description: 'A track event named "unsubscribe" is delivered to /users/unsubscribe',
      cleanup: deletePrimaryUser,
      steps: [
        { stepType: 'action', name: 'setup: create user', run: createPrimaryUser },
        {
          stepType: 'pipeline',
          name: 'unsubscribe',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'unsubscribe'),
            type: 'track',
            event: 'unsubscribe',
            userId: ctx.identity('user'),
          }),
        },
      ],
    },
    {
      id: 'vero-resubscribe',
      description: 'A track event named "resubscribe" is delivered to /users/resubscribe',
      cleanup: deletePrimaryUser,
      steps: [
        { stepType: 'action', name: 'setup: create user', run: createPrimaryUser },
        {
          stepType: 'pipeline',
          name: 'resubscribe',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'resubscribe'),
            type: 'track',
            event: 'resubscribe',
            userId: ctx.identity('user'),
          }),
        },
      ],
    },
  ],
};

export default live;
