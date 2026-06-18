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

export type CartUpdatedAction = 'add' | 'remove';

export type EcommerceMapping = {
  brazeEvent: BrazeEcommerceEventName;
  action?: CartUpdatedAction;
};

export type EcommerceEventProperties = Record<string, unknown> & {
  products?: Record<string, unknown>[];
  metadata?: Record<string, unknown>;
  source: 'web' | 'ios' | 'android';
  action?: CartUpdatedAction;
};

const VALIDATION_WARN_COUNTER = 'braze_recommended_event_validation_warn';

const BRAZE_SOURCE_VALUES = new Set<string>(['web', 'ios', 'android']);

// Case-insensitive RS event name → Braze recommended event mapping.
// Keys are lowercased RS event names. `Cart Viewed` and `Cart Updated` are
// intentionally absent — both were dropped from scope on 2026-06-16 because the
// `cart_updated(replace)` overwrite-on-view semantics were deemed too risky for v1.
// Both fall through to the legacy custom-event path. No event in this map uses
// `action: 'replace'`, so `CartUpdatedAction` is narrowed to `'add' | 'remove'`.
const EVENT_NAME_TO_BRAZE: Record<string, EcommerceMapping> = {
  'product viewed': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED },
  'product added': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.CART_UPDATED, action: 'add' },
  'product removed': { brazeEvent: BRAZE_ECOMMERCE_EVENTS.CART_UPDATED, action: 'remove' },
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

type MappingEntry = {
  destKey: string;
  sourceKeys: string | string[];
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
 * Emit a single `braze_recommended_event_validation_warn` counter increment if the
 * constructed payload is missing any brazeRequired field — event-level or per-product.
 * Fires at most once per event regardless of how many fields are missing.
 *
 * Per-product fields are checked against every entry of `payload.products`; an
 * empty `products[]` on a product-bearing event also counts as missing.
 *
 * Counter labels match the LLD § 11.1 contract; values are bounded categorical.
 */
function emitValidationCounter(params: {
  destination: BrazeDestination;
  brazeEvent: BrazeEcommerceEventName;
  eventMapping: MappingEntry[];
  productMapping: MappingEntry[] | null;
  payload: Record<string, unknown>;
}): void {
  const { destination, brazeEvent, eventMapping, productMapping, payload } = params;

  const fieldsMissingFromEvent = eventMapping.some(
    (entry) => entry.brazeRequired && !isResolvedValue(lodash.get(payload, entry.destKey)),
  );

  let fieldMissingFromProduct = false;
  if (productMapping !== null) {
    const products = Array.isArray(payload.products)
      ? (payload.products as Record<string, unknown>[])
      : null;
    fieldMissingFromProduct =
      products === null ||
      products.length === 0 ||
      products.some((product) =>
        productMapping.some(
          (entry) => entry.brazeRequired && !isResolvedValue(lodash.get(product, entry.destKey)),
        ),
      );
  }

  if (fieldsMissingFromEvent || fieldMissingFromProduct) {
    stats.counter(VALIDATION_WARN_COUNTER, 1, {
      destination_id: destination.ID,
      workspace_id: destination.WorkspaceID,
      braze_event: brazeEvent,
    });
  }
}

/**
 * Compute the set of message-property keys that are "consumed" by the event-level
 * mapping (so they don't get duplicated into `metadata`). Includes:
 *   - keys referenced by `sourceKeys` (stripping the `properties.` prefix)
 *   - per-product keys for cart_updated (folded into `products[0]` via single-product wrap)
 *   - the `products` key itself for product-bearing events
 *   - the `source` key (always derived/written, never passed through to metadata)
 */
function consumedTopLevelKeysForEvent(
  brazeEvent: BrazeEcommerceEventName,
  eventMapping: MappingEntry[],
  productMapping: MappingEntry[] | null,
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

  if (productMapping !== null) {
    consumed.add('products');
  }

  // cart_updated uses top-level product fields as the single wrapped product;
  // mark those keys as consumed so they don't duplicate into event-level metadata.
  if (brazeEvent === BRAZE_ECOMMERCE_EVENTS.CART_UPDATED && productMapping !== null) {
    consumedKeysFromMapping(productMapping).forEach((key) => consumed.add(key));
  }

  return consumed;
}

/**
 * Build the `products[]` array for the outgoing payload.
 * - cart_updated: read top-level product fields directly from `properties` into a
 *   1-element products[]. No per-product metadata — unmapped event-level keys
 *   (cart_id, currency, custom attrs) flow through the event-level metadata pass.
 * - other product-bearing events: map each item in `properties.products` and route
 *   per-product unmapped keys to `products[i].metadata`.
 */
function buildProductsArray(
  message: RudderBrazeMessage,
  brazeEvent: BrazeEcommerceEventName,
  productMapping: MappingEntry[],
): Record<string, unknown>[] {
  const properties = (message.properties || {}) as Record<string, unknown>;
  const isCartUpdated = brazeEvent === BRAZE_ECOMMERCE_EVENTS.CART_UPDATED;

  if (isCartUpdated && !Array.isArray(properties.products)) {
    return [(constructPayload(properties, productMapping) || {}) as Record<string, unknown>];
  }

  const rawProducts = Array.isArray(properties.products) ? properties.products : [];
  const consumedKeys = consumedKeysFromMapping(productMapping);
  return rawProducts.map((raw) => {
    const item = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const product = (constructPayload(item, productMapping) || {}) as Record<string, unknown>;
    const productMetadata = pickUnmappedKeys(item, consumedKeys);
    if (Object.keys(productMetadata).length > 0) {
      product.metadata = productMetadata;
    }
    return product;
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
 *    so it never throws — send-anyway is enforced via the validation counter instead).
 * 3. For events with a `products[]`, build the array (single-product wrap for
 *    `cart_updated`, iterate `properties.products` otherwise).
 * 4. Set `source` via `deriveSource` (always resolves).
 * 5. Set `action` when present.
 * 6. Route unmapped event-level keys to `properties.metadata`,
 *    and unmapped per-product keys to `products[].metadata`.
 * 7. Emit a single validation-warn counter increment if the event is missing
 *    any Braze-required field (event-level or per-product).
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
  const productMapping =
    brazeEvent === BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED
      ? null
      : (mappingConfig[ConfigCategory.BRAZE_ECOMMERCE_PRODUCT.name] as unknown as MappingEntry[]);

  // Step 1+2: event-level field mapping.
  const payload = (constructPayload(message, eventMapping) || {}) as EcommerceEventProperties;

  // Step 3: products[] (skipped for product_viewed — flat, single-product event).
  if (productMapping !== null) {
    payload.products = buildProductsArray(message, brazeEvent, productMapping);
  }

  // Step 4+5: source + action.
  payload.source = deriveSource(message);
  if (action) {
    payload.action = action;
  }

  // Step 6: route unmapped event-level keys to metadata.
  const consumedEventKeys = consumedTopLevelKeysForEvent(brazeEvent, eventMapping, productMapping);
  const eventMetadata = pickUnmappedKeys(message.properties || {}, consumedEventKeys);
  if (Object.keys(eventMetadata).length > 0) {
    payload.metadata = eventMetadata;
  }

  // Step 7: single validation counter for any missing Braze-required field.
  emitValidationCounter({
    destination,
    brazeEvent,
    eventMapping,
    productMapping,
    payload,
  });

  return payload;
}
