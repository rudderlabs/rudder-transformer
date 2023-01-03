const get = require("get-value");
const { isDefinedAndNotNull } = require("../../util");

const itemMapping = {
  ItemBrand: "brand",
  ItemCategory: "category",
  ItemName: "name",
  ItemPrice: "price",
  ItemPromoCode: "coupon",
  ItemQuantity: "quantity",
  ItemSku: "sku"
};

const checkConfigurationError = Config => {
  let emptyField;
  if (!Config.accountSID) {
    emptyField = "accountSID";
  } else if (!Config.apiKey) {
    emptyField = "apiKey";
  } else if (!Config.campaignId) {
    emptyField = "campaignId";
  }
  return isDefinedAndNotNull(emptyField) ? emptyField : false;
};

const getPropertyName = (itemName, index) => {
  const propertyName = `${itemName}${index}`;
  return propertyName;
};

const getProductsMapping = (productsMapping, itemName) => {
  let prop;
  if (productsMapping && Array.isArray(productsMapping)) {
    productsMapping.forEach(mapping => {
      prop = mapping.to === itemName ? mapping.from : itemMapping[itemName];
    });
  }
  return prop;
};

const populateProductProperties = (productsMapping, properties) => {
  const { products } = properties;
  const productProperties = {};
  if (products && Array.isArray(products)) {
    products.forEach((item, index) => {
      productProperties[getPropertyName("ItemBrand", index + 1)] =
        item[getProductsMapping(productsMapping, "ItemBrand")];
      productProperties[getPropertyName("ItemCategory", index + 1)] =
        item[getProductsMapping(productsMapping, "ItemCategory")];
      productProperties[getPropertyName("ItemName", index + 1)] =
        item[getProductsMapping(productsMapping, "ItemName")];
      productProperties[getPropertyName("ItemPrice", index + 1)] =
        item[getProductsMapping(productsMapping, "ItemPrice")];
      productProperties[getPropertyName("ItemPromoCode", index + 1)] =
        item[getProductsMapping(productsMapping, "ItemPromoCode")];
      productProperties[getPropertyName("ItemQuantity", index + 1)] =
        item[getProductsMapping(productsMapping, "ItemQuantity")];
      productProperties[getPropertyName("ItemSku", index + 1)] =
        item[getProductsMapping(productsMapping, "ItemSku")];
    });
  } else {
    const index = 1;
    productProperties[getPropertyName("ItemBrand", index)] = properties.brand;
    productProperties[getPropertyName("ItemCategory", index)] =
      properties.category;
    productProperties[getPropertyName("ItemName", index)] = properties.name;
    productProperties[getPropertyName("ItemPrice", index)] = properties.price;
    productProperties[getPropertyName("ItemPromoCode", index)] =
      properties.coupon;
    productProperties[getPropertyName("ItemQuantity", index)] =
      properties.quantity;
    productProperties[getPropertyName("ItemSku", index)] = properties.sku;
  }
  return productProperties;
};

const populateAdditionalParameters = (message, parameters) => {
  const additionalParameters = {};
  if (parameters && Array.isArray(parameters)) {
    parameters.forEach(mapping => {
      additionalParameters[mapping.to] = get(message, mapping.from);
    });
  }
  return additionalParameters;
};

module.exports = {
  checkConfigurationError,
  populateProductProperties,
  populateAdditionalParameters
};
