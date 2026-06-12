import lodash from 'lodash';
import stats from '../../../util/stats';
import { constructPayload } from '../../util';
import { ConfigCategory, mappingConfig } from './config';
import type { BrazeDestination, RudderBrazeMessage } from './types';

/**
 * Braze recommended ecommerce event names.
 * https://www.braze.com/docs/user_guide/data/activation/events/recommended_events
 */
export const BRAZE_ECOMMERCE_EVENTS = {
  PRODUCT_VIEWED: 'ecommerce.product_viewed',
  CART_UPDATED: 'ecommerce.cart_updated',
  CHECKOUT_STARTED: 'ecommerce.checkout_started',
  ORDER_PLACED: 'ecommerce.order_placed',
  ORDER_REFUNDED: 'ecommerce.order_refunded',
  ORDER_CANCELLED: 'ecommerce.order_cancelled',
} as const;

export type BrazeEcommerceEventName =
  (typeof BRAZE_ECOMMERCE_EVENTS)[keyof typeof BRAZE_ECOMMERCE_EVENTS];

export type CartUpdatedAction = 'add' | 'remove' | 'replace';

export type EcommerceMapping = {
  brazeEvent: BrazeEcommerceEventName;
  action?: CartUpdatedAction;
};

export type EcommerceEventProperties = Record<string, unknown> & {
  products?: Record<string, unknown>[];
  metadata?: Record<string, unknown>;
  source?: 'web' | 'ios' | 'android';
  action?: CartUpdatedAction;
};

const VALIDATION_WARN_COUNTER = 'braze_recommended_event_validation_warn';

const BRAZE_SOURCE_VALUES = new Set<string>(['web', 'ios', 'android']);

// Case-insensitive RS event name → Braze recommended event mapping.
// Keys are lowercased RS event names.
const EVENT_NAME_TO_BRAZE: Record<string, EcommerceMapping> = {
  'product viewed': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED },
  'product added': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.CART_UPDATED, action: 'add' },
  'product removed': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.CART_UPDATED, action: 'remove' },
  'cart viewed': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.CART_UPDATED, action: 'replace' },
  'checkout started': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.CHECKOUT_STARTED },
  'order completed': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED },
  'order refunded': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.ORDER_REFUNDED },
  'order cancelled': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.ORDER_CANCELLED },
};

const PER_EVENT_MAPPING_NAME: Record<BrazeEcommerceEventName, string> = {
  [BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED]: ConfigCategory.BRAZE_PRODUCT_VIEWED.name,
  [BRAZE_ECOMMERCE_EVENTS.CART_UPDATED]: ConfigCategory.BRAZE_CART_UPDATED.name,
  [BRAZE_ECOMMERCE_EVENTS.CHECKOUT_STARTED]: ConfigCategory.BRAZE_CHECKOUT_STARTED.name,
  [BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED]: ConfigCategory.BRAZE_ORDER_PLACED.name,
  [BRAZE_ECOMMERCE_EVENTS.ORDER_REFUNDED]: ConfigCategory.BRAZE_ORDER_REFUNDED.name,
  [BRAZE_ECOMMERCE_EVENTS.ORDER_CANCELLED]: ConfigCategory.BRAZE_ORDER_CANCELLED.name,
};

// Events that carry a products[] array on the outgoing payload.
// product_viewed is the only flat (single-product) event.
const EVENTS_WITH_PRODUCTS_ARRAY: ReadonlySet<BrazeEcommerceEventName> =
  new Set<BrazeEcommerceEventName>([
    BRAZE_ECOMMERCE_EVENTS.CART_UPDATED,
    BRAZE_ECOMMERCE_EVENTS.CHECKOUT_STARTED,
    BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED,
    BRAZE_ECOMMERCE_EVENTS.ORDER_REFUNDED,
    BRAZE_ECOMMERCE_EVENTS.ORDER_CANCELLED,
  ]);

