import type { LiveSpec, RunContext } from '../../../live/types';
import {
  IntercomContact,
  createContact,
  deleteRunCompany,
  deleteRunContacts,
  getContactCompanies,
  pollContact,
  searchContacts,
} from './api';

// Intercom 2.10 rejects custom attributes the workspace has not defined, and the v2 transform turns
// every non-reserved trait into one. Seeds therefore carry only reserved fields (email, name, and
// the company's name/plan/industry/website); the run id travels inside the names instead.

const READBACK = {
  attempts: 6,
  delayMs: (attempt: number) => Math.min(1000 * 2 ** attempt, 8000),
};

// A setup-created contact must be searchable before the transform runs its create-vs-update search,
// otherwise the event is routed to a create and 409s on the duplicate. A failed attempt persists
// nothing, so the retry is safe.
const SEARCH_RACE = { retries: 3, delayBeforeMs: 3000 };

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
const updateProfile = (ctx: RunContext) => ({ email: ctx.email(), name: `CI Update ${ctx.runId}` });
const retlProfile = (ctx: RunContext) => ({ name: `CI rETL ${ctx.runId}` });
const companyProfile = (ctx: RunContext) => ({
  name: `CI Company ${ctx.runId}`,
  plan: 'enterprise',
  industry: 'Software',
  website: 'https://www.rudderstack.com',
});

const createRunContact = async (ctx: RunContext): Promise<void> => {
  await createContact(ctx, {
    email: ctx.email(),
    external_id: ctx.identity('user'),
    name: `CI Setup ${ctx.runId}`,
  });
  const contact = await pollContact(ctx, 'external_id', ctx.identity('user'));
  if (!contact) {
    throw new Error('[live:intercom] setup contact never became searchable');
  }
};

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

const verifyCompanyAttached = async (ctx: RunContext): Promise<void> => {
  const [contact] = await searchContacts(ctx, 'external_id', ctx.identity('user'));
  expect(contact).toBeDefined();
  const companies = await getContactCompanies(ctx, (contact as IntercomContact).id);
  expect(companies).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        company_id: ctx.identity('company'),
        name: companyProfile(ctx).name,
      }),
    ]),
  );
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
      id: 'intercom-v2-identify-update',
      description: 'A v2 identify for an existing contact updates it (PUT /contacts/<id>)',
      cleanup: deleteRunContacts,
      steps: [
        { stepType: 'action', name: 'setup: create contact', run: createRunContact },
        {
          stepType: 'pipeline',
          name: 'identify update',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          ...SEARCH_RACE,
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
        { stepType: 'action', name: 'setup: create contact', run: createRunContact },
        {
          stepType: 'pipeline',
          name: 'track',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          ...SEARCH_RACE,
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
    {
      id: 'intercom-v2-group',
      description: 'A v2 group upserts the company and attaches it to the existing contact',
      cleanup: async (ctx) => {
        await deleteRunCompany(ctx);
        await deleteRunContacts(ctx);
      },
      steps: [
        { stepType: 'action', name: 'setup: create contact', run: createRunContact },
        {
          stepType: 'pipeline',
          name: 'group',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          ...SEARCH_RACE,
          seed: (ctx) => ({
            ...baseEvent(ctx, 'group'),
            type: 'group',
            userId: ctx.identity('user'),
            groupId: ctx.identity('company'),
            traits: companyProfile(ctx),
          }),
        },
      ],
      verify: { check: verifyCompanyAttached, ...READBACK },
    },
  ],
} satisfies LiveSpec;

export default live;
