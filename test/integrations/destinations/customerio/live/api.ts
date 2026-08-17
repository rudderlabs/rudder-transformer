import axios, { isAxiosError } from 'axios';
import { Agent } from 'https';
import type { RunContext } from '../../../live/types';
import { GROUP_OBJECT_TYPE_ID } from './profiles';

// CustomerIO splits its surface across two APIs with two different credentials:
//   Track API (track.customer.io, Basic siteID:apiKey) — WRITE only. This is what the transform
//     delivers to, and all it can tell us is that a payload was accepted.
//   App  API (api.customer.io, Bearer app API key)     — READ back. The only way to assert that a
//     write actually landed, and the only thing that can tell the two rollout states apart.
// The Track credentials cannot read, so read-back needs its own key under `readback.appApiKey`.
const TRACK_BASE_URL = 'https://track.customer.io/api';
const TRACK_BASE_URL_EU = 'https://track-eu.customer.io/api';
const APP_BASE_URL = 'https://api.customer.io';
const APP_BASE_URL_EU = 'https://api-eu.customer.io';

// keepAlive:false so read-back/cleanup sockets don't linger as open handles when the suite finishes.
const cioAgent = new Agent({ keepAlive: false });

const TIMEOUT_MS = 15000;

const isEu = (ctx: RunContext): boolean =>
  String((ctx.liveSecret.config ?? {}).datacenter ?? 'US').toUpperCase() === 'EU';

const trackBase = (ctx: RunContext): string => (isEu(ctx) ? TRACK_BASE_URL_EU : TRACK_BASE_URL);
const appBase = (ctx: RunContext): string => (isEu(ctx) ? APP_BASE_URL_EU : APP_BASE_URL);

// Same Basic credentials the transform derives from destination.Config.
export const authHeader = (ctx: RunContext): string => {
  const config = (ctx.liveSecret.config ?? {}) as Record<string, unknown>;
  const siteID = config.siteID as string | undefined;
  const apiKey = config.apiKey as string | undefined;
  if (!siteID || !apiKey) {
    throw new Error('siteID/apiKey missing from LIVE_SECRET_CUSTOMERIO.config');
  }
  return `Basic ${Buffer.from(`${siteID}:${apiKey}`).toString('base64')}`;
};

// Read-back credential. Deliberately throws rather than skipping: a verify that silently no-ops is
// exactly the false confidence this suite exists to remove.
const appAuthHeader = (ctx: RunContext): string => {
  const key = (ctx.liveSecret.readback ?? {}).appApiKey;
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error(
      'CustomerIO App API key missing: set `readback.appApiKey` on LIVE_SECRET_CUSTOMERIO. ' +
        'The Track credentials (siteID/apiKey) are write-only — read-back verification needs an ' +
        'App API key (CustomerIO > Account Settings > API Credentials > App API Keys).',
    );
  }
  return `Bearer ${key}`;
};

const appHeaders = (ctx: RunContext) => ({
  Authorization: appAuthHeader(ctx),
  Connection: 'close' as const,
});

// ---------------------------------------------------------------------------
// App API response shapes (docs.customer.io/files/journeys-app.json)
// ---------------------------------------------------------------------------

export interface CioPerson {
  id?: string;
  identifiers?: { id?: string | null; email?: string | null; cio_id?: string };
  // "Attributes are all stored as strings" — App API reference.
  attributes?: Record<string, string>;
  devices?: Array<{ id?: string; platform?: string; last_used?: number }>;
  timestamps?: Record<string, number>;
  unsubscribed?: boolean;
}

export interface CioActivity {
  id?: string;
  type?: string;
  name?: string;
  timestamp?: number;
  data?: Record<string, unknown>;
}

