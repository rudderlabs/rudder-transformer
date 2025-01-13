const { getHashFromArray } = require('../../util');

/**
 * Retrieves the mapped event name from the given config.
 *
 * @param {object} message - The message object containing the event.
 * @param {object} destination - The destination object containing the events mapping configuration.
 * @returns {string} - The mapped event name, or undefined if not found.
 */
const getMappedEventNameFromConfig = (message, destination) => {
  let eventName;
  const { event } = message;
  const { eventsMapping } = destination.Config;

  // if event is mapped on dashboard, use the mapped event name
  if (Array.isArray(eventsMapping) && eventsMapping.length > 0) {
    const keyMap = getHashFromArray(eventsMapping, 'from', 'to', false);
    eventName = keyMap[event];
  }

  return eventName;
};

module.exports = { getMappedEventNameFromConfig };
