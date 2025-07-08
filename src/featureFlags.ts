import { featureFlagService } from '@rudderstack/integrations-lib';
import logger from './logger';

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
    await featureFlagService.initialize();

    const config = featureFlagService.getConfig();
    logger.info(`Feature flag service initialized successfully with provider: ${config?.provider || 'unknown'}`);
  } catch (error) {
    logger.error('Failed to initialize feature flag service:', error);
    // Don't throw the error - feature flags should not prevent application startup

    try {
      // Initialize with local provider as fallback to ensure service is always available
      await featureFlagService.initialize({ provider: 'local' });
      logger.info('Initialized with local provider as fallback after main initialization failure');
    } catch (fallbackError) {
      logger.error('Failed to initialize feature flag service with local fallback:', fallbackError);
    }
  }
}

/**
 * Shutdown the feature flag service
 * This should be called during application shutdown
 */
export async function shutdownFeatureFlags(): Promise<void> {
  try {
    await featureFlagService.shutdown();
    logger.info('Feature flag service shutdown successfully');
  } catch (error) {
    logger.error('Error during feature flag service shutdown:', error);
  }
}

/**
 * Get the feature flag service instance
 * The service already handles:
 * - Default values from flag definitions when errors occur
 * - Proper error logging with the configured logger
 * - Graceful degradation when service is unavailable
 *
 * Usage example:
 * ```typescript
 * import { getFeatureFlagService } from './featureFlags';
 *
 * const service = getFeatureFlagService();
 * const user = {
 *   workspaceId: 'workspace-123',
 *   traits: new Map([['userId', '456']]). // Optional traits - avoid using these, we only need workspaceId
 * };
 * const isEnabled = await service.isFeatureEnabled(user, 'my-feature-flag');
 * const value = await service.getFeatureValue(user, 'my-config-flag');
 * ```
 */
export function getFeatureFlagService() {
  return featureFlagService;
}
