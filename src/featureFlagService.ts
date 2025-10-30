import {
  FeatureFlagService,
  FeatureFlagProvider,
  PlatformError,
} from '@rudderstack/integrations-lib';
import { featureFlags } from './featureFlagList';
import logger from './logger';
import stats from './util/stats';

// Global instance holder
let featureFlagInstance: FeatureFlagService | null = null;
let initializationPromise: Promise<FeatureFlagService> | null = null;

const handleNumericEnvVar = (envVar: string | undefined, defaultValue: number): number => {
  if (envVar && !Number.isNaN(Number(envVar))) {
    return Number(envVar);
  }
  return defaultValue;
};

// Create feature flag service using static create method (singleton pattern)
export async function getFeatureFlagService(): Promise<FeatureFlagService> {
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
      enableCache: process.env.FEATURE_FLAG_ENABLE_CACHE !== 'false',
      cacheTtlSeconds: handleNumericEnvVar(process.env.FEATURE_FLAG_CACHE_TTL_SECONDS, 600),
      timeoutSeconds: handleNumericEnvVar(process.env.FEATURE_FLAG_TIMEOUT_SECONDS, 10),
      retryAttempts: handleNumericEnvVar(process.env.FEATURE_FLAG_RETRY_ATTEMPTS, 3),
      enableAnalytics: process.env.FEATURE_FLAG_ENABLE_ANALYTICS !== 'false',
    };

    logger.info('Initializing FeatureFlagService with provider as: ', featureFlagConfig.provider);
    try {
      featureFlagInstance = await FeatureFlagService.create(featureFlagConfig, featureFlags);
      logger.info('FeatureFlagService initialized successfully');
      return featureFlagInstance;
    } catch (error: any) {
      // Track feature flag initialization failure metric
      stats.increment('feature_flag_initialization_failure', {
        provider: featureFlagConfig.provider,
      });

      // Log detailed error for debugging
      logger.error('Failed to initialize FeatureFlagService', {
        error: error.message,
        stack: error.stack,
        provider: (process.env.FEATURE_FLAG_PROVIDER as string) || 'local',
        apiKeyPresent: !!process.env.FLAGSMITH_API_KEY,
        config: {
          enableLocalEvaluation: true,
          enableCache: process.env.FEATURE_FLAG_ENABLE_CACHE !== 'false',
          cacheTtlSeconds: handleNumericEnvVar(process.env.FEATURE_FLAG_CACHE_TTL_SECONDS, 600),
          timeoutSeconds: handleNumericEnvVar(process.env.FEATURE_FLAG_TIMEOUT_SECONDS, 10),
          retryAttempts: handleNumericEnvVar(process.env.FEATURE_FLAG_RETRY_ATTEMPTS, 3),
          enableAnalytics: process.env.FEATURE_FLAG_ENABLE_ANALYTICS !== 'false',
        },
      });

      // Reset initialization promise to allow retries
      initializationPromise = null;

      // Throw a 5XX error to cause event retry
      throw new PlatformError(`FeatureFlagService initialization failed: ${error.message}`, 500);
    }
  })();

  return initializationPromise;
}
