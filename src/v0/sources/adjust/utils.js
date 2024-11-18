const { TransformationError } = require('@rudderstack/integrations-lib');

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
