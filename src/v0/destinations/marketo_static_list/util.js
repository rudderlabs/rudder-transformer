/* eslint-disable unicorn/consistent-destructuring */
const { InstrumentationError } = require('../../util/errorTypes');

/**
 * Fetches the ids from the array of objects
 * where each object has consist of Id
 * @param {*} array
 * @returns array of Ids
 */
const getIds = (array) => {
  if (Array.isArray(array)) {
    const leadIds = [];
    if (array.length > 0) {
      array.forEach((object) => {
        leadIds.push(object?.id);
      });
    }
    return leadIds;
  }
  return null;
};

/**
 * Validates the message type and throws error if
 * message type is not allowed or unavailable
 * @param {*} message to get message type from
 * @param {*} allowedTypes array of allowed message types
 */
const validateMessageType = (message, allowedTypes) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  if (!allowedTypes.includes(message.type.toLowerCase())) {
    throw new InstrumentationError(`Event type ${message.type} is not supported`);
  }
};

function transformForRecordEvent(inputs, leadIdObj) {
  const finalMetadata = [];
  // iterate through each inputs metadata and create a final metadata
  const tokenisedInputs = inputs.map((input) => {
    const { message } = input;
    const { metadata } = input;
    finalMetadata.push(metadata);
    const { fields, action, type } = message;
    if (type !== 'record') {
      throw new InstrumentationError('Invalid message type, Supported message type is record.');
    }
    const { properties } = message;
    if (!properties) {
      message.properties = {};
    }
    message.properties.listData = message?.properties.listData || { add: [], remove: [] };
    const fieldsId = fields?.id;
    if (fieldsId === undefined) {
      throw new InstrumentationError('No lead id passed in the payload.');
    }
    if (action === 'insert') {
      leadIdObj.insert.push({ id: fieldsId });
      message.properties.listData.add.push({ id: fieldsId });
    } else if (action === 'delete') {
      leadIdObj.delete.push({ id: fieldsId });
      message.properties.listData.remove.push({ id: fieldsId });
    } else {
      throw new InstrumentationError('Invalid action type');
    }
    return input;
  });
  const finalInput = [tokenisedInputs[0]];
  finalInput[0].metadata = finalMetadata;
  finalInput[0].message.properties.listData.add = leadIdObj.insert;
  finalInput[0].message.properties.listData.remove = leadIdObj.delete;

  return finalInput;
}

module.exports = {
  getIds,
  validateMessageType,
  transformForRecordEvent,
};