type MappingEntry = {
  destKey: string;
  sourceKeys: string | string[];
  required?: boolean;
  brazeRequired?: boolean;
  sourceFromGenericMap?: boolean;
  metadata?: Record<string, unknown>;
};

// ---------------------------------------------------------------------------
// Private helpers (declared before the public surface for no-use-before-define)
// ---------------------------------------------------------------------------

/**
 * Mirror `constructPayload`'s truthiness rule: `0` and `false` are valid values; only
 * undefined/null/empty-string count as missing.
 */
function isResolvedValue(value: unknown): boolean {
  if (value === 0 || value === false) return true;
  if (value === undefined || value === null) return false;
  return !(typeof value === 'string' && value.length === 0);
}

/**
 * Return the subset of `source` whose keys are not in `consumed`.
 * Used to derive the `metadata` pass-through.
 */
function pickUnmappedKeys(
  source: Record<string, unknown>,
  consumed: Set<string>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  Object.keys(source).forEach((key) => {
    if (!consumed.has(key) && source[key] !== undefined) {
      result[key] = source[key];
    }
  });
  return result;
}

/**
 * Compute the set of source keys referenced by a per-product mapping. Product mappings
 * use bare keys (`product_id`, `name`, ...), so no prefix-stripping is required.
 */
function consumedKeysFromMapping(mapping: MappingEntry[]): Set<string> {
  const consumed = new Set<string>();
  mapping.forEach((entry) => {
    const sources = Array.isArray(entry.sourceKeys) ? entry.sourceKeys : [entry.sourceKeys];
    sources.forEach((src) => {
      if (typeof src === 'string') {
        consumed.add(src);
      }
    });
  });
  return consumed;
}

/**
 * Emit one `braze_recommended_event_validation_warn` counter increment per
 * brazeRequired field that resolved to a missing value on the constructed payload.
 *
 * `extraRequired` lets the caller add conditionally-required fields (e.g. `total_value`
 * becomes required when `action=replace`).
 *
 * Counter labels match the LLD § 11.1 contract; values are bounded categorical.
 */
function emitMissingFieldCounters(params: {
  destination: BrazeDestination;
  brazeEvent: BrazeEcommerceEventName;
  mapping: MappingEntry[];
  payload: Record<string, unknown>;
  extraRequired?: string[];
}): void {
  const { destination, brazeEvent, mapping, payload, extraRequired } = params;

  const requiredDestKeys = new Set<string>();
  mapping.forEach((entry) => {
    if (entry.brazeRequired) {
      requiredDestKeys.add(entry.destKey);
    }
  });
  if (extraRequired) {
    extraRequired.forEach((key) => requiredDestKeys.add(key));
  }

  requiredDestKeys.forEach((destKey) => {
    if (!isResolvedValue(lodash.get(payload, destKey))) {
      stats.counter(VALIDATION_WARN_COUNTER, 1, {
        destination_id: destination.ID,
        workspace_id: destination.WorkspaceID,
        braze_event: brazeEvent,
        missing_field: destKey,
      });
    }
  });
}

/**
 * Compute the set of message-property keys that are "consumed" by the event-level
 * mapping (so they don't get duplicated into `metadata`). Includes:
 *   - keys referenced by `sourceKeys` (stripping the `properties.` prefix)
 *   - per-product keys for cart_updated add/remove (since those fields live at
 *     `properties.X` top-level and are folded into `products[0]`)
 *   - the `products` key itself for product-bearing events
 *   - the `source` key (always derived/written, never passed through to metadata)
 */
