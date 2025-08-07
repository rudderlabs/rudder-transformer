const DestinationMetrics = require('../../../util/destinationMetrics');
const {
  OTHER_EVENT,
  ALL_ALLOWED_PROPERTIES,
  EVENT_MAPPING,
  STANDARD_EVENTS,
} = require('./metricsConfig');

class FacebookConversionsMetrics extends DestinationMetrics {
  constructor() {
    // Pass allowlist configuration to parent class
    super('facebook_conversions', {
      allowedProperties: ALL_ALLOWED_PROPERTIES,
    });
  }

  // Facebook-specific method to get mapped event name
  getMappedEventName(rudderEventName) {
    // First try direct mapping from config
    if (EVENT_MAPPING[rudderEventName]) {
      return EVENT_MAPPING[rudderEventName];
    }

    // If the event is a standard event, return the event name
    if (STANDARD_EVENTS.includes(rudderEventName)) {
      return rudderEventName;
    }

    // Fallback to OTHER_EVENT
    return OTHER_EVENT;
  }

  // Override trackTotalEvents to use mapped event name
  trackTotalEvents(rudderEventName, destID) {
    const mappedEventName = this.getMappedEventName(rudderEventName);
    super.trackTotalEvents(mappedEventName, destID);
  }

  // Override trackPropertyUsage to use mapped event name
  trackPropertyUsage(transformedPayload, rudderEventName, destID) {
    const mappedEventName = this.getMappedEventName(rudderEventName);
    super.trackPropertyUsage(transformedPayload, mappedEventName, destID);
  }
}

module.exports = FacebookConversionsMetrics;
