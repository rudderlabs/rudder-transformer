import {
  ConfigurationError,
  InstrumentationError,
  getHashFromArray,
} from '@rudderstack/integrations-lib';
import { constructPayload } from '../../util';
import { ECOMM_EVENTS_WITH_PRODUCT_ARRAY } from './config';
import trackMapping from './data/TopsortTrackConfig.json';
import placementMapping from './data/TopsortPlacementConfig.json';
import itemMapping from './data/TopsortItemConfig.json';
import purchaseItemMapping from './data/TopSortPurchaseProductConfig.json';
import {
  TOPSORT_EVENT_TYPES,
  type TopsortDestinationConfig,
  type TopsortEvent,
  type TopsortEventType,
  type TopsortMessage,
} from './types';

// `constructPayload` returns null only for an empty mapping, which none of ours is; spreading
// widens that to a plain object without a cast.
const mapFields = (source: unknown, mapping: unknown[]): Record<string, unknown> => ({
  ...constructPayload(source, mapping),
});

const TOPSORT_EVENT_TYPE_SET = new Set<unknown>(TOPSORT_EVENT_TYPES);

const isTopsortEventType = (value: unknown): value is TopsortEventType =>
  TOPSORT_EVENT_TYPE_SET.has(value);

const getMappedEventType = (
  topsortEvents: TopsortDestinationConfig['topsortEvents'],
  event: string,
): TopsortEventType => {
  const eventName = event.toLowerCase();
  const mappedEventType: unknown = getHashFromArray(topsortEvents ?? [])[eventName];

  if (!mappedEventType) {
    throw new ConfigurationError(`Event '${eventName}' not found in Topsort event mappings`);
  }
  if (!isTopsortEventType(mappedEventType)) {
    throw new InstrumentationError(`Event not mapped: ${String(mappedEventType)}`);
  }
  return mappedEventType;
};

// The products to fan out over, or undefined when the event maps a single product from its
// top-level properties.
const getProducts = ({ event, properties }: TopsortMessage): unknown[] | undefined => {
  const { products } = properties;
  return ECOMM_EVENTS_WITH_PRODUCT_ARRAY.has(event) &&
    Array.isArray(products) &&
    products.length > 0
    ? products
    : undefined;
};

/**
 * Turn one RudderStack message into the Topsort events it maps to.
 *
 * A purchase is always one event, carrying every product as an item. An impression or click
 * carrying a `products` array fans out to one event per product.
 */
export const buildTopsortEvents = (
  message: TopsortMessage,
  { topsortEvents }: TopsortDestinationConfig,
): TopsortEvent[] => {
  const type = getMappedEventType(topsortEvents, message.event);
  const basePayload = mapFields(message, trackMapping);
  const products = getProducts(message);

  if (type === 'purchases') {
    const items = products
      ? products.map((product) => mapFields(product, purchaseItemMapping))
      : [mapFields(message, purchaseItemMapping)];
    return [{ type, event: { ...basePayload, items, id: message.messageId } }];
  }

  const placementPayload = mapFields(message, placementMapping);
  if (!products) {
    const placement = { ...placementPayload, ...mapFields(message, itemMapping) };
    return [{ type, event: { ...basePayload, placement, id: message.messageId } }];
  }

  // Topsort dedupes on `id`, and the messageId alone would repeat across the fanned-out events,
  // so suffix it with the product's index: distinct per event, stable across retries.
  return products.map((product, index) => ({
    type,
    event: {
      ...basePayload,
      placement: { ...placementPayload, ...mapFields(product, itemMapping) },
      id: `${message.messageId}-${index}`,
    },
  }));
};
