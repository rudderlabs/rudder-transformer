const { getHashFromArray } = require('@rudderstack/integrations-lib');
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
  // URL-encode each value, and join back with the same key.
  const encodedPayload = Object.entries(payload).reduce((acc, [key, value]) => {
    // Encode each value. Assuming that all values are either strings or can be
    // safely converted to strings.
    acc[key] = encodeURIComponent(value);
    return acc;
  }, {});

  return `AW:P|${encodedPayload.advertiserId}|${encodedPayload.orderReference}|${encodedPayload.productId}|${encodedPayload.productName}|${encodedPayload.productItemPrice}|${encodedPayload.productQuantity}|${encodedPayload.productSku}|${encodedPayload.commissionGroupCode}|${encodedPayload.productCategory}`;
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
      const productPayloadNew = {
        advertiserId,
        orderReference:
          properties.order_id ||
          properties.orderId ||
          properties.orderReference ||
          properties.order_reference,
        productId: product.product_id || product.productId,
        productName: product.name,
        productItemPrice: product.price,
        productQuantity: product.quantity,
        productSku: product.sku || '',
        commissionGroupCode: commissionParts || 'DEFAULT',
        productCategory: product.category || '',
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

// ref: https://wiki.awin.com/index.php/Advertiser_Tracking_Guide/Product_Level_Tracking#PLT_Via_Conversion_Pixel
const populateCustomTransactionProperties = (properties, customFieldMap) => {
  const customObject = {};
  const customPropertyPattern = '^\\s*p\\d+\\s*$';
  const regex = new RegExp(customPropertyPattern, 'i');
  const propertyMap = getHashFromArray(customFieldMap, 'from', 'to', false);
  Object.entries(propertyMap).forEach(([rudderProperty, awinProperty]) => {
    if (regex.test(awinProperty)) {
      const fieldValue = properties[rudderProperty];
      if (fieldValue) {
        customObject[awinProperty] = fieldValue;
      }
    }
  });
  return customObject;
};

module.exports = {
  getParams,
  trackProduct,
  buildProductPayloadString,
  populateCustomTransactionProperties,
};
