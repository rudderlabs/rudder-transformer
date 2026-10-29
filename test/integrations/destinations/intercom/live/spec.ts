import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';
import type { LiveSpec, RunContext } from '../../../live/types';
import {
  IntercomContact,
  createContact,
  deleteRunCompany,
  deleteRunContacts,
  getContactCompanies,
  searchContacts,
} from './api';

// Intercom 2.10 rejects custom attributes the workspace has not defined, and the v2 transform turns
// every non-reserved trait into one. Seeds therefore carry only reserved fields (email, name, and
// the company's name/plan/industry/website); the run id travels inside the names instead.

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
// No email: the update is matched by userId (external_id), so the transform's search stays on the
// fast external_id index instead of the slow email OR external_id query.
const updateProfile = (ctx: RunContext) => ({ name: `CI Update ${ctx.runId}` });
const retlProfile = (ctx: RunContext) => ({ name: `CI rETL ${ctx.runId}` });
const emailOnlyProfile = (ctx: RunContext) => ({
  email: ctx.email(),
  name: `CI Email Only ${ctx.runId}`,
});
const companyProfile = (ctx: RunContext) => ({
  name: `CI Company ${ctx.runId}`,
  plan: 'enterprise',
  industry: 'Software',
  website: 'https://www.rudderstack.com',
});

const createRunContact = async (ctx: RunContext): Promise<void> => {
  const contactId = await createContact(ctx, {
    email: ctx.email(),
    external_id: ctx.identity('user'),
    name: `CI Setup ${ctx.runId}`,
  });
  // The steps that follow setup make the transform search by external_id only (group traits and the
  // update event carry no email; track does not search). Wait until that search finds the contact,
  // otherwise identify is routed to a create (Intercom answers 409) and group to a company-only upsert.
  // A new contact is searchable by external_id within seconds; an email OR external_id search can take
  // well over a minute, which is why the setup-backed events carry no email.
  await pollUntil(
    async () => {
      const contacts = await searchContacts(ctx, 'external_id', ctx.identity('user'));
      return { done: contacts.some((c) => c.id === contactId), value: contacts };
    },
    {
      label: 'intercom contact by external_id',
      attempts: 8,
      delayMs: (n) => Math.min(1000 * 2 ** n, 8000),
    },
  );
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
        { stepType: 'action', name: 'setup: create contact', run: createRunContact },
        {
          stepType: 'pipeline',
          name: 'identify update',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          retries: 2, // setup already waited for the external_id index; this only covers a replica lag
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
          // The group workflow upserts the company and attaches the contact during transformation,
          // then returns 299 (SUPPRESS_EVENTS); rudder-server delivers nothing more, so neither does
          // the harness. The read-back is what proves the attach happened.
          expectedProxyRequests: 0,
          // No delivery retries: a search miss here takes the company-only branch and still succeeds,
          // so retries would never fire. Setup instead waits until the contact is searchable.
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
