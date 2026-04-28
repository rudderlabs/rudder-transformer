import sha256 from 'sha256';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { createHash } from 'crypto';
import stats from '../../util/stats';
import { isDefinedAndNotNull } from '.';

export enum HashingType {
  SHA256 = 'SHA256',
  SHA512 = 'SHA512',
  MD5 = 'MD5',
  NONE = 'NONE',
}

const HASHING_CONFIG: Partial<Record<HashingType, { regex: RegExp; hash: (v: string) => string }>> =
  {
    [HashingType.SHA256]: { regex: /^[\dA-Fa-f]{64}$/, hash: (v) => sha256(v) },
    [HashingType.SHA512]: {
      regex: /^[\dA-Fa-f]{128}$/,
      hash: (v) => createHash('sha512').update(v).digest('hex'),
    },
    [HashingType.MD5]: {
      regex: /^[\dA-Fa-f]{32}$/,
      hash: (v) => createHash('md5').update(v).digest('hex'),
    },
  };

export interface AudienceField {
  hashingType: HashingType;
  normalize: ((v: string) => string) | undefined;
  validate?: (normalized: string) => boolean;
}

const PHONE_NUMBER_REGEX = /^\+?\d+$/;

/**
 * Validates that a phone number contains only digits and an optional leading '+'.
 */
export const isValidPhoneNumber = (value: string): boolean => PHONE_NUMBER_REGEX.test(value);

function hashValue(value: string, hashingType: HashingType): string {
  const hashFunction = HASHING_CONFIG[hashingType]?.hash;
  if (!hashFunction) {
    throw new Error(`Unsupported hashing type: ${hashingType as never}`);
  }
  return hashFunction(value);
}

interface AudienceDestination {
  workspaceId: string;
  id: string;
  type: string;
  config: {
    isHashRequired: boolean;
  };
}

function isHashingValidationEnabled(): boolean {
  return process.env.AUDIENCE_HASHING_VALIDATION_ENABLED === 'true';
}

/**
 * Validates that the hashing configuration is consistent with the actual data.
 * Emits a metric when inconsistency is detected.
 * Optionally throws an error when validation is enabled via env var AUDIENCE_HASHING_VALIDATION_ENABLED.
 */
export const validateHashingConsistency = (
  propertyName: string,
  sourceValue: string,
  destination: AudienceDestination,
  hashingType: HashingType,
): void => {
  const { workspaceId, id: destinationId, type: destType, config } = destination;
  const { isHashRequired } = config;
  const isAlreadyHashed = HASHING_CONFIG[hashingType]?.regex.test(sourceValue) ?? false;
  if (isHashRequired && isAlreadyHashed) {
    stats.increment('audience_hashing_inconsistency', {
      propertyName,
      type: 'hashed_when_hash_enabled',
      workspaceId,
      destinationId,
      destType,
    });
    if (isHashingValidationEnabled()) {
      throw new InstrumentationError(
        `Hashing is enabled but the value for field ${propertyName} appears to already be hashed. Either disable hashing or send unhashed data.`,
      );
    }
  }
  if (!isHashRequired && !isAlreadyHashed) {
    stats.increment('audience_hashing_inconsistency', {
      propertyName,
      type: 'unhashed_when_hash_disabled',
      workspaceId,
      destinationId,
      destType,
    });
    if (isHashingValidationEnabled()) {
      throw new InstrumentationError(
        `Hashing is disabled but the value for field ${propertyName} appears to be unhashed. Either enable hashing or send pre-hashed data.`,
      );
    }
  }
};

/**
 * Unified function that processes an audience record by running, for each field:
 *   1. Normalization (via per-field normalize function, if provided)
 *   2. Hashing-consistency check (for fields with hashable=true)
 *   3. Validation + optional field rejection (emits invalid_field metric on failure)
 *   4. SHA-256 hashing (for fields with hashable=true when isHashRequired=true)
 */
export const processAudienceRecord = (
  record: Record<string, unknown>,
  {
    fieldConfigs,
    destination,
  }: {
    fieldConfigs: Record<string, AudienceField>;
    destination: AudienceDestination;
  },
): Record<string, string> => {
  const { isHashRequired } = destination.config;
  const { workspaceId, id: destinationId, type: destType } = destination;
  const invalidFieldMetric = `${destType}_invalid_field`;
  const shouldRejectInvalidFields =
    process.env[`${destType.toUpperCase()}_REJECT_INVALID_FIELDS`] === 'true';
  const result: Record<string, string> = {};

  Object.entries(record).forEach(([fieldName, rawValue]) => {
    if (!isDefinedAndNotNull(rawValue) || rawValue === '' || rawValue === false) {
      return;
    }

    const fieldConfig = fieldConfigs[fieldName];

    const hashingType = fieldConfig?.hashingType ?? HashingType.NONE;
    const isHashable = hashingType !== HashingType.NONE;
    const sourceValue = String(rawValue);

    // Hashing consistency check runs on the source value before normalization
    if (isHashable) {
      validateHashingConsistency(fieldName, sourceValue, destination, hashingType);
    }

    // Pre-hashed values are passed through as-is: skip normalization and validation
    if (isHashable && !isHashRequired) {
      result[fieldName] = sourceValue;
      return;
    }

    const normalizedValue = (fieldConfig?.normalize ?? ((v: string) => v))(sourceValue);
    if (!normalizedValue) {
      return;
    }

    const isInvalid = !(fieldConfig?.validate ?? (() => true))(normalizedValue);

    if (isInvalid) {
      stats.increment(invalidFieldMetric, { fieldName, workspaceId, destinationId });
      if (shouldRejectInvalidFields) {
        return;
      }
    }

    result[fieldName] =
      isHashRequired && isHashable ? hashValue(normalizedValue, hashingType) : normalizedValue;
  });

  return result;
};
