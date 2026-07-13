import validator from 'validator';
import { processAudienceRecord, isValidPhoneNumber, HashingType } from '../../util/audienceUtils';
import type { AudienceField } from '../../util/audienceUtils';
import {
  normalizeEmail,
  normalizePhone,
  normalizeName,
} from '../../util/googleUtils/userDataNormalization';
import type { GaecPayload, UserIdentifierEntry, AddressInfo } from './types';
import { destType } from './config';

/**
 * Per-field normalization and validation rules for GAEC user identifiers.
 * Normalization follows Google Enhanced Conversions requirements:
 * https://developers.google.com/google-ads/api/docs/conversions/enhance-conversions-leads
 *
 * The destKey names in trackConfig.json use the "hashed" prefix per Google's API naming
 * convention. With hashToSha256 removed from the mapping, these fields carry raw values
 * post-constructPayload; this config governs the normalize→validate→hash pipeline.
 */

// String-typed config for compile-time exhaustiveness; bridged to AudienceField below.
const GAEC_STRING_FIELD_CONFIG = {
  hashedEmail: {
    normalize: normalizeEmail,
    validate: validator.isEmail,
    hashingType: HashingType.SHA256,
  },
  hashedPhoneNumber: {
    normalize: normalizePhone,
    validate: isValidPhoneNumber,
    hashingType: HashingType.SHA256,
  },
  hashedFirstName: {
    normalize: normalizeName,
    validate: (v: string) => v.length > 0,
    hashingType: HashingType.SHA256,
  },
  hashedLastName: {
    normalize: normalizeName,
    validate: (v: string) => v.length > 0,
    hashingType: HashingType.SHA256,
  },
  // Google's OfflineUserAddressInfo proto: SHA-256 after normalization (lower case only).
  // Street address is only accepted by ConversionAdjustmentUploadService, so GARL has no
  // equivalent field.
  hashedStreetAddress: {
    normalize: (v: string) => v.trim().toLowerCase(),
    validate: (v: string) => v.length > 0,
    hashingType: HashingType.SHA256,
  },
} as const;

// Bridge string-typed config to the unknown-typed AudienceField interface expected by
// processAudienceRecord — mirrors the same pattern used in GARL's util.ts.
export const GAEC_FIELD_CONFIG: Record<string, AudienceField> = Object.fromEntries(
  Object.entries(GAEC_STRING_FIELD_CONFIG).map(([key, { normalize, validate, ...rest }]) => [
    key,
    {
      ...rest,
      normalize: (v: unknown) => normalize(String(v)),
      validate: (v: unknown) => typeof v === 'string' && validate(v),
    },
  ]),
);

interface ProcessUserIdentifiersContext {
  // The control plane omits requireHash from most configs, so undefined is a real
  // runtime state — it means "hash" (see the isHashRequired mapping below).
  requireHash: boolean | undefined;
  workspaceId: string;
  destinationId: string;
}

/**
 * Runs the normalize → consistency-check → validate → hash pipeline on the five PII fields
 * in the payload's first conversionAdjustment, then prunes identifier entries that end up
 * empty after field drops.
 *
 * The pipeline is fed through processAudienceRecord (audienceUtils.ts) which handles:
 *   1. Hashing-consistency check: throws InstrumentationError when data contradicts requireHash
 *   2. Normalization via the per-field normalize function
 *   3. Validation + field rejection (emits <destType>_invalid_field metric on failure)
 *   4. SHA-256 hashing when isHashRequired=true
 *
 * This function mutates the payload in place, matching the pattern of constructPayload itself.
 *
 * The caller must invoke this AFTER the RESTATEMENT branch, since RESTATEMENT deletes
 * userIdentifiers — calling this on a restatement event would throw spurious hash errors.
 */
