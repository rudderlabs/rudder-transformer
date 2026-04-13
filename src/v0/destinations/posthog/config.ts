import { getMappingConfig } from '../../util';

const DEFAULT_BASE_ENDPOINT = 'https://app.posthog.com';

const CONFIG_CATEGORIES = {
  ALIAS: {
    name: 'PHAliasConfig',
    type: 'alias',
    event: '$create_alias',
  },
  TRACK: { name: 'PHTrackConfig', type: 'capture' },
  IDENTIFY: {
    name: 'PHIdentifyConfig',
    type: 'identify',
    event: '$identify',
  },
  GROUP: {
    name: 'PHGroupConfigOld',
    type: 'group',
    event: '$groupidentify',
  },
  GROUPV2: {
    name: 'PHGroupConfig',
    type: 'group',
    event: '$groupidentify',
  },
  PAGE: {
    name: 'PHPageConfig',
    type: 'page',
    event: '$pageview',
  },
  SCREEN: {
    name: 'PHScreenConfig',
    type: 'screen',
    event: '$screen',
  },
};

const PROPERTY = {
  name: 'PHPropertiesConfig',
};

const MAPPING_CONFIG = getMappingConfig({ ...CONFIG_CATEGORIES, PROPERTY }, __dirname);

// PostHog's Kafka producer defaults to message.max.bytes = 1,000,000. To keep headroom of 100kb we kept the limit to 900_000
// https://posthog.com/docs/data/ingestion-warnings
const MAX_EVENT_SIZE_BYTES = 900_000;

export { DEFAULT_BASE_ENDPOINT, CONFIG_CATEGORIES, MAPPING_CONFIG, PROPERTY, MAX_EVENT_SIZE_BYTES };
