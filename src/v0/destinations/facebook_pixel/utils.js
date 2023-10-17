const { isObject } = require('../../util');
const { ACTION_SOURCES_VALUES, CONFIG_CATEGORIES, OTHER_STANDARD_EVENTS } = require('./config');
const { getContentType, getContentCategory } = require('../../util/facebookUtils');
const { InstrumentationError } = require('../../util/errorTypes');

/**  format revenue according to fb standards with max two decimal places.
 * @param revenue
 * @return number
 */

const formatRevenue = (revenue) => {
  const formattedRevenue = parseFloat(parseFloat(revenue || '0').toFixed(2));
  if (!Number.isNaN(formattedRevenue)) {
    return formattedRevenue;
  }
  throw new InstrumentationError('Revenue could not be converted to number');
};

/**
 * Returns action source
 * ref : https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event#action-source
 * @param {*} payload
 * @param {*} channel
 * @returns
 */
const getActionSource = (payload, channel) => {
  let actionSource = 'other';
  if (payload.action_source) {
    const isActionSourceValid = ACTION_SOURCES_VALUES.includes(payload.action_source);
    if (!isActionSourceValid) {
      throw new InstrumentationError('Invalid Action Source type');
    }
    actionSource = payload.action_source;
  } else if (channel === 'web') {
    actionSource = 'website';
  } else if (channel === 'mobile') {
    actionSource = 'app';
  }

  return actionSource;
};

/**
 *
 * @param {*} message Rudder element
 * @param {*} categoryToContent example: [ { from: 'clothing', to: 'product' } ]
 *
 * Handles order completed and checkout started types of specific events
 */
const handleOrder = (message, categoryToContent) => {
  const { products, revenue } = message.properties;
  const value = formatRevenue(revenue);

  const contentType = getContentType(message, 'product', categoryToContent);
  const contentIds = [];
  const contents = [];
  const { category, quantity, price, currency, contentName } = message.properties;
  if (products) {
    if (products.length > 0 && Array.isArray(products)) {
      products.forEach((singleProduct) => {
        const pId = singleProduct?.product_id || singleProduct?.sku || singleProduct?.id;
        if (pId) {
          contentIds.push(pId);
          // required field for content
          // ref: https://developers.facebook.com/docs/meta-pixel/reference#object-properties
          const content = {
            id: pId,
            quantity: singleProduct.quantity || quantity || 1,
            item_price: singleProduct.price || price,
          };
          contents.push(content);
        }
      });
    } else {
      throw new InstrumentationError("'properties.products' is not sent as an Array<Object>");
    }
  }

  return {
    content_category: getContentCategory(category),
    content_ids: contentIds,
    content_type: contentType,
    currency: currency || 'USD',
    value,
    contents,
    num_items: contentIds.length,
    content_name: contentName,
  };
};

/**
 *
 * @param {*} message Rudder element
 * @param {*} categoryToContent example [ { from: 'clothing', to: 'product' } ]
 *
 * Handles product list viewed
 */
const handleProductListViewed = (message, categoryToContent) => {
  let contentType;
  const contentIds = [];
  const contents = [];
  const { products, category, quantity, value, contentName } = message.properties;
  if (products && products.length > 0 && Array.isArray(products)) {
    products.forEach((product, index) => {
      if (isObject(product)) {
        const productId = product.product_id || product.sku || product.id;
        if (productId) {
          contentIds.push(productId);
          contents.push({
            id: productId,
            quantity: product.quantity || quantity || 1,
            item_price: product.price,
          });
        }
      } else {
        throw new InstrumentationError(`'properties.products[${index}]' is not an object`);
      }
    });
  }

  if (contentIds.length > 0) {
    contentType = 'product';
    //  for viewContent event content_ids and content arrays are not mandatory
  } else if (category) {
    contentIds.push(category);
    contents.push({
      id: category,
      quantity: 1,
    });
    contentType = 'product_group';
  }

  return {
    content_ids: contentIds,
    content_type: getContentType(message, contentType, categoryToContent),
    contents,
    content_category: getContentCategory(category),
    content_name: contentName,
    value: formatRevenue(value),
  };
};

/**
 *
 * @param {*} message Rudder Payload
 * @param {*} categoryToContent Example: [ { from: 'clothing', to: 'product' } ]
 * @param {*} valueFieldIdentifier it can be either value or price which will be matched from properties and assigned to value for fb payload
 */
const handleProduct = (message, categoryToContent, valueFieldIdentifier) => {
  const contentIds = [];
  const contents = [];
  const useValue = valueFieldIdentifier === 'properties.value';
  const contentId =
    message.properties?.product_id || message.properties?.sku || message.properties?.id;
  const contentType = getContentType(message, 'product', categoryToContent);
  const contentName = message.properties.product_name || message.properties.name || '';
  const contentCategory = message.properties.category || '';
  const currency = message.properties.currency || 'USD';
  const value = useValue
    ? formatRevenue(message.properties.value)
    : formatRevenue(message.properties.price);
  if (contentId) {
    contentIds.push(contentId);
    contents.push({
      id: contentId,
      quantity: message.properties.quantity || 1,
      item_price: message.properties.price,
    });
  }
  return {
    content_ids: contentIds,
    content_type: contentType,
    content_name: contentName,
    content_category: getContentCategory(contentCategory),
    currency,
    value,
    contents,
  };
};

