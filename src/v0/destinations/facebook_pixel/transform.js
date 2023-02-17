/* eslint-disable no-param-reassign */
const sha256 = require('sha256');
const get = require('get-value');
const moment = require('moment');
const stats = require('../../../util/stats');
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  ACTION_SOURCES_VALUES,
  FB_PIXEL_DEFAULT_EXCLUSION,
  STANDARD_ECOMM_EVENTS_TYPE,
} = require('./config');
const { EventType } = require('../../../constants');

const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  extractCustomFields,
  flattenJson,
  getIntegrationsObj,
  isObject,
  getValidDynamicFormConfig,
  simpleProcessRouterDest,
} = require('../../util');

const {
  deduceFbcParam,
  formatRevenue,
  getContentType,
  transformedPayloadData,
} = require('./utils');

const {
  InstrumentationError,
  ConfigurationError,
  TransformationError,
} = require('../../util/errorTypes');

/**
 * This method gets content category with proper error-handling
 *
 * @param {*} category
 * @returns The content category as a string
 */
const getContentCategory = (category) => {
  let contentCategory = category;
  if (Array.isArray(contentCategory)) {
    contentCategory = contentCategory.map(String).join(',');
  }
  if (
    contentCategory &&
    typeof contentCategory !== 'string' &&
    typeof contentCategory !== 'object'
  ) {
    contentCategory = String(contentCategory);
  }
  if (
    contentCategory &&
    typeof contentCategory !== 'string' &&
    !Array.isArray(contentCategory) &&
    typeof contentCategory === 'object'
  ) {
    throw new InstrumentationError("'properties.category' must be either be a string or an array");
  }
  return contentCategory;
};

/**
 *
 * @param {*} message Rudder element
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
 *
 * Handles order completed and checkout started types of specific events
 */
