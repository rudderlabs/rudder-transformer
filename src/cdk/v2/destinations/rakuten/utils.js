const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { mappingConfig, ConfigCategories, productProperties } = require('./config');
const { constructPayload } = require('../../../../v0/util');

/**
 * This fucntion constructs payloads based upon mappingConfig for Track call type
 * @param {*} message
 * @returns
 */
const constructProperties = (message) => {
  const payload = constructPayload(message, mappingConfig[ConfigCategories.TRACK.name]);
  return payload;
};

/**
 * This fucntion build the item level list
 * @param {*} properties
 * @returns
 */
const constructLineItems = (properties) => {
  if (!Array.isArray(properties?.products) || properties?.products.length < 1) {
    throw new InstrumentationError('Either properties.product is not an array or is empty');
  }
  const productList = {};
  // mapping all the properties leaving amount as for amount we need to do some calculations
  Object.keys(productProperties).forEach((property) => {
    const propertyKey = productProperties[property];
    const values = properties.products.map((product) => product?.[propertyKey] || '');
    if (values.some((element) => element !== '')) {
      productList[property] = values.join('|');
    }
  });
  // mapping amount list
  const amountList = properties.products.map((product) => {
    if (!product.amount) {
      if (product?.price) {
        return (product.quantity || 1) * product.price * 100;
      }
      throw new InstrumentationError('Either amount or price is required for every product');
    }
    return product.amount * 100;
  });
  productList.amtlist = amountList.join('|');
  return productList;
};

module.exports = { constructProperties, constructLineItems };
