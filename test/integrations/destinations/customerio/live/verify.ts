import type { RunContext } from '../../../live/types';
import { retryUntilPasses } from '../../../live/poll';
import {
  getActivities,
  getObjectAttributes,
  getPerson,
  getRelationships,
  type CioActivity,
} from './api';
import {
  GROUP_OBJECT_TYPE_ID,
  SCREEN_EVENT_NAME,
  TRACK_EVENT_NAME,
  aliasTraits,
  deviceToken,
  groupTraits,
  identifyTraits,
  pageProperties,
  recordIdentifiers,
  trackProperties,
} from './profiles';

// CustomerIO ingests asynchronously — attributes settle in a second or two, activities can take
// longer. Every read-back is wrapped so a slow write surfaces as a real matcher diff on the last
// attempt rather than a bare timeout.
const eventually = (assert: () => Promise<void>): Promise<void> =>
  retryUntilPasses(assert, {
    attempts: 6,
    delayMs: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

// "Attributes are all stored as strings" (App API reference), so a numeric trait like
// `revenue: 42` reads back as "42". Normalise the expected side rather than loosening the matcher.
const asStrings = (want: Record<string, unknown>): Record<string, string> =>
  Object.fromEntries(Object.entries(want).map(([k, v]) => [k, String(v)]));

// Activity `data`, unlike person attributes, is NOT stringified — a live probe confirms a numeric
// property round-trips as a number (`revenue: 42` reads back as 42, not "42"). So this asserts the
// values exactly: a V2 payload that arrives accepted-but-mis-shaped (properties nested wrong,
// dropped, or coerced to strings) fails here rather than passing as a 2xx.
const dataMatches = (data: Record<string, unknown> | undefined, want: Record<string, unknown>) =>
  expect(data ?? {}).toMatchObject(want);

const findByName = (activities: CioActivity[], name: string): CioActivity | undefined =>
  activities.find((a) => a.name === name);

// ---------------------------------------------------------------------------
// Cross-scenario parity snapshot
// ---------------------------------------------------------------------------

// The observable person surface a scenario produced, with every run-scoped value replaced by a
// placeholder so two scenarios can be compared directly.
export interface PersonSnapshot {
  attributes: Record<string, string>;
  activities: string[];
  devices: string[];
  relationships: string[];
}

const snapshots = new Map<string, PersonSnapshot>();

// identity() and email() both embed runId, so scrubbing it normalises every run-scoped value.
const scrub = (value: string, runId: string): string => value.split(runId).join('<runId>');

// The ONE state difference between the two rollout paths that this parity check tolerates.
//
// Screen events change CustomerIO activity type when the flag flips: V1 records a screen as an
// `event` (transform.ts:107 sets evType = 'event' for EventType.SCREEN), V2 records it as a
// `screen` (v2/util.ts:137, action: 'screen'). Confirmed live — with the flag off the profile has
// no `screen` activity at all; with it on, it does.
//
// This is a migration hazard rather than a transport detail: for a customer enabling the flag, any
// CustomerIO segment, campaign trigger or report that matches "Viewed X Screen" as an event stops
// matching (and vice versa). It is normalised here rather than left to fail so that the check stays
// useful — every OTHER difference between the two paths still fails this assertion.
const SCREEN_ACTIVITY = /^(?:event|screen):(Viewed .* Screen)$/;
const normaliseKnownDivergence = (activity: string): string =>
  activity.replace(SCREEN_ACTIVITY, 'screen-or-event:$1');

const comparable = (snapshot: PersonSnapshot): PersonSnapshot => ({
  ...snapshot,
  activities: snapshot.activities.map(normaliseKnownDivergence).sort(),
});

// ---------------------------------------------------------------------------
// Read-backs
// ---------------------------------------------------------------------------

/**
 * The whole event-stream surface written to the 'user' profile: identify traits, the track / page /
 * screen activities with their properties, the registered device, and the group object link.
 *
 * Must run BEFORE the alias step, which merges 'user' into 'alias'.
 *
 * Also records the scenario's parity snapshot (see verifyFlagParity).
 */
export const verifyPersonState =
  (scenarioId: string) =>
  async (ctx: RunContext): Promise<void> => {
    const userId = ctx.identity('user');

    await eventually(async () => {
      const person = await getPerson(ctx, userId);
      expect(person).not.toBeNull();
      expect(person?.identifiers?.id).toBe(userId);
      // Identify traits landed on the profile.
      expect(person?.attributes).toMatchObject(asStrings(identifyTraits(ctx)));
      // The device-related track event registered a device rather than recording an event.
      expect(person?.devices ?? []).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: deviceToken(ctx), platform: 'ios' }),
        ]),
      );
    });

    // Activities are read back per App API activity type. Each one asserts its `data` as well as
    // its presence, so a V2 payload that CustomerIO accepts but stores mis-shaped (properties
    // nested wrong, dropped, or coerced) fails here instead of passing as a 2xx.
    await eventually(async () => {
      const events = await getActivities(ctx, userId, { type: 'event' });
      const track = findByName(events, TRACK_EVENT_NAME);
      expect(track).toBeDefined();
      dataMatches(track?.data, trackProperties(ctx));
    });

    // CustomerIO does NOT retain a page event's name: `page` activities come back with `data` only.
    // The App API documents `name` as "the name of the event, for `event` and `screen` activities",
    // and a live probe confirms it is absent on page activities. A page's name is therefore not
    // observable at the destination on either rollout path — what IS assertable is that exactly one
    // page activity landed, carrying the right properties.
    await eventually(async () => {
      const pages = await getActivities(ctx, userId, { type: 'page' });
      expect(pages).toHaveLength(1);
      dataMatches(pages[0]?.data, pageProperties(ctx));
    });

    // Deliberately path-agnostic about the activity TYPE: this asserts only that the screen event
    // landed under the right name with the right properties. The two rollout paths disagree on the
    // type (V1 records a screen as an `event` — transform.ts:107; V2 as a `screen` — v2/util.ts:129),
    // and surfacing that disagreement is verifyFlagParity's job, where it shows up as a real diff
    // rather than as an ambiguous "not found" here.
    await eventually(async () => {
      const [events, screens] = await Promise.all([
        getActivities(ctx, userId, { type: 'event' }),
        getActivities(ctx, userId, { type: 'screen' }),
      ]);
      const screen = findByName([...events, ...screens], SCREEN_EVENT_NAME);
      expect(screen).toBeDefined();
      dataMatches(screen?.data, pageProperties(ctx));
    });

    // The group step must LINK the object to the person, not merely create it.
    await eventually(async () => {
      const relationships = await getRelationships(ctx, userId);
      // The App API returns object_type_id as a string ("1") even though the OpenAPI spec types it
      // as an integer — normalise both sides rather than trusting either.
      expect(
        relationships.map((r) => ({
          objectTypeId: String(r.object_type_id),
          objectId: r.identifiers?.object_id,
        })),
      ).toEqual(
        expect.arrayContaining([
          { objectTypeId: GROUP_OBJECT_TYPE_ID, objectId: ctx.identity('group') },
        ]),
      );
      const objectAttributes = await getObjectAttributes(ctx, ctx.identity('group'));
      expect(objectAttributes).not.toBeNull();
      expect(asStrings(objectAttributes ?? {})).toMatchObject(asStrings(groupTraits(ctx)));
    });

    // Record the normalised surface for the cross-scenario comparison.
    const person = await getPerson(ctx, userId);
    const [events, pages, screens, relationships] = await Promise.all([
      getActivities(ctx, userId, { type: 'event' }),
      getActivities(ctx, userId, { type: 'page' }),
      getActivities(ctx, userId, { type: 'screen' }),
      getRelationships(ctx, userId),
    ]);
    const seededKeys = Object.keys(identifyTraits(ctx));
    snapshots.set(scenarioId, {
      attributes: Object.fromEntries(
        seededKeys.map((k) => [k, scrub(String(person?.attributes?.[k] ?? ''), ctx.runId)]),
      ),
      activities: [
        ...events.map((a) => `event:${a.name}`),
        // Page activities carry no name (see above), so key them by url to keep the snapshot stable.
        ...pages.map((a) => `page:${(a.data ?? {}).url}`),
        ...screens.map((a) => `screen:${a.name}`),
      ]
        .map((s) => scrub(s, ctx.runId))
        .sort(),
      devices: (person?.devices ?? [])
        .map((d) => `${d.platform}:${scrub(d.id ?? '', ctx.runId)}`)
        .sort(),
      relationships: relationships
        .map((r) => `${r.object_type_id}:${scrub(r.identifiers?.object_id ?? '', ctx.runId)}`)
        .sort(),
    });
  };

