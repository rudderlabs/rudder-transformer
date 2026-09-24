import axios from 'axios';
import { Agent } from 'https';
import type { RunContext } from '../../../live/types';

export const HS_BASE = 'https://api.hubapi.com';

interface HsSearchResponse {
  results?: Array<{ id?: string; properties?: Record<string, string> }>;
}
interface HsCreateResponse {
  id?: string | number;
}
interface HsAssociationsResponse {
  results?: Array<{ toObjectId: string | number }>;
}
interface HsObjectResponse {
  properties?: Record<string, string>;
}

// An association links two existing objects; scenarios register these types in setup.
export const ASSOC_FROM_TYPE = 'companies';
export const ASSOC_TO_TYPE = 'contacts';

// keepAlive:false so read-back/cleanup sockets don't linger as open handles when the suite finishes.
const hsAgent = new Agent({ keepAlive: false });

const bearer = (ctx: RunContext): string => {
  const token = ctx.liveSecret.config.accessToken;
  if (typeof token !== 'string' || token.length === 0) {
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
  const res = await axios.post<HsSearchResponse>(
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
  return res.data.results?.[0]?.id ?? null;
};

export const findContactIdByEmail = (ctx: RunContext, email: string): Promise<string | null> =>
  findContactIdByProperty(ctx, 'email', email);

export const fetchContactByEmail = async (
  ctx: RunContext,
  propertyNames: string[],
): Promise<Record<string, string> | null> => {
  const res = await axios.post<HsSearchResponse>(
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
  return res.data.results?.[0]?.properties ?? null;
};

export const createCrmObject = async (
  ctx: RunContext,
  objectType: string,
  properties: Record<string, unknown>,
): Promise<string> => {
  const res = await axios.post<HsCreateResponse>(
    `${HS_BASE}/crm/v3/objects/${objectType}`,
    { properties },
    {
      headers: jsonAuthHeaders(ctx),
      httpsAgent: hsAgent,
      timeout: 15000,
    },
  );
  const id = res.data.id;
  if (!id) {
    throw new Error(`Setup: failed to create ${objectType} (no id in response)`);
  }
  return String(id);
};

export const deleteCrmObjectById = async (
  ctx: RunContext,
  objectType: string,
  id: string,
): Promise<void> => {
  await axios.delete(`${HS_BASE}/crm/v3/objects/${objectType}/${id}`, {
    headers: authHeaders(ctx),
    httpsAgent: hsAgent,
    timeout: 15000,
  });
};

export const deleteContactById = (ctx: RunContext, id: string): Promise<void> =>
  deleteCrmObjectById(ctx, 'contacts', id);

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
  const res = await axios.get<HsAssociationsResponse>(
    `${HS_BASE}/crm/v4/objects/${fromType}/${fromId}/associations/${toType}`,
    {
      headers: authHeaders(ctx),
      httpsAgent: hsAgent,
      timeout: 15000,
    },
  );
  return (res.data.results ?? []).map((r) => String(r.toObjectId));
};

// Delete every object the scenario registered (resource type = CRM object type). The deletes run
// independently, so one failure (e.g. an object the scenario already deleted) can't strand the
// rest; failures are rethrown together for the runner to log.
export const deleteRegisteredObjects = async (ctx: RunContext): Promise<void> => {
  const results = await Promise.allSettled(
    ctx.resources.map((r) => deleteCrmObjectById(ctx, r.type, r.id)),
  );
  const failed = results.flatMap((result, i) =>
    result.status === 'rejected' ? [`${ctx.resources[i].type}/${ctx.resources[i].id}`] : [],
  );
  if (failed.length > 0) {
    throw new Error(`[live:hs] teardown failed for ${failed.join(', ')}`);
  }
};

export const registeredId = (ctx: RunContext, type: string): string => {
  const id = ctx.resources.find((r) => r.type === type)?.id;
  if (!id) {
    throw new Error(`setup did not register a ${type} id`);
  }
  return id;
};

export const fetchCrmObjectPropsById = async (
  ctx: RunContext,
  objectType: string,
  id: string,
  propertyNames: string[],
): Promise<Record<string, string> | null> => {
  const res = await axios.get<HsObjectResponse>(`${HS_BASE}/crm/v3/objects/${objectType}/${id}`, {
    params: { properties: propertyNames.join(',') },
    headers: authHeaders(ctx),
    httpsAgent: hsAgent,
    timeout: 15000,
  });
  return res.data.properties ?? null;
};

export const fetchContactPropsById = (
  ctx: RunContext,
  id: string,
  propertyNames: string[],
): Promise<Record<string, string> | null> =>
  fetchCrmObjectPropsById(ctx, 'contacts', id, propertyNames);

// Every id registered under `type`, in registration order.
export const registeredIds = (ctx: RunContext, type: string): string[] =>
  ctx.resources.filter((r) => r.type === type).map((r) => r.id);

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
