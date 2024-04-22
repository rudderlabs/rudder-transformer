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

  // Check if there are any custom properties
  if (Object.keys(customProperties).length > 0) {
    // Map custom properties to strings with indexed keys, starting from 1
    const customPropsString = Object.values(customProperties)
      .map((value, index) => `&p${index + 1}=${value}`)
      .join('');
    // Append the custom properties to the base string
    baseString += customPropsString;
  }

  // Return the final payload string
  return baseString;
};

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
        ...customProperties,
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
