import axios from 'axios';
import { Agent } from 'https';
import { LiveSpec, RunContext } from '../../live/types';

const BASE_URL = 'https://api.getvero.com/api/v2';
const veroAgent = new Agent({ keepAlive: false });
const apiHeaders = { 'Content-Type': 'application/json', Connection: 'close' as const };

// Same account token the transform reads from destination.Config.authToken; Vero sends it in-body.
const authToken = (ctx: RunContext): string => {
  const config = (ctx.liveSecret.config ?? {}) as Record<string, unknown>;
  const token = config.authToken as string | undefined;
  if (!token) {
    throw new Error('Vero authToken missing from LIVE_SECRET_VERO.config');
  }
  return token;
};

// Vero upserts by `id`, so this seeds prerequisite state and is safe for an id that doesn't exist yet.
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

// Best-effort teardown: logs and swallows so one failure can't strand sibling cleanups.
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

const deletePrimaryUser = (ctx: RunContext): Promise<void> => deleteUser(ctx, ctx.identity('user'));
const deleteAnonymousUser = (ctx: RunContext): Promise<void> =>
  deleteUser(ctx, ctx.identity('anon'));

// reidentify re-keys the source profile to the new id, so remove both ids.
const deleteAliasUsers = async (ctx: RunContext): Promise<void> => {
  await Promise.all([
    deleteUser(ctx, ctx.identity('user')),
    deleteUser(ctx, ctx.identity('previous')),
  ]);
};

const createAliasSourceUser = (ctx: RunContext): Promise<void> =>
  createUser(ctx, ctx.identity('previous'), { firstName: 'CI-Alias-Source', ciRun: ctx.runId });

const createPrimaryUser = (ctx: RunContext): Promise<void> =>
  createUser(ctx, ctx.identity('user'), { firstName: 'CI-Primary', ciRun: ctx.runId });

const VERO_INTEGRATION_KEY = 'vero';

const veroLibraryContext = {
  library: { name: 'RudderLabs JavaScript SDK', version: '1.0.5' },
  locale: 'en-GB',
};

const baseEvent = (ctx: RunContext, suffix: string) => ({
  channel: 'web',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  originalTimestamp: ctx.now(),
  sentAt: ctx.now(),
  integrations: { All: true },
});

// `email` maps to the top-level `email` field (excluded from `data`); other traits land in `data`.
const identifyTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-Identify',
  ciRun: ctx.runId,
});

const anonymousTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email('anon'),
  firstName: 'CI-Anon',
  ciRun: ctx.runId,
});

// The transform drops the whole `channels` block unless both platform (os.name) and address
// (device.token) are present.
const pushChannelContext = (ctx: RunContext) => ({
  ...veroLibraryContext,
  traits: { email: ctx.email(), firstName: 'CI-Push', ciRun: ctx.runId },
  os: { name: 'android' },
  device: { token: `tok-${ctx.runId}`, name: 'Pixel-CI' },
});

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

const tagsToAdd = (ctx: RunContext): string[] => [`ci-add-${ctx.runId}`];
const tagsToRemove = (ctx: RunContext): string[] => [`ci-remove-${ctx.runId}`];

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

export const live: LiveSpec = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (s) => ({ ...s.config }),
  scenarios: [
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
      // Pinned proxy count catches a batching regression that still 2xxs.
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
    {
      // tags append a second request (tags/edit) → 1 output, 2 proxy requests. The pinned count
      // catches a regression that drops the tags call.
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
