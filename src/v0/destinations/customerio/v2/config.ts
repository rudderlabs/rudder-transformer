import { getMappingConfig } from '../../../util';

const V2_HOST = 'track.customer.io';
const V2_HOST_EU = 'track-eu.customer.io';

const host = (datacenter?: string): string => (datacenter === 'EU' ? V2_HOST_EU : V2_HOST);

const getV2Endpoint = (datacenter?: string): string => `https://${host(datacenter)}/api/v2/batch`;
const V2_BATCH_PATH = 'v2/batch';

const MAX_OBJECT_SIZE_BYTES = 32 * 1024; // 32KB per object
const MAX_BATCH_PAYLOAD = '500000B';

const DEVICE_EVENT_NAMES = [
  'Application Installed',
  'Application Opened',
  'Application Uninstalled',
];
const DEVICE_DELETE_EVENT_NAME = 'Application Uninstalled';

const OBJECT_ACTIONS = ['identify', 'delete', 'add_relationships', 'delete_relationships'];
const DEFAULT_OBJECT_ACTION = 'identify';

const CONFIG_CATEGORIES = {
  OBJECT_EVENTS: { type: 'group', name: 'customerIoGroup' },
  DEVICE: { type: 'track', name: 'CustomerIODeviceV2' },
};

// getMappingConfig appends `./data/<name>.json` to the dir itself, so pass
// __dirname (the v2 folder) — mappings resolve from v2/data/.
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const RECORD_ACTION_MAP = {
  insert: 'identify',
  update: 'identify',
  delete: 'delete',
} as const;

// Ordered by priority: cio_id > id > email
const RECORD_IDENTIFIER_KEYS = ['cio_id', 'id', 'email'] as const;

export {
  getV2Endpoint,
  V2_BATCH_PATH,
  MAX_OBJECT_SIZE_BYTES,
  MAX_BATCH_PAYLOAD,
  DEVICE_EVENT_NAMES,
  DEVICE_DELETE_EVENT_NAME,
  OBJECT_ACTIONS,
  DEFAULT_OBJECT_ACTION,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  RECORD_ACTION_MAP,
  RECORD_IDENTIFIER_KEYS,
};