export const processUserIdentifiers = (
  payload: GaecPayload,
  { requireHash, workspaceId, destinationId }: ProcessUserIdentifiersContext,
): void => {
  const firstAdjustment = payload.conversionAdjustments?.[0];
  const userIdentifiers = firstAdjustment?.userIdentifiers;
  if (!userIdentifiers) {
    return;
  }

  const audienceDest = {
    workspaceId,
    id: destinationId,
    type: destType,
    // Legacy semantics: missing/undefined requireHash meant "hash" (only explicit `false` disabled it).
    config: { isHashRequired: requireHash !== false },
  };

  // The trackConfig.json mapping produces { hashedEmail } / { hashedPhoneNumber } /
  // { addressInfo: {...} } at fixed indices, but the caller (transform.ts) filters out the
  // null slots of absent fields before this runs, so positions shift (e.g. a missing email
  // moves the phone entry to index 0). Entries are therefore located by content key.
  // (truthiness guards, never `!== undefined` — src/util/lodash-es-core.js shadows global
  // `undefined` project-wide)
  // UserIdentifierEntry has an index signature, so these accesses are type-safe without cast.
  const findEntry = (key: string): UserIdentifierEntry | null =>
    userIdentifiers.find((entry) => entry && entry[key]) ?? null;
  const emailEntry = findEntry('hashedEmail');
  const phoneEntry = findEntry('hashedPhoneNumber');
  const addressEntry = findEntry('addressInfo');

  // Narrow addressInfo once; after the object guard, the index signature on AddressInfo
  // ([key: string]: unknown) makes the assignment structurally valid without a cast.
  let addressInfo: AddressInfo | null = null;
  if (addressEntry) {
    const rawAddressInfo = addressEntry.addressInfo;
    if (rawAddressInfo && typeof rawAddressInfo === 'object' && !Array.isArray(rawAddressInfo)) {
      addressInfo = rawAddressInfo;
    }
  }

  // Collect every present hashable field into ONE record — processAudienceRecord treats each
  // field independently, so a single call is equivalent to per-entry calls and matches how the
  // other integrations (GARL, fb_custom_audience, tiktok_audience) consume it.
  // Only string/number values are usable PII: the mapping can resolve a whole object (e.g.
  // hashedStreetAddress falling back to context.traits.address), and hashing String(object)
  // would ship a useless sha256("[object Object]") identifier. Non-scalar values are deleted
  // from the payload so they can't leak through unprocessed.
  const rawFields: Record<string, unknown> = {};
  const collectHashableField = (entry: Record<string, unknown> | null, key: string): void => {
    if (!entry) {
      return;
    }
    const value = entry[key];
    if (!value) {
      return;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      rawFields[key] = value;
    } else {
      // eslint-disable-next-line no-param-reassign -- intentional in-place delete of an unusable non-scalar field
      delete entry[key];
    }
  };
  collectHashableField(emailEntry, 'hashedEmail');
  collectHashableField(phoneEntry, 'hashedPhoneNumber');
  collectHashableField(addressInfo, 'hashedFirstName');
  collectHashableField(addressInfo, 'hashedLastName');
  collectHashableField(addressInfo, 'hashedStreetAddress');

  if (Object.keys(rawFields).length > 0) {
    const processed = processAudienceRecord(rawFields, {
      fieldConfigs: GAEC_FIELD_CONFIG,
      destination: audienceDest,
    });

    // Write each processed field back to the entry it came from, or delete it when the
    // pipeline dropped it (invalid or empty after normalization).
    const writeBack = (target: Record<string, unknown>, key: string): void => {
      if (!rawFields[key]) {
        return;
      }
      const processedValue = processed[key];
      if (processedValue && typeof processedValue === 'string') {
        // eslint-disable-next-line no-param-reassign -- intentional in-place write-back into the payload entry
        target[key] = processedValue;
      } else {
        // eslint-disable-next-line no-param-reassign -- intentional in-place delete of a field the pipeline dropped
        delete target[key];
      }
    };
    if (emailEntry) {
      writeBack(emailEntry, 'hashedEmail');
    }
    if (phoneEntry) {
      writeBack(phoneEntry, 'hashedPhoneNumber');
    }
    if (addressInfo) {
      writeBack(addressInfo, 'hashedFirstName');
      writeBack(addressInfo, 'hashedLastName');
      writeBack(addressInfo, 'hashedStreetAddress');
    }
  }

  // Prune addressInfo if all hashable fields were dropped AND there are no non-hashable
  // address fields (city, state, countryCode, postalCode) to preserve.
  if (addressEntry && addressInfo) {
    const hasHashableField =
      addressInfo.hashedFirstName || addressInfo.hashedLastName || addressInfo.hashedStreetAddress;
    const hasNonHashableField =
      addressInfo.city || addressInfo.state || addressInfo.countryCode || addressInfo.postalCode;

    if (!hasHashableField && !hasNonHashableField) {
      delete addressEntry.addressInfo;
    }
  }

  // Prune identifier entries that are now empty objects (all fields dropped)
  firstAdjustment.userIdentifiers = userIdentifiers.filter(
    (entry): entry is UserIdentifierEntry => {
      if (!entry) return false;
      return Object.keys(entry).length > 0;
    },
  );
};
