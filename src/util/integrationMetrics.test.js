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
        'test-dest-id',
        'fb_custom_audience',
        'fb_custom_audience',
        'missing_fields',
        'user_data',
      );

      expect(stats.increment).toHaveBeenCalledWith('integration_data_quality_issues', {
        destinationId: 'test-dest-id',
        destType: 'fb_custom_audience',
        destination: 'fb_custom_audience',
        issue_type: 'missing_fields',
        data_category: 'user_data',
      });
    });

    it('should include additional labels when provided', () => {
      const additionalLabels = { nullFields: ['email', 'phone'] };
      integrationMetrics.dataQualityIssue(
        'test-dest-id',
        'fb_custom_audience',
        'fb_custom_audience',
        'missing_fields',
        'user_data',
        additionalLabels,
      );

      expect(stats.increment).toHaveBeenCalledWith('integration_data_quality_issues', {
        destinationId: 'test-dest-id',
        destType: 'fb_custom_audience',
        destination: 'fb_custom_audience',
        issue_type: 'missing_fields',
        data_category: 'user_data',
        nullFields: ['email', 'phone'],
      });
    });
  });

  describe('missingData', () => {
    it('should call stats.increment with correct parameters', () => {
      integrationMetrics.missingData(
        'test-dest-id',
        'fb_custom_audience',
        'fb_custom_audience',
        'user_id',
        'user_data',
      );

      expect(stats.increment).toHaveBeenCalledWith('integration_missing_data_count', {
        destinationId: 'test-dest-id',
        destType: 'fb_custom_audience',
        destination: 'fb_custom_audience',
        missing_field_type: 'user_id',
        data_category: 'user_data',
      });
    });
  });

  describe('operationFailure', () => {
    it('should call stats.increment with correct parameters', () => {
      integrationMetrics.operationFailure(
        'test-dest-id',
        'fb_custom_audience',
        'fb_custom_audience',
        'api_call',
        'network',
      );

      expect(stats.increment).toHaveBeenCalledWith('integration_operation_failure_count', {
        destinationId: 'test-dest-id',
        destType: 'fb_custom_audience',
        destination: 'fb_custom_audience',
        operation_type: 'api_call',
        error_category: 'network',
      });
    });
  });

  describe('operationSuccess', () => {
    it('should call stats.increment with correct parameters', () => {
      integrationMetrics.operationSuccess(
        'test-dest-id',
        'fb_custom_audience',
        'fb_custom_audience',
        'api_call',
      );

      expect(stats.increment).toHaveBeenCalledWith('integration_operation_success_count', {
        destinationId: 'test-dest-id',
        destType: 'fb_custom_audience',
        destination: 'fb_custom_audience',
        operation_type: 'api_call',
      });
    });
  });

  describe('batchSize', () => {
    it('should call stats.gauge with correct parameters', () => {
      integrationMetrics.batchSize(
        'test-dest-id',
        'fb_custom_audience',
        'fb_custom_audience',
        'events',
        100,
      );

      expect(stats.gauge).toHaveBeenCalledWith('integration_batch_size', 100, {
        destinationId: 'test-dest-id',
        destType: 'fb_custom_audience',
        destination: 'fb_custom_audience',
        batch_type: 'events',
      });
    });
  });

  describe('operationLatency', () => {
    it('should call stats.histogram with correct parameters', () => {
      integrationMetrics.operationLatency(
        'test-dest-id',
        'fb_custom_audience',
        'fb_custom_audience',
        'api_call',
        150,
      );

      expect(stats.histogram).toHaveBeenCalledWith('integration_operation_latency', 150, {
        destinationId: 'test-dest-id',
        destType: 'fb_custom_audience',
        destination: 'fb_custom_audience',
        operation_type: 'api_call',
      });
    });
  });
});
