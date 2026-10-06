import type { RunContext } from '../../../live/types';

// ── Seed values ──
//
// Raw values as a warehouse row would carry them, nothing more: the transform owns normalization,
// hashing and timestamp formatting, so restating those rules here would grade it against a copy of
// itself. Names are mixed case on purpose so the normalize → hash path is what makes them match.
//
// IPs come from the RFC 5737 / RFC 3849 documentation ranges, so an uploaded identifier can never
// belong to a real person.
const RAW = {
  firstName: 'Alex',
  lastName: 'Doe',
  country: 'US',
  postalCode: '94105',
  ip: { v4: '203.0.113.71', v6: '2001:db8::71' },
};

// Contact identifiers that become `userData.userIdentifiers`: a hashed email plus the address
// entry (hashed names, plaintext country/postal code). `lastName` is run-scoped so concurrent runs
// never upload an identical address identifier.
export const contactIdentifiers = (ctx: RunContext, entity: string): Record<string, unknown> => ({
  email: ctx.email(entity),
  firstName: RAW.firstName,
  lastName: `${RAW.lastName}-${ctx.runId.slice(-8)}`,
  country: RAW.country,
  postalCode: RAW.postalCode,
});

// IP data that becomes `compositeData.ipData`: an unhashed IP with an observation window, given as
// the RFC 3339 timestamps rETL emits for a timestamp column.
export const ipIdentifiers = (
  ctx: RunContext,
  version: keyof typeof RAW.ip = 'v4',
): Record<string, unknown> => ({
  userIp: RAW.ip[version],
  ipObserveStartTime: ctx.now('-2h'),
  ipObserveEndTime: ctx.now('-1h'),
});

// A member carrying both kinds: compositeData { userData, ipData }.
export const memberWithIp = (
  ctx: RunContext,
  entity: string,
  version: keyof typeof RAW.ip = 'v4',
): Record<string, unknown> => ({
  ...contactIdentifiers(ctx, entity),
  ...ipIdentifiers(ctx, version),
});

// rETL sends every mapped column, so a row with an empty value still carries the key as null.
export const nulled = (identifiers: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.keys(identifiers).map((key) => [key, null]));

// A VDM-v2 rETL record as rudder-server hands it to the router: the mapped warehouse columns arrive
// under `identifiers`, and `connection.config.destination.schemaVersion: '1.1'` (set by the spec's
// resolveConnection) routes it through processVDMV2RecordEvents.
export const recordSeed = (
  ctx: RunContext,
  suffix: string,
  action: 'insert' | 'delete',
  identifiers: Record<string, unknown>,
): Record<string, unknown> => ({
  type: 'record',
  action,
  fields: {},
  channel: 'sources',
  context: {
    sources: {
      job_id: `live-${ctx.runId}`,
      version: 'live',
      job_run_id: ctx.runId,
      task_run_id: ctx.runId,
    },
  },
  messageId: `${ctx.runId}-${suffix}`,
  recordId: ctx.identity(`record-${suffix}`),
  rudderId: ctx.identity(`rudder-${suffix}`),
  identifiers,
});
