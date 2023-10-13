const {
  CONFIG_CATEGORIES,
  OTHER_STANDARD_EVENTS,
  STANDARD_ECOMM_EVENTS_CATEGORIES,
  MAPPING_CONFIG,
} = require("./config");
const {
  constructPayload,
  isObject,
} = require('../../util');

const {
  getContentType,
  getContentCategory,
} = require('../facebook_pixel/utils');
const {InstrumentationError} = require("../../util/errorTypes");

const getCategoryFromEvent = (eventName) => {
  let category = STANDARD_ECOMM_EVENTS_CATEGORIES
    .find(configCategory => eventName === configCategory.type || eventName === configCategory.eventName );

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

const populateContentsAndContentIDs = (productPropertiesArray, fallbackQuantity) => {
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
          });
        }
      }
    });
  }

  return { contentIds, contents };
}

const populateCustomDataBasedOnCategory = (
  customData,
  message,
  category,
  categoryToContent,
) => {
  let eventTypeCustomData = {};
  if (category.name) {
    eventTypeCustomData = constructPayload(message, MAPPING_CONFIG[category.name]);
  }

  switch (category.type) {
    case 'product list viewed': {
      const { contentIds, contents } = populateContentsAndContentIDs(
        message.properties?.products,
        message.properties?.quantity
      );

      let contentType;
      if (contentIds.length > 0) {
        contentType = 'product';
      } else if (category) {
        contentIds.push(category);
        contents.push({
          id: category,
          quantity: 1,
        });
        contentType = 'product_group';
      }

      const contentCategory = eventTypeCustomData.content_category;

      eventTypeCustomData = {
        ...eventTypeCustomData,
        content_ids: contentIds,
        contents,
        content_type: getContentType(message, contentType, categoryToContent),
        content_category: getContentCategory(contentCategory)
      };
      break;
    }
    case 'product viewed':
    case 'product added':
    case 'products searched': {
      const contentCategory = eventTypeCustomData.content_category;
      const contentType = eventTypeCustomData.content_type;
      eventTypeCustomData = {
        ...eventTypeCustomData,
        ...populateContentsAndContentIDs([message.properties]),
        content_type: getContentType(message, contentType, categoryToContent),
        content_category: getContentCategory(contentCategory)
      };

      const query = eventTypeCustomData.search_string;
      const validQueryType = ['string', 'number', 'boolean'];
      if (query && !validQueryType.includes(typeof query)) {
        throw new InstrumentationError("'query' should be in string format only");
      }

      break;
    }
    case 'order completed':
    case 'checkout started': {
      const { contentIds, contents } = populateContentsAndContentIDs(
        message.properties?.products,
        message.properties?.quantity
      );

      const contentCategory = eventTypeCustomData.content_category;
      const contentType = eventTypeCustomData.content_type;

      eventTypeCustomData = {
        ...eventTypeCustomData,
        content_ids: contentIds,
        contents,
        content_type: getContentType(message, contentType, categoryToContent),
        content_category: getContentCategory(contentCategory),
        num_items: contentIds.length,
      };
      break;
    }
    case 'page_view': // executed when sending track calls but with standard type PageView
    case 'page': // executed when page call is done with standard PageView turned on
    case 'otherStandard':
    default:
      eventTypeCustomData = { ...eventTypeCustomData };
      break;
  }

  return { ...customData, ...eventTypeCustomData };
}

module.exports = {
  getCategoryFromEvent,
  populateCustomDataBasedOnCategory
}
