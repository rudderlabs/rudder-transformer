import { FeatureFlagService, FeatureFlagDefinition } from '@rudderstack/integrations-lib';
import logger from './logger';

export enum TransformerFeatureFlagKeys {
  ENABLE_TEST_FLAG = 'enable-test-flag',
} 


const transformerFeatureFlags: FeatureFlagDefinition[] = [
  {
    name: 'Enable transformer test feature flag',
    key: TransformerFeatureFlagKeys.ENABLE_TEST_FLAG as string,
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

  featureFlagService = await FeatureFlagService.create({}, transformerFeatureFlags);

}

export function getFeatureFlagService() {
  return featureFlagService;
}
