import axios from 'axios';
import { Agent } from 'https';
import { BASE_URL_EU, BASE_URL_US } from '../../../../../src/v0/destinations/airship/config';
import type { LiveSecret, RunContext } from '../../../live/types';

const agent = new Agent({ keepAlive: false });

/**
 * Sandbox configuration, not run data: Airship creates a tag on its first write, so this needs no
 * setup. Every scenario removes it again from the named user it touched.
 */
export const LIVE_TAG = 'rs_air_live';

/** A tag group key that must NOT exist in the sandbox project (the 40090 scenario). */
export const MISSING_TAG_GROUP = 'rs_air_live_missing_group';

const readString = (value: unknown, label: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Airship Audience live secret missing ${label}`);
  }
  return value;
};

/** A named user that already exists in the sandbox (the destination never creates them). */
export const existingNamedUserId = (ctx: RunContext): string =>
  readString(ctx.liveSecret.resourceIds?.namedUserId, 'resourceIds.namedUserId');

/** A run-unique named user Airship has never seen. */
export const unknownNamedUserId = (ctx: RunContext, n = 1): string =>
  `rs-air-live-missing-${n}-${ctx.identity('user')}`;

const tagGroupOf = (secret: LiveSecret): string =>
  readString(secret.config.tagGroup, 'config.tagGroup');

const baseUrl = (ctx: RunContext): string =>
  readString(ctx.liveSecret.config.dataCenter, 'config.dataCenter') === 'EU'
    ? BASE_URL_EU
    : BASE_URL_US;

const request = (ctx: RunContext) => ({
  headers: {
    Authorization: `Bearer ${readString(ctx.liveSecret.config.apiKey, 'config.apiKey')}`,
    Accept: 'application/vnd.urbanairship+json; version=3',
    'Content-Type': 'application/json',
    Connection: 'close' as const,
  },
  httpsAgent: agent,
  timeout: 15000,
  validateStatus: () => true,
});

/** `GET /api/named_users?id=` → 200 with the user, or 404 40401 when Airship stores nothing. */
const getNamedUser = (ctx: RunContext, namedUserId: string) =>
  axios.get(`${baseUrl(ctx)}/api/named_users`, { ...request(ctx), params: { id: namedUserId } });

/** The tags this named user carries in the account's tag group. */
export const fetchGroupTags = async (ctx: RunContext): Promise<string[]> => {
  const res = await getNamedUser(ctx, existingNamedUserId(ctx));
  if (res.status !== 200) throw new Error(`Airship GET named user failed: status=${res.status}`);
  return (res.data?.named_user?.tags?.[tagGroupOf(ctx.liveSecret)] ?? []) as string[];
};

export const fetchNamedUserStatus = async (ctx: RunContext, namedUserId: string) =>
  (await getNamedUser(ctx, namedUserId)).status;

/** Precondition and cleanup: the same call the destination makes. */
const setTag = async (ctx: RunContext, operation: 'add' | 'remove'): Promise<void> => {
  const res = await axios.post(
    `${baseUrl(ctx)}/api/named_users/tags`,
    {
      audience: { named_user_id: [existingNamedUserId(ctx)] },
      [operation]: { [tagGroupOf(ctx.liveSecret)]: [LIVE_TAG] },
    },
    request(ctx),
  );
  if (res.status !== 200) throw new Error(`Airship ${operation} tag failed: status=${res.status}`);
};

export const addLiveTag = (ctx: RunContext) => setTag(ctx, 'add');
export const removeLiveTag = (ctx: RunContext) => setTag(ctx, 'remove');
