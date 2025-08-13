// src/util/integrationMetrics.js
const stats = require('./stats');

/**
 * Generic integration metrics helper functions
 * Provides standardized metrics across all source and destination integrations
 */

const integrationMetrics = {
  /**
   * Track data quality issues across integrations
   * @param {string} destinationId - Destination ID
   * @param {string} destType - Destination type
   * @param {string} destination - Destination name
   * @param {string} issueType - Type of data quality issue ('missing_fields', 'invalid_format', 'duplicate_data', etc.)
   * @param {string} dataCategory - Category of data affected ('user_data', 'event_data', 'properties', etc.)
   * @param {Object} additionalLabels - Additional labels to include
   */
  dataQualityIssue: (
    destinationId,
    destType,
    destination,
    issueType,
    dataCategory,
    additionalLabels = {},
  ) => {
    stats.increment('integration_data_quality_issues', {
      destinationId,
      destType,
      destination,
      issue_type: issueType,
      data_category: dataCategory,
      ...additionalLabels,
    });
  },

  /**
   * Track missing data occurrences across integrations
   * @param {string} destinationId - Destination ID
   * @param {string} destType - Destination type
   * @param {string} destination - Destination name
   * @param {string} missingFieldType - Type of missing field ('user_id', 'event_name', 'properties', etc.)
   * @param {string} dataCategory - Category of data affected
   * @param {Object} additionalLabels - Additional labels to include
   */
  missingData: (
    destinationId,
    destType,
    destination,
    missingFieldType,
    dataCategory,
    additionalLabels = {},
  ) => {
    stats.increment('integration_missing_data_count', {
      destinationId,
      destType,
      destination,
      missing_field_type: missingFieldType,
      data_category: dataCategory,
      ...additionalLabels,
    });
  },

  /**
   * Track operation failures across integrations
   * @param {string} destinationId - Destination ID
   * @param {string} destType - Destination type
   * @param {string} destination - Destination name
   * @param {string} operationType - Type of operation ('lookup', 'api_call', 'cache_access', etc.)
   * @param {string} errorCategory - Category of error ('network', 'auth', 'validation', etc.)
   * @param {Object} additionalLabels - Additional labels to include
   */
  operationFailure: (
    destinationId,
    destType,
    destination,
    operationType,
    errorCategory,
    additionalLabels = {},
  ) => {
    stats.increment('integration_operation_failure_count', {
      destinationId,
      destType,
      destination,
      operation_type: operationType,
      error_category: errorCategory,
      ...additionalLabels,
    });
  },

  /**
   * Track operation successes across integrations
   * @param {string} destinationId - Destination ID
   * @param {string} destType - Destination type
   * @param {string} destination - Destination name
   * @param {string} operationType - Type of operation ('lookup', 'api_call', 'cache_access', etc.)
   * @param {Object} additionalLabels - Additional labels to include
   */
  operationSuccess: (
    destinationId,
    destType,
    destination,
    operationType,
    additionalLabels = {},
  ) => {
    stats.increment('integration_operation_success_count', {
      destinationId,
      destType,
      destination,
      operation_type: operationType,
      ...additionalLabels,
    });
  },

  /**
   * Track batch sizes across integrations
   * @param {string} destinationId - Destination ID
   * @param {string} destType - Destination type
   * @param {string} destination - Destination name
   * @param {string} batchType - Type of batch ('events', 'attributes', 'purchases', etc.)
   * @param {number} size - Size of the batch
   * @param {Object} additionalLabels - Additional labels to include
   */
  batchSize: (destinationId, destType, destination, batchType, size, additionalLabels = {}) => {
    stats.gauge('integration_batch_size', size, {
      destinationId,
      destType,
      destination,
      batch_type: batchType,
      ...additionalLabels,
    });
  },

  /**
   * Track operation latency across integrations
   * @param {string} destinationId - Destination ID
   * @param {string} destType - Destination type
   * @param {string} destination - Destination name
   * @param {string} operationType - Type of operation ('lookup', 'api_call', 'cache_access', etc.)
   * @param {number} duration - Duration in milliseconds
   * @param {Object} additionalLabels - Additional labels to include
   */
  operationLatency: (
    destinationId,
    destType,
    destination,
    operationType,
    duration,
    additionalLabels = {},
  ) => {
    stats.histogram('integration_operation_latency', duration, {
      destinationId,
      destType,
      destination,
      operation_type: operationType,
      ...additionalLabels,
    });
  },
};

module.exports = integrationMetrics;
