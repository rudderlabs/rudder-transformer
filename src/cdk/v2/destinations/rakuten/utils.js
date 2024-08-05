const { InstrumentationError, isDefinedAndNotNull } = require('@rudderstack/integrations-lib');
const {
  mappingConfig,
  ConfigCategories,
  productProperties,
  requiredProductProperties,
} = require('./config');
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
  // Validate the existence and non-emptiness of the 'products' array in 'properties'
  if (!Array.isArray(properties?.products) || properties.products.length === 0) {
    throw new InstrumentationError('Either properties.product is not an array or is empty');
  }

  const { products } = properties;
  const productList = {};

  // Iterate over product properties to construct the payload
  Object.keys(productProperties).forEach((property) => {
    const propertyKey = productProperties[property];

    // Extract values for the current property from the 'products' array
    const values = products.map((product) =>
      isDefinedAndNotNull(product?.[propertyKey]) ? product[propertyKey] : '',
    );

    // Validate if a required property is missing
    if (requiredProductProperties.includes(property) && values.includes('')) {
      throw new InstrumentationError(`${propertyKey} is a required field. Aborting`);
    }

    // Include property in the payload if values are non-empty
    if (values.some((element) => element !== '')) {
      productList[property] = values.join('|');
    }
  });

  // Map 'amountList' by evaluating 'amount' or deriving it from 'price' and 'quantity'
  const amountList = products.map((product) => {
    if (!product?.amount && !product?.price) {
      throw new InstrumentationError('Either amount or price is required for every product');
    }
    return product.amount * 100 || (product.quantity || 1) * 100 * product.price;
  });
  productList.amtlist = amountList.join('|');
  return productList;
};

module.exports = { constructProperties, constructLineItems };
