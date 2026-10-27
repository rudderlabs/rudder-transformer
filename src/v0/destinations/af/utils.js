const { getValueFromMessage, hashToSha256 } = require('../../util');
const { HashingType, isAlreadyHashed } = require('../../util/audienceUtils');
const { ADVANCED_MATCHING_SOURCE_KEYS } = require('./config');

const toTrimmedString = (value) => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return undefined;
  }
  return String(value).trim() || undefined;
};

const hashLowercased = (value) => {
  const trimmed = toTrimmedString(value);
  if (!trimmed) {
    return undefined;
  }
  return isAlreadyHashed(trimmed, HashingType.SHA256)
    ? trimmed
    : hashToSha256(trimmed.toLowerCase());
};

const phoneHashes = (value) => {
  const trimmed = toTrimmedString(value);
  if (!trimmed) {
    return {};
  }
  if (isAlreadyHashed(trimmed, HashingType.SHA256)) {
    return { phone_number_hashed: trimmed };
  }
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) {
    return {};
  }
  // Only a leading '+' proves the number carries its country code, which E.164 requires.
  return {
    phone_number_hashed: hashToSha256(digits),
    ...(trimmed.startsWith('+') && { phone_number_e164_hashed: hashToSha256(`+${digits}`) }),
  };
};

/**
 * Advanced Matching identifiers for the S2S v3 in-app event API, normalized as AppsFlyer
 * requires before hashing. A value that is already a SHA-256 digest is sent unchanged.
 */
const getAdvancedMatchingFields = (message) => ({
  email_hashed: hashLowercased(getValueFromMessage(message, ADVANCED_MATCHING_SOURCE_KEYS.email)),
  ...phoneHashes(getValueFromMessage(message, ADVANCED_MATCHING_SOURCE_KEYS.phone)),
  first_name_hashed: hashLowercased(
    getValueFromMessage(message, ADVANCED_MATCHING_SOURCE_KEYS.firstName),
  ),
  last_name_hashed: hashLowercased(
    getValueFromMessage(message, ADVANCED_MATCHING_SOURCE_KEYS.lastName),
  ),
});

module.exports = { getAdvancedMatchingFields };
