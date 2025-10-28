import { FeatureFlagService, FeatureFlagProvider } from '@rudderstack/integrations-lib';
import { productionFlags } from './featureFlagList';
import logger from './logger';

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
export async function createFeatureFlagService(): Promise<FeatureFlagService> {
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
      cacheTtlSeconds: handleNumericEnvVar(process.env.FEATURE_FLAG_CACHE_TTL_SECONDS, 600),
      timeoutSeconds: handleNumericEnvVar(process.env.FEATURE_FLAG_TIMEOUT_SECONDS, 10),
      retryAttempts: handleNumericEnvVar(process.env.FEATURE_FLAG_RETRY_ATTEMPTS, 3),
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
