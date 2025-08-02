const stats = require('./stats');

class DestinationMetrics {
  constructor(destinationName) {
    this.destinationName = destinationName;
  }

  // Track total events by event name and destID
  trackTotalEvents(eventName, destID) {
    const metricName = `${this.destinationName}_total_events`;

    stats.increment(metricName, {
      event_name: eventName,
      destID,
    });
  }

  // Track property usage dynamically for each property
  trackPropertyUsage(transformedPayload, eventName, destID) {
    if (!transformedPayload || typeof transformedPayload !== 'object') {
      return;
    }

    const sanitizeFieldName = (fieldName) =>
      // Replace dots with underscores for Prometheus compatibility
      fieldName.replace(/\./g, '_');
    const extractFields = (obj, prefix = '') => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const fieldName = prefix ? `${prefix}.${key}` : key;

        if (value !== undefined && value !== null) {
          // Create dynamic metric name for each property
          const sanitizedFieldName = sanitizeFieldName(fieldName);
          const metricName = `${this.destinationName}_property_${sanitizedFieldName}`;

          stats.increment(metricName, {
            event_name: eventName,
            destID,
          });

          // Recursively extract nested fields
          if (typeof value === 'object' && !Array.isArray(value)) {
            extractFields(value, fieldName);
          }
        }
      });
    };

    extractFields(transformedPayload);
  }
}

module.exports = DestinationMetrics;
