import { RunContext } from '../../../live/types';

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

export const retlContactContext = (ctx: RunContext) => ({
  mappedToDestination: true,
  externalId: [{ type: 'HS-contacts', identifierType: 'email', id: ctx.email() }],
  sources: { job_id: 'rudder-live-integration-test', version: 'v1' },
});
