import { FeatureFlagService, FeatureFlagDefinition } from '@rudderstack/integrations-lib';
import logger from './logger';

enum TransformerFeatureFlagKeys {
  ENABLE_TRANSFORMER_TEST = 'enable-transformer-test',
} 


const transformerFeatureFlags: FeatureFlagDefinition[] = [
  {
    name: 'Enable transformer test feature flag',
    key: TransformerFeatureFlagKeys.ENABLE_TRANSFORMER_TEST as string,
    type: 'boolean',
    defaultValue: false,
    description: 'Enable identity resolution v2',
  },
];

let featureFlagService: FeatureFlagService;

/**
 * Initialize the feature flag service with configuration from environment variables
 * This should be called during application startup
 */
export async function initializeFeatureFlags(): Promise<void> {
  // Check if feature flags are enabled
  const isEnabled = process.env.FEATURE_FLAG_ENABLED === 'true';

  if (!isEnabled) {
    logger.info('Feature flags are disabled via FEATURE_FLAG_ENABLED environment variable');
    return;
  }

  try {
    // Initialize with configuration from environment variables
    // The lib automatically reads FEATURE_FLAG_* environment variables
    featureFlagService = await FeatureFlagService.create({}, transformerFeatureFlags);
    await featureFlagService.initialize();

    logger.info(`Feature flag service initialized successfully`);
  } catch (error) {
    logger.error('Failed to initialize feature flag service:', error);
    // Don't throw the error - feature flags should not prevent application startup

  }
}

export function getFeatureFlagService() {
  return featureFlagService;
}
