/* eslint-disable no-param-reassign */
const { isDefinedAndNotNull, removeNullValues } = require('@rudderstack/integrations-lib');
const Message = require('../../message');
const { EventType } = require('../../../constants');
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

  return removeNullValues(trackProperties);
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
  const { context } = inputEvent;
  const pageEventContextValues = mapObjectKeys(context, contextualFieldMappingJSON);
  const properties = pageEventContextValues.page;
  return createMessage(EventType.PAGE, 'Page View', properties, pageEventContextValues);
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
    cart_id: inputEvent.data?.cart?.id,
    total,
  };
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMappingJSON);
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

  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  return createMessage(EventType.TRACK, 'Product List Viewed', properties, contextualPayload);
};

const productViewedEventBuilder = (inputEvent) => {
  const properties = {
    ...mapObjectKeys(inputEvent.data, productViewedEventMappingJSON),
  };
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  return createMessage(EventType.TRACK, 'Product Viewed', properties, contextualPayload);
};

const productToCartEventBuilder = (inputEvent) => {
  const properties = {
    ...mapObjectKeys(inputEvent.data, productToCartEventMappingJSON),
  };
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMappingJSON);
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
  const sanitizedProperties = removeNullValues(properties);
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  return createMessage(
    EventType.TRACK,
    PIXEL_EVENT_MAPPING[inputEvent.name],
    sanitizedProperties,
    contextualPayload,
  );
};

const checkoutStepEventBuilder = (inputEvent) => {
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  const properties = {
    checkout_id: inputEvent?.data?.checkout?.token,
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
    query: inputEvent?.data?.searchResult?.query,
  };
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMappingJSON);
  return createMessage(
    EventType.TRACK,
    PIXEL_EVENT_MAPPING[inputEvent.name],
    properties,
    contextualPayload,
  );
};

/**
 * Extracts UTM parameters from the context object
 * @param {*} context context object from the event
 * @param {*} campaignMappings mappings for UTM parameters
 * @returns campaignParams, an object containing UTM parameters
 */
const extractCampaignParams = (context, campaignMappings) => {
  if (context?.document?.location?.href) {
    const url = new URL(context.document.location.href);
    const campaignParams = {};

    // Loop through mappings and extract UTM parameters
    campaignMappings.forEach((mapping) => {
      const value = url.searchParams.get(mapping.sourceKeys);
      if (isDefinedAndNotNull(value)) {
        campaignParams[mapping.destKeys] = value;
      }
    });

    // Extract any UTM parameters not in the mappings
    const campaignObjectSourceKeys = campaignMappings.flatMap((mapping) => mapping.sourceKeys);
    url.searchParams.forEach((value, key) => {
      if (key.startsWith('utm_') && !campaignObjectSourceKeys.includes(key)) {
        // Strip 'utm_' prefix and use the rest of the parameter name
        const strippedKey = key.substring(4);
        campaignParams[strippedKey] = value;
      }
    });

    // Only return campaign object if we have any UTM parameters
    if (Object.keys(campaignParams).length > 0) {
      return campaignParams;
    }
  }
  return null;
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
  extractCampaignParams,
};
