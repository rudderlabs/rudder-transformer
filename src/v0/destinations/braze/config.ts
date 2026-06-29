import { getMappingConfig } from '../../util';
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
// https://www.braze.com/docs/api/endpoints/user_data/post_user_delete/

const ALIAS_BRAZE_MAX_REQ_COUNT = 50;
const SUBSCRIPTION_BRAZE_MAX_REQ_COUNT = 25;

const DEL_MAX_BATCH_SIZE = 50;
const DESTINATION = 'braze';

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
};
