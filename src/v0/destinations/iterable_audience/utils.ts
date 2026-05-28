import validator from 'validator';
import { InstrumentationError, ConfigurationError } from '@rudderstack/integrations-lib';
import { HashingType, type AudienceField } from '../../util/audienceUtils';
import { PROJECT_TYPES, type ProjectType } from './config';
import type { IdentifierMapping, IterableSubscriber } from './types';

type IdentifierKey = 'email' | 'userId';

// `processAudienceRecord` consumes this map keyed by the same names returned by
// `remapToIterableFields`. Every field is `HashingType.NONE` because Iterable's
// list API does not accept hashed identifiers.
export const IDENTIFIER_FIELD_CONFIG: Record<IdentifierKey, AudienceField> = {
  email: {
    hashingType: HashingType.NONE,
    normalize: (v: string) => v.trim().toLowerCase(),
    validate: (v: string) => validator.isEmail(v),
  },
  userId: {
    hashingType: HashingType.NONE,
    normalize: (v: string) => v,
    // Reject leading/trailing whitespace — Iterable treats whitespace-padded
    // userIds as distinct identifiers, which surfaces as a `notFoundUserIds`
    // mismatch on unsubscribe.
    validate: (v: string) => v.length > 0 && v === v.trim(),
  },
};

// `message.identifiers` arrives keyed by the canonical Iterable field name
// (`email` / `userId`) — rudder-server pre-resolves the warehouse column to
// the destination field before emitting the record event. The mapping's
// `from` value is metadata for control-plane traceability and is *not* the
// key to look up at this layer; we read by `to` instead. This matches
// `customerio_audience/utils.ts:154`, which also ignores `from` and reads
// the identifier value directly out of `message.identifiers`.
//
// Drops null/undefined/empty values so downstream code can rely on
// presence-checks.
export const remapToIterableFields = (
  rowIdentifiers: Record<string, unknown>,
  mappings: IdentifierMapping[],
): Record<IdentifierKey, unknown> => {
  const out: Partial<Record<IdentifierKey, unknown>> = {};
  for (const { to } of mappings) {
    const raw = rowIdentifiers[to];
    if (raw !== null && raw !== undefined && raw !== '') {
      out[to] = raw;
    }
  }
  return out as Record<IdentifierKey, unknown>;
};

// Choose which identifier to send to Iterable for a single row.
// Hybrid projects prefer `userId` when both are present (more stable identifier
// across browser/device boundaries).
export const selectIdentifierForRow = (
  processed: Partial<Record<IdentifierKey, string>>,
  projectType: ProjectType,
): IterableSubscriber => {
  const hasEmail = typeof processed.email === 'string' && processed.email.length > 0;
  const hasUserId = typeof processed.userId === 'string' && processed.userId.length > 0;

  if (projectType === PROJECT_TYPES.HYBRID) {
    if (hasUserId) return { userId: processed.userId as string };
    if (hasEmail) return { email: processed.email as string };
  } else if (projectType === PROJECT_TYPES.EMAIL_BASED && hasEmail) {
    return { email: processed.email as string };
  } else if (projectType === PROJECT_TYPES.USERID_BASED && hasUserId) {
    return { userId: processed.userId as string };
  }

  throw new InstrumentationError('No valid identifier value for this record');
};

// `updateExistingUsersOnly` is included only when explicitly set on the
// connection config. Iterable defaults the flag to `false` server-side, so
// omitting it on absence keeps the request body minimal and back-compatible
// with existing fixtures.
export const buildSubscribeBody = (
  listId: string | number,
  subscribers: IterableSubscriber[],
  updateExistingUsersOnly?: boolean,
): Record<string, unknown> => ({
  listId,
  subscribers,
  updateExistingUsersOnly,
});

// `channelUnsubscribe: false` is set explicitly — Iterable defaults it to
// `true`, which would unsubscribe the user from *all* messaging channels,
// not just remove them from this audience list.
export const buildUnsubscribeBody = (
  listId: string | number,
  subscribers: IterableSubscriber[],
): Record<string, unknown> => ({
  listId,
  subscribers,
  channelUnsubscribe: false,
});

// Cross-field validation between Destination.Config.projectType and
// connection.config.destination.identifierMappings.
//
// Zod's `superRefine` only sees the object it's attached to, so this check
// lives in user-land code rather than the schema. Called from the
// IterableAudienceIntegration constructor — throws `ConfigurationError` so
// the framework surfaces the failure as a config-error rather than a 400
// instrumentation error.
export const validateProjectTypeMappings = (
  projectType: ProjectType,
  mappings: IdentifierMapping[],
): void => {
  if (projectType === PROJECT_TYPES.EMAIL_BASED) {
    if (mappings.length !== 1 || mappings[0].to !== 'email') {
      throw new ConfigurationError(
        "iterable_audience: 'email-based' project type requires exactly one mapping with 'to' = 'email'",
      );
    }
    return;
  }
  if (projectType === PROJECT_TYPES.USERID_BASED) {
    if (mappings.length !== 1 || mappings[0].to !== 'userId') {
      throw new ConfigurationError(
        "iterable_audience: 'userId-based' project type requires exactly one mapping with 'to' = 'userId'",
      );
    }
    return;
  }
  if (projectType === PROJECT_TYPES.HYBRID) {
    if (mappings.length === 0 || mappings.length > 2) {
      throw new ConfigurationError(
        "iterable_audience: 'hybrid' project type requires 1-2 identifier mappings",
      );
    }
    const fields = new Set(mappings.map((m) => m.to));
    if (fields.size !== mappings.length) {
      throw new ConfigurationError(
        "iterable_audience: 'hybrid' project type requires distinct 'to' values across mappings",
      );
    }
  }
};
