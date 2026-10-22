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

/**
 * Sandbox configuration, not run data: custom user attributes created once in PX admin (the API
 * cannot create them). Prerequisite in gainsight-px-audience-tests.md § Trait mappings.
 */
export const TRAIT_ATTRIBUTES = {
  string: 'rs_gpx_string',
  number: 'rs_gpx_number',
  date: 'rs_gpx_date',
} as const;

/** GET /users/{id} lags writes by ~6–25 s; callers poll. */
export const fetchCustomAttributes = async (ctx: RunContext): Promise<Record<string, unknown>> => {
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
  return (res.data?.customAttributes ?? {}) as Record<string, unknown>;
};

export const fetchMembership = async (ctx: RunContext): Promise<unknown> =>
  (await fetchCustomAttributes(ctx))[customAttributeNameFromSecret(ctx.liveSecret)];

/** Precondition/cleanup: write attributes directly through the endpoint the destination uses. */
export const setCustomAttributes = async (
  ctx: RunContext,
  customAttributes: Record<string, unknown>,
): Promise<void> => {
  const res = await axios.put(
    `${baseUrl(ctx)}/users/update`,
    { identifyId: existingIdentifyId(ctx), customAttributes },
    { headers: headers(ctx), httpsAgent: agent, timeout: 15000, validateStatus: () => true },
  );
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Gainsight PX setCustomAttributes failed: status=${res.status}`);
  }
};

export const setMembership = (ctx: RunContext, value: boolean): Promise<void> =>
  setCustomAttributes(ctx, { [customAttributeNameFromSecret(ctx.liveSecret)]: value });
