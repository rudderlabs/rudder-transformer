import { pollUntil } from '@rudderstack/integrations-lib/build/live-test';
import type { LiveSpec, RunContext } from '../../../live/types';
import {
  customAttributeNameFromSecret,
  existingIdentifyId,
  fetchCustomAttributes,
  fetchMembership,
  setCustomAttributes,
  setMembership,
  TRAIT_ATTRIBUTES,
  unknownIdentifyId,
} from './api';

// LIVE_SECRET_GAINSIGHT_PX_AUDIENCE='{"config":{"apiKey":"…","dataCenter":"US"},
//   "resourceIds":{"identifyId":"rs-gpx-live-1","customAttributeName":"rs_gpx_e2e"}}'
// rs-gpx-live-1 is created once in the sandbox; rs_gpx_e2e is a Boolean custom attribute;
// rs_gpx_string (String), rs_gpx_number (Number) and rs_gpx_date (Date) are custom attributes
// created once in the sandbox.

const recordSeed =
  (
    action: 'insert' | 'update' | 'delete',
    identifyId: (ctx: RunContext) => string,
    fields: (ctx: RunContext) => Record<string, unknown> = () => ({}),
  ) =>
  (ctx: RunContext): Record<string, unknown> => ({
    type: 'record',
    action,
    fields: fields(ctx),
    channel: 'sources',
    context: {
      sources: {
        job_id: `live-${ctx.runId}`,
        version: 'live',
        job_run_id: ctx.runId,
        task_run_id: ctx.runId,
      },
    },
    recordId: ctx.identity('record'),
    identifiers: { identifyId: identifyId(ctx) },
  });

const expectMembership = (expected: boolean) => async (ctx: RunContext) => {
  expect(await fetchMembership(ctx)).toBe(expected);
};

const POLL = { attempts: 8, delayMs: (attempt: number) => 2000 * Math.min(attempt + 1, 4) };

// Longer than PX's GET /users read lag (~5–13 s), so a value still read after it is the settled one.
const SETTLE_MS = 20000;
const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const seedMembershipTrue = async (ctx: RunContext) => {
  await setMembership(ctx, true);
  await pollUntil(async () => ({ done: (await fetchMembership(ctx)) === true, value: null }), {
    label: 'seeded true',
    ...POLL,
  });
};

/**
 * Settled read-back: the value must read `expected`, then still read `expected` after SETTLE_MS.
 * A single eventually-consistent read can catch an intermediate write, so it cannot prove order.
 */
const expectSettledMembership = (expected: boolean) => async (ctx: RunContext) => {
  expect(await fetchMembership(ctx)).toBe(expected);
  await sleep(SETTLE_MS);
  expect(await fetchMembership(ctx)).toBe(expected);
};

const TRAIT_DATE = '2026-10-20T10:00:00Z';
// PX documents DATE_TIME as epoch ms GMT; read-back may come as a number or an ISO string
// (trait-mappings §8 Q1), so compare instants.
const asEpochMs = (value: unknown): number =>
  typeof value === 'number' ? value : Date.parse(String(value));

const expectAllTraits = async (ctx: RunContext) => {
  const attributes = await fetchCustomAttributes(ctx);
  expect(attributes[customAttributeNameFromSecret(ctx.liveSecret)]).toBe(true);
  expect(attributes[TRAIT_ATTRIBUTES.string]).toBe(`role-${ctx.runId}`);
  expect(attributes[TRAIT_ATTRIBUTES.number]).toBe(42);
  expect(asEpochMs(attributes[TRAIT_ATTRIBUTES.date])).toBe(Date.parse(TRAIT_DATE));
};

const expectBadTraitLeftOut = async (ctx: RunContext) => {
  const attributes = await fetchCustomAttributes(ctx);
  expect(attributes[customAttributeNameFromSecret(ctx.liveSecret)]).toBe(true);
  expect(attributes[TRAIT_ATTRIBUTES.string]).toBe(`kept-${ctx.runId}`);
  expect(attributes[TRAIT_ATTRIBUTES.number]).toBe(7);
};

