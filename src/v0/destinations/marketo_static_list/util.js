/* eslint-disable unicorn/consistent-destructuring */
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const Cache = require('../../util/cache');
const { AUTH_CACHE_TTL } = require('../../util/constant');

const authCache = new Cache(AUTH_CACHE_TTL); // 1 hr

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

module.exports = {
  getIds,
  validateMessageType,
  authCache,
};
