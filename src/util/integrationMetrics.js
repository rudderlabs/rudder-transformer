// src/util/integrationMetrics.js
const stats = require('./stats');

/**
 * Generic integration metrics helper functions
 * Provides standardized metrics across all source and destination integrations
 */

const integrationMetrics = {
  /**
   * Track data quality issues across integrations
   * @param {string} integrationName - Name of the integration (e.g., 'fb_custom_audience', 'braze')
   * @param {string} integrationType - Type of integration ('source' or 'destination')
   * @param {string} issueType - Type of data quality issue ('missing_fields', 'invalid_format', 'duplicate_data', etc.)
   * @param {string} dataCategory - Category of data affected ('user_data', 'event_data', 'properties', etc.)
   * @param {Object} additionalLabels - Additional labels to include
   */
  dataQualityIssue: (
    integrationName,
    integrationType,
    issueType,
    dataCategory,
    additionalLabels = {},
  ) => {
    stats.increment('integration_data_quality_issues', {
      integration_type: integrationType,
      integration_name: integrationName,
      issue_type: issueType,
      data_category: dataCategory,
      ...additionalLabels,
    });
  },

  /**
   * Track missing data occurrences across integrations
   * @param {string} integrationName - Name of the integration
   * @param {string} integrationType - Type of integration ('source' or 'destination')
   * @param {string} missingFieldType - Type of missing field ('user_id', 'event_name', 'properties', etc.)
   * @param {string} dataCategory - Category of data affected
   * @param {Object} additionalLabels - Additional labels to include
   */
  missingData: (
    integrationName,
    integrationType,
    missingFieldType,
    dataCategory,
    additionalLabels = {},
  ) => {
    stats.increment('integration_missing_data_count', {
      integration_type: integrationType,
      integration_name: integrationName,
      missing_field_type: missingFieldType,
      data_category: dataCategory,
      ...additionalLabels,
    });
  },

  /**
   * Track operation failures across integrations
   * @param {string} integrationName - Name of the integration
   * @param {string} integrationType - Type of integration ('source' or 'destination')
   * @param {string} operationType - Type of operation ('lookup', 'api_call', 'cache_access', etc.)
   * @param {string} errorCategory - Category of error ('network', 'auth', 'validation', etc.)
   * @param {Object} additionalLabels - Additional labels to include
   */
  operationFailure: (
    integrationName,
    integrationType,
    operationType,
    errorCategory,
    additionalLabels = {},
  ) => {
    stats.increment('integration_operation_failure_count', {
      integration_type: integrationType,
      integration_name: integrationName,
      operation_type: operationType,
      error_category: errorCategory,
      ...additionalLabels,
    });
  },

  /**
   * Track operation successes across integrations
   * @param {string} integrationName - Name of the integration
   * @param {string} integrationType - Type of integration ('source' or 'destination')
   * @param {string} operationType - Type of operation ('lookup', 'api_call', 'cache_access', etc.)
   * @param {Object} additionalLabels - Additional labels to include
   */
  operationSuccess: (integrationName, integrationType, operationType, additionalLabels = {}) => {
    stats.increment('integration_operation_success_count', {
      integration_type: integrationType,
      integration_name: integrationName,
      operation_type: operationType,
      ...additionalLabels,
    });
  },

  /**
   * Track batch sizes across integrations
   * @param {string} integrationName - Name of the integration
   * @param {string} integrationType - Type of integration ('source' or 'destination')
   * @param {string} batchType - Type of batch ('events', 'attributes', 'purchases', etc.)
   * @param {number} size - Size of the batch
   * @param {Object} additionalLabels - Additional labels to include
   */
  batchSize: (integrationName, integrationType, batchType, size, additionalLabels = {}) => {
    stats.gauge('integration_batch_size', size, {
      integration_type: integrationType,
      integration_name: integrationName,
      batch_type: batchType,
      ...additionalLabels,
    });
  },

  /**
   * Track operation latency across integrations
   * @param {string} integrationName - Name of the integration
   * @param {string} integrationType - Type of integration ('source' or 'destination')
   * @param {string} operationType - Type of operation ('lookup', 'api_call', 'cache_access', etc.)
   * @param {number} duration - Duration in milliseconds
   * @param {Object} additionalLabels - Additional labels to include
   */
  operationLatency: (
    integrationName,
    integrationType,
    operationType,
    duration,
    additionalLabels = {},
  ) => {
    stats.histogram('integration_operation_latency', duration, {
      integration_type: integrationType,
      integration_name: integrationName,
      operation_type: operationType,
      ...additionalLabels,
    });
  },
};

module.exports = integrationMetrics;
