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
