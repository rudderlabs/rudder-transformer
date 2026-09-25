import type { RunContext } from '../../../live/types';

// Firstname used as the non-unique lookupField value (must match between setup and seed/verify).
export const lookupFirstname = (ctx: RunContext): string => `ci-${ctx.runId}`;

export const baseTimestamps = (ctx: RunContext, suffix: string) => ({
  userId: ctx.identity('user'),
  messageId: `${ctx.runId}-${suffix}`,
  timestamp: ctx.now(),
  originalTimestamp: ctx.now(),
  sentAt: ctx.now(),
  channel: 'sources',
});

export const esLibrary = { library: { name: 'rudder-live-integration-test' } };

// Trait profiles shared by a scenario's seed and its property verification.
export const esContactCreateTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI',
  lastname: ctx.runId,
  company: 'RudderStack Live Test',
  lifecyclestage: 'lead',
});
export const esContactUpdateTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-Updated',
  lastname: `${ctx.runId}-v2`,
  lifecyclestage: 'customer',
});
export const esContactCreateV1Traits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-V1',
  lastname: ctx.runId,
});
export const esContactUpdateV1Traits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-V1-Updated',
  lastname: `${ctx.runId}-v2`,
});
export const esDontBatchV3Traits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-DontBatch',
  lastname: ctx.runId,
  company: 'RudderStack Live Test',
});
export const esDontBatchV1Traits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-DontBatch-V1',
  lastname: ctx.runId,
});
export const esByHsContactIdTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-ById-Updated',
  lastname: `${ctx.runId}-v2`,
  lifecyclestage: 'customer',
});
export const esNonUniqueCreateTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: lookupFirstname(ctx),
  lastname: ctx.runId,
  company: 'RudderStack Live Test',
});
export const esNonUniqueUpdateTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: lookupFirstname(ctx),
  lastname: `${ctx.runId}-v2`,
  lifecyclestage: 'customer',
});
export const retlContactCreateTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-RETL',
  lastname: ctx.runId,
  company: 'RudderStack Live Test',
});
export const retlContactUpdateTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-RETL-Updated',
  lastname: `${ctx.runId}-v2`,
  lifecyclestage: 'customer',
});
export const retlContactCreateV1Traits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-RETL-V1',
  lastname: ctx.runId,
  company: 'RudderStack Live Test',
});
export const retlContactUpdateV1Traits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-RETL-V1-Updated',
  lastname: `${ctx.runId}-v2`,
  lifecyclestage: 'customer',
});

// rETL mappedToDestination context for one object, keyed by `identifierType` = `id`.
const retlObjectContext = (objectType: string, identifierType: string, id: string) => ({
  mappedToDestination: true,
  externalId: [{ type: `HS-${objectType}`, identifierType, id }],
  sources: { job_id: 'rudder-live-integration-test', version: 'v1' },
});

// rETL mappedToDestination context keyed by a specific email. No hubspotOperation:
// splitEventsForCreateUpdate resolves email (a unique property) to create/update or batch/upsert.
export const retlContactContextForEmail = (email: string) =>
  retlObjectContext('contacts', 'email', email);

export const retlContactContext = (ctx: RunContext) => retlContactContextForEmail(ctx.email());

// rETL mappedToDestination context keyed by HubSpot's record id: the transform skips Search and
// sends a direct batch/update to this id.
export const retlRecordIdContext = (recordId: string, objectType = 'contacts') =>
  retlObjectContext(objectType, 'hs_object_id', recordId);

export const retlRecordIdUpdateTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-RecordId-Updated',
  lastname: `${ctx.runId}-v2`,
  lifecyclestage: 'customer',
});

// Record-id batch: the first contact gets two events with DISJOINT properties (merged into one
// batch input, since HubSpot rejects a duplicate id), the second contact gets one.
export const retlRecordIdDupFirstTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-RecordId-Dup',
  jobtitle: `ci-${ctx.runId}-first`,
});
export const retlRecordIdDupSecondTraits = (ctx: RunContext): Record<string, string> => ({
  lastname: `ci-${ctx.runId}-second`,
  lifecyclestage: 'customer',
});
export const retlRecordIdDupCombinedTraits = (ctx: RunContext): Record<string, string> => ({
  ...retlRecordIdDupFirstTraits(ctx),
  ...retlRecordIdDupSecondTraits(ctx),
});
export const retlRecordIdOtherContactTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-RecordId-Other',
  lastname: `${ctx.runId}-other`,
});

// Additional-email upsert: the two upserts write DISJOINT properties so the read-back can assert the
// single contact carries BOTH sets - proving the primary-email and additional-email upserts landed
// on the same record rather than forking a second one.
export const retlUpsertPrimaryTraits = (ctx: RunContext): Record<string, string> => ({
  firstname: 'CI-Upsert-Primary',
  jobtitle: `ci-${ctx.runId}-primary`,
});
export const retlUpsertSecondaryTraits = (ctx: RunContext): Record<string, string> => ({
  lastname: `ci-${ctx.runId}-secondary`,
  lifecyclestage: 'customer',
});
// Union of both upserts' traits - the state the single contact must end in.
export const retlUpsertCombinedTraits = (ctx: RunContext): Record<string, string> => ({
  ...retlUpsertPrimaryTraits(ctx),
  ...retlUpsertSecondaryTraits(ctx),
});
