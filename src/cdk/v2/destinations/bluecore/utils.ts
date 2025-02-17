import { merge } from 'lodash';

import {
  InstrumentationError,
  isDefinedAndNotNullAndNotEmpty,
  getHashFromArrayWithDuplicate,
  isDefinedAndNotNull,
  isDefinedNotNullNotEmpty,
} from '@rudderstack/integrations-lib';
import {
  getFieldValueFromMessage,
  validateEventName,
  constructPayload,
  getDestinationExternalID,
  extractCustomFields,
} from '../../../../v0/util';
import { CommonUtils } from '../../../../util/common';
import {
  EVENT_NAME_MAPPING,
  IDENTIFY_EXCLUSION_LIST,
  TRACK_EXCLUSION_LIST,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
} from './config';
import { EventType } from '../../../../constants';

// Define interfaces for commonly used types
interface Message {
  type: string;
  traits?: {
    action?: string;
    [key: string]: any;
  };
  properties?: {
    [key: string]: any;
  };
  event?: string;
}

interface Payload {
  event: string;
  properties?: {
    customer?: Record<string, any>;
    search_term?: string;
    order_id?: string;
    total?: number;
    [key: string]: any;
  };
}

interface Product {
  product_id?: string | number;
  sku?: string;
  id?: string;
  query?: string;
  order_id?: string;
  total?: number;
  [key: string]: any;
}

interface DestConfig {
  eventsMapping: Array<{
    from: string;
    to: string;
  }>;
}

const validateCustomerProperties = (payload: Payload, eventName: string): void => {
  if (Object.keys(payload?.properties?.customer || {}).length === 0) {
    throw new InstrumentationError(
      `[Bluecore] property:: No relevant trait to populate customer information, which is required for ${eventName} action`,
    );
  }
};

const validateIdentifyAction = (message: Message): void => {
  if (
    message.type === EventType.IDENTIFY &&
    isDefinedNotNullNotEmpty(message.traits?.action) &&
    message.traits?.action !== 'identify'
  ) {
    throw new InstrumentationError(
      "[Bluecore] traits.action must be 'identify' for identify action",
    );
  }
};

const validateSearchEvent = (payload: Payload): void => {
  if (!payload?.properties?.search_term) {
    throw new InstrumentationError(
      '[Bluecore] property:: search_query is required for search event',
    );
  }
};

const validatePurchaseEvent = (payload: Payload): void => {
  if (!isDefinedAndNotNull(payload?.properties?.order_id)) {
    throw new InstrumentationError('[Bluecore] property:: order_id is required for purchase event');
  }
  if (!isDefinedAndNotNull(payload?.properties?.total)) {
    throw new InstrumentationError('[Bluecore] property:: total is required for purchase event');
  }
  validateCustomerProperties(payload, 'purchase');
};

const validateCustomerEvent = (payload: Payload, message: Message): void => {
  if (!isDefinedAndNotNullAndNotEmpty(getFieldValueFromMessage(message, 'email'))) {
    throw new InstrumentationError(
      `[Bluecore] property:: email is required for ${payload.event} action`,
    );
  }
  validateCustomerProperties(payload, payload.event);
};

const validateEventSpecificPayload = (payload: Payload, message: Message): void => {
  const eventValidators = {
    search: validateSearchEvent,
    purchase: validatePurchaseEvent,
    identify: validateCustomerEvent,
    optin: validateCustomerEvent,
    unsubscribe: validateCustomerEvent,
  };

  const validator = eventValidators[payload.event];
  if (validator) {
    validator(payload, message);
  }
};

/**
 * Verifies the correctness of payload for different events.
 *
 * @param {Object} payload - The payload object containing event information.
 * @param {Object} message - The message object containing additional information.
 * @throws {InstrumentationError} - Throws an error if required properties are missing.
 * @returns {void}
 */
const verifyPayload = (payload: Payload, message: Message): void => {
  validateIdentifyAction(message);
  validateEventSpecificPayload(payload, message);
};

/**
 * Deduces the track event name based on the provided track event name and configuration.
 *
 * @param {string} trackEventName - The track event name to deduce.
 * @param {object} Config - The configuration object.
 * @returns {string|array} - The deduced track event name.
 */
const deduceTrackEventName = (trackEventName: string, destConfig: DestConfig): string[] => {
  let eventName;
  const { eventsMapping } = destConfig;
  validateEventName(trackEventName);
  /*
    Step 1: Will look for the event name in the eventsMapping array if mapped to a standard bluecore event.
            and return the corresponding event name if found.
     */
  if (eventsMapping.length > 0) {
    const keyMap = getHashFromArrayWithDuplicate(eventsMapping, 'from', 'to', false);
    eventName = keyMap[trackEventName];
  }
  if (isDefinedAndNotNullAndNotEmpty(eventName)) {
    const finalEvent = typeof eventName === 'string' ? [eventName] : [...eventName];
    return finalEvent;
  }

  /*
    Step 2: To find if the particular event is amongst the list of standard
            Rudderstack ecommerce events, used specifically for Bluecore API
            mappings.
    */

  const eventMapInfo = EVENT_NAME_MAPPING.find((eventMap) =>
    eventMap.src.includes(trackEventName.toLowerCase()),
  ) || { dest: trackEventName };
  return [eventMapInfo.dest];
};

