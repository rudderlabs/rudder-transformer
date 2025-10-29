// Mock the integrations-lib module
const mockCreate = jest.fn();
jest.mock('@rudderstack/integrations-lib', () => ({
  FeatureFlagService: {
    create: mockCreate,
  },
}));

// Mock logger
const mockLoggerInfo = jest.fn();
jest.mock('../../src/logger', () => ({
  info: mockLoggerInfo,
}));

describe('FeatureFlagService', () => {
  let mockServiceInstance: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create a mock service instance
    mockServiceInstance = {
      isFeatureEnabled: jest.fn(),
      getFeatureFlag: jest.fn(),
      getAllFlags: jest.fn(),
    };

    mockCreate.mockResolvedValue(mockServiceInstance);
  });

  describe('configuration parsing', () => {
    const originalEnv = process.env;

    afterEach(() => {
      // Restore original environment
      process.env = originalEnv;
    });

    it('should create a feature flag service with default configuration', async () => {
      // Clear environment to test defaults
      process.env = {};

      jest.resetModules();
      const { getFeatureFlagService } = require('../../src/featureFlagService');

      const service = await getFeatureFlagService();

      expect(mockCreate).toHaveBeenCalledWith(
        {
          provider: 'local',
          apiKey: undefined,
          enableLocalEvaluation: true,
          enableCache: true,
          cacheTtlSeconds: 600,
          timeoutSeconds: 10,
          retryAttempts: 3,
          enableAnalytics: true,
        },
        [
          {
            key: 'enable-pinterest-advertising-tracking-mapping',
            name: 'Pinterest Advertising Tracking Mapping',
            description: 'Enable pinterest tag advertising tracking mapping',
            defaultValue: false,
            type: 'boolean',
          },
        ],
      );

      expect(mockLoggerInfo).toHaveBeenCalledWith(
        'Initializing FeatureFlagService with provider as: ',
        'local',
      );

      expect(service).toBe(mockServiceInstance);
    });

    it('should use environment variables when provided', async () => {
      process.env = {
        FEATURE_FLAG_PROVIDER: 'flagsmith',
        FLAGSMITH_API_KEY: 'dummy-test-api-key',
        FEATURE_FLAG_ENABLE_CACHE: 'true',
        FEATURE_FLAG_CACHE_TTL_SECONDS: '300',
        FEATURE_FLAG_TIMEOUT_SECONDS: '5',
        FEATURE_FLAG_RETRY_ATTEMPTS: '2',
        FEATURE_FLAG_ENABLE_ANALYTICS: 'false',
      };

      jest.resetModules();
      const { getFeatureFlagService } = require('../../src/featureFlagService');

      await getFeatureFlagService();

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: 'flagsmith',
          apiKey: 'dummy-test-api-key',
          enableCache: true,
          cacheTtlSeconds: 300,
          timeoutSeconds: 5,
          retryAttempts: 2,
          enableAnalytics: false,
        }),
        expect.any(Array),
      );
    });

    it('should handle invalid numeric environment variables correctly', async () => {
      process.env = {
        FEATURE_FLAG_CACHE_TTL_SECONDS: 'invalid',
        FEATURE_FLAG_TIMEOUT_SECONDS: 'not-a-number',
        FEATURE_FLAG_RETRY_ATTEMPTS: 'NaN',
      };

      jest.resetModules();
      const { getFeatureFlagService } = require('../../src/featureFlagService');

      await getFeatureFlagService();

      // Invalid numeric environment variables should fall back to default values
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          cacheTtlSeconds: 600, // falls back to default when 'invalid' can't be parsed
          timeoutSeconds: 10, // falls back to default when 'not-a-number' can't be parsed
          retryAttempts: 3, // falls back to default when 'NaN' can't be parsed
        }),
        expect.any(Array),
      );
    });
  });

  describe('singleton behavior', () => {
    it('should return the same instance on multiple calls without resetting modules', async () => {
      // Reset modules to start fresh
      jest.resetModules();
      const { getFeatureFlagService } = require('../../src/featureFlagService');

      // Make multiple calls to the service
      const service1 = await getFeatureFlagService();
      const service2 = await getFeatureFlagService();
      const service3 = await getFeatureFlagService();

      // All should return the same instance
      expect(service1).toBe(service2);
      expect(service2).toBe(service3);
      expect(service1).toBe(mockServiceInstance);

      // FeatureFlagService.create should only be called once due to singleton pattern
      expect(mockCreate).toHaveBeenCalledTimes(1);

      // Logger should only be called once during initialization
      expect(mockLoggerInfo).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent calls correctly with singleton pattern', async () => {
      // Reset modules to start fresh
      jest.resetModules();
      const { getFeatureFlagService } = require('../../src/featureFlagService');

      // Make concurrent calls
      const promises = [
        getFeatureFlagService(),
        getFeatureFlagService(),
        getFeatureFlagService(),
        getFeatureFlagService(),
      ];

      const services = await Promise.all(promises);

      // All should return the same instance
      services.forEach((service) => {
        expect(service).toBe(mockServiceInstance);
        expect(service).toBe(services[0]);
      });

      // FeatureFlagService.create should only be called once even with concurrent calls
      expect(mockCreate).toHaveBeenCalledTimes(1);

      // Logger should only be called once during initialization
      expect(mockLoggerInfo).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should handle FeatureFlagService.create rejection', async () => {
      const error = new Error('Failed to initialize feature flag service');
      mockCreate.mockRejectedValueOnce(error);

      jest.resetModules();
      const { getFeatureFlagService } = require('../../src/featureFlagService');

      await expect(getFeatureFlagService()).rejects.toThrow(
        'Failed to initialize feature flag service',
      );
    });
  });
});
