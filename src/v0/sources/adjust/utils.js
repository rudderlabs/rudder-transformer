const { TransformationError } = require('@rudderstack/integrations-lib');

const processTimestamp = (rawTimestamp) => {
  try {
    const createdAt = Number(rawTimestamp);
    return new Date(createdAt * 1000).toISOString();
  } catch (error) {
    throw new TransformationError(`[Adjust] Invalid timestamp "${rawTimestamp}": ${error.message}`);
  }
};

module.exports = {
  processTimestamp,
};
