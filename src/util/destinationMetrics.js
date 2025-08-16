const stats = require('./stats');

class DestinationMetrics {
  constructor(destinationName, allowlistConfig = null) {
    this.destinationName = destinationName;
    this.allowlistConfig = allowlistConfig;
  }

  // Check if property should be tracked
  isPropertyAllowed(propertyName) {
    if (!this.allowlistConfig?.allowedProperties) {
      return true; // No allowlist = track all
    }

    // Check direct property name
    if (this.allowlistConfig.allowedProperties.includes(propertyName)) {
      return true;
    }

    // Check nested property (e.g., user_data.em should match 'em')
    const nestedProp = propertyName.split('.').pop();
    return this.allowlistConfig.allowedProperties.includes(nestedProp);
  }

  // Track total events with standard/custom event differentiation
  trackTotalEvents(eventName, destID) {
    const metricName = `${this.destinationName}_total_events`;

    stats.increment(metricName, {
      event_name: eventName,
      destID,
    });
  }

  // Track property usage with allowlist filtering
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
          // Check if this property is allowlisted
          if (this.isPropertyAllowed(fieldName)) {
            // Create dynamic metric name for each property
            const sanitizedFieldName = sanitizeFieldName(fieldName);
            const metricName = `${this.destinationName}_property_${sanitizedFieldName}`;

            stats.increment(metricName, {
              event_name: eventName,
              destID,
            });
          }

          // Always recursively extract nested fields (even if parent is not allowlisted)
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
