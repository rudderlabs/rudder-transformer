import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';
import type { LiveSpec, RunContext } from '../../../live/types';
import {
  IntercomContact,
  createContact,
  deleteRunContacts,
  searchContacts,
  searchContactsAsTransform,
} from './api';

// Intercom 2.10 rejects custom attributes the workspace has not defined, and the v2 transform turns
// every non-reserved trait into one. Seeds therefore carry only reserved fields (email, name); the
// run id travels inside the names instead.

const READBACK = {
  attempts: 6,
  delayMs: (attempt: number) => Math.min(1000 * 2 ** attempt, 8000),
};

const baseEvent = (ctx: RunContext, suffix: string) => ({
  channel: 'web',
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  originalTimestamp: ctx.now(),
  sentAt: ctx.now(),
  integrations: { All: true },
});

// Shared by the seeds and the read-backs so the asserted values cannot drift from what was sent.
const createProfile = (ctx: RunContext) => ({ email: ctx.email(), name: `CI Create ${ctx.runId}` });
// No email: the update is matched by userId, so the transform's search is the single external_id
// lookup that setup waits on (with an email it would search email OR external_id instead).
const updateProfile = (ctx: RunContext) => ({ name: `CI Update ${ctx.runId}` });
const retlProfile = (ctx: RunContext) => ({ name: `CI rETL ${ctx.runId}` });
const emailOnlyProfile = (ctx: RunContext) => ({
  email: ctx.email(),
  name: `CI Email Only ${ctx.runId}`,
});
const STABLE_SEARCH_HITS = 2;

const createRunContact = (ctx: RunContext): Promise<string> =>
  createContact(ctx, {
    email: ctx.email(),
    external_id: ctx.identity('user'),
    name: `CI Setup ${ctx.runId}`,
  });

// For identify update: the transform searches by external_id before choosing update vs create, so
// wait until its own query finds the setup contact, otherwise the update is routed to a create and
// Intercom answers 409. The transform always sends a compound query, which can take ~30-100s to see
// a new contact (a simple single-field query sees it within seconds), so poll with that exact shape
// and require consecutive hits, as results can flip right after the index catches up.
const createSearchableContact = async (ctx: RunContext): Promise<void> => {
  const contactId = await createRunContact(ctx);
  let consecutiveHits = 0;
  await pollUntil(
    async () => {
      const contacts = await searchContactsAsTransform(ctx, 'external_id', ctx.identity('user'));
      consecutiveHits = contacts.some((c) => c.id === contactId) ? consecutiveHits + 1 : 0;
      return { done: consecutiveHits >= STABLE_SEARCH_HITS, value: contacts };
    },
    {
      label: `intercom contact via the transform's search (${STABLE_SEARCH_HITS} consecutive hits)`,
      attempts: 45,
      delayMs: () => 4000,
    },
  );
};

// Waiting on the transform's compound search can take well over the default 120s step timeout.
const setupSearchableContactStep = {
  stepType: 'action',
  name: 'setup: create contact and wait until the transform can find it',
  run: createSearchableContact,
  timeoutMs: 240000,
} as const;

// Read-backs search once per attempt: the scenario-level `verify` already retries with READBACK backoff.
const verifyContact =
  (
    field: 'email' | 'external_id',
    value: (ctx: RunContext) => string,
    expected: (ctx: RunContext) => Partial<IntercomContact>,
  ) =>
  async (ctx: RunContext): Promise<void> => {
    const [contact] = await searchContacts(ctx, field, value(ctx));
    expect(contact).toBeDefined();
    expect(contact).toMatchObject(expected(ctx));
  };

const retlIdentify = (
  ctx: RunContext,
  identifierType: 'user_id' | 'external_id',
  suffix: string,
) => ({
  ...baseEvent(ctx, suffix),
  type: 'identify',
  context: {
    mappedToDestination: 'true',
    externalId: [{ id: ctx.identity('user'), type: 'INTERCOM-customer', identifierType }],
  },
  traits: { ...retlProfile(ctx), email: null },
});

