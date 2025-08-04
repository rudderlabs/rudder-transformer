# Generic Integration Metrics

This document describes the new generic integration metrics system that replaces destination-specific metrics with standardized metrics that can be used across all source and destination integrations.

## Overview

The generic integration metrics system provides a consistent way to track metrics across all integrations, reducing metric cardinality and improving maintainability. This system follows the requirements outlined in [Linear Issue INT-4002](https://linear.app/rudderstack/issue/INT-4002/refactor-destination-specific-metrics-to-generic-integration-metrics).

## Available Metrics

### 1. Data Quality Metrics

#### `integration_data_quality_issues`

Tracks data quality issues across integrations.

**Labels:**

- `integration_type`: Type of integration ('source' or 'destination')
- `integration_name`: Name of the integration (e.g., 'fb_custom_audience', 'braze')
- `issue_type`: Type of data quality issue ('missing_fields', 'invalid_format', 'duplicate_data', etc.)
- `data_category`: Category of data affected ('user_data', 'event_data', 'properties', etc.)

#### `integration_missing_data_count`

Tracks missing data occurrences across integrations.

**Labels:**

- `integration_type`: Type of integration ('source' or 'destination')
- `integration_name`: Name of the integration
- `missing_field_type`: Type of missing field ('user_id', 'event_name', 'properties', etc.)
- `data_category`: Category of data affected

### 2. Operation Metrics

#### `integration_operation_failure_count`

Tracks operation failures across integrations.

**Labels:**

- `integration_type`: Type of integration ('source' or 'destination')
- `integration_name`: Name of the integration
- `operation_type`: Type of operation ('lookup', 'api_call', 'cache_access', etc.)
- `error_category`: Category of error ('network', 'auth', 'validation', etc.)

#### `integration_operation_success_count`

Tracks operation successes across integrations.

**Labels:**

- `integration_type`: Type of integration ('source' or 'destination')
- `integration_name`: Name of the integration
- `operation_type`: Type of operation ('lookup', 'api_call', 'cache_access', etc.)

### 3. Performance Metrics

#### `integration_batch_size`

Tracks batch sizes across integrations.

**Labels:**

- `integration_type`: Type of integration ('source' or 'destination')
- `integration_name`: Name of the integration
- `batch_type`: Type of batch ('events', 'attributes', 'purchases', etc.)

#### `integration_operation_latency`

Tracks operation latency across integrations.

**Labels:**

- `integration_type`: Type of integration ('source' or 'destination')
- `integration_name`: Name of the integration
- `operation_type`: Type of operation ('lookup', 'api_call', 'cache_access', etc.)

## Usage

### Using the Integration Metrics Helper

The `integrationMetrics` helper provides convenient functions for tracking metrics:

```javascript
const integrationMetrics = require('../../util/integrationMetrics');

// Track data quality issues
integrationMetrics.dataQualityIssue(
  'fb_custom_audience',
  'destination',
  'missing_fields',
  'user_data',
);

// Track missing data
integrationMetrics.missingData('fb_custom_audience', 'destination', 'user_id', 'user_data');

// Track operation failures
integrationMetrics.operationFailure('fb_custom_audience', 'destination', 'api_call', 'network');

// Track operation successes
integrationMetrics.operationSuccess('fb_custom_audience', 'destination', 'api_call');

// Track batch sizes
integrationMetrics.batchSize('fb_custom_audience', 'destination', 'events', 100);

// Track operation latency
integrationMetrics.operationLatency('fb_custom_audience', 'destination', 'api_call', 150);
```

### Direct Usage with Stats

You can also use the metrics directly with the stats module:

```javascript
const stats = require('../../util/stats');

stats.increment('integration_data_quality_issues', {
  integration_type: 'destination',
  integration_name: 'fb_custom_audience',
  issue_type: 'missing_fields',
  data_category: 'user_data',
});
```

## Migration from Destination-Specific Metrics

### Facebook Custom Audience Metrics

The following Facebook Custom Audience specific metrics have been migrated to generic integration metrics:

| Old Metric                                                            | New Metric                        | Labels                                                                                                                                         |
| --------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `fb_custom_audience_event_having_all_null_field_values_for_a_user`    | `integration_data_quality_issues` | `integration_type: 'destination'`, `integration_name: 'fb_custom_audience'`, `issue_type: 'missing_fields'`, `data_category: 'user_data'`      |
| `fb_custom_audience_event_having_all_null_field_values_for_all_users` | `integration_data_quality_issues` | `integration_type: 'destination'`, `integration_name: 'fb_custom_audience'`, `issue_type: 'missing_fields'`, `data_category: 'all_users_data'` |

**Note**: The legacy Facebook Custom Audience metrics have been removed as they were not widely used. The integration now exclusively uses the new generic integration metrics.

## Benefits

1. **Reduced Metric Cardinality**: Fewer unique metric names across the system
2. **Consistent Monitoring**: Same metrics across all integrations
3. **Easier Maintenance**: Single metric definition for similar operations
4. **Better Scalability**: New integrations automatically get standard metrics
5. **Improved Analytics**: Cross-integration comparisons and analysis

## Future Work

This implementation focuses on the Facebook Custom Audience metrics as requested. The same pattern can be applied to other destination-specific metrics mentioned in the Linear issue:

- Braze metrics (15 metrics)
- Shopify metrics (12 metrics)
- Marketo metrics (3 metrics)
- Mixpanel metrics (3 metrics)
- HubSpot metrics (1 metric)
- Mailjet metrics (1 metric)

## Testing

Tests for the integration metrics helper are available in `src/util/integrationMetrics.test.js`. Run them with:

```bash
npm test -- src/util/integrationMetrics.test.js
```