/** The record profile carries the identifiers it was inserted with. */
export const verifyRecordProfile = async (ctx: RunContext): Promise<void> => {
  const recordId = ctx.identity('record');
  await eventually(async () => {
    const person = await getPerson(ctx, recordId);
    expect(person).not.toBeNull();
    expect(person?.identifiers?.id).toBe(recordId);
    expect(person?.attributes).toMatchObject(asStrings(recordIdentifiers(ctx)));
  });
};

/**
 * The alias step merges 'user' (secondary) into 'alias' (primary), so afterwards the surviving
 * 'alias' profile must carry the traits identify wrote to 'user'. A 200 from the merge call proves
 * none of that — and the merge is irreversible, which makes this the highest-risk unverified write
 * in the spec.
 */
export const verifyMerge = async (ctx: RunContext): Promise<void> => {
  await eventually(async () => {
    const merged = await getPerson(ctx, ctx.identity('alias'));
    expect(merged).not.toBeNull();
    // The primary keeps its own traits...
    expect(merged?.attributes).toMatchObject({ lastName: aliasTraits(ctx).lastName });
    // ...and absorbs the secondary's. `firstName` was only ever written to the 'user' profile, so
    // finding it here is what proves the two profiles were actually combined. (Email is not
    // asserted: on a merge CustomerIO keeps the primary's, so it is not evidence either way.)
    expect(merged?.attributes).toMatchObject({ firstName: identifyTraits(ctx).firstName });
    // The secondary is consumed by the merge.
    expect(await getPerson(ctx, ctx.identity('user'))).toBeNull();
  });
};

/**
 * The assertion that makes the two rollout scenarios mean different things.
 *
 * Both scenarios seed identical events; only CUSTOMERIO_EVENT_STREAM_V2_API_ENABLED differs. The
 * pipeline steps alone cannot tell them apart — both just get 2xx. This asserts that the observable
 * CustomerIO state is byte-identical across the flag flip: same attributes, same activity types and
 * names, same device, same object link. That is precisely the claim the flag makes, and it is not
 * checkable by the component suite, which sees request shapes rather than destination state.
 */
export const verifyFlagParity =
  (scenarioId: string, baselineScenarioId: string) => async (): Promise<void> => {
    const own = snapshots.get(scenarioId);
    expect(own).toBeDefined();
    const baseline = snapshots.get(baselineScenarioId);
    if (!baseline) {
      // Running this scenario alone (e.g. -t filtering) is legitimate; say so loudly rather than
      // passing a comparison that never happened.
      // eslint-disable-next-line no-console
      console.warn(
        `[live:customerio] parity check skipped: no snapshot for baseline scenario ` +
          `'${baselineScenarioId}'. Run the full spec to compare the two rollout states.`,
      );
      return;
    }
    expect(comparable(own as PersonSnapshot)).toEqual(comparable(baseline));
  };
