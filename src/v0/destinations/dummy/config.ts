/**
 * Dummy destination configuration
 * This destination is used for testing common or platform changes without destination-specific concerns
 */

import { getMappingConfig } from '../../util';

// Define endpoint (this is a dummy endpoint that won't be used)
export const ENDPOINT = 'https://dummy-destination.example.com/api';

// Define configuration categories
export const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: 'DummyIdentifyConfig',
    type: 'identify',
  },
  TRACK: {
    name: 'DummyTrackConfig',
    type: 'track',
  },
  PAGE: {
    name: 'DummyPageConfig',
    type: 'page',
  },
  SCREEN: {
    name: 'DummyScreenConfig',
    type: 'screen',
  },
  GROUP: {
    name: 'DummyGroupConfig',
    type: 'group',
  },
  ALIAS: {
    name: 'DummyAliasConfig',
    type: 'alias',
  },
};

// Get mapping config
export const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, `${__dirname}`);

// Export destination name
export const DESTINATION = 'DUMMY';

// Batching configuration
export const MAX_BATCH_SIZE = 10;
export const DEFAULT_BATCH_SIZE = 5;

// Rate limiting configuration
export const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
export const RATE_LIMIT_COUNT = 100; // 100 requests per minute

// Retry configuration
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000; // 1 second

// Throttling cost configuration
export const THROTTLING_COST = {
  IDENTIFY: 1,
  TRACK: 1,
  PAGE: 1,
  SCREEN: 1,
  GROUP: 2, // Group events cost more
  ALIAS: 2, // Alias events cost more
};
