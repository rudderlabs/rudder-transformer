import axios from 'axios';
import { Agent } from 'https';
import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';
import type { RunContext } from '../../../live/types';

// Same hosts the transform resolves from destination.Config.apiServer (src/cdk/v2/destinations/intercom/config.js).
const BASE_URLS: Record<string, string> = {
  standard: 'https://api.intercom.io',
  eu: 'https://api.eu.intercom.io',
  au: 'https://api.au.intercom.io',
};

export interface IntercomContact {
  id: string;
  email?: string | null;
  external_id?: string | null;
  name?: string | null;
  phone?: string | null;
}

export interface IntercomCompany {
  id: string;
  company_id?: string;
  name?: string;
  plan?: { name?: string } | null;
}

// keepAlive:false so read-back/cleanup sockets don't linger as open handles when the suite finishes.
const intercomAgent = new Agent({ keepAlive: false });

const baseUrl = (ctx: RunContext): string => {
  const apiServer = ctx.liveSecret.config.apiServer;
  return BASE_URLS[typeof apiServer === 'string' ? apiServer : 'standard'] ?? BASE_URLS.standard;
};

// Setup, read-back and cleanup use the same access token the transform reads from destination.Config.apiKey.
const headers = (ctx: RunContext) => {
  const token = ctx.liveSecret.config.apiKey;
  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('Intercom apiKey missing from LIVE_SECRET_INTERCOM.config');
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Intercom-Version': '2.10',
    Connection: 'close' as const,
  };
};

const requestConfig = (ctx: RunContext) => ({
  headers: headers(ctx),
  httpsAgent: intercomAgent,
  timeout: 15000,
});

export const searchContacts = async (
  ctx: RunContext,
  field: 'email' | 'external_id',
  value: string,
): Promise<IntercomContact[]> => {
  const res = await axios.post<{ data?: IntercomContact[] }>(
    `${baseUrl(ctx)}/contacts/search`,
    { query: { field, operator: '=', value } },
    requestConfig(ctx),
  );
  return res.data?.data ?? [];
};

// Contact search is eventually consistent, so a freshly written contact can take a few seconds to appear.
export const pollContact = (
  ctx: RunContext,
  field: 'email' | 'external_id',
  value: string,
): Promise<IntercomContact | undefined> =>
  pollUntil(
    async () => {
      const [contact] = await searchContacts(ctx, field, value);
      return { done: Boolean(contact), value: contact };
    },
    {
      label: `intercom contact ${field}`,
      attempts: 6,
      delayMs: (n) => Math.min(1000 * 2 ** n, 8000),
      soft: true,
    },
  );

export const createContact = async (
  ctx: RunContext,
  contact: { email?: string; external_id?: string; name?: string },
): Promise<string> => {
  const res = await axios.post<{ id: string }>(
    `${baseUrl(ctx)}/contacts`,
    { role: 'user', ...contact },
    requestConfig(ctx),
  );
  ctx.register({ type: 'contact', id: res.data.id });
  return res.data.id;
};

export const getContactCompanies = async (
  ctx: RunContext,
  contactId: string,
): Promise<IntercomCompany[]> => {
  const res = await axios.get<{ data?: IntercomCompany[] }>(
    `${baseUrl(ctx)}/contacts/${contactId}/companies`,
    requestConfig(ctx),
  );
  return res.data?.data ?? [];
};

export const getCompanyByCompanyId = async (
  ctx: RunContext,
  companyId: string,
): Promise<IntercomCompany | undefined> => {
  try {
    const res = await axios.get<IntercomCompany>(`${baseUrl(ctx)}/companies`, {
      ...requestConfig(ctx),
      params: { company_id: companyId },
    });
    return res.data;
  } catch (err) {
    if ((err as { response?: { status?: number } })?.response?.status === 404) {
      return undefined;
    }
    throw err;
  }
};

// Best-effort teardown: logs and swallows so one failure can't strand sibling cleanups.
const bestEffort = async (label: string, fn: () => Promise<unknown>): Promise<void> => {
  try {
    await fn();
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    // eslint-disable-next-line no-console
    console.error(
      `[live:intercom] teardown (${label}) failed${status ? ` (status ${status})` : ''}:`,
      err instanceof Error ? err.message : String(err),
    );
  }
};

const deleteContact = (ctx: RunContext, id: string): Promise<void> =>
  bestEffort(`delete contact ${id}`, () =>
    axios.delete(`${baseUrl(ctx)}/contacts/${id}`, requestConfig(ctx)),
  );

// Deletes every contact the run created: the ones setup registered plus any the pipeline created,
// found by the run's external_id and email. One search each — a pipeline-created contact is already
// searchable once its read-back passed, and polling here only stalls teardown after a failed run.
export const deleteRunContacts = async (ctx: RunContext): Promise<void> => {
  const ids = new Set(ctx.resources.filter((r) => r.type === 'contact').map((r) => r.id));
  const lookups: Array<['email' | 'external_id', string]> = [
    ['external_id', ctx.identity('user')],
    ['email', ctx.email()],
  ];
  await Promise.all(
    lookups.map(([field, value]) =>
      bestEffort(`search ${field}`, async () => {
        (await searchContacts(ctx, field, value)).forEach((contact) => ids.add(contact.id));
      }),
    ),
  );
  await Promise.all([...ids].map((id) => deleteContact(ctx, id)));
};

export const deleteRunCompany = async (ctx: RunContext): Promise<void> => {
  await bestEffort('delete company', async () => {
    const company = await getCompanyByCompanyId(ctx, ctx.identity('company'));
    if (company) {
      await axios.delete(`${baseUrl(ctx)}/companies/${company.id}`, requestConfig(ctx));
    }
  });
};
