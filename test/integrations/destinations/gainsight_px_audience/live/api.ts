import axios from 'axios';
import { Agent } from 'https';
import { getBaseEndpoint } from '../../../../../src/v0/destinations/gainsight_px/config';
import type { LiveSecret, RunContext } from '../../../live/types';

const agent = new Agent({ keepAlive: false });

const readString = (value: unknown, label: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Gainsight PX Audience live secret missing ${label}`);
  }
  return value;
};

export const customAttributeNameFromSecret = (secret: LiveSecret): string =>
  readString(secret.resourceIds?.customAttributeName, 'resourceIds.customAttributeName');

/** A user that already exists in the sandbox (the destination never creates users). */
export const existingIdentifyId = (ctx: RunContext): string =>
  readString(ctx.liveSecret.resourceIds?.identifyId, 'resourceIds.identifyId');

/** A run-unique id PX has never seen. */
export const unknownIdentifyId = (ctx: RunContext): string =>
  `rs-gpx-live-missing-${ctx.identity('user')}`;

const baseUrl = (ctx: RunContext): string =>
  getBaseEndpoint({
    dataCenter: readString(ctx.liveSecret.config.dataCenter, 'config.dataCenter'),
  });

const headers = (ctx: RunContext) => ({
  'X-APTRINSIC-API-KEY': readString(ctx.liveSecret.config.apiKey, 'config.apiKey'),
  'Content-Type': 'application/json',
  Connection: 'close' as const,
});

/** GET /users/{id} lags writes by ~6–12 s; callers poll. */
export const fetchMembership = async (ctx: RunContext): Promise<unknown> => {
  const attr = customAttributeNameFromSecret(ctx.liveSecret);
  const res = await axios.get(
    `${baseUrl(ctx)}/users/${encodeURIComponent(existingIdentifyId(ctx))}`,
    {
      headers: headers(ctx),
      httpsAgent: agent,
      timeout: 15000,
      validateStatus: () => true,
    },
  );
  if (res.status !== 200) throw new Error(`Gainsight PX GET user failed: status=${res.status}`);
  return (res.data?.customAttributes ?? {})[attr];
};

/** Precondition/cleanup: set the attribute directly through the same endpoint the destination uses. */
export const setMembership = async (ctx: RunContext, value: boolean): Promise<void> => {
  const res = await axios.put(
    `${baseUrl(ctx)}/users/update`,
    {
      identifyId: existingIdentifyId(ctx),
      customAttributes: { [customAttributeNameFromSecret(ctx.liveSecret)]: value },
    },
    { headers: headers(ctx), httpsAgent: agent, timeout: 15000, validateStatus: () => true },
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Gainsight PX setMembership(${value}) failed: status=${res.status}`);
  }
};

/** True when PX knows the user; false on 404. Used to prove a leave never creates a user. */
export const userExists = async (ctx: RunContext, identifyId: string): Promise<boolean> => {
  const res = await axios.get(`${baseUrl(ctx)}/users/${encodeURIComponent(identifyId)}`, {
    headers: headers(ctx),
    httpsAgent: agent,
    timeout: 15000,
    validateStatus: () => true,
  });
  if (res.status === 200) return true;
  if (res.status === 404) return false;
  throw new Error(`Gainsight PX GET user failed: status=${res.status}`);
};
