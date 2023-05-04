/* eslint-disable no-restricted-syntax */
const get = require('get-value');
const moment = require('moment');
const {
  constructPayload,
  isDefinedAndNotNull,
  getDestinationExternalID,
  isDefinedAndNotNullAndNotEmpty,
} = require('../../util');
const { InstrumentationError } = require('../../util/errorTypes');
const { mappingConfig, ConfigCategory } = require('./config');

/**
 * The keys should not contain any of the values inside the validationArray.
 * STEP 1: Storing keys in the array.
 * Checking for the non-valid characters inside the keys of properties.
 * @param {*} payload
 * @returns
 */
const getPropertiesKeyValidation = (payload) => {
  const validationArray = [`'`, `"`, `{`, `}`, `[`, `]`, ',', `,`];
  const keys = Object.keys(payload.properties);
  for (const key of keys) {
    for (const validationChar of validationArray) {
      if (key.includes(validationChar)) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Any of the ids inside the externalIdentifiers is being mapped inside the externalIdentifiers.
 * Customidentifiers provided in traits is being mapped in externalIdentifiers.
 * @param {*} message
 * @returns
 */
const getExternalIdentifiersMapping = (message) => {
  // Data Structure expected:
  // context.externalId: [ {type: clientUserId, id: __id}, {type: shopifyId, id: __id}, {type: klaviyoId, id: __id}]
  const externalIdentifiers = ['clientUserId', 'shopifyId', 'klaviyoId'];
  const externalId = get(message, 'context.externalId');
  const idObj = {};
  if (externalId && Array.isArray(externalId)) {
    externalId.forEach((id) => {
      const idType = id.type;
      const val = getDestinationExternalID(message, idType);
      if (val && externalIdentifiers.includes(idType)) {
        idObj[idType] = val;
      }
    });
  }
  // Data Structure expected:
  // traits : {
  //  customIdentifiers: [
  //    {
  //      "name": "string",
  //      "value": "string"
  //     }
  //    ]
  //  }
  const customIdentifiers =
    get(message, 'traits.customIdentifiers') || get(message, 'context.traits.customIdentifiers');
  if (customIdentifiers && Array.isArray(customIdentifiers)) {
    idObj.customIdentifiers = customIdentifiers;
  }
  if (isDefinedAndNotNullAndNotEmpty(idObj)) {
    return idObj;
  }
  return null;
};

/**
 * Validates timestamp of the payload if its within 12 hours
 * @param {*} timeStamp
 * @returns
 */
const validateTimestamp = (timeStamp) => {
  if (timeStamp) {
    const start = moment.unix(moment(timeStamp).format('X'));
    const current = moment.unix(moment().format('X'));
    // calculates past event in hours
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asHours());
    if (deltaDay > 12) {
      return false;
    }
  }
  return true;
};

const getDestinationItemProperties = (message, isItemsRequired) => {
  let items;
  const products = get(message, 'properties.products');
  if (!products) {
    items = [];
    const price = [];
    const pricing = {};
    const properties = get(message, 'properties');
    const props = constructPayload(properties, mappingConfig[ConfigCategory.ITEMS.name]);
    pricing.value = parseInt(properties.price, 10);
    pricing.currency = properties.currency;
    price.push(pricing);
    props.price = price;
    items.push(props);
    return items;
  }
  if ((!products && isItemsRequired) || (products && products.length === 0)) {
    throw new InstrumentationError(`Products is an required field for '${message.event}' event`);
  }
  if (products && Array.isArray(products)) {
    items = [];
    products.forEach((item) => {
      const element = constructPayload(item, mappingConfig[ConfigCategory.ITEMS.name]);
      const price = [];
      const pricing = { value: parseInt(item.price, 10), currency: item.currency };
      price.push(pricing);
      if (
        !isDefinedAndNotNull(element.productId) ||
        !isDefinedAndNotNull(element.productVariantId) ||
        !isDefinedAndNotNull(pricing.value)
      ) {
        throw new InstrumentationError('product_id and product_variant_id and price are required');
      }
      element.price = price;
      items.push(element);
    });
  } else if (products && !Array.isArray(products)) {
    throw new InstrumentationError('Invalid type. Expected Array of products');
  }
  return items;
};

module.exports = {
  getDestinationItemProperties,
  getExternalIdentifiersMapping,
  getPropertiesKeyValidation,
  validateTimestamp,
};
