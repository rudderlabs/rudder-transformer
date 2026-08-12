import type { LiveStep, RunContext } from '../../../live/types';
import { pollUntil } from '../../../live/poll';
import {
  findPersonByEmail,
  findPersonsByEmail,
  getObjectAttributes,
  getPersonActivities,
  getPersonAttributes,
  getPersonDevices,
  getPersonRelationships,
} from './api';
import { deviceToken, groupId, mergePrimaryAttributes, objectTypeId } from './profiles';

// Everything exported as a scenario-level `verify.check` here is a SINGLE-SHOT assertion: the
// framework wraps it in retryUntilPasses and owns the backoff, so a check must not also poll
// internally (nesting the two compounds the waits and blows past the runner's per-step timeout).
// The one exception is `verifyDeviceRegistered`, a mid-scenario VerifyStep — steps are NOT retried,
// so that one polls itself.

// Read the profile back by its `id` and assert it carries the seeded traits. CustomerIO maps traits
// straight onto attributes, so the seed profile is also the expected shape.
const verifyPersonAttributesById =
  (identifier: (ctx: RunContext) => string, traits: (ctx: RunContext) => Record<string, string>) =>
  async (ctx: RunContext): Promise<void> => {
    const attributes = await getPersonAttributes(ctx, identifier(ctx));
    expect(attributes).not.toBeNull();
    expect(attributes).toMatchObject(traits(ctx));
  };

// The common case: the person is keyed by a ctx identity rather than an arbitrary identifier.
export const verifyPersonAttributes = (
  traits: (ctx: RunContext) => Record<string, string>,
  entity = 'user',
) => verifyPersonAttributesById((ctx) => ctx.identity(entity), traits);

// The email-only identify writes a person addressed solely by email. Resolve them by email first,
// then read attributes through cio_id — that works whether or not `email` is enabled as an
// identifier in the workspace (id_type=email 400s in an id-only workspace).
export const verifyPersonAttributesByEmail =
  (email: (ctx: RunContext) => string, traits: (ctx: RunContext) => Record<string, string>) =>
  async (ctx: RunContext): Promise<void> => {
    const person = await findPersonByEmail(ctx, email(ctx));
    expect(person?.cio_id).toBeDefined();
    const attributes = person ? await getPersonAttributes(ctx, person.cio_id, 'cio_id') : null;
    expect(attributes).not.toBeNull();
    expect(attributes).toMatchObject(traits(ctx));
  };

// Assert the event landed on the person's activity feed. CustomerIO reports the activity's identity
// in `name` for `event`/`screen` activities but in `url` for `page` activities, so both fields are
// searched. Matched by that identity and never by activity `type`: v1 records a screen as an `event`
// activity while v2 records it as a `screen`, so pinning the type would make this path-specific.
export const verifyActivityNamed =
  (activityName: (ctx: RunContext) => string, entity = 'user') =>
  async (ctx: RunContext): Promise<void> => {
    const activities = await getPersonActivities(ctx, ctx.identity(entity));
    const identities = activities
      .flatMap((activity) => [activity.name, activity.url])
      .filter((identity): identity is string => typeof identity === 'string');
    expect(identities).toContain(activityName(ctx));
  };

// An email-shaped userId must resolve to ONE profile across a whole event sequence, which then
// carries the email-less track event and the second identify's update.
//
// Written against v1, the current production path. A live comparison found the two paths file the
// address under DIFFERENT identifiers: v1 addresses the person as `PUT /customers/<email>` and
// CustomerIO stores it as the email identifier (`id` reads back empty), while v2 declares
// `identifiers.id = <email>` so the id becomes the email string. That is a real divergence — the
// same event stream keys profiles differently before and after the batching rollout — and the
// intent is to fix v2, not to encode both behaviours here.
//
// The reads below go through `cio_id` because it is the one handle both paths agree on, so a v2
// regression surfaces as a duplicate-profile or missing-update failure rather than as an unrelated
// lookup 404 that obscures it.
export const verifyEmailUserIdStaysOneProfile =
  (
    email: (ctx: RunContext) => string,
    updatedTraits: (ctx: RunContext) => Record<string, string>,
    activityName: (ctx: RunContext) => string,
  ) =>
  async (ctx: RunContext): Promise<void> => {
    const address = email(ctx);

    // A forked duplicate is the failure this scenario exists to catch, so assert the count first —
    // it fails printing the actual matches rather than as an opaque attribute mismatch.
    const matches = await findPersonsByEmail(ctx, address);
    expect(matches).toHaveLength(1);

    const cioId = matches[0]?.cio_id;
    expect(cioId).toBeDefined();

    const attributes = cioId ? await getPersonAttributes(ctx, cioId, 'cio_id') : null;
    expect(attributes).not.toBeNull();
    expect(attributes).toMatchObject(updatedTraits(ctx));

    const activities = cioId ? await getPersonActivities(ctx, cioId, 'cio_id') : [];
    expect(activities.map((activity) => activity.name)).toContain(activityName(ctx));
  };

