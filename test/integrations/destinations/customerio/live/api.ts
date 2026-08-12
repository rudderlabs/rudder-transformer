import axios from 'axios';
import { Agent } from 'https';
import type { RunContext } from '../../../live/types';

// keepAlive:false so read-back/cleanup sockets don't linger as open handles when the suite finishes.
const cioAgent = new Agent({ keepAlive: false });
const TIMEOUT_MS = 15000;

// Two different APIs, two different credentials:
//  - Track API  Basic siteID:apiKey  — what the transform delivers to. Used here only for
//    setup/teardown side effects (create a person, delete a person/object).
//  - App API    Bearer App API Key   — read-only; every verify reads destination state back through
//    it, independently of the transform.
// US hosts only: the suite runs against a US sandbox. CustomerIO's EU region uses separate hosts
// (track-eu / api-eu), so enrolling an EU account means selecting them here too.
const TRACK_BASE = 'https://track.customer.io';
const APP_BASE = 'https://api.customer.io';

const trackAuthHeaders = (ctx: RunContext): Record<string, string> => {
  const { siteID, apiKey } = ctx.liveSecret.config;
  if (typeof siteID !== 'string' || !siteID) {
    throw new Error('CustomerIO siteID missing from LIVE_SECRET_CUSTOMERIO.config');
  }
  if (typeof apiKey !== 'string' || !apiKey) {
    throw new Error('CustomerIO apiKey missing from LIVE_SECRET_CUSTOMERIO.config');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${siteID}:${apiKey}`).toString('base64')}`,
    Connection: 'close',
  };
};

