const DestinationMetrics = require('../../../util/destinationMetrics');
const { ALLOWED_EVENTS, ALL_ALLOWED_PROPERTIES, EVENT_MAPPING } = require('./metricsConfig');

class FacebookConversionsMetrics extends DestinationMetrics {
  constructor() {
    // Pass allowlist configuration to parent class
    super('facebook_conversions', {
      allowedEvents: ALLOWED_EVENTS,
      allowedProperties: ALL_ALLOWED_PROPERTIES,
    });
  }

  // Facebook-specific method to get mapped event name
  getMappedEventName(rudderEventName) {
    // First try direct mapping from config
    if (EVENT_MAPPING[rudderEventName]) {
      return EVENT_MAPPING[rudderEventName];
    }

    // Fallback to category event name or original event name
    return rudderEventName;
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
