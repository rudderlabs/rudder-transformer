import { InstrumentationError } from '@rudderstack/integrations-lib';
import stats from '../../util/stats';

const HASHED_VALUE_REGEX = /^[\da-f]{64}$/;

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
  normalizedValue: string,
  destination: AudienceDestination,
): void => {
  if (!normalizedValue) return;
  const { workspaceId, id: destinationId, type: destType, config } = destination;
  const { isHashRequired } = config;
  const isAlreadyHashed = HASHED_VALUE_REGEX.test(normalizedValue);
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
