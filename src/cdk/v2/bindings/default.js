const SUPPORTED_EVENT_TYPES = [
  "track",
  "page",
  "screen",
  "group",
  "identify",
  "alias"
];

/**
 * Checks if the event type is valid
 * @param {*} event RudderStack standard event object
 * @returns true if the event type is supported, otherwise false
 */
function isValidEventType(event) {
  const eventType = event.event;
  if (!eventType || typeof eventType !== "string") return false;

  const sanitizedEventType = eventType.trim().toLowerCase();
  if (!SUPPORTED_EVENT_TYPES.includes(sanitizedEventType)) return false;

  return true;
}

module.exports = {
  isValidEventType
};