const handleSearch = (message) => {
  const query = message?.properties?.query;
  /**
   * Facebook Pixel states "search_string" a string type
   * ref: https://developers.facebook.com/docs/meta-pixel/reference#:~:text=an%20exact%20value.-,search_string,-String
   * But it accepts "number" and "boolean" types. So, we are also doing the same by accepting "number" and "boolean"
   * and throwing an error if "Object" or other types are being sent.
   */
  const validQueryType = ['string', 'number', 'boolean'];
  if (query && !validQueryType.includes(typeof query)) {
    throw new InstrumentationError("'query' should be in string format only");
  }

  const contentIds = [];
  const contents = [];
  const contentId =
    message.properties?.product_id || message.properties?.sku || message.properties?.id;
  const contentCategory = message?.properties?.category || '';
  const value = message?.properties?.value;
  if (contentId) {
    contentIds.push(contentId);
    contents.push({
      id: contentId,
      quantity: message?.properties?.quantity || 1,
      item_price: message?.properties?.price,
    });
  }
  return {
    content_ids: contentIds,
    content_category: getContentCategory(contentCategory),
    value: formatRevenue(value),
    contents,
    search_string: query,
  };
};

const populateCustomDataBasedOnCategory = (
  customData,
  message,
  category,
  categoryToContent,
  valueFieldIdentifier,
) => {
  let updatedCustomData;
  switch (category.type) {
    case 'product list viewed':
      updatedCustomData = {
        ...customData,
        ...handleProductListViewed(message, categoryToContent),
      };
      break;
    case 'product viewed':
    case 'product added':
      updatedCustomData = {
        ...customData,
        ...handleProduct(message, categoryToContent, valueFieldIdentifier),
      };
      break;
    case 'order completed':
      updatedCustomData = {
        ...customData,
        ...handleOrder(message, categoryToContent),
      };
      break;
    case 'products searched': {
      updatedCustomData = {
        ...customData,
        ...handleSearch(message),
      };
      break;
    }
    case 'checkout started': {
      const orderPayload = handleOrder(message, categoryToContent);
      delete orderPayload.content_name;
      updatedCustomData = {
        ...customData,
        ...orderPayload,
      };
      break;
    }
    case 'page_view': // executed when sending track calls but with standard type PageView
    case 'page': // executed when page call is done with standard PageView turned on
    case 'otherStandard':
      updatedCustomData = { ...customData };
      break;
    default:
      throw new InstrumentationError(`${category.standard} type of standard event does not exist`);
  }
  return updatedCustomData;
};

const getCategoryFromEvent = (eventName) => {
  let category;
  switch (eventName) {
    case CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.type:
    case CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.eventName:
      category = CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED;
      break;
    case CONFIG_CATEGORIES.PRODUCT_VIEWED.type:
      category = CONFIG_CATEGORIES.PRODUCT_VIEWED;
      break;
    case CONFIG_CATEGORIES.PRODUCT_ADDED.type:
    case CONFIG_CATEGORIES.PRODUCT_ADDED.eventName:
      category = CONFIG_CATEGORIES.PRODUCT_ADDED;
      break;
    case CONFIG_CATEGORIES.ORDER_COMPLETED.type:
    case CONFIG_CATEGORIES.ORDER_COMPLETED.eventName:
      category = CONFIG_CATEGORIES.ORDER_COMPLETED;
      break;
    case CONFIG_CATEGORIES.PRODUCTS_SEARCHED.type:
    case CONFIG_CATEGORIES.PRODUCTS_SEARCHED.eventName:
      category = CONFIG_CATEGORIES.PRODUCTS_SEARCHED;
      break;
    case CONFIG_CATEGORIES.CHECKOUT_STARTED.type:
    case CONFIG_CATEGORIES.CHECKOUT_STARTED.eventName:
      category = CONFIG_CATEGORIES.CHECKOUT_STARTED;
      break;
    case CONFIG_CATEGORIES.PAGE_VIEW.eventName:
      category = CONFIG_CATEGORIES.PAGE_VIEW;
      break;
    default:
      category = CONFIG_CATEGORIES.SIMPLE_TRACK;
      break;
  }

  if (OTHER_STANDARD_EVENTS.includes(eventName)) {
    category = CONFIG_CATEGORIES.OTHER_STANDARD;
    category.eventName = eventName;
  }

  return category;
};

module.exports = {
  formatRevenue,
  getActionSource,
  handleProduct,
  handleSearch,
  handleProductListViewed,
  handleOrder,
  populateCustomDataBasedOnCategory,
  getCategoryFromEvent,
};
