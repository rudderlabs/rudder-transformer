const get = require('get-value');
const { isAppleFamily } = require('../../util');
const { itemMapping } = require('./config');

/**
 * This function checks for missing required fields in destination Configs. Returns comma seperated list of error fields.
 * @param {*} Config
 * @returns {string} errorFields
 */
const validateConfigFields = (Config) => {
  const errorFields = [];
  const requiredFields = ['accountSID', 'apiKey', 'campaignId'];
  requiredFields.forEach((key) => {
    if (!Config[key]) {
      errorFields.push(key);
    }
  });
  return errorFields.join();
};

/**
 * This function returns the updated payload after doing mapping of device.id and device.advertisingId using OS values
 * @param {*} message
 * @param {*} payload
 * @returns
 */
const checkOsAndPopulateValues = (message, payload) => {
  const os = get(message, 'context.os.name');
  const updatedPayload = payload;
  if (os && isAppleFamily(os.toLowerCase())) {
    updatedPayload.AppleIfv = get(message, 'context.device.id');
    updatedPayload.AppleIfa = get(message, 'context.device.advertisingId');
  } else if (os && os.toLowerCase() === 'android') {
    updatedPayload.AndroidId = get(message, 'context.device.id');
    updatedPayload.GoogAId = get(message, 'context.device.advertisingId');
  }
  return updatedPayload;
};

/**
 * This function returns the final property name to which the value should be mapped.
 * @param {*} itemName
 * @param {*} index
 * @returns
 */
const getPropertyName = (itemName, index) => {
  const propertyName = `${itemName}${index}`;
  return propertyName;
};

/**
 * This function returns the property from which the value should be taken for mapping.
 * @param {*} productsMapping
 * @param {*} itemName
 * @returns
 */
const getProductsMapping = (productsMapping, itemName) => {
  let prop;
  if (productsMapping && Array.isArray(productsMapping)) {
    productsMapping.forEach((mapping) => {
      prop = mapping.to === itemName ? mapping.from : itemMapping[itemName];
    });
  }
  return prop;
};

/**
 * This function populates the product related properties using default mapping or products mapping configured
 * in RudderStack dashboard
 * @param {*} productsMapping
 * @param {*} properties
 * @returns
 */
const populateProductProperties = (productsMapping, properties) => {
  const { products, brand, sku, quantity, coupon, price, name, category } = properties;
  const productProperties = {};
  if (products && Array.isArray(products)) {
    products.forEach((item, index) => {
      productProperties[getPropertyName('ItemBrand', index + 1)] =
        item[getProductsMapping(productsMapping, 'ItemBrand')];
      productProperties[getPropertyName('ItemCategory', index + 1)] =
        item[getProductsMapping(productsMapping, 'ItemCategory')];
      productProperties[getPropertyName('ItemName', index + 1)] =
        item[getProductsMapping(productsMapping, 'ItemName')];
      productProperties[getPropertyName('ItemPrice', index + 1)] =
        item[getProductsMapping(productsMapping, 'ItemPrice')];
      productProperties[getPropertyName('ItemPromoCode', index + 1)] =
        item[getProductsMapping(productsMapping, 'ItemPromoCode')];
      productProperties[getPropertyName('ItemQuantity', index + 1)] =
        item[getProductsMapping(productsMapping, 'ItemQuantity')];
      productProperties[getPropertyName('ItemSku', index + 1)] =
        item[getProductsMapping(productsMapping, 'ItemSku')];
    });
  } else {
    const index = 1;
    productProperties[getPropertyName('ItemBrand', index)] = brand;
    productProperties[getPropertyName('ItemCategory', index)] = category;
    productProperties[getPropertyName('ItemName', index)] = name;
    productProperties[getPropertyName('ItemPrice', index)] = price;
    productProperties[getPropertyName('ItemPromoCode', index)] = coupon;
    productProperties[getPropertyName('ItemQuantity', index)] = quantity;
    productProperties[getPropertyName('ItemSku', index)] = sku;
  }
  return productProperties;
};

/**
 * This function populates additional mapping into the payload which is configured by the user in RudderStack dashboard
 * @param {*} message
 * @param {*} parameters
 * @returns
 */
const populateAdditionalParameters = (message, parameters) => {
  const additionalParameters = {};
  if (parameters && Array.isArray(parameters)) {
    parameters.forEach((mapping) => {
      additionalParameters[mapping.to] = get(message, mapping.from);
    });
  }
  return additionalParameters;
};

module.exports = {
  validateConfigFields,
  populateProductProperties,
  populateAdditionalParameters,
  checkOsAndPopulateValues,
};
