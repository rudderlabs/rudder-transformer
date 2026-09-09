import { getMappingConfig } from '../../../util';
import { EVENT_TYPES } from '../../../util/recordUtils';
import type { CustomerIODestination } from '../types';

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
  [EVENT_TYPES.INSERT]: 'identify',
  [EVENT_TYPES.UPDATE]: 'identify',
  [EVENT_TYPES.DELETE]: 'delete',
} as const;

// Ordered by priority: cio_id > id > email
const RECORD_IDENTIFIER_KEYS = ['cio_id', 'id', 'email'] as const;

// Enabling the batching framework for CustomerIO (isDestinationIntegrationEnabled) is what's
// needed to unlock record-event support, since the V1 processRouterDest has no concept of
// record events. But it can also move event-stream events (identify/track/page/screen/group/
// alias) onto this V2 code path, which changes their request shape/endpoint — a breaking
// change for existing customers. The per-destination apiVersion config lets event-stream
// events opt into the V2 path independently: when absent or set to v1 (the default), they
// keep using the V1 processRouterDest's request shape even when the batching framework is on
// for the workspace. See routerTransform.ts's transformEventStream/getBatchStrategy.
const isEventStreamV2APIEnabled = (destination: CustomerIODestination): boolean =>
  destination.Config.apiVersion === 'v2';

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
  isEventStreamV2APIEnabled,
};
