import axios from 'axios';
import { Agent } from 'https';
import { getEndpointFromConfig } from '../../../../../src/v0/destinations/braze/util';
import type { LiveSecret, RunContext } from '../../../live/types';

// keepAlive:false so read-back/cleanup sockets don't linger as open handles when the suite finishes.
const brazeAgent = new Agent({ keepAlive: false });

interface BrazeAudienceExportResponse {
  users?: Array<{ custom_attributes?: Record<string, unknown> }>;
}

const readString = (value: unknown, label: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Braze Audience live secret missing ${label}`);
  }
  return value;
};

export const customAttributeNameFromSecret = (secret: LiveSecret): string =>
  readString(secret.resourceIds?.customAttributeName, 'resourceIds.customAttributeName');

export const customAttributeName = (ctx: RunContext): string =>
  customAttributeNameFromSecret(ctx.liveSecret);

export const externalId = (ctx: RunContext): string => ctx.identity('user');

const restApiKey = (ctx: RunContext): string =>
  readString(ctx.liveSecret.config.restApiKey, 'config.restApiKey');

const dataCenter = (ctx: RunContext): string =>
  readString(ctx.liveSecret.config.dataCenter, 'config.dataCenter');

export const restBaseUrl = (ctx: RunContext): string =>
  getEndpointFromConfig({
    Config: { dataCenter: dataCenter(ctx) },
  } as Parameters<typeof getEndpointFromConfig>[0]);

const authHeaders = (ctx: RunContext) => ({
  Authorization: `Bearer ${restApiKey(ctx)}`,
  'Content-Type': 'application/json',
  Connection: 'close' as const,
});

/** Set membership boolean via Braze /users/track/bulk (setup / cleanup). */
export const setMembership = async (ctx: RunContext, value: boolean): Promise<void> => {
  const res = await axios.post(
    `${restBaseUrl(ctx)}/users/track/bulk`,
    {
      attributes: [
        {
          external_id: externalId(ctx),
          [customAttributeName(ctx)]: value,
        },
      ],
    },
    {
      headers: authHeaders(ctx),
      httpsAgent: brazeAgent,
      timeout: 15000,
      validateStatus: () => true,
    },
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(
      `Braze track/bulk setMembership(${value}) failed: status=${res.status} body=${JSON.stringify(res.data)}`,
    );
  }
};

/**
 * Read membership custom attribute via /users/export/ids.
 * Returns undefined when the user or attribute is not present yet.
 */
export const fetchMembership = async (ctx: RunContext): Promise<boolean | undefined> => {
  const attr = customAttributeName(ctx);
  const res = await axios.post<BrazeAudienceExportResponse>(
    `${restBaseUrl(ctx)}/users/export/ids`,
    {
      external_ids: [externalId(ctx)],
      fields_to_export: ['external_id', 'custom_attributes'],
    },
    {
      headers: authHeaders(ctx),
      httpsAgent: brazeAgent,
      timeout: 15000,
      validateStatus: () => true,
    },
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(
      `Braze export/ids failed: status=${res.status} body=${JSON.stringify(res.data)}`,
    );
  }
  const users = res.data.users;
  if (!Array.isArray(users) || users.length === 0) {
    return undefined;
  }
  const raw = users[0]?.custom_attributes?.[attr];
  if (typeof raw === 'boolean') {
    return raw;
  }
  return undefined;
};

/** Best-effort cleanup: set membership false so the run-scoped external_id stops advertising true. */
export const clearMembership = async (ctx: RunContext): Promise<void> => {
  await setMembership(ctx, false);
};
