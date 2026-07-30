import axios from 'axios';
import { Agent } from 'https';
import { RunContext } from '../../../live/types';

export const HS_BASE = 'https://api.hubapi.com';

// An association links two existing objects; scenarios register these types in setup.
export const ASSOC_FROM_TYPE = 'companies';
export const ASSOC_TO_TYPE = 'contacts';

// keepAlive:false so read-back/cleanup sockets don't linger as open handles when the suite finishes.
const hsAgent = new Agent({ keepAlive: false });

const bearer = (ctx: RunContext): string => {
  const token = ctx.liveSecret.config?.accessToken;
  if (!token) {
    throw new Error('HubSpot access token missing from resolved secret');
  }
  return `Bearer ${token}`;
};

const authHeaders = (ctx: RunContext) => ({
  Authorization: bearer(ctx),
  Connection: 'close' as const,
});

const jsonAuthHeaders = (ctx: RunContext) => ({
  'Content-Type': 'application/json',
  ...authHeaders(ctx),
});

export const findContactIdByProperty = async (
  ctx: RunContext,
  propertyName: string,
  value: string,
): Promise<string | null> => {
  const res = await axios.post(
    `${HS_BASE}/crm/v3/objects/contacts/search`,
    {
      filterGroups: [{ filters: [{ propertyName, operator: 'EQ', value }] }],
      properties: [propertyName],
      limit: 1,
    },
    {
      headers: jsonAuthHeaders(ctx),
      httpsAgent: hsAgent,
      timeout: 15000,
    },
  );
  return res.data?.results?.[0]?.id ?? null;
};

export const findContactIdByEmail = (ctx: RunContext, email: string): Promise<string | null> =>
  findContactIdByProperty(ctx, 'email', email);

export const fetchContactByEmail = async (
  ctx: RunContext,
  propertyNames: string[],
): Promise<Record<string, string> | null> => {
  const res = await axios.post(
    `${HS_BASE}/crm/v3/objects/contacts/search`,
    {
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: ctx.email() }] }],
      properties: propertyNames,
      limit: 1,
    },
    {
      headers: jsonAuthHeaders(ctx),
      httpsAgent: hsAgent,
      timeout: 15000,
    },
  );
  return res.data?.results?.[0]?.properties ?? null;
};

export const createCrmObject = async (
  ctx: RunContext,
  objectType: string,
  properties: Record<string, unknown>,
): Promise<string> => {
  const res = await axios.post(
    `${HS_BASE}/crm/v3/objects/${objectType}`,
    { properties },
    {
      headers: jsonAuthHeaders(ctx),
      httpsAgent: hsAgent,
      timeout: 15000,
    },
  );
  const id = res.data?.id;
  if (!id) {
    throw new Error(`Setup: failed to create ${objectType} (no id in response)`);
  }
  return String(id);
};

export const deleteContactById = async (ctx: RunContext, id: string): Promise<void> => {
  await axios.delete(`${HS_BASE}/crm/v3/objects/contacts/${id}`, {
    headers: authHeaders(ctx),
    httpsAgent: hsAgent,
    timeout: 15000,
  });
};

export const deleteContactByEmail = async (ctx: RunContext): Promise<void> => {
  const id = await findContactIdByEmail(ctx, ctx.email());
  if (id) {
    await deleteContactById(ctx, id);
  }
};

export const getAssociatedIds = async (
  ctx: RunContext,
  fromType: string,
  fromId: string,
  toType: string,
): Promise<string[]> => {
  const res = await axios.get(
    `${HS_BASE}/crm/v4/objects/${fromType}/${fromId}/associations/${toType}`,
    {
      headers: authHeaders(ctx),
      httpsAgent: hsAgent,
      timeout: 15000,
    },
  );
  return (res.data?.results ?? []).map((r: { toObjectId: unknown }) => String(r.toObjectId));
};

export const deleteAssociationObjects = async (ctx: RunContext): Promise<void> => {
  for (const r of ctx.resources) {
    if (r.type !== ASSOC_FROM_TYPE && r.type !== ASSOC_TO_TYPE) {
      continue;
    }
    try {
      // eslint-disable-next-line no-await-in-loop
      await axios.delete(`${HS_BASE}/crm/v3/objects/${r.type}/${r.id}`, {
        headers: authHeaders(ctx),
        httpsAgent: hsAgent,
        timeout: 15000,
      });
    } catch (err) {
      // Best-effort: log and continue so one failure can't strand sibling resources.
      // eslint-disable-next-line no-console
      console.error(`[live:hs] teardown failed for ${r.type}/${r.id}`, err);
    }
  }
};

export const registeredId = (ctx: RunContext, type: string): string => {
  const id = ctx.resources.find((r) => r.type === type)?.id;
  if (!id) {
    throw new Error(`association setup did not register a ${type} id`);
  }
  return id;
};

export const fetchContactPropsById = async (
  ctx: RunContext,
  id: string,
  propertyNames: string[],
): Promise<Record<string, string> | null> => {
  const res = await axios.get(`${HS_BASE}/crm/v3/objects/contacts/${id}`, {
    params: { properties: propertyNames.join(',') },
    headers: authHeaders(ctx),
    httpsAgent: hsAgent,
    timeout: 15000,
  });
  return res.data?.properties ?? null;
};

// Delete any contact reachable by the run's primary or additional email. On the happy path only the
// single set-up contact (found via its primary email) exists; if the additional-email upsert ever
// forked a second contact, this also removes that stray so runs stay isolated.
export const deleteUpsertAdditionalEmailContacts = async (ctx: RunContext): Promise<void> => {
  const seen = new Set<string>();
  for (const email of [ctx.email(), ctx.email('additional')]) {
    // eslint-disable-next-line no-await-in-loop
    const id = await findContactIdByEmail(ctx, email);
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    // eslint-disable-next-line no-await-in-loop
    await deleteContactById(ctx, id);
  }
};
