// Returned when every event in a Braze batch was intentionally filtered out by
// the source config. Responses carrying `outputToSource` skip the gateway
// entirely (see SourcePostTransformationService), so Braze gets a plain 200
// instead of the 400 an empty batch would produce.
const NO_OPERATION_SUCCESS = {
  outputToSource: {
    body: Buffer.from('OK').toString('base64'),
    contentType: 'text/plain',
  },
  statusCode: 200,
};

// Reads the event names out of a `dynamicCustomForm` list. The UI always renders
// one blank row, so blank entries are ignored.
const getConfiguredEventNames = (eventList) =>
  (Array.isArray(eventList) ? eventList : []).map((row) => row?.eventName?.trim()).filter(Boolean);

// Keyed by the `eventFilteringOption` value chosen in the source UI config.
// Any other value - including 'disable' and undefined - means no filtering.
const eventFilters = {
  whitelistedEvents: (eventType, config) => {
    const allowedEvents = getConfiguredEventNames(config.whitelistedEvents);
    // an empty allowlist means "not configured yet", so do not drop everything
    return allowedEvents.length === 0 || allowedEvents.includes(eventType);
  },
  blacklistedEvents: (eventType, config) =>
    !getConfiguredEventNames(config.blacklistedEvents).includes(eventType),
};

/**
 * Decides whether a Braze event survives the source-level filter.
 * Matching is exact and runs against the raw `event_type`, before `customMapping`
 * is applied, so the filter keeps working if the event is renamed later.
 * @param {string} eventType raw Braze event_type e.g. `users.messages.email.Open`
 * @param {object} config the source Config
 * @returns {boolean} true if the event should be processed
 */
const isEventAllowed = (eventType, config) => {
  const sourceConfig = config || {};
  const { eventFilteringOption } = sourceConfig;
  // own-property check so config values like 'constructor' cannot pick up an
  // inherited Object.prototype member and be treated as a filter
  if (!Object.prototype.hasOwnProperty.call(eventFilters, eventFilteringOption)) {
    return true;
  }
  return eventFilters[eventFilteringOption](eventType, sourceConfig);
};

module.exports = { NO_OPERATION_SUCCESS, isEventAllowed };
