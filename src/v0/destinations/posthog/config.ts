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

// PostHog documents a 1 MB event size limit, but through trial and error we found
// that events under 1 MB are also rejected. PostHog's Kafka producer defaults to
// message.max.bytes = 1,000,000 and Kafka adds framing overhead on top of the payload.
// To keep headroom we set the limit to 900,000 bytes (~100 KB buffer).
// https://posthog.com/docs/data/ingestion-warnings
const MAX_EVENT_SIZE_BYTES = 900_000;

export { DEFAULT_BASE_ENDPOINT, CONFIG_CATEGORIES, MAPPING_CONFIG, PROPERTY, MAX_EVENT_SIZE_BYTES };
