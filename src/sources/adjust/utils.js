const { TransformationError } = require('@rudderstack/integrations-lib');

/**
 * Converts a raw timestamp to ISO 8601 date string format
 * @param {number|string} rawTimestamp - The timestamp to convert (expects Unix timestamp in seconds)
 * @returns {string} The timestamp converted to ISO 8601 format
 * @throws {TransformationError} If the timestamp is invalid or cannot be parsed
 */
const convertToISODate = (rawTimestamp) => {
  if (typeof rawTimestamp !== 'number' && typeof rawTimestamp !== 'string') {
    throw new TransformationError(
      `Invalid timestamp type: expected number or string, received ${typeof rawTimestamp}`,
    );
  }

  const createdAt = Number(rawTimestamp);

  if (Number.isNaN(createdAt)) {
    throw new TransformationError(`Failed to parse timestamp: "${rawTimestamp}"`);
  }

  const date = new Date(createdAt * 1000);

  if (Number.isNaN(date.getTime())) {
    throw new TransformationError(`Failed to create valid date for timestamp "${rawTimestamp}"`);
  }

  return date.toISOString();
};

module.exports = {
  convertToISODate,
};
