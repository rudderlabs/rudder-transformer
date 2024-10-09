const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  CONFIG_CATEGORIES,
  OTHER_STANDARD_EVENTS,
  STANDARD_ECOMM_EVENTS_CATEGORIES,
  MAPPING_CONFIG,
  ACTION_SOURCES_VALUES,
  DESTINATION,
} = require('./config');
const { constructPayload, isObject, isAppleFamily } = require('../../util');
const { getContentType, getContentCategory } = require('../../util/facebookUtils');

const getActionSource = (payload, fallbackActionSource) => {
  let actionSource = fallbackActionSource;
  if (payload.action_source) {
    const isActionSourceValid = ACTION_SOURCES_VALUES.includes(payload.action_source);
    if (!isActionSourceValid) {
      throw new InstrumentationError('Invalid Action Source type');
    }
    actionSource = payload.action_source;
  }

  return actionSource;
};

const getCategoryFromEvent = (eventName) => {
  let category = STANDARD_ECOMM_EVENTS_CATEGORIES.find(
    (configCategory) => eventName === configCategory.type || eventName === configCategory.eventName,
  );

  if (!category && OTHER_STANDARD_EVENTS.includes(eventName)) {
    category = CONFIG_CATEGORIES.OTHER_STANDARD;
    category.eventName = eventName;
  }

  if (!category && eventName === CONFIG_CATEGORIES.PAGE_VIEW.eventName) {
    category = CONFIG_CATEGORIES.PAGE_VIEW;
  }

  if (!category) {
    category = CONFIG_CATEGORIES.SIMPLE_TRACK;
  }

  return category;
};

const populateContentsAndContentIDs = (
  productPropertiesArray,
  fallbackQuantity,
  fallbackDeliveryCategory,
) => {
  const contentIds = [];
  const contents = [];
  if (Array.isArray(productPropertiesArray)) {
    productPropertiesArray.forEach((productProps) => {
      if (isObject(productProps)) {
        const productId = productProps.product_id || productProps.sku || productProps.id;
        if (productId) {
          contentIds.push(productId);
          contents.push({
            id: productId,
            quantity: productProps.quantity || fallbackQuantity || 1,
            item_price: productProps.price,
            delivery_category: productProps.delivery_category || fallbackDeliveryCategory,
          });
        }
      }
    });
  }

  return { contentIds, contents };
};

const validateProductSearchedData = (eventTypeCustomData) => {
  const query = eventTypeCustomData.search_string;
  const validQueryType = ['string', 'number', 'boolean'];
  if (query && !validQueryType.includes(typeof query)) {
    throw new InstrumentationError("'query' should be in string format only");
  }
};

const getProducts = (message, category) => {
  let products = message.properties?.products;
  if (['product added', 'product viewed', 'products searched'].includes(category.type)) {
    return [message.properties];
  }
  if (
    ['payment info entered', 'product added to wishlist'].includes(category.type) &&
    !Array.isArray(products)
  ) {
    products = [message.properties];
  }
  return products;
};

const populateCustomDataBasedOnCategory = (customData, message, category, categoryToContent) => {
  let eventTypeCustomData = {};
  if (category.name) {
    eventTypeCustomData = constructPayload(message, MAPPING_CONFIG[category.name]);
  }
  const products = getProducts(message, category);

  switch (category.type) {
    case 'product list viewed': {
      const { contentIds, contents } = populateContentsAndContentIDs(
        products,
        message.properties?.quantity,
      );

      const contentCategory = eventTypeCustomData.content_category;
      let defaultContentType;
      if (contentIds.length > 0) {
        defaultContentType = 'product';
      } else if (contentCategory) {
        contentIds.push(contentCategory);
        contents.push({
          id: contentCategory,
          quantity: 1,
        });
        defaultContentType = 'product_group';
      }
      const contentType =
        message.properties?.content_type ||
        getContentType(message, defaultContentType, categoryToContent, DESTINATION.toLowerCase());

      eventTypeCustomData = {
        ...eventTypeCustomData,
        content_ids: contentIds,
        contents,
        content_type: contentType,
        content_category: getContentCategory(contentCategory),
      };
      break;
    }
    case 'product added':
    case 'product viewed':
    case 'products searched': {
      const contentCategory = eventTypeCustomData.content_category;
      const contentType =
        message.properties?.content_type ||
        getContentType(
          message,
          eventTypeCustomData.content_type,
          categoryToContent,
          DESTINATION.toLowerCase(),
        );
      const { contentIds, contents } = populateContentsAndContentIDs(products);
      eventTypeCustomData = {
        ...eventTypeCustomData,
        content_ids: contentIds.length === 1 ? contentIds[0] : contentIds,
        contents,
        content_type: contentType,
        content_category: getContentCategory(contentCategory),
      };
      validateProductSearchedData(eventTypeCustomData);
      break;
    }
    case 'payment info entered':
    case 'product added to wishlist':
    case 'order completed':
    case 'checkout started': {
      const { contentIds, contents } = populateContentsAndContentIDs(
        products,
        message.properties?.quantity,
        message.properties?.delivery_category,
      );

      const contentCategory = eventTypeCustomData.content_category;
      const contentType =
        message.properties?.content_type ||
        getContentType(
          message,
          eventTypeCustomData.content_type,
          categoryToContent,
          DESTINATION.toLowerCase(),
        );

      eventTypeCustomData = {
        ...eventTypeCustomData,
        content_ids: contentIds,
        contents,
        content_type: contentType,
        content_category: getContentCategory(contentCategory),
        num_items: contentIds.length,
      };
      break;
    }
    case 'page_view':
    case 'otherStandard':
    case 'simple track':
    default:
      eventTypeCustomData = { ...eventTypeCustomData };
      break;
  }

  return { ...customData, ...eventTypeCustomData };
};

const fetchAppData = (message) => {
  const appData = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.APPDATA.name],
    DESTINATION.toLowerCase(),
  );

  if (appData) {
    let sourceSDK = appData.extinfo[0];
    if (sourceSDK === 'android') {
      sourceSDK = 'a2';
    } else if (isAppleFamily(sourceSDK)) {
      sourceSDK = 'i2';
    } else {
      // if the sourceSDK is not android or ios
      throw new InstrumentationError(
        'Extended device information i.e, "context.device.type" is not a valid value. It should be either android or ios/watchos/ipados/tvos',
      );
    }
    appData.extinfo[0] = sourceSDK;
  }

  appData.extinfo = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''].map(
    (val, ind) => (appData.extinfo[ind] ? appData.extinfo[ind] : val),
  );

  return appData;
};

module.exports = {
  fetchAppData,
  getActionSource,
  getCategoryFromEvent,
  populateCustomDataBasedOnCategory,
};
