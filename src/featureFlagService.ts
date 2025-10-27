import { FeatureFlagService, FeatureFlagProvider } from '@rudderstack/integrations-lib';
import logger from './logger';

export const productionFlags = [
  {
    key: 'enable-pinterest-advertising-tracking-mapping',
    name: 'Pinterest Advertising',
    description: 'Enable pinterest tag advertising tracking mapping',
    defaultValue: false,
    type: 'boolean' as const,
  },
];

// Global instance holder
let featureFlagInstance: FeatureFlagService | null = null;
let initializationPromise: Promise<FeatureFlagService> | null = null;

// Create feature flag service using static create method (singleton pattern)
async function createFeatureFlagService(): Promise<FeatureFlagService> {
  if (featureFlagInstance) {
    return featureFlagInstance;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    const featureFlagConfig = {
      provider: (process.env.FEATURE_FLAG_PROVIDER as FeatureFlagProvider) || 'local',
      apiKey: process.env.FLAGSMITH_API_KEY,
      enableLocalEvaluation: true,
      enableCache: process.env.FEATURE_FLAG_ENABLE_CACHE === 'true',
      cacheTtlSeconds:
        process.env.FEATURE_FLAG_CACHE_TTL_SECONDS &&
        !Number.isNaN(process.env.FEATURE_FLAG_CACHE_TTL_SECONDS)
          ? Number(process.env.FEATURE_FLAG_CACHE_TTL_SECONDS)
          : 600,
      timeoutSeconds:
        process.env.FEATURE_FLAG_TIMEOUT_SECONDS &&
        !Number.isNaN(process.env.FEATURE_FLAG_TIMEOUT_SECONDS)
          ? Number(process.env.FEATURE_FLAG_TIMEOUT_SECONDS)
          : 10,
      retryAttempts:
        process.env.FEATURE_FLAG_RETRY_ATTEMPTS &&
        !Number.isNaN(process.env.FEATURE_FLAG_RETRY_ATTEMPTS)
          ? Number(process.env.FEATURE_FLAG_RETRY_ATTEMPTS)
          : 3,
      enableAnalytics: process.env.FEATURE_FLAG_ENABLE_ANALYTICS !== 'false',
    };

    logger.info(
      'Initializing FeatureFlagService with config:',
      JSON.stringify({ ...featureFlagConfig, apiKey: '[REDACTED]' }),
    );
    featureFlagInstance = await FeatureFlagService.create(featureFlagConfig, productionFlags);
    return featureFlagInstance;
  })();

  return initializationPromise;
}

// Export the singleton instance getter function
export const getFeatureFlagService = createFeatureFlagService;
