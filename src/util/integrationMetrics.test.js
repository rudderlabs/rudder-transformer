// src/util/integrationMetrics.test.js
const integrationMetrics = require('./integrationMetrics');

// Mock the stats module
jest.mock('./stats', () => ({
  increment: jest.fn(),
  gauge: jest.fn(),
  histogram: jest.fn(),
}));

const stats = require('./stats');

describe('Integration Metrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('dataQualityIssue', () => {
    it('should call stats.increment with correct parameters', () => {
      integrationMetrics.dataQualityIssue(
        'fb_custom_audience',
        'destination',
        'missing_fields',
        'user_data',
      );

      expect(stats.increment).toHaveBeenCalledWith('integration_data_quality_issues', {
        integration_type: 'destination',
        integration_name: 'fb_custom_audience',
        issue_type: 'missing_fields',
        data_category: 'user_data',
      });
    });

    it('should include additional labels when provided', () => {
      const additionalLabels = { destinationId: 'test-dest-id', nullFields: ['email', 'phone'] };
      integrationMetrics.dataQualityIssue(
        'fb_custom_audience',
        'destination',
        'missing_fields',
        'user_data',
        additionalLabels,
      );

      expect(stats.increment).toHaveBeenCalledWith('integration_data_quality_issues', {
        integration_type: 'destination',
        integration_name: 'fb_custom_audience',
        issue_type: 'missing_fields',
        data_category: 'user_data',
        destinationId: 'test-dest-id',
        nullFields: ['email', 'phone'],
      });
    });
  });

  describe('missingData', () => {
    it('should call stats.increment with correct parameters', () => {
      integrationMetrics.missingData('fb_custom_audience', 'destination', 'user_id', 'user_data');

      expect(stats.increment).toHaveBeenCalledWith('integration_missing_data_count', {
        integration_type: 'destination',
        integration_name: 'fb_custom_audience',
        missing_field_type: 'user_id',
        data_category: 'user_data',
      });
    });
  });

  describe('operationFailure', () => {
    it('should call stats.increment with correct parameters', () => {
      integrationMetrics.operationFailure(
        'fb_custom_audience',
        'destination',
        'api_call',
        'network',
      );

      expect(stats.increment).toHaveBeenCalledWith('integration_operation_failure_count', {
        integration_type: 'destination',
        integration_name: 'fb_custom_audience',
        operation_type: 'api_call',
        error_category: 'network',
      });
    });
  });

  describe('operationSuccess', () => {
    it('should call stats.increment with correct parameters', () => {
      integrationMetrics.operationSuccess('fb_custom_audience', 'destination', 'api_call');

      expect(stats.increment).toHaveBeenCalledWith('integration_operation_success_count', {
        integration_type: 'destination',
        integration_name: 'fb_custom_audience',
        operation_type: 'api_call',
      });
    });
  });

  describe('batchSize', () => {
    it('should call stats.gauge with correct parameters', () => {
      integrationMetrics.batchSize('fb_custom_audience', 'destination', 'events', 100);

      expect(stats.gauge).toHaveBeenCalledWith('integration_batch_size', 100, {
        integration_type: 'destination',
        integration_name: 'fb_custom_audience',
        batch_type: 'events',
      });
    });
  });

  describe('operationLatency', () => {
    it('should call stats.histogram with correct parameters', () => {
      integrationMetrics.operationLatency('fb_custom_audience', 'destination', 'api_call', 150);

      expect(stats.histogram).toHaveBeenCalledWith('integration_operation_latency', 150, {
        integration_type: 'destination',
        integration_name: 'fb_custom_audience',
        operation_type: 'api_call',
      });
    });
  });
});
