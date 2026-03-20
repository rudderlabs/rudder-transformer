import sha256 from 'sha256';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import stats from '../../util/stats';
import { isDefinedAndNotNull } from '.';

export interface AudienceField {
  normalize: ((v: string) => string) | undefined;
  validate?: (normalized: string) => boolean;
  /** Whether this field should be hashed when hashing is enabled */
  hashable: boolean;
}

export const HASHED_VALUE_REGEX = /^[\dA-Fa-f]{64}$/;
const PHONE_NUMBER_REGEX = /^\+?\d+$/;

/**
 * Validates that a phone number contains only digits and an optional leading '+'.
 */
export const isValidPhoneNumber = (value: string): boolean => PHONE_NUMBER_REGEX.test(value);

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
): void => {
  const { workspaceId, id: destinationId, type: destType, config } = destination;
  const { isHashRequired } = config;
  const isAlreadyHashed = HASHED_VALUE_REGEX.test(sourceValue);
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
): Record<string, unknown> => {
  const { isHashRequired } = destination.config;
  const { workspaceId, id: destinationId, type: destType } = destination;
  const invalidFieldMetric = `${destType}_invalid_field`;
  const shouldRejectInvalidFields =
    process.env[`${destType.toUpperCase()}_REJECT_INVALID_FIELDS`] === 'true';
  const result: Record<string, unknown> = {};

  Object.entries(record).forEach(([fieldName, rawValue]) => {
    if (!isDefinedAndNotNull(rawValue) || rawValue === '' || rawValue === false) {
      return;
    }

    const fieldConfig = fieldConfigs[fieldName];

    const isHashable = fieldConfig?.hashable;
    const sourceValue = String(rawValue);

    // Hashing consistency check runs on the source value before normalization
    if (isHashable) {
      validateHashingConsistency(fieldName, sourceValue, destination);
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

    result[fieldName] = isHashRequired && isHashable ? sha256(normalizedValue) : normalizedValue;
  });

  return result;
};