/**
 * Determines if the given event name is a standard Bluecore event.
 *
 * @param {string} eventName - The name of the event to check.
 * @returns {boolean} - True if the event is a standard Bluecore event, false otherwise.
 */
const isStandardBluecoreEvent = (eventName: string): boolean => {
  // Return false immediately if eventName is an empty string or falsy
  if (!eventName) {
    return false;
  }
  // Proceed with the original check if eventName is not empty
  return !!EVENT_NAME_MAPPING.some((item) => item.dest.includes(eventName));
};

/**
 * Adds an array of products to a message.
 *
 * @param {object} message - The message object to add the products to.
 * @param {array|object} products - The array or object of products to add.
 * @param {string} eventName - The name of the event.
 * @throws {InstrumentationError} - If the products array is not defined or null.
 * @returns {array} - The updated product array.
 */
const normalizeProductArray = (products: Product | Product[] | null): Product[] | null => {
  if (!isDefinedAndNotNull(products)) {
    return null;
  }
  return CommonUtils.toArray(products).map(
    ({ product_id, sku, id, query, order_id, total, ...rest }) => ({
      id: product_id || sku || id,
      ...rest,
    }),
  );
};

const mapCustomProperties = (message: Message): { properties: Record<string, any> } => {
  let customerProperties;
  const customProperties = { properties: {} as Record<string, any> };
  const messageType = message.type.toUpperCase();
  switch (messageType) {
    case 'IDENTIFY':
      customerProperties = extractCustomFields(
        message,
        {},
        ['traits', 'context.traits'],
        IDENTIFY_EXCLUSION_LIST,
      );
      customProperties.properties.customer = customerProperties;
      break;
    case 'TRACK':
      customerProperties = extractCustomFields(
        message,
        {},
        ['traits', 'context.traits'],
        IDENTIFY_EXCLUSION_LIST,
      );
      customProperties.properties = extractCustomFields(
        message,
        {},
        ['properties'],
        TRACK_EXCLUSION_LIST,
      );
      customProperties.properties.customer = customerProperties;
      break;
    default:
      break;
  }
  return customProperties;
};

/**
 * Constructs properties based on the given message.
 *
 * @param {object} message - The message object.
 * @returns {object} - The constructed properties object.
 */
const constructProperties = (message: Message): Record<string, any> => {
  const commonCategory = CONFIG_CATEGORIES.COMMON;
  const commonPayload = constructPayload(message, MAPPING_CONFIG[commonCategory.name]);
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  const typeSpecificPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const typeSpecificCustomProperties = mapCustomProperties(message);
  return merge(commonPayload, typeSpecificPayload, typeSpecificCustomProperties);
};

/**
 * Creates a product for a standard e-commerce event.
 *
 * @param {Object} properties - The properties of the product.
 * @param {string} eventName - The name of the event.
 * @returns {Array|null} - An array containing the properties if the event is a standard Bluecore event and not 'search', otherwise null.
 */
const createProductForStandardEcommEvent = (
  message: Message,
  eventName?: string,
): Product[] | null => {
  if (!eventName) {
    return null;
  }
  const { event, properties } = message;
  if (event?.toLowerCase() === 'order completed' && eventName === 'purchase') {
    throw new InstrumentationError('[Bluecore]:: products array is required for purchase event');
  }
  if (eventName !== 'search' && isStandardBluecoreEvent(eventName)) {
    return [properties as Product];
  }
  return null;
};

/**
 * Function: populateAccurateDistinctId
 *
 * Description:
 * This function is used to populate the accurate distinct ID based on the given payload and message.
 *
 * Parameters:
 * - payload (object): The payload object containing the event and other data.
 * - message (object): The message object containing the user data.
 *
 * Returns:
 * - distinctId (string): The accurate distinct ID based on the given payload and message.
 *
 * Throws:
 * - InstrumentationError: If the distinct ID could not be set.
 *
 */
const populateAccurateDistinctId = (payload: Payload, message: Message): string => {
  const bluecoreExternalId = getDestinationExternalID(message, 'bluecoreExternalId');
  if (isDefinedAndNotNullAndNotEmpty(bluecoreExternalId)) {
    return bluecoreExternalId;
  }
  let distinctId;
  if (payload.event === 'identify') {
    distinctId = getFieldValueFromMessage(message, 'userId');
  } else {
    // email is always a more preferred distinct_id
    distinctId =
      getFieldValueFromMessage(message, 'email') || getFieldValueFromMessage(message, 'userId');
  }

  if (!isDefinedAndNotNullAndNotEmpty(distinctId)) {
    // dev safe. AnonymouId should be always present
    throw new InstrumentationError(
      '[Bluecore] property:: distinct_id could not be set. Please provide either email or userId or anonymousId or externalId as distinct_id.',
    );
  }
  return distinctId;
};

export {
  verifyPayload,
  deduceTrackEventName,
  normalizeProductArray,
  isStandardBluecoreEvent,
  constructProperties,
  createProductForStandardEcommEvent,
  populateAccurateDistinctId,
};