function consumedTopLevelKeysForEvent(
  brazeEvent: BrazeEcommerceEventName,
  action: CartUpdatedAction | undefined,
  eventMapping: MappingEntry[],
): Set<string> {
  const consumed = new Set<string>();
  consumed.add('source');

  eventMapping.forEach((entry) => {
    const sources = Array.isArray(entry.sourceKeys) ? entry.sourceKeys : [entry.sourceKeys];
    sources.forEach((src) => {
      // Event-level mappings are addressed as `properties.X`; record just `X`.
      if (typeof src === 'string' && src.startsWith('properties.')) {
        consumed.add(src.slice('properties.'.length));
      }
    });
  });

  if (EVENTS_WITH_PRODUCTS_ARRAY.has(brazeEvent)) {
    consumed.add('products');
  }

  // cart_updated add/remove uses top-level product fields as a single wrapped product.
  const isCartAddOrRemove =
    brazeEvent === BRAZE_ECOMMERCE_EVENTS.CART_UPDATED && (action === 'add' || action === 'remove');
  if (isCartAddOrRemove) {
    const productMapping = mappingConfig[
      ConfigCategory.BRAZE_ECOMMERCE_PRODUCT.name
    ] as unknown as MappingEntry[];
    consumedKeysFromMapping(productMapping).forEach((key) => consumed.add(key));
  }

  return consumed;
}

/**
 * Map a single product item via the shared product mapping, route unmapped keys to
 * its `metadata` field, and emit validation-warn counters per missing brazeRequired field.
 */
function mapProduct(
  item: Record<string, unknown>,
  productMapping: MappingEntry[],
  destination: BrazeDestination,
  brazeEvent: BrazeEcommerceEventName,
): Record<string, unknown> {
  const product = (constructPayload(item, productMapping) || {}) as Record<string, unknown>;

  const consumedKeys = consumedKeysFromMapping(productMapping);
  const productMetadata = pickUnmappedKeys(item, consumedKeys);
  if (Object.keys(productMetadata).length > 0) {
    product.metadata = productMetadata;
  }

  emitMissingFieldCounters({
    destination,
    brazeEvent,
    mapping: productMapping,
    payload: product,
  });

  return product;
}

/**
 * Build the `products[]` array for the outgoing payload.
 * - cart_updated (add/remove): wrap top-level product fields into a 1-element array.
 * - cart_updated (replace) and other product-bearing events: map each item in `properties.products`.
 */
function buildProductsArray(
  message: RudderBrazeMessage,
  brazeEvent: BrazeEcommerceEventName,
  action: CartUpdatedAction | undefined,
  destination: BrazeDestination,
): Record<string, unknown>[] {
  const productMapping = mappingConfig[
    ConfigCategory.BRAZE_ECOMMERCE_PRODUCT.name
  ] as unknown as MappingEntry[];

  const properties = (message.properties || {}) as Record<string, unknown>;
  const isCartAddOrRemove =
    brazeEvent === BRAZE_ECOMMERCE_EVENTS.CART_UPDATED && (action === 'add' || action === 'remove');

  // Single-product wrapping: treat top-level RS product fields as a 1-element array.
  // No per-product metadata here — unmapped event-level keys (cart_id, currency, ...) flow
  // through the event-level metadata pass instead.
  if (isCartAddOrRemove && !Array.isArray(properties.products)) {
    const product = (constructPayload(properties, productMapping) || {}) as Record<string, unknown>;
    emitMissingFieldCounters({
      destination,
      brazeEvent,
      mapping: productMapping,
      payload: product,
    });
    return [product];
  }

  const rawProducts = Array.isArray(properties.products) ? properties.products : [];
  return rawProducts.map((raw) => {
    const item = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    return mapProduct(item, productMapping, destination, brazeEvent);
  });
}

// ---------------------------------------------------------------------------
// Public surface
// ---------------------------------------------------------------------------

/**
 * Resolve the Braze recommended event for a given RS event name.
 * Returns `undefined` for unmapped events — caller falls back to the legacy path.
 *
 * Matching is case-insensitive on the trimmed event name.
 */
export function getEcommerceMapping(eventName: string | undefined): EcommerceMapping | undefined {
  if (typeof eventName !== 'string') {
    return undefined;
  }
  const key = eventName.trim().toLowerCase();
  return EVENT_NAME_TO_BRAZE[key];
}

