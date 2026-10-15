import { HashingType, toAudienceFieldConfig } from '../../util/audienceUtils';
import { IDENTIFIERS, RECORD_KEY_BY_IDENTIFIER, type PinterestIdentifier } from './config';
import type { PinterestRecordRow } from './types';

// Spec §3.3. processAudienceRecord normalises, then validates, then hashes. A value that fails
// `validate` is dropped and counted on `pinterest_audience_invalid_field`.
const EMAIL_SHAPE = /^[^@]+@[^@]+$/;
// Pinterest: "AAIDs must be lowercase … 8-4-4-4-12".
const MAID_SHAPE = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/;
// E.164 length including the country code. The pre-hash phone format is assumption P6 (spec §3.3).
const PHONE_SHAPE = /^\d{8,15}$/;

export const PINTEREST_FIELD_CONFIG = toAudienceFieldConfig({
  EMAIL: {
    hashingType: HashingType.SHA256,
    normalize: (v) => v.trim().toLowerCase(),
    validate: (v) => EMAIL_SHAPE.test(v),
  },
  MAID: {
    hashingType: HashingType.SHA256,
    normalize: (v) => v.trim().toLowerCase(),
    validate: (v) => MAID_SHAPE.test(v),
  },
  PHONE: {
    hashingType: HashingType.SHA256,
    normalize: (v) => v.replace(/\D/g, ''),
    validate: (v) => PHONE_SHAPE.test(v),
  },
});

const isPinterestIdentifier = (key: string): key is PinterestIdentifier =>
  (IDENTIFIERS as readonly string[]).includes(key);

/**
 * processAudienceRecord passes a key with no field config through untouched (hashing NONE), and
 * Pinterest rejects any unknown `records_v2` property (`additionalProperties: false`), so drop
 * everything else before processing.
 */
export const pickPinterestIdentifiers = (
  identifiers: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(Object.entries(identifiers).filter(([key]) => isPinterestIdentifier(key)));

/** Rename the processed identifiers to their `CustomerListRecordRow` keys. */
export const toRecordRow = (processed: Record<string, unknown>): PinterestRecordRow =>
  Object.fromEntries(
    IDENTIFIERS.flatMap((identifier) => {
      const value = processed[identifier];
      return typeof value === 'string' ? [[RECORD_KEY_BY_IDENTIFIER[identifier], value]] : [];
    }),
  );
