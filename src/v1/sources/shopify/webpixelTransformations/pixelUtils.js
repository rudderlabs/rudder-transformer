/* eslint-disable no-param-reassign */
const Message = require('../../../../v0/sources/message');
const { EventType } = require('../../../../constants');
const {
  INTEGERATION,
  PIXEL_EVENT_MAPPING,
  contextualFieldMappingJSON,
  cartViewedEventMappingJSON,
  productListViewedEventMappingJSON,
  productViewedEventMappingJSON,
  productToCartEventMappingJSON,
  checkoutStartedCompletedEventMappingJSON,
} = require('../config');

function getNestedValue(object, path) {
  const keys = path.split('.');
  return keys.reduce((nestedObject, key) => nestedObject?.[key], object);
}

function setNestedValue(object, path, value) {
  const keys = path.split('.');
  const lastKeyIndex = keys.length - 1;
  keys.reduce((nestedObject, key, index) => {
    if (index === lastKeyIndex) {
      nestedObject[key] = value;
    } else if (!nestedObject[key]) {
      nestedObject[key] = {};
    }
    return nestedObject[key];
  }, object);
}

/*
 * Creates a copy of the source object with the keys mapped to the destination keys
 * Keys that are not present in the mapping will be copied as is
 * @param {Object} sourceObject
 * @param {Array} keyMappings
 * @returns {Object} resultObject
 */
function mapContextObjectKeys(sourceObject, keyMappings) {
  const resultObject = { ...sourceObject };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  return keyMappings.reduce((resultObject, { sourceKeys, destKeys }) => {
    const value = getNestedValue(sourceObject, sourceKeys);
    if (value !== undefined) {
      setNestedValue(resultObject, destKeys, value);
    }
    return resultObject;
  }, resultObject);
}

/*
 * Maps the keys of the source object to the destination object
 * Only the keys that are present in the mapping will be copied
 * @param {Object} sourceObject
 * @param {Array} keyMappings
 * @returns {Object} trackProperties
 */
function mapObjectKeys(sourceObject, keyMappings) {
  const trackProperties = {};

  keyMappings.forEach(({ sourceKeys, destKeys }) => {
    const value = getNestedValue(sourceObject, sourceKeys);
    if (value !== undefined) {
      setNestedValue(trackProperties, destKeys, value);
    }
  });

  return trackProperties;
}

const createMessage = (eventType, eventName, properties, context) => {
  const message = new Message(INTEGERATION);
  message.setEventType(eventType);
  if (eventType === EventType.TRACK) message.setEventName(eventName);
  else message.name = eventName;
  message.properties = properties;
  message.context = context;
  return message;
};

const pageViewedEventBuilder = (inputEvent) => {
  const { data, context } = inputEvent;
  const pageEventContextValues = mapContextObjectKeys(context, contextualFieldMappingJSON);
  return createMessage(EventType.PAGE, 'Page View', { ...data }, pageEventContextValues);
};

const cartViewedEventBuilder = (inputEvent) => {
  const lines = inputEvent?.data?.cart?.lines;
  const products = [];
  let total;
  if (lines) {
    lines.forEach((line) => {
      const product = mapObjectKeys(line, cartViewedEventMappingJSON);
      products.push(product);
      total = line.cost.totalAmount.amount;
    });
  }

  const properties = {
    products,
    cart_id: inputEvent.data.cart.id,
    total,
  };
  const contextualPayload = mapContextObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  return createMessage(EventType.TRACK, 'Cart Viewed', properties, contextualPayload);
};

const productListViewedEventBuilder = (inputEvent) => {
  const productVariants = inputEvent?.data?.collection?.productVariants;
  const products = [];

  productVariants.forEach((productVariant) => {
    const mappedProduct = mapObjectKeys(productVariant, productListViewedEventMappingJSON);
    products.push(mappedProduct);
  });

  const properties = {
    cart_id: inputEvent.clientId,
    list_id: inputEvent.id,
    products,
  };

  const contextualPayload = mapContextObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  return createMessage(EventType.TRACK, 'Product List Viewed', properties, contextualPayload);
};

const productViewedEventBuilder = (inputEvent) => {
  const properties = {
    ...mapObjectKeys(inputEvent.data, productViewedEventMappingJSON),
  };
  const contextualPayload = mapContextObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  return createMessage(EventType.TRACK, 'Product Viewed', properties, contextualPayload);
};

const productToCartEventBuilder = (inputEvent) => {
  const properties = {
    ...mapObjectKeys(inputEvent.data, productToCartEventMappingJSON),
  };
  const contextualPayload = mapContextObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  return createMessage(
    EventType.TRACK,
    PIXEL_EVENT_MAPPING[inputEvent.name],
    properties,
    contextualPayload,
  );
};

const checkoutEventBuilder = (inputEvent) => {
  const lineItems = inputEvent?.data?.checkout?.lineItems;
  const products = [];

  lineItems.forEach((lineItem) => {
    const mappedProduct = mapObjectKeys(lineItem, checkoutStartedCompletedEventMappingJSON);
    products.push(mappedProduct);
  });

  const properties = {
    products,
    order_id: inputEvent.data?.checkout?.order?.id,
    checkout_id: inputEvent?.data?.checkout?.token,
    total: inputEvent?.data?.checkout?.totalPrice?.amount,
    currency: inputEvent?.data?.checkout?.currencyCode,
    discount: inputEvent?.data?.checkout?.discountsAmount?.amount,
    shipping: inputEvent?.data?.checkout?.shippingLine?.price?.amount,
    revenue: inputEvent?.data?.checkout?.subtotalPrice?.amount,
    value: inputEvent?.data?.checkout?.totalPrice?.amount,
    tax: inputEvent?.data?.checkout?.totalTax?.amount,
  };
  const contextualPayload = mapContextObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  return createMessage(
    EventType.TRACK,
    PIXEL_EVENT_MAPPING[inputEvent.name],
    properties,
    contextualPayload,
  );
};

const checkoutStepEventBuilder = (inputEvent) => {
  const contextualPayload = mapContextObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  const properties = {
    ...inputEvent.data.checkout,
  };
  return createMessage(
    EventType.TRACK,
    PIXEL_EVENT_MAPPING[inputEvent.name],
    properties,
    contextualPayload,
  );
};

const searchEventBuilder = (inputEvent) => {
  const properties = {
    query: inputEvent.data.searchResult.query,
  };
  const contextualPayload = mapContextObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  return createMessage(
    EventType.TRACK,
    PIXEL_EVENT_MAPPING[inputEvent.name],
    properties,
    contextualPayload,
  );
};

module.exports = {
  pageViewedEventBuilder,
  cartViewedEventBuilder,
  productListViewedEventBuilder,
  productViewedEventBuilder,
  productToCartEventBuilder,
  checkoutEventBuilder,
  checkoutStepEventBuilder,
  searchEventBuilder,
};
