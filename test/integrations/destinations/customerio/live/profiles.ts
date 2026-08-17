import type { RunContext } from '../../../live/types';

// Shared `(ctx) => ({ ... })` factories used by BOTH the pipeline seeds and the verify read-backs.
// Nothing here is duplicated on the assertion side — a seed and its assertion cannot drift.

// CustomerIO's default object type; the group/object steps and their read-back both use it.
export const GROUP_OBJECT_TYPE_ID = '1';

export const identifyTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email(),
  firstName: 'CI-Identify',
  ciRun: ctx.runId,
});

// Traits for the merge PRIMARY ('alias'). Deliberately disjoint from identifyTraits' `firstName`:
// after the merge the surviving profile must carry this profile's own `lastName` AND the secondary's
// `firstName`, which together prove the two profiles were actually combined.
export const aliasTraits = (ctx: RunContext): Record<string, string> => ({
  email: ctx.email('alias'),
  lastName: 'CI-Alias',
  ciRun: ctx.runId,
});

export const trackProperties = (ctx: RunContext): Record<string, unknown> => ({
  plan: 'enterprise',
  revenue: 42,
  ciRun: ctx.runId,
});

export const pageProperties = (ctx: RunContext): Record<string, unknown> => ({
  url: 'https://www.rudderstack.com/live',
  title: 'Home',
  ciRun: ctx.runId,
});

export const groupTraits = (ctx: RunContext): Record<string, unknown> => ({
  name: 'CI Live Account',
  plan: 'enterprise',
  ciRun: ctx.runId,
});

export const recordIdentifiers = (ctx: RunContext): Record<string, string> => ({
  id: ctx.identity('record'),
  email: ctx.email('record'),
  ciRun: ctx.runId,
});

export const deviceToken = (ctx: RunContext): string => `tok-${ctx.runId}`;

// The transform only registers a device when the event name is device-related AND
// context.device.token is present (isdeviceRelatedEventName / deviceActionFor).
export const deviceContext = (ctx: RunContext) => ({
  device: { token: deviceToken(ctx), type: 'ios' },
  os: { name: 'iOS', version: '17.0' },
});

// Event names as CustomerIO records them. Both rollout states must agree on every one of these —
// that agreement is currently accidental, and these constants are what pin it:
//   track  — V1 transform.ts `evName = message.event`; V2 buildTrack(message, message.event).
//   page   — V1 `message.name || properties.url`; V2 buildPage(..., name || properties.url).
//   screen — V1 wraps at transform.ts:103; V2 buildScreen wraps at v2/util.ts:137. The V2 caller
//            (routerTransform.ts:89) passes the RAW `message.event`, so there is no double-wrap.
export const TRACK_EVENT_NAME = 'CI Live Order Completed';
export const SCREEN_EVENT_NAME = 'Viewed Home Screen';
// Seed-side only: CustomerIO discards a page event's name, so unlike the two above this one is not
// assertable at the destination (see the page read-back in verify.ts).
export const PAGE_EVENT_NAME = 'Home';

// A device-related track event becomes a device write on BOTH paths (V1 defaultResponseBuilder's
// deviceRegister branch, V2 buildDevice via deviceActionFor) — it is deliberately NOT asserted as
// an `event` activity, because neither path records one.
export const DEVICE_EVENT_NAME = 'Application Installed';