const appAuthHeaders = (ctx: RunContext): Record<string, string> => {
  const appApiKey = ctx.liveSecret.readback?.appApiKey;
  if (typeof appApiKey !== 'string' || !appApiKey) {
    throw new Error(
      'CustomerIO App API key missing — set readback.appApiKey in LIVE_SECRET_CUSTOMERIO (the read-back verifies need it)',
    );
  }
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${appApiKey}`,
    Connection: 'close',
  };
};

// How a person is addressed in an App API path. `id`/`email` are the workspace identifiers the
// transform writes; `cio_id` is CustomerIO's own immutable id, used when a lookup resolved it.
export type PersonIdType = 'id' | 'email' | 'cio_id';

export interface PersonIdentifiers {
  id: string | null;
  email: string | null;
  cio_id: string;
}

// CustomerIO reports an activity's identity in different fields per activity type: `name` for
// `event` and `screen` activities, `url` for `page` activities.
export interface CustomerActivity {
  id: string;
  type: string;
  name?: string;
  url?: string;
  timestamp?: number;
}

export interface CustomerRelationship {
  object_type_id?: number | string;
  identifiers?: { object_id?: string; cio_object_id?: string };
  attributes?: Record<string, unknown>;
}

export interface CustomerDevice {
  id: string;
  platform?: string;
  last_used?: number;
}

// One person record carries identifiers, attributes AND devices, so a single GET backs every
// person-shaped read-back.
interface PersonRecord {
  id?: string;
  identifiers?: PersonIdentifiers;
  attributes?: Record<string, string>;
  devices?: CustomerDevice[];
}

// App API GET. A 404 means "this record does not exist", which is a legitimate read-back result
// (the merge verify asserts exactly that), so it resolves to null instead of throwing.
const appGet = async <T>(
  ctx: RunContext,
  path: string,
  params?: Record<string, unknown>,
): Promise<T | null> => {
  try {
    const res = await axios.get<T>(`${APP_BASE}${path}`, {
      params,
      headers: appAuthHeaders(ctx),
      httpsAgent: cioAgent,
      timeout: TIMEOUT_MS,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

// ─── App API: read-backs ───

// GET /v1/customers/{id}/attributes — the whole person record; null when they don't exist.
const getPerson = async (
  ctx: RunContext,
  customerId: string,
  idType: PersonIdType = 'id',
): Promise<PersonRecord | null> => {
  const data = await appGet<{ customer?: PersonRecord }>(
    ctx,
    `/v1/customers/${encodeURIComponent(customerId)}/attributes`,
    { id_type: idType },
  );
  return data?.customer ?? null;
};

// Null when the person doesn't exist (distinct from an existing person with no attributes).
// CustomerIO stores every profile attribute as a string, which is why the seeded trait profiles are
// string-valued.
export const getPersonAttributes = async (
  ctx: RunContext,
  customerId: string,
  idType: PersonIdType = 'id',
): Promise<Record<string, string> | null> => {
  const person = await getPerson(ctx, customerId, idType);
  return person ? (person.attributes ?? {}) : null;
};

// GET /v1/customers?email= — resolves a person written with only an email to their identifiers.
// Going through cio_id afterwards keeps the read-back working whether or not `email` is enabled as
// an identifier in the workspace (id_type=email 400s in an id-only workspace).
// Returns EVERY match, so a caller can assert how many profiles an email resolves to — a duplicate
// profile is the failure mode this distinguishes.
export const findPersonsByEmail = async (
  ctx: RunContext,
  email: string,
): Promise<PersonIdentifiers[]> => {
  const data = await appGet<{ results?: PersonIdentifiers[] }>(ctx, '/v1/customers', { email });
  return data?.results ?? [];
};

export const findPersonByEmail = async (
  ctx: RunContext,
  email: string,
): Promise<PersonIdentifiers | null> => (await findPersonsByEmail(ctx, email))[0] ?? null;

// GET /v1/customers/{id}/activities — the person's event feed. Deliberately unfiltered by activity
// `type`: the two transform paths record a screen differently (v1 sends it as an `event`, v2 as a
// `screen`), so callers match on the activity NAME to stay API-version agnostic.
export const getPersonActivities = async (
  ctx: RunContext,
  customerId: string,
  idType: PersonIdType = 'id',
): Promise<CustomerActivity[]> => {
  const data = await appGet<{ activities?: CustomerActivity[] }>(
    ctx,
    `/v1/customers/${encodeURIComponent(customerId)}/activities`,
    { id_type: idType, limit: 100 },
  );
  return data?.activities ?? [];
};

// GET /v1/customers/{id}/relationships — the objects (groups) a person is related to.
export const getPersonRelationships = async (
  ctx: RunContext,
  customerId: string,
  idType: PersonIdType = 'id',
): Promise<CustomerRelationship[]> => {
  const data = await appGet<{ cio_relationships?: CustomerRelationship[] }>(
    ctx,
    `/v1/customers/${encodeURIComponent(customerId)}/relationships`,
    { id_type: idType },
  );
  return data?.cio_relationships ?? [];
};

// GET /v1/objects/{object_type_id}/{object_id}/attributes — null when the object doesn't exist.
export const getObjectAttributes = async (
  ctx: RunContext,
  objectTypeId: string,
  objectId: string,
): Promise<Record<string, string> | null> => {
  const data = await appGet<{ object?: { attributes?: Record<string, string> } }>(
    ctx,
    `/v1/objects/${encodeURIComponent(objectTypeId)}/${encodeURIComponent(objectId)}/attributes`,
  );
  return data?.object?.attributes ?? null;
};

// The person record's `devices` — each device's `id` is the device token. Null when the person
// doesn't exist, so a caller can tell "no such person" apart from "person exists but has no
// devices"; collapsing both to [] hides which one failed.
export const getPersonDevices = async (
  ctx: RunContext,
  customerId: string,
  idType: PersonIdType = 'id',
): Promise<CustomerDevice[] | null> => {
  const person = await getPerson(ctx, customerId, idType);
  return person ? (person.devices ?? []) : null;
};

// ─── Track API: setup + teardown side effects ───

// Teardown is best-effort: a failure is logged, never thrown, so one failed cleanup can't strand the
// siblings the runner still has to drain.
const bestEffort = async (what: string, run: () => Promise<unknown>): Promise<void> => {
  try {
    await run();
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
    // eslint-disable-next-line no-console
    console.error(
      `[live:customerio] teardown (${what}) failed${status ? ` (status ${status})` : ''}:`,
      err instanceof Error ? err.message : 'unknown error',
    );
  }
};

// PUT /api/v1/customers/{id} — creates or updates a person directly, bypassing the transform. Used
// by setup steps that need prerequisite state (e.g. the two profiles an alias merge collapses).
export const upsertPerson = async (
  ctx: RunContext,
  identifier: string,
  attributes: Record<string, unknown>,
): Promise<void> => {
  await axios.put(`${TRACK_BASE}/api/v1/customers/${encodeURIComponent(identifier)}`, attributes, {
    headers: trackAuthHeaders(ctx),
    httpsAgent: cioAgent,
    timeout: TIMEOUT_MS,
  });
};

// DELETE /api/v1/customers/{id} — removes a person and their data.
export const deletePerson = (ctx: RunContext, identifier: string): Promise<void> =>
  bestEffort(`delete person ${identifier}`, () =>
    axios.delete(`${TRACK_BASE}/api/v1/customers/${encodeURIComponent(identifier)}`, {
      headers: trackAuthHeaders(ctx),
      httpsAgent: cioAgent,
      timeout: TIMEOUT_MS,
    }),
  );

// Objects have no REST delete route; the Track API deletes them through a v2/batch object action.
export const deleteObject = (
  ctx: RunContext,
  objectTypeId: string,
  objectId: string,
): Promise<void> =>
  bestEffort(`delete object ${objectTypeId}/${objectId}`, () =>
    axios.post(
      `${TRACK_BASE}/api/v2/batch`,
      {
        batch: [
          {
            type: 'object',
            action: 'delete',
            identifiers: { object_id: objectId, object_type_id: objectTypeId },
          },
        ],
      },
      { headers: trackAuthHeaders(ctx), httpsAgent: cioAgent, timeout: TIMEOUT_MS },
    ),
  );

// The cleanup every scenario that writes the run's main person reuses.
export const deletePersonById = (ctx: RunContext): Promise<void> =>
  deletePerson(ctx, ctx.identity('user'));
