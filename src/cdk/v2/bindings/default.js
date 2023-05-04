const { InstrumentationError, ConfigurationError } = require('../../../v0/util/errorTypes');

const SUPPORTED_EVENT_TYPES = ['track', 'page', 'screen', 'group', 'identify', 'alias'];

/**
 * Checks if the event type is valid
 * @param {*} event RudderStack standard event object
 * @returns true if the event type is supported, otherwise false
 */
function isValidEventType(event) {
  const eventType = event.event;
  if (!eventType || typeof eventType !== 'string') return false;

  const sanitizedEventType = eventType.trim().toLowerCase();
  return SUPPORTED_EVENT_TYPES.includes(sanitizedEventType);
}

function assert(val, message) {
  if (!val) {
    throw new InstrumentationError(message);
  }
}

function assertConfig(val, message) {
  if (!val) {
    throw new ConfigurationError(message);
  }
}

module.exports = {
  isValidEventType,
  assert,
  assertConfig,
};