export interface CioRelationship {
  // Documented as an integer, returned as a string ("1") — callers must normalise.
  object_type_id?: number | string;
  identifiers?: { object_id?: string; cio_object_id?: string };
  attributes?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Read-back (App API)
// ---------------------------------------------------------------------------

/** Person attributes + devices. Returns null when the profile does not exist (404). */
export const getPerson = async (ctx: RunContext, id: string): Promise<CioPerson | null> => {
  try {
    const res = await axios.get<{ customer?: CioPerson }>(
      `${appBase(ctx)}/v1/customers/${encodeURIComponent(id)}/attributes`,
      {
        params: { id_type: 'id' },
        headers: appHeaders(ctx),
        httpsAgent: cioAgent,
        timeout: TIMEOUT_MS,
      },
    );
    return res.data.customer ?? null;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

/**
 * Activities of one `type`, optionally filtered by event `name`.
 * `type` is the App API's activity-type enum — `event`, `page`, `screen`, `profile_merge`, … —
 * which is what makes page/screen assertable as distinct kinds rather than generic events.
 */
export const getActivities = async (
  ctx: RunContext,
  id: string,
  query: { type: string; name?: string; limit?: number },
): Promise<CioActivity[]> => {
  const res = await axios.get<{ activities?: CioActivity[] }>(
    `${appBase(ctx)}/v1/customers/${encodeURIComponent(id)}/activities`,
    {
      params: {
        id_type: 'id',
        limit: query.limit ?? 100,
        type: query.type,
        ...(query.name ? { name: query.name } : {}),
      },
      headers: appHeaders(ctx),
      httpsAgent: cioAgent,
      timeout: TIMEOUT_MS,
    },
  );
  return res.data.activities ?? [];
};

/** Objects (groups) the person is related to. */
export const getRelationships = async (ctx: RunContext, id: string): Promise<CioRelationship[]> => {
  const res = await axios.get<{ cio_relationships?: CioRelationship[] }>(
    `${appBase(ctx)}/v1/customers/${encodeURIComponent(id)}/relationships`,
    {
      params: { id_type: 'id' },
      headers: appHeaders(ctx),
      httpsAgent: cioAgent,
      timeout: TIMEOUT_MS,
    },
  );
  return res.data.cio_relationships ?? [];
};

/** Attributes written onto the object itself (as opposed to the person→object link). */
export const getObjectAttributes = async (
  ctx: RunContext,
  objectId: string,
): Promise<Record<string, unknown> | null> => {
  try {
    const res = await axios.get<{ object?: { attributes?: Record<string, unknown> } }>(
      `${appBase(ctx)}/v1/objects/${GROUP_OBJECT_TYPE_ID}/${encodeURIComponent(objectId)}/attributes`,
      { headers: appHeaders(ctx), httpsAgent: cioAgent, timeout: TIMEOUT_MS },
    );
    return res.data.object?.attributes ?? null;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

// ---------------------------------------------------------------------------
// Teardown (Track API) — best-effort: logs and swallows so one failure can't
// strand sibling cleanups.
// ---------------------------------------------------------------------------

const swallow = (what: string, err: unknown): void => {
  const status = (err as { response?: { status?: number } })?.response?.status;
  // eslint-disable-next-line no-console
  console.error(
    `[live:customerio] teardown (${what}) failed${status ? ` (status ${status})` : ''}:`,
    err instanceof Error ? err.message : String(err),
  );
};

export const deletePerson = async (ctx: RunContext, id: string): Promise<void> => {
  try {
    await axios.delete(`${trackBase(ctx)}/v1/customers/${encodeURIComponent(id)}`, {
      headers: { Authorization: authHeader(ctx) },
      httpsAgent: cioAgent,
      timeout: TIMEOUT_MS,
    });
  } catch (err) {
    swallow(`delete customer ${id}`, err);
  }
};

// Objects (groups) are removed through the same batch endpoint the transform writes them with.
export const deleteObject = async (ctx: RunContext, objectId: string): Promise<void> => {
  try {
    await axios.post(
      `${trackBase(ctx)}/v2/batch`,
      {
        batch: [
          {
            type: 'object',
            action: 'delete',
            identifiers: { object_id: objectId, object_type_id: GROUP_OBJECT_TYPE_ID },
          },
        ],
      },
      {
        headers: { Authorization: authHeader(ctx), 'Content-Type': 'application/json' },
        httpsAgent: cioAgent,
        timeout: TIMEOUT_MS,
      },
    );
  } catch (err) {
    swallow(`delete object ${objectId}`, err);
  }
};

// Every identity a scenario touches: the alias step merges 'user' into 'alias', so both ids can
// outlive the run, as can the record profile and the group object.
export const cleanupScenario = async (ctx: RunContext): Promise<void> => {
  await Promise.all([
    deletePerson(ctx, ctx.identity('user')),
    deletePerson(ctx, ctx.identity('alias')),
    deletePerson(ctx, ctx.identity('record')),
    deleteObject(ctx, ctx.identity('group')),
  ]);
};