// The person must be linked to the object the group call addressed (the cio_relationship half).
export const verifyPersonLinkedToObject =
  (entity = 'user') =>
  async (ctx: RunContext): Promise<void> => {
    const relationships = await getPersonRelationships(ctx, ctx.identity(entity));
    expect(
      relationships.map((relationship) => ({
        objectTypeId: String(relationship.object_type_id),
        objectId: relationship.identifiers?.object_id,
      })),
    ).toContainEqual({ objectTypeId: objectTypeId(ctx), objectId: groupId(ctx) });
  };

// A group `identify` writes both halves — the object with its attributes, and the relationship. A
// v2/batch response can be a 207 whose per-item error the delivery verdict already surfaces, but
// only this read-back proves both halves actually landed.
export const verifyObjectCreatedAndLinked =
  (attributes: (ctx: RunContext) => Record<string, string>, entity = 'user') =>
  async (ctx: RunContext): Promise<void> => {
    const objectAttributes = await getObjectAttributes(ctx, objectTypeId(ctx), groupId(ctx));
    expect(objectAttributes).not.toBeNull();
    expect(objectAttributes).toMatchObject(attributes(ctx));

    await verifyPersonLinkedToObject(entity)(ctx);
  };

// Mid-scenario read-back between the device-add and device-delete pipeline steps. A VerifyStep is
// not retried by the framework, so it polls internally (soft:true so the closing expect still
// prints a real diff once attempts are exhausted).
export const verifyDeviceRegistered: LiveStep = {
  stepType: 'verify',
  name: 'verify device token is registered',
  check: async (ctx: RunContext): Promise<void> => {
    const token = deviceToken(ctx);
    // 6 attempts (reads at ~0,1,3,7,15,31s): device ingestion lags further behind than attribute
    // and activity ingestion do.
    const devices = await pollUntil(
      async () => {
        const found = await getPersonDevices(ctx, ctx.identity('user'));
        return { done: Boolean(found?.some((device) => device.id === token)), value: found };
      },
      { label: 'device registration', attempts: 6, delayMs: (n) => 1000 * 2 ** n, soft: true },
    );
    // null means the person itself wasn't returned — a different failure from "no devices yet".
    expect(devices).not.toBeNull();
    expect(devices ?? []).toContainEqual(expect.objectContaining({ id: token }));
  },
};

// The closing half of the device scenario: the uninstall event must have removed the token again.
export const verifyDeviceRemoved = async (ctx: RunContext): Promise<void> => {
  const devices = await getPersonDevices(ctx, ctx.identity('user'));
  expect(devices).not.toBeNull();
  expect(devices ?? []).not.toContainEqual(expect.objectContaining({ id: deviceToken(ctx) }));
};

// The merge's contract-guaranteed effect: the secondary profile stops resolving and the primary
// survives with its own attributes. CustomerIO doesn't define how conflicting attributes are
// reconciled across a merge, so this deliberately doesn't assert attribute transfer.
export const verifyProfilesMerged = async (ctx: RunContext): Promise<void> => {
  const secondary = await getPersonAttributes(ctx, ctx.identity('merge-secondary'));
  expect(secondary).toBeNull();

  const primary = await getPersonAttributes(ctx, ctx.identity('merge-primary'));
  expect(primary).not.toBeNull();
  expect(primary).toMatchObject(mergePrimaryAttributes(ctx));
};
