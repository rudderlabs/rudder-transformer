const { TransformationError } = require('@rudderstack/integrations-lib');

const convertToISODate = (rawTimestamp) => {
  if (typeof rawTimestamp !== 'number' && typeof rawTimestamp !== 'string') {
    throw new TransformationError(
      `[Adjust] Invalid timestamp "${rawTimestamp}": must be a number or numeric string.`,
    );
  }

  const createdAt = Number(rawTimestamp);

  if (Number.isNaN(createdAt)) {
    throw new TransformationError(
      `[Adjust] Invalid timestamp "${rawTimestamp}": cannot be converted to a valid number.`,
    );
  }

  const date = new Date(createdAt * 1000);

  if (Number.isNaN(date.getTime())) {
    throw new TransformationError(
      `[Adjust] Invalid timestamp "${rawTimestamp}": results in an invalid date.`,
    );
  }

  return date.toISOString();
};

module.exports = {
  convertToISODate,
};
