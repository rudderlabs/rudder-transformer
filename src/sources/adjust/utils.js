const { TransformationError, isDefinedAndNotNull } = require('@rudderstack/integrations-lib');

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

/**
 * Flattens an object containing array parameters into a simple key-value object with first element of array as value
 * @param {Object.<string, Array>} qParams - Object containing parameters where values are arrays
 * @returns {Object.<string, *>} Flattened object where array values are replaced with their first element
 * @description
 * This function flattens an object containing array parameters into a simple key-value object
 * with first element of array as value if it is an array, otherwise the value is returned as is
 * In case of empty array, the key is removed from the output
 */
const flattenParams = (qParams) => {
  const formattedOutput = {};
  if (qParams) {
    Object.entries(qParams).forEach(([key, value]) => {
      const finalValue = Array.isArray(value) ? value[0] : value;
      if (isDefinedAndNotNull(finalValue)) {
        formattedOutput[key] = finalValue;
      }
    });
  }
  return formattedOutput;
};

module.exports = {
  convertToISODate,
  flattenParams,
};
