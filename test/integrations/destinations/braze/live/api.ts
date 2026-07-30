import axios from 'axios';
import { Agent } from 'https';
import { RunContext } from '../../../live/types';
import { RUDDER_ALIAS_LABEL } from './profiles';

// keepAlive:false so read-back/cleanup sockets don't linger as open handles when the suite finishes.
const brazeAgent = new Agent({ keepAlive: false });

// Fields the read-back requests from Braze's export endpoint.
const FIELDS_TO_EXPORT = [
  'external_id',
  'email',
  'first_name',
  'last_name',
  'custom_attributes',
  'user_aliases',
];

// Credentials for the direct Braze API helpers (read-back + cleanup). Same restApiKey/dataCenter the
// transform authenticates with — the key just needs users.export.ids + users.delete (+ subscription
// scopes) in addition to the delivery scopes.
const apiCreds = (ctx: RunContext): { restApiKey: string; dataCenter: string } => {
  const config = (ctx.liveSecret.config ?? {}) as Record<string, unknown>;
  const restApiKey = config.restApiKey as string | undefined;
  const dataCenter = config.dataCenter as string | undefined;
  if (!restApiKey) {
    throw new Error('Braze restApiKey missing from LIVE_SECRET_BRAZE.config');
  }
  if (!dataCenter) {
    throw new Error('Braze dataCenter missing from LIVE_SECRET_BRAZE.config');
  }
  return { restApiKey, dataCenter };
};

// Mirrors src/v0/destinations/braze/util.ts getEndpointFromConfig so read-back/cleanup hit the same
// cluster the transform delivered to.
export const restEndpoint = (dataCenter: string): string => {
  const [region, number] = dataCenter.trim().toLowerCase().split('-');
  switch (region) {
    case 'eu':
      return `https://rest.fra-${number}.braze.eu`;
    case 'us':
      return `https://rest.iad-${number}.braze.com`;
    case 'au':
      return `https://rest.au-${number}.braze.com`;
    default:
      throw new Error(`Invalid Braze Data Center: ${dataCenter} (valid regions: EU, US, AU)`);
  }
};

const authHeaders = (restApiKey: string) => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${restApiKey}`,
  Connection: 'close' as const,
});

export type BrazeUserProfile = {
  external_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  custom_attributes?: Record<string, unknown>;
  user_aliases?: Array<{ alias_name: string; alias_label: string }>;
};

type ExportSelector = {
  externalIds?: string[];
  userAliases?: Array<{ alias_name: string; alias_label?: string }>;
};

// POST /users/export/ids — the read-back. Returns the matched user profiles (empty array if none).
export const exportUsers = async (
  ctx: RunContext,
  selector: ExportSelector,
): Promise<BrazeUserProfile[]> => {
  const { restApiKey, dataCenter } = apiCreds(ctx);
  const body: Record<string, unknown> = { fields_to_export: FIELDS_TO_EXPORT };
  if (selector.externalIds?.length) {
    body.external_ids = selector.externalIds;
  }
  if (selector.userAliases?.length) {
    body.user_aliases = selector.userAliases.map((a) => ({
      alias_name: a.alias_name,
      alias_label: a.alias_label ?? RUDDER_ALIAS_LABEL,
    }));
  }
  const res = await axios.post(`${restEndpoint(dataCenter)}/users/export/ids`, body, {
    headers: authHeaders(restApiKey),
    httpsAgent: brazeAgent,
    timeout: 15000,
  });
  return (res.data?.users ?? []) as BrazeUserProfile[];
};

export const exportUserByExternalId = async (
  ctx: RunContext,
  externalId: string,
): Promise<BrazeUserProfile | null> => {
  const users = await exportUsers(ctx, { externalIds: [externalId] });
  return users[0] ?? null;
};

export const exportUserByAlias = async (
  ctx: RunContext,
  aliasName: string,
  aliasLabel?: string,
): Promise<BrazeUserProfile | null> => {
  const users = await exportUsers(ctx, {
    userAliases: [{ alias_name: aliasName, alias_label: aliasLabel }],
  });
  return users[0] ?? null;
};

// POST /users/delete — teardown. Best-effort: logs and swallows so one failure can't strand siblings.
export const deleteUsers = async (ctx: RunContext, selector: ExportSelector): Promise<void> => {
  const { restApiKey, dataCenter } = apiCreds(ctx);
  const body: Record<string, unknown> = {};
  if (selector.externalIds?.length) {
    body.external_ids = selector.externalIds;
  }
  if (selector.userAliases?.length) {
    body.user_aliases = selector.userAliases.map((a) => ({
      alias_name: a.alias_name,
      alias_label: a.alias_label ?? RUDDER_ALIAS_LABEL,
    }));
  }
  if (Object.keys(body).length === 0) {
    return;
  }
  try {
    await axios.post(`${restEndpoint(dataCenter)}/users/delete`, body, {
      headers: authHeaders(restApiKey),
      httpsAgent: brazeAgent,
      timeout: 15000,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[live:braze] teardown (users/delete) failed', err);
  }
};

export const deleteUserByExternalId = (ctx: RunContext): Promise<void> =>
  deleteUsers(ctx, { externalIds: [ctx.identity('user')] });

export const deleteAnonymousUser = (ctx: RunContext): Promise<void> =>
  deleteUsers(ctx, { userAliases: [{ alias_name: ctx.identity('anon') }] });

// Create/update a user profile directly via /users/track attributes — used by setup steps that need
// prerequisite state (e.g. the two users an alias-merge collapses). _update_existing_only:false so
// Braze creates the profile if it doesn't exist.
export const createUserWithAttributes = async (
  ctx: RunContext,
  externalId: string,
  attributes: Record<string, unknown>,
): Promise<void> => {
  const { restApiKey, dataCenter } = apiCreds(ctx);
  await axios.post(
    `${restEndpoint(dataCenter)}/users/track`,
    {
      partner: 'RudderStack',
      attributes: [{ external_id: externalId, _update_existing_only: false, ...attributes }],
    },
    { headers: authHeaders(restApiKey), httpsAgent: brazeAgent, timeout: 15000 },
  );
};

export type BrazeSubscriptionGroup = {
  id?: string;
  name?: string;
  channel?: string;
  status?: string;
};

// GET /subscription/user/status — read a user's subscription-group statuses back for the
// /v2/subscription/status/set verify.
export const getSubscriptionGroups = async (
  ctx: RunContext,
  externalId: string,
): Promise<BrazeSubscriptionGroup[]> => {
  const { restApiKey, dataCenter } = apiCreds(ctx);
  const res = await axios.get(`${restEndpoint(dataCenter)}/subscription/user/status`, {
    params: { external_id: externalId },
    headers: authHeaders(restApiKey),
    httpsAgent: brazeAgent,
    timeout: 15000,
  });
  return (res.data?.users?.[0]?.subscription_groups ?? []) as BrazeSubscriptionGroup[];
};

// The subscription_group_id must come from the real Braze account (account-scoped), supplied via
// LIVE_SECRET_BRAZE.resourceIds.subscriptionGroupId.
export const subscriptionGroupId = (ctx: RunContext): string => {
  const id = ctx.liveSecret.resourceIds?.subscriptionGroupId;
  if (!id) {
    throw new Error(
      'subscriptionGroupId missing — set resourceIds.subscriptionGroupId in LIVE_SECRET_BRAZE',
    );
  }
  return id;
};
