const { InstrumentationError } = require('@rudderstack/integrations-lib');

/**
 * Verifies whether the input payload is in right format or not
 * @param {Object} message
 * @returns
 */
const validatePayload = (message) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  if (!message.properties) {
    throw new InstrumentationError('Message properties is not present. Aborting message');
  }
  if (!message.properties.listData) {
    throw new InstrumentationError('listData is not present inside properties. Aborting message');
  }
  if (message.type.toLowerCase() !== 'audiencelist') {
    throw new InstrumentationError(`Event type ${message.type} is not supported`);
  }
  if (!message.properties.listData.add && !message.properties.listData.remove) {
    throw new InstrumentationError(
      "Neither 'add' nor 'remove' property is present inside 'listData'. Aborting message",
    );
  }
};

const validateFields = (schema, data) => {
  // if required field is not present in all the cases
  if (data[0].length === 0) {
    throw new InstrumentationError(`Required schema parameter ${schema} is not found from payload`);
  }
};

module.exports = { validatePayload, validateFields };
