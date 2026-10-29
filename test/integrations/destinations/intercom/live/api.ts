import axios from 'axios';
import { Agent } from 'https';
import type { RunContext } from '../../../live/types';
import {
  BASE_ENDPOINT,
  BASE_EU_ENDPOINT,
  BASE_AU_ENDPOINT,
} from '../../../../../src/cdk/v2/destinations/intercom/config';

// Same hosts the transform resolves from destination.Config.apiServer.
const BASE_URLS: Record<string, string> = {
  standard: BASE_ENDPOINT,
  eu: BASE_EU_ENDPOINT,
  au: BASE_AU_ENDPOINT,
};

export interface IntercomContact {
  id: string;
  email?: string | null;
  external_id?: string | null;
  name?: string | null;
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

// The query shape the transform's searchContact sends: always a compound query, even for one lookup.
// Intercom answers the simple single-field form (searchContacts) within seconds of a write, but the
// compound form can take ~30-100s to return a new contact, so setup must wait on this shape.
export const searchContactsAsTransform = async (
  ctx: RunContext,
  field: 'email' | 'external_id',
  value: string,
): Promise<IntercomContact[]> => {
  const res = await axios.post<{ data?: IntercomContact[] }>(
    `${baseUrl(ctx)}/contacts/search`,
    { query: { operator: 'AND', value: [{ field, operator: '=', value }] } },
    requestConfig(ctx),
  );
  return res.data?.data ?? [];
};

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