const handleOrder = (message, categoryToContent) => {
  const { products, revenue } = message.properties;
  const value = formatRevenue(revenue);

  const contentType = getContentType(message, 'product', categoryToContent);
  const contentIds = [];
  const contents = [];
  const { category, quantity, price, currency } = message.properties;
  if (products) {
    if (products.length > 0 && Array.isArray(products)) {
      products.forEach((singleProduct) => {
        const pId = singleProduct.product_id || singleProduct.sku || singleProduct.id;
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
  };
};

/**
 *
 * @param {*} message Rudder element
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
 *
 * Handles product list viewed
 */
const handleProductListViewed = (message, categoryToContent) => {
  let contentType;
  const contentIds = [];
  const contents = [];
  const { products, category, quantity } = message.properties;
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
  };
};

/**
 *
 * @param {*} message Rudder Payload
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
 * @param {*} valueFieldIdentifier it can be either value or price which will be matched from properties and assigned to value for fb payload
 */
const handleProduct = (message, categoryToContent, valueFieldIdentifier) => {
  const contentIds = [];
  const contents = [];
  const useValue = valueFieldIdentifier === 'properties.value';
  const contentId =
    message.properties.product_id || message.properties.id || message.properties.sku;
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

const responseBuilderSimple = (message, category, destination, categoryToContent) => {
  const { Config } = destination;
  const { pixelId, accessToken } = Config;
  const {
    blacklistPiiProperties,
    eventCustomProperties,
    valueFieldIdentifier,
    whitelistPiiProperties,
    limitedDataUSage,
    testDestination,
    testEventCode,
    standardPageCall,
  } = Config;
  const integrationsObj = getIntegrationsObj(message, 'fb_pixel');

  const endpoint = `https://graph.facebook.com/v13.0/${pixelId}/events?access_token=${accessToken}`;

  const userData = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.USERDATA.name],
    'fb_pixel',
  );
  if (userData) {
    const split = userData.name ? userData.name.split(' ') : null;
    if (split !== null && Array.isArray(split) && split.length === 2) {
      userData.fn = integrationsObj && integrationsObj.hashed ? split[0] : sha256(split[0]);
      userData.ln = integrationsObj && integrationsObj.hashed ? split[1] : sha256(split[1]);
    }
    delete userData.name;
    userData.fbc = userData.fbc || deduceFbcParam(message);
  }

  let customData = {};
  let commonData = {};

  commonData = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name], 'fb_pixel');

  if (commonData.action_source) {
    const isActionSourceValid = ACTION_SOURCES_VALUES.includes(commonData.action_source);
    if (!isActionSourceValid) {
      throw new InstrumentationError('Invalid Action Source type');
    }
  }
  if (category.type !== 'identify') {
    customData = flattenJson(
      extractCustomFields(message, customData, ['properties'], FB_PIXEL_DEFAULT_EXCLUSION),
    );
    if (standardPageCall && category.type === 'page') {
      category.standard = true;
    }
    if (Object.keys(customData).length === 0 && category.standard) {
      throw new InstrumentationError(
        `After excluding ${FB_PIXEL_DEFAULT_EXCLUSION}, no fields are present in 'properties' for a standard event`,
      );
    }
    customData = transformedPayloadData(
      message,
      customData,
      blacklistPiiProperties,
      whitelistPiiProperties,
      category.standard,
      eventCustomProperties,
      integrationsObj,
    );
    message.properties = message.properties || {};
    if (category.standard) {
      switch (category.type) {
        case 'product list viewed':
          customData = {
            ...customData,
            ...handleProductListViewed(message, categoryToContent),
          };
          commonData.event_name = 'ViewContent';
          break;
        case 'product viewed':
          customData = {
            ...customData,
            ...handleProduct(message, categoryToContent, valueFieldIdentifier),
          };
          commonData.event_name = 'ViewContent';
          break;
        case 'product added':
          customData = {
            ...customData,
            ...handleProduct(message, categoryToContent, valueFieldIdentifier),
          };
          commonData.event_name = 'AddToCart';
          break;
        case 'order completed':
          customData = {
            ...customData,
            ...handleOrder(message, categoryToContent),
          };
          commonData.event_name = 'Purchase';
          break;
        case 'products searched': {
          const query = message.properties?.query;
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
          customData = {
            ...customData,
            search_string: message.properties.query,
          };
          commonData.event_name = 'Search';
          break;
        }
        case 'checkout started':
          customData = {
            ...customData,
            ...handleOrder(message, categoryToContent),
          };
          commonData.event_name = 'InitiateCheckout';
          break;
        case 'page_view': // executed when sending track calls but with standard type PageView
        case 'page': // executed when page call is done with standard PageView turned on
          customData = { ...customData };
          commonData.event_name = 'PageView';
          break;
        case 'otherStandard':
          customData = { ...customData };
          commonData.event_name = category.event;
          break;
        default:
          throw new InstrumentationError(
            `${category.standard} type of standard event does not exist`,
          );
      }
      customData.currency = STANDARD_ECOMM_EVENTS_TYPE.includes(category.type)
        ? message.properties.currency || 'USD'
        : undefined;
    } else {
      const { type } = category;
      if (type === 'page' || type === 'screen') {
        commonData.event_name = message.name
          ? `Viewed ${type} ${message.name}`
          : `Viewed a ${type}`;
      }
      if (type === 'simple track') {
        customData.value = message.properties ? message.properties.revenue : undefined;
        delete customData.revenue;
      }
    }
  } else {
    customData = undefined;
  }
  if (limitedDataUSage) {
    const dataProcessingOptions = get(message, 'context.dataProcessingOptions');
    if (dataProcessingOptions && Array.isArray(dataProcessingOptions)) {
      [
        commonData.data_processing_options,
        commonData.data_processing_options_country,
        commonData.data_processing_options_state,
      ] = dataProcessingOptions;
    }
  }

  // content_category should only be a string ref: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/custom-data

  if (userData && commonData) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    const jsonStringify = JSON.stringify({
      user_data: userData,
      ...commonData,
      custom_data: customData,
    });
    const payload = {
      data: [jsonStringify],
    };

    // Ref: https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/
    // Section: Test Events Tool
    if (testDestination) {
      payload.test_event_code = testEventCode;
    }
    response.body.FORM = payload;
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Payload could not be constructed');
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError("'type' is missing");
  }

  const timeStamp = message.originalTimestamp || message.timestamp;
  if (timeStamp) {
    const start = moment.unix(moment(timeStamp).format('X'));
    const current = moment.unix(moment().format('X'));
    // calculates past event in days
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asDays());
    // calculates future event in minutes
    const deltaMin = Math.ceil(moment.duration(start.diff(current)).asMinutes());
    if (deltaDay > 7 || deltaMin > 1) {
      // TODO: Remove after testing in mirror transformer
      stats.increment('fb_pixel_timestamp_error', 1, {
        destinationId: destination.ID,
      });
      throw new InstrumentationError(
        'Events must be sent within seven days of their occurrence or up to one minute in the future.',
      );
    }
  }

  let eventsToEvents;
  if (destination.Config.eventsToEvents)
    eventsToEvents = getValidDynamicFormConfig(
      destination.Config.eventsToEvents,
      'from',
      'to',
      'FB_PIXEL',
      destination.ID,
    );
  let categoryToContent;
  if (destination.Config.categoryToContent)
    categoryToContent = getValidDynamicFormConfig(
      destination.Config.categoryToContent,
      'from',
      'to',
      'FB_PIXEL',
      destination.ID,
    );
  const { advancedMapping } = destination.Config;
  let standard;
  let standardTo = '';
  let checkEvent;
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      if (advancedMapping) {
        category = CONFIG_CATEGORIES.USERDATA;
        break;
      } else {
        throw new ConfigurationError(
          'For identify events, "Advanced Mapping" configuration must be enabled on the RudderStack dashboard',
        );
      }
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.PAGE;
      break;
    case EventType.TRACK:
      if (!message.event) {
        throw new InstrumentationError("'event' is required");
      }
      if (typeof message.event !== 'string') {
        throw new InstrumentationError('event name should be string');
      }
      standard = eventsToEvents;
      if (standard) {
        standardTo = standard.reduce((filtered, standards) => {
          if (standards.from.toLowerCase() === message.event.toLowerCase()) {
            filtered = standards.to;
          }
          return filtered;
        }, '');
      }
      checkEvent = standardTo !== '' ? standardTo : message.event.toLowerCase();

      switch (checkEvent) {
        case CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.type:
        case 'ViewContent':
          category = CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED;
          break;
        case CONFIG_CATEGORIES.PRODUCT_VIEWED.type:
          category = CONFIG_CATEGORIES.PRODUCT_VIEWED;
          break;
        case CONFIG_CATEGORIES.PRODUCT_ADDED.type:
        case 'AddToCart':
          category = CONFIG_CATEGORIES.PRODUCT_ADDED;
          break;
        case CONFIG_CATEGORIES.ORDER_COMPLETED.type:
        case 'Purchase':
          category = CONFIG_CATEGORIES.ORDER_COMPLETED;
          break;
        case CONFIG_CATEGORIES.PRODUCTS_SEARCHED.type:
        case 'Search':
          category = CONFIG_CATEGORIES.PRODUCTS_SEARCHED;
          break;
        case CONFIG_CATEGORIES.CHECKOUT_STARTED.type:
        case 'InitiateCheckout':
          category = CONFIG_CATEGORIES.CHECKOUT_STARTED;
          break;
        case 'AddToWishlist':
        case 'AddPaymentInfo':
        case 'Lead':
        case 'CompleteRegistration':
        case 'Contact':
        case 'CustomizeProduct':
        case 'Donate':
        case 'FindLocation':
        case 'Schedule':
        case 'StartTrial':
        case 'SubmitApplication':
        case 'Subscribe':
          category = CONFIG_CATEGORIES.OTHER_STANDARD;
          category.event = checkEvent;
          break;
        case 'PageView':
          category = CONFIG_CATEGORIES.PAGE_VIEW;
          break;
        default:
          category = CONFIG_CATEGORIES.SIMPLE_TRACK;
          break;
      }
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  // build the response
  return responseBuilderSimple(message, category, destination, categoryToContent);
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
