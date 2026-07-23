import { getMappingConfig } from '../../util';
import { isFeatureEnabled } from '../../../util/featureFlags';
import type { BrazeEndpointDetails } from './types';

const ConfigCategory = {
  IDENTIFY: {
    name: 'BrazeUserAttributesConfig',
  },
  DEFAULT: {
    name: 'BrazeUserAttributesConfig',
  },
  // Recommended ecommerce events — per-event mappings powering the
  // `useEcommerceRecommendedEvents` flag. The `brazeEvent` + `rsEvents` rows are
  // the single source of truth for routing in ecommerceUtil.ts; adding a new
  // event = one entry here + one JSON under `data/ecommerce/`.
  BRAZE_PRODUCT_VIEWED: {
    name: 'ecommerce/ProductViewed',
    brazeEvent: 'ecommerce.product_viewed',
    rsEvents: [{ name: 'product viewed' }],
  },
  BRAZE_CART_UPDATED: {
    name: 'ecommerce/CartUpdated',
    brazeEvent: 'ecommerce.cart_updated',
    rsEvents: [
      { name: 'product added', action: 'add' },
      { name: 'product removed', action: 'remove' },
    ],
  },
  BRAZE_CHECKOUT_STARTED: {
    name: 'ecommerce/CheckoutStarted',
    brazeEvent: 'ecommerce.checkout_started',
    rsEvents: [{ name: 'checkout started' }],
  },
  BRAZE_ORDER_PLACED: {
    name: 'ecommerce/OrderPlaced',
    brazeEvent: 'ecommerce.order_placed',
    rsEvents: [{ name: 'order completed' }],
  },
  BRAZE_ORDER_REFUNDED: {
    name: 'ecommerce/OrderRefunded',
    brazeEvent: 'ecommerce.order_refunded',
    rsEvents: [{ name: 'order refunded' }],
  },
  BRAZE_ORDER_CANCELLED: {
    name: 'ecommerce/OrderCancelled',
    brazeEvent: 'ecommerce.order_cancelled',
    rsEvents: [{ name: 'order cancelled' }],
  },
  // Shared per-product mapping for ecommerce events with a `products[]` array.
  // No `brazeEvent` → not a top-level routed event.
  BRAZE_ECOMMERCE_PRODUCT: {
    name: 'ecommerce/Product',
  },
} as const;

function getIdentifyEndpoint(baseEndpoint: string): BrazeEndpointDetails {
  return {
    endpoint: `${baseEndpoint}/users/identify`,
    path: 'users/identify',
  };
}

function getTrackEndPoint(baseEndpoint: string): BrazeEndpointDetails {
  return {
    endpoint: `${baseEndpoint}/users/track`,
    path: 'users/track',
  };
}

function getSubscriptionGroupEndPoint(baseEndpoint: string): BrazeEndpointDetails {
  return {
    endpoint: `${baseEndpoint}/v2/subscription/status/set`,
    path: 'v2/subscription/status/set',
  };
}

function getAliasMergeEndPoint(baseEndpoint: string): BrazeEndpointDetails {
  return {
    endpoint: `${baseEndpoint}/users/merge`,
    path: 'users/merge',
  };
}

const mappingConfig = getMappingConfig(ConfigCategory, __dirname) as Record<
  string,
  {
    [key: string]: Record<string, unknown>;
  }
>;
const BRAZE_PARTNER_NAME = 'RudderStack';

// max requests per batch
// Ref: https://www.braze.com/docs/api/endpoints/user_data/post_user_track/
const TRACK_BRAZE_MAX_REQ_COUNT = 75;
const TRACK_BRAZE_MAX_EXTERNAL_ID_COUNT = 75;
const IDENTIFY_BRAZE_MAX_REQ_COUNT = 50;

// Per-item and per-batch byte-size caps enforced during chunking.
// Ref: https://www.braze.com/docs/user_guide/data/activation/events/recommended_events#event-size-limit
const TRACK_BRAZE_MAX_ITEM_BYTE_SIZE = 100 * 1024; // 100 KB
const TRACK_BRAZE_MAX_BATCH_BYTE_SIZE = 4 * 1024 * 1024; // 4 MB
// https://www.braze.com/docs/api/endpoints/user_data/post_user_delete/

const ALIAS_BRAZE_MAX_REQ_COUNT = 50;
const SUBSCRIPTION_BRAZE_MAX_REQ_COUNT = 25;

const DEL_MAX_BATCH_SIZE = 50;
const DESTINATION = 'braze';

// Per-workspace rollout gate for the per-job delivery-mapping output shape
// (INT-6808 + INT-6634). When OFF (default), processBatch emits the legacy
// single MultiBatchRequestOutput with a flat metadata list and no destInfo.
// When ON, processBatch emits one BatchRequestOutput per outgoing HTTP
// request, with per-metadata destInfo positional maps used by the v1
// networkHandler to correlate Braze per-item warnings back to jobs.
//
// Delegates to the shared per-workspace feature-flag reader, with
// BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS as an ENABLE (allow) list so the
// ON path can be rolled out to a subset of workspaces:
//   - unset (default): OFF for every workspace
//   - 'ALL':           ON for every workspace
//   - 'ws1,ws2,…':     ON only for the listed workspaceIds
//   - any other value: OFF (not ALL, not a listed id)
// isFeatureEnabled reads process.env dynamically (not cached at module load) so
// the component-test envOverrides and a rollout config change take effect
// without a process restart.
const isPerJobDeliveryMappingEnabled = (workspaceId: string): boolean =>
  isFeatureEnabled('BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS', workspaceId);

const CustomAttributeOperationTypes = {
  REMOVE: 'remove',
  UPDATE: 'update',
  ADD: 'add',
  CREATE: 'create',
};

const BRAZE_NON_BILLABLE_ATTRIBUTES = [
  'country',
  'language',
  'email_subscribe',
  'push_subscribe',
  'subscription_groups',
];

const BRAZE_PURCHASE_STANDARD_PROPERTIES = ['product_id', 'sku', 'price', 'quantity', 'currency'];

export {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint,
  getSubscriptionGroupEndPoint,
  getAliasMergeEndPoint,
  BRAZE_PARTNER_NAME,
  BRAZE_PURCHASE_STANDARD_PROPERTIES,
  TRACK_BRAZE_MAX_REQ_COUNT,
  TRACK_BRAZE_MAX_EXTERNAL_ID_COUNT,
  IDENTIFY_BRAZE_MAX_REQ_COUNT,
  DESTINATION,
  CustomAttributeOperationTypes,
  DEL_MAX_BATCH_SIZE,
  BRAZE_NON_BILLABLE_ATTRIBUTES,
  ALIAS_BRAZE_MAX_REQ_COUNT,
  SUBSCRIPTION_BRAZE_MAX_REQ_COUNT,
  TRACK_BRAZE_MAX_ITEM_BYTE_SIZE,
  TRACK_BRAZE_MAX_BATCH_BYTE_SIZE,
  isPerJobDeliveryMappingEnabled,
};
