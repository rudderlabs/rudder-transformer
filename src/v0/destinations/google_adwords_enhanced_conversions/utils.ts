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

// The hashed address sub-fields, listed once — used both to collect raw values and to
// rebuild the surviving addressInfo, so adding/removing one is a single edit.
const ADDRESS_HASH_KEYS = ['hashedFirstName', 'hashedLastName', 'hashedStreetAddress'] as const;

interface ProcessUserIdentifiersContext {
  // The control plane omits requireHash from most configs, so undefined is a real
  // runtime state — it means "hash" (see the isHashRequired mapping below).
  requireHash: boolean | undefined;
  workspaceId: string;
  destinationId: string;
}

/**
 * Runs the normalize → consistency-check → validate → hash pipeline on the five PII fields
 * in the payload's first conversionAdjustment and returns the surviving identifier entries
 * in mapping order (email, phone, addressInfo). The payload itself is NOT mutated — the
 * caller owns the result (assign it, count it, throw when empty).
 *
 * The pipeline is fed through processAudienceRecord (audienceUtils.ts) which handles:
 *   1. Hashing-consistency check: throws InstrumentationError when data contradicts requireHash
 *   2. Normalization via the per-field normalize function
 *   3. Validation + field rejection (emits <destType>_invalid_field metric on failure)
 *   4. SHA-256 hashing when isHashRequired=true
 *
 * The caller must invoke this AFTER the RESTATEMENT branch, since RESTATEMENT deletes
 * userIdentifiers — calling this on a restatement event would throw spurious hash errors.
 */
export const processUserIdentifiers = (
  payload: GaecPayload,
  { requireHash, workspaceId, destinationId }: ProcessUserIdentifiersContext,
): UserIdentifierEntry[] => {
  const userIdentifiers = payload.conversionAdjustments?.[0]?.userIdentifiers;
  if (!userIdentifiers) {
    return [];
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

  // The field→container binding, declared once — collection and survivor rebuilding below
  // both derive from it, so adding or removing a PII field is a one-line change here.
  const hashableTargets = [
    { key: 'hashedEmail', container: emailEntry },
    { key: 'hashedPhoneNumber', container: phoneEntry },
    ...ADDRESS_HASH_KEYS.map((key) => ({ key, container: addressInfo })),
  ];

  // Collect every present hashable field into ONE record — processAudienceRecord treats each
  // field independently, so a single call is equivalent to per-entry calls and matches how the
  // other integrations (GARL, fb_custom_audience, tiktok_audience) consume it.
  // Only string/number values are usable PII: the mapping can resolve a whole object (e.g.
  // hashedStreetAddress falling back to context.traits.address), and hashing String(object)
  // would ship a useless sha256("[object Object]") identifier. Non-scalars are simply not
  // collected — the returned identifiers are rebuilt from processed values only, so nothing
  // unprocessed can leak through.
  const rawFields: Record<string, unknown> = {};
  hashableTargets.forEach(({ key, container }) => {
    const value = container?.[key];
    if (value && (typeof value === 'string' || typeof value === 'number')) {
      rawFields[key] = value;
    }
  });

  const processed: Record<string, unknown> =
    Object.keys(rawFields).length > 0
      ? processAudienceRecord(rawFields, {
          fieldConfigs: GAEC_FIELD_CONFIG,
          destination: audienceDest,
        })
      : {};

  const survivingValue = (key: string): string | null => {
    const value = processed[key];
    return value && typeof value === 'string' ? value : null;
  };

  // Rebuild the identifier entries in mapping order from surviving values only.
  const survivors: UserIdentifierEntry[] = [];
  const hashedEmail = survivingValue('hashedEmail');
  if (hashedEmail) {
    survivors.push({ hashedEmail });
  }
  const hashedPhoneNumber = survivingValue('hashedPhoneNumber');
  if (hashedPhoneNumber) {
    survivors.push({ hashedPhoneNumber });
  }
  if (addressInfo) {
    // Non-hashable address fields (city, state, countryCode, postalCode) carry through
    // untouched; each hashed sub-field is replaced by its surviving value or dropped.
    // Dropping the rebuilt object when empty replaces the old in-place addressInfo prune.
    const rebuiltAddressInfo: AddressInfo = { ...addressInfo };
    ADDRESS_HASH_KEYS.forEach((key) => {
      const value = survivingValue(key);
      if (value) {
        rebuiltAddressInfo[key] = value;
      } else {
        delete rebuiltAddressInfo[key];
      }
    });
    if (Object.keys(rebuiltAddressInfo).length > 0) {
      survivors.push({ addressInfo: rebuiltAddressInfo });
    }
  } else if (addressEntry) {
    // Non-object addressInfo — unreachable via the mapping (it always builds an object when
    // any address field is present); carried through unchanged for behavior parity.
    survivors.push(addressEntry);
  }

  return survivors;
};
