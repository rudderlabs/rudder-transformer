const lodash = require('lodash');

/**
 * Returns final params
 * @param {*} params
 * @param {*} advertiserId
 * @returns params
 */
const getParams = (parameters, advertiserId) => {
  const params = parameters || {};
  params.tt = 'ss';
  params.tv = '2';
  params.merchant = advertiserId;
  params.ch = 'aw';
  if (params.amount) {
    if (!params.commissionGroup) {
      params.commissionGroup = 'DEFAULT';
    }
    params.parts = String(params.commissionGroup).concat(':', String(params.amount));
    delete params.commissionGroup;
  }
  if (!params.testmode) {
    params.testmode = '0';
  }

  return params;
};

const areAllValuesDefined = (obj) =>
  lodash.every(lodash.values(obj), (value) => !lodash.isUndefined(value));

const buildProductPayloadString = (payload) => {
  // Encode each property in the payload
  const encodedPayload = Object.entries(payload).reduce((acc, [key, value]) => {
    acc[key] = encodeURIComponent(value);
    return acc;
  }, {});

  const {
    advertiserId,
    orderReference,
    productId,
    productName,
    productItemPrice,
    productQuantity,
    productSku,
    commissionGroupCode,
    productCategory,
    ...customProperties
  } = encodedPayload;

  // Build the base string without custom properties
  let baseString = `AW:P|${advertiserId}|${orderReference}|${productId}|${productName}|${productItemPrice}|${productQuantity}|${productSku}|${commissionGroupCode}|${productCategory}`;

  // Extract and sort the custom properties keys
  const sortedKeys = lodash.sortBy(Object.keys(customProperties), (key) =>
    parseInt(key.substring(1), 10),
  );

  // Build custom properties string based on sorted keys
  const customPropsString = sortedKeys
    .map((key) => `&${key.toLowerCase()}=${customProperties[key]}`)
    .join('');
  baseString += customPropsString;

  return baseString;
};

function filterProperties(props) {
  const keysToInclude = /^p\d+$/i; // Regex to match keys like 'p1', 'p2', ..., 'pn'
  return Object.fromEntries(Object.entries(props).filter(([key]) => keysToInclude.test(key)));
}

// ref: https://wiki.awin.com/index.php/Advertiser_Tracking_Guide/Product_Level_Tracking#PLT_Via_Conversion_Pixel
const trackProduct = (properties, advertiserId, commissionParts) => {
  const transformedProductInfoObj = {};
  if (
    properties?.products &&
    Array.isArray(properties?.products) &&
    properties.products.length > 0
  ) {
    const productsArray = properties.products;
    let productIndex = 0;
    productsArray.forEach((product) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { product_id, productId, name, price, quantity, sku, category, ...customProperties } =
        product;
      const filteredCustomProperties = filterProperties(customProperties);
      const productPayloadNew = {
        advertiserId,
        orderReference:
          properties.order_id ||
          properties.orderId ||
          properties.orderReference ||
          properties.order_reference,
        productId: product_id || productId,
        productName: name,
        productItemPrice: price,
        productQuantity: quantity,
        productSku: sku || '',
        commissionGroupCode: commissionParts || 'DEFAULT',
        productCategory: category || '',
        ...filteredCustomProperties,
      };
      if (areAllValuesDefined(productPayloadNew)) {
        transformedProductInfoObj[`bd[${productIndex}]`] =
          buildProductPayloadString(productPayloadNew);
        productIndex += 1;
      }
    });
  }
  return transformedProductInfoObj;
};

module.exports = {
  getParams,
  trackProduct,
  buildProductPayloadString,
};