export const live = {
  enabled: true,
  authType: 'apiKey',
  // Non-secret defaults from the component suite; the access token (and region, if not US) come
  // from LIVE_SECRET_INTERCOM.config.
  resolveConfig: (s) => ({
    apiVersion: 'v2',
    apiServer: 'standard',
    sendAnonymousId: false,
    updateLastRequestAt: true,
    ...s.config,
  }),
  scenarios: [
    {
      id: 'intercom-v2-identify-create',
      description: 'A v2 identify for an unknown email creates a contact (POST /contacts)',
      cleanup: deleteRunContacts,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify create',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-create'),
            type: 'identify',
            userId: ctx.identity('user'),
            context: { traits: createProfile(ctx) },
          }),
        },
      ],
      verify: {
        check: verifyContact(
          'email',
          (ctx) => ctx.email(),
          (ctx) => ({ ...createProfile(ctx), external_id: ctx.identity('user') }),
        ),
        ...READBACK,
      },
    },
    {
      id: 'intercom-v2-identify-anonymous-id',
      description:
        'A v2 identify with an email but no userId, with sendAnonymousId on, creates the contact with anonymousId as external_id',
      configOverride: (base) => ({ ...base, sendAnonymousId: true }),
      cleanup: deleteRunContacts,
      steps: [
        {
          stepType: 'pipeline',
          name: 'identify with anonymousId as external_id',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-anonymous-id'),
            type: 'identify',
            anonymousId: ctx.identity('anon'),
            context: { traits: emailOnlyProfile(ctx) },
          }),
        },
      ],
      verify: {
        check: verifyContact(
          'email',
          (ctx) => ctx.email(),
          (ctx) => ({ ...emailOnlyProfile(ctx), external_id: ctx.identity('anon') }),
        ),
        ...READBACK,
      },
    },
    {
      id: 'intercom-v2-retl-email',
      description:
        'A v2 rETL identify mapped by email creates the contact by email without external_id',
      cleanup: deleteRunContacts,
      steps: [
        {
          stepType: 'pipeline',
          name: 'rETL identify (email)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'retl-email'),
            type: 'identify',
            context: {
              mappedToDestination: 'true',
              externalId: [{ id: ctx.email(), type: 'INTERCOM-customer', identifierType: 'email' }],
            },
            traits: { name: emailOnlyProfile(ctx).name },
          }),
        },
      ],
      verify: {
        check: verifyContact(
          'email',
          (ctx) => ctx.email(),
          (ctx) => ({ ...emailOnlyProfile(ctx), external_id: null }),
        ),
        ...READBACK,
      },
    },
    {
      id: 'intercom-v2-identify-update',
      description: 'A v2 identify for an existing contact updates it (PUT /contacts/<id>)',
      cleanup: deleteRunContacts,
      steps: [
        setupSearchableContactStep,
        {
          stepType: 'pipeline',
          name: 'identify update',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          // Setup waited for stable search hits, but a later search can still miss and route the
          // update to a create (409). That attempt persists nothing, so retrying is safe.
          retries: 4,
          delayBeforeMs: 3000,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'identify-update'),
            type: 'identify',
            userId: ctx.identity('user'),
            context: { traits: updateProfile(ctx) },
          }),
        },
      ],
      verify: {
        check: verifyContact(
          'external_id',
          (ctx) => ctx.identity('user'),
          (ctx) => updateProfile(ctx),
        ),
        ...READBACK,
      },
    },
    {
      id: 'intercom-v2-retl-user-id',
      description:
        'A v2 rETL identify mapped by user_id without email creates the contact by external_id',
      cleanup: deleteRunContacts,
      steps: [
        {
          stepType: 'pipeline',
          name: 'rETL identify (user_id)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => retlIdentify(ctx, 'user_id', 'retl-user-id'),
        },
      ],
      verify: {
        check: verifyContact(
          'external_id',
          (ctx) => ctx.identity('user'),
          (ctx) => retlProfile(ctx),
        ),
        ...READBACK,
      },
    },
    {
      // INT-7442: an identifier mapped as external_id (no user_id trait) must survive when email is absent.
      id: 'intercom-v2-retl-external-id',
      description:
        'A v2 rETL identify mapped by external_id without email creates the contact by external_id',
      cleanup: deleteRunContacts,
      steps: [
        {
          stepType: 'pipeline',
          name: 'rETL identify (external_id)',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => retlIdentify(ctx, 'external_id', 'retl-external-id'),
        },
      ],
      verify: {
        check: verifyContact(
          'external_id',
          (ctx) => ctx.identity('user'),
          (ctx) => retlProfile(ctx),
        ),
        ...READBACK,
      },
    },
    {
      id: 'intercom-v2-track',
      description: 'A v2 track for an existing contact is delivered as a data event (POST /events)',
      cleanup: deleteRunContacts,
      steps: [
        // The track transform does not search; Intercom's events API only needs the contact to exist.
        {
          stepType: 'action',
          name: 'setup: create contact',
          run: async (ctx) => {
            await createRunContact(ctx);
          },
        },
        {
          stepType: 'pipeline',
          name: 'track',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'track'),
            type: 'track',
            event: 'CI Live Event',
            userId: ctx.identity('user'),
            context: { traits: { email: ctx.email() } },
            properties: { plan: 'enterprise', source: 'live-integration-test' },
          }),
        },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;