export const live = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (s) => ({ ...s.config }),
  resolveConnection: (s) => ({
    destination: {
      customAttributeName: customAttributeNameFromSecret(s),
      syncMode: 'mirror',
      schemaVersion: '1.1',
      identifierMappings: [{ from: 'user_id', to: 'identifyId' }],
      // Every scenario maps the traits; the v1 scenarios seed no `fields`, so their writes stay
      // flag-only (a missing value is left out silently).
      fieldMappings: [
        { from: 'role', to: TRAIT_ATTRIBUTES.string, type: 'STRING' },
        { from: 'events', to: TRAIT_ATTRIBUTES.number, type: 'NUMBER' },
        { from: 'last_visit', to: TRAIT_ATTRIBUTES.date, type: 'DATE_TIME' },
      ],
    },
  }),
  scenarios: [
    {
      id: 'gainsight-px-audience-join',
      description: 'insert sets the attribute true on an existing user',
      cleanup: (ctx: RunContext) => setMembership(ctx, false),
      steps: [
        {
          stepType: 'action',
          name: 'precondition false',
          run: (ctx: RunContext) => setMembership(ctx, false),
        },
        {
          name: 'insert → true',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('insert', existingIdentifyId),
        },
      ],
      verify: { check: expectMembership(true), ...POLL },
    },
    {
      id: 'gainsight-px-audience-leave',
      description: 'delete sets the attribute false; the user is kept',
      cleanup: (ctx: RunContext) => setMembership(ctx, false),
      steps: [
        {
          stepType: 'action',
          name: 'precondition true',
          run: seedMembershipTrue,
        },
        {
          name: 'delete → false',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('delete', existingIdentifyId),
        },
      ],
      verify: { check: expectMembership(false), ...POLL },
    },
    {
      id: 'gainsight-px-audience-unknown-user',
      description:
        'insert for a user PX does not know is NOT delivered (404 → abort); no user is created',
      steps: [
        {
          name: 'insert unknown → abort',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('insert', unknownIdentifyId),
          expectedFailure: { items: [0] },
        },
      ],
    },
    {
      id: 'gainsight-px-audience-update',
      description: 'update sets the attribute true on an existing user',
      cleanup: (ctx: RunContext) => setMembership(ctx, false),
      steps: [
        {
          stepType: 'action',
          name: 'precondition false',
          run: (ctx: RunContext) => setMembership(ctx, false),
        },
        {
          name: 'update → true',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('update', existingIdentifyId),
        },
      ],
      verify: { check: expectMembership(true), ...POLL },
    },
    {
      id: 'gainsight-px-audience-same-batch',
      description:
        'insert then delete for one user in a single router call are delivered in order; ends false',
      cleanup: (ctx: RunContext) => setMembership(ctx, false),
      steps: [
        // Start from true: reversed delivery (delete, then insert) would settle on true.
        { stepType: 'action', name: 'precondition true', run: seedMembershipTrue },
        {
          name: 'insert + delete in one /routerTransform call',
          stepType: 'pipeline',
          // maxItems 1: two router outputs, two PUTs, sent in seed order.
          expectedOutputs: 2,
          expectedProxyRequests: 2,
          seed: (ctx: RunContext) => [
            recordSeed('insert', existingIdentifyId)(ctx),
            recordSeed('delete', existingIdentifyId)(ctx),
          ],
        },
      ],
      verify: { check: expectSettledMembership(false), ...POLL },
    },
    {
      id: 'gainsight-px-audience-traits',
      description: 'insert writes the flag plus a STRING, NUMBER and DATE_TIME trait in one PUT',
      cleanup: (ctx: RunContext) => setMembership(ctx, false),
      steps: [
        {
          stepType: 'action',
          name: 'precondition false',
          run: (ctx: RunContext) => setMembership(ctx, false),
        },
        {
          name: 'insert with three traits',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('insert', existingIdentifyId, (ctx) => ({
            [TRAIT_ATTRIBUTES.string]: `role-${ctx.runId}`,
            [TRAIT_ATTRIBUTES.number]: '42',
            [TRAIT_ATTRIBUTES.date]: TRAIT_DATE,
          })),
        },
      ],
      verify: { check: expectAllTraits, ...POLL },
    },
    {
      id: 'gainsight-px-audience-trait-unconvertible',
      description:
        'an unconvertible NUMBER trait is left out; the flag and the STRING trait still land',
      cleanup: (ctx: RunContext) => setMembership(ctx, false),
      steps: [
        {
          stepType: 'action',
          name: 'precondition flag false, number 7',
          run: (ctx: RunContext) =>
            setCustomAttributes(ctx, {
              [customAttributeNameFromSecret(ctx.liveSecret)]: false,
              [TRAIT_ATTRIBUTES.number]: 7,
            }),
        },
        {
          name: 'insert with number "abc"',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: recordSeed('insert', existingIdentifyId, (ctx) => ({
            [TRAIT_ATTRIBUTES.string]: `kept-${ctx.runId}`,
            [TRAIT_ATTRIBUTES.number]: 'abc',
          })),
        },
      ],
      verify: { check: expectBadTraitLeftOut, ...POLL },
    },
  ],
} satisfies LiveSpec;

export default live;