/**
 * Derive the Braze `source` field with explicit-property precedence.
 *
 * 1. If `properties.source` is a valid Braze enum value (`web`/`ios`/`android`), use it verbatim.
 * 2. Else derive from envelope (`context.channel`, then `context.os.name` for mobile).
 * 3. Else fall through to `'web'` (server-side SDKs, unrecognized channels, mobile-with-unknown-OS).
 *
 * Always returns one of Braze's enum values; never undefined.
 */
export function deriveSource(message: RudderBrazeMessage): 'web' | 'ios' | 'android' {
  const explicit = (message.properties?.source ?? '').toString().toLowerCase();
  if (BRAZE_SOURCE_VALUES.has(explicit)) {
    return explicit as 'web' | 'ios' | 'android';
  }

  // `context` is typed as `{}` by the upstream Zod inference; narrow locally.
  const context = (message.context ?? {}) as { channel?: unknown; os?: { name?: unknown } };
  const channel = (context.channel || message.channel || '').toString().toLowerCase();
  if (channel === 'web') {
    return 'web';
  }
  if (channel === 'mobile') {
    const os = (context.os?.name || '').toString().toLowerCase();
    if (os.includes('ios')) {
      return 'ios';
    }
    if (os.includes('android')) {
      return 'android';
    }
  }
  return 'web';
}

/**
 * Build the `properties` object for a Braze recommended ecommerce event.
 *
 * Algorithm:
 * 1. Resolve the per-event mapping JSON.
 * 2. Run `constructPayload` against the message (all mappings use `required: false`,
 *    so it never throws — send-anyway is enforced here instead).
 * 3. For events with a `products[]`, build the array (single-product wrap for
 *    `cart_updated` add/remove, iterate `properties.products` otherwise).
 * 4. Set `source` via `deriveSource` (always resolves).
 * 5. Set `action` when present.
 * 6. Route unmapped event-level keys to `properties.metadata`,
 *    and unmapped per-product keys to `products[].metadata`.
 * 7. Emit one validation-warn counter increment per missing Braze-required field.
 *
 * Never throws on data shape; counter + missing field on payload is the contract.
 */
export function buildEcommerceEventProperties(
  message: RudderBrazeMessage,
  brazeEvent: BrazeEcommerceEventName,
  action: CartUpdatedAction | undefined,
  destination: BrazeDestination,
): EcommerceEventProperties {
  const eventMapping = mappingConfig[
    PER_EVENT_MAPPING_NAME[brazeEvent]
  ] as unknown as MappingEntry[];

  // Step 1+2: event-level field mapping.
  const payload = (constructPayload(message, eventMapping) || {}) as EcommerceEventProperties;

  // Step 3: products[] (skipped for product_viewed — flat, single-product event).
  if (EVENTS_WITH_PRODUCTS_ARRAY.has(brazeEvent)) {
    payload.products = buildProductsArray(message, brazeEvent, action, destination);
    if (payload.products.length === 0) {
      // products[] is Braze-required on these events. Per-item brazeRequired
      // checks are skipped because there's nothing to check; surface the gap as
      // a single `products[]` counter increment instead.
      stats.counter(VALIDATION_WARN_COUNTER, 1, {
        destination_id: destination.ID,
        workspace_id: destination.WorkspaceID,
        braze_event: brazeEvent,
        missing_field: 'products[]',
      });
    }
  }

  // Step 4+5: source + action.
  payload.source = deriveSource(message);
  if (action) {
    payload.action = action;
  }

  // Step 6: route unmapped event-level keys to metadata.
  const consumedEventKeys = consumedTopLevelKeysForEvent(brazeEvent, action, eventMapping);
  const eventMetadata = pickUnmappedKeys(message.properties || {}, consumedEventKeys);
  if (Object.keys(eventMetadata).length > 0) {
    payload.metadata = eventMetadata;
  }

  // Step 7: validation counter for missing Braze-required event-level fields.
  emitMissingFieldCounters({
    destination,
    brazeEvent,
    mapping: eventMapping,
    payload,
    extraRequired: action === 'replace' ? ['total_value'] : undefined,
  });

  return payload;
}
