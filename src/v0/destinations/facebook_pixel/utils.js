const sha256 = require('sha256');
const {
  isObject,
  getFieldValueFromMessage,
  formatTimeStamp,
  getIntegrationsObj,
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
} = require('../../util');
const { ACTION_SOURCES_VALUES, CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');

const { InstrumentationError, TransformationError } = require('../../util/errorTypes');

/**  format revenue according to fb standards with max two decimal places.
 * @param revenue
 * @return number
 */

const formatRevenue = (revenue) => {
  const formattedRevenue = parseFloat(parseFloat(revenue || 0).toFixed(2));
  if (!Number.isNaN(formattedRevenue)) {
    return formattedRevenue;
  }
  throw new InstrumentationError('Revenue could not be converted to number');
};

/**
 *
 * @param {*} message Rudder Payload
 * @param {*} defaultValue product / product_group
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
 *
 * We will be mapping properties.category to user provided content else taking the default value as per ecomm spec
 * If category is clothing it will be set to ["product"]
 * @return Content Type array as defined in:
 * - https://developers.facebook.com/docs/facebook-pixel/reference/#object-properties
 */
const getContentType = (message, defaultValue, categoryToContent) => {
  let tempCategoryToContent = categoryToContent;
  const { properties } = message;
  const integrationsObj = getIntegrationsObj(message, 'fb_pixel');

  if (integrationsObj?.contentType) {
    return integrationsObj.contentType;
  }

  let { category } = properties;
  if (!category) {
    const { products } = properties;
    if (products && products.length > 0 && Array.isArray(products) && isObject(products[0])) {
      category = products[0].category;
    }
  } else {
    if (tempCategoryToContent === undefined) {
      tempCategoryToContent = [];
    }
    const mapped = tempCategoryToContent;
    const mappedTo = mapped.reduce((filtered, map) => {
      let filter = filtered;
      if (map.from === category) {
        filter = map.to;
      }
      return filter;
    }, '');
    if (mappedTo.length > 0) {
      return mappedTo;
    }
  }
  return defaultValue;
};

/** This function transforms the payloads according to the config settings and adds, removes or hashes pii data.
Also checks if it is a standard event and sends properties only if it is mentioned in our configs.
@param message --> the rudder payload

{
    anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
    destination_props: { Fb: { app_id: 'RudderFbApp' } },
    context: {
      device: {
        id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
        manufacturer: 'Xiaomi',
        model: 'Redmi 6',
        name: 'xiaomi'
      },
      network: { carrier: 'Banglalink' },
      os: { name: 'android', version: '8.1.0' },
      screen: { height: '100', density: 50 },
      traits: {
        email: 'abc@gmail.com',
        anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1'
      }
    },
    event: 'spin_result',
    integrations: {
      All: true,
      FacebookPixel: {
        dataProcessingOptions: [Array],
        fbc: 'fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890',
        fbp: 'fb.1.1554763741205.234567890',
        fb_login_id: 'fb_id',
        lead_id: 'lead_id'
      }
    },
    message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
    properties: { revenue: 400, additional_bet_index: 0 },
    timestamp: '2019-09-01T15:46:51.693229+05:30',
    type: 'track'
  }

@param customData --> properties
{ revenue: 400, additional_bet_index: 0 }

@param blacklistPiiProperties -->
[ { blacklistPiiProperties: 'phone', blacklistPiiHash: true } ] // hashes the phone property

@param whitelistPiiProperties -->
[ { whitelistPiiProperties: 'email' } ] // sets email

@param isStandard --> is standard if among the ecommerce spec of rudder other wise is not standard for simple track, identify and page calls
false

@param eventCustomProperties -->
[ { eventCustomProperties: 'leadId' } ] // leadId if present will be set

*/

const transformedPayloadData = (
  message,
  customData,
  blacklistPiiProperties,
  whitelistPiiProperties,
  isStandard,
  integrationsObj,
) => {
  const defaultPiiProperties = [
    'email',
    'firstName',
    'lastName',
    'firstname',
    'lastname',
    'first_name',
    'last_name',
    'gender',
    'city',
    'country',
    'phone',
    'state',
    'zip',
    'postalCode',
    'birthday',
  ];
  const clonedCustomData = { ...customData };
  const finalBlacklistPiiProperties = blacklistPiiProperties || [];
  const finalWhitelistPiiProperties = whitelistPiiProperties || [];
  const customBlackListedPiiProperties = {};
  const customWhiteListedProperties = {};
  finalBlacklistPiiProperties.forEach((property) => {
    const singularConfigInstance = property;
    customBlackListedPiiProperties[singularConfigInstance.blacklistPiiProperties] =
      singularConfigInstance.blacklistPiiHash;
  });

  finalWhitelistPiiProperties.forEach((property) => {
    const singularConfigInstance = property;
    customWhiteListedProperties[singularConfigInstance.whitelistPiiProperties] = true;
  });

  Object.keys(clonedCustomData).forEach((eventProp) => {
    const isDefaultPiiProperty = defaultPiiProperties.includes(eventProp);
    const isProperyWhiteListed = customWhiteListedProperties[eventProp] || false;
    if (isDefaultPiiProperty && !isProperyWhiteListed) {
      delete clonedCustomData[eventProp];
    }

    if (Object.prototype.hasOwnProperty.call(customBlackListedPiiProperties, eventProp)) {
      if (customBlackListedPiiProperties[eventProp]) {
        clonedCustomData[eventProp] = integrationsObj?.hashed
          ? String(message.properties[eventProp])
          : sha256(String(message.properties[eventProp]));
      } else {
        delete clonedCustomData[eventProp];
      }
    }
  });

  return clonedCustomData;
};

/**
 *
 * @param {*} message
 * @returns fbc parameter which is a combined string of the parameters below
 *
 * version : "fb" (default)
 *
 * subdomainIndex : 1 ( recommended by facebook, as well as our JS SDK sets cookies on the main domain, i.e "facebook.com")
 *
 * creationTime : mapped to originalTimestamp converted in miliseconds
 *
 * fbclid : deduced query paramter from context.page.url
 *
 * ref: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc#fbc
 */
const deduceFbcParam = (message) => {
  const url = message.context?.page?.url;
  if (!url) {
    return undefined;
  }
  let parseUrl;
  try {
    parseUrl = new URL(url);
  } catch {
    return undefined;
  }
  const paramsList = new URLSearchParams(parseUrl.search);
  const fbclid = paramsList.get('fbclid');

  if (!fbclid) {
    return undefined;
  }
  const creationTime = getFieldValueFromMessage(message, 'timestamp');
  return `fb.1.${formatTimeStamp(creationTime)}.${fbclid}`;
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

const fetchUserData = (message, Config) => {
  const integrationsObj = getIntegrationsObj(message, 'fb_pixel');
  const userData = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.USERDATA.name],
    'fb_pixel',
  );
  const { removeExternalId } = Config;
  if (removeExternalId) {
    delete userData.external_id;
  }

  if (userData) {
    const split = userData.name?.split(' ');
    if (split && split.length === 2) {
      const hashValue = (value) => (integrationsObj?.hashed ? value : sha256(value));
      userData.fn = hashValue(split[0]);
      userData.ln = hashValue(split[1]);
    }
    delete userData.name;
    userData.fbc = userData.fbc || deduceFbcParam(message);
  }

  return userData;
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
  const { category, quantity, price, currency, contentName } = message.properties;
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
    content_name: contentName,
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
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
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

const formingFinalResponse = (
  userData,
  commonData,
  customData,
  endpoint,
  testDestination,
  testEventCode,
) => {
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

module.exports = {
  deduceFbcParam,
  formatRevenue,
  getContentType,
  transformedPayloadData,
  getActionSource,
  fetchUserData,
  handleProduct,
  handleSearch,
  handleProductListViewed,
  handleOrder,
  formingFinalResponse,
};
