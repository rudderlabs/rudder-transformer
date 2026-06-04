import validator from 'validator';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { HashingType, type AudienceField } from '../../util/audienceUtils';
import { PROJECT_TYPES, type ProjectType } from './config';
import type { IterableSubscriber } from './types';

type IdentifierKey = 'email' | 'userId';

// `processAudienceRecord` consumes this map keyed by the same names returned by
// `remapToIterableFields`. Every field is `HashingType.NONE` because Iterable's
// list API does not accept hashed identifiers.
export const IDENTIFIER_FIELD_CONFIG: Record<IdentifierKey, AudienceField> = {
  email: {
    hashingType: HashingType.NONE,
    // `processAudienceRecord` preserves the raw value type for non-hashable
    // fields, so coerce to string here (e.g. a numeric identifier → its string
    // form) before normalizing.
    normalize: (v: unknown) => String(v).trim().toLowerCase(),
    validate: (v: unknown) => typeof v === 'string' && validator.isEmail(v),
  },
  userId: {
    hashingType: HashingType.NONE,
    normalize: (v: unknown) => String(v),
    // Reject leading/trailing whitespace — Iterable treats whitespace-padded
    // userIds as distinct identifiers, which surfaces as a `notFoundUserIds`
    // mismatch on unsubscribe.
    validate: (v: unknown) => typeof v === 'string' && v.length > 0 && v === v.trim(),
  },
};

// Choose which identifier(s) to send to Iterable for a single row.
// Hybrid projects send both `email` and `userId` when both are present;
// single-identifier projects send only their configured field.
export const selectIdentifierForRow = (
  processed: Partial<Record<IdentifierKey, string>>,
  projectType: ProjectType,
): IterableSubscriber => {
  const hasEmail = typeof processed.email === 'string' && processed.email.length > 0;
  const hasUserId = typeof processed.userId === 'string' && processed.userId.length > 0;

  if (projectType === PROJECT_TYPES.HYBRID) {
    // Send both identifiers when a row has both, so Iterable can match on either.
    if (hasUserId && hasEmail) {
      return { userId: processed.userId as string, email: processed.email as string };
    }
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
